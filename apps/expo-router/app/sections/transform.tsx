import { ListSection } from '@/components/list'
import { DemoBox, SectionScreen } from '@/components/shared'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function TransformScreen() {
    const TransformBox = ({
        children,
        className,
    }: {
        children?: React.ReactNode
        className?: string
    }) => (
        <DemoBox size="small" className={cn(className)}>
            {children || 'Box'}
        </DemoBox>
    )

    return (
        <SectionScreen>
            <ListSection
                title="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                containerClassName="relative items-center min-h-20 p-0"
            >
                <TransformBox className="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 absolute">
                    Centered
                </TransformBox>
            </ListSection>

            <ListSection
                title="mx-auto my-auto"
                containerClassName="relative items-center min-h-20"
            >
                <TransformBox className="mx-auto my-auto">Centered</TransformBox>
            </ListSection>

            {/* Rotate */}
            <ListSection title="rotate-0" containerClassName="p-2 items-center">
                <TransformBox className="rotate-0">0°</TransformBox>
            </ListSection>

            <ListSection title="rotate-1" containerClassName="p-2 items-center">
                <TransformBox className="rotate-1">1°</TransformBox>
            </ListSection>

            <ListSection title="rotate-3" containerClassName="p-2 items-center">
                <TransformBox className="rotate-3">3°</TransformBox>
            </ListSection>

            <ListSection title="rotate-12" containerClassName="p-2 items-center">
                <TransformBox className="rotate-12">12°</TransformBox>
            </ListSection>

            <ListSection title="rotate-[22]" containerClassName="p-2 items-center">
                <TransformBox className="rotate-[22deg]">22°</TransformBox>
            </ListSection>

            <ListSection title="rotate-45" containerClassName="p-2 items-center">
                <TransformBox className="rotate-45">45°</TransformBox>
            </ListSection>

            <ListSection title="rotate-90" containerClassName="p-2 items-center">
                <TransformBox className="rotate-90">90°</TransformBox>
            </ListSection>

            <ListSection title="rotate-180" containerClassName="p-2 items-center">
                <TransformBox className="rotate-180">180°</TransformBox>
            </ListSection>

            <ListSection title="-rotate-45" containerClassName="p-2 items-center">
                <TransformBox className="-rotate-45">-45°</TransformBox>
            </ListSection>

            {/* Scale */}
            <ListSection title="scale-0" containerClassName="p-2 items-center">
                <TransformBox className="scale-0">0%</TransformBox>
            </ListSection>

            <ListSection title="-scale-50" containerClassName="p-2 items-center">
                <TransformBox className="-scale-50">50%</TransformBox>
            </ListSection>

            <ListSection title="scale-50" containerClassName="p-2 items-center">
                <TransformBox className="scale-50">50%</TransformBox>
            </ListSection>

            <ListSection title="scale-[1.6]" containerClassName="p-2 items-center">
                <TransformBox className="scale-[1.6]">1.6</TransformBox>
            </ListSection>

            <ListSection title="-scale-[1.6]" containerClassName="p-2 items-center">
                <TransformBox className="-scale-[1.6]">-1.6</TransformBox>
            </ListSection>

            <ListSection title="scale-75" containerClassName="p-2 items-center">
                <TransformBox className="scale-75">75%</TransformBox>
            </ListSection>

            <ListSection title="scale-100" containerClassName="p-2 items-center">
                <TransformBox className="scale-100">100%</TransformBox>
            </ListSection>

            <ListSection title="scale-110" containerClassName="p-2 items-center">
                <TransformBox className="scale-110">110%</TransformBox>
            </ListSection>

            <ListSection title="scale-125" containerClassName="p-2 items-center">
                <TransformBox className="scale-125">125%</TransformBox>
            </ListSection>

            <ListSection title="scale-150" containerClassName="p-2 items-center">
                <TransformBox className="scale-150">150%</TransformBox>
            </ListSection>

            {/* Scale X and Y */}
            <ListSection title="scale-x-50" containerClassName="p-2 items-center">
                <TransformBox className="scale-x-50">X: 50%</TransformBox>
            </ListSection>

            <ListSection title="scale-y-50" containerClassName="p-2 items-center">
                <TransformBox className="scale-y-50">Y: 50%</TransformBox>
            </ListSection>

            <ListSection title="scale-x-150" containerClassName="p-2 items-center">
                <TransformBox className="scale-x-150">X: 150%</TransformBox>
            </ListSection>

            <ListSection title="scale-y-150" containerClassName="p-2 items-center">
                <TransformBox className="scale-y-150">Y: 150%</TransformBox>
            </ListSection>

            {/* Skew */}
            <ListSection title="skew-x-0" containerClassName="p-2 items-center">
                <TransformBox className="skew-x-0">0° X</TransformBox>
            </ListSection>

            <ListSection title="skew-x-3" containerClassName="p-2 items-center">
                <TransformBox className="skew-x-3">3° X</TransformBox>
            </ListSection>

            <ListSection title="skew-x-12" containerClassName="p-2 items-center">
                <TransformBox className="skew-x-12">12° X</TransformBox>
            </ListSection>

            <ListSection title="skew-y-3" containerClassName="p-2 items-center">
                <TransformBox className="skew-y-3">3° Y</TransformBox>
            </ListSection>

            {/* Translate */}
            <ListSection title="translate-x-0" containerClassName="p-2 items-center">
                <TransformBox className="translate-x-0">X: 0</TransformBox>
            </ListSection>

            <ListSection title="translate-x-4" containerClassName="p-2 items-center">
                <TransformBox className="translate-x-4">X: +4</TransformBox>
            </ListSection>

            <ListSection
                title="translate-x-[42.4]"
                containerClassName="p-2 items-center"
            >
                <TransformBox className="translate-x-[42.4]">X: +42.4</TransformBox>
            </ListSection>

            <ListSection
                title="-translate-x-[42.4]"
                containerClassName="p-2 items-center"
            >
                <TransformBox className="-translate-x-[42.4]">X: -42.4</TransformBox>
            </ListSection>

            <ListSection title="translate-x-8" containerClassName="p-2 items-center">
                <TransformBox className="translate-x-8">X: +8</TransformBox>
            </ListSection>

            <ListSection title="-translate-x-4" containerClassName="p-2 items-center">
                <TransformBox className="-translate-x-4">X: -4</TransformBox>
            </ListSection>

            <ListSection title="translate-y-4" containerClassName="p-2 items-center">
                <TransformBox className="translate-y-4">Y: +4</TransformBox>
            </ListSection>

            <ListSection title="-translate-y-4" containerClassName="p-2 items-center">
                <TransformBox className="-translate-y-4">Y: -4</TransformBox>
            </ListSection>

            {/* Combined Transforms */}
            <ListSection
                title="Combined transforms"
                containerClassName="p-5 items-center"
            >
                <View className="flex-row flex-wrap gap-8 items-center justify-center">
                    <TransformBox className="rotate-12 scale-110">R+S</TransformBox>
                    <TransformBox className="translate-x-2 translate-y-2 rotate-45 scale-75">
                        All
                    </TransformBox>
                </View>
            </ListSection>

            {/* Transform Origin */}
            <ListSection
                title="Transform origins"
                containerClassName="p-2 items-center"
            >
                <View className="flex-row flex-wrap gap-6 items-center justify-center">
                    <TransformBox className="origin-top-left rotate-45 scale-75">
                        TL
                    </TransformBox>
                    <TransformBox className="origin-center rotate-45 scale-75">
                        C
                    </TransformBox>
                    <TransformBox className="origin-bottom-right rotate-45 scale-75">
                        BR
                    </TransformBox>
                </View>
            </ListSection>
        </SectionScreen>
    )
}
