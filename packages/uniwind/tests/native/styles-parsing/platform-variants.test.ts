import { UniwindBundlerConfig } from '../../../src/bundler/config'
import { addMetaToStylesTemplate, ProcessorBuilder } from '../../../src/bundler/css-processor'
import { Platform, UNIWIND_PLATFORM_VARIABLES } from '../../../src/common/consts'

const compile = (css: string, platform = Platform.iOS) => {
    const bundlerConfig = UniwindBundlerConfig.fromMetroConfig({
        cssEntryFile: './tests/test.css',
    }, platform)
    const processor = new ProcessorBuilder(bundlerConfig)

    processor.transform(css)

    return {
        stylesheets: processor.stylesheets,
        vars: processor.vars,
        scopedVars: processor.scopedVars,
        bundle: Object.keys(addMetaToStylesTemplate(processor, platform)).sort(),
    }
}

// Tailwind < 4.3.3 nests the platform query under each class, Tailwind >= 4.3.3 hoists
// the query and groups every class that uses it into one block. The processor must read both.
const shapes = [
    [
        'nested',
        [
            '.ios\\:w-4 { @media ios { width: 16px; } }',
            '.ios\\:underline { @media ios { text-decoration-line: underline; } }',
            '.ios\\:active\\:opacity-50 { @media ios { &:active { opacity: 0.5; } } }',
            '.android\\:border-b { @media android { border-bottom-width: 1px; } }',
            '.android\\:py-2 { @media android { padding-block: 8px; } }',
            '.native\\:mt-1 { @media native { margin-top: 4px; } }',
            '.native\\:mb-2 { @media native { margin-bottom: 8px; } }',
            '.tv\\:mt-1 { @media tv { margin-top: 4px; } }',
            '.tv\\:mb-2 { @media tv { margin-bottom: 8px; } }',
            '.android-tv\\:p-1 { @media android-tv { padding: 4px; } }',
            '.android-tv\\:p-2 { @media android-tv { padding: 8px; } }',
            '.apple-tv\\:p-1 { @media apple-tv { padding: 4px; } }',
            '.apple-tv\\:p-2 { @media apple-tv { padding: 8px; } }',
            '.sm\\:ios\\:p-2 { @media (width >= 40rem) { @media ios { padding: 8px; } } }',
        ].join('\n'),
    ],
    [
        'hoisted',
        [
            '@media ios {',
            '    .ios\\:w-4 { width: 16px; }',
            '    .ios\\:underline { text-decoration-line: underline; }',
            '    .ios\\:active\\:opacity-50:active { opacity: 0.5; }',
            '}',
            '@media android {',
            '    .android\\:border-b { border-bottom-width: 1px; }',
            '    .android\\:py-2 { padding-block: 8px; }',
            '}',
            '@media native {',
            '    .native\\:mt-1 { margin-top: 4px; }',
            '    .native\\:mb-2 { margin-bottom: 8px; }',
            '}',
            '@media tv {',
            '    .tv\\:mt-1 { margin-top: 4px; }',
            '    .tv\\:mb-2 { margin-bottom: 8px; }',
            '}',
            '@media android-tv {',
            '    .android-tv\\:p-1 { padding: 4px; }',
            '    .android-tv\\:p-2 { padding: 8px; }',
            '}',
            '@media apple-tv {',
            '    .apple-tv\\:p-1 { padding: 4px; }',
            '    .apple-tv\\:p-2 { padding: 8px; }',
            '}',
            '@media (width >= 40rem) {',
            '    @media ios {',
            '        .sm\\:ios\\:p-2 { padding: 8px; }',
            '    }',
            '}',
        ].join('\n'),
    ],
] as const

const wrappers = [
    ['@layer utilities', (css: string) => `@layer utilities { ${css} }`],
    ['@supports', (css: string) => `@supports (display: grid) { ${css} }`],
] as const

describe('Platform variants', () => {
    describe.each(shapes)('%s media queries', (_shape, css) => {
        test('every class in a block keeps its platform', () => {
            const { stylesheets } = compile(css)

            expect(stylesheets['ios:w-4'][0].platform).toBe(Platform.iOS)
            expect(stylesheets['ios:underline'][0].platform).toBe(Platform.iOS)
            expect(stylesheets['android:border-b'][0].platform).toBe(Platform.Android)
            expect(stylesheets['android:py-2'][0].platform).toBe(Platform.Android)
            expect(stylesheets['native:mt-1'][0].platform).toBe(Platform.Native)
            expect(stylesheets['native:mb-2'][0].platform).toBe(Platform.Native)
            expect(stylesheets['tv:mt-1'][0].platform).toBe(Platform.TV)
            expect(stylesheets['tv:mb-2'][0].platform).toBe(Platform.TV)
            expect(stylesheets['android-tv:p-1'][0].platform).toBe(Platform.AndroidTV)
            expect(stylesheets['android-tv:p-2'][0].platform).toBe(Platform.AndroidTV)
            expect(stylesheets['apple-tv:p-1'][0].platform).toBe(Platform.AppleTV)
            expect(stylesheets['apple-tv:p-2'][0].platform).toBe(Platform.AppleTV)
        })

        test('a state variant inside the block keeps both conditions', () => {
            const [style] = compile(css).stylesheets['ios:active:opacity-50']

            expect(style.platform).toBe(Platform.iOS)
            expect(style.active).toBe(true)
            expect(style.opacity).toBe(0.5)
        })

        test('a platform query nested in a width query keeps both conditions', () => {
            const [style] = compile(css).stylesheets['sm:ios:p-2']

            expect(style.platform).toBe(Platform.iOS)
            expect(style.minWidth).toBe(640)
        })

        test.each([
            [Platform.iOS, ['ios:active:opacity-50', 'ios:underline', 'ios:w-4', 'native:mb-2', 'native:mt-1', 'sm:ios:p-2']],
            [Platform.Android, ['android:border-b', 'android:py-2', 'native:mb-2', 'native:mt-1']],
            [Platform.AndroidTV, ['android-tv:p-1', 'android-tv:p-2', 'tv:mb-2', 'tv:mt-1']],
            [Platform.AppleTV, ['apple-tv:p-1', 'apple-tv:p-2', 'tv:mb-2', 'tv:mt-1']],
        ])('the %s bundle ships its own and its common platform classes only', (platform, expected) => {
            expect(compile(css, platform).bundle).toEqual(expected)
        })
    })

    test('a :root rule inside a platform block scopes its variables to that platform', () => {
        const { vars, scopedVars } = compile('@media ios { :root { --x: 1px; } }')

        expect(scopedVars[`${UNIWIND_PLATFORM_VARIABLES}${Platform.iOS}`]).toEqual({ '--x': 1 })
        expect(vars).not.toHaveProperty('--x')
    })

    test('a class after a :root rule in the same block is still a class', () => {
        const { stylesheets, vars, bundle } = compile('@media ios { :root { --x: 1px; } .ios\\:w-4 { width: 16px; } }')

        expect(stylesheets['ios:w-4'][0].width).toBe(16)
        expect(vars).not.toHaveProperty('width')
        expect(bundle).toEqual(['ios:w-4'])
    })

    describe.each(wrappers)('inside %s', (_wrapper, wrap) => {
        test('a class after a :root rule is still a class', () => {
            const { stylesheets, vars, bundle } = compile(wrap(':root { --x: 1px; } .w-4 { width: 16px; }'))

            expect(stylesheets['w-4'][0].width).toBe(16)
            expect(vars).not.toHaveProperty('width')
            expect(bundle).toEqual(['w-4'])
        })

        test('a class after a :root rule with a nested platform block is still a class', () => {
            const { stylesheets, vars, bundle } = compile(wrap(':root { @media ios { --x: 1px; } } .w-4 { width: 16px; }'))

            expect(stylesheets['w-4'][0].width).toBe(16)
            expect(vars).not.toHaveProperty('width')
            expect(bundle).toEqual(['w-4'])
        })
    })

    test('declarations after a nested media block still belong to the class', () => {
        const { stylesheets, vars } = compile('.w-4 { @media ios { width: 16px; } height: 8px; }')

        expect(stylesheets['w-4'].map(style => [style.platform, style.width, style.height])).toEqual([
            [Platform.iOS, 16, undefined],
            [null, undefined, 8],
        ])
        expect(vars).not.toHaveProperty('height')
    })
})
