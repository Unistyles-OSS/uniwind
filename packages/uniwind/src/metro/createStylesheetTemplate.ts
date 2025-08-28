import { Declaration, DeclarationBlock, MediaQuery, Rule } from 'lightningcss'
import { Processor } from './processor'

export const createStylesheetTemplate = (rules: Array<Rule<Declaration, MediaQuery>>) => {
    const styles: Record<string, Record<string, unknown>> = {}

    const parseClass = (className: string, declarations: DeclarationBlock<Declaration>) => {
        declarations.declarations?.forEach(declaration => {
            styles[className] ??= {}

            const { property, value } = Processor.CSS.processDeclaration(declaration, className)

            styles[className][property] = value
        })
    }

    const parseMediaRec = (className: string, nestedRules: Array<Rule<Declaration, MediaQuery>>) => {
        nestedRules.forEach(rule => {
            if (rule.type === 'media') {
                parseMediaRec(className, rule.value.rules)
            }

            if (rule.type === 'nested-declarations') {
                parseClass(className, rule.value.declarations)
            }
        })
    }

    rules.forEach(rule => {
        if (rule.type === 'style') {
            rule.value.selectors.forEach(selector => {
                const [firstSelector, ...rest] = selector

                // TODO: Remove this check if not applied, used only for debugging
                if (rest.length > 0) {
                    throw new Error('More than one selector in createStylesheetTemplate')
                }

                if (firstSelector?.type !== 'class') {
                    return
                }

                if (rule.value.rules) {
                    parseMediaRec(firstSelector.name, rule.value.rules)
                }

                if (rule.value.declarations) {
                    parseClass(firstSelector.name, rule.value.declarations)
                }
            })
        }
    })

    const stylesheetsEntries = Object.entries(styles).map(([className, styles]) => {
        const entries = Object.entries(styles).map(([property, value]) => Processor.RN.cssToRN(property, value))

        return [
            className,
            {
                entries,
            },
        ]
    })
    const stylesheets = Object.fromEntries(stylesheetsEntries) as Record<string, any>

    return stylesheets
}

// export type Style = {
//     entries: Array<[string, unknown]>
//     minWidth: number
//     maxWidth: number
//     stylesUsingVariables: Record<string, string>
//     inlineVariables: Array<[string, () => unknown]>
//     orientation: Orientation | null
//     colorScheme: ColorScheme | null
//     rtl: boolean | null
//     dependencies: Array<StyleDependency>
//     native: boolean
// }
