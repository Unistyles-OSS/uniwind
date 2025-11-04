import type { MetroConfig } from 'metro-config'

type Polyfills = {
    rem?: number
}

type UniwindConfig = {
    cssEntryFile: string
    extraThemes?: Array<string>
    dtsFile?: string
    polyfills?: Polyfills
    debug?: boolean
}

export declare function withUniwindConfig(config: MetroConfig, options: UniwindConfig): MetroConfig
