import { StyleDependency } from '../types'
import { resolveGradient } from './gradient'
import { listenToNativeUpdates } from './nativeListener'
import { UniwindRuntime } from './runtime'
import { Style, StyleSheets } from './types'

export class UniwindStoreBuilder {
    stylesheets = {} as StyleSheets
    listeners = new Set<() => void>()
    initialized = false
    runtime = UniwindRuntime

    subscribe(onStoreChange: () => void, dependencies: Array<StyleDependency>) {
        const dispose = listenToNativeUpdates(onStoreChange, dependencies)

        this.listeners.add(onStoreChange)

        return () => {
            this.listeners.delete(onStoreChange)
            dispose()
        }
    }

    getStyles(className?: string) {
        if (className === undefined) {
            return {
                styles: {},
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
        this.listeners.forEach(listener => listener())
    }

    private resolveStyles(styles: Array<[string, Style]>) {
        const filteredStyles = styles.filter(([, style]) => {
            if (
                style.minWidth > this.runtime.screen.width
                || style.maxWidth < this.runtime.screen.height
                || (style.colorScheme !== null && this.runtime.colorScheme !== style.colorScheme)
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
        const dependencies = [] as Array<StyleDependency>
        const usingVariables = new Map<string, Style>()

        filteredStyles.forEach(([, style]) => {
            style.inlineVariables.forEach(([varName, varValue]) => {
                const previousBest = bestBreakpoints.get(varName)

                if (previousBest && previousBest.minWidth > style.minWidth) {
                    return
                }

                bestBreakpoints.set(varName, style)
                inlineVariables.set(varName, varValue)
            })

            style.entries.forEach(([property, value]) => {
                const previousBest = bestBreakpoints.get(property)

                if (previousBest && previousBest.minWidth > style.minWidth) {
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

        if (result.lineHeight !== undefined) {
            result.lineHeight = result.lineHeight * (result.fontSize ?? this.runtime.rem)
        }

        if (result.boxShadow !== undefined) {
            // TODO: Parse box shadow in runtime
        }

        if (result.transform !== undefined) {
            // TODO: Parse transform in runtime
        }

        if (result.experimental_backgroundImage !== undefined) {
            result.experimental_backgroundImage = resolveGradient(result.experimental_backgroundImage)
        }

        return {
            styles: result,
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
