import { Button as RNButton, ButtonProps } from 'react-native'
import { useUniwindAccent } from '../../hooks'
import { copyComponentProperties } from '../utils'

export const Button = copyComponentProperties(RNButton, (props: ButtonProps) => {
    const color = useUniwindAccent(props.colorClassName)

    return (
        <RNButton
            {...props}
            color={props.color ?? color}
        />
    )
})

export default Button
