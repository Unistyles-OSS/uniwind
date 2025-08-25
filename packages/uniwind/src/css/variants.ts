const variants = ['ios', 'android', 'web', 'native']

export const generateCSSForVariants = () => {
    let css = ''

    variants.forEach(variant => {
        css += `@custom-variant ${variant} (${variant === 'web' ? 'html' : variant} &);\n`
    })

    return css
}
