import { StyleDependency } from '../types'
import { Processor } from './processor'
import { StyleTemplateAcc } from './types'
import { escapeDynamic, isDefined, pipe } from './utils'

export const createStylesheetTemplate = (classes: Record<string, any>, vars: Record<string, any>) => {
    const template = Object.fromEntries(
        Object.entries(classes).map(([className, styles]) => {
            const parsedStyles = Object.entries(styles).reduce<StyleTemplateAcc>((stylesAcc, [styleKey, styleValue]) => {
                const { orientation, colorScheme, rtl } = Processor.MQ.extractResolvers(className)

                stylesAcc.orientation = orientation
                stylesAcc.colorScheme = colorScheme
                stylesAcc.rtl = rtl

                const extractNestedStyles = (styleKey: string, styleValue: unknown) => {
                    if (typeof styleValue === 'object' && styleValue !== null) {
                        const { maxWidth, minWidth } = Processor.MQ.processMediaQuery(styleKey)
                        const [firstEntry] = Object.entries(styleValue)
                        const [mqStyleKey, mqStyleValue] = firstEntry ?? []

                        stylesAcc.maxWidth = String(maxWidth)
                        stylesAcc.minWidth = String(minWidth)

                        if (mqStyleKey === undefined) {
                            return
                        }

                        return extractNestedStyles(mqStyleKey, mqStyleValue)
                    }

                    stylesAcc.entries.push([styleKey, styleValue])
                }

                extractNestedStyles(styleKey, styleValue)

                return stylesAcc
            }, {
                entries: [],
                maxWidth: Number.MAX_VALUE,
                minWidth: 0,
                orientation: null,
                colorScheme: null,
                rtl: null,
            })

            return [
                className.replace('.', '').replace(/\\/g, ''),
                parsedStyles,
            ]
        }),
    )
    const processedTemplateEntries = Object.entries(template).map(([className, styles]) => {
        const stylesUsingVariables: Record<string, string> = {}
        const inlineVariables: Array<[string, unknown]> = []

        const processedEntries = pipe(styles.entries)(
            entries =>
                entries.map(([key, value]) => {
                    if (typeof value !== 'string' && typeof value !== 'number') {
                        return null
                    }

                    const processedValue = typeof value === 'string'
                        ? Processor.CSS.processCSSValue(value, key)
                        : value

                    return [key, processedValue] as [string, unknown]
                }),
            entries => entries.filter(isDefined),
            entries => entries.flatMap(([key, value]) => Processor.RN.cssToRN(key, value)),
            entries =>
                entries.filter(([key, value]) => {
                    if (Processor.Var.isVarName(key)) {
                        inlineVariables.push([key, value])

                        return false
                    }

                    const stringifiedValue = JSON.stringify(value)

                    if (stringifiedValue.includes('vars[')) {
                        stylesUsingVariables[key] = className
                    }

                    return true
                }),
        )
        const getDependencies = () => {
            const dependencies = [] as Array<StyleDependency>
            const stringifiedEntries = JSON.stringify(processedEntries)

            if (styles.orientation !== null) {
                dependencies.push(StyleDependency.Orientation)
            }

            if (Number(styles.minWidth) !== 0 || Number(styles.maxWidth) !== Number.MAX_VALUE) {
                dependencies.push(StyleDependency.Dimensions)
            }

            if (styles.colorScheme !== null) {
                dependencies.push(StyleDependency.ColorScheme)
            }

            const varsRegex = /this\.vars\[`([^`]+)`\]/g
            const varsMatches = stringifiedEntries.match(varsRegex)

            if (varsMatches) {
                varsMatches.forEach(match => {
                    // Remove `this.vars[` and `]`
                    const varName = match.slice(11, -2)

                    if (varName in vars) {
                        const varValue = vars[varName]

                        if (typeof varValue === 'string' && varValue.includes('rt.rem') && !dependencies.includes(StyleDependency.FontScale)) {
                            dependencies.push(StyleDependency.FontScale)
                        }
                    }
                })
            }

            if (styles.rtl !== null) {
                dependencies.push(StyleDependency.Rtl)
            }

            // TODO: Insets dependency

            return dependencies
        }

        return [
            className,
            {
                ...styles,
                entries: processedEntries,
                inlineVariables,
                stylesUsingVariables,
                dependencies: getDependencies(),
            },
        ] as const
    })

    return processedTemplateEntries.reduce((acc, [className, style]) => {
        const stringifiedValue = Object.entries(style).reduce((acc, [key, value]) => {
            if (key === 'inlineVariables' && Array.isArray(value)) {
                const stringifiedInlineVariable = (value as Array<[string, unknown]>)
                    .map(([varName, varValue]) => `["${varName}", () => (${escapeDynamic(JSON.stringify(varValue))})]`)
                    .join(',')

                return `${acc}"${key}":[${stringifiedInlineVariable}],`
            }

            return `${acc}"${key}":${escapeDynamic(JSON.stringify(value))},`
        }, '')
        const isComputed = JSON.stringify(style).includes('vars[')

        if (isComputed) {
            return `${acc}get "${className}"() { return { ${stringifiedValue} } },`
        }

        return `${acc}"${className}":{ ${stringifiedValue} },`
    }, '')
}
