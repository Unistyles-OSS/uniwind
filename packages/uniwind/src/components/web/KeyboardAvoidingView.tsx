import { KeyboardAvoidingView as RNKeyboardAvoidingView, KeyboardAvoidingViewProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const KeyboardAvoidingView = copyComponentProperties(RNKeyboardAvoidingView, (props: KeyboardAvoidingViewProps) => {
    return (
        <RNKeyboardAvoidingView
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            contentContainerStyle={[toRNWClassName(props.contentContainerClassName), props.contentContainerStyle]}
        />
    )
})
