import { converter, formatRgb, parse } from 'culori'
import { pipe } from '../utils'
import type { ProcessorBuilder } from './processor'

export class CSS {
    toRgb = converter('rgb')

    constructor(readonly Processor: ProcessorBuilder) {}

    processCSSValue(value: string, key?: string): unknown {
        if (key !== undefined && this.Processor.Shadow.isShadowKey(key)) {
            return this.Processor.Shadow.processShadow(value)
        }

        const parsedColor = parse(value)

        if (parsedColor !== undefined) {
            return formatRgb(this.toRgb(parsedColor))
        }

        return pipe(value)(
            // Handle units
            x => x.replace(/(-?\d+(?:\.\d+)?)(vw|vh|px|rem)/g, (match, value, unit) => {
                switch (unit) {
                    case 'vw':
                        return `(${value} * rt.screen.width / 100)`
                    case 'vh':
                        return `(${value} * rt.screen.height / 100)`
                    // Mark to be evaluated
                    case 'px':
                        return `(${value})`
                    case 'rem':
                        return `(${value} * rt.rem)`
                    default:
                        return match
                }
            }),
            x => x.replace('currentcolor', `(this.vars['currentColor'])`),
            // Convert 1 / 2 to (1 / 2) so it can be evaluated
            x => /\d+\s*\/\s*\d+/.test(x) ? `(${x})` : x,
            // Convert 0 to (0) so it can be evaluated
            x => /^\d+$/.test(x) ? `(${x})` : x,
            // Remove spaces around operators
            x => x.replace(/\s*([+\-*/])\s*/g, '$1'),
            x => x.replace('calc', ''),
            x => this.Processor.Var.processVarsRec(x),
        )
    }
}
