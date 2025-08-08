import { parse } from 'culori'
import type { ProcessorBuilder } from './processor'

const isColor = (value: string) => parse(value) !== undefined || value.includes('color')

const tokenize = (str: string) => {
    const { tokens, current } = Array.from(str).reduce(
        (acc, char) => {
            const { tokens, current, parenDepth } = acc

            if (char === ' ' && parenDepth === 0) {
                return current.trim() !== ''
                    ? {
                        tokens: [...tokens, current.trim()],
                        current: '',
                        parenDepth,
                    }
                    : acc
            }

            const getNewParenDepth = () => {
                if (char === '(') {
                    return parenDepth + 1
                }

                return char === ')'
                    ? parenDepth - 1
                    : parenDepth
            }

            return {
                tokens,
                current: current + char,
                parenDepth: getNewParenDepth(),
            }
        },
        {
            tokens: [] as Array<string>,
            current: '',
            parenDepth: 0,
        },
    )

    return current.trim() !== ''
        ? [...tokens, current.trim()]
        : tokens
}

const toNum = (value: string): string | number => {
    const n = parseFloat(value)
    return (value === '0' || /px$/.test(value)) && !isNaN(n)
        ? n
        : value
}

const parseValue = (str: string) => {
    const parts = tokenize(str)
    const inset = parts.includes('inset') || parts.find(p => p.includes('inset'))
    const filtered = parts.filter(p => p !== 'inset')
    const color = filtered.find(isColor)
    const nums = filtered
        .filter((p) => p !== color && p !== inset)
        .map(toNum)
    const [offsetX, offsetY, blurRadius, spreadDistance] = nums

    return {
        inset,
        offsetX,
        offsetY,
        blurRadius,
        spreadDistance,
        color,
    }
}

export class Shadow {
    constructor(readonly Processor: ProcessorBuilder) {}

    isShadowKey(key: string) {
        return [
            '--tw-inset-shadow',
            '--tw-inset-ring-shadow',
            '--tw-ring-offset-shadow',
            '--tw-ring-shadow',
            '--tw-shadow',
        ].includes(key)
    }

    processShadow(shadow: string) {
        const shadowValues = parseValue(shadow)

        return Object.fromEntries(
            Object.entries(shadowValues).map(([key, value]) => {
                const getValue = () => {
                    if (key === 'color' && typeof value !== 'number' && typeof value !== 'boolean') {
                        return value === undefined ? 'rgb(0,0,0)' : this.Processor.CSS.processCSSValue(value)
                    }

                    if (typeof value === 'string') {
                        return this.Processor.CSS.processCSSValue(value)
                    }

                    return value
                }

                return [key, getValue()]
            }),
        )
    }
}
