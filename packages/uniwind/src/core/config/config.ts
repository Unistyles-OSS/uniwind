import { Appearance } from 'react-native'
import { ColorScheme, UniwindConfig } from '../../types'
import { themeChange } from './themeChange'

type UserThemes = UniwindConfig extends { themes: infer T extends ReadonlyArray<string> } ? T
    : ReadonlyArray<string>

export type ThemeName = UserThemes[number]

export type Config = {
    initialTheme?: ThemeName
    adaptiveThemes?: boolean
    themes?: UserThemes
}

class UniwindConfigBuilder {
    #themes: UserThemes = []
    #hasAdaptiveThemes = true
    #colorScheme = Appearance.getColorScheme() ?? ColorScheme.Light
    #currentTheme = this.#colorScheme as ThemeName

    constructor() {
        Appearance.addChangeListener(event => {
            const colorScheme = event.colorScheme ?? ColorScheme.Light
            const prevTheme = this.#currentTheme

            if (this.hasAdaptiveThemes && prevTheme !== colorScheme) {
                this.#currentTheme = colorScheme
                this.emitThemeChange()
            }
        })
    }

    get currentTheme(): ThemeName {
        return this.#currentTheme
    }

    get hasAdaptiveThemes() {
        return this.#hasAdaptiveThemes
    }

    private get haveLightAndDarkThemes() {
        return this.#themes.includes('light') && this.#themes.includes('dark')
    }

    configure(config: Config) {
        this.#themes = config.themes ?? []

        if (config.adaptiveThemes && !this.haveLightAndDarkThemes) {
            throw new Error(`Uniwind: You're trying to enable adaptive themes, but you did not register 'light' and 'dark' themes.`)
        }

        if (config.initialTheme !== undefined && config.adaptiveThemes) {
            throw new Error(`"Uniwind: You're trying to set initial theme and enable adaptiveThemes, but these options are mutually exclusive."`)
        }

        if (config.initialTheme !== undefined && !this.#themes.includes(config.initialTheme)) {
            throw new Error(`Uniwind: You're trying to set '${config.initialTheme}' as initial theme, but it was not registered.`)
        }

        if (config.initialTheme !== undefined) {
            this.#currentTheme = config.initialTheme
            this.emitThemeChange()
        }

        this.#hasAdaptiveThemes = config.adaptiveThemes ?? false
    }

    setAdaptiveThemes(enabled: boolean) {
        if (enabled) {
            if (!this.haveLightAndDarkThemes) {
                throw new Error(`Uniwind: You're trying to enable adaptive themes, but you did not register 'light' and 'dark' themes.`)
            }

            const prevTheme = this.#currentTheme

            this.#hasAdaptiveThemes = true
            this.#currentTheme = this.#colorScheme

            if (prevTheme !== this.#currentTheme) {
                this.emitThemeChange()
            }

            return
        }

        this.#hasAdaptiveThemes = false
    }

    setCurrentTheme(theme: ThemeName) {
        if (theme === this.#currentTheme) {
            return
        }

        if (this.hasAdaptiveThemes) {
            throw new Error(`Uniwind: You're trying to setTheme to '${theme}', but adaptive themes are enabled.`)
        }

        if (!this.#themes.includes(theme)) {
            throw new Error(`Uniwind: You're trying to setTheme to '${theme}', but it was not registered.`)
        }

        this.#currentTheme = theme
        this.emitThemeChange()
    }

    private emitThemeChange() {
        themeChange(this.#currentTheme, this.#themes)
    }
}

export const Uniwind = new UniwindConfigBuilder()
