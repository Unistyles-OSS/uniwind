import { TouchableNativeFeedback as RNTouchableNativeFeedback, TouchableNativeFeedbackProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const TouchableNativeFeedback = copyComponentProperties(
    RNTouchableNativeFeedback,
    (props: TouchableNativeFeedbackProps) => {
        const style = useStyle(props.className)

        return (
            <RNTouchableNativeFeedback
                {...props}
                style={[style, props.style]}
            />
        )
    },
)

export default TouchableNativeFeedback
