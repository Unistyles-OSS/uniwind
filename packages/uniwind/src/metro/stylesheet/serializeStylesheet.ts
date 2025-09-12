import { Logger } from '../logger'
import { isNumber, pipe, smartSplit } from '../utils'

type Stylesheet = Record<string, any>

const isJSExpression = (value: string) =>
    [
        value.includes('this'),
        value.includes('rt.'),
        value.includes('() =>'),
        /\s([-+/*])\s/.test(value),
    ].some(Boolean)

const isValidJS = (value: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
        new Function(`return (${value})`)

        return true
    } catch {
        return false
    }
}

const toJSExpression = (value: string): string => {
    if (!isJSExpression(value)) {
        if (value.startsWith('"')) {
            return value
        }

        return `"${value.trim()}"`
    }

    if (!value.includes('() =>')) {
        return pipe(value)(
            x => x.split(' '),
            x => x.map(token => {
                if (isJSExpression(token) || /[-+/*?(),]/.test(token) || isNumber(token)) {
                    return token
                }

                return `"${token}"`
            }),
            x => x.join(' '),
            x => x.replace(/" "/g, ' '),
            x => {
                if (!isValidJS(x)) {
                    const tokens = smartSplit(x).map(token => `$\{${token}}`)

                    return `\`${tokens.join(' ')}\``
                }

                return x
            },
        )
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
            // Percentage regex, round to 3 decimal places
            if (/^\s*[+-]?(?:\d+(?:\.\d+)?|\.\d+)\s*%\s*$/.test(value)) {
                const roundedPercentage = Number(value.replace('%', '')).toFixed(3).replace(/\.?0+$/, '')

                return toJSExpression(`${roundedPercentage}%`)
            }

            return toJSExpression(value.trim())
        default:
            return String(value)
    }
}

export const serializeStylesheet = (stylesheet: Stylesheet) => {
    const hotReloadFN = 'globalThis.__uniwind__hot_reload?.()'
    const currentColor = `get currentColor() { return rt.colorScheme === 'dark' ? '#ffffff' : '#000000' },`

    const serializedStylesheet = Object.entries(stylesheet).map(([key, value]) => {
        const stringifiedValue = isNumber(value)
            ? String(value)
            : serialize(value)

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
