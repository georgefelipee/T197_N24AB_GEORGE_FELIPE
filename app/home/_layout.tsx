import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import GlobalFAB from '../components/GlobalFAB'

export default function HomeLayout() {
  return (
    <>
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="HomeDocuments" options={{headerShown: false }} />
      <Tabs.Screen name= "Perfil" options={{headerShown: false }} />
    </Tabs>
      <GlobalFAB /> {/* Adiciona o FAB global */}
    </>
  )
}