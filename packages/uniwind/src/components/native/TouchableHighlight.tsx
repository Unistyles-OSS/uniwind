import { useState } from 'react'
import { TouchableHighlight as RNTouchableHighlight, TouchableHighlightProps } from 'react-native'
import { ComponentState } from '../../core/types'
import { useUniwindAccent } from '../../hooks/useUniwindAccent.native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const TouchableHighlight = copyComponentProperties(RNTouchableHighlight, (props: TouchableHighlightProps) => {
    const [isPressed, setIsPressed] = useState(false)
    const state = {
        isDisabled: Boolean(props.disabled),
        isPressed,
    } satisfies ComponentState
    const style = useStyle(props.className, state)
    const underlayColor = useUniwindAccent(props.underlayColorClassName, state)

    return (
        <RNTouchableHighlight
            {...props}
            style={[style, props.style]}
            underlayColor={props.underlayColor ?? underlayColor}
            onPressIn={event => {
                setIsPressed(true)
                props.onPressIn?.(event)
            }}
            onPressOut={event => {
                setIsPressed(false)
                props.onPressOut?.(event)
            }}
        />
    )
})

export default TouchableHighlight
