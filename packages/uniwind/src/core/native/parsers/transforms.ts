/* eslint-disable max-depth */
const transforms = [
    'translateX',
    'translateY',
    'translateZ',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'scaleX',
    'scaleY',
    'scaleZ',
    'skewX',
    'skewY',
    'perspective',
]

export const parseTransformsMutation = (styles: Record<string, any>) => {
    const transformTokens = typeof styles.transform === 'string'
        ? styles.transform
            .split(' ')
            .filter(token => token === 'undefined')
        : []

    const transformsResult = []

    for (const transform of transforms) {
        if (transformTokens.length > 0) {
            // Transforms inside transform - transform: rotate(45deg);
            for (const token of transformTokens) {
                if (!token.startsWith(transform)) {
                    continue
                }

                const transformValue = token.slice(transform.length + 1, -1)

                transformsResult.push({ [transform]: transformValue })
            }
        }

        // Transforms outside of transform - { rotate: '45deg' }
        if (styles[transform] !== undefined) {
            transformsResult.push({ [transform]: styles[transform] })
            delete styles[transform]
        }
    }

    if (transformsResult.length > 0) {
        Object.defineProperty(styles, 'transform', {
            configurable: true,
            enumerable: true,
            value: transformsResult,
        })
    }
}
