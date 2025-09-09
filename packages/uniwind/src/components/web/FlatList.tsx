import { FlatList as RNFlatList, FlatListProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const FlatList = copyComponentProperties(RNFlatList, (props: FlatListProps<unknown>) => {
    return (
        <RNFlatList
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            columnWrapperStyle={[toRNWClassName(props.columnWrapperClassName), props.columnWrapperStyle]}
            contentContainerStyle={[toRNWClassName(props.contentContainerClassName), props.contentContainerStyle]}
            ListFooterComponentStyle={[toRNWClassName(props.ListFooterComponentClassName), props.ListFooterComponentStyle]}
            ListHeaderComponentStyle={[toRNWClassName(props.ListHeaderComponentClassName), props.ListHeaderComponentStyle]}
        />
    )
})
