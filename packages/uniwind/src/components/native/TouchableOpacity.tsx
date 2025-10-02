import { TouchableOpacity as RNTouchableOpacity, TouchableOpacityProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const TouchableOpacity = copyComponentProperties(RNTouchableOpacity, (props: TouchableOpacityProps) => {
    const style = useStyle(props.className)

    return (
        <RNTouchableOpacity
            {...props}
            style={[style, props.style]}
        />
    )
})

export default TouchableOpacity
