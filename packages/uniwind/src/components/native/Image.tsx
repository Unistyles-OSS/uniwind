import { Image as RNImage, ImageProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const Image = copyComponentProperties(RNImage, (props: ImageProps) => {
    const style = useStyle(props.className)
    const tintColor = useUniwindAccent(props.tintColorClassName)

    return (
        <RNImage
            {...props}
            style={[style, props.style]}
            tintColor={tintColor ?? props.tintColor}
        />
    )
})
