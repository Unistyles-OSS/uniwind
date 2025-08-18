export const toSafeString = (value: string) => `\`${value}\``

export const isDefined = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined

export const escapeDynamic = (str: string) =>
    str.replace(/"(this\.vars|\()([^"]+)"/g, (match, type) => {
        if (match.startsWith('"() =>')) {
            return match.slice(1)
        }

        switch (type) {
            case 'this.vars':
            case '(':
                return match.slice(1, -1)
            default:
                return match
        }
    })

type P<I, O> = (data: I) => O
type PipeFns<T> = {
    <A>(a: P<T, A>): A
    <A, B>(a: P<T, A>, b: P<A, B>): B
    <A, B, C>(a: P<T, A>, b: P<A, B>, c: P<B, C>): C
    <A, B, C, D>(a: P<T, A>, b: P<A, B>, c: P<B, C>, d: P<C, D>): D
    <A, B, C, D, E>(a: P<T, A>, b: P<A, B>, c: P<B, C>, d: P<C, D>, e: P<D, E>): E
    <A, B, C, D, E, F>(a: P<T, A>, b: P<A, B>, c: P<B, C>, d: P<C, D>, e: P<D, E>, f: P<E, F>): F
    <A, B, C, D, E, F, G>(a: P<T, A>, b: P<A, B>, c: P<B, C>, d: P<C, D>, e: P<D, E>, f: P<E, F>, g: P<F, G>): G
    <A, B, C, D, E, F, G, H>(a: P<T, A>, b: P<A, B>, c: P<B, C>, d: P<C, D>, e: P<D, E>, f: P<E, F>, g: P<F, G>, h: P<G, H>): H
}

export const pipe = <T>(data: T) => ((...fns: Array<any>) => fns.reduce((acc, fn) => fn(acc), data)) as PipeFns<T>

export const replaceParentheses = (parent: string, replacer: (match: string) => string) => (str: string) => {
    const parentStartIndex = str.indexOf(`${parent}(`)

    if (parentStartIndex === -1) {
        return str
    }

    const startIndex = parentStartIndex + parent.length + 1
    let parenthesesCount = 1

    for (let i = startIndex; i < str.length; i++) {
        const char = str[i]

        if (char === '(') {
            parenthesesCount += 1
        }

        if (char === ')') {
            parenthesesCount -= 1
        }

        if (parenthesesCount === 0) {
            const match = str.slice(startIndex, i)
            const replaced = replacer(match)

            return str.slice(0, parentStartIndex) + replaced + str.slice(i + 1)
        }
    }

    return str
}
