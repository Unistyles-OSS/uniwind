import { afterEach, beforeEach } from 'bun:test'
import { RNStyle } from '../src/components/rn/props'
import { compileVirtualJS } from '../src/metro/compileVirtualJS'
import { Platform } from '../src/metro/types'
import { UniwindRuntimeMock } from './mocks'

export const getStylesFromCandidates = async <T extends string>(...candidates: Array<T>) => {
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

    const stylesheets = globalThis.__uniwind__computeStylesheet(UniwindRuntimeMock)
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

beforeEach(() => {
    delete globalThis.__uniwind__computeStylesheet
})

afterEach(() => {
    delete globalThis.__uniwind__computeStylesheet
})
