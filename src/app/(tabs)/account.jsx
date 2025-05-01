import { View, Image } from "react-native";
import React from "react";
import FormSignIn from "../../components/formSignIn";
import FormSignUp from "../../components/formSignUp";

function account() {
  return (
    <View className="relative flex-1">
      <Image
        blurRadius={70}
        source={require("../../../assets/images/bg.png")}
        className="absolute top-0 left-0 w-full h-full"
      />
      <FormSignIn />
    </View>
  );
}

export default account;
