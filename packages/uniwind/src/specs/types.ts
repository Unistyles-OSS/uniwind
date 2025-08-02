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

export type ColorScheme = 'light' | 'dark' | 'unspecified'
export type Orientation = 'portrait' | 'landscape'
