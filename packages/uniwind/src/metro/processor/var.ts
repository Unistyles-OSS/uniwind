import { Variable } from 'lightningcss'
import { toSafeString } from '../utils'
import type { ProcessorBuilder } from './processor'

export class Var {
    constructor(private readonly Processor: ProcessorBuilder) {}

    processVar(variable: Variable): string {
        const value = `this[${toSafeString(variable.name.ident)}]`

        if (!variable.fallback) {
            return value
        }

        const fallback = this.Processor.CSS.processValue(variable.fallback)

        return `${value} ?? ${JSON.stringify(fallback)}`
    }
}
