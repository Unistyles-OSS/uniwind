import { SectionList as RNSectionList, SectionListProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const SectionList = copyComponentProperties(RNSectionList, (props: SectionListProps<unknown, unknown>) => {
    const style = useStyle(props.className)
    const contentContainerStyle = useStyle(props.contentContainerClassName)
    const listFooterComponentStyle = useStyle(props.ListFooterComponentClassName)
    const listHeaderComponentStyle = useStyle(props.ListHeaderComponentClassName)
    const endFillColor = useUniwindAccent(props.endFillColorClassName)

    return (
        <RNSectionList
            {...props}
            style={[style, props.style]}
            contentContainerStyle={[contentContainerStyle, props.contentContainerStyle]}
            ListFooterComponentStyle={[listFooterComponentStyle, props.ListFooterComponentStyle]}
            ListHeaderComponentStyle={[listHeaderComponentStyle, props.ListHeaderComponentStyle]}
            endFillColor={endFillColor ?? props.endFillColor}
        />
    )
})
