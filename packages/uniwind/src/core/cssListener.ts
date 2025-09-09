class CSSListenerBuilder {
    private classNameMediaQueryListeners = new Map<string, MediaQueryList>()
    private listeners = new Map<MediaQueryList, Set<VoidFunction>>()
    private registeredRules = new Map<string, MediaQueryList>()

    constructor() {
        if (typeof document === 'undefined') {
            return
        }

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    this.initialize()
                }
            }
        })

        this.initialize()
        observer.observe(document.head, {
            childList: true,
            subtree: false,
            attributes: true,
            attributeFilter: ['disabled', 'media', 'title', 'href', 'rel'],
        })
    }

    addListener(classNames: Array<string>, listener: VoidFunction) {
        const disposables = [] as Array<VoidFunction>

        classNames.forEach((className) => {
            const mediaQuery = this.classNameMediaQueryListeners.get(className)

            if (!mediaQuery) {
                // eslint-disable-next-line no-empty-function
                return () => {}
            }

            const listeners = this.listeners.get(mediaQuery)

            listener()
            listeners?.add(listener)
            disposables.push(() => listeners?.delete(listener))
        })

        return () => disposables.forEach(disposable => disposable())
    }

    private initialize() {
        for (const sheet of Array.from(document.styleSheets)) {
            let rules: CSSRuleList

            try {
                // May throw for cross-origin stylesheets
                rules = sheet.cssRules
            } catch {
                continue
            }

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
            if (!rules) {
                continue
            }

            this.addMediaQueriesDeep(rules)
        }
    }

    private isStyleRule(rule: CSSRule): rule is CSSStyleRule {
        return rule.constructor.name === 'CSSStyleRule'
    }

    private isMediaRule(rule: CSSRule): rule is CSSMediaRule {
        return rule.constructor.name === 'CSSMediaRule'
    }

    private collectParentMediaQueries(rule: CSSRule, acc = [] as Array<CSSMediaRule>): Array<CSSMediaRule> {
        const { parentRule } = rule

        if (!parentRule) {
            return []
        }

        if (this.isMediaRule(parentRule)) {
            acc.push(parentRule)
        }

        const result = this.collectParentMediaQueries(parentRule, acc)

        acc.push(...result)

        return Array.from(new Set(acc))
    }

    private addMediaQueriesDeep(rules: CSSRuleList) {
        for (const rule of Array.from(rules)) {
            if (this.isStyleRule(rule)) {
                const mediaQueries = this.collectParentMediaQueries(rule)

                if (mediaQueries.length > 0) {
                    this.addMediaQuery(mediaQueries, rule.selectorText)
                }

                continue
            }

            if ('cssRules' in rule && rule.cssRules instanceof CSSRuleList) {
                this.addMediaQueriesDeep(rule.cssRules)

                continue
            }
        }
    }

    private addMediaQuery(mediaQueries: Array<CSSMediaRule>, className: string) {
        const rules = mediaQueries.map(mediaQuery => mediaQuery.conditionText).sort().join(' and ')
        const parsedClassName = className.replace('.', '').replace('\\', '')
        const cachedMediaQueryList = this.registeredRules.get(rules)

        if (cachedMediaQueryList) {
            this.classNameMediaQueryListeners.set(parsedClassName, cachedMediaQueryList)

            return
        }

        const mediaQueryList = window.matchMedia(rules)

        this.registeredRules.set(rules, mediaQueryList)
        this.listeners.set(mediaQueryList, new Set())
        this.classNameMediaQueryListeners.set(parsedClassName, mediaQueryList)

        mediaQueryList.addEventListener('change', () => {
            this.listeners.get(mediaQueryList)!.forEach(listener => listener())
        })
    }
}

export const CSSListener = new CSSListenerBuilder()
