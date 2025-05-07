import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from '@react-navigation/native'; 
import { View, StyleSheet, FlatList } from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  useTheme,
  IconButton,
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

import { IDocumento } from "../interfaces/IDocumento";

import { TipoDocumento } from "../interfaces/IDocumento";

// Tipagem do ref
interface ProgressStepsWithRefProps {
  // Definindo que o ref será do tipo ProgressSteps
  goBack?: () => void;
}

export default function DocumentsRegister() {
  const navigation = useNavigation();
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
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(0); 
  const { colors } = useTheme();

  const documentTypes = TipoDocumento.tipoDocumentoValues || [];

  const handleGoBack = () => {
    // const activeStepNum = activeStep - 1 < 0 ? 0 :  activeStep 
      setActiveStep(0);
      reset()
      setSelectedFile(null)
    
  };

  const onNextStep1 = async () => {
    const values = getValues();
    if (
      !values.documentName ||
      !values.documentType ||
      !values.description ||
      !selectedFile 
    ) 
    {
      setHasErrorsStep1(true);
    } else {
      setHasErrorsStep1(false);
      setActiveStep(1)


      // const fileUri = selectedFile.uri;
      // const responseBlob = await fetch(fileUri)
      // const blob = await responseBlob.blob()
    
      const documents = {
        name: values.documentName,
        type: values.documentType,
        description: values.description,
        size:(selectedFile.size).toFixed(2)
        // blob: blob
      };

      setSelectedFiles([...selectedFiles, documents]);
    }
  };
  console.log(selectedFile)

  const handleSendDocumentes = async () => {
    const { documentName, documentType, description } = getValues();
  
    try {
      const json = await AsyncStorage.getItem("usuarioLogado");
      const usuario = json ? JSON.parse(json) : null;
  
      if (!usuario) {
        console.error("Usuário não encontrado no AsyncStorage!");
        return;
      }
  
      if (!selectedFiles || selectedFiles.length === 0) {
        console.error("Nenhum arquivo selecionado!");
        return;
      }
  
      // Enviar todos os documentos
      for (const file of selectedFiles) {
        const response = await fetch(file.uri);
        const blob = await response.blob();
  
        // debugger
        await new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64String = reader.result;
  
              const documentoData: IDocumento = {
                nome: file.name,
                categoria: file.type,
                descricao: file.description,
                userEmail: usuario.email
                // blob: file.blob
              };
  
              await addDoc(collection(db, "documents"), {
                ...documentoData,
                status: "AGUARDANDO",
                createdAt: new Date(),
              });
  
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
  
      reset();
      setSelectedFiles([]); // limpar todos os arquivos
  
      Toast.show({
        type: "success",
        text1: "Todos os documentos foram enviados com sucesso!",
        position: "top",
      });
  
      setHasErrorsStep1(false);
      router.push("/home/HomeDocuments");
    } catch (error) {
      console.error("Erro ao registrar documentos:", error);
      setHasErrorsStep1(true);
    }
  };
  
  

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setSelectedFiles(prev => [...prev, file]);
    }
  };

  const removeDocument = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
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
      <View style={styles.header}>
        <IconButton 
          icon="arrow-left"
          onPress={() => router.push('/home/HomeDocuments')}
          size={24}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Cadastro de Documentos</Text>
      </View>
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
        activeStep={activeStep}
      >
        <ProgressStep
          label="Detalhes do Documento"
          buttonFillColor="#3498DB"
          buttonNextText="Próximo"
          buttonPreviousText="Voltar"
          buttonNextTextColor={colors.onSurface}
          onNext={onNextStep1}
          buttonNextDisabled={firstButtonNextDisabled()}
        >
          <Controller
            control={control}
            name="selectedFile"
            rules={{ required: "O arquivo é obrigatório." }}
            render={({ field: { onChange } }) => (
              <>
                <Text style={styles.title}>
                  Descreva os detalhes do documento
                </Text>
                <Button
                  mode="outlined"
                  style={styles.uploadButton}
                  onPress={async () => {
                    const result = await DocumentPicker.getDocumentAsync({});
                    if (
                      !result.canceled &&
                      result.assets &&
                      result.assets.length > 0
                    ) {
                      const file = result.assets[0];
                      console.log("Arquivo selecionado:", file);
                      setSelectedFile(file); // Atualiza o estado local
                      onChange(file); // Atualiza o estado do React Hook Form
                    }
                  }}
                >
                  Selecionar Arquivo
                </Button>

                {selectedFile && (
                  <Text style={styles.fileInfo}>
                    Arquivo: {selectedFile.name} ({(selectedFile.size / 1048576).toFixed(2)} MB)
                  </Text>
                )}

                {errors.selectedFile && (
                  <HelperText type="error">
                    {typeof errors.selectedFile?.message === "string"
                      ? errors.selectedFile.message
                      : ""}
                  </HelperText>
                )}
              </>
            )}
          />

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
                <Picker.Item label="Selecione um tipo" value="" />
                {documentTypes.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
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
        </ProgressStep>
        <ProgressStep
          label="Envio do Documento"
          buttonPreviousText="Voltar"
          buttonFinishText="Enviar"
          buttonFillColor="#3498DB"
          buttonNextTextColor="#FFFFFF"
          buttonPreviousTextColor="#C0C0C0"
          onSubmit={handleSendDocumentes}
        >
          <Text variant="headlineMedium" style={styles.title}>
            Confirme os detalhes do documento
          </Text>

          {/* Exibindo a lista de documentos selecionados */}
          {selectedFiles.length > 0 ? (
            <FlatList
              data={selectedFiles}
              renderItem={({ item, index }) => (
                <View style={styles.card}>
                    <View style={styles.fileInfoContainer}>
                      <Text style={styles.fileName}>{item.name}</Text>
                      <Text style={styles.fileSize}>({(item.size / 1048576).toFixed(2)} MB)</Text>
                    </View>
                  <View style={styles.iconContainer}>
                    <IconButton
                      icon="trash-can"
                      onPress={() => removeDocument(index)}
                      size={20}
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text style={styles.noDocumentsText}>Nenhum documento selecionado.</Text>
          )}

          {/* Botão para adicionar mais documentos */}
          <Button mode="outlined" onPress={handleGoBack} style={styles.uploadButton2}>
            Adicionar mais documentos
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
  card: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  fileInfoContainer: {
    flexDirection: "row", 
    alignItems: "center", 
  },
  fileName: {
    fontWeight: "bold", 
    marginRight: 8,
  },
  fileSize: {
    fontStyle: "italic", 
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    marginVertical: 20,
    fontSize: 20,
    fontWeight: "medium",
    lineHeight: 32,
    color: "#C0C0C0",
  },
  noDocumentsText: {
    fontStyle: "italic",
    color: "#888",
  },

  uploadButton: {
    marginBottom: 16,
  },
  uploadButton2: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

