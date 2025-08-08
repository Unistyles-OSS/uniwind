import { UniwindRuntime } from '../../runtime'
import { Style, StyleSheets } from '../../types'
import { styleToClass } from '../../utils'
import { RNStyle, RNStylesProps, UniwindComponentProps } from '../props'

export class UniwindStoreBuilder {
    stylesheets = {} as StyleSheets
    listeners = new Set<() => void>()
    initialized = false

    subscribe(onStoreChange: () => void) {
        if (!this.initialized) {
            this.initialized = true
            this.reload()
        }

        const listener = () => {
            onStoreChange()
        }

        return () => this.listeners.delete(listener)
    }

    getStyles(className: string) {
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
        const result = {} as Record<string, unknown>
        const bestBreakpoints = {} as Record<string, number>
        const stylesUsingVariables = [] as Array<[string, string]>
        const inlineVariables = [] as Array<[string, () => unknown]>

        styles.forEach(style => {
            if (
                style === undefined
                || style.minWidth > UniwindRuntime.screen.width
                || style.maxWidth < UniwindRuntime.screen.height
            ) {
                return
            }

            inlineVariables.push(...style.inlineVariables)

            style.entries.forEach(([property, value]) => {
                if (
                    style.orientation !== null
                    && UniwindRuntime.orientation === style.orientation
                ) {
                    if (style.stylesUsingVariables[property] !== undefined) {
                        stylesUsingVariables.push([property, style.stylesUsingVariables[property]])
                    }

                    result[property] = value
                    bestBreakpoints[property] = Infinity

                    return
                }

                if (bestBreakpoints[property] === undefined || style.minWidth >= bestBreakpoints[property]) {
                    if (style.stylesUsingVariables[property] !== undefined) {
                        stylesUsingVariables.push([property, style.stylesUsingVariables[property]])
                    }

                    bestBreakpoints[property] = style.minWidth
                    result[property] = value
                }
            })
        })

        if (inlineVariables.length > 0) {
            const originalVars = [] as Array<[string, PropertyDescriptor | undefined]>

            inlineVariables.forEach(([varName, varValue]) => {
                originalVars.push([varName, Object.getOwnPropertyDescriptor(this.stylesheets.vars, varName)])
                Object.defineProperty(this.stylesheets.vars, varName, {
                    get: varValue,
                })
            })

            stylesUsingVariables.forEach(([style, className]) => {
                const allEntries = Object.fromEntries(this.stylesheets[className]!.entries)
                result[style] = allEntries[style]
            })

            originalVars.forEach(([varName, descriptor]) => {
                descriptor && Object.defineProperty(this.stylesheets.vars, varName, descriptor)
            })
        }

        return result
    }

    reload = () => {
        this.stylesheets = globalThis.__uniwind__computeStylesheet(UniwindRuntime)
        this.listeners.forEach(listener => listener())
    }
}

export const UniwindStore = new UniwindStoreBuilder()

if (__DEV__) {
    globalThis.__uniwind__hot_reload = () => {
        UniwindStore.reload()
    }
}
