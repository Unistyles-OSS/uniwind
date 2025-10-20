import { describe, expect, test } from 'bun:test'
import { getStyleSheetsFromCandidates, injectMocks } from './utils'

describe('Converts tailwind linear gradients', () => {
    injectMocks()

    test('Linear to bottom', async () => {
        const className = 'bg-gradient-to-b from-indigo-500 to-pink-500'

        await getStyleSheetsFromCandidates(...className.split(' '))

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(className).styles

        expect(styles).toEqual({
            experimental_backgroundImage: [
                {
                    colorStops: [
                        {
                            color: '#615fff',
                            positions: [
                                '0%',
                            ],
                        },
                        {
                            color: '#f6339a',
                            positions: [
                                '100%',
                            ],
                        },
                    ],
                    type: 'linear-gradient',
                    direction: 'to bottom',
                },
            ],
        })
    })

    test('Linear to right 3 colors', async () => {
        const className = 'bg-gradient-to-r from-indigo-500 to-pink-500 via-sky-500'

        await getStyleSheetsFromCandidates(...className.split(' '))

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(className).styles

        expect(styles).toEqual({
            experimental_backgroundImage: [
                {
                    colorStops: [
                        {
                            color: '#615fff',
                            positions: [
                                '0%',
                            ],
                        },
                        {
                            color: '#00a6f4',
                            positions: [
                                '50%',
                            ],
                        },
                        {
                            color: '#f6339a',
                            positions: [
                                '100%',
                            ],
                        },
                    ],
                    type: 'linear-gradient',
                    direction: 'to right',
                },
            ],
        })
    })

    test('Linear 150deg', async () => {
        const className = 'bg-linear-150 from-orange-500 to-indigo-600'

        await getStyleSheetsFromCandidates(...className.split(' '))

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(className).styles

        expect(styles).toEqual({
            experimental_backgroundImage: [
                {
                    colorStops: [
                        {
                            color: '#ff6900',
                            positions: [
                                '0%',
                            ],
                        },
                        {
                            color: '#4f39f6',
                            positions: [
                                '100%',
                            ],
                        },
                    ],
                    type: 'linear-gradient',
                    direction: '150deg',
                },
            ],
        })
    })

    test('Linear custom multiple colors', async () => {
        const className = 'bg-linear-[25deg,red_5%,yellow_60%,lime_90%,teal]'

        await getStyleSheetsFromCandidates(...className.split(' '))

        const { UniwindStore } = await import('../src/core/native')
        const styles = UniwindStore.getStyles(className).styles

        expect(styles).toEqual({
            experimental_backgroundImage: [
                {
                    colorStops: [
                        {
                            color: '#ff0000',
                            positions: [
                                '5%',
                            ],
                        },
                        {
                            color: '#ffff00',
                            positions: [
                                '60%',
                            ],
                        },
                        {
                            color: '#00ff00',
                            positions: [
                                '90%',
                            ],
                        },
                        {
                            color: '#008080',
                            positions: undefined,
                        },
                    ],
                    type: 'linear-gradient',
                    direction: '25deg',
                },
            ],
        })
    })
})
