import { View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, Button, Text, useTheme, Checkbox, IconButton, Avatar, Card } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles';
import { getAllDocumentsByEmail } from '../services/documentService';
import { IDocumento, StatusDocumento } from '../interfaces/IDocumento';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentCard from '../components/DocumentCard';


export default function HomeDocuments() {
  const [search, setSearch] = useState('');
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [checkedAprovado, setCheckedAprovado] = useState(false);
  const [checkedAguardando, setCheckedAguardando] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<IDocumento[]>([]);
  const { colors } = useTheme();

  const buscarDocumentos = async (email: string) => {
    try {
      const docs = await getAllDocumentsByEmail(email);
      
      setDocumentos(docs);
      console.log("Documentos atualizados:", docs);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  useEffect(() => {
     AsyncStorage.getItem('usuarioLogado').then((value) => {
      if (value) {
        const usuario = JSON.parse(value);
        const usuarioEmail = usuario.email;
        buscarDocumentos(usuarioEmail); // Chamar a função para buscar documentos
      } else {
        console.log('Nenhum usuário logado encontrado no AsyncStorage.');
      }
    })

  }, []);


  const statusColor = (status: keyof typeof StatusDocumento) => {
    switch (status) {
      case  'APROVADO': return 'green';
      case  'AGUARDANDO': return 'orange';
      case 'REPROVADO': return 'red';
      default: return '#FFF';
    }
  };

  const documentosFiltrados = documentos.filter(doc => {
    const matchesSearch = doc.nome.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      (checkedAprovado && doc.status! === 'APROVADO') ||
      (checkedAguardando && doc.status === 'AGUARDANDO') ||
      (!checkedAprovado && !checkedAguardando);
    return matchesSearch && matchesStatus;
  });

  const renderItem = ({ item }: { item: IDocumento }) => (
    <DocumentCard item={item} statusColor={statusColor} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.title}>Seus Documentos</Text>

      <View style={styles.inputRow}>
        <TextInput
          label="Procurar Documentos"
          value={search}
          onChangeText={setSearch}
          style={styles.textInput}
        />
        <Button
          mode="contained"
          onPress={() => setShowStatusOptions(!showStatusOptions)}
          compact
        >
          Status
        </Button>
      </View>

      {showStatusOptions && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Checkbox
              status={checkedAprovado ? 'checked' : 'unchecked'}
              onPress={() => setCheckedAprovado(!checkedAprovado)}
            />
            <Text style={styles.filterText}>Documento Aprovado</Text>
          </View>

          <View style={styles.filterRow}>
            <Checkbox
              status={checkedAguardando ? 'checked' : 'unchecked'}
              onPress={() => setCheckedAguardando(!checkedAguardando)}
            />
            <Text style={styles.filterText}>Documento Aguardando</Text>
          </View>

          <Button mode="outlined" compact onPress={() => {}}>
            Aplicar
          </Button>
        </View>
      )}

      <FlatList
        data={documentosFiltrados}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum documento encontrado.</Text>}
      />
    </View>
  );
}
