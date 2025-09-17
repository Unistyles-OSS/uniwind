import { formatHex, formatHex8, parse } from 'culori'
import { useResolveClassNames } from './useResolveClassNames'

export const useUniwindAccent = (className: string | undefined) => {
    const styles = useResolveClassNames(className ?? '')
    const color = styles.accentColor !== undefined
        ? parse(styles.accentColor)
        : undefined

    if (!color) {
        return undefined
    }

    return color.alpha !== undefined && color.alpha !== 1
        ? formatHex8(color)
        : formatHex(color)
}
