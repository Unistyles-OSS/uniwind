import { isDefined } from './common'
import { processCSSValue } from './css-utils'

export const isShadowKey = (key: string) =>
    [
        '--tw-inset-shadow',
        '--tw-inset-ring-shadow',
        '--tw-ring-offset-shadow',
        '--tw-ring-shadow',
        '--tw-shadow',
    ].includes(key)

export const processShadow = (shadow: string) => {
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
        .map(value => processCSSValue(value))

    return {
        offsetX,
        offsetY,
        blurRadius,
        spreadDistance,
        color,
    }
}
