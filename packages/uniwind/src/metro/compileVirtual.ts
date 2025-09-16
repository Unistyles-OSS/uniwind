import { compile } from '@tailwindcss/node'
import fs from 'fs'
import path from 'path'
import { ProcessorBuilder } from './processor'
import { addMetaToStylesTemplate, serializeStylesheet } from './stylesheet'
import { Platform } from './types'

export const compileVirtual = async (input: string, getCandidates: () => Array<string>, platform: Platform) => {
    const cssPath = path.join(process.cwd(), input)
    const css = fs.readFileSync(cssPath, 'utf8')
    const compiler = await compile(css, {
        base: cssPath,
        onDependency: () => void 0,
    })
    const tailwindCSS = compiler.build(getCandidates())

    if (platform === Platform.Web) {
        return tailwindCSS
    }

    const Processor = new ProcessorBuilder()

    Processor.transform(tailwindCSS)

    return serializeStylesheet({ ...Processor.vars, ...addMetaToStylesTemplate(Processor, platform) })
}
