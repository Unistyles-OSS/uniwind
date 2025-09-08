import { Appearance, Dimensions } from 'react-native'
import { StyleDependency } from '../types'

export const listenToNativeUpdates = (callback: VoidFunction, dependencies: Array<StyleDependency>) => {
    const disposers = [] as Array<VoidFunction>

    if (dependencies.includes(StyleDependency.ColorScheme)) {
        const subscription = Appearance.addChangeListener(callback)

        disposers.push(() => subscription.remove())
    }

    if (dependencies.includes(StyleDependency.Orientation) || dependencies.includes(StyleDependency.Dimensions)) {
        const subscription = Dimensions.addEventListener('change', callback)

        disposers.push(() => subscription.remove())
    }

    return () => disposers.forEach(dispose => dispose())
}
