import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Card, IconButton, Text } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles';
import { IDocumento, StatusDocumento } from '../interfaces/IDocumento';
import { handleDeleteDocument } from '../services/documentService';
import { Dialog, Portal, Button } from 'react-native-paper';
import WebView from 'react-native-webview';
interface DocumentCardProps {
  item: IDocumento;
  statusColor: (status: keyof typeof StatusDocumento) => string;
}


const DocumentCard: React.FC<DocumentCardProps> = ({ item, statusColor }) => {
 const [expanded, setExpanded] = useState(false);
  const [showPDF, setShowPDF] = useState(false);

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
              <IconButton icon="eye" onPress={() => setShowPDF(true)} />
             <IconButton icon="pencil" onPress={() => {}} />
             <IconButton icon="delete" onPress={showConfirmDialog} />
           </View>
         </View>
       )}
    </Card>
       <Portal>
        <Dialog visible={showPDF} onDismiss={() => setShowPDF(false)} style={{ height: '90%' }}>
          <Dialog.Title>Visualizar PDF</Dialog.Title>
          <Dialog.Content style={{ flex: 1, height: 600 }}>
            <WebView
              originWhitelist={['*']}
              source={{ uri: item.base64! }} // já vem como data:application/pdf;base64,...
              style={{ flex: 1 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPDF(false)}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default DocumentCard;
