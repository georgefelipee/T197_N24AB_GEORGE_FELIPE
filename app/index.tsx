import { View, Text, Button } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

export default function login() {
    const router = useRouter();

  return (
    <View>
      <Button title='Fazer login'         
      onPress={() => router.push("/home/HomeDocuments")} // Navega para a tela "home"
 ></Button>
    </View>
  )
}