import { View, Image, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import FormSignIn from "../../components/formSignIn";
import FormSignUp from "../../components/formSignUp";
import ManageAccount from "../../components/manageAccount";

function Account() {
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between SignIn and SignUp
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const [showDropdown, setShowDropdown] = useState(true); // State to show the dropdown menu

  return (
    <View className="relative flex-1">
      <Image
        blurRadius={70}
        source={require("../../../assets/images/bg.png")}
        className="absolute top-0 left-0 w-full h-full"
      />
      {isLoggedIn ? (
        <ManageAccount onLogOut={() => setIsLoggedIn(false)} />
      ) : showDropdown ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-3xl font-bold text-white mb-8">Account</Text>
          <TouchableOpacity
            className="bg-blue-500 rounded-full p-3 w-60 mb-4"
            onPress={() => {
              setIsSignIn(true);
              setShowDropdown(false);
            }}
          >
            <Text className="text-white text-center">Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-500 rounded-full p-3 w-60"
            onPress={() => {
              setIsSignIn(false);
              setShowDropdown(false);
            }}
          >
            <Text className="text-white text-center">Sign Up</Text>
          </TouchableOpacity>
        </View>
      ) : isSignIn ? (
        <FormSignIn
          toggleForm={() => setIsSignIn(false)}
          onSignIn={() => setIsLoggedIn(true)} // Pass a callback to handle login
        />
      ) : (
        <FormSignUp toggleForm={() => setIsSignIn(true)} />
      )}
    </View>
  );
}

export default Account;
