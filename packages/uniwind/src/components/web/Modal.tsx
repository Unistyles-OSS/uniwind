import { Modal as RNModal, ModalProps } from 'react-native'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const Modal = copyComponentProperties(RNModal, (props: ModalProps) => {
    return (
        <RNModal
            {...props}
            style={[toRNWClassName(props.className), props.style]}
        />
    )
})

export default Modal
