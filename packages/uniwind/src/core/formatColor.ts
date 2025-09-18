import { formatHex, formatHex8, parse } from 'culori'

export const formatColor = (color: string) => {
    const parsedColor = parse(color)

    if (!parsedColor) {
        return color
    }

    return parsedColor.alpha !== undefined && parsedColor.alpha !== 1
        ? formatHex8(parsedColor)
        : formatHex(parsedColor)
}
