import { Color as ColorType, converter, formatHex, formatHex8 } from 'culori'
import { CssColor } from 'lightningcss'
import { Logger } from '../logger'
import type { ProcessorBuilder } from './processor'

export class Color {
    private toRgb = converter('rgb')

    private readonly black = '#000000'

    private readonly logger = new Logger('Color')

    constructor(private readonly Processor: ProcessorBuilder) {}

    processColor(color: CssColor) {
        // System colors
        if (typeof color === 'string') {
            return this.black
        }

        try {
            if (color.type === 'rgb') {
                return this.format({
                    r: color.r / 255,
                    g: color.g / 255,
                    b: color.b / 255,
                    alpha: color.alpha,
                    mode: 'rgb',
                })
            }

            const result = this.toRgb({
                mode: color.type,
                ...color,
            } as ColorType)

            return this.format(result)
        } catch {
            this.logger.error(`Failed to convert color ${JSON.stringify(color)}`)

            return this.black
        }
    }

    private format(color: ColorType) {
        if (color.alpha === 1) {
            return formatHex(color)
        }

        return formatHex8(color)
    }
}
