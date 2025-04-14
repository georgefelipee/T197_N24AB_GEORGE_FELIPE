
import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput, Button, Text, HelperText, ActivityIndicator } from 'react-native-paper';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {

    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('O email é obrigatório');
      return;
    }

    if (!password) {
      setPasswordError('A senha é obrigatória');
      return;
    }


    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      router.push("/home/HomeDocuments"); 

    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entre com a sua conta</Text>

      <Text style={styles.subtitle}>Insira seu email e sua senha para realizar o login</Text>


      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        error={!!emailError}
        outlineColor="#C0C0C0" 

      />
      <HelperText type="error" visible={!!emailError}>
        {emailError}
      </HelperText>

      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        error={!!passwordError}
        outlineColor="#C0C0C0" 


      />
      <HelperText type="error" visible={!!passwordError}>
        {passwordError}
      </HelperText>
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.button} 
        loading={loading}
        labelStyle={styles.buttonLabel}

      >
        {loading ? <ActivityIndicator color="white" /> : 'Fazer Login'}
      </Button>

      <Text style={styles.registerText}>

        Não tem uma conta ainda? <Text style={styles.link}>Registrar agora</Text>

      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,

    backgroundColor: '#212121',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, // Aumentando o espaço entre o título e o subtítulo
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40, // Aumentando o espaço entre o subtítulo e os campos
    color: '#C0C0C0',
  },
  input: {
    marginBottom: 20, // Aumentando o espaço entre os campos
    backgroundColor: '#212121',
    borderWidth: 1,   // Adicionando borda
    borderColor: '#C0C0C0', // Cor da borda
    borderRadius: 8, // Bordas arredondadas
    paddingHorizontal: 12, // Padding para melhorar a visualização
    paddingVertical: 8,   // Padding para melhorar a visualização
  },
  button: {
    marginTop: 24,  // Aumentando o espaço entre o botão e o campo de senha
    backgroundColor: '#3498DB',
    borderRadius: 8, // Bordas arredondadas no botão
  },
  buttonLabel: {
    color: 'white',  // Cor do texto do botão
  },
  registerText: {
    textAlign: 'center',
    marginTop: 24,  // Aumentando o espaço entre o botão e o texto de registro
    color: '#D11B1B',
  },
  link: {
    color: '#3498DB',

    backgroundColor: 'white',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 12,
  },
  link: {
    color: '#007bff',
  }
});
