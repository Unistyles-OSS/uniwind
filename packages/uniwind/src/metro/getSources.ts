import { SourceEntry } from '@tailwindcss/oxide'
import { transform } from 'lightningcss'
import path from 'path'

export const getSources = (css: string, basePath: string): Array<SourceEntry> => {
    const sources = [process.cwd()]

    transform({
        code: Buffer.from(css),
        filename: 'uniwind.css',
        visitor: {
            Rule: rule => {
                if (rule.type === 'unknown' && rule.value.name === 'source') {
                    rule.value.prelude.forEach(prelude => {
                        if (prelude.type === 'token' && prelude.value.type === 'string') {
                            sources.push(path.join(basePath, prelude.value.value))
                        }
                    })
                }
            },
        },
    })

    return sources.map(source => ({
        negated: false,
        pattern: '**/*',
        base: source,
    }))
}
