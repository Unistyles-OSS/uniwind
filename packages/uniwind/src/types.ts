export enum StyleDependency {
    Theme = 1,
    Dimensions = 2,
    Orientation = 3,
    Insets = 4,
    FontScale = 5,
    Rtl = 6,
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
