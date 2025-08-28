import { ColorScheme, Orientation } from '../../types'
import { Platform } from '../types'
import type { ProcessorBuilder } from './processor'

export class MQ {
    constructor(readonly Processor: ProcessorBuilder) {}

    extractResolvers(className: string) {
        const lower = className.toLowerCase()

        return {
            orientation: this.getFromClassName(lower, {
                portrait: Orientation.Portrait,
                landscape: Orientation.Landscape,
            }),
            colorScheme: this.getFromClassName(lower, {
                dark: ColorScheme.Dark,
            }),
            rtl: this.getFromClassName(lower, {
                ltr: false,
                rtl: true,
            }),
            platform: this.getFromClassName(lower, {
                native: Platform.Native,
                android: Platform.Android,
                ios: Platform.iOS,
                web: Platform.Web,
            }),
        }
    }

    private getFromClassName<T extends Record<string, any>>(className: string, resolver: T) {
        const [, value] = Object.entries(resolver).find(([name]) => className.includes(name)) ?? []

        return (value ?? null) as T[keyof T] | null
    }
}
