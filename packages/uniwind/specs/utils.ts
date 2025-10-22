import { mock } from 'bun:test'
import { readFileSync } from 'fs'
import { compileVirtual } from '../src/metro/compileVirtual'
import { Platform } from '../src/metro/types'
import { UniwindRuntimeMock } from './mocks'
import path = require('path')
import type { GenerateStyleSheetsCallback } from '../src/core/types'

export const getStyleSheetsFromCandidates = async <T extends string>(...candidates: Array<T>) => {
    const cwd = process.cwd()
    const testCSSPath = path.join(cwd, cwd.includes('packages/uniwind') ? '' : 'packages/uniwind', '/specs/test.css')
    const css = readFileSync(testCSSPath, 'utf-8')
    const virtualJS = await compileVirtual({
        css,
        candidates,
        platform: Platform.iOS,
        cssPath: testCSSPath,
        polyfills: {},
        themes: ['light', 'dark'],
    })

    const { UniwindStore } = await import('../src/core/native')

    UniwindStore.reinit(new Function('rt', `return ${virtualJS}`) as GenerateStyleSheetsCallback)
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
