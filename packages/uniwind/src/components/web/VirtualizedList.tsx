import { VirtualizedList as RNVirtualizedList, VirtualizedListProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const VirtualizedList = copyComponentProperties(RNVirtualizedList, (props: VirtualizedListProps<unknown>) => {
    return (
        <RNVirtualizedList
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            contentContainerStyle={[toRNWClassName(props.contentContainerClassName), props.contentContainerStyle]}
            ListFooterComponentStyle={[toRNWClassName(props.ListFooterComponentClassName), props.ListFooterComponentStyle]}
            ListHeaderComponentStyle={[toRNWClassName(props.ListHeaderComponentClassName), props.ListHeaderComponentStyle]}
        />
    )
})

export default VirtualizedList
