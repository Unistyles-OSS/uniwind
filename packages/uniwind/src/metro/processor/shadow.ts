import { isDefined } from '../utils'
import type { ProcessorBuilder } from './processor'

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
        const [
            offsetXRaw,
            offsetYRaw,
            blurRadiusRaw,
            spreadDistanceRaw,
            ...rest
        ] = shadow.split(' ')
        const colorRaw = rest.join(' ')

        const [
            offsetX,
            offsetY,
            blurRadius,
            spreadDistance,
            color,
        ] = [
            offsetXRaw,
            offsetYRaw,
            blurRadiusRaw,
            spreadDistanceRaw,
            colorRaw,
        ]
            .filter(isDefined)
            .map(value => this.Processor.CSS.processCSSValue(value))

        return {
            offsetX,
            offsetY,
            blurRadius,
            spreadDistance,
            color,
        }
    }
}
