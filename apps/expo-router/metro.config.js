const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

module.exports = (() => {
    const config = getDefaultConfig(projectRoot)

    config.watchFolders = [
        ...config.watchFolders,
        path.join(workspaceRoot, 'packages/uniwind'),
    ]

    config.resolver.nodeModulesPaths = [
        ...config.resolver.nodeModulesPaths,
        path.join(workspaceRoot, 'node_modules'),
    ]

    return withUniwindConfig(config, { cssEntryFile: 'globals.css', extraThemes: ['sepia'] })
})()
