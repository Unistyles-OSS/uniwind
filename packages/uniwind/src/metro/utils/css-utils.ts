import { processVarsRec } from './var-utils'

export const processCSSValue = (value: string) => {
    const replacedUnits = value
        .replace(/(\d+(?:\.\d+)?)(vw|vh|px|rem)/g, (match, value, unit) => {
            switch (unit) {
                case 'vw':
                    return `(${value} * rt.screenWidth / 100)`
                case 'vh':
                    return `(${value} * rt.screenHeight / 100)`
                case 'px':
                    return `(${value})`
                case 'rem':
                    return `(${value} * rt.rem)`
                default:
                    return match
            }
        })
        .replace('calc', '')

    return processVarsRec(replacedUnits)
}

const cssToRNKeyMap = {
    marginInline: 'marginHorizontal',
    marginBlock: 'marginVertical',
    paddingInline: 'paddingHorizontal',
    paddingBlock: 'paddingVertical',
    direction: 'writingDirection',
    borderBottomRightRadius: 'borderBottomEndRadius',
    borderBottomLeftRadius: 'borderBottomStartRadius',
    borderInlineEndColor: 'borderEndColor',
    borderInlineStartColor: 'borderStartColor',
    borderTopRightRadius: 'borderTopEndRadius',
    borderTopLeftRadius: 'borderTopStartRadius',
    borderInlineEndWidth: 'borderEndWidth',
    borderInlineStartWidth: 'borderStartWidth',
    right: 'end',
    left: 'start',
    marginRight: 'marginEnd',
    marginLeft: 'marginStart',
    paddingRight: 'paddingEnd',
    paddingLeft: 'paddingStart',
    backgroundSize: 'resizeMode',
} as Record<string, string>

const cssToRNMap: Record<string, (value: any) => unknown> = {
    ...Object.fromEntries(
        Object.entries(cssToRNKeyMap).map(([key, transformedKey]) => {
            return [key, value => ({
                [transformedKey]: value,
            })]
        }),
    ),
    opacity: (value: string) => {
        return {
            opacity: parseFloat(value.slice(0, -1)) / 100,
        }
    },
    transform: () => ({}),
    translate: (value: string) => {
        const [x, y] = value.split(' ')
        const yValue = y ?? x

        return {
            transform: [
                ...x !== undefined
                    ? [{
                        translateX: x,
                    }]
                    : [],
                ...(yValue !== undefined
                    ? [{
                        translateY: yValue,
                    }]
                    : []),
            ],
        }
    },
}

export const cssToRN = (property: string, value: any) => {
    const rn = cssToRNMap[property]?.(value) ?? { [property]: value }

    return Object.entries(rn)
}
