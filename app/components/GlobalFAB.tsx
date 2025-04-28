import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { useRouter, usePathname } from "expo-router";

export default function GlobalFAB() {
  const router = useRouter();
  const pathname = usePathname(); // Obtém a rota atual

  const handlePress = () => {
    router.push("/home/DocumentRegister"); // Navega para a tela desejada
  };

  // Oculta o FAB se estiver na rota '/home/DocumentRegister'
  if (pathname === "/home/DocumentRegister") {
    return null;
  }

  return (
    <View style={styles.fabContainer}>
      <FAB icon="plus" style={styles.fab} onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    right: 16,
  },
  fab: {
    backgroundColor: '#3498DB',
  },
});