import React, { useState } from 'react';
import { Dialog, Portal, Button, TextInput, useTheme, Modal } from 'react-native-paper';

import { View, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Card, IconButton, Text } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles';
import { IDocumento, StatusDocumento, TipoDocumento } from '../interfaces/IDocumento';
import { handleDeleteDocument, updateDocument } from '../services/documentService';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

interface DocumentCardProps {
  item: IDocumento;
  statusColor: (status: keyof typeof StatusDocumento) => string;
  callGetDocuments: () => void;
}


const DocumentCard: React.FC<DocumentCardProps> = ({ item, statusColor, callGetDocuments }) => {
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
  updateDocument(item.id!, nome, descricao, categoria);
  Toast.show({
    type: 'success',
    text1: 'Documento atualizado com sucesso!',
    position: 'bottom',
    visibilityTime: 2000,
  });
  callGetDocuments();
  setEditVisible(false);
};
 const documentTypes = TipoDocumento.tipoDocumentoValues || [];

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

    <Text style={{ color: '#fff', marginBottom: 8 }}>Tipo de Documento</Text>
       <Picker
                selectedValue={categoria}
                onValueChange={setCategoria}
                style={{
                  height: 50,
                  width: '100%',
                  backgroundColor: '#1e1e1e',
                  color: '#fff',
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <Picker.Item label="Selecione um tipo" value="" />
                {documentTypes.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>

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
