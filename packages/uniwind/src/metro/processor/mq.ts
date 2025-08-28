import { MediaQuery } from 'lightningcss'
import { ColorScheme, Orientation } from '../../types'
import { MediaQueryResolver, Platform } from '../types'
import type { ProcessorBuilder } from './processor'

export class MQ {
    constructor(private readonly Processor: ProcessorBuilder) {}

    getInitialMediaQueryResolver(): MediaQueryResolver {
        return {
            minWidth: 0,
            maxWidth: Number.MAX_VALUE,
        }
    }

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

    processMediaQueries(mediaQueries: Array<MediaQuery>) {
        const mq = this.getInitialMediaQueryResolver()

        mediaQueries.forEach(mediaQuery => {
            const { condition } = mediaQuery

            if (condition?.type !== 'feature' || condition.value.type !== 'range' || condition.value.name !== 'width') {
                return
            }

            const { operator, value } = condition.value

            const result = this.Processor.CSS.processValue(value)

            if (operator === 'greater-than-equal' || operator === 'greater-than') {
                mq.minWidth = result
            }

            if (operator === 'less-than-equal' || operator === 'less-than') {
                mq.maxWidth = result
            }
        })

        return mq
    }

    private getFromClassName<T extends Record<string, any>>(className: string, resolver: T) {
        const [, value] = Object.entries(resolver).find(([name]) => className.includes(name)) ?? []

        return (value ?? null) as T[keyof T] | null
    }
}
