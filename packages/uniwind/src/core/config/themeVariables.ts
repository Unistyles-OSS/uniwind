import { UniwindRuntime } from '../native'
import { CSSListener } from '../web'

const ruleCache = new Map<string, CSSStyleRule>()

export const themeVariables = (theme: string, vars: Record<string, string>) => {
    const selector = `:root.${theme}`
    let targetRule = ruleCache.get(selector)

    if (!targetRule) {
        for (const sheet of Array.from(document.styleSheets)) {
            try {
                const rules = sheet.cssRules
                if (!rules) continue

                for (const rule of Array.from(rules)) {
                    if (
                        rule instanceof CSSStyleRule
                        && rule.selectorText.replace(/\s+/g, '')
                            === selector.replace(/\s+/g, '')
                    ) {
                        targetRule = rule
                        ruleCache.set(selector, rule)
                        break
                    }
                }
                if (targetRule) break
            } catch (e) {
                continue
            }
        }
    }

    if (targetRule) {
        Object.entries(vars).forEach(([key, value]) => {
            targetRule.style.setProperty(key, value)
        })

        if (UniwindRuntime.currentThemeName === theme) {
            CSSListener.notifyThemeChange()
        }
    } else {
        console.warn(`Theme rule "${selector}" not found in stylesheets`)
    }
}
