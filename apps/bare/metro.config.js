const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    watchFolders: [
        path.join(workspaceRoot, 'packages/uniwind'),
        path.join(workspaceRoot, 'node_modules'),
    ],
    resolver: {
        nodeModulesPaths: [
            path.join(projectRoot, 'node_modules'),
            path.join(workspaceRoot, 'node_modules'),
            path.join(workspaceRoot, 'packages/uniwind/node_modules'),
        ],
        unstable_enableSymlinks: true,
        unstable_enablePackageExports: true,
    },
}

module.exports = withUniwindConfig(mergeConfig(getDefaultConfig(__dirname), config), { input: 'global.css' })
