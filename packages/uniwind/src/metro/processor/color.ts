import { Color as ColorType, converter, formatRgb } from 'culori'
import { CssColor } from 'lightningcss'
import { Logger } from '../logger'
import type { ProcessorBuilder } from './processor'

export class Color {
    private toRgb = converter('rgb')

    private readonly black = 'rgb(0,0,0)'

    private readonly logger = new Logger('Color')

    constructor(private readonly Processor: ProcessorBuilder) {}

    processColor(color: CssColor) {
        // System colors
        if (typeof color === 'string') {
            return this.black
        }

        try {
            const result = this.toRgb({
                mode: color.type,
                ...color,
            } as ColorType)

            return formatRgb(result)
        } catch {
            this.logger.error(`Failed to convert color ${JSON.stringify(color)}`)

            return this.black
        }
    }
}
