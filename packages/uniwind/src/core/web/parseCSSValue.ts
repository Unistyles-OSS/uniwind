import { parse } from 'culori'
import { formatColor } from './formatColor'

export const parseCSSValue = (value: string) => {
    if (isNaN(Number(value)) && parse(value) !== undefined) {
        return formatColor(value)
    }

    return value
}
