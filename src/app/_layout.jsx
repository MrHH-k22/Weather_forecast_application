import { Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UnitsProvider } from "../context/UnitsContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Reset notification flag when app starts
    AsyncStorage.removeItem("initialNotificationShown");
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <UnitsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="cities/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="charts/HoursDetails"
            options={{
              headerStyle: {
                backgroundColor: "#1c2732", // Màu giống với màn hình ở dưới
              },
              headerTintColor: "#fff", // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerShadowVisible: true, // Hiển thị shadow
              title: "Hour forecast", // Tiêu đề phù hợp với ứng dụng của bạn
              // Hoặc bạn có thể customize thêm headerTitle
            }}
          />
          <Stack.Screen
            name="charts/DaysDetails"
            options={{
              headerStyle: {
                backgroundColor: "#1c2732", // Màu giống với màn hình ở dưới
              },
              headerTintColor: "#fff", // Màu chữ trắng
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerShadowVisible: true, // Hiển thị shadow
              title: "Days forecast", // Tiêu đề phù hợp với ứng dụng của bạn
              // Hoặc bạn có thể customize thêm headerTitle
            }}
          />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </UnitsProvider>
    </QueryClientProvider>
  );
}
