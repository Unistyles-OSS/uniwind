const types = ['m', 'p'] as const
const sides = ['', 'x', 'y', 't', 'b', 'l', 'r'] as const
const spacing = '--spacing(--value(integer))'
const length = '--value([length])'

type Side = (typeof sides)[number]

export const generateCSSForInsets = () => {
    let css = `@utility h-screen-safe {
    height: calc(100vh - (env(safe-area-inset-top) + env(safe-area-inset-bottom)));
}\n`

    const getInsetsForSide = (side: Side) => {
        switch (side) {
            case 't':
                return ['top']
            case 'b':
                return ['bottom']
            case 'l':
                return ['left']
            case 'r':
                return ['right']
            case 'x':
                return ['left', 'right']
            case 'y':
                return ['top', 'bottom']
            default:
                return ['top', 'bottom', 'left', 'right']
        }
    }

    types.forEach(type => {
        sides.forEach(side => {
            const styleName = type === 'm' ? 'margin' : 'padding'
            const insets = getInsetsForSide(side)
            const styles = insets.map(inset => `${styleName}-${inset}: env(safe-area-inset-${inset});`)
            const safeStyles = styles.flatMap(style => {
                const styleWithoutSemicolon = style.replace(';', '')

                return [
                    styleWithoutSemicolon.replace(/: (env.*)/, (_, env) => `: max(${env}, ${spacing});`),
                    styleWithoutSemicolon.replace(/: (env.*)/, (_, env) => `: max(${env}, ${length});`),
                ]
            })
            const safeOffsetStyles = styles.flatMap(style => {
                const styleWithoutSemicolon = style.replace(';', '')

                return [
                    styleWithoutSemicolon.replace(/: (env.*)/, (_, env) => `: calc(${env} + ${spacing});`),
                    styleWithoutSemicolon.replace(/: (env.*)/, (_, env) => `: calc(${env} + ${length});`),
                ]
            })

            css += `
                @utility ${type}${side}-safe {
                    ${styles.join('\n    ')}
                }
                
                @utility ${type}${side}-safe-or-* {
                    ${safeStyles.join('\n    ')}
                }
                
                @utility ${type}${side}-safe-offset-* {
                    ${safeOffsetStyles.join('\n    ')}
                }
            `
        })
    })

    // Remove all 8 spaces groups
    // eslint-disable-next-line prefer-template
    return css.replaceAll('        ', '').trim() + '\n'
}
