import { CalcFor_DimensionPercentageFor_LengthValue, CalcFor_Length, Function as FunctionType } from 'lightningcss'
import { Logger } from '../logger'
import { pipe } from '../utils'
import type { ProcessorBuilder } from './processor'

export class Functions {
    private readonly logger = new Logger('Functions')

    constructor(private readonly Processor: ProcessorBuilder) {}

    processCalc(calc: CalcFor_DimensionPercentageFor_LengthValue | CalcFor_Length): string {
        switch (calc.type) {
            case 'sum': {
                const sum = calc.value.map(x => this.processCalc(x)).join(' + ')

                return sum.includes('%') ? this.tryPercentageEval(sum) : sum
            }
            case 'value':
                return this.Processor.CSS.processValue(calc.value)
            case 'function':
                return this.Processor.CSS.processValue(calc.value)
            case 'number':
                return String(calc.value)
            default:
                this.logger.error(`Unsupported calc type - ${calc.type}`)

                return ''
        }
    }

    tryPercentageEval(value: string) {
        try {
            const tokens = value.split(/[\s+-]+/)

            if (tokens.some(token => !token.includes('%'))) {
                this.logger.error(`Invalid calc, you can't mix percentage and non-percentage values`)

                return value
            }

            const numericValue = value.replace(/%/g, '')

            // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
            return new Function(`return ${numericValue} + '%'`)()
        } catch {
            this.logger.error(`Invalid calc ${value}`)

            return value
        }
    }

    processFunction(fn: string | FunctionType) {
        if (typeof fn !== 'object') {
            this.logger.error(`Unsupported function - ${fn}`)

            return fn
        }

        if (fn.name === 'calc') {
            const calc = this.Processor.CSS.processValue(fn.arguments)

            return pipe(calc)(
                String,
                x => {
                    if (x.includes('%')) {
                        return this.Processor.Functions.tryPercentageEval(x)
                    }

                    return x
                },
            )
        }

        if (fn.name === 'cubic-bezier') {
            const cubicArguments = pipe(this.Processor.CSS.processValue(fn.arguments))(
                String,
                x => x.replace(/,\s/g, ','),
            )

            return `rt.cubicBezier(${cubicArguments})`
        }

        if (fn.name === 'max') {
            return `Math.max( ${this.Processor.CSS.processValue(fn.arguments)} )`
        }

        if (
            [
                'blur',
                'brightness',
                'contrast',
                'grayscale',
                'hue-rotate',
                'invert',
                'opacity',
                'saturate',
                'sepia',
                'conic-gradient',
                'linear-gradient',
                'radial-gradient',
            ].includes(fn.name)
        ) {
            // Not supported by RN
            return '""'
        }

        this.logger.error(`Unsupported function - ${fn.name}`)

        return fn.name
    }

    processMathFunction(
        name: string,
        value:
            | Array<CalcFor_DimensionPercentageFor_LengthValue>
            | Array<CalcFor_Length>
            | CalcFor_DimensionPercentageFor_LengthValue
            | CalcFor_Length,
    ) {
        if (!Array.isArray(value)) {
            return `Math.${name} ( ${this.processCalc(value)} )`
        }

        const values = value.map(x => this.processCalc(x)).join(' , ')

        return `Math.${name}( ${values} )`
    }
}
