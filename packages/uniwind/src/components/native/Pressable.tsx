import { Pressable as RNPressable, PressableProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const Pressable = copyComponentProperties(RNPressable, (props: PressableProps) => {
    const style = useStyle(props.className)

    return (
        <RNPressable
            {...props}
            style={state => [style, typeof props.style === 'function' ? props.style(state) : props.style]}
        />
    )
})
