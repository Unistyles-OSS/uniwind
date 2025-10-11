import React from 'react'
import { TouchableOpacity, View, ViewProps } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { IconSymbol } from '@/components/icon-symbol'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'

type ListSectionProps = ViewProps & {
    title?: string
    useLinearTransition?: boolean
    containerClassName?: string
}

export const ListSection = function ListSection({
    title,
    children,
    className,
    containerClassName,
    useLinearTransition = false,
}: ListSectionProps) {
    return (
        <Animated.View layout={useLinearTransition ? LinearTransition : undefined}>
            {title && (
                <Animated.View
                    layout={useLinearTransition ? LinearTransition : undefined}
                    className="mb-1.5 flex-row items-center justify-start gap-1 px-4"
                >
                    <ThemedText
                        className={cn(
                            'text-muted-foreground items-center text-sm font-semibold',
                            className,
                        )}
                        variant="caption1"
                    >
                        {title}
                    </ThemedText>
                </Animated.View>
            )}

            <Animated.View
                className={cn(
                    'overflow-hidden rounded-xl bg-card px-4 py-0 shadow-xs',
                    containerClassName,
                )}
                style={{
                    borderCurve: 'continuous',
                }}
                layout={useLinearTransition ? LinearTransition : undefined}
            >
                {children}
            </Animated.View>
        </Animated.View>
    )
}

interface ListItemProps {
    title: string
    subtitle?: string
    onPress?: () => void
    hideBorder?: boolean
    className?: string
    titleClassName?: string
    titleTextClassName?: string
}

export const ListItem = function ListItem({
    title,
    subtitle,
    onPress,
    className,
    titleClassName,
    titleTextClassName,
    hideBorder = false,
}: ListItemProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            disabled={!onPress}
            onPress={onPress}
            className="w-full flex-row pb-[2px]"
        >
            <Animated.View
                className={cn(
                    'relative h-11 w-full flex-row items-center justify-between gap-8',
                    className,
                )}
            >
                <View
                    className={cn('shrink flex-row items-center gap-2.5', titleClassName)}
                >
                    <View className="shrink flex-col">
                        <ThemedText
                            className={cn('shrink font-medium', titleTextClassName)}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {title}
                        </ThemedText>
                        {subtitle && (
                            <ThemedText className="text-muted-foreground text-sm">
                                {subtitle}
                            </ThemedText>
                        )}
                    </View>
                </View>
                <View className="shrink-0 flex-row items-center gap-1">
                    <IconSymbol name="chevron.right" color="gray" size={16} />
                </View>
            </Animated.View>
            {!hideBorder && (
                <View
                    className={cn('absolute -right-4 bottom-0 left-0 h-px bg-border')}
                />
            )}
        </TouchableOpacity>
    )
}
