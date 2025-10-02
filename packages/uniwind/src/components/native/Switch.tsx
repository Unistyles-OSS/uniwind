import { Switch as RNSwitch, SwitchProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const Switch = copyComponentProperties(RNSwitch, (props: SwitchProps) => {
    const style = useStyle(props.className)
    const trackColorOn = useUniwindAccent(props.trackColorOnClassName)
    const trackColorOff = useUniwindAccent(props.trackColorOffClassName)
    const thumbColor = useUniwindAccent(props.thumbColorClassName)
    const ios_backgroundColor = useUniwindAccent(props.ios_backgroundColorClassName)

    return (
        <RNSwitch
            {...props}
            style={[style, props.style]}
            thumbColor={props.thumbColor ?? thumbColor}
            trackColor={{ true: props.trackColor?.true ?? trackColorOn, false: props.trackColor?.false ?? trackColorOff }}
            ios_backgroundColor={props.ios_backgroundColor ?? ios_backgroundColor}
        />
    )
})

export default Switch
