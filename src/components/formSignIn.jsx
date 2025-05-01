import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";

export default function FormSignIn({ toggleForm, onSignIn }) {
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
        />
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
          <TouchableOpacity
            className="bg-blue-500 rounded-full p-2 w-80 mt-4"
            onPress={onSignIn} // Call the onSignIn function when the user submits
          >
            <Text className="text-white text-center">Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleForm} className="mt-4 items-center">
            <Text className="text-white">Don't have an account?</Text>
            <Text className="text-yellow-400"> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
