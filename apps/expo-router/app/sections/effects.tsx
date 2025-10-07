import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function EffectsScreen() {
    const ShadowExample = ({
        className,
    }: {
        className?: string
    }) => <View className={cn('bg-card dark:bg-neutral-800 size-20 rounded-lg', className)} />
    return (
        <SectionScreen>
            {/* Shadows */}
            <ListSection title="shadow shadow-red-500" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="shadow" />
            </ListSection>
            <ListSection title="shadow-xs" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="shadow-xs" />
            </ListSection>
            <ListSection title="shadow-sm" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="shadow-sm" />
            </ListSection>
            <ListSection title="shadow-md" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="shadow-md" />
            </ListSection>
            <ListSection title="shadow-lg" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="shadow-lg" />
            </ListSection>
            <ListSection title="shadow-xl" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="shadow-xl" />
            </ListSection>
            <ListSection title="shadow-2xl" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="shadow-2xl" />
            </ListSection>
            <ListSection title="shadow-none" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="shadow-none" />
            </ListSection>
            {/* Gradients */}
            <ListSection title="bg-gradient-to-b from-indigo-500 to-pink-500" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="bg-gradient-to-b from-indigo-500 to-pink-500" />
            </ListSection>
            <ListSection title="bg-gradient-to-r from-indigo-500 via-sky-500 to-pink-500" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="bg-gradient-to-r from-indigo-500 via-sky-500 to-pink-500" />
            </ListSection>
            <ListSection title="bg-gradient-to-bl from-orange-200 to-red-900" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="bg-gradient-to-bl from-orange-200 to-red-900" />
            </ListSection>
            <ListSection title="bg-linear-150 from-orange-500 to-indigo-600" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="bg-linear-150 from-orange-500 to-indigo-600" />
            </ListSection>
            <ListSection title="bg-linear-[25deg,red_5%,yellow_60%,lime_90%,teal]" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="bg-linear-[25deg,red_5%,yellow_60%,lime_90%,teal]" />
            </ListSection>
            <ListSection title="bg-gradient-to-t from-indigo-500 to-pink-500" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="bg-gradient-to-t from-indigo-500 to-pink-500" />
            </ListSection>
            <ListSection title="bg-gradient-to-tl from-indigo-500 to-pink-500" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="bg-gradient-to-tl from-indigo-500 to-pink-500" />
            </ListSection>
            <ListSection title="bg-gradient-to-tr from-indigo-500 to-pink-500" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="bg-gradient-to-tr from-indigo-500 to-pink-500" />
            </ListSection>
            <ListSection title="bg-gradient-to-b from-indigo-500 to-pink-500" containerClassName="p-2 py-5 items-center">
                <ShadowExample className="bg-gradient-to-b from-indigo-500 to-pink-500" />
            </ListSection>
        </SectionScreen>
    )
}
