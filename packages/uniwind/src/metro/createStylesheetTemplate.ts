import { StyleTemplateAcc } from './types'
import { cssToRN, escapeDynamic, injectLocalVars, processCSSValue, processMediaQuery } from './utils'

export const createStylesheetTemplate = (classes: Record<string, any>) => {
    const template = Object.fromEntries(
        Object.entries(classes).map(([className, styles]) => {
            const parsedStyles = Object.entries(styles).reduce<StyleTemplateAcc>((stylesAcc, [styleKey, styleValue]) => {
                if (styleKey.startsWith('@media') && typeof styleValue === 'object' && styleValue !== null) {
                    const { maxWidth, minWidth, orientation } = processMediaQuery(styleKey)

                    Object.entries(styleValue).forEach(([mqStyleKey, mqStyleValue]) => {
                        if (typeof mqStyleValue !== 'string' && typeof mqStyleValue !== 'number') {
                            return
                        }

                        const processedMqValue = typeof mqStyleValue === 'string'
                            ? processCSSValue(mqStyleValue)
                            : mqStyleValue

                        stylesAcc.entries.push(...cssToRN(mqStyleKey, processedMqValue))
                    })

                    stylesAcc.maxWidth = maxWidth
                    stylesAcc.minWidth = minWidth
                    stylesAcc.orientation = orientation

                    return stylesAcc
                }

                if (typeof styleValue !== 'string' && typeof styleValue !== 'number') {
                    return stylesAcc
                }

                const processedValue = typeof styleValue === 'string'
                    ? processCSSValue(styleValue)
                    : styleValue

                stylesAcc.entries.push(...cssToRN(styleKey, processedValue))

                return stylesAcc
            }, { entries: [], maxWidth: Number.MAX_VALUE, minWidth: 0, orientation: null })

            return [
                className.replace('.', '').replace(/\\/g, ''),
                parsedStyles,
            ]
        }),
    )
    const processedTemplate = Object.fromEntries(
        Object.entries(template).map(([className, styles]) => {
            return [
                className,
                {
                    ...styles,
                    entries: injectLocalVars(styles.entries),
                },
            ]
        }),
    )
    const stringifiedTemplate = escapeDynamic(JSON.stringify(processedTemplate))

    return `globalThis.__uniwind__computeStylesheet = (rt, vars) => (${stringifiedTemplate})`
}
