import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
export default function FormSignIn() {
  return (
    <View className="flex-1 relative">
      <View className="flex-1 justify-center items-center">
        <Text className="text-5xl font-bold text-yellow-400">
          Welcome back!
        </Text>
        <Text className="text-2xl font-bold text-white">
          Sign in your account
        </Text>
        <Image
          source={require("../../assets/icons/weather.png")}
          className="w-52 h-52 mt-8"
          style={{ tintColor: "#0D719B" }}
        ></Image>
        <View className="flex flex-col items-center mt-16">
          <TextInput
            placeholder="Email"
            placeholderTextColor="white"
            className="border border-gray-300 rounded-full p-2 w-80 mt-4"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="white"
            secureTextEntry={true}
            className="border border-gray-300 rounded-full p-2 w-80 mt-4"
          />
          <TouchableOpacity className="bg-blue-500 rounded-full p-2 w-80 mt-4">
            <Text className="text-white text-center">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
