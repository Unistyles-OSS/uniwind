import { Text as RNText, TextProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

type StyleWithWebkitLineClamp = {
    WebkitLineClamp?: number
}

export const Text = copyComponentProperties(RNText, (props: TextProps) => {
    const style = useStyle(props.className)
    const selectionColor = useUniwindAccent(props.selectionColorClassName)

    return (
        <RNText
            {...props}
            style={[style, props.style]}
            selectionColor={props.selectionColor ?? selectionColor}
            numberOfLines={(style as StyleWithWebkitLineClamp).WebkitLineClamp ?? props.numberOfLines}
        />
    )
})

export default Text
