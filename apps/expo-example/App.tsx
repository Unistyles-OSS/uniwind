import './global.css'
import { Text, View } from 'react-native'

export default function App() {
    return (
        <View className="flex-1 h-full bg-blue-900 justify-center items-center min-[400px]:bg-purple-900">
            <Text className="portrait:text-white landscape:text-red-700 text-2xl translate-x-[100px]">
                Hello uniwind!
            </Text>
        </View>
    )
}
