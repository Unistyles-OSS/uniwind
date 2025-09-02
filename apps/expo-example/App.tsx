import './global.css'
import React from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'

const TailwindTestUI = () => {
    return (
        <ScrollView className="px-4 py-20 bg-gray-100">
            {/* Background Colors */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Background Colors</Text>
                <View className="flex-row flex-wrap gap-2">
                    <View className="bg-red-500 w-16 h-16 rounded" />
                    <View className="bg-blue-500 w-16 h-16 rounded" />
                    <View className="bg-green-500 w-16 h-16 rounded" />
                    <View className="bg-yellow-500 w-16 h-16 rounded" />
                    <View className="bg-purple-500 w-16 h-16 rounded" />
                </View>
            </View>

            {/* Text Styles */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Text Styles</Text>
                <Text className="text-xs text-gray-600">Extra Small Text</Text>
                <Text className="text-sm text-blue-500">Small Text</Text>
                <Text className="text-base font-bold">Base Bold Text</Text>
                <Text className="text-lg italic text-green-600">Large Italic Text</Text>
                <Text className="text-xl font-bold text-center">Extra Large Centered</Text>
            </View>

            {/* Spacing */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Spacing</Text>
                <View className="p-4 bg-blue-100 mb-2">
                    <Text>Padding 4</Text>
                </View>
                <View className="m-4 p-2 bg-green-100">
                    <Text>Margin 4 + Padding 2</Text>
                </View>
                <View className="mt-8 ml-2 p-3 bg-yellow-100">
                    <Text>Margin Top 8 + Left 2</Text>
                </View>
            </View>

            {/* Borders */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Borders</Text>
                <View className="border border-gray-300 p-2 mb-2 rounded">
                    <Text>Default Border</Text>
                </View>
                <View className="border-2 border-blue-500 p-2 mb-2 rounded-lg">
                    <Text>Blue Thick Border</Text>
                </View>
                <View className="border border-red-500 rounded-full w-16 h-16 items-center justify-center">
                    <Text>Circle</Text>
                </View>
            </View>

            {/* Flexbox */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Flexbox</Text>
                <View className="flex-row justify-between mb-2">
                    <View className="w-12 h-12 bg-red-300" />
                    <View className="w-12 h-12 bg-blue-300" />
                    <View className="w-12 h-12 bg-green-300" />
                </View>
                <View className="flex-row items-center gap-2">
                    <View className="w-12 h-8 bg-yellow-300" />
                    <View className="w-12 h-16 bg-purple-300" />
                    <View className="w-12 h-12 bg-pink-300" />
                </View>
            </View>

            {/* Input */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Input</Text>
                <TextInput
                    className="border border-gray-300 p-2 rounded mb-2"
                    placeholder="Default input"
                />
                <TextInput
                    className="border-2 border-blue-500 p-3 rounded-lg"
                    placeholder="Focused style input"
                />
            </View>

            {/* Buttons */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Buttons</Text>
                <Pressable className="bg-blue-500 px-4 py-2 rounded mb-2">
                    <Text className="text-white text-center">Primary Button</Text>
                </Pressable>
                <Pressable className="border border-gray-500 px-4 py-2 rounded">
                    <Text className="text-gray-700 text-center">Secondary Button</Text>
                </Pressable>
            </View>

            {/* Opacity */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Opacity</Text>
                <View className="flex-row gap-2">
                    <View className="w-16 h-16 bg-red-500 opacity-100" />
                    <View className="w-16 h-16 bg-red-500 opacity-75" />
                    <View className="w-16 h-16 bg-red-500 opacity-50" />
                    <View className="w-16 h-16 bg-red-500 opacity-25" />
                </View>
            </View>

            {/* Position */}
            <View className="mb-6 h-32 relative">
                <Text className="text-xl font-bold mb-2">Position</Text>
                <View className="absolute top-4 left-4 w-12 h-12 bg-blue-300" />
                <View className="absolute bottom-4 right-4 w-12 h-12 bg-green-300" />
            </View>

            {/* Z-index */}
            <View className="mb-6 h-20">
                <Text className="text-xl font-bold mb-2">Z-index</Text>
                <View className="absolute left-4 top-4 w-20 h-20 bg-red-300 z-10 opacity-75" />
                <View className="absolute left-8 top-8 w-20 h-20 bg-blue-300 z-20 opacity-75" />
            </View>

            {/* Regular Shadows */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-4">Regular Shadows</Text>
                <View className="flex-row flex-wrap gap-4 mb-4">
                    <View className="w-20 h-20 bg-white shadow-sm rounded p-2">
                        <Text className="text-xs text-center">shadow-sm</Text>
                    </View>
                    <View className="w-20 h-20 bg-white shadow rounded p-2">
                        <Text className="text-xs text-center">shadow</Text>
                    </View>
                    <View className="w-20 h-20 bg-white shadow-md rounded p-2">
                        <Text className="text-xs text-center">shadow-md</Text>
                    </View>
                </View>
                <View className="flex-row flex-wrap gap-4">
                    <View className="w-20 h-20 bg-white shadow-lg rounded p-2">
                        <Text className="text-xs text-center">shadow-lg</Text>
                    </View>
                    <View className="w-20 h-20 bg-white shadow-xl rounded p-2">
                        <Text className="text-xs text-center">shadow-xl</Text>
                    </View>
                    <View className="w-20 h-20 bg-white shadow-2xl rounded p-2">
                        <Text className="text-xs text-center">shadow-2xl</Text>
                    </View>
                </View>
            </View>

            {/* Colored Shadows */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-4">Colored Shadows</Text>
                <View className="flex-row flex-wrap gap-4">
                    <View className="w-20 h-20 bg-white shadow-red-500/50 shadow-md rounded p-2">
                        <Text className="text-xs text-center">shadow-red-500/50</Text>
                    </View>
                    <View className="w-20 h-20 bg-white shadow-blue-500/30 shadow-lg rounded p-2">
                        <Text className="text-xs text-center">shadow-blue-500/30</Text>
                    </View>
                    <View className="w-20 h-20 bg-white shadow-green-500/70 shadow-xl rounded p-2">
                        <Text className="text-xs text-center">shadow-green-500/70</Text>
                    </View>
                </View>
            </View>

            {/* Ring Shadows (Focus States) */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-4">Ring Shadows (Focus States)</Text>
                <View className="flex-row flex-wrap gap-4 mb-4">
                    <View className="w-20 h-20 bg-white ring-1 ring-gray-300 rounded p-2">
                        <Text className="text-xs text-center">ring-1</Text>
                    </View>
                    <View className="w-20 h-20 bg-white ring-2 ring-blue-500 rounded p-2">
                        <Text className="text-xs text-center">ring-2 blue</Text>
                    </View>
                    <View className="w-20 h-20 bg-white ring-4 ring-green-500/50 rounded p-2">
                        <Text className="text-xs text-center">ring-4 green/50</Text>
                    </View>
                </View>
                <View className="flex-row flex-wrap gap-4">
                    <View className="w-20 h-20 bg-white ring-8 ring-purple-500/30 rounded p-2">
                        <Text className="text-xs text-center">ring-8 purple/30</Text>
                    </View>
                    <View className="w-20 h-20 bg-white ring-inset ring-2 ring-red-500 rounded p-2">
                        <Text className="text-xs text-center">ring-inset red</Text>
                    </View>
                </View>
            </View>

            {/* Inset Shadows */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-4">Inset Shadows</Text>
                <View className="flex-row flex-wrap gap-4">
                    <View className="w-20 h-20 bg-gray-200 shadow-inset shadow-md rounded p-2">
                        <Text className="text-xs text-center">shadow-inset</Text>
                    </View>
                    <View className="w-20 h-20 bg-blue-100 shadow-inset shadow-lg rounded p-2">
                        <Text className="text-xs text-center">inset shadow-lg</Text>
                    </View>
                    <View className="w-20 h-20 bg-green-100 shadow-inset shadow-xl rounded p-2">
                        <Text className="text-xs text-center">inset shadow-xl</Text>
                    </View>
                </View>
            </View>

            {/* Inset Ring */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-4">Inset Ring</Text>
                <View className="flex-row flex-wrap gap-4">
                    <View className="w-20 h-20 bg-white ring-inset ring-2 ring-gray-400 rounded p-2">
                        <Text className="text-xs text-center">inset ring-2</Text>
                    </View>
                    <View className="w-20 h-20 bg-white ring-inset ring-4 ring-blue-500/50 rounded p-2">
                        <Text className="text-xs text-center">inset ring-4 blue</Text>
                    </View>
                </View>
            </View>

            {/* Shadow on Interactive Elements */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-4">Shadow on Interactive Elements</Text>
                <Pressable className="bg-white shadow-lg rounded-lg p-4 mb-4 active:shadow-md">
                    <Text className="text-center font-medium">Pressable with shadow</Text>
                </Pressable>

                <View className="bg-white shadow-xl rounded-lg p-4">
                    <TextInput
                        className="border border-gray-300 rounded p-2 shadow-inner"
                        placeholder="Input with inner shadow"
                    />
                </View>
            </View>

            {/* Combined Examples */}
            <View className="mb-6">
                <Text className="text-xl font-bold mb-4">Combined Shadow Examples</Text>
                <View className="bg-white rounded-xl shadow-2xl p-6 mb-4">
                    <Text className="text-lg font-bold mb-2">Card with Heavy Shadow</Text>
                    <Text className="text-gray-600">This card uses shadow-2xl for depth</Text>
                </View>

                <View className="bg-blue-50 rounded-lg shadow-md ring-2 ring-blue-200 p-4">
                    <Text className="font-medium">Element with shadow + ring</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default TailwindTestUI
