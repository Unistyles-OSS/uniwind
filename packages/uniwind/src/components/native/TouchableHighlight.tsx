import { TouchableHighlight as RNTouchableHighlight, TouchableHighlightProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const TouchableHighlight = copyComponentProperties(RNTouchableHighlight, (props: TouchableHighlightProps) => {
    const style = useStyle(props.className)
    const underlayColor = useUniwindAccent(props.underlayColorClassName)

    return (
        <RNTouchableHighlight
            {...props}
            style={[style, props.style]}
            underlayColor={underlayColor ?? props.underlayColor}
        />
    )
})
