import { Processor } from './processor'
import { StyleTemplateAcc } from './types'
import { escapeDynamic, isDefined, pipe } from './utils'

export const createStylesheetTemplate = (classes: Record<string, any>) => {
    const template = Object.fromEntries(
        Object.entries(classes).map(([className, styles]) => {
            const parsedStyles = Object.entries(styles).reduce<StyleTemplateAcc>((stylesAcc, [styleKey, styleValue]) => {
                if (styleKey.startsWith('@media') && typeof styleValue === 'object' && styleValue !== null) {
                    const { maxWidth, minWidth, orientation } = Processor.MQ.processMediaQuery(styleKey)

                    Object.entries(styleValue).forEach(([mqStyleKey, mqStyleValue]) => {
                        stylesAcc.entries.push([mqStyleKey, mqStyleValue])
                    })

                    stylesAcc.maxWidth = String(maxWidth)
                    stylesAcc.minWidth = String(minWidth)
                    stylesAcc.orientation = orientation

                    return stylesAcc
                }

                stylesAcc.entries.push([styleKey, styleValue])

                return stylesAcc
            }, { entries: [], maxWidth: Number.MAX_VALUE, minWidth: 0, orientation: null })

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

        return [
            className,
            {
                ...styles,
                entries: processedEntries,
                inlineVariables,
                stylesUsingVariables,
            },
        ] as const
    })

    return processedTemplateEntries.reduce((acc, [className, style]) => {
        const stringifiedValue = Object.entries(style).reduce((acc, [key, value]) => {
            if (key === 'inlineVariables' && Array.isArray(value)) {
                const stringifiedInlineVariable = value.map(([varName, varValue]) =>
                    `["${varName}", () => (${escapeDynamic(JSON.stringify(varValue))})]`
                ).join(',')

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
