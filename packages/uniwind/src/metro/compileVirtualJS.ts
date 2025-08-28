import { compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'
import fs from 'fs'
import { transform } from 'lightningcss'
import path from 'path'
import { createStylesheetTemplate } from './createStylesheetTemplate'
import { createVarsTemplate } from './createVarsTemplate'
import { Processor } from './processor'
import { Platform } from './types'

export const compileVirtualJS = async (input: string, scanner: Scanner, platform: Platform) => {
    const cssPath = path.join(process.cwd(), input)
    const css = fs.readFileSync(cssPath, 'utf8')
    const candidates = scanner.scan()
    const compiler = await compile(css, {
        base: cssPath,
        onDependency: () => void 0,
    })
    const tailwindCSS = compiler.build(candidates)
    const template = {}

    Processor.Shadow.registerShadowsFromCSS(tailwindCSS)

    transform({
        filename: 'tailwind.css',
        code: Buffer.from(tailwindCSS),
        visitor: {
            Rule: {
                'property': property => {
                    if (property.value.initialValue) {
                        Object.assign(template, {
                            [property.value.name]: Processor.CSS.processValue(property.value.initialValue, { propertyName: property.value.name }),
                        })
                    }
                },
                'layer-block': layer => {
                    switch (true) {
                        case layer.value.name?.includes('theme'): {
                            Object.assign(template, createVarsTemplate(layer.value.rules))

                            break
                        }
                        case layer.value.name?.includes('utilities'): {
                            Object.assign(template, createStylesheetTemplate(layer.value.rules, platform))

                            break
                        }
                        default:
                            break
                    }
                },
            },
        },
    })

    return ''
}
