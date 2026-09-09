import { UniwindBundlerConfig } from '../../../src/bundler/config'
import { compileNativeCSS } from '../../../src/bundler/css-compiler/compileNativeCSS'
import { Platform, StyleDependency } from '../../../src/common/consts'
import { UniwindListener } from '../../../src/core/listener'
import { UniwindStore } from '../../../src/core/native/store'
import type { GenerateStyleSheetsCallback } from '../../../src/core/types'

const resolvePadding = (width: number) => {
    UniwindStore.runtime.screen = { ...UniwindStore.runtime.screen, width }
    UniwindListener.notify([StyleDependency.Dimensions])

    return UniwindStore.getStyles('probe', {}, {}, { scopedTheme: null, rtl: null, variables: null }).styles.paddingLeft
}

describe.each([Platform.iOS, Platform.Android])('%s media query boundaries', platform => {
    const originalScreen = UniwindStore.runtime.screen

    afterEach(() => {
        UniwindStore.runtime.screen = originalScreen
        UniwindListener.notify([StyleDependency.Dimensions])
    })

    const compileQuery = (query: string) => {
        const config = UniwindBundlerConfig.fromMetroConfig({ cssEntryFile: './tests/test.css' }, platform)
        const code = compileNativeCSS(
            config,
            `
            .probe { padding-left: 16px; }
            @media (${query}) {
                .probe { padding-left: 20px; }
            }
        `,
        )
        const generate: GenerateStyleSheetsCallback = eval(`rt => ${code}`)
        UniwindStore.reinit(generate, ['light', 'dark'])
    }

    test('an exclusive zero bound invalidates cached styles when dimensions change', () => {
        compileQuery('width > 0px')

        expect([0, 0.25, 0].map(resolvePadding)).toEqual([16, 20, 16])
    })

    test.each([
        ['min-width: 402px', [16, 20, 20]],
        ['max-width: 402px', [20, 20, 16]],
    ])('%s remains inclusive', (query, expected) => {
        compileQuery(query)

        expect([401.75, 402, 402.25].map(resolvePadding)).toEqual(expected)
    })

    describe.each([402, 402.5])('boundary %s', boundary => {
        test.each([
            ['>', [16, 16, 20]],
            ['>=', [16, 20, 20]],
            ['<', [20, 16, 16]],
            ['<=', [20, 20, 16]],
        ])('width %s', (operator, expected) => {
            compileQuery(`width ${operator} ${boundary}px`)

            expect([boundary - 0.25, boundary, boundary + 0.25].map(resolvePadding)).toEqual(expected)
        })
    })
})
