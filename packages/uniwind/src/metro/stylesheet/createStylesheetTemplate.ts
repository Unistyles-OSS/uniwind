import { Declaration, DeclarationBlock, MediaQuery, Rule } from 'lightningcss'
import { Processor } from '../processor'
import { MediaQueryResolver, Platform, StylesTemplate } from '../types'
import { addMetaToStylesTemplate } from './addMetaToStylesTemplate'

export const createStylesheetTemplate = (rules: Array<Rule<Declaration, MediaQuery>>, currentPlatform: Platform) => {
    const styles: StylesTemplate = {}

    const parseClass = (className: string, declarations: DeclarationBlock<Declaration>, mq: MediaQueryResolver) => {
        declarations.declarations?.forEach(declaration => {
            styles[className] ??= { ...mq }

            const { property, value } = Processor.CSS.processDeclaration(declaration, className)

            styles[className][property] = value
        })
    }

    const parseMediaRec = (className: string, nestedRules: Array<Rule<Declaration, MediaQuery>>, mq: MediaQueryResolver) => {
        nestedRules.forEach(rule => {
            if (rule.type === 'media') {
                parseMediaRec(className, rule.value.rules, Processor.MQ.processMediaQueries(rule.value.query.mediaQueries))
            }

            if (rule.type === 'nested-declarations') {
                parseClass(className, rule.value.declarations, mq)
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
                    parseMediaRec(firstSelector.name, rule.value.rules, Processor.MQ.getInitialMediaQueryResolver())
                }

                if (rule.value.declarations) {
                    parseClass(firstSelector.name, rule.value.declarations, Processor.MQ.getInitialMediaQueryResolver())
                }
            })
        }
    })

    return addMetaToStylesTemplate(styles, currentPlatform)
}
