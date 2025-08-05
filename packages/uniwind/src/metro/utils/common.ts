export const toSafeString = (value: string) => `\`${value}\``

export const isDefined = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined

export const escapeDynamic = (str: string) =>
    str.replace(/"(vars|\()([^"]+)"/g, (match, type) => {
        switch (type) {
            case 'vars':
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
}

// eslint-disable-next-line functional/functional-parameters
export const pipe = <T>(data: T) => ((...fns: Array<any>) => fns.reduce((acc, fn) => fn(acc), data)) as PipeFns<T>
