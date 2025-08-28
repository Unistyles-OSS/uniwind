import { Processor } from './processor'
import { Platform, StylesTemplate } from './types'
import { isDefined } from './utils'

export const addMetaToStylesTemplate = (styles: StylesTemplate, currentPlatform: Platform) => {
    const stylesheetsEntries = Object.entries(styles)
        .map(([className, styles]) => {
            const entries = Object.entries(styles)
                .filter(([property]) => {
                    return !['minWidth', 'maxWidth'].includes(property)
                })
                .flatMap(([property, value]) => Processor.RN.cssToRN(property, value))

            const { colorScheme, orientation, platform, rtl } = Processor.MQ.extractResolvers(className)

            if (platform && platform !== Platform.Native && platform !== currentPlatform) {
                return null
            }

            const stylesUsingVariables: Record<string, string> = {}
            const inlineVariables: Array<[string, unknown]> = []

            const filteredEntries = entries
                .filter(([property, value]) => {
                    if (property.startsWith('--')) {
                        inlineVariables.push([property, value])

                        return false
                    }

                    const stringifiedValue = JSON.stringify(value)

                    if (stringifiedValue.includes('this')) {
                        stylesUsingVariables[className] = property
                    }

                    return true
                })

            return [
                className,
                {
                    entries: filteredEntries,
                    minWidth: styles.minWidth,
                    maxWidth: styles.maxWidth,
                    colorScheme,
                    orientation,
                    rtl,
                    native: platform !== null,
                    stylesUsingVariables,
                    inlineVariables,
                },
            ] as const
        })
        .filter(isDefined)
    const stylesheets = Object.fromEntries(stylesheetsEntries) as Record<string, any>

    return stylesheets
}
