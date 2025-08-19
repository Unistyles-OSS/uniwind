const path = require('path')
const pak = require('../../packages/uniwind/package.json')

module.exports = function(api) {
    api.cache(true)

    return {
        presets: ['module:@react-native/babel-preset'],
        plugins: [
            `${pak.name}/babel`,
            [
                'module-resolver',
                {
                    alias: {
                        [pak.name]: path.resolve(__dirname, '../../packages/uniwind/src'),
                    },
                },
            ],
        ],
    }
}
