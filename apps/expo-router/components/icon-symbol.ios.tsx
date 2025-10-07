import {
    SymbolType,
    SymbolView,
    SymbolViewProps,
    SymbolWeight,
} from 'expo-symbols'
import { StyleProp, ViewStyle } from 'react-native'

export function IconSymbol({
    name,
    size = 24,
    color,
    style,
    weight = 'regular',
    type = 'hierarchical',
    backgroundColor,
    animationSpec,
}: {
    name: SymbolViewProps['name']
    size?: number
    color: string
    style?: StyleProp<ViewStyle>
    weight?: SymbolWeight
    type?: SymbolType
    backgroundColor?: string
    animationSpec?: SymbolViewProps['animationSpec']
}) {
    return (
        <SymbolView
            weight={weight}
            tintColor={backgroundColor ? undefined : color}
            colors={backgroundColor ? [backgroundColor, color] : [color]}
            type={type}
            resizeMode="scaleAspectFit"
            animationSpec={animationSpec}
            name={name}
            style={[
                {
                    width: size,
                    height: size,
                },
                style,
            ]}
        />
    )
}
