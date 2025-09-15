import { MediaQuery, QueryFeatureFor_MediaFeatureId } from 'lightningcss'
import { ColorScheme, Orientation } from '../../types'
import { MediaQueryResolver, Platform } from '../types'
import type { ProcessorBuilder } from './processor'

export class MQ {
    constructor(private readonly Processor: ProcessorBuilder) {}

    getInitialMediaQueryResolver(): MediaQueryResolver {
        return {
            minWidth: 0,
            maxWidth: Number.MAX_VALUE,
            platform: null,
            rtl: null,
            colorScheme: null,
            orientation: null,
        }
    }

    processMediaQueries(mediaQueries: Array<MediaQuery>) {
        const mq = this.getInitialMediaQueryResolver()

        mediaQueries.forEach(mediaQuery => {
            const { condition, mediaType } = mediaQuery

            if ([Platform.Android, Platform.iOS, Platform.Native].includes(mediaType as Platform)) {
                mq.platform = mediaType as Platform

                return
            }

            if (condition?.type !== 'feature') {
                return
            }

            if (condition.value.type === 'range') {
                this.processWidthMediaQuery(condition.value, mq)
            }

            if (condition.value.type === 'plain') {
                this.processPlainMediaQuery(condition.value, mq)
            }
        })

        return mq
    }

    private processWidthMediaQuery(query: QueryFeatureFor_MediaFeatureId & { type: 'range' }, mq: MediaQueryResolver) {
        const { operator, value } = query
        const result = this.Processor.CSS.processValue(value)

        if (operator === 'greater-than-equal' || operator === 'greater-than') {
            mq.minWidth = result
        }

        if (operator === 'less-than-equal' || operator === 'less-than') {
            mq.maxWidth = result
        }
    }

    private processPlainMediaQuery(query: QueryFeatureFor_MediaFeatureId & { type: 'plain' }, mq: MediaQueryResolver) {
        const { value, name } = query

        switch (name) {
            case 'orientation':
                mq.orientation = value.value as Orientation

                break
            case 'prefers-color-scheme':
                mq.colorScheme = value.value as ColorScheme

                break
            default:
                break
        }
    }
}
