import { Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Reset notification flag when app starts
    AsyncStorage.removeItem("initialNotificationShown");
  }, []);
  return (
    // <Stack
    //   screenOptions={{
    //     headerShown: false,
    //     contentStyle: { paddingTop: 0 },
    //   }}
    // />
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/cities" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
        <Stack.Screen name="cities/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="charts/HourDetails" />
      </Stack>
    </QueryClientProvider>
  );
}
