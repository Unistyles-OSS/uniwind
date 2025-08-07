import { converter, formatRgb, parse } from 'culori'
import { isDefined, pipe } from './common'
import { isShadowKey, processShadow } from './shadow-utils'
import { processVarsRec } from './var-utils'

const toRgb = converter('rgb')

export const processCSSValue = (value: string, key?: string): unknown => {
    if (key !== undefined && isShadowKey(key)) {
        return processShadow(value)
    }

    const parsedColor = parse(value)

    if (parsedColor !== undefined) {
        return formatRgb(toRgb(parsedColor))
    }

    return pipe(value)(
        // Handle units
        x => x.replace(/(-?\d+(?:\.\d+)?)(vw|vh|px|rem)/g, (match, value, unit) => {
            switch (unit) {
                case 'vw':
                    return `(${value} * rt.screenWidth / 100)`
                case 'vh':
                    return `(${value} * rt.screenHeight / 100)`
                // Mark to be evaluated
                case 'px':
                    return `(${value})`
                case 'rem':
                    return `(${value} * rt.rem)`
                default:
                    return match
            }
        }),
        // Convert 1 / 2 to (1 / 2) so it can be evaluated
        x => /\d+\s*\/\s*\d+/.test(x) ? `(${x})` : x,
        // Convert 0 to (0) so it can be evaluated
        x => /^\d+$/.test(x) ? `(${x})` : x,
        // Remove spaces around operators
        x => x.replace(/\s*([+\-*/])\s*/g, '$1'),
        x => x.replace('calc', ''),
        processVarsRec,
    )
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
            boxShadow: value.match(/vars\[`(.*?)`\]/g) ?? [],
        }
    },
}

export const cssToRN = (property: string, value: any) => {
    const rn = cssToRNMap[property]?.(value) ?? { [property]: value }

    return Object.entries(rn)
}
