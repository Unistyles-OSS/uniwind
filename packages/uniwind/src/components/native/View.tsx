import { View as RNView, ViewProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const View = copyComponentProperties(RNView, (props: ViewProps) => {
    const style = useStyle(props.className)

    return (
        <RNView
            {...props}
            style={[style, props.style]}
        />
    )
})
