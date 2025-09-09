import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const TextInput = copyComponentProperties(RNTextInput, (props: TextInputProps) => {
    const style = useStyle(props.className)
    const cursorColor = useUniwindAccent(props.cursorColorClassName)
    const selectionColor = useUniwindAccent(props.selectionColorClassName)
    const placeholderTextColor = useUniwindAccent(props.placeholderTextColorClassName)
    const selectionHandleColor = useUniwindAccent(props.selectionHandleColorClassName)
    const underlineColorAndroid = useUniwindAccent(props.underlineColorAndroidClassName)

    return (
        <RNTextInput
            {...props}
            style={[style, props.style]}
            cursorColor={cursorColor ?? props.cursorColor}
            selectionColor={selectionColor ?? props.selectionColor}
            placeholderTextColor={placeholderTextColor ?? props.placeholderTextColor}
            selectionHandleColor={selectionHandleColor ?? props.selectionHandleColor}
            underlineColorAndroid={underlineColorAndroid ?? props.underlineColorAndroid}
        />
    )
})
