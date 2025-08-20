import type Bundler from 'metro/private/Bundler'
import { ColorScheme, Orientation, WritingDirection } from '../types'

type HasteEventMetadata = {
    modifiedTime: number
    size: number
    type: 'virtual'
}

type HasteEvent = {
    filePath: string
    metadata: HasteEventMetadata
    type: 'change'
}

type HasteEventData = {
    eventsQueue: Array<HasteEvent>
}

export type Haste = {
    emit: (event: string, data: HasteEventData) => void
}

type WithUniwindPatch<T> = T & {
    __uniwind_patched?: boolean
}

export type ExtendedBundler = Bundler & {
    transformFile: WithUniwindPatch<Bundler['transformFile']>
}

export type ExtendedFileSystem = {
    getSha1: WithUniwindPatch<(filename: string) => string>
}

export type DeepMutable<T> = {
    -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P]
}

export type UniwindConfig = {
    input?: string
}

export type StyleTemplateAcc = {
    entries: Array<[string, unknown]>
    maxWidth: string | number
    minWidth: string | number
    orientation: Orientation | null
    colorScheme: ColorScheme | null
    dir: WritingDirection | null
}
