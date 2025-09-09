import { ImageBackground as RNImageBackground, ImageBackgroundProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const ImageBackground = copyComponentProperties(RNImageBackground, (props: ImageBackgroundProps) => {
    const style = useStyle(props.className)
    const imageStyle = useStyle(props.imageClassName)
    const tintColor = useUniwindAccent(props.tintColorClassName)

    return (
        <RNImageBackground
            {...props}
            style={[style, props.style]}
            imageStyle={[imageStyle, props.imageStyle]}
            tintColor={tintColor ?? props.tintColor}
        />
    )
})
