import { TouchableWithoutFeedback as RNTouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const TouchableWithoutFeedback = copyComponentProperties(RNTouchableWithoutFeedback, (props: TouchableWithoutFeedbackProps) => {
    const style = useStyle(props.className)

    return (
        <RNTouchableWithoutFeedback
            {...props}
            style={[style, props.style]}
        />
    )
})

export default TouchableWithoutFeedback
