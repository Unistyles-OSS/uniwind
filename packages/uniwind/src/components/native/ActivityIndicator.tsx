import { ActivityIndicator as RNActivityIndicator, ActivityIndicatorProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const ActivityIndicator = copyComponentProperties(RNActivityIndicator, (props: ActivityIndicatorProps) => {
    const style = useStyle(props.className)
    const color = useUniwindAccent(props.colorClassName)

    return (
        <RNActivityIndicator
            {...props}
            style={[style, props.style]}
            color={props.color ?? color}
        />
    )
})

export default ActivityIndicator
