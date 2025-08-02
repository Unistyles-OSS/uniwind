import './NativeTurboUniwind'
import { NitroModules } from 'react-native-nitro-modules'
import type { UniwindRuntime as UniwindRuntimeSpec } from './UniwindRuntime.nitro'

// public API
export const UniwindRuntime = NitroModules
    .createHybridObject<UniwindRuntimeSpec>('UniwindRuntime')

export * from './types'
