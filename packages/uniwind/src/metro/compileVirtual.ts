import { compile } from '@tailwindcss/node'
import fs from 'fs'
import { MediaQuery, transform } from 'lightningcss'
import path from 'path'
import { Processor } from './processor'
import { addMetaToStylesTemplate, serializeStylesheet } from './stylesheet'
import { Platform } from './types'

export const compileVirtual = async (input: string, getCandidates: () => Array<string>, platform: Platform) => {
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

    const stylesheets = {} as Record<string, any>
    const vars = {} as Record<string, any>
    const mediaQueries = [] as Array<MediaQuery>

    transform({
        filename: 'tailwind.css',
        code: Buffer.from(tailwindCSS),
        visitor: {
            Rule: rule => {
                if (rule.type === 'media') {
                    mediaQueries.push(...rule.value.query.mediaQueries)

                    return
                }

                if (rule.type === 'property') {
                    if (!rule.value.initialValue) {
                        return
                    }

                    vars[rule.value.name] = Processor.CSS.processValue(rule.value.initialValue, { propertyName: rule.value.name })
                }

                if (rule.type === 'layer-block') {
                    rule.value.rules.forEach(rule => {
                        if (rule.type !== 'style') {
                            return
                        }

                        rule.value.declarations?.declarations?.forEach(declaration => {
                            if (declaration.property === 'custom' && declaration.value.name.startsWith('--')) {
                                vars[declaration.value.name] = Processor.CSS.processValue(declaration.value.value, {
                                    propertyName: declaration.value.name,
                                })
                            }
                        })
                    })
                }

                if (rule.type === 'style') {
                    rule.value.selectors.forEach(selectorTokens => {
                        const [selectorToken] = selectorTokens

                        if (!selectorToken || selectorToken.type !== 'class') {
                            return
                        }

                        const className = selectorToken.name
                        const styles: Record<string, any> = {}

                        rule.value.declarations.declarations.forEach(declaration => {
                            const { property, value } = Processor.CSS.processDeclaration(declaration, className)

                            styles[property] = value
                        })

                        const mq = Processor.MQ.processMediaQueries(mediaQueries)

                        Object.assign(styles, mq)
                        stylesheets[className] ??= []
                        stylesheets[className].push(styles)
                    })
                }
            },
            RuleExit: rule => {
                if (rule.type === 'media') {
                    mediaQueries.splice(mediaQueries.length * -1)
                }
            },
        },
    })

    return serializeStylesheet({ ...vars, ...addMetaToStylesTemplate(stylesheets, platform) })
}
