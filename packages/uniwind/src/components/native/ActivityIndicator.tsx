import { ActivityIndicator as RNActivityIndicator, ActivityIndicatorProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const ActivityIndicator = copyComponentProperties(RNActivityIndicator, (props: ActivityIndicatorProps) => {
    const style = useStyle(props.className)
    const color = useUniwindAccent(props.className)

    return (
        <RNActivityIndicator
            {...props}
            style={[style, props.style]}
            color={color ?? props.color}
        />
    )
})
