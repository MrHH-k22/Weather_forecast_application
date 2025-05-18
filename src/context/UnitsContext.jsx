import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UnitsContext = createContext();

export function UnitsProvider({ children }) {
  // Sử dụng nhiều state riêng biệt cho từng loại đơn vị
  const [temperatureUnit, setTemperatureUnit] = useState("celsius"); // celsius hoặc fahrenheit
  const [windSpeedUnit, setWindSpeedUnit] = useState("kmh"); // kmh hoặc mph
  const [precipitationUnit, setPrecipitationUnit] = useState("mm"); // mm hoặc in
  const [isLoading, setIsLoading] = useState(true);

  // Tải đơn vị đo từ AsyncStorage khi component mount
  useEffect(() => {
    const loadUnits = async () => {
      try {
        const savedTempUnit = await AsyncStorage.getItem("temperatureUnit");
        const savedWindUnit = await AsyncStorage.getItem("windSpeedUnit");
        const savedPrecipUnit = await AsyncStorage.getItem("precipitationUnit");

        if (savedTempUnit) setTemperatureUnit(savedTempUnit);
        if (savedWindUnit) setWindSpeedUnit(savedWindUnit);
        if (savedPrecipUnit) setPrecipitationUnit(savedPrecipUnit);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading units:", error);
        setIsLoading(false);
      }
    };

    loadUnits();
  }, []);

  // Lưu đơn vị đo vào AsyncStorage khi thay đổi
  useEffect(() => {
    const saveUnits = async () => {
      try {
        if (!isLoading) {
          await AsyncStorage.setItem("temperatureUnit", temperatureUnit);
          await AsyncStorage.setItem("windSpeedUnit", windSpeedUnit);
          await AsyncStorage.setItem("precipitationUnit", precipitationUnit);
        }
      } catch (error) {
        console.error("Error saving units:", error);
      }
    };

    saveUnits();
  }, [temperatureUnit, windSpeedUnit, precipitationUnit, isLoading]);

  // Các hàm chuyển đổi đơn vị hỗ trợ làm tròn số
  const convertTemperature = (temp, decimals = 0) => {
    if (temp === undefined || temp === null) return 0;
    const converted =
      temperatureUnit === "fahrenheit" ? (temp * 9) / 5 + 32 : temp;
    return Number(converted.toFixed(decimals));
  };

  const convertWindSpeed = (speed, decimals = 0) => {
    if (speed === undefined || speed === null) return 0;
    const converted = windSpeedUnit === "mph" ? speed / 1.609344 : speed;
    return Number(converted.toFixed(decimals));
  };

  const convertPrecipitation = (precip, decimals = 3) => {
    if (precip === undefined || precip === null) return 0;
    const converted = precipitationUnit === "in" ? precip / 25.4 : precip;
    return Number(converted.toFixed(decimals));
  };

  // Hàm trả về ký hiệu của đơn vị
  const getTemperatureUnit = () =>
    temperatureUnit === "celsius" ? "°C" : "°F";
  const getWindSpeedUnit = () => (windSpeedUnit === "kmh" ? "km/h" : "mph");
  const getPrecipitationUnit = () => (precipitationUnit === "mm" ? "mm" : "in");

  return (
    <UnitsContext.Provider
      value={{
        // Các đơn vị và hàm setter tương ứng
        temperatureUnit,
        setTemperatureUnit,
        windSpeedUnit,
        setWindSpeedUnit,
        precipitationUnit,
        setPrecipitationUnit,

        // Các hàm chuyển đổi
        convertTemperature,
        convertWindSpeed,
        convertPrecipitation,

        // Các hàm lấy ký hiệu đơn vị
        getTemperatureUnit,
        getWindSpeedUnit,
        getPrecipitationUnit,

        isLoading,
      }}
    >
      {children}
    </UnitsContext.Provider>
  );
}

export const useUnitsContext = () => useContext(UnitsContext);
