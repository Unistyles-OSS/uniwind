import { cn } from "@/utils/cn";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { Text as RNText } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      largeTitle: "text-5xl leading-tight font-sans",
      title1: "text-2xl font-sans",
      title2: "text-[22px] leading-7 font-sans",
      title3: "text-xl font-sans",
      heading: "text-[17px] leading-6 font-medium font-sans",
      body: "text-[17px] leading-6 font-sans",
      callout: "text-base font-sans",
      subhead: "text-[15px] leading-5 font-sans",
      footnote: "text-[13px] leading-5 font-sans",
      caption1: "text-xs font-sans",
      caption2: "text-[11px] leading-4 font-sans",
    },
    color: {
      primary: "",
      secondary: "text-secondary-foreground/90",
      tertiary: "text-muted-foreground/90",
      quarternary: "text-muted-foreground/50",
    },
    invert: {
      true: "text-background dark:text-background",
      false: "",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "primary",
    invert: false,
  },
});

const TextClassContext = React.createContext<string | undefined>(undefined);

function ThemedText({
  className,
  variant,
  color,
  invert,
  animated,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNText> &
  VariantProps<typeof textVariants> & { animated?: boolean }) {
  const textClassName = React.useContext(TextClassContext);

  const Comp = animated ? Animated.Text : RNText;

  const classNames = cn(
    textVariants({ variant, color, invert }),
    textClassName,
    className
  );
  return (
    <Comp
      className={classNames}
      layout={animated ? LinearTransition : undefined}
      allowFontScaling={false}
      style={{
        fontVariant: classNames.includes("tabular-nums")
          ? ["tabular-nums"]
          : [],
      }}
      {...props}
    />
  );
}

export { TextClassContext, ThemedText };
