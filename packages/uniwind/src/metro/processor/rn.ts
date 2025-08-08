import { isDefined, pipe } from '../utils'
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
            opacity: Number(value.slice(0, -1)) / 100,
        }
    },
    transform: (value: string) => {
        const transforms = value.split(' ')
        const getTransform = (transformName: string) =>
            transforms
                .find(transform => transform.startsWith(transformName))
                ?.replace(transformName, '')
                .replace('(', '')
                .replace(')', '')

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
    boxShadow: (value: string) => {
        return {
            boxShadow: value.match(/this\.vars\[`(.*?)`\]/g) ?? [],
        }
    },
}

export class RN {
    constructor(readonly Processor: ProcessorBuilder) {}

    cssToRN(property: string, value: any) {
        const rn = cssToRNMap[property]?.(value) ?? { [property]: value }

        return Object.entries(rn)
    }
}
