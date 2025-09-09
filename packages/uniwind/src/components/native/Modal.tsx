import { Modal as RNModal, ModalProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyles'

export const Modal = copyComponentProperties(RNModal, (props: ModalProps) => {
    const style = useStyle(props.className)
    const backdropColor = useUniwindAccent(props.backdropColorClassName)

    return (
        <RNModal
            {...props}
            style={[style, props.style]}
            backdropColor={backdropColor ?? props.backdropColor}
        />
    )
})
