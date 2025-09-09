import { KeyboardAvoidingView as RNKeyboardAvoidingView, KeyboardAvoidingViewProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const KeyboardAvoidingView = copyComponentProperties(RNKeyboardAvoidingView, (props: KeyboardAvoidingViewProps) => {
    const style = useStyle(props.className)
    const contentContainerStyle = useStyle(props.contentContainerClassName)

    return (
        <RNKeyboardAvoidingView
            {...props}
            style={[style, props.style]}
            contentContainerStyle={[contentContainerStyle, props.contentContainerStyle]}
        />
    )
})
