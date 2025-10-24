import { Scanner } from '@tailwindcss/oxide'
import fs from 'fs'
import type { JsTransformerConfig, JsTransformOptions } from 'metro-transform-worker'
import path from 'path'
import { name } from '../../package.json'
import { compileVirtual } from './compileVirtual'
import { getSources } from './getSources'
import { injectThemes } from './injectThemes'
import { Platform, UniwindConfig } from './types'

let worker: typeof import('metro-transform-worker')

try {
    worker = require('@expo/metro-config/build/transform-worker/transform-worker.js')
} catch {
    worker = require('metro-transform-worker')
}

export const transform = async (
    config: JsTransformerConfig & {
        uniwind: UniwindConfig
    },
    projectRoot: string,
    filePath: string,
    data: Buffer,
    options: JsTransformOptions,
) => {
    const isCss = options.type !== 'asset' && filePath.endsWith('.css')

    if (filePath.endsWith('/components/web/metro-injected.js')) {
        const cssPath = path.join(process.cwd(), config.uniwind.cssEntryFile)
        const injectedThemesCode = injectThemes({
            input: cssPath,
            themes: config.uniwind.themes,
            dtsPath: config.uniwind.dtsFile,
        })

        data = Buffer.from(injectedThemesCode)
    }

    if (!isCss) {
        return worker.transform(config, projectRoot, filePath, data, options)
    }

    const cssPath = path.join(process.cwd(), config.uniwind.cssEntryFile)
    const injectedThemesCode = injectThemes({
        input: cssPath,
        themes: config.uniwind.themes,
        dtsPath: config.uniwind.dtsFile,
    })
    const css = fs.readFileSync(filePath, 'utf-8')
    const sources = getSources(css, path.dirname(cssPath))
    const platform = options.platform as Platform
    const candidates = new Scanner({ sources }).scan()
    const virtualCode = await compileVirtual({
        css,
        platform,
        themes: config.uniwind.themes,
        polyfills: config.uniwind.polyfills,
        candidates,
        cssPath,
    })
    const isWeb = platform === Platform.Web

    data = Buffer.from(
        isWeb
            ? virtualCode
            : [
                `import { Uniwind } from '${name}';`,
                `Uniwind.__reinit(rt => ${virtualCode});`,
                injectedThemesCode,
            ].join(''),
        'utf-8',
    )

    const transform: any = await worker.transform(
        config,
        projectRoot,
        `${filePath}${isWeb ? '' : '.js'}`,
        data,
        options,
    )

    transform.output[0].data.css ??= {}
    transform.output[0].data.css.skipCache = true

    if (!isWeb) {
        transform.output[0].data.css.code = ''
    }

    return transform
}
