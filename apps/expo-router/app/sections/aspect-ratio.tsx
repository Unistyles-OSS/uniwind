import { ListSection } from '@/components/list'
import { SectionScreen } from '@/components/shared'
import { Image } from 'react-native'

export default function AspectRatioScreen() {
    return (
        <SectionScreen>
            <ListSection title="aspect-square" containerClassName="p-2 items-center">
                <Image
                    className="mx-auto aspect-square w-40 h-40 relative rounded-lg"
                    source={require('@/assets/images/image.png')}
                />
            </ListSection>
            <ListSection title="aspect-video" containerClassName="p-2 items-center">
                <Image
                    className="mx-auto aspect-video w-40 h-40 relative rounded-lg"
                    source={require('@/assets/images/image.png')}
                />
            </ListSection>
            <ListSection title="aspect-3/2" containerClassName="p-2 items-center">
                <Image
                    className="mx-auto aspect-3/2 w-40 h-40 relative rounded-lg"
                    source={require('@/assets/images/image.png')}
                />
            </ListSection>
            <ListSection title="aspect-auto" containerClassName="p-2 items-center">
                <Image
                    className="mx-auto aspect-auto w-40 h-40 relative rounded-lg"
                    source={require('@/assets/images/image.png')}
                />
            </ListSection>
        </SectionScreen>
    )
}
