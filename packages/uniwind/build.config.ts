import { defineBuildConfig } from 'unbuild'

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
        {
            builder: 'mkdist',
            input: './src/components',
            outDir: 'dist/components/common',
            ext: 'js',
            format: 'cjs',
        },
        {
            builder: 'mkdist',
            input: './src/components',
            outDir: 'dist/components/module',
            ext: 'js',
            format: 'esm',
        },
        {
            builder: 'mkdist',
            input: './src/',
            outDir: 'dist/common',
            pattern: [
                '**/*',
                '!babel/**',
                '!components/**',
                '!metro/**',
            ],
            ext: 'js',
        },
        {
            builder: 'mkdist',
            input: './src',
            outDir: 'dist/module',
            pattern: [
                '**/*',
                '!babel/**',
                '!components/**',
                '!metro/**',
            ],
            ext: 'js',
        },
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
