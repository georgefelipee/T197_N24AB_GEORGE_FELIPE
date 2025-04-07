import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="login" options={{ headerShown: false }}  />
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  </Stack>;
}
