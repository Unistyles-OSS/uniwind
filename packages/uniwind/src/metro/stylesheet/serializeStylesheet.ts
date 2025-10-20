import { Logger } from '../logger'
import { addMissingSpaces, isNumber, pipe, smartSplit } from '../utils'

type Stylesheet = Record<string, any>

const FN_DECLARATION = 'function() { return'

const isJSExpression = (value: string) =>
    [
        value.includes('this'),
        value.includes('rt.'),
        value.includes('function() {'),
        /\s([-+/*])\s/.test(value),
    ].some(Boolean)

const isValidJSValue = (value: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
        new Function(`const test = ${value}`)

        return true
    } catch {
        return false
    }
}

const isFunction = (value: string) => /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*\s*\(.*\)$/.test(value)

const toJSExpression = (value: string): string => {
    if (!isJSExpression(value)) {
        if (value.startsWith('"')) {
            return value
        }

        // Percentage regex, round to 3 decimal places
        if (/^\s*[+-]?(?:\d+(?:\.\d+)?|\.\d+)\s*%\s*$/.test(value)) {
            const roundedPercentage = Number(value.replace('%', '')).toFixed(3).replace(/\.?0+$/, '')

            return `"${roundedPercentage}%"`
        }

        if (isNumber(value)) {
            return value
        }

        return `"${value.trim()}"`
    }

    if (!value.includes(FN_DECLARATION)) {
        if (isFunction(value)) {
            const [fnName] = value.split('(')

            if (fnName === undefined) {
                return value
            }

            const args = pipe(value)(
                x => x
                    .replace(fnName, '')
                    .replace('(', '')
                    .slice(0, -1)
                    .trim(),
                x => smartSplit(x, /[,\s]+/),
                x => x.map(token => {
                    if (token.endsWith(',')) {
                        return token.slice(0, -1)
                    }

                    return token
                }),
                x => x.map(toJSExpression),
            )

            return [
                fnName,
                '(',
                args.join(','),
                ')',
            ].join('')
        }

        if (!isValidJSValue(value)) {
            const tokens = smartSplit(value).map(token => {
                if (isNumber(token)) {
                    return token
                }

                if (isFunction(token)) {
                    return toJSExpression(token)
                }

                const parsedToken = pipe(token)(
                    x => x.replace(',', ''),
                    x => {
                        if (x.includes('??')) {
                            return x.split(' ?? ').map(toJSExpression).join(' ?? ')
                        }

                        return toJSExpression(x)
                    },
                )

                if (parsedToken.startsWith('"')) {
                    return [
                        parsedToken.slice(1, -1),
                        token.includes(',') ? ',' : '',
                    ].join('')
                }

                return [
                    '${',
                    parsedToken,
                    '}',
                    token.includes(',') ? ',' : '',
                ].join('')
            })

            return `\`${tokens.join(' ')}\``
        }

        return value
    }

    const [, after] = value.split(FN_DECLARATION)

    if (after === undefined) {
        return value
    }

    try {
        return `${FN_DECLARATION} ${serialize(JSON.parse(after.replace('}', '')))} }`
    } catch {
        return `${FN_DECLARATION} ${serialize(after.replace('}', ''))} }`
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
                    // Always serialize className as string
                    if (key === 'className') {
                        return `"${key}": "${String(value)}"`
                    }

                    return `"${key}": ${serialize(value)}`
                }).join(', '),
                '})',
            ].join('')
        }
        case 'string':
            return toJSExpression(addMissingSpaces(value))
        default:
            return String(value)
    }
}

export const serializeStylesheet = (stylesheet: Stylesheet) => {
    const hotReloadFN = 'globalThis.__uniwind__hot_reload?.();'
    const currentColor = `get currentColor() { return function() { return rt.colorScheme === 'dark' ? '#ffffff' : '#000000' } },`

    const serializedStylesheet = Object.entries(stylesheet).map(([key, value]) => {
        const stringifiedValue = isNumber(value)
            ? String(value)
            : serialize(value)

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
