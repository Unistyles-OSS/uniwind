const root = typeof document !== 'undefined' ? document.querySelector(':root') : null

export const themeChange = (theme: string, themes: ReadonlyArray<string>) => {
    if (root) {
        themes.forEach(theme => root.classList.remove(theme))
        root.classList.add(theme)
    }
}
