import React, { useCallback, useMemo, useSyncExternalStore } from 'react'
import { UniwindStore } from '../../../core'
import { RNStylesProps, UniwindComponentProps } from '../../../core/types'

export const createUniwindComponent = (
    Component: React.ComponentType<any>,
    additionalStyles?: Array<RNStylesProps>,
) => {
    return (props: UniwindComponentProps) => {
        const snapshot = useMemo(() => {
            return UniwindStore.getSnapshot(props, additionalStyles)
        }, [props])
        const uniwindState = useSyncExternalStore(
            useCallback(subscribe => UniwindStore.subscribe(subscribe, snapshot.dependencies), []),
            () => snapshot,
        )

        return (
            <Component
                {...props}
                {...uniwindState.dynamicStyles}
            />
        )
    }
}
