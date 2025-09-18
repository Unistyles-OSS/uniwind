import { useEffect, useReducer } from 'react'
import { CSSListener } from '../core/cssListener'
import { getWebStyles } from '../core/getWebStyles'

export const useResolveClassNames = (className: string) => {
    const [styles, recreate] = useReducer(
        () => getWebStyles(className),
        getWebStyles(className),
    )

    useEffect(() => {
        recreate()

        const dispose = CSSListener.addListener(className, recreate)

        return dispose
    }, [className])

    return styles
}
