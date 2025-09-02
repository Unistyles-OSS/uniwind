import { compile } from '@tailwindcss/node'
import fs from 'fs'
import { transform } from 'lightningcss'
import path from 'path'
import { Processor } from './processor'
import { createStylesheetTemplate, createVarsTemplate, serializeStylesheet } from './stylesheet'
import { Platform } from './types'

export const compileVirtualJS = async (input: string, getCandidates: () => Array<string>, platform: Platform) => {
    const cssPath = path.join(process.cwd(), input)
    const css = fs.readFileSync(cssPath, 'utf8')
    const compiler = await compile(css, {
        base: cssPath,
        onDependency: () => void 0,
    })
    const tailwindCSS = compiler.build(getCandidates())
    const stylesheets = {}

    transform({
        filename: 'tailwind.css',
        code: Buffer.from(tailwindCSS),
        visitor: {
            Rule: {
                'property': property => {
                    if (property.value.initialValue) {
                        Object.assign(stylesheets, {
                            [property.value.name]: Processor.CSS.processValue(property.value.initialValue, { propertyName: property.value.name }),
                        })
                    }
                },
                'layer-block': layer => {
                    switch (true) {
                        case layer.value.name?.includes('theme'): {
                            Object.assign(stylesheets, createVarsTemplate(layer.value.rules))

                            break
                        }
                        case layer.value.name?.includes('utilities'): {
                            Object.assign(stylesheets, createStylesheetTemplate(layer.value.rules, platform))

                            break
                        }
                        default:
                            break
                    }
                },
            },
        },
    })

    return serializeStylesheet(stylesheets)
}
