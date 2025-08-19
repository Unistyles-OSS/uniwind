import RN from 'react-native'
import { createUniwindComponent } from './rn'

export const ActivityIndicator = createUniwindComponent(RN.ActivityIndicator)
export const View = createUniwindComponent(RN.View)
export const Text = createUniwindComponent(RN.Text)
export const Image = createUniwindComponent(RN.Image)
export const ImageBackground = createUniwindComponent(RN.ImageBackground, ['imageStyle'])
export const KeyboardAvoidingView = createUniwindComponent(RN.KeyboardAvoidingView, ['contentContainerStyle'])
export const Pressable = createUniwindComponent(RN.Pressable)
export const ScrollView = createUniwindComponent(RN.ScrollView, ['contentContainerStyle'])
export const FlatList = createUniwindComponent(RN.FlatList, ['columnWrapperStyle'])
export const SectionList = createUniwindComponent(RN.SectionList)
export const Switch = createUniwindComponent(RN.Switch)
export const TextInput = createUniwindComponent(RN.TextInput)
export const RefreshControl = createUniwindComponent(RN.RefreshControl)
export const TouchableHighlight = createUniwindComponent(RN.TouchableHighlight)
export const TouchableOpacity = createUniwindComponent(RN.TouchableOpacity)
export const VirtualizedList = createUniwindComponent(RN.VirtualizedList, ['ListFooterComponentStyle', 'ListHeaderComponentStyle'])
export const Modal = createUniwindComponent(RN.Modal)
export const TouchableWithoutFeedback = createUniwindComponent(RN.TouchableWithoutFeedback)
export const Animated = {
    ...RN.Animated,
    View: RN.Animated.createAnimatedComponent(View),
    Text: RN.Animated.createAnimatedComponent(Text),
    FlatList: RN.Animated.createAnimatedComponent(FlatList),
    Image: RN.Animated.createAnimatedComponent(Image),
    ScrollView: RN.Animated.createAnimatedComponent(ScrollView),
    SectionList: RN.Animated.createAnimatedComponent(SectionList),
}
