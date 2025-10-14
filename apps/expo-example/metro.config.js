const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

module.exports = (async () => {
    const config = await getDefaultConfig(projectRoot)

    config.watchFolders = [
        path.join(workspaceRoot, 'packages/uniwind'),
    ]

    config.resolver.nodeModulesPaths = [
        path.join(projectRoot, 'node_modules'),
        path.join(workspaceRoot, 'node_modules'),
    ]

    return withUniwindConfig(config, { cssEntryFile: 'global.css', extraThemes: ['premium'], polyfills: { rem: 14 } })
})()
