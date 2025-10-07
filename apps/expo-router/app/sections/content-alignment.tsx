import { ListSection } from '@/components/list'
import { DemoBox, SectionScreen } from '@/components/shared'
import { cn } from '@/utils/cn'
import { View } from 'react-native'

export default function ContentAlignmentScreen() {
    const ContentBox = ({ children }: { children: React.ReactNode }) => (
        <DemoBox size="small" className="size-7">
            {children}
        </DemoBox>
    )

    return (
        <SectionScreen>
            <ListSection title="content-center" containerClassName="p-2 items-center">
                <View className={cn('h-32 w-full content-center flex-wrap gap-0.5')}>
                    <ContentBox>1</ContentBox>
                    <ContentBox>2</ContentBox>
                    <ContentBox>3</ContentBox>
                    <ContentBox>4</ContentBox>
                    <ContentBox>5</ContentBox>
                    <ContentBox>6</ContentBox>
                    <ContentBox>7</ContentBox>
                    <ContentBox>8</ContentBox>
                </View>
            </ListSection>

            <ListSection title="content-start" containerClassName="p-2 items-center">
                <View className={cn('h-32 w-full content-start flex-wrap gap-0.5')}>
                    <ContentBox>1</ContentBox>
                    <ContentBox>2</ContentBox>
                    <ContentBox>3</ContentBox>
                    <ContentBox>4</ContentBox>
                    <ContentBox>5</ContentBox>
                    <ContentBox>6</ContentBox>
                    <ContentBox>7</ContentBox>
                    <ContentBox>8</ContentBox>
                </View>
            </ListSection>

            <ListSection title="content-end" containerClassName="p-2 items-center">
                <View className={cn('h-32 w-full content-end flex-wrap gap-0.5')}>
                    <ContentBox>1</ContentBox>
                    <ContentBox>2</ContentBox>
                    <ContentBox>3</ContentBox>
                    <ContentBox>4</ContentBox>
                    <ContentBox>5</ContentBox>
                    <ContentBox>6</ContentBox>
                    <ContentBox>7</ContentBox>
                    <ContentBox>8</ContentBox>
                </View>
            </ListSection>

            <ListSection
                title="content-between"
                containerClassName="p-2 items-center"
            >
                <View className={cn('h-32 w-full content-between flex-wrap gap-0.5')}>
                    <ContentBox>1</ContentBox>
                    <ContentBox>2</ContentBox>
                    <ContentBox>3</ContentBox>
                    <ContentBox>4</ContentBox>
                    <ContentBox>5</ContentBox>
                    <ContentBox>6</ContentBox>
                    <ContentBox>7</ContentBox>
                    <ContentBox>8</ContentBox>
                </View>
            </ListSection>

            <ListSection title="content-around" containerClassName="p-2 items-center">
                <View className={cn('h-32 w-full content-around flex-wrap gap-0.5')}>
                    <ContentBox>1</ContentBox>
                    <ContentBox>2</ContentBox>
                    <ContentBox>3</ContentBox>
                    <ContentBox>4</ContentBox>
                    <ContentBox>5</ContentBox>
                    <ContentBox>6</ContentBox>
                    <ContentBox>7</ContentBox>
                    <ContentBox>8</ContentBox>
                </View>
            </ListSection>

            <ListSection title="content-evenly" containerClassName="p-2 items-center">
                <View className={cn('h-32 w-full content-evenly flex-wrap gap-0.5')}>
                    <ContentBox>1</ContentBox>
                    <ContentBox>2</ContentBox>
                    <ContentBox>3</ContentBox>
                    <ContentBox>4</ContentBox>
                    <ContentBox>5</ContentBox>
                    <ContentBox>6</ContentBox>
                    <ContentBox>7</ContentBox>
                    <ContentBox>8</ContentBox>
                </View>
            </ListSection>
        </SectionScreen>
    )
}
