import { pipe } from '../utils'
import type { ProcessorBuilder } from './processor'

export class CSS {
    constructor(readonly Processor: ProcessorBuilder) {}

    processCSSValue(value: string, key?: string): unknown {
        if (key !== undefined && this.Processor.Shadow.isShadowKey(key)) {
            return this.Processor.Shadow.processShadow(value)
        }

        if (this.Processor.Color.isColor(value)) {
            return this.Processor.Color.processColor(value)
        }

        if (this.Processor.Color.isColorMix(value)) {
            return this.Processor.Color.processColorMix(value)
        }

        return pipe(value)(
            x => x.replace(/env\((.*?)\)/g, (_, env) => {
                const inset = env.replace('safe-area-inset-', '')

                return `(rt.insets.${inset})`
            }),
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
