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

type UseUniwindAccent = {
    (className: string): string
    (className: string | undefined): string | undefined
}

export const useUniwindAccent: UseUniwindAccent = className => {
    const [accentColor, setAccentColor] = useState(() => className !== undefined ? getAccentColor(className) : undefined)

    useEffect(() => {
        if (className === undefined) {
            return
        }

        const dispose = CSSListener.addListener(className.split(' '), () => setAccentColor(getAccentColor(className)))

        return dispose
    }, [className])

    return accentColor as string
}
