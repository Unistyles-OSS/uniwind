import { colorMix } from '../src/core/native/native-utils'
import { ColorScheme, Orientation } from '../src/types'

export const UniwindRuntimeMock = {
    screen: {
        width: 350,
        height: 700,
    },
    colorScheme: ColorScheme.Light,
    orientation: Orientation.Portrait,
    rtl: false,
    currentThemeName: ColorScheme.Light,
    insets: {
        top: 20,
        left: 10,
        bottom: 0,
        right: 0,
    },
    colorMix,
    fontScale: (value: number) => value * 1,
    cubicBezier: () => '',
    lightDark: (light: string) => light,
}
