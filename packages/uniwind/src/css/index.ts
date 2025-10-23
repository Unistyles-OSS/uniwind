import fs from 'fs'
import path from 'path'
import { generateCSSForInsets } from './insets'
import { generateCSSForThemes } from './themes'
import { generateCSSForVariants } from './variants'

export const buildCSS = (themes: Array<string>, input: string) => {
    const variants = generateCSSForVariants()
    const insets = generateCSSForInsets()
    const themesCSS = generateCSSForThemes(themes, input)
    const cssFile = path.join(__dirname, '../../uniwind.css')
    const oldCSSFile = fs.existsSync(cssFile)
        ? fs.readFileSync(cssFile, 'utf-8')
        : ''

    if (oldCSSFile === cssFile) {
        return
    }

    fs.writeFileSync(
        cssFile,
        [
            variants,
            insets,
            themesCSS,
        ].join('\n'),
    )
}
