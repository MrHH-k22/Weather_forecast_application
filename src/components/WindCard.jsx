import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "@react-navigation/native"; // Assuming this is the correct import
import React from "react";

function WindCard({
  weather,
  location,
  imageSource = require("../../assets/icons/pinwheel.png"), // Customizable image source
  title = "Wind speed", // Customizable title
  value, // Customizable value
  unit = "", // Customizable unit
  pathname = "/charts/DaysDetails", // Customizable link pathname
  tabName = "Wind speed", // Customizable tab parameter
}) {
  return (
    <Link
      href={{
        pathname: pathname,
        params: {
          daysForecast: JSON.stringify(weather?.forecast?.forecastday),
          location: JSON.stringify(location),
          tab: tabName,
        },
      }}
      asChild
    >
      <TouchableOpacity className="p-6 rounded-3xl bg-black/55 backdrop-blur-sm mb-6 h-[160] w-[165] flex flex-col justify-between items-center">
        <Image source={imageSource} className="w-16 h-16" resizeMode="cover" />
        <Text className="text-lg text-center text-white">{title}</Text>
        <Text className="text-xl font-semibold text-center text-white">
          {value} {unit}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}

export default WindCard;
