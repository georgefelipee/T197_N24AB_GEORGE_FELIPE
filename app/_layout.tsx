import { Stack } from "expo-router";
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
  <PaperProvider>
    <Stack  screenOptions={{ headerShown: false }}>
    <Stack.Screen name="login" options={{ headerShown: false }}  />
    <Stack.Screen name="home" options={{ headerShown: false }} />
  </Stack>;
  </PaperProvider>
  )
}
