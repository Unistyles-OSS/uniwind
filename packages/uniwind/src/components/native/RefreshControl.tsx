import { RefreshControl as RNRefreshControl, RefreshControlProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const RefreshControl = copyComponentProperties(RNRefreshControl, (props: RefreshControlProps) => {
    const style = useStyle(props.className)
    const color = useUniwindAccent(props.colorsClassName)
    const tintColor = useUniwindAccent(props.tintColorClassName)
    const titleColor = useUniwindAccent(props.titleColorClassName)
    const progressBackgroundColor = useUniwindAccent(props.progressBackgroundColorClassName)

    return (
        <RNRefreshControl
            {...props}
            style={[style, props.style]}
            colors={props.colors ?? (color !== undefined ? [color] : undefined)}
            tintColor={props.tintColor ?? tintColor}
            titleColor={props.titleColor ?? titleColor}
            progressBackgroundColor={props.progressBackgroundColor ?? progressBackgroundColor}
        />
    )
})

export default RefreshControl
