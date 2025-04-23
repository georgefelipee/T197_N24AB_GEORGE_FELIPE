import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { verificarEmailJaCadastrado } from './services/authService'; 

export default function Register() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erros, setErros] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });

  const validar = () => {
    const novosErros: any = {};

    if (!nome) novosErros.nome = 'O nome é obrigatório';
    if (!email) novosErros.email = 'O email é obrigatório';
    if (!telefone) novosErros.telefone = 'O telefone é obrigatório';
    if (!senha) novosErros.senha = 'A senha é obrigatória';
    if (!confirmarSenha) {
      novosErros.confirmarSenha = 'Confirme a senha';
    } else if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const cadastrarUsuario = async () => {
    try {
      await addDoc(collection(db, 'usuarios'), {
        nome,
        email,
        telefone,
        senha,
      });
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Usuário cadastrado com sucesso.',
      });
      router.push('/');
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: error.message || 'Tente novamente.',
      });
    }
  };

  const handleCadastro = async () => {
    if (!validar()) return;

    const emailExiste = await verificarEmailJaCadastrado(email);
    if (emailExiste) {
      setErros((prevErros) => ({
        ...prevErros,
        email: 'Este e-mail já está cadastrado',
      }));

      Toast.show({
        type: 'error',
        text1: 'Cadastro falhou',
        text2: 'Este e-mail já está cadastrado.',
      });

      return;
    }

    await cadastrarUsuario();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <Text style={styles.subtitle}>Crie a sua conta e continue</Text>

      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        error={!!erros.nome}
      />
      <HelperText type="error" visible={!!erros.nome}>{erros.nome}</HelperText>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        error={!!erros.email}
      />
      <HelperText type="error" visible={!!erros.email}>{erros.email}</HelperText>

      <TextInput
        label="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
        style={styles.input}
        error={!!erros.telefone}
      />
      <HelperText type="error" visible={!!erros.telefone}>{erros.telefone}</HelperText>

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCorrect={false}
        style={styles.input}
        error={!!erros.senha}
      />
      <HelperText type="error" visible={!!erros.senha}>{erros.senha}</HelperText>

      <TextInput
        label="Confirmar Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        autoCorrect={false}
        style={styles.input}
        error={!!erros.confirmarSenha}
      />
      <HelperText type="error" visible={!!erros.confirmarSenha}>{erros.confirmarSenha}</HelperText>

      <Button mode="contained" onPress={handleCadastro} style={styles.button}>
        Criar Conta
      </Button>

      <View style={styles.footer}>
        <Text>
          Já tem uma conta?{' '}
          <Text style={styles.link} onPress={() => router.push('/')}>
            Entrar
          </Text>
        </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#C0C0C0',
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
    backgroundColor: '#3498DB',
    borderRadius: 8,
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
