import { CustomResolutionContext, CustomResolver } from 'metro-resolver'
import { basename, resolve, sep } from 'node:path'
import { name } from '../../package.json'

type ResolverConfig = {
    platform: string | null
    resolver: CustomResolver
    context: CustomResolutionContext
    moduleName: string
}

const thisModuleDist = resolve(__dirname, '../../dist')
const thisModuleSrc = resolve(__dirname, '../../src')

const isFromThisModule = (filename: string) => filename.startsWith(thisModuleDist) || filename.startsWith(thisModuleSrc)

const DEFAULT_RN_COMPONENTS = [
    'View',
]

export const nativeResolver = ({
    context,
    moduleName,
    platform,
    resolver,
}: ResolverConfig) => {
    const resolution = resolver(context, moduleName, platform)
    const isInternal = isFromThisModule(context.originModulePath)
    const isReactNativeIndex = context.originModulePath.endsWith(
        `react-native${sep}index.js`,
    )

    if (isInternal || resolution.type !== 'sourceFile' || isReactNativeIndex) {
        return resolution
    }

    if (moduleName === 'react-native') {
        return resolver(context, `${name}/components`, platform)
    }

    if (
        resolution.filePath.includes(`${sep}react-native${sep}Libraries${sep}`)
    ) {
        const filename = basename(resolution.filePath.split(sep).at(-1) ?? '')
        const module = filename.split('.').at(0)

        if (module !== undefined && DEFAULT_RN_COMPONENTS.includes(module)) {
            return resolver(context, `${name}/components/${module}`, platform)
        }
    }

    return resolution
}
