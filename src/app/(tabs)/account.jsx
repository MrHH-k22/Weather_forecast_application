import { View, Image } from "react-native";
import React, { useState } from "react";
import FormSignIn from "../../components/formSignIn";
import FormSignUp from "../../components/formSignUp";
import ManageAccount from "../../components/manageAccount";

function Account() {
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between SignIn and SignUp
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in

  return (
    <View className="relative flex-1">
      <Image
        blurRadius={70}
        source={require("../../../assets/images/bg.png")}
        className="absolute top-0 left-0 w-full h-full"
      />
      {isLoggedIn ? (
        <ManageAccount onLogOut={() => setIsLoggedIn(false)} />
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
