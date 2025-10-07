import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import React from 'react'
import { View } from 'react-native'

export default function JustifyContentScreen() {
    const JustifyBox = ({
        children,
        className,
    }: {
        children: React.ReactNode
        className?: string
    }) => (
        <View
            className={cn(
                'bg-blue-500 rounded-md items-center justify-center p-2 min-w-12',
                className,
            )}
        >
            <ThemedText className="text-white text-xs font-bold">
                {children}
            </ThemedText>
        </View>
    )

    return (
        <SectionScreen>
            <ListSection title="justify-start" containerClassName="p-2 items-center">
                <View className="w-full flex-row justify-start gap-2">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection title="justify-end" containerClassName="p-2 items-center">
                <View className="w-full flex-row justify-end gap-2">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection title="justify-center" containerClassName="p-2 items-center">
                <View className="w-full flex-row justify-center gap-2">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection
                title="justify-between"
                containerClassName="p-2 items-center"
            >
                <View className="w-full flex-row justify-between gap-2">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection title="justify-around" containerClassName="p-2 items-center">
                <View className="w-full flex-row justify-around gap-2">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection title="justify-evenly" containerClassName="p-2 items-center">
                <View className="w-full flex-row justify-evenly gap-2">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            {/* Column examples */}
            <ListSection
                title="justify-start (column)"
                containerClassName="p-2 items-center"
            >
                <View className="h-40 w-32 flex-col justify-start gap-2 mx-auto">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection
                title="justify-end (column)"
                containerClassName="p-2 items-center"
            >
                <View className="h-40 w-32 flex-col justify-end gap-2 mx-auto">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection
                title="justify-center (column)"
                containerClassName="p-2 items-center"
            >
                <View className="h-40 w-32 flex-col justify-center gap-2 mx-auto">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection
                title="justify-between (column)"
                containerClassName="p-2 items-center"
            >
                <View className="h-40 w-32 flex-col justify-between gap-2 mx-auto">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection
                title="justify-around (column)"
                containerClassName="p-2 items-center"
            >
                <View className="h-40 w-32 flex-col justify-around gap-2 mx-auto">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>

            <ListSection
                title="justify-evenly (column)"
                containerClassName="p-2 items-center"
            >
                <View className="h-40 w-32 flex-col justify-evenly gap-2 mx-auto">
                    <JustifyBox>1</JustifyBox>
                    <JustifyBox>2</JustifyBox>
                    <JustifyBox>3</JustifyBox>
                </View>
            </ListSection>
        </SectionScreen>
    )
}
