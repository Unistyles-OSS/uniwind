import './rnw'
import React from 'react'
import { RNClassNameProps, RNStylesProps, UniwindComponentProps } from '../../../core/types'
import { copyComponentProperties } from '../../utils'

type TailwindRNStyle = {
    $$css: true
    tailwind: string | undefined
}

type AdditionalClasses = Record<string, [TailwindRNStyle, any]>

const styleToClass = (style: RNStylesProps) => style.replace('Style', 'ClassName') as RNClassNameProps

export const createUniwindComponent = (
    Component: React.ComponentType<any>,
    additionalStyles?: Array<RNStylesProps>,
) => {
    const UniwindComponent = (props: UniwindComponentProps) => {
        return (
            <Component
                {...props}
                style={[
                    { $$css: true, tailwind: props.className },
                    props.style,
                ]}
                {...additionalStyles?.reduce<AdditionalClasses>((acc, styleProp) => {
                    acc[styleProp] = [
                        {
                            $$css: true,
                            tailwind: props[styleToClass(styleProp)],
                        },
                        props[styleProp],
                    ]

                    return acc
                }, {})}
            />
        )
    }

    return copyComponentProperties(Component, UniwindComponent)
}
