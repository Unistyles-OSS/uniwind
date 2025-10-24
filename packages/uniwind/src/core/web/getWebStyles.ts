import { RNStyle } from '../types'
import { parseCSSValue } from './parseCSSValue'

const dummy = typeof document !== 'undefined'
    ? Object.assign(document.createElement('div'), {
        style: 'display: none',
    })
    : null

if (dummy) {
    document.body.appendChild(dummy)
}

const getComputedStyles = () => {
    if (!dummy) {
        return {} as CSSStyleDeclaration
    }

    const computedStyles = window.getComputedStyle(dummy)
    const styles = {} as CSSStyleDeclaration

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < computedStyles.length; i++) {
        // Typescript is unable to infer it properly
        const prop = computedStyles[i] as any

        styles[prop] = computedStyles.getPropertyValue(prop)
    }

    return styles
}

const initialStyles = typeof document !== 'undefined'
    ? getComputedStyles()
    : {} as CSSStyleDeclaration

const getObjectDifference = <T extends object>(obj1: T, obj2: T): T => {
    const diff = {} as T
    const keys = Object.keys(obj2) as Array<keyof T>

    keys.forEach(key => {
        if (obj2[key] !== obj1[key]) {
            diff[key] = obj2[key]
        }
    })

    return diff
}

export const getWebStyles = (className?: string): RNStyle => {
    if (className === undefined) {
        return {}
    }

    if (!dummy) {
        return {}
    }

    dummy.className = className

    const computedStyles = getObjectDifference(initialStyles, getComputedStyles())

    return Object.fromEntries(
        Object.entries(computedStyles).map(([key, value]) => {
            return [
                key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
                parseCSSValue(value),
            ]
        }),
    )
}
