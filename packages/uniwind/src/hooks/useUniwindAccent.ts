import { formatRgb, parse } from 'culori'
import { useEffect, useState } from 'react'
import { CSSListener } from '../core/cssListener'

const dummy = typeof document !== 'undefined'
    ? Object.assign(document.createElement('div'), {
        style: 'display: none',
    })
    : null

if (dummy) {
    document.body.appendChild(dummy)
}

const getAccentColor = (className: string) => {
    if (!dummy) {
        return ''
    }

    dummy.className = className

    const accentColor = window.getComputedStyle(dummy).accentColor
    const parsed = parse(accentColor)

    if (!parsed) {
        return accentColor
    }

    return formatRgb(parsed)
}

export const useUniwindAccent = (className: string) => {
    const [accentColor, setAccentColor] = useState(() => getAccentColor(className))

    useEffect(() => {
        const dispose = CSSListener.addListener(className.split(' '), () => setAccentColor(getAccentColor(className)))

        return dispose
    }, [className])

    return accentColor
}
