import { compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'
import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import postcssJS from 'postcss-js'
import { createStylesheetTemplate } from './createStylesheetTemplate'
import { createVarsTemplate } from './createVarsTemplate'

export const compileVirtualJS = async (input: string, scanner: Scanner) => {
    const cssPath = path.join(process.cwd(), input)
    const css = fs.readFileSync(cssPath, 'utf8')
    const candidates = scanner.scan()
    const compiler = await compile(css, {
        base: cssPath,
        onDependency: () => void 0,
    })
    const result = compiler.build(candidates)
    const root = postcss.parse(result)
    const cssTree = postcssJS.objectify(root as unknown as Parameters<typeof postcssJS.objectify>[0])
    const theme: Record<string, any> = cssTree['@layer theme'][':root, :host']
    const properties = Object.fromEntries(
        Object.entries(cssTree)
            .filter(([key]) => key.startsWith('@property'))
            .map(([key, value]) => {
                const numericValue = Number(value.initialValue)

                return [key.slice(10), !isNaN(numericValue) ? numericValue : value.initialValue]
            }),
    )
    const varsTemplate = createVarsTemplate({ ...theme, ...properties })
    const classes: Record<string, any> = cssTree['@layer utilities']
    const stylesheetTemplate = createStylesheetTemplate(classes)
    const hotReloadFN = 'globalThis.__uniwind__hot_reload?.()'
    const currentColor = `get currentColor() { return rt.colorScheme === 'dark' ? '#ffffff' : '#000000' },`

    return `globalThis.__uniwind__computeStylesheet = rt => ({ vars: { ${currentColor} ${varsTemplate} }, ${stylesheetTemplate} });${hotReloadFN}`
}
