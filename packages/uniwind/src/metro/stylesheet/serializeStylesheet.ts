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
        return `"${value.trim()}"`
    }

    if (!value.includes('() =>')) {
        return value
            .split(' ')
            .map(token => {
                if (isJSExpression(token) || /[-+/*?]/.test(token) || !isNaN(Number(token))) {
                    return token
                }

                return `"${token}"`
            })
            .join(' ')
            .replace(/" "/g, ' ')
    }

    const [, after] = value.split('() =>')

    if (after === undefined) {
        return value
    }

    try {
        return `() => ${serialize(JSON.parse(after))}`
    } catch {
        return `() => ${serialize(after)}`
    }
}

const serialize = (value: any): string => {
    switch (typeof value) {
        case 'object': {
            if (Array.isArray(value)) {
                return [
                    '[',
                    value.map(serialize).join(', '),
                    ']',
                ].join('')
            }

            if (value === null) {
                return 'null'
            }

            return [
                '({',
                Object.entries(value).map(([key, value]) => {
                    return `"${key}": ${serialize(value)}`
                }).join(', '),
                '})',
            ].join('')
        }
        case 'string':
            return toJSExpression(value)
        default:
            return String(value)
    }
}

export const serializeStylesheet = (stylesheet: Stylesheet) => {
    const hotReloadFN = 'globalThis.__uniwind__hot_reload?.()'
    const currentColor = `get currentColor() { return rt.colorScheme === 'dark' ? '#ffffff' : '#000000' },`

    const serializedStylesheet = Object.entries(stylesheet).map(([key, value]) => {
        const stringifiedValue = serialize(value)

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
