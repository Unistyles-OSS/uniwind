import { ColorScheme, Orientation, WritingDirection } from '../../types'
import { isDefined } from '../utils'
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
            }) ?? ColorScheme.Light,
            dir: this.getFromClassName(lower, {
                ltr: WritingDirection.Ltr,
                rtl: WritingDirection.Rtl,
            }),
        }
    }

    processMediaQuery(mq: string) {
        const lower = mq.toLowerCase()

        // Full range: "100px <= width < 200px"
        const fullRangeMatch = lower.match(
            /([\d.]+[a-z%]+)\s*<=\s*width\s*<\s*([\d.]+[a-z%]+)/,
        ) ?? null

        const minWidth = fullRangeMatch
            ? fullRangeMatch[1]
            : [
                /width\s*>=\s*([\d.]+[a-z%]+)/, // width >= N → min-width
                /([\d.]+[a-z%]+)\s*<=\s*width/, // N <= width → min-width
                /width\s*>\s*([\d.]+[a-z%]+)/, // width > N → min-width
                /min-width\s*:\s*([\d.]+[a-z%]+)/, // classic min-width
            ].reduce<string | null>(
                (found, rx) => found ?? (lower.match(rx)?.[1] ?? null),
                null,
            )

        const maxWidth = fullRangeMatch
            ? fullRangeMatch[2]
            : [
                /width\s*<=\s*([\d.]+[a-z%]+)/, // width <= N → max-width
                /([\d.]+[a-z%]+)\s*>=\s*width/, // N >= width → max-width
                /width\s*<\s*([\d.]+[a-z%]+)/, // width < N → max-width
                /max-width\s*:\s*([\d.]+[a-z%]+)/, // classic max-width
            ].reduce<string | null>(
                (found, rx) => found ?? (lower.match(rx)?.[1] ?? null),
                null,
            )

        return {
            minWidth: isDefined(minWidth) ? this.Processor.CSS.processCSSValue(minWidth) : 0,
            maxWidth: isDefined(maxWidth) ? this.Processor.CSS.processCSSValue(maxWidth) : Number.MAX_VALUE,
        }
    }

    private getFromClassName<T extends Record<string, any>>(className: string, resolver: T) {
        const [, value] = Object.entries(resolver).find(([name]) => className.includes(name)) ?? []

        return (value ?? null) as T[keyof T] | null
    }
}
