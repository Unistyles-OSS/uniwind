import { useEffect, useReducer } from 'react'
import { Appearance, Dimensions } from 'react-native'
import { UniwindStore } from '../core'
import { StyleDependency } from '../types'

export const useUniwindAccent = (className: string) => {
    const [uniwindState, recreate] = useReducer(
        () => UniwindStore.getSnapshot({ className }),
        UniwindStore.getSnapshot({ className }),
    )

    useEffect(() => {
        const disposers = [] as Array<VoidFunction>

        if (uniwindState.dependencies.includes(StyleDependency.ColorScheme)) {
            const subscription = Appearance.addChangeListener(() => recreate())

            disposers.push(() => subscription.remove())
        }

        if (uniwindState.dependencies.includes(StyleDependency.Orientation) || uniwindState.dependencies.includes(StyleDependency.Dimensions)) {
            const subscription = Dimensions.addEventListener('change', () => recreate())

            disposers.push(() => subscription.remove())
        }

        return () => disposers.forEach(dispose => dispose())
    }, [uniwindState.dependencies, className])

    return (uniwindState.dynamicStyles.style[0] as { accentColor?: string }).accentColor ?? ''
}
