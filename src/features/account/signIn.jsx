import React from "react";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";

export default function SignIn() {
  return (
    <View className="flex-1 relative">
      <Image
        blurRadius={70}
        source={require("../../../assets/images/bg.png")}
        className="absolute top-0 left-0 w-full h-full"
      />
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-800">Sign In</Text>
        <TextInput
          placeholder="Email"
          className="border border-gray-300 rounded-lg p-2 w-80 mt-4"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          className="border border-gray-300 rounded-lg p-2 w-80 mt-4"
        />
        <TouchableOpacity className="bg-blue-500 rounded-lg p-2 w-80 mt-4">
          <Text className="text-white text-center">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
