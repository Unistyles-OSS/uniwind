import { Appearance, Platform } from 'react-native'
import { ColorScheme, UniwindConfig } from '../../types'
import { UniwindConfigChange } from '../types'
import { themeChange } from './themeChange'

type UserThemes = UniwindConfig extends { themes: infer T extends ReadonlyArray<string> } ? T
    : ReadonlyArray<string>

export type ThemeName = UserThemes[number]

const SYSTEM_THEME = 'system' as const

class UniwindConfigBuilder {
    #hasAdaptiveThemes = true
    #currentTheme = this.colorScheme as ThemeName
    #listeners = new Set<(change: UniwindConfigChange) => void>()

    constructor() {
        if (Platform.OS === 'web') {
            this.emitThemeChange()
        }

        Appearance.addChangeListener(event => {
            const colorScheme = event.colorScheme ?? ColorScheme.Light
            const prevTheme = this.#currentTheme

            if (this.#hasAdaptiveThemes && prevTheme !== colorScheme) {
                this.#currentTheme = colorScheme
                this.emitThemeChange()
                this.emitConfigChange()
            }
        })
    }

    get hasAdaptiveThemes() {
        return this.#hasAdaptiveThemes
    }

    get currentTheme(): ThemeName {
        return this.#currentTheme
    }

    private get themes() {
        return globalThis.__uniwindThemes__ ?? ['light', 'dark']
    }

    private get colorScheme() {
        return Appearance.getColorScheme() ?? ColorScheme.Light
    }

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    setTheme(theme: ThemeName | typeof SYSTEM_THEME) {
        const prevTheme = this.#currentTheme
        const prevHasAdaptiveThemes = this.#hasAdaptiveThemes
        const isAdaptiveTheme = ['light', 'dark'].includes(theme)

        if (theme === SYSTEM_THEME) {
            this.#hasAdaptiveThemes = true
            this.#currentTheme = this.colorScheme

            if (prevTheme !== this.#currentTheme) {
                this.emitThemeChange()
            }

            if (prevTheme !== this.#currentTheme || prevHasAdaptiveThemes !== this.#hasAdaptiveThemes) {
                this.emitConfigChange()
            }

            if (Platform.OS !== 'web') {
                Appearance.setColorScheme(undefined)
            }

            return
        }

        if (!this.themes.includes(theme)) {
            throw new Error(`Uniwind: You're trying to setTheme to '${theme}', but it was not registered.`)
        }

        this.#hasAdaptiveThemes = false
        this.#currentTheme = theme

        if (prevTheme !== this.#currentTheme) {
            this.emitThemeChange()
        }

        if (prevTheme !== this.#currentTheme || prevHasAdaptiveThemes !== this.#hasAdaptiveThemes) {
            this.emitConfigChange()
        }

        if (Platform.OS !== 'web') {
            Appearance.setColorScheme(isAdaptiveTheme ? this.#currentTheme as ColorScheme : undefined)
        }
    }

    private emitThemeChange() {
        themeChange(this.#currentTheme, this.themes)
    }

    private emitConfigChange() {
        const change: UniwindConfigChange = {
            currentTheme: this.#currentTheme,
            hasAdaptiveThemes: this.#hasAdaptiveThemes,
        }

        this.#listeners.forEach(listener => listener(change))
    }

    // Private method declared for internal use only
    private addListener(listener: (change: UniwindConfigChange) => void) {
        this.#listeners.add(listener)

        return () => {
            this.#listeners.delete(listener)
        }
    }
}

export const Uniwind = new UniwindConfigBuilder()
