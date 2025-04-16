import { View } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button, Text, useTheme, Checkbox } from 'react-native-paper';
import styles from '../style/HomeDocumentsStyles';

export default function HomeDocuments() {
  const [search, setSearch] = useState('');
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const { colors } = useTheme();

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
              status={checked1 ? 'checked' : 'unchecked'}
              onPress={() => setChecked1(!checked1)}
            />
            <Text style={{ fontSize: 14 }}>Documento Aprovado</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Checkbox
              status={checked2 ? 'checked' : 'unchecked'}
              onPress={() => setChecked2(!checked2)}
            />
            <Text style={{ fontSize: 14 }}>Documento Pendente</Text>
          </View>

          <Button mode="outlined" compact onPress={() => console.log('Filtrar')}>
            Filtrar
          </Button>
        </View>
      )}
    </View>
  );
}
