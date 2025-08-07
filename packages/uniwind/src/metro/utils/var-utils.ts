import { pipe, toSafeString } from './common'
import { processCSSValue } from './css-utils'

const toVar = (value: string) => `vars[${toSafeString(value)}]`

const findMatch = (
    str: string,
    depth = 0,
    idx = 0,
): number => {
    const ch = str.charAt(idx)

    switch (ch) {
        case '':
            return -1
        case '(':
            return findMatch(str, depth + 1, idx + 1)
        case ')':
            return depth === 0
                ? idx
                : findMatch(str, depth - 1, idx + 1)
        default:
            return findMatch(str, depth, idx + 1)
    }
}

export const processVarsRec = (str: string): string => {
    const start = str.indexOf('var(')

    if (start < 0) {
        return str
    }

    const after = str.slice(start + 4)
    const end = findMatch(after)

    if (end < 0) {
        return str
    }

    const inner = after.slice(0, end).trim()
    const suffix = after.slice(end + 1)

    return (
        str.slice(0, start)
        + processVar(`var(${inner})`).join(' ?? ')
        + processVarsRec(suffix)
    )
}

export const processVar = (rawValue: string): Array<unknown> => {
    // Strip `var(` prefix and trailing `)`
    const unwrapped = rawValue.slice(4, -1)
    const { index: splitIndex } = unwrapped
        .split('')
        .reduce(
            (acc, char, charIndex) => {
                const getDepth = () => {
                    if (char === '(') {
                        return acc.depth + 1
                    }

                    return char === ')'
                        ? acc.depth - 1
                        : acc.depth
                }

                const getIndex = () => {
                    if (acc.index !== null) {
                        return acc.index
                    }

                    return char === ',' && acc.depth === 0
                        ? charIndex
                        : null
                }

                const index = getIndex()
                const depth = getDepth()

                return { depth, index }
            },
            { depth: 0, index: null as number | null },
        )

    if (splitIndex === null) {
        return [toVar(unwrapped)]
    }

    const getDefaultValue = () => {
        if (defaultValueRaw.startsWith('var(')) {
            return processVar(defaultValueRaw)
        }

        const processedDefaultValue = pipe(defaultValueRaw)(
            processCSSValue,
            value => {
                if (typeof value !== 'string') {
                    return value
                }

                if (value.startsWith('(')) {
                    return value
                }

                return toSafeString(value)
            },
        )

        return [processedDefaultValue]
    }

    const value = unwrapped.slice(0, splitIndex).trim()
    const defaultValueRaw = unwrapped.slice(splitIndex + 1).trim()

    return [toVar(value), ...getDefaultValue()]
}

export const isVarName = (str: string) => str.startsWith('--')
