import { TurboModule, TurboModuleRegistry } from 'react-native'

// this is empty spec for TurboModule that is required to hook Uniwind to Fabric
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Spec extends TurboModule {}

TurboModuleRegistry.get<Spec>('Uniwind')
