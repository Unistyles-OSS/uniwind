/* eslint-disable max-depth */
import { Dimensions, Platform } from 'react-native'
import { Orientation, StyleDependency } from '../../types'
import { ComponentState, RNStyle, Style, StyleSheets } from '../types'
import { parseBoxShadow, parseFontVariant, parseTransformsMutation, resolveGradient } from './parsers'
import { UniwindRuntime } from './runtime'

type StylesResult = {
    styles: RNStyle
    dependencies: Array<StyleDependency>
}

export class UniwindStoreBuilder {
    stylesheets = {} as StyleSheets
    listeners = {
        [StyleDependency.ColorScheme]: new Set<() => void>(),
        [StyleDependency.Theme]: new Set<() => void>(),
        [StyleDependency.Dimensions]: new Set<() => void>(),
        [StyleDependency.Orientation]: new Set<() => void>(),
        [StyleDependency.Insets]: new Set<() => void>(),
        [StyleDependency.FontScale]: new Set<() => void>(),
        [StyleDependency.Rtl]: new Set<() => void>(),
    }
    initialized = false
    runtime = UniwindRuntime
    cache = new Map<string, StylesResult>()

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

    getStyles(className?: string, state?: ComponentState): StylesResult {
        if (className === undefined || className === '') {
            return {
                styles: {},
                dependencies: [],
            }
        }

        const cacheKey = `${className}${state?.isDisabled ?? false}${state?.isFocused ?? false}${state?.isPressed ?? false}`

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!
        }

        if (!this.initialized) {
            this.initialized = true
            this.reload()
        }

        const result = this.resolveStyles(className, state)

        this.cache.set(cacheKey, result)

        const cacheReset = () => {
            this.cache.delete(cacheKey)
            result.dependencies.forEach(dep => this.listeners[dep].delete(cacheReset))
        }

        this.subscribe(cacheReset, result.dependencies)

        return result
    }

    reload = () => {
        const styleSheet = globalThis.__uniwind__computeStylesheet(this.runtime)
        const themeVars = styleSheet[`__uniwind-theme-${this.runtime.currentThemeName}`]
        const platformVars = styleSheet[`__uniwind-platform-${Platform.OS}`]

        if (themeVars) {
            Object.assign(styleSheet, themeVars)
        }

        if (platformVars) {
            Object.assign(styleSheet, platformVars)
        }

        this.stylesheets = styleSheet
    }

    notifyListeners = (dependencies: Array<StyleDependency>) => {
        dependencies.forEach(dep => this.listeners[dep].forEach(listener => listener()))
    }

    private resolveStyles(classNames: string, state?: ComponentState) {
        const result = {} as Record<string, any>
        const dependencies = [] as Array<StyleDependency>
        const bestBreakpoints = new Map<string, Style>()

        for (const className of classNames.split(' ')) {
            if (!(className in this.stylesheets)) {
                continue
            }

            for (const style of this.stylesheets[className] as Array<Style>) {
                dependencies.push(...style.dependencies)

                if (
                    style.minWidth > this.runtime.screen.width
                    || style.maxWidth < this.runtime.screen.height
                    || (style.theme !== null && this.runtime.currentThemeName !== style.theme)
                    || (style.orientation !== null && this.runtime.orientation !== style.orientation)
                    || (style.rtl !== null && this.runtime.rtl !== style.rtl)
                    || (style.active !== null && state?.isPressed !== style.active)
                    || (style.focus !== null && state?.isFocused !== style.focus)
                    || (style.disabled !== null && state?.isDisabled !== style.disabled)
                ) {
                    continue
                }

                style.usedVars.forEach(varName => {
                    if (varName in this.stylesheets && !(varName in result)) {
                        Object.defineProperty(result, varName, {
                            configurable: true,
                            enumerable: false,
                            get: this.stylesheets[varName] as () => unknown,
                        })
                    }
                })

                for (const [property, valueGetter] of style.entries) {
                    const previousBest = bestBreakpoints.get(property)

                    if (
                        previousBest
                        && (
                            previousBest.minWidth > style.minWidth
                            || previousBest.complexity > style.complexity
                            || previousBest.importantProperties.includes(property)
                        )
                    ) {
                        continue
                    }

                    Object.defineProperty(result, property, {
                        configurable: true,
                        get: valueGetter,
                        enumerable: property[0] !== '-',
                    })
                    bestBreakpoints.set(property, style)
                }
            }
        }

        if (result.lineHeight !== undefined && result.lineHeight < 6) {
            Object.defineProperty(result, 'lineHeight', {
                value: result.fontSize * result.lineHeight,
            })
        }

        if (result.boxShadow !== undefined) {
            Object.defineProperty(result, 'boxShadow', {
                value: parseBoxShadow(result.boxShadow),
            })
        }

        if (result.visibility !== undefined && result.visibility === 'hidden') {
            Object.defineProperty(result, 'visibility', {
                value: 'hidden',
            })
        }

        if (
            result.borderStyle !== undefined && result.borderColor === undefined
        ) {
            Object.defineProperty(result, 'borderColor', {
                value: '#000000',
            })
        }

        if (result.fontVariant !== undefined) {
            Object.defineProperty(result, 'fontVariant', {
                value: parseFontVariant(result.fontVariant),
            })
        }

        parseTransformsMutation(result)

        if (result.experimental_backgroundImage !== undefined) {
            Object.defineProperty(result, 'experimental_backgroundImage', {
                value: resolveGradient(result.experimental_backgroundImage),
            })
        }

        return {
            styles: { ...result } as RNStyle,
            dependencies: Array.from(new Set(dependencies)),
        }
    }
}

export const UniwindStore = new UniwindStoreBuilder()

if (__DEV__) {
    globalThis.__uniwind__hot_reload = () => {
        UniwindStore.reload()
        UniwindStore.notifyListeners([StyleDependency.Theme])
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
