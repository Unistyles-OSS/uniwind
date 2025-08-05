import './rnw'
import React from 'react'
import { copyComponentProperties, styleToClass } from '../../utils'
import { RNStylesProps, UniwindComponentProps } from '../props'

type TailwindRNStyle = {
    $$css: true
    tailwind: string | undefined
}

type AdditionalClasses = Record<string, [TailwindRNStyle, any]>

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
