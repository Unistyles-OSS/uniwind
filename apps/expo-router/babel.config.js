const path = require('path')
const pak = require('../../packages/uniwind/package.json')

module.exports = function(api) {
    api.cache(true)

    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        [pak.name]: path.resolve(__dirname, '../../packages/uniwind/src'),
                        'culori': 'culori/require',
                    },
                },
            ],
        ],
    }
}
