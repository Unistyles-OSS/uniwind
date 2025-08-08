export type Orientation = 'portrait' | 'landscape'
export type ColorScheme = 'light' | 'dark'

export type Style = {
    entries: Array<[string, unknown]>
    minWidth: number
    maxWidth: number
    stylesUsingVariables: Record<string, string>
    inlineVariables: Array<[string, () => unknown]>
    orientation: Orientation | null
}

export type StyleSheets = {
    vars: Record<string, unknown>
} & Record<string, Style>

export type UniwindRuntime = {
    screen: {
        width: number
        height: number
    }
    orientation: Orientation
    colorScheme: ColorScheme
    rem: number
}

declare global {
    var __uniwind__computeStylesheet: (runtime: UniwindRuntime) => StyleSheets
    var __uniwind__hot_reload: () => void
}
