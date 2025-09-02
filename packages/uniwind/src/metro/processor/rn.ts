/* eslint-disable prefer-template */
import { isDefined, pipe, toCamelCase } from '../utils'
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
    transform: (value: string) => {
        const transforms = value.split(' ')
        const getTransform = (transformName: string) =>
            pipe(transforms)(
                x => x.find(transform => transform.startsWith(transformName)),
                x => x?.replace(transformName, ''),
                x => x?.replace('(', ''),
                x => x?.replace(')', ''),
                x => {
                    if (x === undefined) {
                        return undefined
                    }

                    const isNumber = !isNaN(Number(x))

                    return isNumber ? `(${x})` : x
                },
            )

        const possibleTransforms = {
            perspective: getTransform('perspective'),
            rotateX: getTransform('rotateX'),
            rotateY: getTransform('rotateY'),
            rotateZ: getTransform('rotateZ'),
            rotate: getTransform('rotate'),
            translateX: getTransform('translateX'),
            translateY: getTransform('translateY'),
            translateZ: getTransform('translateZ'),
            scale: getTransform('scale'),
            scaleX: getTransform('scaleX'),
            scaleY: getTransform('scaleY'),
            scaleZ: getTransform('scaleZ'),
            skewX: getTransform('skewX'),
            skewY: getTransform('skewY'),
            matrix: getTransform('matrix'),
        }
        const availableTransforms = pipe(Object.entries(possibleTransforms))(
            entries =>
                entries.map(([transformName, transformValue]) => {
                    if (transformValue === undefined) {
                        return null
                    }

                    return {
                        [transformName]: transformValue,
                    }
                }),
            entries => entries.filter(isDefined),
        )

        return {
            transform: [
                ...availableTransforms,
            ],
        }
    },
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
