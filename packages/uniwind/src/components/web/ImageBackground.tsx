import { ImageBackground as RNImageBackground, ImageBackgroundProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const ImageBackground = copyComponentProperties(RNImageBackground, (props: ImageBackgroundProps) => {
    const tintColor = useUniwindAccent(props.tintColorClassName)

    return (
        <RNImageBackground
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            imageStyle={[toRNWClassName(props.imageClassName), props.imageStyle]}
            tintColor={props.tintColor ?? tintColor}
        />
    )
})

export default ImageBackground
