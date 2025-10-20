import { describe, expect, test } from 'bun:test'
import { getStyleSheetsFromCandidates, injectMocks } from './utils'

describe('Converts tailwind shadow system', () => {
    injectMocks()

    test('Shadow', async () => {
        await getStyleSheetsFromCandidates(
            'shadow-xl',
        )

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles('shadow-xl').styles

        expect(styles).toEqual({
            boxShadow:
                '0px 0px #00000000, 0px 0px #00000000, 0px 0px #00000000, 0px 0px #00000000, 0px 20px 25px -5px #0000001a, 0px 8px 10px -6px #0000001a',
        })
    })

    test('Colored shadow', async () => {
        const candidates = [
            'shadow-xl',
            'shadow-red-500/50',
        ]

        await getStyleSheetsFromCandidates(...candidates)

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(candidates.join(' ')).styles

        expect(styles).toEqual({
            boxShadow:
                '0px 0px #00000000, 0px 0px #00000000, 0px 0px #00000000, 0px 0px #00000000, 0px 20px 25px -5px #fb2c3680, 0px 8px 10px -6px #fb2c3680',
        })
    })

    test('Ring', async () => {
        await getStyleSheetsFromCandidates('ring-2')

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles('ring-2').styles

        expect(styles).toEqual({
            boxShadow: '0px 0px #00000000, 0px 0px #00000000, 0px 0px #00000000,  0px 0px 0px 2px #000000, 0px 0px #00000000',
        })
    })

    test('Ring + Ring offset different colors', async () => {
        const candidates = [
            'ring-4',
            'ring-green-500',
            'ring-offset-4',
            'ring-offset-red-200',
        ]

        await getStyleSheetsFromCandidates(...candidates)

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(candidates.join(' ')).styles

        expect(styles).toEqual({
            boxShadow: '0px 0px #00000000, 0px 0px #00000000,  0px 0px 0px 4px #ffc9c9,  0px 0px 0px 8px #00c950, 0px 0px #00000000',
        })
    })

    test('Ring inset colored', async () => {
        const candidates = [
            'ring-4',
            'ring-inset',
            'ring-blue-500',
        ]
        await getStyleSheetsFromCandidates(...candidates)

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(candidates.join(' ')).styles

        expect(styles).toEqual({
            boxShadow: '0px 0px #00000000, 0px 0px #00000000, 0px 0px #00000000, inset 0px 0px 0px 4px #2b7fff, 0px 0px #00000000',
        })
    })
})
