import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'

import { IconSymbol } from '@/components/icon-symbol'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import { useResolveClassNames, withUniwind } from 'uniwind'

type ListSectionProps = ViewProps & {
    title?: string
    rightSection?: ViewProps['children']
    containerClassName?: string
}

const AnimatedView = withUniwind(Animated.View)

export function ListSection({
    title,
    rightSection,
    children,
    className,
    containerClassName,
}: ListSectionProps) {
    return (
        <AnimatedView>
            {title && (
                <AnimatedView className="mb-1.5 flex-row items-center justify-start gap-1 px-4">
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
                        <AnimatedView className="ml-auto flex-row items-center gap-1">
                            {rightSection}
                        </AnimatedView>
                    )}
                </AnimatedView>
            )}

            <AnimatedView
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
            </AnimatedView>
        </AnimatedView>
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
    const mutedStyle = useResolveClassNames('text-muted-foreground')

    return (
        <TouchableOpacity className="w-full flex-row pb-[2px]" {...props} activeOpacity={0.6}>
            <AnimatedView
                className={cn(
                    'relative h-11 w-full flex-row items-center justify-between gap-8',
                    className,
                )}
            >
                <AnimatedView
                    className={cn('shrink flex-row items-center gap-2.5', titleClassName)}
                >
                    <AnimatedView className="shrink flex-col">
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
                    </AnimatedView>
                </AnimatedView>
                <AnimatedView className="shrink-0 flex-row items-center gap-1">
                    <IconSymbol name="chevron.right" color={mutedStyle.color as string} size={16} />
                </AnimatedView>
            </AnimatedView>
            {!hideBorder && (
                <AnimatedView
                    className={cn('absolute -right-4 bottom-0 left-0 h-px bg-border')}
                />
            )}
        </TouchableOpacity>
    )
}
