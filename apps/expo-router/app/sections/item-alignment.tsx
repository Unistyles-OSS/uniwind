import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function ItemAlignmentScreen() {
    const ItemBox = ({
        children,
        height = 'h-8',
    }: {
        children: React.ReactNode
        height?: string
    }) => (
        <View
            className={cn(
                'px-3 bg-blue-500 rounded-md items-center justify-center min-w-16',
                height,
            )}
        >
            <ThemedText className="text-white text-xs font-bold">
                {children}
            </ThemedText>
        </View>
    )

    return (
        <SectionScreen>
            <ListSection title="items-start" containerClassName="p-2 items-center">
                <View className="h-32 w-full flex-wrap rounded-lg flex-row items-start gap-2">
                    <ItemBox height="h-6">1</ItemBox>
                    <ItemBox height="h-10">2</ItemBox>
                    <ItemBox height="h-8">3</ItemBox>
                    <ItemBox height="h-12">4</ItemBox>
                </View>
            </ListSection>

            <ListSection title="items-end" containerClassName="p-2 items-center">
                <View className="h-32 w-full rounded-lg flex-row items-end gap-2">
                    <ItemBox height="h-6">1</ItemBox>
                    <ItemBox height="h-10">2</ItemBox>
                    <ItemBox height="h-8">3</ItemBox>
                    <ItemBox height="h-12">4</ItemBox>
                </View>
            </ListSection>

            <ListSection title="items-center" containerClassName="p-2 items-center">
                <View className="h-32 w-full rounded-lg flex-row items-center gap-2">
                    <ItemBox height="h-6">1</ItemBox>
                    <ItemBox height="h-10">2</ItemBox>
                    <ItemBox height="h-8">3</ItemBox>
                    <ItemBox height="h-12">4</ItemBox>
                </View>
            </ListSection>

            <ListSection title="items-stretch" containerClassName="p-2 items-center">
                <View className="h-32 w-full rounded-lg flex-row items-stretch gap-2">
                    <View className="px-3 bg-blue-500 rounded-md items-center justify-center min-w-16">
                        <ThemedText className="text-white text-xs font-bold">1</ThemedText>
                    </View>
                    <View className="px-3 bg-blue-500 rounded-md items-center justify-center min-w-16">
                        <ThemedText className="text-white text-xs font-bold">2</ThemedText>
                    </View>
                    <View className="px-3 bg-blue-500 rounded-md items-center justify-center min-w-16">
                        <ThemedText className="text-white text-xs font-bold">3</ThemedText>
                    </View>
                    <View className="px-3 bg-blue-500 rounded-md items-center justify-center min-w-16">
                        <ThemedText className="text-white text-xs font-bold">4</ThemedText>
                    </View>
                </View>
            </ListSection>
        </SectionScreen>
    )
}
