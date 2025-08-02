import { HybridObject } from 'react-native-nitro-modules'

export type ColorScheme = 'light' | 'dark' | 'unspecified'
export type Orientation = 'portrait' | 'landscape'

export interface Dimensions {
    readonly width: number
    readonly height: number
}

export interface Insets {
    readonly top: number
    readonly bottom: number
    readonly left: number
    readonly right: number
}

export interface UniwindRuntime extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
    readonly colorScheme: ColorScheme
    readonly screen: Dimensions
    readonly insets: Insets
    readonly orientation: Orientation
    readonly pixelRatio: number
    readonly fontScale: number
    readonly rtl: boolean
}
