import { Modal as RNModal, ModalProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { useStyle } from './useStyle'

export const Modal = copyComponentProperties(RNModal, (props: ModalProps) => {
    const style = useStyle(props.className)
    const backdropColor = useUniwindAccent(props.backdropColorClassName)

    return (
        <RNModal
            {...props}
            style={[style, props.style]}
            backdropColor={props.backdropColor ?? backdropColor}
        />
    )
})

export default Modal
