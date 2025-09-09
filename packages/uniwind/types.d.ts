import {
    ScrollViewProps,
    ScrollViewPropsAndroid,
    ScrollViewPropsIOS,
    Touchable,
    VirtualizedListProps,
} from 'react-native'

declare module '@react-native/virtualized-lists' {
    export interface VirtualizedListWithoutRenderItemProps<ItemT> extends ScrollViewProps {
        ListFooterComponentClassName?: string
        ListHeaderComponentClassName?: string
    }
}

declare module 'react-native' {
    interface FlatListProps<ItemT> extends VirtualizedListProps<ItemT> {
        columnWrapperClassName?: string
        contentContainerClassName?: string
    }

    interface ImageBackgroundProps extends ImagePropsBase {
        imageClassName?: string
        tintColorClassName?: string
    }

    interface ImagePropsBase {
        className?: string
        tintColorClassName?: string
    }

    interface InputAccessoryViewProps {
        className?: string
    }

    interface KeyboardAvoidingViewProps extends ViewProps {
        contentContainerClassName?: string
    }

    interface ScrollViewProps extends ViewProps, ScrollViewPropsIOS, ScrollViewPropsAndroid, Touchable {
        contentContainerClassName?: string
        endFillColorClassName?: string
    }

    interface SectionListProps<ItemT> extends VirtualizedListProps<ItemT> {
        contentContainerClassName?: string
    }

    interface SwitchProps {
        className?: never
        ios_backgroundColorClassName?: string
        thumbColorClassName?: string
        trackColorClassName?: string
    }

    interface TextProps {
        className?: string
        selectionColorClassName?: string
    }

    interface TouchableWithoutFeedbackProps {
        className?: string
    }

    interface ViewProps {
        className?: string
    }

    interface PressableProps {
        className?: string
    }

    interface TextInputProps {
        className?: string
        cursorColorClassName?: string
        underlineColorAndroidClassName?: string
        placeholderTextColorClassName?: string
        selectionColorClassName?: string
        selectionHandleColorClassName?: string
    }

    interface RefreshControlProps {
        colorsClassName?: Array<string>
        progressBackgroundColorClassName?: string
        tintColorClassName?: string
        titleColorClassName?: string
    }

    interface TouchableHighlightProps {
        underlayColorClassName?: string
    }

    interface ActivityIndicatorProps {
        colorClassName?: string
    }

    interface DrawerLayoutAndroidProps {
        drawerBackgroundColorClassName?: string
        statusBarBackgroundColorClassName?: string
    }

    interface ModalBaseProps {
        backdropColorClassName?: string
    }

    interface ButtonProps {
        colorClassName?: string
    }

    interface StatusBarPropsAndroid {
        backgroundColorClassName?: string
    }
}
