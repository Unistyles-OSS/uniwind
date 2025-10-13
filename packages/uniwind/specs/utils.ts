import { mock } from 'bun:test'
import { readFileSync } from 'fs'
import { RNStyle } from '../src/core/types'
import { compileVirtual } from '../src/metro/compileVirtual'
import { Platform } from '../src/metro/types'
import { UniwindRuntimeMock } from './mocks'
import path = require('path')

export const getStyleSheetsFromCandidates = async <T extends string>(...candidates: Array<T>) => {
    const cwd = process.cwd()
    const testCSSPath = path.join(cwd, cwd.includes('packages/uniwind') ? '' : 'packages/uniwind', '/specs/test.css')
    const css = readFileSync(testCSSPath, 'utf-8')
    const virtualJS = await compileVirtual({
        css,
        candidates,
        platform: Platform.iOS,
        cssPath: testCSSPath,
        themes: ['light', 'dark'],
    })

    new Function(virtualJS)()

    return globalThis.__uniwind__computeStylesheet(UniwindRuntimeMock)
}

export const getStylesFromCandidates = async <T extends string>(...candidates: Array<T>) => {
    const stylesheets = await getStyleSheetsFromCandidates(...candidates)

    return Object.fromEntries(
        Object.entries(stylesheets).map(([key, value]) => {
            if (!Array.isArray(value)) {
                return null
            }

            return [key, value.map(entry => Object.fromEntries(entry.entries))]
        }).filter(Boolean),
    ) as Record<T, Array<RNStyle>>
}

export const twSize = (size: number) => size * 4

export const injectMocks = () => {
    mock.module('react-native', () => ({
        Dimensions: {
            get: () => ({
                width: UniwindRuntimeMock.screen.width,
                height: UniwindRuntimeMock.screen.height,
            }),
            addEventListener: () => {},
        },
        Appearance: {
            getColorScheme: () => UniwindRuntimeMock.colorScheme,
            addChangeListener: () => {},
        },
        PixelRatio: {
            getFontScale: () => 1,
        },
        I18nManager: {
            isRTL: UniwindRuntimeMock.rtl,
        },
        StyleSheet: {
            hairlineWidth: 1,
        },
        Platform: {
            OS: 'ios',
        },
    }))
    // @ts-expect-error Mock __DEV__
    globalThis.__DEV__ = true
}
