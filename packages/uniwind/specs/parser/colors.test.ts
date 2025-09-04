import { describe, expect, test } from 'bun:test'
import { getStylesFromCandidates } from '../utils'

describe('Converts tailwind colors to hex', () => {
    test('Tailwind built-in', async () => {
        const styles = await getStylesFromCandidates(
            'bg-red-500',
            'border-blue-500',
            'text-black',
            'bg-red-500/50',
            'bg-current',
        )

        expect(styles['bg-red-500']).toHaveProperty('backgroundColor', '#fb2c36')
        expect(styles['border-blue-500']).toHaveProperty('borderColor', '#2b7fff')
        expect(styles['text-black']).toHaveProperty('color', '#000000')
        expect(styles['bg-red-500/50']).toHaveProperty('backgroundColor', '#fb2c3680')
        expect(styles['bg-current']).toHaveProperty('backgroundColor', '#000000')
    })

    test('Custom colors', async () => {
        const styles = await getStylesFromCandidates(
            'bg-[#ff0000]',
            'bg-[#ff000080]',
            'bg-[rgb(255, 0, 0)]',
            'bg-[rgba(0, 255, 0, 0.5)]',
            'bg-[red]',
            'bg-[hsl(0, 100%, 50%)]',
            'bg-[hsla(0, 100%, 50%, 0.5)]',
        )

        expect(styles['bg-[#ff0000]']).toHaveProperty('backgroundColor', '#ff0000')
        expect(styles['bg-[#ff000080]']).toHaveProperty('backgroundColor', '#ff000080')
        expect(styles['bg-[rgb(255, 0, 0)]']).toHaveProperty('backgroundColor', '#ff0000')
        expect(styles['bg-[rgba(0, 255, 0, 0.5)]']).toHaveProperty('backgroundColor', '#00ff0080')
        expect(styles['bg-[red]']).toHaveProperty('backgroundColor', '#ff0000')
        expect(styles['bg-[hsl(0, 100%, 50%)]']).toHaveProperty('backgroundColor', '#ff0000')
        expect(styles['bg-[hsla(0, 100%, 50%, 0.5)]']).toHaveProperty('backgroundColor', '#ff000080')
    })
})
