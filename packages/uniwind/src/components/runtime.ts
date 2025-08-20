import { Appearance, Dimensions, I18nManager, PixelRatio } from 'react-native'
import { ColorScheme, Orientation } from '../types'
import type { UniwindRuntime as UniwindRuntimeType } from './types'

const window = Dimensions.get('window')

export const UniwindRuntime = {
    screen: {
        width: window.width,
        height: window.height,
    },
    colorScheme: Appearance.getColorScheme() ?? ColorScheme.Light,
    orientation: window.width > window.height ? Orientation.Landscape : Orientation.Portrait,
    rem: PixelRatio.getFontScale() * 16,
    rtl: I18nManager.isRTL,
} as UniwindRuntimeType
