import { useEffect, useState } from 'react'
import { CSSListener, parseCSSValue } from '../core/web'

const documentStyles = typeof document !== 'undefined'
    ? window.getComputedStyle(document.documentElement)
    : null

const getVariableValue = (name: string) => {
    if (!documentStyles) {
        return undefined
    }

    const value = documentStyles.getPropertyValue(name).trim()

    if (value === '') {
        return undefined
    }

    return parseCSSValue(value)
}

let warned = false

/**
 * A hook that returns the value of a CSS variable.
 * @param name Name of the CSS variable.
 * @returns Value of the CSS variable. On web it is always a string (1rem, #ff0000, etc.), but on native it can be a string or a number (16px, #ff0000)
 */
export const useCSSVariable = (name: string): string | number | undefined => {
    const [value, setValue] = useState(getVariableValue(name))

    useEffect(() => {
        const updateValue = () => {
            const newValue = getVariableValue(name)

            if (newValue !== value) {
                setValue(newValue)
            }
        }
        const themeListenerDispose = CSSListener.addThemeListener(updateValue)
        const classListenerDispose = CSSListener.addListener(':root', updateValue)

        updateValue()

        return () => {
            themeListenerDispose()
            classListenerDispose()
        }
    }, [name])

    if (value === undefined && __DEV__ && !warned) {
        warned = true
        // eslint-disable-next-line no-console
        console.warn(
            `We couldn't find your variable ${name}. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable`,
        )
    }

    return value
}
