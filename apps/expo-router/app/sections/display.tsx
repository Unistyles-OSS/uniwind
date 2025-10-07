import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { View } from 'react-native'

export default function DisplayScreen() {
    return (
        <SectionScreen>
            <ListSection
                title="isolate + absolute"
                containerClassName="p-2 items-center"
            >
                <View className="bg-blue-500 rounded-lg isolate w-full p-10 flex-col items-center justify-center overflow-hidden">
                    <ThemedText className="text-blue-100 font-semibold">
                        Block Area 1
                    </ThemedText>
                    <View className="absolute top-0 left-0">
                        <ThemedText className="text-blue-300 border border-blue-300 font-semibold">
                            Absolute Element 1
                        </ThemedText>
                    </View>
                    <View className="isolate bg-pink-500 p-14 rounded-lg m-4">
                        <ThemedText className="text-pink-100 font-semibold">
                            Block Area 2
                        </ThemedText>
                        <View className="absolute bottom-0 right-0">
                            <ThemedText className="text-pink-300 border border-pink-300 font-semibold">
                                Absolute Element 2
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </ListSection>

            <ListSection title="hidden" containerClassName="p-2 py-5 items-center">
                <View className="hidden">
                    <ThemedText variant="caption1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    </ThemedText>
                </View>
            </ListSection>

            {/* NativeWind maps to opacity on native */}
            <ListSection title="invisible" containerClassName="p-2 py-5 items-center">
                <View className="invisible">
                    <ThemedText variant="caption1" className="invisible">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    </ThemedText>
                </View>
            </ListSection>

            <ListSection
                title="overflow-visible"
                containerClassName="p-2 py-5 items-center"
            >
                <View className="overflow-visible mx-4 border border-border p-2">
                    <ThemedText variant="caption1" className="-mx-5 border border-border">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    </ThemedText>
                </View>
            </ListSection>
            <ListSection
                title="overflow-hidden"
                containerClassName="p-2 py-5 items-center"
            >
                <View className="overflow-hidden mx-4 border border-border p-2">
                    <ThemedText variant="caption1" className="-mx-5 border border-border">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    </ThemedText>
                </View>
            </ListSection>

            <ListSection title="inset" containerClassName="p-2 py-5 items-center">
                <View className="mx-4 border border-border flex-1 w-full min-h-20">
                    <ThemedText
                        variant="caption1"
                        className="inset-x-2 inset-y-1 absolute border border-border"
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    </ThemedText>
                </View>
            </ListSection>

            <ListSection title="z-index" containerClassName="p-2 py-5 items-center">
                <View className="mx-4 border border-border flex-1 w-full min-h-20">
                    <View className="z-20 size-5 bg-blue-500 absolute"></View>
                    <View className="z-10 size-5 bg-red-500 absolute top-2 left-2"></View>
                    <View className="z-30 size-5 bg-green-500 absolute top-1 left-1"></View>
                </View>
            </ListSection>
        </SectionScreen>
    )
}
