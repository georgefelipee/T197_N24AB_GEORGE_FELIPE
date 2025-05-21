import React, { useState } from 'react';
import { Dialog, Portal, Button, TextInput } from 'react-native-paper';

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
  <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
    <Dialog.Title>Editar Documento</Dialog.Title>
    <Dialog.Content>
      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={{ marginBottom: 10 }}
      />
     
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={() => setEditVisible(false)}>Cancelar</Button>
      <Button onPress={handleSaveEdit}>Salvar</Button>
    </Dialog.Actions>
  </Dialog>
</Portal>

    </>
  );
};

export default DocumentCard;
