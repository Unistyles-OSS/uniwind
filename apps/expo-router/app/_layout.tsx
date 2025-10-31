import { ThemeSwitchButton } from '@/components/theme-switch-button'
import '@/globals.css'
import { getNativeColorScheme, getNavigationTheme, getStoredThemeSync } from '@/utils/theme'
import {
    ThemeProvider,
} from '@react-navigation/native'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Appearance, Platform } from 'react-native'
import { Uniwind, useUniwind } from 'uniwind'

// Set initial theme based on user preference
const initialTheme = getStoredThemeSync()
Uniwind.setTheme(initialTheme ?? 'system')

// Set React Native Appearance
Appearance.setColorScheme(getNativeColorScheme(initialTheme ?? 'system'))

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
    { name: 'Reanimated', path: 'sections/reanimated' },
    { name: 'GlassView', path: 'sections/glass-view' },
]

export default function RootLayout() {
    const { theme } = useUniwind()
    const navigationTheme = getNavigationTheme(theme)
    return (<>
        <Stack
            screenOptions={{
                headerBackButtonDisplayMode: 'minimal',
                headerTransparent: Platform.select({
                    ios: true,
                    android: false,
                }),
                headerStyle: {
                    backgroundColor: navigationTheme.colors.background
                },
                headerTintColor: navigationTheme.colors.text,
                headerTitleStyle: { color: navigationTheme.colors.text },
                sheetGrabberVisible: true,
                headerRight: () => <ThemeSwitchButton />,
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Expo + Uniwind' }} />
            <Stack.Screen
                name="theme-selector"
                options={{
                    title: 'Theme',
                    presentation: Platform.select({
                        ios: 'formSheet',
                        android: 'modal',
                    }),


                    sheetAllowedDetents: 'fitToContents',

                }}
            />
            <Stack.Screen
                name="formSheets/scrollView"
                options={{
                    title: 'FormSheet with ScrollView',
                    presentation: Platform.select({
                        ios: 'formSheet',
                        android: 'modal',
                    }),
                    sheetAllowedDetents: [0.5, 1],
                    headerRight: () => undefined,

                    contentStyle: {

                        backgroundColor: Platform.select({
                            ios: isLiquidGlassAvailable() ? 'transparent' : navigationTheme.colors.background,
                            android: navigationTheme.colors.background,
                        }),
                    },
                }}
            />
            <Stack.Screen
                name="formSheets/scrollViewWithFitToContents"
                options={{
                    title: 'FormSheet+ScrollView (FitToContents)',
                    presentation: Platform.select({
                        ios: 'formSheet',
                        android: 'modal',
                    }),
                    sheetAllowedDetents: 'fitToContents',
                    headerRight: () => undefined,
                    contentStyle: {
                        backgroundColor: Platform.select({
                            ios: isLiquidGlassAvailable() ? 'transparent' : navigationTheme.colors.background,
                            android: navigationTheme.colors.background,
                        }),
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
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} /></>
    )
}
