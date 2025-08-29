import { Logger } from '../logger'

type Stylesheet = Record<string, any>

const isJSExpression = (value: string) =>
    [
        value.includes('this'),
        value.includes('rt.'),
        value.includes('() =>'),
        /\s([-+/*])\s/.test(value),
    ].some(Boolean)

const toJSExpression = (value: string): string => {
    if (!isJSExpression(value)) {
        return value
    }

    return value
        .replace(/"(?:[^"\\]|\\.)*"/g, match => {
            if (isJSExpression(match)) {
                // Not a string, remove " " to make it a valid JS expression
                return toJSExpression(match.slice(1, -1))
            }

            return toJSExpression(match)
        })
        .replace(/\\"/g, '"')
}

export const serializeStylesheet = (stylesheet: Stylesheet) => {
    const hotReloadFN = 'globalThis.__uniwind__hot_reload?.()'
    const currentColor = `get currentColor() { return rt.colorScheme === 'dark' ? '#ffffff' : '#000000' },`

    const serializedStylesheet = Object.entries(stylesheet).map(([key, value]) => {
        const stringifiedValue = toJSExpression(JSON.stringify(value))

        if (key === 'shadow-2xl') {
            console.log(JSON.stringify(value))
        }

        if (stringifiedValue.includes('this')) {
            return `get "${key}"() { return ${stringifiedValue} }`
        }

        return `"${key}": ${stringifiedValue}`
    }).join(',\n')

    const js = `globalThis.__uniwind__computeStylesheet = rt => ({ ${currentColor} ${serializedStylesheet} });${hotReloadFN}`

    try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
        new Function(`function validateJS() { ${js} }`)
    } catch {
        Logger.error('Failed to create virtual js')

        return ''
    }

    return js
}
