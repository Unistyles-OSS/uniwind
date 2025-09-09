import { FlatList as RNFlatList, FlatListProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const FlatList = copyComponentProperties(RNFlatList, (props: FlatListProps<unknown>) => {
    const style = useStyle(props.className)
    const styleColumnWrapper = useStyle(props.columnWrapperClassName)
    const styleContentContainer = useStyle(props.contentContainerClassName)
    const styleListFooterComponent = useStyle(props.ListFooterComponentClassName)
    const styleListHeaderComponent = useStyle(props.ListHeaderComponentClassName)

    return (
        <RNFlatList
            {...props}
            style={[style, props.style]}
            columnWrapperStyle={[styleColumnWrapper, props.columnWrapperStyle]}
            contentContainerStyle={[styleContentContainer, props.contentContainerStyle]}
            ListFooterComponentStyle={[styleListFooterComponent, props.ListFooterComponentStyle]}
            ListHeaderComponentStyle={[styleListHeaderComponent, props.ListHeaderComponentStyle]}
        />
    )
})
