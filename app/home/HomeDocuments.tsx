import { View } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles'

export default function HomeDocuments() {
  const [Search, setSearch] = useState('');
   const { colors } = useTheme();

  return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.title}>Seus Documentos</Text>

      <View style={styles.inputRow}>
        <TextInput
          label="Procurar Documentos"
          value={Search}
          onChangeText={setSearch}
          style={styles.textInput}
        />
        <Button mode="contained" onPress={() => console.log('Pressed')}>
          Status
        </Button>
      </View>
    </View>
  );
}
