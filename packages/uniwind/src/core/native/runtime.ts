import { formatHex, interpolate } from 'culori'
import { Appearance, Dimensions, I18nManager, PixelRatio } from 'react-native'
import { ColorScheme, Orientation } from '../../types'
import type { UniwindRuntime as UniwindRuntimeType } from '../types'

const window = Dimensions.get('window')
const initialColorScheme = Appearance.getColorScheme() ?? ColorScheme.Light

export const UniwindRuntime = {
    screen: {
        width: window.width,
        height: window.height,
    },
    colorScheme: initialColorScheme,
    currentThemeName: initialColorScheme,
    orientation: window.width > window.height ? Orientation.Landscape : Orientation.Portrait,
    rem: PixelRatio.getFontScale() * 16,
    rtl: I18nManager.isRTL,
    insets: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    colorMix: (color: string, mixColor: string, weight: number) => {
        return formatHex(interpolate([mixColor, color])(weight))
    },
} as UniwindRuntimeType
