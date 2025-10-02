import { ActivityIndicator as RNActivityIndicator, ActivityIndicatorProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const ActivityIndicator = copyComponentProperties(RNActivityIndicator, (props: ActivityIndicatorProps) => {
    const color = useUniwindAccent(props.colorClassName)

    return (
        <RNActivityIndicator
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            color={props.color ?? color}
        />
    )
})

export default ActivityIndicator
