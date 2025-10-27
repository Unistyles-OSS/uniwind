import fs from 'fs'
import { transform } from 'lightningcss'
import { Logger } from '../metro/logger'

export const generateCSSForThemes = (themes: Array<string>, input: string) => {
    // css generation
    const themesVariables = Object.fromEntries(themes.map(theme => [theme, new Set<string>()]))
    const css = fs.readFileSync(input, 'utf-8')
    transform({
        code: Buffer.from(css),
        filename: 'uniwind.css',
        visitor: {
            Rule: rule => {
                if (rule.type === 'unknown' && rule.value.name === 'variant') {
                    const [firstPrelude] = rule.value.prelude

                    if (
                        !firstPrelude
                        || firstPrelude.type !== 'token'
                        || firstPrelude.value.type !== 'ident'
                        || !themes.includes(firstPrelude.value.value)
                    ) {
                        return
                    }

                    const theme = firstPrelude.value.value

                    rule.value.block?.forEach(block => {
                        if (block.type === 'dashed-ident') {
                            themesVariables[theme]?.add(block.value)
                        }
                    })
                }
            },
        },
    })

    // Check if all themes have the same variables
    let hasErrors = false as boolean
    const hasVariables = Object.values(themesVariables).some(variables => variables.size > 0)

    Object.values(themesVariables).forEach(variables => {
        Object.entries(themesVariables).forEach(([checkedTheme, checkedVariables]) => {
            variables.forEach(variable => {
                if (!checkedVariables.has(variable)) {
                    Logger.warn(`Theme ${checkedTheme} is missing variable ${variable}`)
                    hasErrors = true
                }
            })
        })
    })

    if (hasErrors) {
        Logger.warn('All themes must have the same variables')
    }

    const variablesCSS = hasVariables
        ? [
            '',
            '@theme {',
            ...Array.from(Object.values(themesVariables).at(0) ?? []).map(variable => `    ${variable}: unset;`),
            '}',
        ]
        : []
    const uniwindCSS = [
        ...themes.map(theme => `@custom-variant ${theme} (&:where(.${theme}, .${theme} *));`),
        ...variablesCSS,
    ].join('\n')

    return uniwindCSS
}
