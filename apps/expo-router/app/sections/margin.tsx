import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function MarginScreen() {
    const MarginBox = ({
        children,
        className,
        showMargin = false,
    }: {
        children: React.ReactNode
        className?: string
        showMargin?: boolean
    }) => (
        <View
            className={cn(
                showMargin
                    && 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 border-dashed rounded-xl w-full',
            )}
        >
            <View
                className={cn(
                    'bg-blue-500 opacity-70 rounded-lg items-center justify-center p-3',
                    className,
                )}
            >
                <ThemedText className="text-white text-xs font-bold">
                    {children}
                </ThemedText>
            </View>
        </View>
    )

    return (
        <SectionScreen>
            {/* All sides margin */}
            <ListSection title="m-0" containerClassName="p-0 items-center">
                <MarginBox className="m-0" showMargin>
                    No Margin
                </MarginBox>
            </ListSection>

            <ListSection title="m-2" containerClassName="p-0 items-center">
                <MarginBox className="m-2" showMargin>
                    Margin 2
                </MarginBox>
            </ListSection>

            <ListSection title="m-4" containerClassName="p-0 items-center">
                <MarginBox className="m-4" showMargin>
                    Margin 4
                </MarginBox>
            </ListSection>

            <ListSection title="m-8" containerClassName="p-0 items-center">
                <MarginBox className="m-8" showMargin>
                    Margin 8
                </MarginBox>
            </ListSection>

            <ListSection title="m-[17.5px]" containerClassName="p-0 items-center">
                <MarginBox className="m-[17.5px]" showMargin>
                    Margin 17.5px
                </MarginBox>
            </ListSection>

            <ListSection title="-m-[17.5px]" containerClassName="p-0 items-center">
                <MarginBox className="-m-[17.5px]" showMargin>
                    Negative Margin 17.5px
                </MarginBox>
            </ListSection>

            {/* Horizontal and Vertical */}
            <ListSection title="mx-4" containerClassName="p-0 items-center">
                <MarginBox className="mx-4" showMargin>
                    Horizontal Margin
                </MarginBox>
            </ListSection>

            <ListSection title="my-4" containerClassName="p-0 items-center">
                <MarginBox className="my-4" showMargin>
                    Vertical Margin
                </MarginBox>
            </ListSection>

            <ListSection title="mx-auto" containerClassName="p-0 items-center">
                <MarginBox className="mx-auto w-32" showMargin>
                    Centered
                </MarginBox>
            </ListSection>

            {/* Individual sides */}
            <ListSection title="mt-4" containerClassName="p-0 items-center">
                <MarginBox className="mt-4" showMargin>
                    Top Margin
                </MarginBox>
            </ListSection>

            <ListSection title="mr-4" containerClassName="p-0 items-center">
                <MarginBox className="mr-4" showMargin>
                    Right Margin
                </MarginBox>
            </ListSection>

            <ListSection title="mb-4" containerClassName="p-0 items-center">
                <MarginBox className="mb-4" showMargin>
                    Bottom Margin
                </MarginBox>
            </ListSection>

            <ListSection title="ml-4" containerClassName="p-0 items-center">
                <MarginBox className="ml-4" showMargin>
                    Left Margin
                </MarginBox>
            </ListSection>

            {/* Negative margins */}
            <ListSection
                title="-m-2"
                containerClassName="p-0 items-center overflow-visible"
            >
                <MarginBox className="-m-2" showMargin>
                    Negative Margin
                </MarginBox>
            </ListSection>

            <ListSection
                title="-mt-4"
                containerClassName="p-0 items-center overflow-visible"
            >
                <MarginBox className="-mt-4" showMargin>
                    Negative Top
                </MarginBox>
            </ListSection>

            <ListSection
                title="-ml-4"
                containerClassName="p-0 items-center overflow-visible"
            >
                <MarginBox className="-ml-4" showMargin>
                    Negative Left
                </MarginBox>
            </ListSection>
        </SectionScreen>
    )
}
