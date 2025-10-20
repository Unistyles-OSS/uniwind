import { describe, expect, test } from 'bun:test'
import { UniwindRuntimeMock } from './mocks'
import { getStyleSheetsFromCandidates, injectMocks, twSize } from './utils'

describe('Converts tailwind spacings', () => {
    injectMocks()

    test('Built in', async () => {
        const className = 'px-4 m-2'

        await getStyleSheetsFromCandidates(...className.split(' '))

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(className).styles

        expect(styles).toHaveProperty('paddingHorizontal', twSize(4))
        expect(styles).toHaveProperty('margin', twSize(2))
    })

    test.only('Custom', async () => {
        const className = 'px-[16px] m-[8px]'

        await getStyleSheetsFromCandidates(...className.split(' '))

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(className).styles

        expect(styles).toHaveProperty('paddingHorizontalStart', 16)
        expect(styles).toHaveProperty('paddingHorizontalEnd', 16)
        expect(styles).toHaveProperty('marginTop', 8)
        expect(styles).toHaveProperty('marginBottom', 8)
        expect(styles).toHaveProperty('marginLeft', 8)
        expect(styles).toHaveProperty('marginRight', 8)
    })

    test('Safe area', async () => {
        const className = 'pt-safe'

        await getStyleSheetsFromCandidates(...className.split(' '))

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(className).styles

        expect(styles).toHaveProperty('paddingTop', UniwindRuntimeMock.insets.top)
    })
})
