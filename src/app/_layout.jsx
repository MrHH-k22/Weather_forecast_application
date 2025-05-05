import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    // <Stack
    //   screenOptions={{
    //     headerShown: false,
    //     contentStyle: { paddingTop: 0 },
    //   }}
    // />
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="(tabs)/cities" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/account" options={{ headerShown: false }} />
      <Stack.Screen name="cities/[id]" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
