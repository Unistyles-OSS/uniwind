import { Text as RNText, TextProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const Text = copyComponentProperties(RNText, (props: TextProps) => {
    return (
        <RNText
            {...props}
            style={[toRNWClassName(props.className), props.style]}
        />
    )
})

export default Text
