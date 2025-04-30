import { View } from 'react-native';
import { TextInput, Button, Avatar, IconButton } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { buscarUsuarioPorEmail } from '../services/perfilGetUserEmail'; // A função de buscar no Firebase
import { atualizarUsuarioPorEmail } from '../services/perfilService'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false); // controla o olhinho

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        // Apenas buscar o email do AsyncStorage
        const usuarioString = await AsyncStorage.getItem('usuarioLogado');
        if (usuarioString) {
          const usuario = JSON.parse(usuarioString);
          const usuarioEmail = usuario.email;
          
          console.log('Email encontrado no AsyncStorage:', usuarioEmail);
          setEmail(usuarioEmail); // Definir o email diretamente aqui

          // Buscar os dados completos do usuário no Firebase com base no email
          const usuarioEncontrado = await buscarUsuarioPorEmail(usuarioEmail);

          console.log('Usuário encontrado no Firebase:', usuarioEncontrado);

          if (usuarioEncontrado) {
            setNome(usuarioEncontrado.nome || '');
            setTelefone(usuarioEncontrado.telefone || '');
            setSenha(''); // Limpar o campo senha por segurança
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    carregarDadosUsuario();
  }, []);

  const handleSalvar = async () => {
    try {
      const sucesso = await atualizarUsuarioPorEmail(email, {
        nome,
        telefone,
        senha: senha || undefined, // só envia senha se for preenchida
      });

      if (sucesso) {
        alert('Perfil atualizado com sucesso!');
        setSenha(''); // limpa o campo senha por segurança
      } else {
        alert('Falha ao atualizar perfil.');
      }
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Erro ao salvar alterações.');
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Image 
        size={150}
        source={{ uri: 'https://www.example.com/imagem-do-usuario.jpg' }} // A URL de exemplo
        style={styles.avatar}
      />

      <Button
        mode="contained"
        compact
        style={styles.button}
        onPress={handleSalvar}
      >
        Salvar
      </Button>

      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <View style={styles.senhaContainer}>
        <TextInput
          label="Password"  // Mudado de "Senha" para "Password"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          style={[styles.input, { flex: 1 }]}
        />
        <IconButton
          icon={mostrarSenha ? 'eye-off' : 'eye'}
          onPress={() => setMostrarSenha(!mostrarSenha)}
          style={styles.eyeButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#212121',
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 20,
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
    backgroundColor: '#B0B0B0',
    borderRadius: 8,
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eyeButton: {
    marginLeft: 5,
    backgroundColor: '#424242',
    borderRadius: 50,
  },
});
