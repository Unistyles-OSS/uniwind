import { ScrollView as RNScrollView, ScrollViewProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const ScrollView = copyComponentProperties(RNScrollView, (props: ScrollViewProps) => {
    const endFillColor = useUniwindAccent(props.endFillColorClassName)

    return (
        <RNScrollView
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            contentContainerStyle={[toRNWClassName(props.contentContainerClassName), props.contentContainerStyle]}
            endFillColor={endFillColor ?? props.endFillColor}
        />
    )
})
