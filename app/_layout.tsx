import { Stack } from "expo-router";
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { CustomTheme } from "./theme";

export default function RootLayout() {
  return (
  <PaperProvider theme={CustomTheme}>
    <Stack  screenOptions={{ headerShown: false }}>
     <Stack.Screen name="index" options={{ headerShown: false }}  />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>;

  </PaperProvider>
  )
}
