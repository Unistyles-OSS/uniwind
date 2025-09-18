import type { MetroConfig } from 'metro-config'

type UniwindConfig = {
    input: string
}

export declare function withUniwindConfig(config: MetroConfig, options: UniwindConfig): MetroConfig
