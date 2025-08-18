import { codemaskConfig } from 'eslint-config-codemask'

export default [
    ...codemaskConfig,
    {
        rules: {
            'functional/immutable-data': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-underscore-dangle': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            'camelcase': 'off',
            'no-param-reassign': 'off',
            'functional/functional-parameters': 'off',
            'functional/no-let': 'off',
            'functional/no-loop-statements': 'off',
        },
    },
    {
        ignores: [
            'eslint.config.ts',
            'build.config.ts',
            'types.d.ts',
            'dist',
        ],
    },
]
