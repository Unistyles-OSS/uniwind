import { SafeAreaView as RNSafeAreaView, ViewProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const SafeAreaView = copyComponentProperties(RNSafeAreaView, (props: ViewProps) => {
    return (
        <RNSafeAreaView
            {...props}
            style={[toRNWClassName(props.className), props.style]}
        />
    )
})
