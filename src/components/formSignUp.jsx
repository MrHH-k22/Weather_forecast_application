import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";

export default function FormSignUp({ toggleForm }) {
  return (
    <View className="flex-1 relative">
      <View className="flex-1 justify-center items-center">
        <Text className="text-5xl font-bold text-yellow-400">
          Nice to see you!
        </Text>
        <Text className="text-2xl font-bold text-white">
          Create your account
        </Text>
        <Image
          source={require("../../assets/icons/weather.png")}
          className="w-52 h-52 mt-8"
          style={{ tintColor: "#0D719B" }}
        />
        <View className="flex flex-col items-center mt-16">
          <TextInput
            placeholder="Username"
            placeholderTextColor="white"
            className="border border-gray-300 rounded-full p-2 w-80 mt-4"
          />
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
            <Text className="text-white text-center">Create</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleForm} className="mt-4 items-center">
            <Text className="text-white">Already have an account?</Text>
            <Text className="text-yellow-400">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
