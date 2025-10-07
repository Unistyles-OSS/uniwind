import { ListSection } from '@/components/list'
import { DemoBox, SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function OutlineScreen() {
    const OutlineBox = ({
        children,
        className,
    }: {
        children: React.ReactNode
        className?: string
    }) => (
        <DemoBox className={cn('p-4 min-h-16 min-w-20', className)}>
            {children}
        </DemoBox>
    )

    return (
        <SectionScreen>
            {/* Outline Width */}
            <ListSection title="outline-0" containerClassName="p-2 items-center">
                <OutlineBox className="outline-0 outline-red-500">
                    No Outline
                </OutlineBox>
            </ListSection>

            <ListSection title="outline-1" containerClassName="p-2 items-center">
                <OutlineBox className="outline-1 outline-red-500">
                    1px Outline
                </OutlineBox>
            </ListSection>

            <ListSection title="outline-[5px]" containerClassName="p-2 items-center">
                <OutlineBox className="outline-[5px] outline-red-500">
                    5px Outline
                </OutlineBox>
            </ListSection>

            <ListSection title="outline-2" containerClassName="p-2 items-center">
                <OutlineBox className="outline-2 outline-red-500">
                    2px Outline
                </OutlineBox>
            </ListSection>

            <ListSection title="outline-4" containerClassName="p-2 items-center">
                <OutlineBox className="outline-4 outline-red-500">
                    4px Outline
                </OutlineBox>
            </ListSection>

            <ListSection title="outline-8" containerClassName="p-2 items-center">
                <OutlineBox className="outline-8 outline-red-500">
                    8px Outline
                </OutlineBox>
            </ListSection>

            {/* Outline Colors */}
            <ListSection
                title="outline-red-500"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-red-500">
                    Red Outline
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-green-500"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-green-500">
                    Green Outline
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-blue-500"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-blue-500">
                    Blue Outline
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-purple-500"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-purple-500">
                    Purple Outline
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-yellow-500"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-yellow-500">
                    Yellow Outline
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-pink-500"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-pink-500">
                    Pink Outline
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-red-300"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-red-300">
                    Light red Outline
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-red-700"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-red-700">
                    Dark red Outline
                </OutlineBox>
            </ListSection>

            <ListSection title="outline-black" containerClassName="p-2 items-center">
                <OutlineBox className="outline-2 outline-black">
                    Black Outline
                </OutlineBox>
            </ListSection>

            <ListSection title="outline-white" containerClassName="p-2 items-center">
                <View className="bg-red-800 p-2 rounded">
                    <OutlineBox className="outline-2 outline-white bg-red-600">
                        <ThemedText className="text-white text-xs font-bold text-center">
                            White Outline
                        </ThemedText>
                    </OutlineBox>
                </View>
            </ListSection>

            {/* Outline Style */}
            <ListSection title="outline-solid" containerClassName="p-2 items-center">
                <OutlineBox className="outline-4 outline-solid outline-red-600">
                    Solid Outline
                </OutlineBox>
            </ListSection>

            <ListSection title="outline-dashed" containerClassName="p-2 items-center">
                <OutlineBox className="outline-4 outline-dashed outline-red-600">
                    Dashed Outline
                </OutlineBox>
            </ListSection>

            <ListSection title="outline-dotted" containerClassName="p-2 items-center">
                <OutlineBox className="outline-4 outline-dotted outline-red-600">
                    Dotted Outline
                </OutlineBox>
            </ListSection>

            {/* Outline Offset */}
            <ListSection
                title="outline-offset-0"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-blue-500 outline-offset-0">
                    No Offset
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-offset-1"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-blue-500 outline-offset-1">
                    1px Offset
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-offset-[5px]"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-blue-500 outline-offset-[5px]">
                    5px Offset
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-offset-2"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-blue-500 outline-offset-2">
                    2px Offset
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-offset-4"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-blue-500 outline-offset-4">
                    4px Offset
                </OutlineBox>
            </ListSection>

            <ListSection
                title="outline-offset-8"
                containerClassName="p-2 items-center"
            >
                <OutlineBox className="outline-2 outline-blue-500 outline-offset-8">
                    8px Offset
                </OutlineBox>
            </ListSection>
        </SectionScreen>
    )
}
