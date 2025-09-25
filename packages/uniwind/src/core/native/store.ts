import { Dimensions } from 'react-native'
import { Orientation, StyleDependency } from '../../types'
import { RNStyle, Style, StyleSheets } from '../types'
import { parseBoxShadow, parseTransformsMutation, resolveGradient } from './parsers'
import { UniwindRuntime } from './runtime'

export class UniwindStoreBuilder {
    stylesheets = {} as StyleSheets
    listeners = {
        [StyleDependency.Theme]: new Set<() => void>(),
        [StyleDependency.Dimensions]: new Set<() => void>(),
        [StyleDependency.Orientation]: new Set<() => void>(),
        [StyleDependency.Insets]: new Set<() => void>(),
        [StyleDependency.FontScale]: new Set<() => void>(),
        [StyleDependency.Rtl]: new Set<() => void>(),
    }
    initialized = false
    runtime = UniwindRuntime

    subscribe(onStoreChange: () => void, dependencies: Array<StyleDependency>) {
        dependencies.forEach(dep => {
            this.listeners[dep].add(onStoreChange)
        })

        return () => {
            dependencies.forEach(dep => {
                this.listeners[dep].delete(onStoreChange)
            })
        }
    }

    getStyles(className?: string) {
        if (className === undefined) {
            return {
                styles: {} as RNStyle,
                dependencies: [],
            }
        }

        if (!this.initialized) {
            this.initialized = true
            this.reload()
        }

        const styles = className
            .split(' ')
            .flatMap(className => {
                const styles = this.stylesheets[className]

                if (!styles) {
                    return null
                }

                return styles.map(style => [className, style])
            })
            .filter(Boolean)

        return this.resolveStyles(styles as Array<[string, Style]>)
    }

    reload = () => {
        this.stylesheets = globalThis.__uniwind__computeStylesheet(this.runtime)
    }

    notifyListeners = (dependencies: Array<StyleDependency>) => {
        dependencies.forEach(dep => this.listeners[dep].forEach(listener => listener()))
    }

    private resolveStyles(styles: Array<[string, Style]>) {
        const dependencies = [] as Array<StyleDependency>
        const filteredStyles = styles.filter(([, style]) => {
            dependencies.push(...style.dependencies)

            if (
                style.minWidth > this.runtime.screen.width
                || style.maxWidth < this.runtime.screen.height
                || (style.theme !== null && this.runtime.currentThemeName !== style.theme)
                || (style.orientation !== null && this.runtime.orientation !== style.orientation)
                || (style.rtl !== null && this.runtime.rtl !== style.rtl)
            ) {
                return false
            }

            return true
        })
        const bestBreakpoints = new Map<string, Style>()
        const result = {} as Record<string, any>
        const inlineVariables = new Map<string, () => any>()
        const usingVariables = new Map<string, Style>()

        filteredStyles.forEach(([, style]) => {
            style.inlineVariables.forEach(([varName, varValue]) => {
                const previousBest = bestBreakpoints.get(varName)

                if (
                    previousBest
                    && (
                        previousBest.minWidth > style.minWidth
                        || previousBest.complexity > style.complexity
                        || previousBest.importantProperties.includes(varName)
                    )
                ) {
                    return
                }

                bestBreakpoints.set(varName, style)
                inlineVariables.set(varName, varValue)
            })

            style.entries.forEach(([property, value]) => {
                const previousBest = bestBreakpoints.get(property)

                if (
                    previousBest
                    && (
                        previousBest.minWidth > style.minWidth
                        || previousBest.complexity > style.complexity
                        || previousBest.importantProperties.includes(property)
                    )
                ) {
                    return
                }

                bestBreakpoints.set(property, style)
                result[property] = value

                if (property in style.stylesUsingVariables) {
                    usingVariables.set(property, style)

                    return
                }

                usingVariables.delete(property)
            })
        })

        if (usingVariables.size > 0) {
            const styleSheet = globalThis.__uniwind__computeStylesheet(this.runtime)
            const themeVars = styleSheet[`__uniwind-theme-${this.runtime.currentThemeName}`]

            if (themeVars) {
                Object.assign(styleSheet, themeVars)
            }

            inlineVariables.forEach((varValue, varName) => {
                Object.defineProperty(styleSheet, varName, {
                    get: varValue,
                    configurable: true,
                })
            })

            usingVariables.forEach((style, property) => {
                const newStyle = Object.fromEntries(styleSheet[style.className]![style.index]!.entries)

                result[property] = newStyle[property]
            })
        }

        if (result.lineHeight !== undefined && result.lineHeight < 6) {
            result.lineHeight = result.fontSize * result.lineHeight
        }

        if (result.boxShadow !== undefined) {
            result.boxShadow = parseBoxShadow(result.boxShadow)
        }

        parseTransformsMutation(result)

        if (result.experimental_backgroundImage !== undefined) {
            result.experimental_backgroundImage = resolveGradient(result.experimental_backgroundImage)
        }

        return {
            styles: result as RNStyle,
            dependencies: Array.from(new Set(dependencies)),
        }
    }
}

export const UniwindStore = new UniwindStoreBuilder()

if (__DEV__) {
    globalThis.__uniwind__hot_reload = () => {
        UniwindStore.reload()
    }
}

Dimensions.addEventListener('change', ({ window }) => {
    const newOrientation = window.width > window.height ? Orientation.Landscape : Orientation.Portrait
    const orientationChanged = UniwindStore.runtime.orientation !== newOrientation

    UniwindStore.runtime.screen = {
        width: window.width,
        height: window.height,
    }
    UniwindStore.runtime.orientation = newOrientation
    UniwindStore.notifyListeners([
        ...orientationChanged ? [StyleDependency.Orientation] : [],
        StyleDependency.Dimensions,
    ])
})
