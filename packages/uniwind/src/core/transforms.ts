const transforms = [
    'translateX',
    'translateY',
    'translateZ',
    'rotateX',
    'rotateY',
    'rotateZ',
    'scaleX',
    'scaleY',
    'scaleZ',
    'perspective',
]

export const parseTransformsMutation = (styles: Record<string, any>) => {
    const transformsResult = transforms.reduce<Array<Record<string, any>>>((acc, transform) => {
        if (styles[transform] === undefined) {
            return acc
        }

        acc.push({ [transform]: styles[transform] })
        delete styles[transform]

        return acc
    }, [])

    if (transformsResult.length > 0) {
        styles.transform = transformsResult
    }
}
