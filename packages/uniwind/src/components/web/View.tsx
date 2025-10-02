import { View as RNView, ViewProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const View = copyComponentProperties(RNView, (props: ViewProps) => {
    return (
        <RNView
            {...props}
            style={[toRNWClassName(props.className), props.style]}
        />
    )
})

export default View
