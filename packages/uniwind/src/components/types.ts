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

declare global {
    var __uniwind__computeStylesheet: (runtime: UniwindRuntime) => StyleSheets
    var __uniwind__hot_reload: () => void
}
