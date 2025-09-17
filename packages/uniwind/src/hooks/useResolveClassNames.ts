import { useEffect, useReducer } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { CSSListener } from '../core/cssListener'
import { getWebStyles } from '../core/getWebStyles'

type Styles = ViewStyle & TextStyle & ImageStyle & {
    accentColor?: string
}

export const useResolveClassNames = (className: string) => {
    const [styles, recreate] = useReducer(
        () => getWebStyles(className) as Styles,
        getWebStyles(className) as Styles,
    )

    useEffect(() => {
        recreate()

        const dispose = CSSListener.addListener(className.split(' '), recreate)

        return dispose
    }, [className])

    return styles
}
