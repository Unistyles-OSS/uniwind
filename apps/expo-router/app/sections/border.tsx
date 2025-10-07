import { ListSection } from '@/components/list'
import { DemoBox, SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function BorderScreen() {
    const BorderBox = ({
        children,
        className,
    }: {
        children: React.ReactNode
        className?: string
    }) => (
        <DemoBox className={cn('p-4 min-h-16 min-w-20 rounded-none', className)}>
            {children}
        </DemoBox>
    )

    return (
        <SectionScreen>
            {/* Border Width */}
            <ListSection title="border-0" containerClassName="p-2 items-center">
                <BorderBox className="border-0 border-red-500">No Border</BorderBox>
            </ListSection>

            <ListSection title="border" containerClassName="p-2 items-center">
                <BorderBox className="border border-red-500">
                    Default Border (1px)
                </BorderBox>
            </ListSection>

            <ListSection title="border-2" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500">2px Border</BorderBox>
            </ListSection>

            <ListSection title="border-[7px]" containerClassName="p-2 items-center">
                <BorderBox className="border-[7px] border-red-500">
                    7px Border
                </BorderBox>
            </ListSection>

            <ListSection title="border-4" containerClassName="p-2 items-center">
                <BorderBox className="border-4 border-red-500">4px Border</BorderBox>
            </ListSection>

            <ListSection title="border-8" containerClassName="p-2 items-center">
                <BorderBox className="border-8 border-red-500">8px Border</BorderBox>
            </ListSection>

            {/* Individual Sides */}
            <ListSection title="border-t-4" containerClassName="p-2 items-center">
                <BorderBox className="border-t-4 border-red-500">Top Border</BorderBox>
            </ListSection>

            <ListSection title="border-r-4" containerClassName="p-2 items-center">
                <BorderBox className="border-r-4 border-red-500">
                    Right Border
                </BorderBox>
            </ListSection>

            <ListSection title="border-b-4" containerClassName="p-2 items-center">
                <BorderBox className="border-b-4 border-red-500">
                    Bottom Border
                </BorderBox>
            </ListSection>

            <ListSection title="border-l-4" containerClassName="p-2 items-center">
                <BorderBox className="border-l-4 border-red-500">Left Border</BorderBox>
            </ListSection>

            {/* Horizontal and Vertical */}
            <ListSection title="border-x-4" containerClassName="p-2 items-center">
                <BorderBox className="border-x-4 border-orange-500">
                    Horizontal Borders
                </BorderBox>
            </ListSection>

            <ListSection title="border-y-4" containerClassName="p-2 items-center">
                <BorderBox className="border-y-4 border-pink-500">
                    Vertical Borders
                </BorderBox>
            </ListSection>

            {/* Border Colors */}
            <ListSection title="border-red-500" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500">Red Border</BorderBox>
            </ListSection>

            <ListSection
                title="border-green-500"
                containerClassName="p-2 items-center"
            >
                <BorderBox className="border-2 border-green-600">
                    Green Border
                </BorderBox>
            </ListSection>

            <ListSection
                title="border-blue-500"
                containerClassName="p-2 items-center"
            >
                <BorderBox className="border-2 border-blue-700 dark:border-blue-300">
                    Blue Border
                </BorderBox>
            </ListSection>

            <ListSection title="border-red-300" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-300">
                    Light red Border
                </BorderBox>
            </ListSection>

            <ListSection title="border-red-700" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-700">
                    Dark red Border
                </BorderBox>
            </ListSection>

            <ListSection title="border-black" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-black">Black Border</BorderBox>
            </ListSection>

            {/* Border Style */}
            <ListSection title="border-solid" containerClassName="p-2 items-center">
                <BorderBox className="border-4 border-solid border-red-600">
                    Solid Border
                </BorderBox>
            </ListSection>

            <ListSection title="border-dashed" containerClassName="p-2 items-center">
                <BorderBox className="border-4 border-dashed border-red-600">
                    Dashed Border
                </BorderBox>
            </ListSection>

            <ListSection title="border-dotted" containerClassName="p-2 items-center">
                <BorderBox className="border-4 border-dotted border-red-600">
                    Dotted Border
                </BorderBox>
            </ListSection>

            {/* Border Radius */}
            <ListSection title="rounded-none" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-none">
                    No Rounded Corners
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-sm" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-sm">
                    Small Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded">
                    Default Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-[7px]" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-[7px]">
                    Rounded 7px
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-md" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-md">
                    Medium Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-lg" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-lg">
                    Large Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-xl" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-xl">
                    Extra Large Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-2xl" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-2xl">
                    2XL Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-3xl" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-3xl">
                    3XL Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-full" containerClassName="p-2 items-center">
                <View className="border-2 border-red-500 rounded-full bg-blue-100 w-16 h-16 items-center justify-center">
                    <ThemedText className="text-blue-800 text-xs font-bold text-center">
                        Full Round
                    </ThemedText>
                </View>
            </ListSection>

            {/* Individual Corner Radius */}
            <ListSection title="rounded-tl-lg" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-tl-lg">
                    Top Left Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-tr-lg" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-tr-lg">
                    Top Right Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-bl-lg" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-bl-lg">
                    Bottom Left Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-br-lg" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-br-lg">
                    Bottom Right Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-t-lg" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-t-lg">
                    Top Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-b-lg" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-b-lg">
                    Bottom Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-l-lg" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-l-lg">
                    Left Rounded
                </BorderBox>
            </ListSection>

            <ListSection title="rounded-r-lg" containerClassName="p-2 items-center">
                <BorderBox className="border-2 border-red-500 rounded-r-lg">
                    Right Rounded
                </BorderBox>
            </ListSection>

            {/* Combined Examples */}
            <ListSection
                title="Complex border combinations"
                containerClassName="p-2 items-center"
            >
                <View className="flex-row flex-wrap gap-4">
                    <BorderBox className="border-t-4 border-r-2 border-b-4 border-l-2 border-red-500 rounded-lg">
                        Mixed Widths
                    </BorderBox>
                    <BorderBox className="border-4 border-dashed border-green-500 rounded-full w-22 h-22">
                        Dashed Circle
                    </BorderBox>
                </View>
            </ListSection>
        </SectionScreen>
    )
}
