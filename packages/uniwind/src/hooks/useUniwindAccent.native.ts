import { useEffect, useReducer } from 'react'
import { listenToNativeUpdates, UniwindStore } from '../core'

export const useUniwindAccent = (className: string) => {
    const [uniwindState, recreate] = useReducer(
        () => UniwindStore.getStyles(className),
        UniwindStore.getStyles(className),
    )

    useEffect(() => {
        const dispose = listenToNativeUpdates(recreate, uniwindState.dependencies)

        return dispose
    }, [uniwindState.dependencies, className])

    return (uniwindState.styles as { accentColor?: string }).accentColor ?? ''
}
