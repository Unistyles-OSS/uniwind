import { AnyObject, Component, OptionMapping, WithUniwind } from './types'
import { classToStyle, isClassProperty, isStyleProperty } from './withUniwindUtils'

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
    const { rest, styles } = Object.entries(props).reduce((acc, [propName, propValue]) => {
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

        acc.rest[propName] = propValue

        return acc
    }, { rest: {} as AnyObject, styles: {} as AnyObject })

    return <Component {...rest} {...styles} />
}

const withManualUniwind = (Component: Component<AnyObject>, options: AnyObject) => (props: AnyObject) => {
    return <Component {...props} />
}
