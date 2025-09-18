export const classToStyle = (className: string) =>
    className === 'className'
        ? 'style'
        : className.replace('ClassName', 'Style')

export const classToColor = (className: string) => className.replace('ClassName', '')

export const isColorClassProperty = (prop: string) => prop === 'colorClassName' || prop.endsWith('ColorClassName')
export const isClassProperty = (prop: string) => prop === 'className' || prop.endsWith('ClassName')
export const isStyleProperty = (prop: string) => prop === 'style' || prop.endsWith('Style')
