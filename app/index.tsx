// import { View, StyleSheet  } from 'react-native'
// import React from 'react'
// import { useRouter } from 'expo-router';
// import { TextInput, Button, Text, HelperText, ActivityIndicator } from 'react-native-paper';

// export default function login() {
//     const router = useRouter();

//   return (
//     <View>
//       <Button title='Fazer login'         
//       onPress={() => router.push("/home/HomeDocuments")} // Navega para a tela "home"
//  ></Button>
//     </View>
//   )
// }

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
    // Validação simples de campos
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

    // Simulando a chamada de autenticação
    setLoading(true);
    
    setTimeout(() => {
      // Simulando sucesso no login (aqui você faria a autenticação real)
      setLoading(false);
      router.push("/home/HomeDocuments"); // Navega para a tela "home" após login
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        error={!!emailError}
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
      />
      <HelperText type="error" visible={!!passwordError}>
        {passwordError}
      </HelperText>

      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.button} 
        loading={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : 'Fazer Login'}
      </Button>

      <Text style={styles.registerText}>
        Não tem uma conta? <Text style={styles.link}>Cadastre-se</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
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
