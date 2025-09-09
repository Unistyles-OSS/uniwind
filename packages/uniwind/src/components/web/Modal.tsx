import { Modal as RNModal, ModalProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'
import { toRNWClassName } from './rnw'

export const Modal = copyComponentProperties(RNModal, (props: ModalProps) => {
    const backdropColor = useUniwindAccent(props.backdropColorClassName)

    return (
        <RNModal
            {...props}
            style={[toRNWClassName(props.className), props.style]}
            backdropColor={backdropColor ?? props.backdropColor}
        />
    )
})
