import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function SelfAlignmentScreen() {
    const ItemBox = ({
        children,
        selfAlign,
        isHighlighted = false,
    }: {
        children: React.ReactNode
        selfAlign?: string
        isHighlighted?: boolean
    }) => (
        <View
            className={cn(
                'h-8 px-3 rounded-md items-center justify-center min-w-16',
                isHighlighted ? 'bg-red-500' : 'bg-blue-500',
                selfAlign,
            )}
        >
            <ThemedText className={cn('text-white text-xs font-bold')}>
                {children}
            </ThemedText>
        </View>
    )

    return (
        <SectionScreen>
            <ListSection title="self-auto" containerClassName="p-2 items-center">
                <View className="h-32 w-full flex-row items-start gap-2">
                    <ItemBox>1</ItemBox>
                    <ItemBox selfAlign="self-auto" isHighlighted>
                        2
                    </ItemBox>
                    <ItemBox>3</ItemBox>
                    <ItemBox>4</ItemBox>
                </View>
            </ListSection>

            <ListSection title="self-start" containerClassName="p-2 items-center">
                <View className="h-32 w-full flex-row items-center gap-2">
                    <ItemBox>1</ItemBox>
                    <ItemBox selfAlign="self-start" isHighlighted>
                        2
                    </ItemBox>
                    <ItemBox>3</ItemBox>
                    <ItemBox>4</ItemBox>
                </View>
            </ListSection>

            <ListSection title="self-end" containerClassName="p-2 items-center">
                <View className="h-32 w-full flex-row items-start gap-2">
                    <ItemBox>1</ItemBox>
                    <ItemBox selfAlign="self-end" isHighlighted>
                        2
                    </ItemBox>
                    <ItemBox>3</ItemBox>
                    <ItemBox>4</ItemBox>
                </View>
            </ListSection>

            <ListSection title="self-center" containerClassName="p-2 items-center">
                <View className="h-32 w-full flex-row items-start gap-2">
                    <ItemBox>1</ItemBox>
                    <ItemBox selfAlign="self-center" isHighlighted>
                        2
                    </ItemBox>
                    <ItemBox>3</ItemBox>
                    <ItemBox>4</ItemBox>
                </View>
            </ListSection>

            <ListSection title="self-stretch" containerClassName="p-2 items-center">
                <View className="h-32 w-full flex-row items-start gap-2">
                    <ItemBox>1</ItemBox>
                    <View className="px-3 bg-red-500 rounded-md items-center justify-center min-w-16 self-stretch">
                        <ThemedText className="text-white text-xs font-bold">2</ThemedText>
                    </View>
                    <ItemBox>3</ItemBox>
                    <ItemBox>4</ItemBox>
                </View>
            </ListSection>
        </SectionScreen>
    )
}
