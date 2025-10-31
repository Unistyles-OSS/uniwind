import { StyleDependency } from '../../types'
import { UniwindStore } from '../native'
import { UniwindRuntime } from '../native/runtime'

export const themeVariables = (theme: string, vars: Record<string, string>) => {
    UniwindStore.setThemeVariables(theme, vars)
    if (UniwindRuntime.currentThemeName === theme) {
        UniwindStore.reinit()
        UniwindStore.notifyListeners([StyleDependency.Theme])
    }
}
