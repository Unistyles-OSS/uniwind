import { BoxShadow, transform } from 'lightningcss'
import { Logger } from '../logger'
import { DeclarationValues, ProcessMetaValues } from '../types'
import { pipe, replaceParentheses } from '../utils'
import type { ProcessorBuilder } from './processor'

type ShadowVar = {
    varName: string
    varValue: string
}

const SHADOW_COLOR_VAR = {
    type: 'var',
    value: {
        name: {
            ident: '--tw-shadow-color',
        },
        fallback: [
            {
                type: 'color',
                value: {
                    r: 0,
                    g: 0,
                    b: 0,
                    alpha: 0.25,
                    type: 'rgb',
                },
            },
        ],
    },
} satisfies DeclarationValues

export class Shadow {
    private readonly logger = new Logger('Shadow')

    private shadows = new Map<string, ShadowVar>()

    constructor(private readonly Processor: ProcessorBuilder) {}

    isShadowKey(key: string) {
        return [
            '--tw-inset-shadow',
            '--tw-inset-ring-shadow',
            '--tw-ring-offset-shadow',
            '--tw-ring-shadow',
            '--tw-shadow',
        ].includes(key)
    }

    registerShadowsFromCSS(css: string) {
        const classBlockRegex = /(?<selectors>\.[^{]+)\{(?<body>[\s\S]*?)\}/g
        const twShadowDeclRegex = /(--tw-shadow|--tw-inset-shadow|--tw-inset-ring-shadow|--tw-ring-offset-shadow|--tw-ring-shadow)\s*:\s*([^;]+);/
        const ruleMatches = Array.from(css.matchAll(classBlockRegex))

        ruleMatches.forEach(match => {
            const selectors = (match.groups?.selectors ?? '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
                .filter(s => /^\.[A-Za-z0-9_-]+$/.test(s))

            const body = match.groups?.body ?? ''
            const decl = body.match(twShadowDeclRegex)

            if (!decl) {
                return
            }

            const [, varName, varValue] = decl

            selectors.forEach(className => {
                // Remove the dot from className
                this.shadows.set(className.slice(1), {
                    varName: varName ?? '',
                    varValue: varValue?.trim() ?? '',
                })
            })
        }, [])
    }

    processShadow(value: DeclarationValues, meta: ProcessMetaValues) {
        const result = this.getShadowCSS(value, meta)
        const shadows: Array<BoxShadow> = []

        transform({
            code: Buffer.from(`.shadow { box-shadow: ${result}; }`),
            filename: 'shadow.css',
            visitor: {
                Declaration: declaration => {
                    if (declaration.property === 'box-shadow') {
                        shadows.push(...declaration.value)
                    }
                },
            },
        })

        if (shadows.length === 0) {
            this.logger.error(`No shadows were found`)
        }

        return shadows.map(shadow => {
            const color = typeof shadow.color === 'object' && shadow.color.type === 'currentcolor'
                ? SHADOW_COLOR_VAR
                : shadow.color

            return {
                offsetX: this.Processor.CSS.processValue(shadow.xOffset),
                offsetY: this.Processor.CSS.processValue(shadow.yOffset),
                blurRadius: this.Processor.CSS.processValue(shadow.blur),
                spreadDistance: this.Processor.CSS.processValue(shadow.spread),
                color: this.Processor.CSS.processValue(color),
                inset: shadow.inset,
            }
        })
    }

    private getShadowCSS(value: DeclarationValues, meta: ProcessMetaValues) {
        // Flow for inline shadow variables (shadow-2xl -> --tw-shadow)
        if (meta.className !== undefined) {
            const shadow = this.shadows.get(meta.className)

            if (!shadow) {
                this.logger.error(`No shadow variable was found for ${meta.className}`)

                return ''
            }

            return pipe(shadow.varValue)(
                replaceParentheses('var', () => 'currentColor'),
                x => x.replace('(currentColor)', 'currentColor'),
            )
        }

        // Flow for global shadow variables
        return this.Processor.CSS.processValue(value)
    }
}
