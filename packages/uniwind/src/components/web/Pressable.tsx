import { Pressable as RNPressable, PressableProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const Pressable = copyComponentProperties(RNPressable, (props: PressableProps) => {
    return (
        <RNPressable
            {...props}
            style={state => [toRNWClassName(props.className), typeof props.style === 'function' ? props.style(state) : props.style]}
        />
    )
})
