import { ComponentState } from '../core/types'
import { useResolveClassNames } from './useResolveClassNames.native'

export const useUniwindAccent = (className: string | undefined, state?: ComponentState) => {
    const styles = useResolveClassNames(className ?? '', state)

    return styles.accentColor
}
