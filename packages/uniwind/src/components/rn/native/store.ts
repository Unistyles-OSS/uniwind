import { UniwindRuntime } from '../../runtime'
import { StyleSheets } from '../../types'
import { styleToClass } from '../../utils'
import { RNStyle, RNStylesProps, UniwindComponentProps } from '../props'
import { resolveStyles } from './resolveStyles'

export class UniwindStoreBuilder {
    vars = {} as Record<string, unknown>
    stylesheets = {} as StyleSheets
    listeners = new Set<() => void>()
    styleCache = new Map<string, RNStyle>()
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
        const cached = this.styleCache.get(className)

        if (cached) {
            return cached
        }

        const styles = className
            .split(' ')
            .map(className => this.stylesheets[className])
        const style = resolveStyles(styles)

        this.styleCache.set(className, style)

        return style
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

    reload = () => {
        this.vars = globalThis.__uniwind__getVars(UniwindRuntime)
        this.stylesheets = globalThis.__uniwind__computeStylesheet(UniwindRuntime, this.vars)
        this.listeners.forEach(listener => listener())
        this.styleCache.clear()
    }
}

export const UniwindStore = new UniwindStoreBuilder()

if (__DEV__) {
    globalThis.__uniwind__hot_reload = () => {
        UniwindStore.reload()
    }
}
