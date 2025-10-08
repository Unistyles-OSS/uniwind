import { useState } from 'react'
import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import { ComponentState } from '../../core/types'
import { useUniwindAccent } from '../../hooks/useUniwindAccent.native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const TextInput = copyComponentProperties(RNTextInput, (props: TextInputProps) => {
    const [isFocused, setIsFocused] = useState(false)
    const [isPressed, setIsPressed] = useState(false)
    const state = {
        isDisabled: props.editable === false,
        isFocused,
        isPressed,
    } satisfies ComponentState
    const style = useStyle(props.className, state)
    const cursorColor = useUniwindAccent(props.cursorColorClassName, state)
    const selectionColor = useUniwindAccent(props.selectionColorClassName, state)
    const placeholderTextColor = useUniwindAccent(props.placeholderTextColorClassName, state)
    const selectionHandleColor = useUniwindAccent(props.selectionHandleColorClassName, state)
    const underlineColorAndroid = useUniwindAccent(props.underlineColorAndroidClassName, state)

    return (
        <RNTextInput
            {...props}
            style={[style, props.style]}
            cursorColor={props.cursorColor ?? cursorColor}
            selectionColor={props.selectionColor ?? selectionColor}
            placeholderTextColor={props.placeholderTextColor ?? placeholderTextColor}
            selectionHandleColor={props.selectionHandleColor ?? selectionHandleColor}
            underlineColorAndroid={props.underlineColorAndroid ?? underlineColorAndroid}
            onFocus={event => {
                setIsFocused(true)
                props.onFocus?.(event)
            }}
            onBlur={event => {
                setIsFocused(false)
                props.onBlur?.(event)
            }}
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

export default TextInput
