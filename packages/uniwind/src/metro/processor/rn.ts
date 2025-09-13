import { isDefined, percentageToFloat, pipe, toCamelCase } from '../utils'
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

const cssToRNMap: Record<string, (value: any) => Record<string, any>> = {
    ...Object.fromEntries(
        Object.entries(cssToRNKeyMap).map(([key, transformedKey]) => {
            return [key, value => ({
                [transformedKey]: value,
            })]
        }),
    ),
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
            transitionProperty: value.split(',').map(toCamelCase),
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
    overflow: (value: any) => {
        if (typeof value === 'object') {
            return value
        }

        return {
            overflow: value,
        }
    },
    '--tw-scale-x': (value: string) => {
        return {
            '--tw-scale-x': percentageToFloat(value),
        }
    },
    '--tw-scale-y': (value: string) => {
        return {
            '--tw-scale-y': percentageToFloat(value),
        }
    },
    '--tw-scale-z': (value: string) => {
        return {
            '--tw-scale-z': percentageToFloat(value),
        }
    },
    backdropFilter: () => ({}),
    backgroundImage: value => ({
        experimental_backgroundImage: value,
    }),
    borderSpacing: () => ({}),
    translate: value => {
        if (typeof value === 'object' && 'x' in value && 'y' in value) {
            return {
                translateX: value.x,
                translateY: value.y,
            }
        }

        if (typeof value === 'string') {
            const [x, y] = value.split(' ')

            return {
                translateX: x,
                translateY: y ?? x,
            }
        }

        return {}
    },
    rotate: value => {
        if (typeof value === 'object') {
            return value
        }

        return {
            rotate: value,
        }
    },
    scale: value => {
        if (typeof value === 'object') {
            return {
                scaleX: value.x,
                scaleY: value.y,
                scaleZ: value.z,
            }
        }

        if (typeof value === 'string') {
            const [x, y, z] = value.split(' ')

            return {
                scaleX: x,
                scaleY: y,
                scaleZ: z,
            }
        }

        return {}
    },
    transform: value => {
        if (typeof value === 'object') {
            return value
        }

        return {}
    },
}

export class RN {
    constructor(private readonly Processor: ProcessorBuilder) {}

    cssToRN(property: string, value: any) {
        // Sometimes lightningcss doesn't include whitespace between css variables
        const parsedValue = typeof value === 'string'
            ? pipe(value)(
                x => x.replace(/]this/g, '] this'),
                x => x.replace(/\](?=\d)/g, '] '),
            )
            : value

        const transformedProperty = property.startsWith('--')
            ? property
            : toCamelCase(property)

        const rn = cssToRNMap[transformedProperty]?.(parsedValue) ?? { [transformedProperty]: parsedValue }

        return Object.entries(rn).filter(([, value]) => isDefined(value)) as Array<[string, any]>
    }
}
