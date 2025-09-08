import { useEffect, useReducer } from 'react'
import { listenToNativeUpdates, UniwindStore } from '../core'

export const useUniwindAccent = (className: string) => {
    const [uniwindState, recreate] = useReducer(
        () => UniwindStore.getSnapshot({ className }),
        UniwindStore.getSnapshot({ className }),
    )

    useEffect(() => {
        const dispose = listenToNativeUpdates(recreate, uniwindState.dependencies)

        return dispose
    }, [uniwindState.dependencies, className])

    return (uniwindState.dynamicStyles.style[0] as { accentColor?: string }).accentColor ?? ''
}
