import { View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, Button, Text, useTheme, Checkbox, IconButton, Avatar, Card } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles';
import { getAllDocumentsByEmail } from '../services/documentService';
import { getAuth, onAuthStateChanged } from "firebase/auth";


interface Documento {
  id: string;
  nome: string;
  status: 'APROVADO' | 'AGUARDANDO' | 'REPROVADO';
  tipoDocumento: string;
  descricao: string;
}

export default function HomeDocuments() {
  const [search, setSearch] = useState('');
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [checkedAprovado, setCheckedAprovado] = useState(false);
  const [checkedAguardando, setCheckedAguardando] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const { colors } = useTheme();

  const buscarDocumentos = async (email: string) => {
    try {
      const docs = await getAllDocumentsByEmail(email);
      const mappedDocs: Documento[] = docs.map(doc => ({
        id: doc.id,
        nome: doc.nome,
        status: doc.status,
        tipoDocumento: doc.categoria,
        descricao: doc.descriçao
      }));
      setDocumentos(mappedDocs);
      console.log("Documentos atualizados:", mappedDocs);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        console.log("Usuário logado:", user.email);
        setUserEmail(user.email);
        buscarDocumentos(user.email); // já busca os documentos com o email
      } else {
        console.log("Nenhum usuário autenticado.");
        setUserEmail(null);
      }
    });
  
    return () => unsubscribe(); // limpa o listener
  }, []);

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'APROVADO': return 'green';
      case 'AGUARDANDO': return 'orange';
      case 'REPROVADO': return 'red';
      default: return '#FFF';
    }
  };

  const documentosFiltrados = documentos.filter(doc => {
    const matchesSearch = doc.nome.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      (checkedAprovado && doc.status === 'APROVADO') ||
      (checkedAguardando && doc.status === 'AGUARDANDO') ||
      (!checkedAprovado && !checkedAguardando);
    return matchesSearch && matchesStatus;
  });

  const renderItem = ({ item }: { item: Documento }) => (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => handleExpand(item.id)}>
        <View style={styles.row}>
          <Avatar.Icon size={40} icon="file-document" style={{ backgroundColor: 'transparent' }} />
          <View style={styles.info}>
            <Text style={styles.nomeDocumento}>{item.nome}</Text>
            <Text style={{ color: statusColor(item.status) }}>{item.status}</Text>
          </View>
          <IconButton icon={expandedId === item.id ? 'chevron-up' : 'chevron-down'} size={24} />
        </View>
      </TouchableOpacity>
      {expandedId === item.id && (
        <View style={styles.expandido}>
          <Text>Status: <Text style={{ color: statusColor(item.status) }}>{item.status}</Text></Text>
          <Text>Tipo de Documento: {item.tipoDocumento}</Text>
          <Text>Descrição: {item.descricao}</Text>
          <View style={styles.actions}>
            <IconButton icon="pencil" onPress={() => {}} />
            <IconButton icon="delete" onPress={() => {}} />
          </View>
        </View>
      )}
    </Card>
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum documento encontrado.</Text>}
      />
    </View>
  );
}
