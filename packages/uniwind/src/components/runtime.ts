import { Appearance, Dimensions, PixelRatio } from 'react-native'
import type { UniwindRuntime as UniwindRuntimeType } from './types'

const window = Dimensions.get('window')

export const UniwindRuntime = {
    screen: {
        width: window.width,
        height: window.height,
    },
    colorScheme: Appearance.getColorScheme() ?? 'light',
    orientation: window.width > window.height ? 'landscape' : 'portrait',
    rem: PixelRatio.getFontScale() * 16,
} satisfies UniwindRuntimeType
