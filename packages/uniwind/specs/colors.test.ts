import { describe, expect, test } from 'bun:test'
import { getStyleSheetsFromCandidates, injectMocks } from './utils'

describe('Converts tailwind colors to hex', () => {
    injectMocks()

    test('Tailwind built-in', async () => {
        const className = 'bg-red-500 border-blue-500/50 text-black'

        await getStyleSheetsFromCandidates(...className.split(' '))

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(className).styles

        expect(styles).toHaveProperty('backgroundColor', '#fb2c36')
        expect(styles).toHaveProperty('borderColor', '#2b7fff80')
        expect(styles).toHaveProperty('color', '#000000')
    })

    test('Custom colors', async () => {
        const className = 'bg-[#ff0000] text-[#ff000080]'

        await getStyleSheetsFromCandidates(...className.split(' '))

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(className).styles

        expect(styles).toHaveProperty('backgroundColor', '#ff0000')
        expect(styles).toHaveProperty('color', '#ff000080')
    })
})
