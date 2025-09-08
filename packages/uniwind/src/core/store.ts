import { UniwindRuntime } from '../components/runtime'
import { StyleDependency } from '../types'
import { listenToNativeUpdates } from './nativeListener'
import { RNClassNameProps, RNStyle, RNStylesProps, Style, StyleSheets, UniwindComponentProps } from './types'

const styleToClass = (style: RNStylesProps) => style.replace('Style', 'ClassName') as RNClassNameProps

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

    getStyles(className: string) {
        if (!this.initialized) {
            this.initialized = true
            this.reload()
        }

        const styles = className
            .split(' ')
            .map(className => this.stylesheets[className])

        return this.resolveStyles(styles)
    }

    getSnapshot(props: UniwindComponentProps, additionalStyles?: Array<RNStylesProps>) {
        const { styles, dependencies } = this.getStyles(props.className ?? '')

        return {
            dynamicStyles: {
                style: [
                    styles,
                    props.style,
                ],
                ...additionalStyles?.reduce((acc, styleProp) => {
                    const className = props[styleToClass(styleProp)] ?? ''
                    const { styles, dependencies: additionalDependencies } = this.getStyles(className)

                    dependencies.push(...additionalDependencies)

                    acc[styleProp] = [
                        styles,
                        props[styleProp],
                    ]

                    return acc
                }, {} as Record<RNStylesProps, [RNStyle, unknown]>),
            },
            dependencies: Array.from(new Set(dependencies)),
        }
    }

    resolveStyles(styles: Array<Style | undefined>) {
        const result = {} as Record<string, any>
        const bestBreakpoints = {} as Record<string, number>
        const stylesUsingVariables = [] as Array<[string, string]>
        const inlineVariables = [] as Array<[string, () => unknown]>
        const dependencies = [] as Array<StyleDependency>

        styles.forEach(style => {
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
            const originalVars = [] as Array<[string, PropertyDescriptor | undefined]>

            inlineVariables.forEach(([varName, varValue]) => {
                originalVars.push([varName, Object.getOwnPropertyDescriptor(this.stylesheets, varName)])
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

            originalVars.forEach(([varName, descriptor]) => {
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

        return {
            styles: result,
            dependencies: Array.from(new Set(dependencies)),
        }
    }

    reload = () => {
        this.stylesheets = globalThis.__uniwind__computeStylesheet(this.runtime)
        this.listeners.forEach(listener => listener())
    }
}

export const UniwindStore = new UniwindStoreBuilder()

if (__DEV__) {
    globalThis.__uniwind__hot_reload = () => {
        UniwindStore.reload()
    }
}
