import { Scanner } from '@tailwindcss/oxide'
import chokidar, { FSWatcher } from 'chokidar'
import type { MetroConfig } from 'metro-config'
import path from 'path'
import { compileVirtualJS } from './compileVirtualJS'
import { DeepMutable, ExtendedBundler, ExtendedFileSystem, Haste, Platform, UniwindConfig } from './types'

const getVirtualPath = (platform: string) => `${platform}.uniwind.js`

const platforms = [Platform.Android, Platform.iOS]

export const withUniwind = (
    config: DeepMutable<MetroConfig>,
    {
        input = 'global.css',
    } = {} as UniwindConfig,
) => {
    const uniwind = {
        input,
        originalResolveRequest: config.resolver?.resolveRequest,
        originalGetTransformOptions: config.transformer?.getTransformOptions,
        haste: null as Haste | null,
        virtualModulesPossible: new Promise<void>(() => void 0),
        globalWatcher: null as FSWatcher | null,
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

        if (!('filePath' in resolved && resolved.filePath.endsWith(uniwind.input)) || platform === Platform.Web) {
            return resolved
        }

        if (platform !== Platform.iOS && platform !== Platform.Android) {
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
                // @ts-expect-error Hidden property
                uniwind.haste = graph._haste
                // @ts-expect-error Hidden property
                ensureFileSystemPatched(graph._fileSystem)
                ensureBundlerPatched(bundler)
                setupGlobalWatcher()

                await Promise.all(platforms.map(recreateStylesheets))
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
            const virtualJS = uniwind.virtualModules.get(filePath)

            if (virtualJS !== undefined) {
                fileBuffer = Buffer.from(virtualJS)
            }

            return transformFile(filePath, transformOptions, fileBuffer)
        }

        bundler.transformFile.__uniwind_patched = true
    }

    const setupGlobalWatcher = () => {
        if (uniwind.globalWatcher) {
            uniwind.globalWatcher.close()
        }

        const filesToWatch = [
            path.join(process.cwd(), uniwind.input),
            path.join(process.cwd(), '**/*.ts'),
            path.join(process.cwd(), '**/*.tsx'),
            path.join(process.cwd(), '**/*.js'),
            path.join(process.cwd(), '**/*.jsx'),
        ]

        uniwind.globalWatcher = chokidar.watch(filesToWatch, {
            ignoreInitial: true,
            persistent: true,
        })

        uniwind.globalWatcher.on('all', () => {
            platforms.forEach(platform => {
                recreateStylesheets(platform)
            })
        })

        uniwind.globalWatcher.on('raw', () => {
            platforms.forEach(platform => {
                recreateStylesheets(platform)
            })
        })
    }

    const recreateStylesheets = async (platform: Platform) => {
        if (!uniwind.haste) {
            return
        }

        const newJS = await compileVirtualJS(uniwind.input, uniwind.getCandidates, platform)
        const virtualPath = getVirtualPath(platform)

        if (uniwind.virtualModules.get(virtualPath) === newJS) {
            return
        }

        uniwind.virtualModules.set(virtualPath, newJS)
        uniwind.haste.emit('change', {
            eventsQueue: [{
                filePath: virtualPath,
                metadata: {
                    modifiedTime: Date.now(),
                    size: newJS.length,
                    type: 'virtual',
                },
                type: 'change',
            }],
        })
    }

    process.on('exit', () => {
        if (uniwind.globalWatcher) {
            uniwind.globalWatcher.close()
        }
    })

    return config
}
