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
            .map(className => this.stylesheets[className])

        return this.resolveStyles(styles)
    }

    reload = () => {
        this.stylesheets = globalThis.__uniwind__computeStylesheet(this.runtime)
        this.listeners.forEach(listener => listener())
    }

    private resolveStyles(styles: Array<Style | undefined>) {
        const result = {} as Record<string, any>
        const bestBreakpoints = {} as Record<string, number>
        const stylesUsingVariables = [] as Array<[string, string]>
        const inlineVariables = [] as Array<[string, () => unknown]>
        const dependencies = [] as Array<StyleDependency>

        styles.flat().forEach(style => {
            if (
                style === undefined
                || style.minWidth > this.runtime.screen.width
                || style.maxWidth < this.runtime.screen.height
            ) {
                return
            }

            inlineVariables.push(...style.inlineVariables)
            dependencies.push(...style.dependencies)

            style.entries.forEach(([property, value]) => {
                if (
                    style.minWidth >= (bestBreakpoints[property] ?? 0)
                    && (style.colorScheme === null || this.runtime.colorScheme === style.colorScheme)
                    && (style.orientation === null || this.runtime.orientation === style.orientation)
                    && (style.rtl === null || this.runtime.rtl === style.rtl)
                ) {
                    if (style.stylesUsingVariables[property] !== undefined) {
                        stylesUsingVariables.push([property, style.stylesUsingVariables[property]])
                    }

                    bestBreakpoints[property] = style.colorScheme !== null || style.orientation !== null || style.rtl !== null || style.native
                        ? Infinity
                        : style.minWidth

                    if (property === 'transform' && Array.isArray(value)) {
                        result[property] = result[property] ?? []
                        result[property].push(...value)

                        return
                    }

                    result[property] = value
                }
            })
        })

        if (inlineVariables.length > 0) {
            const originalVars = new Map<string, PropertyDescriptor | undefined>()

            inlineVariables.forEach(([varName, varValue]) => {
                !originalVars.has(varName) && originalVars.set(varName, Object.getOwnPropertyDescriptor(this.stylesheets, varName))
                Object.defineProperty(this.stylesheets, varName, {
                    get: varValue,
                    configurable: true,
                })
            })

            stylesUsingVariables.forEach(([property, className]) => {
                const allEntries = Object.fromEntries(this.stylesheets[className]!.entries)
                const value = allEntries[property]

                if (property === 'transform' && Array.isArray(value)) {
                    result[property].push(...value)
                } else {
                    result[property] = value
                }
            })

            originalVars.forEach((descriptor, varName) => {
                if (descriptor) {
                    Object.defineProperty(this.stylesheets, varName, descriptor)

                    return
                }

                delete this.stylesheets[varName]
            })
        }

        if (result.lineHeight !== undefined) {
            result.lineHeight = result.lineHeight * (result.fontSize ?? this.runtime.rem)
        }

        if (result.boxShadow !== undefined) {
            result.boxShadow = result.boxShadow.flat()
        }

        if (result.transform !== undefined) {
            result.transform = result.transform.filter(Boolean)
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
