import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import { buscarUsuarioPorEmail } from '../services/perfilGetUserEmail';
import { atualizarUsuarioPorEmail } from '../services/perfilService'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Usuario } from '../services/perfilService';

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        setLoading(true);
        const usuarioString = await AsyncStorage.getItem('usuarioLogado');
        if (usuarioString) {
          const usuario = JSON.parse(usuarioString);
          const usuarioEmail = usuario.email;
          
          console.log('Email encontrado no AsyncStorage:', usuarioEmail);
          setEmail(usuarioEmail);

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
      } finally {
        setLoading(false);
      }
    };

    carregarDadosUsuario();
  }, []);

  const atualizarCampo = async (campo: keyof Usuario, valor: string) => {
    if (!email) {
      alert('Email não encontrado. Não é possível atualizar.');
      return;
    }

    try {
      setLoading(true);
      const sucesso = await atualizarUsuarioPorEmail(email, {
        [campo]: valor,
      });
  
      if (sucesso) {
        alert(`${campo} atualizado com sucesso!`);
        
        // Atualizar AsyncStorage se for o email que foi alterado
        if (campo === 'email') {
          const usuarioString = await AsyncStorage.getItem('usuarioLogado');
          if (usuarioString) {
            const usuario = JSON.parse(usuarioString);
            usuario.email = valor;
            await AsyncStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          }
        }
      } else {
        alert(`Falha ao atualizar ${campo}.`);
      }
    } catch (error) {
      console.error(`Erro ao atualizar ${campo}:`, error);
      alert('Erro ao salvar alterações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon
        size={150}
        icon="account"
        style={styles.avatar}
      />

      <View style={styles.inputRow}>
        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          mode="outlined"
          disabled={loading}
          
        />
        <Button
          mode="contained"
          onPress={() => atualizarCampo('nome', nome)}
          style={styles.button}
          loading={loading}
          disabled={loading}
          compact 
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
          mode="outlined"
          disabled={loading}
        />
        <Button
          mode="contained"
          compact
          style={styles.button}
          onPress={() => atualizarCampo('email', email)}
          loading={loading}
          disabled={loading}
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
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />
        <Button
          mode="contained"
          compact
          style={styles.button}
          onPress={() => atualizarCampo('telefone', telefone)}
          loading={loading}
          disabled={loading}
        >
          Editar
        </Button>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          style={styles.input}
          mode="outlined"
          disabled={loading}
          right={
            <TextInput.Icon
              icon={mostrarSenha ? 'eye-off' : 'eye'}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            />
          }
        />
        <Button
          mode="contained"
          compact
          style={styles.button}
          onPress={() => atualizarCampo('senha', senha)}
          loading={loading}
          disabled={loading}
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
    flex: 4, // Maior proporção para o input
    backgroundColor: '#212121',
    color: '#fff',
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#B0B0B0',
    borderRadius: 8,
    height: 56, // Mesma altura do TextInput
    width: 80, // Largura fixa para o botão
    justifyContent: 'center',
  },
  buttonContent: {
    height: '100%', // Garante que o conteúdo ocupe toda a altura
  },
  buttonLabel: {
    fontSize: 14, // Tamanho adequado para o texto
  },
});