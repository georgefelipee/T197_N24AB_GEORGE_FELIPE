import { View } from 'react-native';
import { TextInput, Button, Avatar, IconButton } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { buscarUsuarioPorEmail } from '../services/perfilGetUserEmail'; // A função de buscar no Firebase
import { atualizarUsuarioPorEmail } from '../services/perfilService'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Usuario } from '../services/perfilService';

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
            setSenha(usuarioEncontrado.senha || '');

          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    carregarDadosUsuario();
  }, []);

  const atualizarCampo = async (campo: keyof Usuario, valor: string) => {
    try {
      const sucesso = await atualizarUsuarioPorEmail(email, {
        [campo]: valor,
      });
  
      if (sucesso) {
        alert(`${campo} atualizado com sucesso!`);
      } else {
        alert(`Falha ao atualizar ${campo}.`);
      }
    } catch (error) {
      console.error(`Erro ao atualizar ${campo}:`, error);
      alert('Erro ao salvar alterações.');
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Foto do usuário - circulo */}
      <Avatar.Icon
        size={150}
        icon="account" // Caminho da imagem do usuário
        style={styles.avatar}
      />

      <View style={styles.inputRow}>
        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={() => atualizarCampo('nome', nome)}
          style={styles.button}
        >
          Editar
        </Button>
      </View>


      <View style={styles.inputRow}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <Button
          mode="contained"
          compact
          style={styles.button}
          onPress={() => atualizarCampo('email', email)}
        >
          Editar
        </Button>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
          style={[styles.input, { flex: 1 }]}
        />
        <Button
          mode="contained"
          compact
          style={styles.button}
          onPress={() => atualizarCampo('telefone', telefone)}
        >
          Editar
        </Button>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          label="Password"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          style={[styles.input, { flex: 1 }]}
          right={
            <TextInput.Icon
              icon={mostrarSenha ? 'eye-off' : 'eye'}
              onPress={() => setMostrarSenha(!mostrarSenha)}
              forceTextInputFocus={false}
            />
          }
        />
        <Button
          mode="contained"
          compact
          style={styles.button}
          onPress={() => atualizarCampo('senha', senha)}
        >
          Editar
        </Button>
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
    backgroundColor: '#B0B0B0'
  },
  input: {
    flex: 1,
    backgroundColor: '#212121',
    borderWidth: 0.5,
    borderColor: '#C0C0C0',
    borderRadius: 8,
    marginRight: 8,
    color: '#fff',
    height: 50, // altura fixa
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  button: {
    backgroundColor: '#B0B0B0',
    borderRadius: 8,
    height: 50, // mesma altura do input
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});
