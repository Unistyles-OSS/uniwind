const variants = ['ios', 'android', 'web']

export const generateCSSForVariants = () => {
    let css = ''

    variants.forEach(variant => {
        css += `@custom-variant ${variant} (${variant === 'web' ? '&' : variant});\n`
    })

    return css
}
