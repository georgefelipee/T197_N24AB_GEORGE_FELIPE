import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import {db} from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

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

  const cadstrarUsusario = async () =>{

    try{
      await addDoc(collection(db,'usuarios'),{
        nome,
        email,
        telefone,
        senha

      });
      router.push('/'); // Volta para a tela inicial após cadastro
    }catch(error){
      console.error("Erro ao cadastrar usuário no Firebase:", error);
    }
  };

  const handleCadastro = async () => {
    if (!validar()) return;
  
    try {
      await cadstrarUsusario();
      alert("Usuário cadastrado com sucesso!");
      // ou Toast.show({ type: 'success', text1: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      alert("Erro ao cadastrar. Tente novamente.   ");
    }
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
        style={styles.input}
        error={!!erros.senha}
      />
      <HelperText type="error" visible={!!erros.senha}>{erros.senha}</HelperText>

      <TextInput
        label="Confirmar Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        style={styles.input}
        error={!!erros.confirmarSenha}
      />
      <HelperText type="error" visible={!!erros.confirmarSenha}>{erros.confirmarSenha}</HelperText>

      <Button mode="contained" onPress={handleCadastro} style={styles.button}>
        Cadastrar
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
