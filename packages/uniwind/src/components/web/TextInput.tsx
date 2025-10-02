import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const TextInput = copyComponentProperties(RNTextInput, (props: TextInputProps) => {
    return (
        <RNTextInput
            {...props}
            style={[toRNWClassName(props.className), props.style]}
        />
    )
})

export default TextInput
