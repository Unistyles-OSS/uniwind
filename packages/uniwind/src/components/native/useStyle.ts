import { useEffect, useMemo, useReducer } from 'react'
import { UniwindStore } from '../../core/native'
import { ComponentState } from '../../core/types'

export const useStyle = (className?: string, state?: ComponentState) => {
    const [_, rerender] = useReducer(() => ({}), {})
    const styleState = useMemo(
        () => UniwindStore.getStyles(className, state),
        [className, _, state?.isDisabled, state?.isFocused, state?.isPressed],
    )

    useEffect(() => {
        const dispose = UniwindStore.subscribe(() => rerender(), styleState.dependencies)

        return dispose
    }, [styleState])

    return styleState.styles
}
