import { mock } from 'bun:test'
import { RNStyle } from '../src/components/rn/props'
import { compileVirtualJS } from '../src/metro/compileVirtualJS'
import { Platform } from '../src/metro/types'
import { UniwindRuntimeMock } from './mocks'

export const getStyleSheetsFromCandidates = async <T extends string>(...candidates: Array<T>) => {
    const cwd = process.cwd()
    const testCSSPath = cwd.includes('packages/uniwind')
        ? 'specs/test.css'
        : 'packages/uniwind/specs/test.css'
    const virtualJS = await compileVirtualJS(
        testCSSPath,
        () => candidates,
        Platform.iOS,
    )

    new Function(virtualJS)()

    return globalThis.__uniwind__computeStylesheet(UniwindRuntimeMock)
}

export const getStylesFromCandidates = async <T extends string>(...candidates: Array<T>) => {
    const stylesheets = await getStyleSheetsFromCandidates(...candidates)
    const descriptors = Object.getOwnPropertyDescriptors(stylesheets)

    return Object.fromEntries(
        Object.entries(descriptors).map(([key, descriptor]) => {
            const value = descriptor.get?.call(stylesheets) ?? descriptor.value

            if (typeof value !== 'object' || !('entries' in value)) {
                return null
            }

            return [
                key,
                Object.fromEntries(value.entries),
            ]
        }).filter(Boolean),
    ) as Record<T, RNStyle>
}

export const twSize = (size: number) => size * 4

export const injectMocks = () => {
    mock.module('react-native', () => ({
        Dimensions: {
            get: () => ({
                width: UniwindRuntimeMock.screen.width,
                height: UniwindRuntimeMock.screen.height,
            }),
        },
        Appearance: {
            getColorScheme: () => UniwindRuntimeMock.colorScheme,
        },
        PixelRatio: {
            getFontScale: () => UniwindRuntimeMock.rem,
        },
        I18nManager: {
            isRTL: UniwindRuntimeMock.rtl,
        },
    }))
    // @ts-expect-error Mock __DEV__
    globalThis.__DEV__ = true
}
