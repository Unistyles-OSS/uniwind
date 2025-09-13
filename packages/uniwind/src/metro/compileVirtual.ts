import { compile } from '@tailwindcss/node'
import fs from 'fs'
import { MediaQuery, transform } from 'lightningcss'
import path from 'path'
import { ProcessorBuilder } from './processor'
import { addMetaToStylesTemplate, serializeStylesheet } from './stylesheet'
import { Platform } from './types'

export const compileVirtual = async (input: string, getCandidates: () => Array<string>, platform: Platform) => {
    const Processor = new ProcessorBuilder()
    const cssPath = path.join(process.cwd(), input)
    const css = fs.readFileSync(cssPath, 'utf8')
    const compiler = await compile(css, {
        base: cssPath,
        onDependency: () => void 0,
    })
    const tailwindCSS = compiler.build(getCandidates())

    if (platform === Platform.Web) {
        return tailwindCSS
    }

    let newStyle = false
    let isRTL = null as boolean | null
    const mediaQueries = [] as Array<MediaQuery>
    const currentClassNames = new Set<string>()

    transform({
        filename: 'tailwind.css',
        code: Buffer.from(tailwindCSS),
        visitor: {
            Declaration: declaration => {
                if (currentClassNames.size === 0) {
                    return
                }

                if (newStyle) {
                    newStyle = false

                    currentClassNames.forEach(className => {
                        Processor.stylesheets[className] ??= []
                        Processor.stylesheets[className].push({})
                    })
                }

                const mq = Processor.MQ.processMediaQueries(mediaQueries)

                mq.rtl = isRTL

                currentClassNames.forEach(className => {
                    const style = Processor.stylesheets[className]?.at(-1)
                    const { property, value } = Processor.CSS.processDeclaration(declaration, className)

                    style[property] = value
                    Object.assign(style, mq)
                })
            },
            Rule: rule => {
                if (rule.type === 'media') {
                    mediaQueries.push(...rule.value.query.mediaQueries)

                    return
                }

                if (rule.type === 'property') {
                    if (!rule.value.initialValue) {
                        return
                    }

                    Processor.vars[rule.value.name] = Processor.CSS.processValue(rule.value.initialValue, { propertyName: rule.value.name })
                }

                if (rule.type === 'layer-block') {
                    rule.value.rules.forEach(rule => {
                        if (rule.type !== 'style') {
                            return
                        }

                        rule.value.declarations?.declarations?.forEach(declaration => {
                            if (
                                declaration.property === 'custom'
                                && declaration.value.name.startsWith('--')
                                && rule.value.selectors.some(selector =>
                                    selector.some(selectorToken => selectorToken.type === 'pseudo-class' && selectorToken.kind === 'root')
                                )
                            ) {
                                Processor.vars[declaration.value.name] = Processor.CSS.processValue(declaration.value.value, {
                                    propertyName: declaration.value.name,
                                })
                            }
                        })
                    })
                }

                if (rule.type === 'style') {
                    rule.value.selectors.forEach(selectorTokens => {
                        selectorTokens.forEach(token => {
                            if (token.type === 'pseudo-class' && token.kind === 'where') {
                                token.selectors.flat().forEach(whereToken => {
                                    if (whereToken.type === 'pseudo-class' && whereToken.kind === 'dir') {
                                        isRTL = whereToken.direction === 'rtl'
                                    }
                                })
                            }
                        })

                        const [selectorToken] = selectorTokens

                        if (!selectorToken || selectorToken.type !== 'class') {
                            return
                        }

                        currentClassNames.add(selectorToken.name)
                    })
                }
            },
            RuleExit: rule => {
                if (rule.type === 'media') {
                    mediaQueries.splice(rule.value.query.mediaQueries.length * -1)
                }

                if (rule.type === 'style') {
                    rule.value.selectors.forEach(selectorTokens => {
                        const [selectorToken] = selectorTokens

                        if (!selectorToken || selectorToken.type !== 'class') {
                            return
                        }

                        currentClassNames.delete(selectorToken.name)
                    })

                    if (currentClassNames.size === 0) {
                        newStyle = true
                        isRTL = null
                    }
                }
            },
        },
    })

    return serializeStylesheet({ ...Processor.vars, ...addMetaToStylesTemplate(Processor, platform) })
}
