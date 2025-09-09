export const copyComponentProperties = (Component: any, UniwindComponent: any) => {
    Object.entries(Component).forEach(([key, value]) => {
        // Filter out the keys we don't want to copy
        if (['$$typeof', 'render'].includes(key)) {
            return
        }

        UniwindComponent[key] = value
    })

    UniwindComponent.displayName = Component.displayName

    return UniwindComponent
}
