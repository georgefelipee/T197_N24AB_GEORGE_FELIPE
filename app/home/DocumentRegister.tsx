import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { storage } from '@/firebaseConfig'; // Importando o Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/firebaseConfig'; // Importando o Firestore
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

export default function DocumentsRegister() {
  const router = useRouter();
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { colors } = useTheme();
  
  const handleNext = async () => {
    if (!documentName || !documentType || !description) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
  
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo.');
      return;
    }
  
    setError('');
  
    try {
      const json = await AsyncStorage.getItem('usuarioLogado');
      const usuario = json ? JSON.parse(json) : null;
      if (!usuario) {
        setError('Usuário não autenticado');
        return;
      }
  
      const fileRef = ref(storage, `documents/${selectedFile.name}`);
      const response = await fetch(selectedFile.uri);
      const blob = await response.blob();
      const uploadResult = await uploadBytes(fileRef, blob);


      const fileURL = await getDownloadURL(uploadResult.ref);
  
      const docRef = await addDoc(collection(db, 'documents'), {
        name: documentName,
        type: documentType,
        description,
        fileURL,
        userId: usuario.uid,
        createdAt: new Date(),
      });
  
      
  
      // Resetar campos
      setDocumentName('');
      setDocumentType('');
      setDescription('');
      setSelectedFile(null);
      router.push('/home/HomeDocuments');
    } catch (error) {
      console.error('Erro ao registrar o documento:', error);
      setError('Erro ao registrar o documento.');
    }
  };
  

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      console.log('Arquivo selecionado:', file);
      setSelectedFile(file);
    }
  };
  
  

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
     
      <Text variant="headlineMedium" style={styles.title}>
        Descreva os detalhes do documento
      </Text>

      <Button mode="outlined" style={styles.uploadButton} onPress={pickDocument}>
        Selecionar Arquivo
      </Button>
      
      {selectedFile && (
        <Text style={styles.fileInfo}>
          Arquivo: {selectedFile.name} ({selectedFile.size} bytes)
        </Text>
      )}

      <TextInput
        label="Nome do documento"
        value={documentName}
        onChangeText={setDocumentName}
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={documentType}
          onValueChange={(itemValue) => setDocumentType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o tipo do documento" value="" />
          <Picker.Item label="Categoria 1" value="Categoria 1" />
          <Picker.Item label="Categoria 2" value="Categoria 2" />
        </Picker>
      </View>

      <TextInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {error ? <HelperText type="error">{error}</HelperText> : null}

      <Button mode="contained" onPress={handleNext} style={styles.nextButton}>
        Próximo
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
  },
  uploadButton: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  nextButton: {
    marginTop: 16,
  },
  fileInfo: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
});
