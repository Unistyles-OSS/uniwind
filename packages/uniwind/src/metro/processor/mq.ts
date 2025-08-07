import { Orientation } from '../types'
import { isDefined } from '../utils'
import type { ProcessorBuilder } from './processor'

export class MQ {
    constructor(readonly Processor: ProcessorBuilder) {}

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

        const orientation = (
            lower.match(/orientation\s*:\s*(portrait|landscape)/)?.[1]
                ?? null
        ) as Orientation | null

        return {
            minWidth: isDefined(minWidth) ? this.Processor.CSS.processCSSValue(minWidth) : 0,
            maxWidth: isDefined(maxWidth) ? this.Processor.CSS.processCSSValue(maxWidth) : Number.MAX_VALUE,
            orientation,
        }
    }
}
