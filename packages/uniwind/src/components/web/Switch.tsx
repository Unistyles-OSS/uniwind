import { Switch as RNSwitch, SwitchProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const Switch = copyComponentProperties(RNSwitch, (props: SwitchProps) => {
    const trackColorOn = useUniwindAccent(props.trackColorOnClassName)
    const trackColorOff = useUniwindAccent(props.trackColorOffClassName)
    const thumbColor = useUniwindAccent(props.thumbColorClassName)

    return (
        <RNSwitch
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            thumbColor={thumbColor ?? props.thumbColor}
            trackColor={{ true: trackColorOn ?? props.trackColor?.true, false: trackColorOff ?? props.trackColor?.false }}
        />
    )
})
