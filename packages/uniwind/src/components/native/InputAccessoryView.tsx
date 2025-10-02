import { ForwardedRef } from 'react'
import { InputAccessoryView as RNInputAccessoryView, InputAccessoryViewProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const InputAccessoryView = copyComponentProperties(
    RNInputAccessoryView,
    (props: InputAccessoryViewProps & { ref?: ForwardedRef<RNInputAccessoryView> }) => {
        const style = useStyle(props.className)
        const backgroundColor = useUniwindAccent(props.backgroundColorClassName)

        return (
            <RNInputAccessoryView
                {...props}
                backgroundColor={props.backgroundColor ?? backgroundColor}
                style={[style, props.style]}
            />
        )
    },
)

export default InputAccessoryView
