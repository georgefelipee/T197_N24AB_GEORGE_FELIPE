import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeLayout() {
  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'HomeDocuments') {
              iconName = 'home-outline'; // Ícone de casa
            } else if (route.name === 'Perfil') {
              iconName = 'person-outline'; // Ícone de perfil
            } else {
              iconName = 'ellipse-outline'; // fallback
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen
          name="HomeDocuments"
          options={{
            tabBarLabel: 'Home', // Nome exibido
          }}
        />
        <Tabs.Screen
          name="Perfil"
          options={{
            tabBarLabel: 'Perfil',
          }}
        />
      </Tabs>
    </>
  );
}
