import { ListItem, ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { router } from 'expo-router'

export default function HomeScreen() {
    return (
        <SectionScreen>
            <ListSection title="Layout">
                <ListItem
                    title="Aspect Ratio"
                    onPress={() => router.push('/sections/aspect-ratio')}
                />
                <ListItem
                    title="Display"
                    onPress={() => router.push('/sections/display')}
                />

                <ListItem
                    title="Transform"
                    onPress={() => router.push('/sections/transform')}
                    hideBorder
                />
            </ListSection>

            <ListSection title="Flex">
                <ListItem title="Flex" onPress={() => router.push('/sections/flex')} />
                <ListItem
                    title="Content Alignment"
                    onPress={() => router.push('/sections/content-alignment')}
                />
                <ListItem
                    title="Item Alignment"
                    onPress={() => router.push('/sections/item-alignment')}
                />
                <ListItem
                    title="Self Alignment"
                    onPress={() => router.push('/sections/self-alignment')}
                />
                <ListItem
                    title="Justify Content"
                    onPress={() => router.push('/sections/justify-content')}
                    hideBorder
                />
            </ListSection>

            <ListSection title="Spacing">
                <ListItem
                    title="Margin"
                    onPress={() => router.push('/sections/margin')}
                />
                <ListItem
                    title="Padding"
                    onPress={() => router.push('/sections/padding')}
                    hideBorder
                />
            </ListSection>

            <ListSection title="Typography">
                <ListItem title="Font" onPress={() => router.push('/sections/font')} />
                <ListItem
                    title="Text Alignment"
                    onPress={() => router.push('/sections/text-alignment')}
                    hideBorder
                />
            </ListSection>

            <ListSection title="Border">
                <ListItem
                    title="Border"
                    onPress={() => router.push('/sections/border')}
                />
                <ListItem
                    title="Outline"
                    onPress={() => router.push('/sections/outline')}
                    hideBorder
                />
            </ListSection>

            <ListSection title="Other">
                <ListItem
                    title="FormSheet"
                    onPress={() => router.push('/modal')}
                    hideBorder
                />
            </ListSection>
        </SectionScreen>
    )
}
