import { Declaration, MediaQuery, Rule } from 'lightningcss'
import { Processor } from '../processor'

export const createVarsTemplate = (rules: Array<Rule<Declaration, MediaQuery>>) => {
    const vars: Record<string, string> = {}

    const parseDeclaration = (declaration: Declaration) => {
        if (declaration.property === 'custom' && declaration.value.name.startsWith('--')) {
            vars[declaration.value.name] = Processor.CSS.processValue(declaration.value.value)
        }
    }

    rules.forEach(rule => {
        if (rule.type === 'style') {
            rule.value.declarations?.declarations?.forEach(parseDeclaration)
        }
    })

    return vars
}
