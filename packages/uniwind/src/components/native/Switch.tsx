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
            thumbColor={thumbColor ?? props.thumbColor}
            trackColor={{ true: trackColorOn ?? props.trackColor?.true, false: trackColorOff ?? props.trackColor?.false }}
            ios_backgroundColor={ios_backgroundColor ?? props.ios_backgroundColor}
        />
    )
})
