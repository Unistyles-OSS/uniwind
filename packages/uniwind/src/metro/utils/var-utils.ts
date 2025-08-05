import { toSafeString } from './common'

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

export const processVar = (rawValue: string): Array<string> => {
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

    const value = unwrapped.slice(0, splitIndex).trim()
    const defaultValueRaw = unwrapped.slice(splitIndex + 1).trim()
    const defaultValue = defaultValueRaw.startsWith('var(')
        ? processVar(defaultValueRaw)
        : []

    return [toVar(value), ...defaultValue]
}

export const isVarName = (str: string) => str.startsWith('--')

/*
Use local variables in styles instead of global ones
Example:
.translate-x-2 {
    --tw-translate-x: 2px;
    translate: var(--tw-translate-x);
}
*/
export const injectLocalVars = (entries: Array<[string, unknown]>) => {
    const localVarsEntries = entries.filter(([key]) => isVarName(key))

    if (localVarsEntries.length === 0) {
        return entries
    }

    const localVars = Object.fromEntries(localVarsEntries)

    return entries.reduce<Array<[string, unknown]>>((acc, [key, value]) => {
        if (isVarName(key)) {
            return acc
        }

        if (typeof value === 'string') {
            const processedValue = value.replace(/vars\[`(.*?)`\]/g, (match, varName) => {
                if (varName in localVars) {
                    return String(localVars[varName])
                }

                return match
            })

            acc.push([key, processedValue])

            return acc
        }

        acc.push([key, value])

        return acc
    }, [])
}
