import { SectionList as RNSectionList, SectionListProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const SectionList = copyComponentProperties(RNSectionList, (props: SectionListProps<unknown, unknown>) => {
    const endFillColor = useUniwindAccent(props.endFillColorClassName)

    return (
        <RNSectionList
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            contentContainerStyle={[toRNWClassName(props.contentContainerClassName), props.contentContainerStyle]}
            ListFooterComponentStyle={[toRNWClassName(props.ListFooterComponentClassName), props.ListFooterComponentStyle]}
            ListHeaderComponentStyle={[toRNWClassName(props.ListHeaderComponentClassName), props.ListHeaderComponentStyle]}
            endFillColor={endFillColor ?? props.endFillColor}
        />
    )
})
