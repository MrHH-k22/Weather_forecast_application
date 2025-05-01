import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";

export default function ManageAccount({ onLogOut }) {
  return (
    <View className="flex-1 relative">
      <View className="flex-1 justify-center items-center">
        <Text className="text-5xl font-bold text-yellow-400">Profile</Text>
        <Image
          source={require("../../assets/icons/account.png")}
          className="w-32 h-32 mt-8"
          style={{ tintColor: "#0D719B" }}
        />
        <View className="flex flex-col items-center mt-12 w-80">
          {/* Username */}
          <TextInput
            placeholder="Username"
            placeholderTextColor="white"
            className="border text-white border-gray-300 rounded-full p-2 w-full mt-4"
            value="JohnDoe" // Replace with dynamic username
            editable={false}
          />
          {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="white"
            className="border text-white border-gray-300 rounded-full p-2 w-full mt-4"
            value="johndoe@example.com" // Replace with dynamic email
            editable={false}
          />
          {/* New Password */}
          <TextInput
            placeholder="New Password"
            placeholderTextColor="white"
            secureTextEntry={true}
            className="border text-white border-gray-300 rounded-full p-2 w-full mt-4"
          />
          {/* Accept Changes Button */}
          <TouchableOpacity className="bg-green-500 rounded-full p-2 w-full mt-4">
            <Text className="text-white text-center">Accept Changes</Text>
          </TouchableOpacity>
          {/* Log Out Button */}
          <TouchableOpacity
            className="bg-red-500 rounded-full p-2 w-full mt-4"
            onPress={onLogOut} // Call the onLogOut function when clicked
          >
            <Text className="text-white text-center">Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
