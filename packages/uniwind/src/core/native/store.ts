/* eslint-disable max-depth */
import { Dimensions, Platform } from 'react-native'
import { Orientation, StyleDependency } from '../../types'
import { Uniwind } from '../config/config'
import { UniwindListener } from '../listener'
import { ComponentState, GenerateStyleSheetsCallback, RNStyle, Style, StyleSheets } from '../types'
import { parseBoxShadow, parseFontVariant, parseTransformsMutation, resolveGradient } from './parsers'
import { UniwindRuntime } from './runtime'

type StylesResult = {
    styles: RNStyle
    dependencies: Array<StyleDependency>
}

class UniwindStoreBuilder {
    initialized = false
    runtime = UniwindRuntime
    vars = {} as Record<string, () => unknown>
    private stylesheet = {} as StyleSheets
    private cache = new Map<string, StylesResult>()
    private generateStyleSheetCallbackResult: ReturnType<GenerateStyleSheetsCallback> | null = null

    getStyles(className?: string, state?: ComponentState): StylesResult {
        if (className === undefined || className === '') {
            return {
                styles: {},
                dependencies: [],
            }
        }

        const cacheKey = `${className}${state?.isDisabled ?? false}${state?.isFocused ?? false}${state?.isPressed ?? false}`

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!
        }

        const result = this.resolveStyles(className, state)

        this.cache.set(cacheKey, result)
        UniwindListener.subscribe(
            () => this.cache.delete(cacheKey),
            result.dependencies,
            { once: true },
        )

        return result
    }

    reinit = (generateStyleSheetCallback?: GenerateStyleSheetsCallback) => {
        const config = generateStyleSheetCallback?.(this.runtime) ?? this.generateStyleSheetCallbackResult

        if (!config) {
            return
        }

        const { scopedVars, stylesheet, vars } = config

        this.generateStyleSheetCallbackResult = config
        this.stylesheet = stylesheet
        this.vars = vars

        const themeVars = scopedVars[`__uniwind-theme-${this.runtime.currentThemeName}`]
        const platformVars = scopedVars[`__uniwind-platform-${Platform.OS}`]

        if (themeVars) {
            Object.assign(this.vars, themeVars)
        }

        if (platformVars) {
            Object.assign(this.vars, platformVars)
        }

        if (__DEV__ && generateStyleSheetCallback) {
            UniwindListener.notifyAll()
        }

        if (!this.initialized) {
            UniwindListener.subscribe(
                () => {
                    UniwindRuntime.currentThemeName = Uniwind.currentTheme
                    UniwindStore.reinit()
                },
                [StyleDependency.Theme],
            )
            this.initialized = true
        }
    }

    private resolveStyles(classNames: string, state?: ComponentState) {
        const result = {} as Record<string, () => any>
        let vars = this.vars
        const dependencies = [] as Array<StyleDependency>
        const bestBreakpoints = new Map<string, Style>()

        for (const className of classNames.split(' ')) {
            if (!(className in this.stylesheet)) {
                continue
            }

            for (const style of this.stylesheet[className] as Array<Style>) {
                dependencies.push(...style.dependencies)

                if (
                    style.minWidth > this.runtime.screen.width
                    || style.maxWidth < this.runtime.screen.width
                    || (style.theme !== null && this.runtime.currentThemeName !== style.theme)
                    || (style.orientation !== null && this.runtime.orientation !== style.orientation)
                    || (style.rtl !== null && this.runtime.rtl !== style.rtl)
                    || (style.active !== null && state?.isPressed !== style.active)
                    || (style.focus !== null && state?.isFocused !== style.focus)
                    || (style.disabled !== null && state?.isDisabled !== style.disabled)
                ) {
                    continue
                }

                for (const [property, valueGetter] of style.entries) {
                    const previousBest = bestBreakpoints.get(property)

                    if (
                        previousBest
                        && (
                            previousBest.minWidth > style.minWidth
                            || previousBest.complexity > style.complexity
                            || previousBest.importantProperties.includes(property)
                        )
                    ) {
                        continue
                    }

                    if (property[0] === '-') {
                        // Clone vars object if we are adding inline variables
                        if (vars === this.vars) {
                            vars = { ...this.vars }
                        }

                        vars[property] = valueGetter
                    } else {
                        result[property] = valueGetter
                    }

                    bestBreakpoints.set(property, style)
                }
            }
        }

        if (result.lineHeight !== undefined && result.fontSize) {
            const originalLineHeight = result.lineHeight.call(vars)

            if (originalLineHeight < 6) {
                const originalFontSize = result.fontSize.call(vars)

                result.lineHeight = () => originalLineHeight * originalFontSize
            }
        }

        if (result.boxShadow !== undefined) {
            const originalBoxShadow = result.boxShadow.call(vars)

            result.boxShadow = () => parseBoxShadow(originalBoxShadow)
        }

        if (result.visibility !== undefined && result.visibility.call(vars) === 'hidden') {
            result.display = () => 'none'
        }

        if (
            result.borderStyle !== undefined && result.borderColor === undefined
        ) {
            result.borderColor = () => '#000000'
        }

        if (
            result.outlineStyle !== undefined && result.outlineColor === undefined
        ) {
            result.outlineColor = () => '#000000'
        }

        if (result.fontVariant !== undefined) {
            const originalFontVariant = result.fontVariant.call(vars)

            result.fontVariant = () => parseFontVariant(originalFontVariant)
        }

        parseTransformsMutation(result, vars)

        if (result.experimental_backgroundImage !== undefined) {
            const originalBackgroundImage = result.experimental_backgroundImage.call(vars)

            result.experimental_backgroundImage = () => resolveGradient(originalBackgroundImage)
        }

        return {
            styles: Object.fromEntries(
                (Object.entries(result)).map(([property, valueGetter]) => {
                    return [property, valueGetter.call(vars)]
                }),
            ) as RNStyle,
            dependencies: Array.from(new Set(dependencies)),
        }
    }
}

export const UniwindStore = new UniwindStoreBuilder()

Dimensions.addEventListener('change', ({ window }) => {
    const newOrientation = window.width > window.height ? Orientation.Landscape : Orientation.Portrait
    const orientationChanged = UniwindStore.runtime.orientation !== newOrientation

    UniwindStore.runtime.screen = {
        width: window.width,
        height: window.height,
    }
    UniwindStore.runtime.orientation = newOrientation
    UniwindListener.notify([
        ...orientationChanged ? [StyleDependency.Orientation] : [],
        StyleDependency.Dimensions,
    ])
})
