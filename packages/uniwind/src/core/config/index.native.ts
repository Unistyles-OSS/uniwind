import { UniwindStore } from '../native'
import { GenerateStyleSheetsCallback } from '../types'
import { Uniwind } from './config'

Object.defineProperty(Uniwind, '__reinit', {
    configurable: false,
    enumerable: false,
    value: (generateStyleSheetCallback: GenerateStyleSheetsCallback) => {
        UniwindStore.reinit(generateStyleSheetCallback)
    },
})

export * from './config'
