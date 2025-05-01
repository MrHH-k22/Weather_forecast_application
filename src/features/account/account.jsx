import React from "react";
import {
  Text,
  View,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterTab from "../../components/footerTab";
import SignIn from "./signIn";

export default function account() {
  return (
    <View className="flex-1 relative">
      <SafeAreaView
        className="flex flex-1"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
        edges={["right", "bottom", "left"]}
      >
        <Image
          blurRadius={70}
          source={require("../../../assets/images/bg.png")}
          className="absolute top-0 left-0 w-full h-full"
        />

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <FooterTab />
        </View>
      </SafeAreaView>
    </View>
  );
}
