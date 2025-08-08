import { pipe, toSafeString } from '../utils'
import type { ProcessorBuilder } from './processor'

export class Var {
    constructor(readonly Processor: ProcessorBuilder) {}

    toVar(value: string) {
        return `this.vars[${toSafeString(value)}]`
    }

    findMatch(
        str: string,
        depth = 0,
        idx = 0,
    ): number {
        const ch = str.charAt(idx)

        switch (ch) {
            case '':
                return -1
            case '(':
                return this.findMatch(str, depth + 1, idx + 1)
            case ')':
                return depth === 0
                    ? idx
                    : this.findMatch(str, depth - 1, idx + 1)
            default:
                return this.findMatch(str, depth, idx + 1)
        }
    }

    processVarsRec(str: string): string {
        const start = str.indexOf('var(')

        if (start < 0) {
            return str
        }

        const after = str.slice(start + 4)
        const end = this.findMatch(after)

        if (end < 0) {
            return str
        }

        const inner = after.slice(0, end).trim()
        const suffix = after.slice(end + 1)

        return (
            str.slice(0, start)
            + this.processVar(`var(${inner})`).join(' ?? ')
            + this.processVarsRec(suffix)
        )
    }

    processVar(rawValue: string): Array<unknown> {
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
            return [this.toVar(unwrapped)]
        }

        const getDefaultValue = () => {
            if (defaultValueRaw === '') {
                return []
            }

            if (defaultValueRaw.startsWith('var(')) {
                return this.processVar(defaultValueRaw)
            }

            const processedDefaultValue = pipe(defaultValueRaw)(
                value => this.Processor.CSS.processCSSValue(value),
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

        return [this.toVar(value), ...getDefaultValue()]
    }

    isVarName(str: string) {
        return str.startsWith('--')
    }
}
