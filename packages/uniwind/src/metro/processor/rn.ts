/* eslint-disable prefer-template */
import { isDefined, toCamelCase } from '../utils'
import type { ProcessorBuilder } from './processor'

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

type PositionValues = {
    top: string
    right: string
    bottom: string
    left: string
}

type CornerValues = {
    topLeft: string
    topRight: string
    bottomLeft: string
    bottomRight: string
}

const cssToRNMap: Record<string, (value: any) => unknown> = {
    ...Object.fromEntries(
        Object.entries(cssToRNKeyMap).map(([key, transformedKey]) => {
            return [key, value => ({
                [transformedKey]: value,
            })]
        }),
    ),
    rotate: (value: string) => {
        return {
            transform: [
                {
                    rotate: value,
                },
            ],
        }
    },
    scale: (value: string) => {
        return {
            transform: [
                {
                    scale: value,
                },
            ],
        }
    },
    perspective: (value: string) => {
        return {
            transform: [
                {
                    perspective: value,
                },
            ],
        }
    },
    translate: (value: string) => {
        const [x, y] = value.split(' ')
        const yValue = y ?? x

        return {
            transform: [
                ...isDefined(x)
                    ? [{
                        translateX: x,
                    }]
                    : [],
                ...(isDefined(yValue)
                    ? [{
                        translateY: yValue,
                    }]
                    : []),
            ],
        }
    },
    boxShadow: () => {
        return {
            boxShadow: '['
                + [
                    '--tw-inset-shadow',
                    '--tw-inset-ring-shadow',
                    '--tw-ring-offset-shadow',
                    '--tw-ring-shadow',
                    '--tw-shadow',
                ]
                    .map(key => `this[\`${key}\`]`)
                    .join(', ')
                + ']',
        }
    },
    borderWidth: (value: string | PositionValues) => {
        if (typeof value === 'string') {
            return {
                borderWidth: value,
            }
        }

        return {
            borderTopWidth: value.top,
            borderRightWidth: value.right,
            borderBottomWidth: value.bottom,
            borderLeftWidth: value.left,
        }
    },
    borderRadius: (value: string | CornerValues) => {
        if (typeof value === 'string') {
            return {
                borderRadius: value,
            }
        }

        return {
            borderTopLeftRadius: value.topLeft,
            borderTopRightRadius: value.topRight,
            borderBottomLeftRadius: value.bottomLeft,
            borderBottomRightRadius: value.bottomRight,
        }
    },
    transitionProperty: (value: string) => {
        return {
            transitionProperty: value.split(', ').map(toCamelCase),
        }
    },
    flex: (value: any) => {
        if (typeof value === 'object') {
            return value
        }

        return {
            flex: value,
        }
    },
    transform: (value: Array<any>) => {
        return {
            transform: value.flat(),
        }
    },
}

export class RN {
    constructor(private readonly Processor: ProcessorBuilder) {}

    cssToRN(property: string, value: any) {
        if (property.startsWith('--')) {
            return [[property, value]] as [[string, any]]
        }

        const camelizedProperty = toCamelCase(property)

        const rn = cssToRNMap[camelizedProperty]?.(value) ?? { [camelizedProperty]: value }

        return Object.entries(rn) as Array<[string, any]>
    }
}
