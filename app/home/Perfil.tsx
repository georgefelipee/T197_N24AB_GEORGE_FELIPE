import { View, Image } from 'react-native';
import { TextInput, Button, Text, HelperText, ActivityIndicator, useTheme, Avatar } from 'react-native-paper';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function Perfil() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      
      {/* Foto do usuário - circulo */}
      <Avatar.Image 
        size={150}
        source={{ uri: 'https://www.example.com/imagem-do-usuario.jpg' }} // Caminho da imagem do usuário
        style={styles.avatar}
      />

      {/* Botão Editar alinhado à direita e com fundo cinza */}
      <Button
        mode="contained"
        compact
        style={styles.button}
      >
        Editar
      </Button>

      {/* Campos de entrada */}
      <TextInput
        label="Nome"
        style={styles.input}
      />
      <TextInput
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        disabled
      />
      <TextInput
        label="Telefone"
        keyboardType="phone-pad"
        style={styles.input}
        disabled
      />
      <TextInput
        label="Senha"
        secureTextEntry
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#212121', // Alteração do fundo para cinza
  },
  avatar: {
    alignSelf: 'center', // Centraliza a foto do usuário
    marginBottom: 20, // Espaçamento abaixo da foto
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#212121',
    borderWidth: 0.5,
    borderColor: '#C0C0C0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 1,
    color: '#fff',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#B0B0B0', // Mudança do fundo para cinza
    borderRadius: 8,
    alignSelf: 'flex-end', // Alinha o botão à direita
    paddingHorizontal: 16, // Ajusta o padding do botão
  },
  buttonLabel: {
    color: 'white',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  link: {
    color: '#3498DB',
    fontWeight: 'bold',
  },
});
