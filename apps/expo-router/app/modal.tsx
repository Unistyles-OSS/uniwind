import { ThemedText } from "@/components/themed-text";
import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView, View } from "react-native";

export default function ModalScreen() {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView
      contentContainerClassName="p-4 gap-4"
      contentContainerStyle={{
        paddingTop: headerHeight,
        marginBottom: -headerHeight, // temp fix for react-native-screen. It will be fixed in the next version.
      }}
    >
      <View className="items-center justify-center bg-red-500">
        <ThemedText>Normal text</ThemedText>
      </View>
      <View className="items-center justify-center bg-red-500">
        <ThemedText>Normal text</ThemedText>
      </View>
      <View className="items-center justify-center bg-red-500">
        <ThemedText>Normal text</ThemedText>
      </View>
      <View className="items-center justify-center bg-red-500">
        <ThemedText>Normal text</ThemedText>
      </View>
    </ScrollView>
  );
}
