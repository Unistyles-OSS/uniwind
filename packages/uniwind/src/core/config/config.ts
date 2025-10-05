import { Appearance, Platform } from 'react-native'
import { ColorScheme, UniwindConfig } from '../../types'
import { themeChange } from './themeChange'

type UserThemes = UniwindConfig extends { themes: infer T extends ReadonlyArray<string> } ? T
    : ReadonlyArray<string>

export type ThemeName = UserThemes[number]

const SYSTEM_THEME = 'system' as const

class UniwindConfigBuilder {
    #hasAdaptiveThemes = true
    #colorScheme = Appearance.getColorScheme() ?? ColorScheme.Light
    #currentTheme = this.#colorScheme as ThemeName

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

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    setTheme(theme: ThemeName | typeof SYSTEM_THEME) {
        const prevTheme = this.#currentTheme

        if (theme === SYSTEM_THEME) {
            this.#hasAdaptiveThemes = true
            this.#currentTheme = this.#colorScheme

            if (prevTheme !== this.#currentTheme) {
                this.emitThemeChange()
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
    }

    private emitThemeChange() {
        themeChange(this.#currentTheme, this.themes)
    }
}

export const Uniwind = new UniwindConfigBuilder()
