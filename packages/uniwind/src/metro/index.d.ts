import type { MetroConfig } from 'metro-config'

type UniwindConfig = {
    cssEntryFile: string
    extraThemes?: Array<string>
    dtsFile?: string
}

export declare function withUniwindConfig(config: MetroConfig, options: UniwindConfig): MetroConfig
