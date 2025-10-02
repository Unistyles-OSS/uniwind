import { ScrollView as RNScrollView, ScrollViewProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const ScrollView = copyComponentProperties(RNScrollView, (props: ScrollViewProps) => {
    return (
        <RNScrollView
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            contentContainerStyle={[toRNWClassName(props.contentContainerClassName), props.contentContainerStyle]}
        />
    )
})

export default ScrollView
