import { ScrollView as RNScrollView, ScrollViewProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const ScrollView = copyComponentProperties(RNScrollView, (props: ScrollViewProps) => {
    const style = useStyle(props.className)
    const contentContainerStyle = useStyle(props.contentContainerClassName)
    const endFillColor = useUniwindAccent(props.endFillColorClassName)

    return (
        <RNScrollView
            {...props}
            style={[style, props.style]}
            contentContainerStyle={[contentContainerStyle, props.contentContainerStyle]}
            endFillColor={endFillColor ?? props.endFillColor}
        />
    )
})
