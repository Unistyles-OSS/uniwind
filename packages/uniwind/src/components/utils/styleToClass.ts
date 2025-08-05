import { RNClassNameProps, RNStylesProps } from '../rn/props'

export const styleToClass = (style: RNStylesProps) => style.replace('Style', 'ClassName') as RNClassNameProps
