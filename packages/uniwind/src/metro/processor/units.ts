import { DimensionPercentageFor_LengthValue, Length, LengthValue } from 'lightningcss'
import { Logger } from './logger'
import type { ProcessorBuilder } from './processor'

export class Units {
    private readonly logger = new Logger('Units')

    constructor(private readonly Processor: ProcessorBuilder) {}

    processLength(length: LengthValue | DimensionPercentageFor_LengthValue | number) {
        if (typeof length === 'number') {
            return length
        }

        if ('unit' in length) {
            switch (length.unit) {
                case 'px':
                    return length.value
                case 'vw':
                    return `rt.screen.width * ${length.value / 100}`
                case 'vh':
                    return `rt.screen.height * ${length.value / 100}`
                case 'rem':
                    return `rt.rem * ${length.value}`
                default:
                    this.logger.error(`Unsupported unit - ${length.unit}`)

                    return length.value
            }
        }

        return this.Processor.CSS.processValue(length)
    }

    processAnyLength(length: DimensionPercentageFor_LengthValue | Length | LengthValue) {
        if ('type' in length) {
            switch (length.type) {
                case 'value':
                case 'dimension':
                    return this.processLength(length.value)
                default:
                    this.logger.error(`Unsupported length type - ${length.type}`)

                    return length.value
            }
        }

        return this.processLength(length)
    }
}
