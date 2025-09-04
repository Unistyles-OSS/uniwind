import { describe, expect, test } from 'bun:test'
import { UniwindRuntimeMock } from '../mocks'
import { getStylesFromCandidates, twSize } from '../utils'

describe('Converts tailwind spacings', () => {
    test('Paddings', async () => {
        const styles = await getStylesFromCandidates(
            'p-4',
            'px-4',
            'py-4',
            'pt-4',
            'pb-4',
            'pl-4',
            'pr-4',
            'p-safe',
            'py-safe-or-4',
            'px-safe-offset-4',
        )

        expect(styles['p-4']).toHaveProperty('padding', twSize(4))
        expect(styles['px-4']).toHaveProperty('paddingHorizontal', twSize(4))
        expect(styles['py-4']).toHaveProperty('paddingVertical', twSize(4))
        expect(styles['pt-4']).toHaveProperty('paddingTop', twSize(4))
        expect(styles['pb-4']).toHaveProperty('paddingBottom', twSize(4))
        expect(styles['pl-4']).toHaveProperty('paddingLeft', twSize(4))
        expect(styles['pr-4']).toHaveProperty('paddingRight', twSize(4))
        expect(styles['p-safe']).toHaveProperty('paddingTop', UniwindRuntimeMock.insets.top)
        expect(styles['p-safe']).toHaveProperty('paddingLeft', UniwindRuntimeMock.insets.left)
        expect(styles['p-safe']).toHaveProperty('paddingRight', UniwindRuntimeMock.insets.right)
        expect(styles['p-safe']).toHaveProperty('paddingBottom', UniwindRuntimeMock.insets.bottom)
        expect(styles['py-safe-or-4']).toHaveProperty('paddingTop', UniwindRuntimeMock.insets.top)
        expect(styles['py-safe-or-4']).toHaveProperty('paddingBottom', twSize(4))
        expect(styles['px-safe-offset-4']).toHaveProperty('paddingLeft', UniwindRuntimeMock.insets.left + twSize(4))
        expect(styles['px-safe-offset-4']).toHaveProperty('paddingRight', UniwindRuntimeMock.insets.right + twSize(4))
    })

    test('Margins', async () => {
        const styles = await getStylesFromCandidates(
            'm-4',
            '-mt-4',
        )

        expect(styles['m-4']).toHaveProperty('margin', twSize(4))
        expect(styles['-mt-4']).toHaveProperty('marginTop', -twSize(4))
    })
})
