import React, { useState } from 'react';
import { Dialog, Portal, Button, TextInput, useTheme, Modal } from 'react-native-paper';

import { View, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Card, IconButton, Text } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles';
import { IDocumento, StatusDocumento } from '../interfaces/IDocumento';
import { handleDeleteDocument } from '../services/documentService';

interface DocumentCardProps {
  item: IDocumento;
  statusColor: (status: keyof typeof StatusDocumento) => string;
}


const DocumentCard: React.FC<DocumentCardProps> = ({ item, statusColor }) => {
   const theme = useTheme();
  
 const [expanded, setExpanded] = useState(false);
 const [editVisible, setEditVisible] = useState(false);
const [nome, setNome] = useState(item.nome);
const [descricao, setDescricao] = useState(item.descricao || '');
const [categoria, setCategoria] = useState(item.categoria || '');

 const deletarDocumento = async () => {
  await handleDeleteDocument(item.id!);
}


 const showConfirmDialog = () => {
    return Alert.alert(
      "Confirmar Exclusão",
      "Você deseja excluir esse documento ?",
      [
        {
          text: "Excluir",
          onPress: () => {
            deletarDocumento();
          },
        },
    
        {
          text: "Voltar",
        },
      ]
    );
  };
  const handleSaveEdit = () => {
  // Aqui você pode chamar seu serviço para salvar
  console.log("Salvar:", { id: item.id, nome, descricao, categoria });
  setEditVisible(false);
};

  return (
    <>
    <Card style={styles.card}>
      <TouchableOpacity>
        <View style={styles.row}>
          <Avatar.Icon size={40} icon="file-document" style={{ backgroundColor: 'transparent' }} />
          <View style={styles.info}>
            <Text style={styles.nomeDocumento}>{item.nome}</Text>
            {!expanded && (<Text style={{ color: statusColor(item.status as keyof typeof StatusDocumento) }}>{item.status}</Text>)}
            
          </View>
          <IconButton onPress={() => setExpanded(!expanded)} icon={expanded  ? 'chevron-up' : 'chevron-down'} size={24} />
        </View>
      </TouchableOpacity>
      {expanded  && (
         <View style={styles.expandido}>
           <Text>Status: <Text style={{ color: statusColor(item.status as keyof typeof StatusDocumento) }}>{item.status}</Text></Text>
           <Text>Tipo de Documento: {item.categoria}</Text>
           <Text>Descrição: {item.descricao}</Text>
           <View style={styles.actions}>
             <IconButton icon="pencil" onPress={() => setEditVisible(true)} />
             <IconButton icon="delete" onPress={showConfirmDialog} />
           </View>
         </View>
       )}
    </Card>
<Portal>
  <Modal
    visible={editVisible}
    onDismiss={() => setEditVisible(false)}
    contentContainerStyle={{
      backgroundColor: '#1e1e1e',
      padding: 20,
      margin: 20,
      borderRadius: 16,
    }}
  >
    <Text style={{ color: '#fff', fontSize: 18, marginBottom: 16, fontWeight: 'bold' }}>
      Editar Documento
    </Text>

    <TextInput
      label="Nome"
      value={nome}
      onChangeText={setNome}
      mode="outlined"
      style={{ marginBottom: 12 }}
      textColor="#fff"
      outlineColor="#555"
      activeOutlineColor="#08A698"
      theme={{ colors: { text: '#fff', placeholder: '#aaa' } }}
    />

    <TextInput
      label="Descrição"
      value={descricao}
      onChangeText={setDescricao}
      mode="outlined"
      style={{ marginBottom: 12 }}
      textColor="#fff"
      outlineColor="#555"
      activeOutlineColor="#08A698"
      theme={{ colors: { text: '#fff', placeholder: '#aaa' } }}
    />

    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <Button onPress={() => setEditVisible(false)} textColor="#aaa">
        Cancelar
      </Button>
      <Button onPress={handleSaveEdit} textColor="#08A698">
        Salvar
      </Button>
    </View>
  </Modal>
</Portal>


    </>
  );
};

export default DocumentCard;
