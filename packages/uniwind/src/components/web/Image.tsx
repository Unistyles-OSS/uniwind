import { Image as RNImage, ImageProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const Image = copyComponentProperties(RNImage, (props: ImageProps) => {
    const tintColor = useUniwindAccent(props.tintColorClassName)

    return (
        <RNImage
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            tintColor={tintColor ?? props.tintColor}
        />
    )
})
