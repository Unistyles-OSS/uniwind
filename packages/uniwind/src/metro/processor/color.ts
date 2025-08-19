import { converter, formatRgb, parse } from 'culori'
import { replaceParentheses } from '../utils'
import type { ProcessorBuilder } from './processor'

export class Color {
    toRgb = converter('rgb')

    constructor(readonly Processor: ProcessorBuilder) {}

    isColor(value: string) {
        return parse(value) !== undefined
    }

    isColorMix(value: string) {
        return value.startsWith('color-mix')
    }

    processColor(value: string, alpha?: number) {
        const parsedColor = parse(value)

        if (parsedColor === undefined) {
            return value
        }

        parsedColor.alpha = alpha ?? parsedColor.alpha

        return formatRgb(this.toRgb(parsedColor))
    }

    processColorMix(value: string) {
        return replaceParentheses('color-mix', match => {
            const [, colorsToMix] = match.split(',')

            if (colorsToMix === undefined) {
                return match
            }

            const [, alphaMatch] = colorsToMix.match(/(\d+(?:\.\d+)?%)\s*$/) ?? []

            if (alphaMatch === undefined) {
                return match
            }

            const alpha = Number(alphaMatch.replace('%', '')) / 100
            const color = colorsToMix.replace(alphaMatch, '').trim()

            return this.processColor(color, alpha)
        })(value)
    }
}
