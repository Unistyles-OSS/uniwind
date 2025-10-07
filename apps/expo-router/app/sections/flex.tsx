import { ListSection } from '@/components/list'
import { DemoBox, SectionScreen } from '@/components/shared'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function FlexScreen() {
    const FlexBox = ({
        children,
        className,
        color = 'bg-blue-500',
    }: {
        children: React.ReactNode
        className?: string
        color?: string
    }) => (
        <DemoBox color={color} className={cn('p-2 min-w-12', className)}>
            {children}
        </DemoBox>
    )

    return (
        <SectionScreen>
            {/* Flex Direction */}
            <ListSection title="flex-row" containerClassName="p-2 items-center">
                <View className={cn('w-full rounded-lg flex-row gap-2')}>
                    <FlexBox>1</FlexBox>
                    <FlexBox>2</FlexBox>
                    <FlexBox>3</FlexBox>
                    <FlexBox>4</FlexBox>
                </View>
            </ListSection>

            <ListSection
                title="flex-row-reverse"
                containerClassName="p-2 items-center"
            >
                <View className="w-full rounded-lg flex-row-reverse gap-2">
                    <FlexBox>1</FlexBox>
                    <FlexBox>2</FlexBox>
                    <FlexBox>3</FlexBox>
                    <FlexBox>4</FlexBox>
                </View>
            </ListSection>

            <ListSection title="flex-col" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-col gap-2">
                    <FlexBox>1</FlexBox>
                    <FlexBox>2</FlexBox>
                    <FlexBox>3</FlexBox>
                    <FlexBox>4</FlexBox>
                </View>
            </ListSection>

            <ListSection
                title="flex-col-reverse"
                containerClassName="p-2 items-center"
            >
                <View className="w-full rounded-lg flex-col-reverse gap-2">
                    <FlexBox>1</FlexBox>
                    <FlexBox>2</FlexBox>
                    <FlexBox>3</FlexBox>
                    <FlexBox>4</FlexBox>
                </View>
            </ListSection>

            {/* Flex Grow */}
            <ListSection title="flex-1 (grow)" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-2">
                    <FlexBox>1</FlexBox>
                    <FlexBox className="flex-1" color="bg-red-500">
                        2
                    </FlexBox>
                    <FlexBox>3</FlexBox>
                </View>
            </ListSection>

            <ListSection title="grow" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-2">
                    <FlexBox>1</FlexBox>
                    <FlexBox className="grow" color="bg-red-500">
                        2
                    </FlexBox>
                    <FlexBox>3</FlexBox>
                </View>
            </ListSection>

            <ListSection title="grow-0" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-2">
                    <FlexBox className="flex-1">1</FlexBox>
                    <FlexBox className="grow-0" color="bg-red-500">
                        2
                    </FlexBox>
                    <FlexBox className="flex-1">3</FlexBox>
                </View>
            </ListSection>

            {/* Flex Shrink */}
            <ListSection title="shrink" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-2">
                    <FlexBox className="w-32">Long Content 1</FlexBox>
                    <FlexBox className="w-32 shrink " color="bg-red-500">
                        Shrinks
                    </FlexBox>
                    <FlexBox className="w-32">Long Content 3</FlexBox>
                </View>
            </ListSection>

            <ListSection title="shrink-0" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-2">
                    <FlexBox className="w-32">Long Content 1</FlexBox>
                    <FlexBox className="w-32 shrink-0" color="bg-red-500">
                        No Shrink
                    </FlexBox>
                    <FlexBox className="w-32">Long Content 3</FlexBox>
                </View>
            </ListSection>

            {/* Flex Basis */}
            <ListSection title="basis-[100px]" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-2">
                    <FlexBox>1</FlexBox>
                    <FlexBox className="basis-[100px]" color="bg-red-500">
                        2
                    </FlexBox>
                    <FlexBox>3</FlexBox>
                </View>
            </ListSection>

            <ListSection title="basis-1/4" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-2">
                    <FlexBox>1</FlexBox>
                    <FlexBox className="basis-1/4" color="bg-red-500">
                        2
                    </FlexBox>
                    <FlexBox>3</FlexBox>
                </View>
            </ListSection>

            {/* Gap */}
            <ListSection title="gap-0" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-0">
                    <FlexBox>1</FlexBox>
                    <FlexBox>2</FlexBox>
                    <FlexBox>3</FlexBox>
                    <FlexBox>4</FlexBox>
                </View>
            </ListSection>

            <ListSection title="gap-2" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-2">
                    <FlexBox>1</FlexBox>
                    <FlexBox>2</FlexBox>
                    <FlexBox>3</FlexBox>
                    <FlexBox>4</FlexBox>
                </View>
            </ListSection>

            <ListSection title="gap-4" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-4">
                    <FlexBox>1</FlexBox>
                    <FlexBox>2</FlexBox>
                    <FlexBox>3</FlexBox>
                    <FlexBox>4</FlexBox>
                </View>
            </ListSection>

            <ListSection title="gap-8" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-8">
                    <FlexBox>1</FlexBox>
                    <FlexBox>2</FlexBox>
                    <FlexBox>3</FlexBox>
                    <FlexBox>4</FlexBox>
                </View>
            </ListSection>

            <ListSection title="gap-x-[20px]" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row gap-x-[20px]">
                    <FlexBox>1</FlexBox>
                    <FlexBox>2</FlexBox>
                    <FlexBox>3</FlexBox>
                    <FlexBox>4</FlexBox>
                </View>
            </ListSection>

            <ListSection
                title="gap-x-4 gap-y-2"
                containerClassName="p-2 items-center"
            >
                <View className="w-full rounded-lg flex-row flex-wrap gap-x-4 gap-y-2">
                    <FlexBox className="w-16">1</FlexBox>
                    <FlexBox className="w-16">2</FlexBox>
                    <FlexBox className="w-16">3</FlexBox>
                    <FlexBox className="w-16">4</FlexBox>
                    <FlexBox className="w-16">5</FlexBox>
                    <FlexBox className="w-16">6</FlexBox>
                    <FlexBox className="w-16">7</FlexBox>
                    <FlexBox className="w-16">8</FlexBox>
                </View>
            </ListSection>

            {/* Flex Wrap */}
            <ListSection title="flex-wrap" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row flex-wrap gap-2">
                    <FlexBox className="w-20">1</FlexBox>
                    <FlexBox className="w-20">2</FlexBox>
                    <FlexBox className="w-20">3</FlexBox>
                    <FlexBox className="w-20">4</FlexBox>
                    <FlexBox className="w-20">5</FlexBox>
                    <FlexBox className="w-20">6</FlexBox>
                    <FlexBox className="w-20">7</FlexBox>
                    <FlexBox className="w-20">8</FlexBox>
                </View>
            </ListSection>

            <ListSection
                title="flex-wrap-reverse"
                containerClassName="p-2 items-center"
            >
                <View className="w-full rounded-lg flex-row flex-wrap-reverse gap-2">
                    <FlexBox className="w-20">1</FlexBox>
                    <FlexBox className="w-20">2</FlexBox>
                    <FlexBox className="w-20">3</FlexBox>
                    <FlexBox className="w-20">4</FlexBox>
                    <FlexBox className="w-20">5</FlexBox>
                    <FlexBox className="w-20">6</FlexBox>
                    <FlexBox className="w-20">7</FlexBox>
                    <FlexBox className="w-20">8</FlexBox>
                </View>
            </ListSection>

            <ListSection title="flex-nowrap" containerClassName="p-2 items-center">
                <View className="w-full rounded-lg flex-row flex-nowrap gap-2">
                    <FlexBox className="w-20">1</FlexBox>
                    <FlexBox className="w-20">2</FlexBox>
                    <FlexBox className="w-20">3</FlexBox>
                    <FlexBox className="w-20">4</FlexBox>
                    <FlexBox className="w-20">5</FlexBox>
                    <FlexBox className="w-20">6</FlexBox>
                    <FlexBox className="w-20">7</FlexBox>
                    <FlexBox className="w-20">8</FlexBox>
                </View>
            </ListSection>
        </SectionScreen>
    )
}
