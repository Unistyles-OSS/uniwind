import { useEffect, useReducer } from 'react'
import { UniwindStore } from '../core/native'
import { ComponentState } from '../core/types'

export const useResolveClassNames = (className: string, state?: ComponentState) => {
    const [uniwindState, recreate] = useReducer(
        () => UniwindStore.getStyles(className, state),
        UniwindStore.getStyles(className, state),
    )

    useEffect(() => {
        recreate()
    }, [className, state?.isDisabled, state?.isPressed, state?.isFocused])

    useEffect(() => {
        const dispose = UniwindStore.subscribe(recreate, uniwindState.dependencies)

        return dispose
    }, [uniwindState.dependencies, className])

    return uniwindState.styles
}
