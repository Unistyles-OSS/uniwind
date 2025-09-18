import { useEffect, useReducer } from 'react'
import { CSSListener } from '../core/cssListener'
import { formatColor } from '../core/formatColor'
import { getWebStyles } from '../core/getWebStyles'
import { AnyObject, Component, OptionMapping, WithUniwind } from './types'
import { classToColor, classToStyle, isClassProperty, isColorClassProperty, isColorProperty, isStyleProperty } from './withUniwindUtils'

export const withUniwind: WithUniwind = <
    TProps extends AnyObject,
    TOptions extends Record<keyof TProps, OptionMapping>,
>(
    Component: Component<TProps>,
    options?: TOptions,
) => options
    ? withManualUniwind(Component, options)
    : withAutoUniwind(Component)

const withAutoUniwind = (Component: Component<AnyObject>) => (props: AnyObject) => {
    const { styles, colorClassNames, colorStyles } = Object.entries(props).reduce((acc, [propName, propValue]) => {
        if (isColorClassProperty(propName)) {
            acc.colorClassNames[propName] = propValue

            return acc
        }

        if (isColorProperty(propName)) {
            acc.colorStyles[propName] = propValue

            return acc
        }

        if (isClassProperty(propName)) {
            const styleProp = classToStyle(propName)

            acc.styles[styleProp] ??= []
            acc.styles[styleProp][0] = { $$css: true, tailwind: propValue }

            return acc
        }

        if (isStyleProperty(propName)) {
            acc.styles[propName] ??= []
            acc.styles[propName][1] = propValue

            return acc
        }

        return acc
    }, { styles: {} as AnyObject, colorClassNames: {} as AnyObject, colorStyles: {} as AnyObject })

    const { classNames, colors } = Object.entries(colorClassNames).reduce((acc, [key, colorClassName]) => {
        const color = getWebStyles(colorClassName)

        acc.colors[classToColor(key)] = color.accentColor !== undefined
            ? formatColor(color.accentColor)
            : undefined
        acc.classNames += `${colorClassName} `

        return acc
    }, { colors: {} as AnyObject, classNames: '' })

    const [, rerender] = useReducer(() => ({}), {})

    useEffect(() => {
        const dispose = CSSListener.addListener(classNames, rerender)

        return dispose
    }, [classNames])

    return (
        <Component
            {...props}
            {...styles}
            {...colors}
            {...colorStyles}
        />
    )
}

const withManualUniwind = (Component: Component<AnyObject>, options: Record<PropertyKey, OptionMapping>) => (props: AnyObject) => {
    const { generatedProps, classNames } = Object.entries(options).reduce((acc, [propName, option]) => {
        const className = props[option.toClassName]

        if (className === undefined) {
            return acc
        }

        if (option.styleProperty !== undefined) {
            // If the prop is already defined, we don't want to override it
            if (props[propName] !== undefined) {
                return acc
            }

            const value = getWebStyles(className)[option.styleProperty]
            const transformedValue = value !== undefined && option.styleProperty.toLowerCase().includes('color')
                ? formatColor(value as string)
                : value

            acc.classNames += `${className} `
            acc.generatedProps[propName] = transformedValue

            return acc
        }

        acc.generatedProps[propName] = [{ $$css: true, tailwind: className }, props[propName]]

        return acc
    }, { generatedProps: {} as AnyObject, classNames: '' })

    const [, rerender] = useReducer(() => ({}), {})

    useEffect(() => {
        const dispose = CSSListener.addListener(classNames, rerender)

        return dispose
    }, [classNames])

    return (
        <Component
            {...props}
            {...generatedProps}
        />
    )
}
