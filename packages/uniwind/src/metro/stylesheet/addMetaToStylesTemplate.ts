import { StyleDependency } from '../../types'
import { ProcessorBuilder } from '../processor'
import { Platform, StyleSheetTemplate } from '../types'
import { isDefined, toCamelCase } from '../utils'

export const addMetaToStylesTemplate = (Processor: ProcessorBuilder, currentPlatform: Platform) => {
    const stylesheetsEntries = Object.entries(Processor.stylesheets as StyleSheetTemplate)
        .map(([className, stylesPerMediaQuery]) => {
            const styles = stylesPerMediaQuery.map((style, index) => {
                const {
                    platform,
                    rtl,
                    colorScheme,
                    orientation,
                    minWidth,
                    maxWidth,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    important,
                    importantProperties,
                    ...rest
                } = style

                const entries = Object.entries(rest)
                    .flatMap(([property, value]) => Processor.RN.cssToRN(property, value))

                if (platform && platform !== Platform.Native && platform !== currentPlatform) {
                    return null
                }

                const stylesUsingVariables: Record<string, string> = {}
                const inlineVariables: Array<[string, string]> = []
                const dependencies: Array<StyleDependency> = []

                const filteredEntries = entries
                    .filter(([property, value]) => {
                        if (property.startsWith('--')) {
                            inlineVariables.push([property, `function() { return ${typeof value === 'object' ? JSON.stringify(value) : value} }`])

                            return false
                        }

                        const stringifiedValue = JSON.stringify(value)

                        if (stringifiedValue.includes('this')) {
                            stylesUsingVariables[property] = className
                        }

                        return true
                    })

                const stringifiedEntries = JSON.stringify(filteredEntries)

                if (colorScheme !== null) {
                    dependencies.push(StyleDependency.ColorScheme)
                }

                if (orientation !== null) {
                    dependencies.push(StyleDependency.Orientation)
                }

                if (rtl !== null) {
                    dependencies.push(StyleDependency.Rtl)
                }

                if (
                    Number(minWidth) !== 0
                    || Number(maxWidth) !== Number.MAX_VALUE
                    || stringifiedEntries.includes('rt.screen')
                ) {
                    dependencies.push(StyleDependency.Dimensions)
                }

                if (stringifiedEntries.includes('rt.insets')) {
                    dependencies.push(StyleDependency.Insets)
                }

                if (stringifiedEntries.includes('rt.rem')) {
                    dependencies.push(StyleDependency.FontScale)
                }

                return {
                    entries: filteredEntries,
                    minWidth,
                    maxWidth,
                    colorScheme,
                    orientation,
                    rtl,
                    native: platform !== null,
                    stylesUsingVariables,
                    inlineVariables,
                    dependencies,
                    index,
                    className,
                    importantProperties: importantProperties?.map(property => property.startsWith('--') ? property : toCamelCase) ?? [],
                }
            })

            return [
                className,
                styles,
            ] as const
        })
        .filter(isDefined)
    const stylesheets = Object.fromEntries(stylesheetsEntries) as Record<string, any>

    return stylesheets
}
