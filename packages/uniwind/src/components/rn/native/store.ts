import { UniwindRuntime } from '../../runtime'
import { Style, StyleSheets } from '../../types'
import { styleToClass } from '../../utils'
import { RNStyle, RNStylesProps, UniwindComponentProps } from '../props'

export class UniwindStoreBuilder {
    stylesheets = {} as StyleSheets
    listeners = new Set<() => void>()
    initialized = false
    runtime = UniwindRuntime

    subscribe(onStoreChange: () => void) {
        const listener = () => {
            onStoreChange()
        }

        return () => this.listeners.delete(listener)
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
        return {
            dynamicStyles: {
                style: [
                    this.getStyles(props.className ?? ''),
                    props.style,
                ],
                ...additionalStyles?.reduce((acc, styleProp) => {
                    const className = props[styleToClass(styleProp)] ?? ''

                    acc[styleProp] = [
                        this.getStyles(className),
                        props[styleProp],
                    ]

                    return acc
                }, {} as Record<RNStylesProps, [RNStyle, unknown]>),
            },
        }
    }

    resolveStyles(styles: Array<Style | undefined>) {
        const result = {} as Record<string, any>
        const bestBreakpoints = {} as Record<string, number>
        const stylesUsingVariables = [] as Array<[string, string]>
        const inlineVariables = [] as Array<[string, () => unknown]>

        styles.forEach(style => {
            if (
                style === undefined
                || style.minWidth > this.runtime.screen.width
                || style.maxWidth < this.runtime.screen.height
            ) {
                return
            }

            inlineVariables.push(...style.inlineVariables)

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

                    result[property] = value
                    bestBreakpoints[property] = style.colorScheme !== null || style.orientation !== null || style.rtl !== null || style.native
                        ? Infinity
                        : style.minWidth
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

            stylesUsingVariables.forEach(([style, className]) => {
                const allEntries = Object.fromEntries(this.stylesheets[className]!.entries)

                result[style] = allEntries[style]
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
            result.lineHeight = result.lineHeight * (result.fontSize ?? 1)
        }

        if (result.boxShadow !== undefined) {
            result.boxShadow = result.boxShadow.flat()
        }

        return result
    }

    reload = () => {
        this.runtime = UniwindRuntime
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
