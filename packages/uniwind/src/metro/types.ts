import type {
    Declaration,
    GradientItemFor_DimensionPercentageFor_LengthValue,
    LineDirection,
    MathFunctionFor_DimensionPercentageFor_LengthValue,
    MathFunctionFor_Length,
    MediaFeatureValue,
    ParsedComponent,
    Token,
    TokenOrValue,
} from 'lightningcss'
import type Bundler from 'metro/private/Bundler'
import { ColorScheme, Orientation } from '../types'

type WithUniwindPatch<T> = T & {
    __uniwind_patched?: boolean
}

export type ExtendedBundler = Bundler & {
    transformFile: WithUniwindPatch<Bundler['transformFile']>
}

export type ExtendedFileSystem = {
    getSha1: WithUniwindPatch<(filename: string) => string>
}

export type DeepMutable<T> = {
    -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P]
}

export type UniwindConfig = {
    input: string
}

export type MediaQueryResolver = {
    maxWidth: any
    minWidth: any
    platform: Platform | null
    rtl: boolean | null
    important: boolean
    importantProperties?: Array<string>
    colorScheme: ColorScheme | null
    theme: string | null
    orientation: Orientation | null
}

export const enum Platform {
    Android = 'android',
    iOS = 'ios',
    Web = 'web',
    Native = 'native',
}

type TakeArray<T> = T extends Array<any> ? T : never

export type DeclarationValues =
    | Declaration['value']
    | TakeArray<Declaration['value']>[number]
    | TokenOrValue
    | Token
    | ParsedComponent
    | Array<TokenOrValue>
    | MediaFeatureValue
    | MathFunctionFor_DimensionPercentageFor_LengthValue
    | MathFunctionFor_Length
    | LineDirection
    | GradientItemFor_DimensionPercentageFor_LengthValue

export type ProcessMetaValues = {
    propertyName?: string
    className?: string
}

export type StyleSheetTemplate = {
    [K: string]: Array<MediaQueryResolver & Record<string, unknown>>
}

type FileChange = {
    filePath: string
    type: string
    metadata: any
}

export type FileChangeEvent = {
    eventsQueue: Array<FileChange>
}
