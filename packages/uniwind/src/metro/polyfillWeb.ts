import { TokenOrValue, transform } from 'lightningcss'

const ONE_PX = { type: 'token', value: { type: 'dimension', unit: 'px', value: 1 } } satisfies TokenOrValue

export const polyfillWeb = (css: string) => {
    const result = transform({
        code: Buffer.from(css),
        filename: 'uniwind.css',
        visitor: {
            Function: {
                pixelRatio: fn => {
                    return {
                        type: 'function',
                        value: {
                            name: 'calc',
                            arguments: [
                                fn.arguments.at(0) ?? ONE_PX,
                                { type: 'token', value: { type: 'delim', value: '*' } },
                                ONE_PX,
                            ],
                        },
                    } satisfies TokenOrValue
                },
                fontScale: fn => {
                    return {
                        type: 'function',
                        value: {
                            name: 'calc',
                            arguments: [
                                fn.arguments.at(0) ?? ONE_PX,
                                { type: 'token', value: { type: 'delim', value: '*' } },
                                { type: 'token', value: { type: 'dimension', value: 1, unit: 'rem' } },
                            ],
                        },
                    } satisfies TokenOrValue
                },
                hairlineWidth: () => ONE_PX,
            },
        },
    })

    return result.code.toString()
}
