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
        <Stack.Screen name="cities/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="charts/HourDetails"
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
      </Stack>
    </QueryClientProvider>
  );
}
