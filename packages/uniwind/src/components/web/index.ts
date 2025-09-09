import './rnw'

export * from './ActivityIndicator'
export * from './Button'
export * from './FlatList'
export * from './Image'
export * from './ImageBackground'
export * from './KeyboardAvoidingView'
export * from './Modal'
export * from './Pressable'
export * from './RefreshControl'
export * from './SafeAreaView'
export * from './ScrollView'
export * from './SectionList'
export * from './Switch'
export * from './Text'
export * from './TextInput'
export * from './TouchableHighlight'
export * from './TouchableOpacity'
export * from './TouchableWithoutFeedback'
export * from './View'
export * from './VirtualizedList'

import { Animated as RNAnimated } from 'react-native'
import { FlatList } from './FlatList'
import { Image } from './Image'
import { ScrollView } from './ScrollView'
import { SectionList } from './SectionList'
import { Text } from './Text'
import { View } from './View'

export const Animated = {
    ...RNAnimated,
    View: RNAnimated.createAnimatedComponent(View),
    Text: RNAnimated.createAnimatedComponent(Text),
    FlatList: RNAnimated.createAnimatedComponent(FlatList),
    Image: RNAnimated.createAnimatedComponent(Image),
    ScrollView: RNAnimated.createAnimatedComponent(ScrollView),
    SectionList: RNAnimated.createAnimatedComponent(SectionList),
}
