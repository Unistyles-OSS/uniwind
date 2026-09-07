import * as React from 'react'
import View from '../../../src/components/native/View'
import { TW_SPACING } from '../../consts'
import { renderUniwind } from '../utils'

// The suite compiles for iOS, so android: classes must never reach these styles.
describe('Platform variants', () => {
    test('only the current platform and native variants apply', () => {
        const { getStylesFromId } = renderUniwind(
            <React.Fragment>
                <View
                    className="ios:p-4 android:p-2 android:m-3 ios:m-1"
                    testID="two-platforms"
                />
                <View
                    className="native:w-4 android:h-4 native:h-2"
                    testID="native"
                />
                <View
                    className="android:opacity-50 android:rounded-lg android:border-2"
                    testID="android-only"
                />
            </React.Fragment>,
        )

        expect(getStylesFromId('two-platforms').padding).toBe(4 * TW_SPACING)
        expect(getStylesFromId('two-platforms').margin).toBe(1 * TW_SPACING)
        expect(getStylesFromId('native').width).toBe(4 * TW_SPACING)
        expect(getStylesFromId('native').height).toBe(2 * TW_SPACING)
        expect(getStylesFromId('android-only')).toEqual({})
    })
})
