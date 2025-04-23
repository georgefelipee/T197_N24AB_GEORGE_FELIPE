import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { View, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  useTheme,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { storage } from "@/firebaseConfig"; // Importando o Firebase Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/firebaseConfig"; // Importando o Firestore
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import Toast from "react-native-toast-message";

export default function DocumentsRegister() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const [hasErrorsStep1, setHasErrorsStep1] = useState(true);

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { colors } = useTheme();

  const onNextStep1 = () => {
    const values = getValues();
    if (
      !values.documentName ||
      !values.documentType ||
      !values.description ||
      !selectedFile
    ) {
      setHasErrorsStep1(true);
    } else {
      setHasErrorsStep1(false);
    }
  };

  const handleSendDocumentes = async () => {
    const { documentName, documentType, description } = getValues();

    try {
      const json = await AsyncStorage.getItem("usuarioLogado");
      const usuario = json ? JSON.parse(json) : null;
      if (!usuario) {
        setHasErrorsStep1(true);
        return;
      }

      if (!selectedFile) {
        setHasErrorsStep1(true);
        return;
      }

      const fileRef = ref(storage, `documents/${selectedFile.name}`);
      const response = await fetch(selectedFile.uri);
      const blob = await response.blob();
      const uploadResult = await uploadBytes(fileRef, blob);

      const fileURL = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, "documents"), {
        name: documentName,
        type: documentType,
        description,
        fileURL,
        userId: usuario.uid,
        createdAt: new Date(),
      });

      reset(); // reseta os valores do react-hook-form
      setSelectedFile(null);

      Toast.show({
        type: "success",
        text1: "Documento enviado com sucesso!",
        position: "top",
      });

      setHasErrorsStep1(false);
      router.push("/home/HomeDocuments");
    } catch (error) {
      console.error("Erro ao registrar o documento:", error);
      setHasErrorsStep1(true);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      console.log("Arquivo selecionado:", file);
      setSelectedFile(file);
    }
  };

  const firstButtonNextDisabled = () => {
    const values = getValues();
    return (
      !values.documentName ||
      !values.documentType ||
      !values.description ||
      !selectedFile
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProgressSteps
        activeStepIconBorderColor={colors.primary}
        activeLabelColor={colors.onSurface}
        activeStepNumColor={colors.onPrimary}
        completedStepIconColor={colors.primary}
        completedLabelColor={colors.onSurfaceVariant}
        completedProgressBarColor={colors.primary}
        activeStepIconColor={colors.primary}
        labelFontSize={13}
        topOffset={0}
        borderWidth={1}
        progressBarColor={colors.outline}
        disabledStepNumColor={colors.outline}
        disabledStepIconColor={colors.surfaceVariant}
        labelColor={colors.outline}
        marginBottom={0}
      >
        <ProgressStep
          label="Detalhes do Documento"
          buttonNextText="Próximo"
          buttonPreviousText="Voltar"
          buttonNextTextColor={colors.onSurface}
          onNext={onNextStep1}
          buttonNextDisabled={firstButtonNextDisabled()}
        >
          <Text style={styles.title}>Descreva os detalhes do documento</Text>

          <Button
            mode="outlined"
            style={styles.uploadButton}
            onPress={pickDocument}
          >
            Selecionar Arquivo
          </Button>

          {selectedFile && (
            <Text style={styles.fileInfo}>
              Arquivo: {selectedFile.name} ({selectedFile.size} bytes)
            </Text>
          )}

          <Controller
            control={control}
            name="documentName"
            rules={{ required: "O nome do documento é obrigatório." }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Nome do documento"
                value={value}
                onChangeText={onChange}
                style={styles.input}
                error={!!errors.documentName}
              />
            )}
          />
          {errors.documentName && (
            <HelperText type="error">
              {typeof errors.documentName?.message === "string"
                ? errors.documentName.message
                : ""}
            </HelperText>
          )}

          <Controller
            control={control}
            name="documentType"
            rules={{ required: "Selecione um tipo de documento." }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione o tipo do documento" value="" />
                  <Picker.Item label="Categoria 1" value="Categoria 1" />
                  <Picker.Item label="Categoria 2" value="Categoria 2" />
                </Picker>
              </View>
            )}
          />
          {errors.documentType && (
            <HelperText type="error">
              {typeof errors.documentType?.message === "string"
                ? errors.documentType.message
                : ""}
            </HelperText>
          )}

          <Controller
            control={control}
            name="description"
            rules={{ required: "A descrição é obrigatória." }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Descrição"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                style={styles.input}
                error={!!errors.description}
              />
            )}
          />
          {errors.description && (
            <HelperText type="error">
              {typeof errors.description?.message === "string"
                ? errors.description.message
                : ""}
            </HelperText>
          )}

          {hasErrorsStep1 && (
            <HelperText type="error">
              Preencha todos os campos obrigatórios e selecione um arquivo.
            </HelperText>
          )}
        </ProgressStep>
        <ProgressStep
          label="Envio do Documento"
          buttonPreviousText="Voltar"
          buttonFinishText="Enviar"
          buttonFillColor="#3498DB"
          buttonNextTextColor="#FFFFFF"
          buttonPreviousTextColor="#C0C0C0"
        >
          <Text variant="headlineMedium" style={styles.title}>
            Confirme os detalhes do documento
          </Text>
          <Button
            mode="contained"
            onPress={handleSendDocumentes}
            style={styles.nextButton}
          >
            Finalizar
          </Button>
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    marginVertical: 20,
    fontSize: 20,
    fontWeight: "medium",
    lineHeight: 32,
    color: "#C0C0C0",
  },
  uploadButton: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  nextButton: {
    marginTop: 16,
  },
  fileInfo: {
    marginBottom: 16,
    fontStyle: "italic",
  },
});
