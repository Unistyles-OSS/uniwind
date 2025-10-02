import { Scanner } from '@tailwindcss/oxide'
import type EventEmitter from 'events'
import fs from 'fs'
import type { MetroConfig } from 'metro-config'
import path from 'path'
import { compileVirtual } from './compileVirtual'
import { injectThemes } from './injectThemes'
import { nativeResolver, webResolver } from './resolvers'
import { DeepMutable, ExtendedBundler, ExtendedFileSystem, FileChangeEvent, Platform, UniwindConfig } from './types'
import { areSetsEqual } from './utils'

const getVirtualPath = (platform: string) => `${platform}.uniwind.${platform === Platform.Web ? 'css' : 'js'}`
const getPlatformFromVirtualPath = (path: string) => {
    const [, platform] = path.match(/^(\w+)\.uniwind\./) ?? []

    return platform as Platform | undefined
}

const platforms = [Platform.iOS, Platform.Android, Platform.Web]

export const withUniwindConfig = (
    config: DeepMutable<MetroConfig>,
    uniwindConfig: UniwindConfig,
) => {
    if (typeof uniwindConfig === 'undefined') {
        throw new Error('Uniwind: You need to pass second parameter to withUniwindConfig')
    }

    if (typeof uniwindConfig.cssEntryFile === 'undefined') {
        throw new Error(
            'Uniwind: You need to pass css css entry file to withUniwindConfig, e.g. withUniwindConfig(config, { cssEntryFile: "./global.css" })',
        )
    }

    const uniwind = {
        input: path.join(process.cwd(), uniwindConfig.cssEntryFile),
        originalResolveRequest: config.resolver?.resolveRequest,
        originalGetTransformOptions: config.transformer?.getTransformOptions,
        watcher: null as EventEmitter | null,
        virtualModulesPossible: new Promise<void>(() => void 0),
        virtualModules: new Map<string, string>(),
        candidates: new Set<string>(),
        cssFile: '',
        injectedThemesScript: '',
        getCandidates: () =>
            new Scanner({
                sources: [
                    {
                        base: process.cwd(),
                        pattern: '**/*',
                        negated: false,
                    },
                ],
            }).scan(),
    }

    const getInjectedThemesScript = () =>
        injectThemes({
            dtsPath: uniwindConfig.dtsFile,
            themes: uniwindConfig.themes,
            input: uniwind.input,
        })

    uniwind.injectedThemesScript = getInjectedThemesScript()
    config.resolver ??= {}
    config.server ??= {}
    config.transformer ??= {}

    config.resolver.sourceExts = [
        ...config.resolver.sourceExts ?? [],
        'css',
    ]
    config.resolver.assetExts = config.resolver.assetExts?.filter(
        ext => ext !== 'css',
    )
    config.resolver.resolveRequest = (context, moduleName, platform) => {
        const resolver = uniwind.originalResolveRequest ?? context.resolveRequest
        const platformResolver = platform === Platform.Web ? webResolver : nativeResolver
        const resolved = platformResolver({
            context,
            moduleName,
            platform,
            resolver,
        })

        if (('filePath' in resolved && resolved.filePath !== path.join(process.cwd(), uniwindConfig.cssEntryFile))) {
            return resolved
        }

        if (platform !== Platform.iOS && platform !== Platform.Android && platform !== Platform.Web) {
            return resolved
        }

        return {
            ...resolved,
            filePath: getVirtualPath(platform),
        }
    }

    config.server.enhanceMiddleware = (middleware, metroServer) => {
        const bundler = metroServer.getBundler().getBundler()

        uniwind.virtualModulesPossible = bundler
            .getDependencyGraph()
            .then(async graph => {
                uniwind.watcher = bundler.getWatcher()
                // @ts-expect-error Hidden property
                ensureFileSystemPatched(graph._fileSystem)
                ensureBundlerPatched(bundler)

                uniwind.watcher.on('change', (event: FileChangeEvent) => {
                    if ('eventsQueue' in event) {
                        if (
                            // Listen only to changes in JS/TS/css files
                            !event.eventsQueue.some(event => {
                                return ['.js', '.jsx', '.ts', '.tsx', '.css'].some(ext => event.filePath.endsWith(ext))
                            }) || event.eventsQueue.every(event => event.filePath.endsWith('uniwind.css'))
                        ) {
                            return
                        }

                        const css = fs.readFileSync(uniwind.input, 'utf-8')
                        const candidates = new Set(uniwind.getCandidates())
                        const tailwindHasChanged = css !== uniwind.cssFile || !areSetsEqual(uniwind.candidates, candidates)

                        if (!tailwindHasChanged) {
                            return
                        }

                        uniwind.injectedThemesScript = getInjectedThemesScript()
                        uniwind.cssFile = css
                        uniwind.candidates = candidates
                        platforms.forEach(platform => {
                            uniwind.watcher?.emit(
                                'change',
                                {
                                    eventsQueue: [{
                                        filePath: getVirtualPath(platform),
                                        metadata: {
                                            modifiedTime: Date.now(),
                                            size: 1,
                                            type: 'virtual',
                                        },
                                        type: 'change',
                                    }],
                                } satisfies FileChangeEvent,
                            )
                        })
                    }
                })

                uniwind.cssFile = fs.readFileSync(uniwind.input, 'utf-8')
                uniwind.candidates = new Set(uniwind.getCandidates())

                await Promise.all(platforms.map(getVirtualFile))
            })

        return middleware
    }

    const ensureFileSystemPatched = (fs: ExtendedFileSystem) => {
        if (!fs.getSha1.__uniwind_patched) {
            const original_getSha1 = fs.getSha1.bind(fs)

            fs.getSha1 = filename => {
                if (uniwind.virtualModules.has(filename)) {
                    return `${filename}-${Date.now()}`
                }

                return original_getSha1(filename)
            }
            fs.getSha1.__uniwind_patched = true
        }

        return fs
    }

    const ensureBundlerPatched = (bundler: ExtendedBundler) => {
        if (bundler.transformFile.__uniwind_patched) {
            return
        }

        const transformFile = bundler.transformFile.bind(bundler)

        bundler.transformFile = async (
            filePath,
            transformOptions,
            fileBuffer,
        ) => {
            const isVirtualFile = uniwind.virtualModules.has(filePath)

            if (isVirtualFile) {
                const platform = getPlatformFromVirtualPath(filePath)

                if (platform) {
                    const virtualFile = await getVirtualFile(platform)

                    fileBuffer = Buffer.from([
                        virtualFile,
                        platform !== Platform.Web ? uniwind.injectedThemesScript : '',
                    ].join(''))
                }
            }

            return transformFile(filePath, transformOptions, fileBuffer)
        }

        bundler.transformFile.__uniwind_patched = true
    }

    const getVirtualFile = async (platform: Platform) => {
        const virtualFile = await compileVirtual({
            candidates: Array.from(uniwind.candidates),
            cssPath: uniwind.input,
            css: uniwind.cssFile,
            platform,
        })

        uniwind.virtualModules.set(getVirtualPath(platform), virtualFile)

        return virtualFile
    }

    return config
}
