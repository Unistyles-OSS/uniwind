import { RefreshControl as RNRefreshControl, RefreshControlProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const RefreshControl = copyComponentProperties(RNRefreshControl, (props: RefreshControlProps) => {
    const style = useStyle(props.className)
    const tintColor = useUniwindAccent(props.tintColorClassName)
    const titleColor = useUniwindAccent(props.titleColorClassName)
    const progressBackgroundColor = useUniwindAccent(props.progressBackgroundColorClassName)

    return (
        <RNRefreshControl
            {...props}
            style={[style, props.style]}
            // TODO
            colors={props.colors}
            tintColor={tintColor ?? props.tintColor}
            titleColor={titleColor ?? props.titleColor}
            progressBackgroundColor={progressBackgroundColor ?? props.progressBackgroundColor}
        />
    )
})
