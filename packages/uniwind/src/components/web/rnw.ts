import { Uniwind } from '../../core'
import { UniwindListener } from '../../core/listener'
import { StyleDependency } from '../../types'
import './metro-injected'

const moveCssRulesToUtilitiesLayer = (sourceSheet: CSSStyleSheet) => {
    const layerRuleIndex = sourceSheet.insertRule(
        '@layer rnw {}',
        0,
    )
    const layerRule = sourceSheet.cssRules[layerRuleIndex] as CSSGroupingRule

    while (sourceSheet.cssRules.length > 1) {
        const nextRule = sourceSheet.cssRules[1]!

        layerRule.insertRule(nextRule.cssText, layerRule.cssRules.length)
        sourceSheet.deleteRule(1)
    }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const rnwStyleSheet = document.querySelector<HTMLStyleElement>('#react-native-stylesheet')

    if (rnwStyleSheet?.sheet) {
        moveCssRulesToUtilitiesLayer(rnwStyleSheet.sheet)
    }
}

type UniwindWithThemes = {
    themes: typeof Uniwind['themes']
}

const addClassNameToRoot = () => {
    if (typeof document === 'undefined') {
        return
    }

    const root = document.documentElement
    ;(Uniwind as unknown as UniwindWithThemes).themes.forEach(theme => root.classList.remove(theme))
    root.classList.add(Uniwind.currentTheme)
}

UniwindListener.subscribe(() => {
    addClassNameToRoot()
}, [StyleDependency.Theme])

addClassNameToRoot()

export const toRNWClassName = (className?: string) =>
    className !== undefined
        ? ({ $$css: true, tailwind: className }) as {}
        : {}
