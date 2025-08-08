import { Processor } from './processor'
import { escapeDynamic } from './utils'

export const createVarsTemplate = (theme: Record<string, any>) => {
    const vars = Object.entries(theme).reduce<Record<string, any>>((varsAcc, [varName, value]) => {
        if (typeof value !== 'string') {
            varsAcc[varName] = value

            return varsAcc
        }

        if (value.startsWith('var(--')) {
            const varValue = varsAcc[value.slice(4, -1)]

            varsAcc[varName] = varValue

            return varsAcc
        }

        const processedValue = Processor.CSS.processCSSValue(value, varName)

        if (varName.endsWith('--line-height')) {
            const fontSize = varsAcc[varName.replace('--line-height', '')]

            varsAcc[varName] = `(${fontSize} * ${String(processedValue)})`

            return varsAcc
        }

        varsAcc[varName] = processedValue

        return varsAcc
    }, {})

    return Object.entries(vars).reduce((acc, [key, value]) => {
        const stringifiedValue = value === undefined
            ? 'undefined'
            : escapeDynamic(JSON.stringify(value))

        if (stringifiedValue.includes('vars[')) {
            return `${acc}get "${key}"() { return ${stringifiedValue} },`
        }

        return `${acc}"${key}":${stringifiedValue},`
    }, '')
}
