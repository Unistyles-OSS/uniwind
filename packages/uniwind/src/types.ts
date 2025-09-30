export enum StyleDependency {
    ColorScheme = 1,
    Theme = 2,
    Dimensions = 3,
    Orientation = 4,
    Insets = 5,
    FontScale = 6,
    Rtl = 7,
}

export const enum Orientation {
    Portrait = 'portrait',
    Landscape = 'landscape',
}

export const enum ColorScheme {
    Light = 'light',
    Dark = 'dark',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UniwindConfig {}
