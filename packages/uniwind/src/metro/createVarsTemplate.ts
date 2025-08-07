import { Processor } from './processor'
import { escapeDynamic } from './utils'

export const createVarsTemplate = (theme: Record<string, any>) => {
    const template = Object.entries(theme).reduce<Record<string, any>>((varsAcc, [varName, value]) => {
        if (typeof value !== 'string') {
            varsAcc[varName] = value

            return varsAcc
        }

        if (value.startsWith('var(--')) {
            const varValue = varsAcc[value.slice(4, -1)]

            varsAcc[varName] = varValue

            return varsAcc
        }

        const processedValue = Processor.CSS.processCSSValue(value)

        if (varName.endsWith('--line-height')) {
            const fontSize = varsAcc[varName.replace('--line-height', '')]

            varsAcc[varName] = `(${fontSize} * ${String(processedValue)})`

            return varsAcc
        }

        varsAcc[varName] = processedValue

        return varsAcc
    }, {})
    const stringifiedTemplate = escapeDynamic(JSON.stringify(template))

    return `globalThis.__uniwind__getVars = rt => (${stringifiedTemplate})`
}
