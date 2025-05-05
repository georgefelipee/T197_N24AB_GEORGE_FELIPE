import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Avatar, Card, IconButton, Text } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles';
import { IDocumento, StatusDocumento } from '../interfaces/IDocumento';

interface DocumentCardProps {
  item: IDocumento;
  statusColor: (status: keyof typeof StatusDocumento) => string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ item, statusColor }) => {
 const [expanded, setExpanded] = useState(false);
  return (
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
             <IconButton icon="pencil" onPress={() => {}} />
             <IconButton icon="delete" onPress={() => {}} />
           </View>
         </View>
       )}
    </Card>
  );
};

export default DocumentCard;
