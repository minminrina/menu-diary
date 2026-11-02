//2271100

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerTintColor: "#FF6F95", // цвет стрелки
        headerShadowVisible: false, // без тени
        headerStyle: {
          backgroundColor: "#FFF6FA",
        },
      }}
    >
      {/* Home */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Add */}
      <Stack.Screen name="add" />

      {/* Edit */}
      <Stack.Screen name="edit" />

      {/* Detail */}
      <Stack.Screen name="detail" />

      {/* Calendar */}
      <Stack.Screen name="calendar" />

      {/* Analytics */}
      <Stack.Screen name="analytics" />
    </Stack>
  );
}