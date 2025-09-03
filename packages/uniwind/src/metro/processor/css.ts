import { Declaration, OverflowKeyword } from 'lightningcss'
import { Logger } from '../logger'
import { DeclarationValues, ProcessMetaValues } from '../types'
import { pipe } from '../utils'
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

                    if (declarationValue.value.name === 'cubic-bezier') {
                        const cubicArguments = pipe(this.processValue(declarationValue.value.arguments))(
                            String,
                            x => x.replace(/,\s/g, ','),
                        )

                        return `rt.cubicBezier(${cubicArguments})`
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
                case 'translate': {
                    const [translateX, translateY] = declarationValue.value.map(x => this.processValue(x))

                    return [
                        {
                            translateX,
                        },
                        {
                            translateY,
                        },
                    ]
                }
                case 'translateX':
                    return {
                        translateX: this.Processor.Units.processLength(declarationValue.value),
                    }
                case 'translateY':
                    return {
                        translateY: this.Processor.Units.processLength(declarationValue.value),
                    }
                case 'translateZ': {
                    return {
                        translateZ: this.processValue(declarationValue.value),
                    }
                }
                case 'rotate':
                    return {
                        rotate: `${declarationValue.value.value}${declarationValue.value.type}`,
                    }
                case 'rotateX':
                    return {
                        rotateX: `${declarationValue.value.value}${declarationValue.value.type}`,
                    }
                case 'rotateY':
                    return {
                        rotateY: `${declarationValue.value.value}${declarationValue.value.type}`,
                    }
                case 'rotateZ':
                    return {
                        rotateZ: `${declarationValue.value.value}${declarationValue.value.type}`,
                    }
                case 'scale': {
                    const [scaleX, scaleY] = declarationValue.value.map(x => this.processValue(x))

                    if (scaleX === scaleY) {
                        return {
                            scale: scaleX,
                        }
                    }

                    return [
                        {
                            scaleX,
                        },
                        {
                            scaleY,
                        },
                    ]
                }
                case 'scaleX':
                    return {
                        scaleX: this.processValue(declarationValue.value),
                    }
                case 'scaleY':
                    return {
                        scaleY: this.processValue(declarationValue.value),
                    }
                case 'scaleZ':
                    return {
                        scaleZ: this.processValue(declarationValue.value),
                    }
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
                case 'env':
                    if (declarationValue.value.name.type === 'ua' && declarationValue.value.name.value.startsWith('safe-area-inset-')) {
                        const inset = declarationValue.value.name.value.replace('safe-area-inset-', '')

                        return `rt.insets.${inset}`
                    }

                    this.logger.error(`Unsupported env value - ${JSON.stringify(declarationValue.value)}`)

                    return declarationValue.value
                case 'time': {
                    const unit = declarationValue.value.type === 'milliseconds' ? 'ms' : 's'

                    return `${declarationValue.value.value}${unit}`
                }
                case 'cubic-bezier': {
                    const bezier = [
                        declarationValue.x1,
                        declarationValue.y1,
                        declarationValue.x2,
                        declarationValue.y2,
                    ]

                    return `rt.cubicBezier(${bezier.join(',')})`
                }
                case 'seconds':
                    return `${declarationValue.value}s`
                case 'milliseconds':
                    return `${declarationValue.value}ms`
                case 'pair':
                    return declarationValue.inside.type
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
            switch (meta.propertyName) {
                case 'transform':
                    return declarationValue.reduce<Array<any>>((acc, value) => {
                        if (typeof value === 'object') {
                            const result = this.processValue(value)

                            acc.push(result)

                            return acc
                        }

                        acc.push(value)

                        return acc
                    }, [])
                default:
                    return declarationValue.reduce<string | number>((acc, value, index, array) => {
                        if (typeof value === 'object') {
                            const nextValue = array.at(index + 1)

                            // Dimensions might be duplicated
                            if (this.isDimension(value) && this.isDimension(nextValue)) {
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
        }

        if ('property' in declarationValue) {
            const property = typeof declarationValue.property === 'string'
                ? declarationValue.property
                : declarationValue.property.property

            return `${property},`
        }

        if ('case' in declarationValue) {
            return declarationValue.case
        }

        if ('angle' in declarationValue) {
            const angles = pipe([
                ['rotateX', declarationValue.x * declarationValue.angle.value],
                ['rotateY', declarationValue.y * declarationValue.angle.value],
                ['rotateZ', declarationValue.z * declarationValue.angle.value],
            ])(
                x => x.filter(([, value]) => value !== 0),
                x => x.map(([key, value]) => ({ [String(key)]: `${value}${declarationValue.angle.type}` })),
            )

            return angles
        }

        if (this.isOverflow(declarationValue)) {
            if (declarationValue.x === declarationValue.y) {
                return {
                    overflow: declarationValue.x,
                }
            }

            return {
                overflowX: declarationValue.x,
                overflowY: declarationValue.y,
            }
        }

        this.logger.error(
            [
                `Unsupported value ${JSON.stringify(declarationValue)}`,
                meta.propertyName !== undefined ? `for property ${meta.propertyName}` : null,
                meta.className !== undefined ? `for className ${meta.className}` : null,
            ].filter(Boolean).join(' '),
        )

        return declarationValue
    }

    private isDimension(value: any): value is { type: 'dimension' } {
        return typeof value === 'object' && 'type' in value && value.type === 'dimension'
    }

    private isOverflow(value: any): value is { x: OverflowKeyword; y: OverflowKeyword } {
        return typeof value === 'object' && 'x' in value && ['hidden', 'visible'].includes(value.x)
    }
}
