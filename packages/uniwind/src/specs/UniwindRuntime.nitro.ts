import { HybridObject } from 'react-native-nitro-modules'
import { Dimensions, Insets } from './types'

type ColorScheme = 'light' | 'dark' | 'unspecified'
type Orientation = 'portrait' | 'landscape'

export interface UniwindRuntime extends HybridObject<{ ios: 'c++'; android: 'c++' }> {
    readonly colorScheme: ColorScheme
    readonly screen: Dimensions
    readonly insets: Insets
    readonly orientation: Orientation
    readonly pixelRatio: number
    readonly fontScale: number
    readonly rtl: boolean
}
