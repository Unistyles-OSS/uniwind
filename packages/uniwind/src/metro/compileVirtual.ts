import { compile } from '@tailwindcss/node'
import { polyfillWeb } from './polyfillWeb'
import { ProcessorBuilder } from './processor'
import { addMetaToStylesTemplate, serializeStylesheet } from './stylesheet'
import { Platform } from './types'

type CompileVirtualConfig = {
    cssPath: string
    css: string
    candidates: Array<string>
    platform: Platform
    themes: Array<string>
}

export const compileVirtual = async ({ candidates, css, cssPath, platform, themes }: CompileVirtualConfig) => {
    const compiler = await compile(css, {
        base: cssPath,
        onDependency: () => void 0,
    })
    const tailwindCSS = compiler.build(candidates)

    if (platform === Platform.Web) {
        return polyfillWeb(tailwindCSS)
    }

    const Processor = new ProcessorBuilder(themes)

    Processor.transform(tailwindCSS)

    return serializeStylesheet({ ...Processor.vars, ...addMetaToStylesTemplate(Processor, platform) })
}
