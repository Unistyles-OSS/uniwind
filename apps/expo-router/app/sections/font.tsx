import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function FontScreen() {
    const FontExample = ({
        children,
        className,
    }: {
        children: React.ReactNode
        className?: string
    }) => <ThemedText className={cn('text-base', className)}>{children}</ThemedText>

    return (
        <SectionScreen>
            {/* Font Style */}
            <ListSection title="italic" containerClassName="p-2 items-center">
                <FontExample className="italic">
                    This text is italic and slanted
                </FontExample>
            </ListSection>

            <ListSection title="not-italic" containerClassName="p-2 items-center">
                <FontExample className="not-italic">
                    This text is not italic (normal style)
                </FontExample>
            </ListSection>

            {/* Font Weight */}
            <ListSection title="font-thin" containerClassName="p-2 items-center">
                <FontExample className="font-thin">
                    This text is very thin (weight: 100)
                </FontExample>
            </ListSection>

            <ListSection
                title="font-extralight"
                containerClassName="p-2 items-center"
            >
                <FontExample className="font-extralight">
                    This text is extra light (weight: 200)
                </FontExample>
            </ListSection>

            <ListSection title="font-light" containerClassName="p-2 items-center">
                <FontExample className="font-light">
                    This text is light (weight: 300)
                </FontExample>
            </ListSection>

            <ListSection title="font-normal" containerClassName="p-2 items-center">
                <FontExample className="font-normal">
                    This text is normal weight (weight: 400)
                </FontExample>
            </ListSection>

            <ListSection title="font-medium" containerClassName="p-2 items-center">
                <FontExample className="font-medium">
                    This text is medium weight (weight: 500)
                </FontExample>
            </ListSection>

            <ListSection title="font-semibold" containerClassName="p-2 items-center">
                <FontExample className="font-semibold">
                    This text is semi-bold (weight: 600)
                </FontExample>
            </ListSection>

            <ListSection title="font-bold" containerClassName="p-2 items-center">
                <FontExample className="font-bold">
                    This text is bold (weight: 700)
                </FontExample>
            </ListSection>

            <ListSection title="font-extrabold" containerClassName="p-2 items-center">
                <FontExample className="font-extrabold">
                    This text is extra bold (weight: 800)
                </FontExample>
            </ListSection>

            <ListSection title="font-black" containerClassName="p-2 items-center">
                <FontExample className="font-black">
                    This text is black weight (weight: 900)
                </FontExample>
            </ListSection>

            <ListSection title="tabular-nums" containerClassName="p-2 items-center">
                <View className="gap-1">
                    <FontExample className="tabular-nums">1,234.56</FontExample>
                    <FontExample className="tabular-nums">9,876.54</FontExample>
                    <FontExample className="tabular-nums">1,111.11</FontExample>
                </View>
            </ListSection>

            {/* Letter Spacing */}
            <ListSection
                title="tracking-tighter"
                containerClassName="p-2 items-center"
            >
                <FontExample className="tracking-tighter">
                    Tighter letter spacing
                </FontExample>
            </ListSection>

            <ListSection title="tracking-tight" containerClassName="p-2 items-center">
                <FontExample className="tracking-tight">
                    Tight letter spacing
                </FontExample>
            </ListSection>

            <ListSection
                title="tracking-normal"
                containerClassName="p-2 items-center"
            >
                <FontExample className="tracking-normal">
                    Normal letter spacing
                </FontExample>
            </ListSection>

            <ListSection title="tracking-wide" containerClassName="p-2 items-center">
                <FontExample className="tracking-wide">Wide letter spacing</FontExample>
            </ListSection>

            <ListSection title="tracking-wider" containerClassName="p-2 items-center">
                <FontExample className="tracking-wider">
                    Wider letter spacing
                </FontExample>
            </ListSection>

            <ListSection
                title="tracking-widest"
                containerClassName="p-2 items-center"
            >
                <FontExample className="tracking-widest">
                    Widest letter spacing
                </FontExample>
            </ListSection>

            {/* Line Height */}
            <ListSection title="leading-3" containerClassName="p-2 items-center">
                <FontExample className="leading-3">
                    This is a paragraph with very tight line height. Notice how the lines are very close together making it harder to read.
                </FontExample>
            </ListSection>

            <ListSection title="leading-normal" containerClassName="p-2 items-center">
                <FontExample className="leading-normal">
                    This is a paragraph with normal line height. This provides comfortable reading experience with adequate spacing between lines.
                </FontExample>
            </ListSection>

            <ListSection
                title="leading-relaxed"
                containerClassName="p-2 items-center"
            >
                <FontExample className="leading-relaxed">
                    This is a paragraph with relaxed line height. The extra space between lines makes it even more comfortable to read.
                </FontExample>
            </ListSection>

            <ListSection title="leading-loose" containerClassName="p-2 items-center">
                <FontExample className="leading-loose">
                    This is a paragraph with loose line height. There is generous spacing between the lines which can be useful for certain design
                    contexts.
                </FontExample>
            </ListSection>

            {/* Line Clamp */}
            <ListSection title="line-clamp-1" containerClassName="p-2 items-center">
                <FontExample className="line-clamp-1">
                    This is a very long text that should be truncated to just one line with an ellipsis at the end when it overflows the container
                    width.
                </FontExample>
            </ListSection>

            <ListSection title="line-clamp-2" containerClassName="p-2 items-center">
                <FontExample className="line-clamp-2">
                    This is a longer text that should be truncated to exactly two lines with an ellipsis at the end when it overflows the container.
                    This allows for a bit more content to be visible while still maintaining a clean layout.
                </FontExample>
            </ListSection>

            <ListSection title="line-clamp-3" containerClassName="p-2 items-center">
                <FontExample className="line-clamp-3">
                    This is an even longer text that should be truncated to exactly three lines with an ellipsis at the end when it overflows the
                    container. This gives us a good balance between showing content and maintaining layout consistency. Three lines often provide
                    enough context for users to understand the content while keeping the design clean.
                </FontExample>
            </ListSection>

            {/* Text Transform */}
            <ListSection title="uppercase" containerClassName="p-2 items-center">
                <FontExample className="uppercase">
                    this text is transformed to uppercase
                </FontExample>
            </ListSection>

            <ListSection title="lowercase" containerClassName="p-2 items-center">
                <FontExample className="lowercase">
                    THIS TEXT IS TRANSFORMED TO LOWERCASE
                </FontExample>
            </ListSection>

            <ListSection title="capitalize" containerClassName="p-2 items-center">
                <FontExample className="capitalize">
                    this text is capitalized (first letter of each word)
                </FontExample>
            </ListSection>

            <ListSection title="normal-case" containerClassName="p-2 items-center">
                <FontExample className="normal-case">
                    This text preserves its original case
                </FontExample>
            </ListSection>

            {/* Text Decoration */}
            <ListSection title="underline" containerClassName="p-2 items-center">
                <FontExample className="underline">
                    This text has an underline decoration
                </FontExample>
            </ListSection>

            <ListSection title="line-through" containerClassName="p-2 items-center">
                <FontExample className="line-through">
                    This text has a line-through decoration
                </FontExample>
            </ListSection>

            {/* Combined Examples */}
            <ListSection
                title="Combined styles"
                containerClassName="p-2 items-center"
            >
                <View className="gap-2">
                    <FontExample className="font-bold uppercase tracking-wider">
                        Bold Uppercase Wide
                    </FontExample>
                    <FontExample className="italic font-light tracking-tight">
                        Italic Light Tight
                    </FontExample>
                    <FontExample className="font-semibold underline capitalize">
                        Semi-Bold Underlined Capitalized
                    </FontExample>
                    <FontExample className="font-mono tabular-nums tracking-wide">
                        123,456.78 (Mono Tabular)
                    </FontExample>
                </View>
            </ListSection>
        </SectionScreen>
    )
}
