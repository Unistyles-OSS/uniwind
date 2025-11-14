import { useEffect, useState } from 'react'
import { ThemeName, Uniwind } from '../core'

type UniwindWithListener = {
    addListener: typeof Uniwind['addListener']
}

export const useUniwind = () => {
    const [theme, setTheme] = useState(Uniwind.currentTheme)
    const [hasAdaptiveThemes, setHasAdaptiveThemes] = useState(Uniwind.hasAdaptiveThemes)

    useEffect(() => {
        const dispose = (Uniwind as unknown as UniwindWithListener).addListener(change => {
            setTheme(change.currentTheme)
            setHasAdaptiveThemes(change.hasAdaptiveThemes)
        })

        return () => {
            dispose()
        }
    }, [])

    return {
        theme: theme as ThemeName,
        hasAdaptiveThemes,
    }
}
