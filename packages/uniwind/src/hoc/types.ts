import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'

export type AnyObject = Record<PropertyKey, any>

type StyleToClass<K extends PropertyKey> = K extends 'style' ? 'className'
    : K extends `${infer StyleProp extends string}Style` ? `${StyleProp}ClassName`
    : never

type ColorPropToClass<K extends PropertyKey> = K extends 'color' ? 'colorClassName'
    : K extends `${infer ColorProp extends string}Color` ? `${ColorProp}ColorClassName`
    : never

type ApplyUniwind<TProps extends AnyObject> =
    & TProps
    & {
        [K in keyof TProps as StyleToClass<K>]?: string
    }
    & {
        [K in keyof TProps as ColorPropToClass<K>]?: string
    }

type ApplyUniwindOptions<TProps extends AnyObject, TOptions extends { [K in keyof TProps]?: OptionMapping }> =
    & TProps
    & {
        // @ts-expect-error TS isn't smart enough to infer this
        [K in keyof TOptions as TOptions[K] extends undefined ? never : TOptions[K]['toClassName']]?: string
    }

export type Component<T extends AnyObject> = (props: T) => React.ReactNode

export type OptionMapping = {
    toClassName: string
    styleProperty?: keyof (ViewStyle & ImageStyle & TextStyle)
}

export type WithUniwind = {
    // Auto mapping
    <TProps extends AnyObject>(Component: Component<TProps>): (props: ApplyUniwind<TProps>) => React.ReactNode
    // Manual mapping
    <TProps extends AnyObject, const TOptions extends { [K in keyof TProps]?: OptionMapping }>(
        Component: Component<TProps>,
        options: TOptions,
    ): (props: ApplyUniwindOptions<TProps, TOptions> & {}) => React.ReactNode
}
