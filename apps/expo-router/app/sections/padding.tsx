import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function PaddingScreen() {
    const PaddingBox = ({
        children,
        className,
    }: {
        children?: React.ReactNode
        className?: string
    }) => (
        <View className={cn('bg-blue-500 rounded-xl w-full', className)}>
            <View className="bg-yellow-300 rounded-lg items-center justify-center min-h-8">
                <ThemedText className="text-gray-800 text-xs font-bold">
                    {children}
                </ThemedText>
            </View>
        </View>
    )

    return (
        <SectionScreen>
            {/* All sides padding */}
            <ListSection title="p-0" containerClassName="p-0 items-center">
                <PaddingBox className="p-0">No Padding</PaddingBox>
            </ListSection>

            <ListSection title="p-2" containerClassName="p-0 items-center">
                <PaddingBox className="p-2">Padding 2</PaddingBox>
            </ListSection>

            <ListSection title="p-4" containerClassName="p-0 items-center">
                <PaddingBox className="p-4">Padding 4</PaddingBox>
            </ListSection>

            <ListSection title="p-8" containerClassName="p-0 items-center">
                <PaddingBox className="p-8">Padding 8</PaddingBox>
            </ListSection>

            <ListSection title="p-[20px]" containerClassName="p-0 items-center">
                <PaddingBox className="p-[20px]">Custom Padding</PaddingBox>
            </ListSection>

            <ListSection title="-p-[20px]" containerClassName="p-0 items-center">
                <PaddingBox className="-p-[20px]">Negative Custom Padding</PaddingBox>
            </ListSection>

            {/* Horizontal and Vertical */}
            <ListSection title="px-4" containerClassName="p-0 items-center">
                <PaddingBox className="px-4">Horizontal Padding</PaddingBox>
            </ListSection>

            <ListSection title="py-4" containerClassName="p-0 items-center">
                <PaddingBox className="py-4">Vertical Padding</PaddingBox>
            </ListSection>

            <ListSection title="px-8 py-2" containerClassName="p-0 items-center">
                <PaddingBox className="px-8 py-2">Different H/V Padding</PaddingBox>
            </ListSection>

            {/* Individual sides */}
            <ListSection title="pt-6" containerClassName="p-0 items-center">
                <PaddingBox className="pt-6">Top Padding</PaddingBox>
            </ListSection>

            <ListSection title="pr-6" containerClassName="p-0 items-center">
                <PaddingBox className="pr-6">Right Padding</PaddingBox>
            </ListSection>

            <ListSection title="pb-6" containerClassName="p-0 items-center">
                <PaddingBox className="pb-6">Bottom Padding</PaddingBox>
            </ListSection>

            <ListSection title="pl-6" containerClassName="p-0 items-center">
                <PaddingBox className="pl-6">Left Padding</PaddingBox>
            </ListSection>
        </SectionScreen>
    )
}
