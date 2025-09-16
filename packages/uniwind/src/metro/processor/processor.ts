import { Declaration, MediaQuery, Rule, transform } from 'lightningcss'
import { Color } from './color'
import { CSS } from './css'
import { Functions } from './functions'
import { MQ } from './mq'
import { RN } from './rn'
import { Units } from './units'
import { Var } from './var'

export class ProcessorBuilder {
    stylesheets = {} as Record<string, Array<any>>
    vars = {} as Record<string, any>
    CSS = new CSS(this)
    RN = new RN(this)
    Var = new Var(this)
    MQ = new MQ(this)
    Color = new Color(this)
    Units = new Units(this)
    Functions = new Functions(this)

    private declarationConfig = this.getDeclarationConfig()

    transform(css: string) {
        transform({
            filename: 'tailwind.css',
            code: Buffer.from(css),
            visitor: {
                StyleSheet: styleSheet =>
                    styleSheet.rules.forEach(rule => {
                        this.declarationConfig = this.getDeclarationConfig()
                        this.parseRuleRec(rule)
                    }),
            },
        })
    }

    private getDeclarationConfig() {
        return ({
            className: null as string | null,
            rtl: null as boolean | null,
            mediaQueries: [] as Array<MediaQuery>,
            root: false,
        })
    }

    private addDeclaration(declaration: Declaration, important = false) {
        const isVar = this.declarationConfig.root || this.declarationConfig.className === null
        const style = isVar
            ? this.vars
            : this.stylesheets[this.declarationConfig.className!]?.at(-1)
        const mq = this.MQ.processMediaQueries(this.declarationConfig.mediaQueries)

        if (!isVar) {
            Object.assign(style, mq)
            style.importantProperties ??= []
            style.rtl = this.declarationConfig.rtl
        }

        if (declaration.property === 'unparsed') {
            style[declaration.value.propertyId.property] = this.CSS.processValue(declaration.value.value)

            if (!isVar && important) {
                style.importantProperties.push(declaration.value.propertyId.property)
            }

            return
        }

        if (declaration.property === 'custom') {
            style[declaration.value.name] = this.CSS.processValue(declaration.value.value)

            if (!isVar && important) {
                style.importantProperties.push(declaration.value.name)
            }

            return
        }

        style[declaration.property] = this.CSS.processValue(declaration.value)

        if (!isVar && important) {
            style.importantProperties.push(declaration.property)
        }
    }

    private parseRuleRec(rule: Rule<Declaration, MediaQuery>) {
        if (rule.type === 'style') {
            rule.value.selectors.forEach(selector => {
                const [maybeClassNameSelector] = selector
                const className = maybeClassNameSelector?.type === 'class' ? maybeClassNameSelector.name : undefined

                if (className !== undefined) {
                    this.stylesheets[className] ??= []
                    this.stylesheets[className].push({})
                    this.declarationConfig.className = className

                    rule.value.declarations?.declarations?.forEach(declaration => this.addDeclaration(declaration))
                    rule.value.declarations?.importantDeclarations?.forEach(declaration => this.addDeclaration(declaration, true))
                    rule.value.rules?.forEach(rule => this.parseRuleRec(rule))

                    return
                }

                let rtl = null as boolean | null

                selector.forEach(selector => {
                    if (selector.type === 'pseudo-class' && selector.kind === 'where') {
                        selector.selectors.forEach(selector => {
                            selector.forEach(selector => {
                                if (selector.type === 'pseudo-class' && selector.kind === 'dir') {
                                    rtl = selector.direction === 'rtl'
                                }
                            })
                        })
                    }
                })

                if (rtl !== null) {
                    this.declarationConfig.rtl = rtl

                    rule.value.declarations?.declarations?.forEach(declaration => this.addDeclaration(declaration))
                    rule.value.declarations?.importantDeclarations?.forEach(declaration => this.addDeclaration(declaration, true))
                    rule.value.rules?.forEach(rule => this.parseRuleRec(rule))

                    return
                }

                selector.forEach(selectorToken => {
                    if (selectorToken.type === 'pseudo-class' && selectorToken.kind === 'root') {
                        this.declarationConfig.root = true

                        rule.value.declarations?.declarations?.forEach(declaration => this.addDeclaration(declaration))
                        rule.value.declarations?.importantDeclarations?.forEach(declaration => this.addDeclaration(declaration, true))
                        rule.value.rules?.forEach(rule => this.parseRuleRec(rule))
                    }
                })
            })

            return
        }

        if (rule.type === 'media') {
            const { mediaQueries } = rule.value.query

            this.declarationConfig.mediaQueries.push(...mediaQueries)
            rule.value.rules.forEach(rule => {
                this.parseRuleRec(rule)
                this.declarationConfig = this.getDeclarationConfig()
            })

            return
        }

        if (rule.type === 'layer-block') {
            rule.value.rules.forEach(rule => this.parseRuleRec(rule))

            return
        }

        if (rule.type === 'nested-declarations') {
            rule.value.declarations.declarations?.forEach(declaration => this.addDeclaration(declaration))
            rule.value.declarations.importantDeclarations?.forEach(declaration => this.addDeclaration(declaration, true))

            return
        }

        if (rule.type === 'property' && rule.value.initialValue) {
            this.vars[rule.value.name] = this.CSS.processValue(rule.value.initialValue)
        }
    }
}
