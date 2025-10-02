import { RefreshControl as RNRefreshControl, RefreshControlProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const RefreshControl = copyComponentProperties(RNRefreshControl, (props: RefreshControlProps) => {
    return (
        <RNRefreshControl
            {...props}
            style={[toRNWClassName(props.className), props.style]}
        />
    )
})

export default RefreshControl
