import { useEffect, useMemo, useReducer } from 'react'
import { UniwindStore } from '../../core'

export const useStyle = (className?: string) => {
    const [_, rerender] = useReducer(() => ({}), {})
    const styleState = useMemo(() => UniwindStore.getStyles(className), [className, _])

    useEffect(() => {
        const dispose = UniwindStore.subscribe(() => rerender, styleState.dependencies)

        return dispose
    }, [styleState])

    return styleState.styles
}
