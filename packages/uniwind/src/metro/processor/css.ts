import { Declaration } from 'lightningcss'
import { Logger } from '../logger'
import { DeclarationValues, ProcessMetaValues } from '../types'
import type { ProcessorBuilder } from './processor'

export class CSS {
    private readonly logger = new Logger('CSS')

    constructor(private readonly Processor: ProcessorBuilder) {}

    processDeclaration(declaration: Declaration, className: string) {
        if (declaration.property === 'unparsed') {
            return {
                property: declaration.value.propertyId.property,
                value: this.processValue(declaration.value.value, {
                    propertyName: declaration.value.propertyId.property,
                    className,
                }),
            }
        }

        if (declaration.property === 'custom') {
            return {
                property: declaration.value.name,
                value: this.processValue(declaration.value.value, {
                    propertyName: declaration.value.name,
                    className,
                }),
            }
        }

        return {
            property: declaration.property,
            value: this.processValue(declaration.value, {
                propertyName: declaration.property,
                className,
            }),
        }
    }

    processValue(declarationValue: DeclarationValues, meta = {} as ProcessMetaValues): any {
        if (meta.propertyName !== undefined && this.Processor.Shadow.isShadowKey(meta.propertyName)) {
            return this.Processor.Shadow.processShadow(declarationValue)
        }

        if (typeof declarationValue !== 'object') {
            return declarationValue
        }

        if (('type' in declarationValue)) {
            switch (declarationValue.type) {
                case 'function':
                    if (typeof declarationValue.value !== 'object') {
                        this.logger.error(`Unsupported function - ${declarationValue.value}`)

                        return declarationValue.type
                    }

                    if (declarationValue.value.name === 'calc') {
                        return this.processValue(declarationValue.value.arguments)
                    }

                    this.logger.error(`Unsupported function - ${declarationValue.value.name}`)

                    return declarationValue.type
                case 'var':
                    return this.Processor.Var.processVar(declarationValue.value)
                case 'number':
                    return declarationValue.value
                case 'token':
                    return this.processValue(declarationValue.value)
                case 'length':
                    return this.Processor.Units.processAnyLength(declarationValue.value)
                case 'color':
                    return this.Processor.Color.processColor(declarationValue.value)
                case 'integer':
                    return declarationValue.value
                case 'comma':
                    return ', '
                case 'dimension':
                case 'value':
                case 'length-percentage':
                    return this.Processor.Units.processLength(declarationValue.value)
                case 'percentage':
                    return `${declarationValue.value * 100}%`
                case 'token-list':
                    return declarationValue.value.reduce((acc, token) => {
                        const tokenValue = this.processValue(token)

                        return acc + tokenValue
                    }, '')
                case 'rgb':
                    return this.Processor.Color.processColor(declarationValue)
                case 'delim':
                    return ` ${declarationValue.value} `
                case 'ident':
                    if (declarationValue.value === 'inset') {
                        return true
                    }

                    if (declarationValue.value === 'currentcolor') {
                        return 'this["currentColor"]'
                    }

                    return declarationValue.value
                case 'white-space':
                case 'string':
                case 'self-position':
                case 'content-distribution':
                case 'content-position':
                    return declarationValue.value
                default:
                    // CSS string properties like absolute, relative, italic, etc.
                    if (Object.keys(declarationValue).length === 1) {
                        return declarationValue.type
                    }

                    this.logger.error(`Unsupported value type - ${declarationValue.type}`)

                    return declarationValue.type
            }
        }

        if ('top' in declarationValue) {
            return {
                top: this.processValue(declarationValue.top),
                right: this.processValue(declarationValue.right),
                bottom: this.processValue(declarationValue.bottom),
                left: this.processValue(declarationValue.left),
            }
        }

        if ('topLeft' in declarationValue) {
            return {
                topLeft: this.processValue(declarationValue.topLeft),
                topRight: this.processValue(declarationValue.topRight),
                bottomLeft: this.processValue(declarationValue.bottomLeft),
                bottomRight: this.processValue(declarationValue.bottomRight),
            }
        }

        if ('grow' in declarationValue) {
            return {
                flexGrow: declarationValue.grow,
                flexShrink: declarationValue.shrink,
                flexBasis: this.processValue(declarationValue.basis),
            }
        }

        if (Array.isArray(declarationValue)) {
            return declarationValue.reduce<string | number>((acc, value, index, array) => {
                if (typeof value === 'object') {
                    // Dimensions might be duplicated
                    if (this.isDimension(value) && this.isDimension(array.at(index + 1))) {
                        return acc
                    }

                    const result = this.processValue(value)

                    return acc === '' && typeof result === 'number'
                        ? result
                        : acc + result
                }

                return acc + value
            }, '')
        }

        this.logger.error(`Unsupported value type - ${JSON.stringify(declarationValue)}`)

        return declarationValue
    }

    private isDimension(value: any): value is { type: 'dimension' } {
        return typeof value === 'object' && 'type' in value && value.type === 'dimension'
    }
}
