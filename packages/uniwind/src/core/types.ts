import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { ColorScheme, Orientation, StyleDependency } from '../types'

export type Style = {
    entries: Array<[string, unknown]>
    minWidth: number
    maxWidth: number
    stylesUsingVariables: Record<string, string>
    inlineVariables: Array<[string, () => unknown]>
    orientation: Orientation | null
    colorScheme: ColorScheme | null
    rtl: boolean | null
    native: boolean
    dependencies: Array<StyleDependency>
}

export type StyleSheets = Record<string, Style>

export type UniwindRuntime = {
    screen: {
        width: number
        height: number
    }
    orientation: Orientation
    colorScheme: ColorScheme
    rtl: boolean
    rem: number
    insets: {
        top: number
        bottom: number
        left: number
        right: number
    }
}

export type RNStyle = ViewStyle | TextStyle | ImageStyle

export type RNStylesProps =
    | 'style'
    | 'contentContainerStyle'
    | 'imageStyle'
    | 'ListFooterComponentStyle'
    | 'ListHeaderComponentStyle'
    | 'columnWrapperStyle'
export type RNClassNameProps = GetClassName<RNStylesProps>

type GetClassName<T extends string> = T extends `${infer S}Style` ? `${S}ClassName` : 'className'

export type UniwindComponentProps =
    & {
        [K in RNStylesProps]?: StyleProp<RNStyle>
    }
    & {
        [K in RNClassNameProps]?: string
    }

declare global {
    var __uniwind__computeStylesheet: (runtime: UniwindRuntime) => StyleSheets
    var __uniwind__hot_reload: () => void
}
