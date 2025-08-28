type Stylesheet = Record<string, any>

export const serializeStylesheet = (stylesheet: Stylesheet) => {
    const hotReloadFN = 'globalThis.__uniwind__hot_reload?.()'
    const currentColor = `get currentColor() { return rt.colorScheme === 'dark' ? '#ffffff' : '#000000' },`

    const serializedStylesheet = Object.entries(stylesheet).map(([key, value]) => {
        const stringifiedValue = JSON.stringify(value).replace(/"(?:[^"\\]|\\.)*"/g, match => {
            if (match.includes('this') || match.includes('rt')) {
                // Not a string, remove " " to make it a valid JS expression
                return match.slice(1, -1)
            }

            return match
        })

        if (stringifiedValue.includes('this')) {
            return `get "${key}"() { return ${stringifiedValue} }`
        }

        return `"${key}": ${stringifiedValue}`
    }).join(',')

    return `globalThis.__uniwind__computeStylesheet = rt => ({ ${currentColor} ${serializedStylesheet} });${hotReloadFN}`
}
