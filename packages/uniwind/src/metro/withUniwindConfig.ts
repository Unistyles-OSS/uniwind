import type { MetroConfig } from 'metro-config'
import path from 'path'
import { cacheStore, patchMetroGraphToSupportUncachedModules } from './metro-css-patches'
import { nativeResolver, webResolver } from './resolvers'
import { Platform, UniwindConfig } from './types'
import { uniq } from './utils'

export const withUniwindConfig = <T extends MetroConfig>(
    config: T,
    uniwindConfig: UniwindConfig,
): T => {
    const isExpo = true

    uniwindConfig.themes = uniq([
        'light',
        'dark',
        ...(uniwindConfig.extraThemes ?? []),
    ])

    if (isExpo === false) {
        patchMetroGraphToSupportUncachedModules()
    }

    if (typeof uniwindConfig === 'undefined') {
        throw new Error('Uniwind: You need to pass second parameter to withUniwindConfig')
    }

    if (typeof uniwindConfig.cssEntryFile === 'undefined') {
        throw new Error(
            'Uniwind: You need to pass css css entry file to withUniwindConfig, e.g. withUniwindConfig(config, { cssEntryFile: "./global.css" })',
        )
    }

    return {
        ...config,
        cacheStores: isExpo ? config.cacheStores : [cacheStore],
        transformerPath: require.resolve('./metro-transformer.cjs'),
        transformer: {
            ...config.transformer,
            uniwind: uniwindConfig,
        },
        resolver: {
            ...config.resolver,
            sourceExts: [
                ...config.resolver?.sourceExts ?? [],
                'css',
            ],
            assetExts: config.resolver?.assetExts?.filter(
                ext => ext !== 'css',
            ),
            resolveRequest: (context, moduleName, platform) => {
                const resolver = config.resolver?.resolveRequest ?? context.resolveRequest
                const platformResolver = platform === Platform.Web ? webResolver : nativeResolver
                const resolved = platformResolver({
                    context,
                    moduleName,
                    platform,
                    resolver,
                })

                return resolved
            },
        },
    }
}
