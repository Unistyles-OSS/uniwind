import './global.css'
import React from 'react'
import { Button, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

const TailwindTestPage = () => {
    return (
        <View className="flex-1 bg-background">
            <Button title="Light" />
            <Button title="Dark" />
            <Button title="Premium" />
        </View>
    )
}

export default TailwindTestPage
