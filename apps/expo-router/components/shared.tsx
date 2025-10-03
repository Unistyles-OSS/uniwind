import { ThemedText } from "@/components/themed-text";
import { cn } from "@/utils/cn";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const DemoBox = ({
  children,
  className,
  color = "bg-blue-500",
  textColor = "text-white",
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  textColor?: string;
  size?: "small" | "default" | "large";
}) => {
  const sizeClasses = {
    small: "p-2 min-w-12 min-h-12",
    default: "p-3 min-w-16 min-h-16",
    large: "p-4 min-w-20 min-h-20",
  };

  return (
    <View
      className={cn(
        color,
        "rounded-md items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <ThemedText className={cn(textColor, "text-xs font-bold text-center")}>
        {children}
      </ThemedText>
    </View>
  );
};

export const SectionScreen = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName={cn("p-4 gap-4", className)}
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: insets.bottom,
      }}
    >
      {children}
    </ScrollView>
  );
};
