import { useEffect, useState } from 'react'
import { ThemeName, Uniwind } from '../core'
import { UniwindListener } from '../core/listener'
import { StyleDependency } from '../types'

export const useUniwind = () => {
    const [theme, setTheme] = useState(Uniwind.currentTheme)
    const [hasAdaptiveThemes, setHasAdaptiveThemes] = useState(Uniwind.hasAdaptiveThemes)

    useEffect(() => {
        const dispose = UniwindListener.subscribe(() => {
            setTheme(Uniwind.currentTheme)
            setHasAdaptiveThemes(Uniwind.hasAdaptiveThemes)
        }, [StyleDependency.Theme, StyleDependency.AdaptiveThemes])

        return () => {
            dispose()
        }
    }, [])

    return {
        theme: theme as ThemeName,
        hasAdaptiveThemes,
    }
}
