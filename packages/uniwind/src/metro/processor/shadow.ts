import { Logger } from '../logger'
import { DeclarationValues } from '../types'
import { isDefined, isNumber, pipe } from '../utils'
import type { ProcessorBuilder } from './processor'

type ShadowType = {
    offsetX: number | string | undefined
    offsetY: number | string | undefined
    blurRadius: number | string | undefined
    spreadDistance: number | string | undefined
}

export class Shadow {
    private readonly logger = new Logger('Shadow')

    constructor(private readonly Processor: ProcessorBuilder) {}

    isShadowKey(key: string) {
        return [
            '--tw-inset-shadow',
            '--tw-inset-ring-shadow',
            '--tw-ring-offset-shadow',
            '--tw-ring-shadow',
            '--tw-shadow',
        ].includes(key)
    }

    processShadow(value: DeclarationValues) {
        const result = this.Processor.CSS.processValue(value)

        if (typeof result !== 'string') {
            this.logger.error(`Unsupported shadow value - ${result}`)

            return ''
        }

        const shadows = pipe(result)(
            x => x.replace(/\](?!\s)/g, '] '),
            x => x.trim(),
            x => x.split(','),
        )

        return shadows.map(shadow => {
            const tokens = pipe(shadow)(
                x => this.smartSplit(x),
                x => x.filter(token => token.length > 0),
            )

            const inset = tokens.find(token => token.includes('inset'))
            const color = tokens.find(token => token.startsWith('#') || token.toLowerCase().includes('color'))
            const [offsetX, offsetY, blurRadius, spreadDistance] = tokens
                .filter(token => token !== inset && token !== color)
                .map(x => isNumber(x) ? Number(x) : x)

            if (this.isEmptyShadow({ offsetX, offsetY, blurRadius, spreadDistance })) {
                return null
            }

            return {
                offsetX,
                offsetY,
                color,
                blurRadius,
                spreadDistance,
                inset: inset?.trim().toLowerCase() === 'inset' ? true : inset,
            }
        }).filter(isDefined)
    }

    private isEmptyShadow(shadow: ShadowType) {
        return Object.values(shadow).every(value => value === undefined || value === 0)
    }

    private smartSplit(str: string) {
        const escaper = '&&&'

        return pipe(str)(
            x => x.replace(/\s\?\?\s/g, `${escaper}??${escaper}`),
            x => x.replace(/\s([+\-*/])\s/g, `${escaper}$1${escaper}`),
            x => x.split(' '),
            x => x.map(token => token.replace(new RegExp(escaper, 'g'), ' ')),
        )
    }
}
