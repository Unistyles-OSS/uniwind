import { StyleDependency } from '../../types'
import { UniwindStore } from '../native'
import { UniwindRuntime } from '../native/runtime'

export const themeChange = (theme: string) => {
    UniwindRuntime.currentThemeName = theme
    UniwindStore.reinit()
    UniwindStore.notifyListeners([StyleDependency.Theme])
}
