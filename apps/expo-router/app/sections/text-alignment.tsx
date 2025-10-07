import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { ThemedText } from '@/components/themed-text'
import { cn } from '@/utils/cn'

export default function TextAlignmentScreen() {
    const TextExample = ({
        children,
        className,
        isMultiline = false,
    }: {
        children: React.ReactNode
        className?: string
        isMultiline?: boolean
    }) => (
        <ThemedText className={cn('text-base', className)}>
            {isMultiline ? children : `${children} - Sample text`}
        </ThemedText>
    )

    const multilineText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

    return (
        <SectionScreen>
            {/* Basic Text Alignment */}
            <ListSection title="text-left" containerClassName="p-2 items-center">
                <TextExample className="text-left w-full">
                    Left aligned text
                </TextExample>
            </ListSection>

            <ListSection title="text-center" containerClassName="p-2 items-center">
                <TextExample className="text-center w-full">
                    Center aligned text
                </TextExample>
            </ListSection>

            <ListSection title="text-right" containerClassName="p-2 items-center">
                <TextExample className="text-right w-full">
                    Right aligned text
                </TextExample>
            </ListSection>

            <ListSection title="text-justify" containerClassName="p-2 items-center">
                <TextExample className="text-justify" isMultiline>
                    {multilineText}
                </TextExample>
            </ListSection>

            {/* Multiline Examples */}
            <ListSection
                title="text-left (multiline)"
                containerClassName="p-2 items-center"
            >
                <TextExample className="text-left" isMultiline>
                    This is a longer text example that demonstrates left alignment with multiple lines. Notice how each line starts from the left edge
                    and creates a clean left margin while the right side may be uneven.
                </TextExample>
            </ListSection>

            <ListSection
                title="text-center (multiline)"
                containerClassName="p-2 items-center"
            >
                <TextExample className="text-center" isMultiline>
                    This is a longer text example that demonstrates center alignment with multiple lines. Notice how each line is centered within the
                    container, creating a symmetrical appearance but with uneven left and right edges.
                </TextExample>
            </ListSection>

            <ListSection
                title="text-right (multiline)"
                containerClassName="p-2 items-center"
            >
                <TextExample className="text-right" isMultiline>
                    This is a longer text example that demonstrates right alignment with multiple lines. Notice how each line ends at the right edge
                    and creates a clean right margin while the left side may be uneven.
                </TextExample>
            </ListSection>
        </SectionScreen>
    )
}
