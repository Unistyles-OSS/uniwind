import { compile } from '@tailwindcss/node'
import { polyfillWeb } from './polyfillWeb'
import { ProcessorBuilder } from './processor'
import { addMetaToStylesTemplate, serializeJS } from './stylesheet'
import { Platform, Polyfills } from './types'

type CompileVirtualConfig = {
    cssPath: string
    css: string
    candidates: Array<string>
    platform: Platform
    themes: Array<string>
    polyfills: Polyfills | undefined
}

export const compileVirtual = async ({ candidates, css, cssPath, platform, themes, polyfills }: CompileVirtualConfig) => {
    const compiler = await compile(css, {
        base: cssPath,
        onDependency: () => void 0,
    })
    const tailwindCSS = compiler.build(candidates)

    if (platform === Platform.Web) {
        return polyfillWeb(tailwindCSS)
    }

    const Processor = new ProcessorBuilder(themes, polyfills)

    Processor.transform(tailwindCSS)

    const stylesheet = serializeJS(
        addMetaToStylesTemplate(Processor, platform),
        (key, value) => `"${key}": ${value}`,
    )
    const vars = serializeJS(
        Processor.vars,
        (key, value) => `get "${key}"() { return ${value} }`,
    )
    const scopedVars = Object.fromEntries(
        Object.entries(Processor.scopedVars)
            .map(([scopedVarsName, scopedVars]) => [
                scopedVarsName,
                serializeJS(scopedVars, (key, value) => `get "${key}"() { return ${value} }`),
            ]),
    )
    const serializedScopedVars = Object.entries(scopedVars)
        .map(([scopedVarsName, scopedVars]) => `"${scopedVarsName}": ({ ${scopedVars} }),`)
        .join('')
    const currentColorVar = `get currentColor() { return rt.colorScheme === 'dark' ? '#ffffff' : '#000000' },`

    return [
        '({',
        `scopedVars: ({ ${serializedScopedVars} }),`,
        `vars: ({ ${currentColorVar} ${vars} }),`,
        `stylesheet: ({ ${stylesheet} }),`,
        '})',
    ].join('')
}
