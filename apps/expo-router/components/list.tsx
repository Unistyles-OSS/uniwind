import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'

import { IconSymbol } from '@/components/icon-symbol'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'

type ListSectionProps = ViewProps & {
    title?: string
    rightSection?: ViewProps['children']
    containerClassName?: string
}

export function ListSection({
    title,
    rightSection,
    children,
    className,
    containerClassName,
}: ListSectionProps) {
    return (
        <Animated.View>
            {title && (
                <Animated.View className="mb-1.5 flex-row items-center justify-start gap-1 px-4">
                    <ThemedText
                        className={cn(
                            'text-muted-foreground items-center text-sm font-semibold',
                            className,
                        )}
                        variant="caption1"
                    >
                        {title}
                    </ThemedText>
                    {rightSection && (
                        <View className="ml-auto flex-row items-center gap-1">
                            {rightSection}
                        </View>
                    )}
                </Animated.View>
            )}

            <Animated.View
                className={cn(
                    'overflow-hidden rounded-xl bg-card px-4 py-0',
                    containerClassName,
                )}
                style={{
                    borderCurve: 'continuous',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 16,
                    elevation: 8,
                }}
            >
                {children}
            </Animated.View>
        </Animated.View>
    )
}

type ListItemProps = TouchableOpacityProps & {
    title: string
    subtitle?: string
    hideBorder?: boolean
    titleClassName?: string
    titleTextClassName?: string
}

export function ListItem({
    title,
    subtitle,
    className,
    titleClassName,
    titleTextClassName,
    hideBorder = false,
    ...props
}: ListItemProps) {
    return (
        <TouchableOpacity className="w-full flex-row pb-[2px]" {...props} activeOpacity={0.6}>
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
