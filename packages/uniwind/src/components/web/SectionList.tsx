import { SectionList as RNSectionList, SectionListProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const SectionList = copyComponentProperties(RNSectionList, (props: SectionListProps<unknown, unknown>) => {
    return (
        <RNSectionList
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            contentContainerStyle={[toRNWClassName(props.contentContainerClassName), props.contentContainerStyle]}
            ListFooterComponentStyle={[toRNWClassName(props.ListFooterComponentClassName), props.ListFooterComponentStyle]}
            ListHeaderComponentStyle={[toRNWClassName(props.ListHeaderComponentClassName), props.ListHeaderComponentStyle]}
        />
    )
})

export default SectionList
