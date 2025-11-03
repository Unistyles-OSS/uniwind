import { IconSymbol, IconSymbolName } from '@/components/icon-symbol'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import { UniwindThemes, useStoredTheme } from '@/utils/theme'
import { useHeaderHeight } from '@react-navigation/elements'
import { TouchableOpacity, View } from 'react-native'

export default function ThemeSelectorSheet() {
    const headerHeight = useHeaderHeight()
    const { storedTheme, storeAndSetTheme } = useStoredTheme()

    const ThemeButton = ({
        theme,
        iconName,
    }: {
        theme: UniwindThemes
        iconName: IconSymbolName
    }) => {
        const handlePress = async () => {
            try {
                storeAndSetTheme(theme)
            } catch (error) {
                console.error('Failed to save theme preference:', error)
            }
        }

        return (
            <TouchableOpacity
                onPress={handlePress}
                className={cn(
                    'flex-1 items-center justify-center py-5 gap-1 rounded-3xl bg-card border-3 border-border',
                    storedTheme === theme && 'border-zinc-800 dark:border-zinc-200',
                )}
            >
                <IconSymbol name={iconName} size={32} color="gray" />
                <ThemedText className="capitalize text-md">{theme}</ThemedText>
            </TouchableOpacity>
        )
    }

    return (
        <View
            className="w-full flex-1 px-4 pt-1 bg-background"
            style={{
                paddingTop: headerHeight,
                marginBottom: -headerHeight,
                borderWidth: 1,
                borderColor: 'transparent',
            }}
        >
            <View className="flex-row gap-3 mb-3">
                <ThemeButton theme="light" iconName="sun.max.fill" />
                <ThemeButton theme="system" iconName="circle.righthalf.filled" />
                <ThemeButton theme="dark" iconName="moon.fill" />
            </View>
            <View className="flex-row gap-3">
                <ThemeButton theme="sepia" iconName="camera.filters" />
                <ThemeButton theme="bubblegum" iconName="camera.filters" />
            </View>
        </View>
    )
}
