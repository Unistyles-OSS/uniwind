import { BuildConfig, defineBuildConfig } from 'unbuild'

type Config = {
    input: string
    outDir: string
    pattern?: Array<string>
    declaration?: boolean
}

const getConfig = (config: Config) =>
    [
        {
            builder: 'mkdist',
            input: config.input,
            outDir: `${config.outDir}/common`,
            ext: 'js',
            format: 'cjs',
            pattern: config.pattern,
        },
        {
            builder: 'mkdist',
            input: config.input,
            outDir: `${config.outDir}/module`,
            ext: 'js',
            format: 'esm',
            pattern: config.pattern,
            declaration: config.declaration,
        },
    ] satisfies Array<BuildConfig['entries'][number]>

export default defineBuildConfig({
    entries: [
        {
            builder: 'rollup',
            input: './src/metro',
            name: 'metro/index',
        },
        {
            builder: 'rollup',
            input: './src/babel',
            name: 'babel/index',
        },
        ...getConfig({
            input: './src/components',
            outDir: 'dist/components',
        }),
        ...getConfig({
            input: './src',
            outDir: 'dist',
            pattern: [
                '**/*',
                '!babel/**',
                '!components/**',
                '!metro/**',
            ],
            declaration: true,
        }),
    ],
    outDir: 'dist',
    clean: true,
    externals: [
        /@tailwindcss/,
    ],
    rollup: {
        emitCJS: true,
        output: {
            format: 'cjs',
        },
    },
    dependencies: [
        '@tailwindcss',
    ],
})
