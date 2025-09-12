import { BoxShadowValue } from 'react-native'

export const parseBoxShadow = (boxShadow: string) => {
    return boxShadow
        .split(', ')
        .map(shadow => {
            const tokens = shadow.split(' ')
            const inset = tokens.includes('inset')
            const color = tokens.find(token => token.startsWith('#'))
            const [offsetX, offsetY, blurRadius, spreadDistance] = tokens
                .filter(token => !token.includes('inset') && !token.startsWith('#') && token !== 'undefined')
                .map(x => {
                    if (x === 'undefined') {
                        return undefined
                    }

                    return Number(x)
                })

            if (
                (offsetX === undefined && offsetY === undefined)
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                || (!offsetX && !offsetY && !spreadDistance)
            ) {
                return null
            }

            return {
                inset,
                offsetX: offsetX ?? 0,
                offsetY: offsetY ?? 0,
                blurRadius,
                spreadDistance,
                color,
            } satisfies BoxShadowValue
        })
        .filter(Boolean)
}
