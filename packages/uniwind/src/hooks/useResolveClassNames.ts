import { useEffect, useReducer } from 'react'
import { RNStyle } from '../core/types'
import { CSSListener, getWebStyles } from '../core/web'

const emptyState = {} as RNStyle

export const useResolveClassNames = (className: string) => {
    const [styles, recreate] = useReducer(
        () => className !== '' ? getWebStyles(className) : emptyState,
        className !== '' ? getWebStyles(className) : emptyState,
    )

    useEffect(() => {
        if (className === '') {
            return
        }

        recreate()

        const dispose = CSSListener.addListener(className, recreate)

        return dispose
    }, [className])

    return styles
}
