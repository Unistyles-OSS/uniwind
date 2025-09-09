import { SafeAreaView as RNSafeAreaView, ViewProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const SafeAreaView = copyComponentProperties(RNSafeAreaView, (props: ViewProps) => {
    const style = useStyle(props.className)

    return (
        <RNSafeAreaView
            {...props}
            style={[style, props.style]}
        />
    )
})
