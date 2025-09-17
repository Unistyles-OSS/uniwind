import { Scanner } from '@tailwindcss/oxide'
import type EventEmitter from 'events'
import type { MetroConfig } from 'metro-config'
import path from 'path'
import { compileVirtual } from './compileVirtual'
import { DeepMutable, ExtendedBundler, ExtendedFileSystem, FileChangeEvent, Platform, UniwindConfig } from './types'

const getVirtualPath = (platform: string) => `${platform}.uniwind.${platform === Platform.Web ? 'css' : 'js'}`
const getPlatformFromVirtualPath = (path: string) => {
    const [, platform] = path.match(/^(\w+)\.uniwind\./) ?? []

    return platform as Platform | undefined
}

const platforms = [Platform.iOS, Platform.Android, Platform.Web]

export const withUniwind = (
    config: DeepMutable<MetroConfig>,
    { input }: UniwindConfig,
) => {
    const uniwind = {
        input,
        originalResolveRequest: config.resolver?.resolveRequest,
        originalGetTransformOptions: config.transformer?.getTransformOptions,
        watcher: null as EventEmitter | null,
        virtualModulesPossible: new Promise<void>(() => void 0),
        virtualModules: new Map<string, string>(),
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
        const resolved = resolver(context, moduleName, platform)

        if (('filePath' in resolved && resolved.filePath !== path.join(process.cwd(), uniwind.input))) {
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
                        const shouldEmitChange = event.eventsQueue.reduce<null | boolean>((acc, event) => {
                            if (acc === false) {
                                return acc
                            }

                            const isJSFile = ['.js', '.jsx', '.ts', '.tsx', '.css'].some(ext => event.filePath.endsWith(ext))

                            if (isJSFile) {
                                const platform = getPlatformFromVirtualPath(event.filePath)

                                if (platform) {
                                    return false
                                }

                                return true
                            }

                            return acc
                        }, null)

                        if (shouldEmitChange) {
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
                    }
                })

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

                    fileBuffer = Buffer.from(virtualFile)
                }
            }

            return transformFile(filePath, transformOptions, fileBuffer)
        }

        bundler.transformFile.__uniwind_patched = true
    }

    const getVirtualFile = async (platform: Platform) => {
        const virtualPath = getVirtualPath(platform)
        const newVirtual = await compileVirtual(uniwind.input, uniwind.getCandidates, platform)

        if (uniwind.virtualModules.get(virtualPath) === newVirtual) {
            return newVirtual
        }

        uniwind.virtualModules.set(virtualPath, newVirtual)

        return newVirtual
    }

    return config
}
