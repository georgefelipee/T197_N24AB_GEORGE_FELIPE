import { FlatList, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput, Button, Text, useTheme, Checkbox } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles';
import { getAllDocumentsByEmail } from '../services/documentService';
import { IDocumento, StatusDocumento } from '../interfaces/IDocumento';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentCard from '../components/DocumentCard';
import GlobalFAB from '../components/GlobalFAB';


export default function HomeDocuments() {
  const [search, setSearch] = useState('');
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const { colors } = useTheme();


  const [checkedAprovado, setCheckedAprovado] = useState(false);
  const [checkedAguardando, setCheckedAguardando] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<IDocumento[]>([]);

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
    <DocumentCard item={item} statusColor={statusColor} callGetDocuments={() => {
        AsyncStorage.getItem('usuarioLogado').then((value) => {
      if (value) {
        const usuario = JSON.parse(value);
        const usuarioEmail = usuario.email;
        buscarDocumentos(usuarioEmail); // Chamar a função para buscar documentos
      }})
    }} />
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
        <View style={{ backgroundColor: 'rgba(44, 44, 44, 1)', marginTop: 16, padding: 10, borderRadius: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Checkbox
              status={checkedAprovado ? 'checked' : 'unchecked'}
              onPress={() => setCheckedAprovado(!checkedAprovado)}
            />
            <Text style={{ fontSize: 14 }}>Documento Aprovado</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Checkbox
              status={checkedAguardando ? 'checked' : 'unchecked'}
              onPress={() => setCheckedAguardando(!checkedAguardando)}
            />
            <Text style={{ fontSize: 14 }}>Documento Pendente</Text>
          </View>
        </View>
      )}

      <FlatList
        style={{marginTop: 16}}
        data={documentosFiltrados}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum documento encontrado.</Text>}
      />
      
            <GlobalFAB /> {/* Adiciona o FAB global */}      
    </View>
  );
}
