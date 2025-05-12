import { Stack } from "expo-router";
import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
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
        <Stack.Screen name="charts/HourDetails" />
      </Stack>
    </QueryClientProvider>
  );
}
