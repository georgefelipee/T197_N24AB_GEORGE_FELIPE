import { View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button, Text, useTheme, Checkbox, IconButton, Avatar, Card } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles';

interface Documento {
  id: string;
  nome: string;
  status: 'APROVADO' | 'AGUARDANDO' | 'REPROVADO';
  tipoDocumento: string;
  descricao: string;
}

// Documentos simulados por enquanto
const documentosMock: Documento[] = [
  { id: '1', nome: 'Documento 1', status: 'AGUARDANDO', tipoDocumento: 'RG', descricao: 'Precisa assinar.' },
  { id: '2', nome: 'Documento 2', status: 'APROVADO', tipoDocumento: 'CPF', descricao: 'Ok.' },
  { id: '3', nome: 'Documento 3', status: 'REPROVADO', tipoDocumento: 'CNH', descricao: 'Documento vencido.' },
];

export default function HomeDocuments() {
  const [search, setSearch] = useState('');
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [checkedAprovado, setCheckedAprovado] = useState(false);
  const [checkedAguardando, setCheckedAguardando] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { colors } = useTheme();

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'APROVADO': return 'green';
      case 'AGUARDANDO': return 'orange';
      case 'REPROVADO': return 'red';
      default: return '#FFF'; // Fallback
    }
  };

  const documentosFiltrados = documentosMock.filter(doc => {
    const matchesSearch = doc.nome.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      (checkedAprovado && doc.status === 'APROVADO') ||
      (checkedAguardando && doc.status === 'AGUARDANDO') ||
      (!checkedAprovado && !checkedAguardando); // Se nenhum filtro marcado, mostra todos
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
      />
    </View>
  );
}
