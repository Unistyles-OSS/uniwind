import { IconSymbol, IconSymbolName } from '@/components/icon-symbol'
import '@/globals.css'
import { getStoredThemeSync, useStoredTheme } from '@/utils/use-stored-theme'
import { HeaderButton } from '@react-navigation/elements'
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import 'react-native-reanimated'
import { Uniwind, useResolveClassNames, useUniwind } from 'uniwind'

const initialTheme = getStoredThemeSync()
Uniwind.setTheme(initialTheme ?? 'system')

console.log('INITIAL_THEME:', initialTheme)

const sections = [
    { name: 'Aspect Ratio', path: 'sections/aspect-ratio' },
    { name: 'Border', path: 'sections/border' },
    { name: 'Content Alignment', path: 'sections/content-alignment' },
    { name: 'Display', path: 'sections/display' },
    { name: 'Flex', path: 'sections/flex' },
    { name: 'Font', path: 'sections/font' },
    { name: 'Item Alignment', path: 'sections/item-alignment' },
    { name: 'Justify Content', path: 'sections/justify-content' },
    { name: 'Margin', path: 'sections/margin' },
    { name: 'Outline', path: 'sections/outline' },
    { name: 'Padding', path: 'sections/padding' },
    { name: 'Self Alignment', path: 'sections/self-alignment' },
    { name: 'Text Alignment', path: 'sections/text-alignment' },
    { name: 'Transform', path: 'sections/transform' },
]

export default function RootLayout() {
    const { theme: uniwindTheme } = useUniwind()
    const colorScheme = useColorScheme()
    const { storedTheme } = useStoredTheme()
    const bgStyle = useResolveClassNames('bg-background')
    const primaryStyle = useResolveClassNames('bg-primary')

    if (initialTheme !== 'system' && Uniwind.hasAdaptiveThemes) {
        console.warn(
            'Initial theme is not system, but adaptive themes are enabled',
        )
    }

    console.log(
        'debug',
        JSON.stringify(
            {
                storedTheme,
                '--': '----',
                uniwindTheme,
                runtimeTheme: Uniwind.currentTheme,
                adaptiveThemes: Uniwind.hasAdaptiveThemes,
                '---': '----',
                deciceColorScheme: colorScheme,
            },
            null,
            2,
        ),
    )

    let iconName: IconSymbolName
    let iconColor: string

    switch (uniwindTheme) {
        case 'dark':
            iconColor = 'white'
            break
        case 'light':
            iconColor = 'black'
            break
        case 'sepia':
            iconColor = primaryStyle.backgroundColor as string
            break
        default:
            iconColor = 'black'
    }

    switch (storedTheme) {
        case 'dark':
            iconName = 'moon.fill'
            break
        case 'light':
            iconName = 'sun.max.fill'
            break
        case 'sepia':
            iconName = 'camera.filters'
            break
        default:
            iconName = 'circle.righthalf.filled'
    }

    const SepiaTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: (bgStyle.backgroundColor as string) || DefaultTheme.colors.background,
        },
    }

    let navigationTheme:
        | typeof DarkTheme
        | typeof SepiaTheme
        | typeof DefaultTheme
    switch (uniwindTheme) {
        case 'dark':
            navigationTheme = DarkTheme
            break
        case 'sepia':
            navigationTheme = SepiaTheme
            break
        case 'light':
            navigationTheme = SepiaTheme
            break
        default:
            navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme
            break
    }

    console.log(
        '? is navigationTheme.dark',
        JSON.stringify(navigationTheme.dark, null, 2),
    )

    return (
        <ThemeProvider value={navigationTheme}>
            <Stack
                screenOptions={{
                    headerBackButtonDisplayMode: 'minimal',
                    headerTransparent: true,
                    sheetGrabberVisible: true,
                    // fullScreenGestureEnabled: true,
                    headerRight: () => (
                        <HeaderButton onPress={() => router.push('/theme-selector')}>
                            <IconSymbol
                                name={iconName}
                                size={24}
                                color={iconColor}
                                animationSpec={{
                                    speed: 4,
                                    effect: {
                                        type: 'bounce',
                                    },
                                }}
                            />
                        </HeaderButton>
                    ),
                }}
            >
                <Stack.Screen name="index" options={{ title: 'Expo Router + Uniwind' }} />
                <Stack.Screen
                    name="modal"
                    options={{
                        // headerShown: true,
                        // headerTransparent: false,
                        title: 'FormSheet',
                        presentation: 'formSheet',
                        sheetAllowedDetents: 'fitToContents',
                        contentStyle: {
                            backgroundColor: 'lightblue',
                            borderWidth: 1,
                            borderColor: 'blue',
                        },
                    }}
                />
                <Stack.Screen
                    name="theme-selector"
                    options={{
                        title: 'Theme',
                        presentation: 'formSheet',
                        sheetAllowedDetents: 'fitToContents',
                        headerRight: () => undefined,
                        contentStyle: {
                            backgroundColor: 'transparent',
                        },
                    }}
                />
                {sections.map((section) => (
                    <Stack.Screen
                        key={section.path}
                        name={section.path}
                        options={{ title: section.name }}
                    />
                ))}
            </Stack>
            <StatusBar style={uniwindTheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
    )
}
