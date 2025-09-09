import { Switch as RNSwitch, SwitchProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const Switch = copyComponentProperties(RNSwitch, (props: SwitchProps) => {
    const thumbColor = useUniwindAccent(props.thumbColorClassName)
    const ios_backgroundColor = useUniwindAccent(props.ios_backgroundColorClassName)

    return (
        <RNSwitch
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            thumbColor={thumbColor ?? props.thumbColor}
            // TODO
            trackColor={props.trackColor}
            ios_backgroundColor={ios_backgroundColor ?? props.ios_backgroundColor}
        />
    )
})
