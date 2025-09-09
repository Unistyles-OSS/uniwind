import { Text as RNText, TextProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const Text = copyComponentProperties(RNText, (props: TextProps) => {
    const selectionColor = useUniwindAccent(props.selectionColorClassName)

    return (
        <RNText
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            selectionColor={selectionColor ?? props.selectionColor}
        />
    )
})
