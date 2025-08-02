import { HybridObject } from 'react-native-nitro-modules'
import { Dimensions, Insets } from './types'

type ColorScheme = 'dark' | 'light' | 'unspecified'
type Orientation = 'portrait' | 'landscape'

// represents any native API that can communicate with Uniwind
// not available from JS
export interface NativePlatform extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
    getInsets(): Insets
    getColorScheme(): ColorScheme
    getFontScale(): number
    getPixelRatio(): number
    getOrientation(): Orientation
    getScreenDimensions(): Dimensions
    getPrefersRtlDirection(): boolean
}
