import { describe, expect, test } from 'bun:test'
import { getStyleSheetsFromCandidates, injectMocks } from '../utils'

describe('Converts tailwind shadow system', () => {
    injectMocks()

    test('Shadow', async () => {
        await getStyleSheetsFromCandidates(
            'shadow-xl',
        )

        const { UniwindStore } = await import('../../src/core')
        const styles = UniwindStore.getStyles('shadow-xl').styles

        expect(styles).toEqual({
            boxShadow: [
                {
                    offsetX: 0,
                    offsetY: 20,
                    color: '#0000001a',
                    inset: false,
                    blurRadius: 25,
                    spreadDistance: -5,
                },
                {
                    offsetX: 0,
                    offsetY: 8,
                    color: '#0000001a',
                    inset: false,
                    blurRadius: 10,
                    spreadDistance: -6,
                },
            ],
        })
    })

    test('Colored shadow', async () => {
        const candidates = [
            'shadow-xl',
            'shadow-red-500/50',
        ]

        await getStyleSheetsFromCandidates(...candidates)

        const { UniwindStore } = await import('../../src/core')
        const styles = UniwindStore.getStyles(candidates.join(' ')).styles

        expect(styles).toEqual({
            boxShadow: [
                {
                    offsetX: 0,
                    offsetY: 20,
                    color: '#fb2c3680',
                    inset: false,
                    blurRadius: 25,
                    spreadDistance: -5,
                },
                {
                    offsetX: 0,
                    offsetY: 8,
                    color: '#fb2c3680',
                    inset: false,
                    blurRadius: 10,
                    spreadDistance: -6,
                },
            ],
        })
    })

    test('Ring', async () => {
        await getStyleSheetsFromCandidates('ring-2')

        const { UniwindStore } = await import('../../src/core')
        const styles = UniwindStore.getStyles('ring-2').styles

        expect(styles).toEqual({
            boxShadow: [
                {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#000000',
                    inset: false,
                    blurRadius: 0,
                    spreadDistance: 2,
                },
            ],
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

        const { UniwindStore } = await import('../../src/core')
        const styles = UniwindStore.getStyles(candidates.join(' ')).styles

        expect(styles).toEqual({
            boxShadow: [
                {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#ffc9c9',
                    inset: false,
                    blurRadius: 0,
                    spreadDistance: 4,
                },
                {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#00c950',
                    inset: false,
                    blurRadius: 0,
                    spreadDistance: 8,
                },
            ],
        })
    })

    test('Ring inset colored', async () => {
        const candidates = [
            'ring-4',
            'ring-inset',
            'ring-blue-500',
        ]
        await getStyleSheetsFromCandidates(...candidates)

        const { UniwindStore } = await import('../../src/core')
        const styles = UniwindStore.getStyles(candidates.join(' ')).styles

        expect(styles).toEqual({
            boxShadow: [
                {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#2b7fff',
                    blurRadius: 0,
                    spreadDistance: 4,
                    inset: true,
                },
            ],
        })
    })
})
