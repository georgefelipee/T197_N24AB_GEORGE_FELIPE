import React, { useEffect, useState } from "react";
import { Text, View, Button, ScrollView } from "react-native";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Index() {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const adicionarUsuario = async () => {
    try {
      await addDoc(collection(db, "usuarios"), {
        nome: "João",
        idade: 25,
        email: "joao@email.com",
      });
      buscarUsuarios(); // Atualiza lista
    } catch (e) {
      console.error("Erro ao adicionar usuário:", e);
    }
  };

  const buscarUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const lista: any[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setUsuarios(lista);
    } catch (e) {
      console.error("Erro ao buscar usuários:", e);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 50 }}>
      <Button title="Adicionar Usuário" onPress={adicionarUsuario} />

      <ScrollView style={{ marginTop: 20 }}>
        {usuarios.map((user) => (
          <View
            key={user.id}
            style={{
              marginBottom: 10,
              padding: 10,
              backgroundColor: "#f0f0f0",
              borderRadius: 8,
            }}
          >
            <Text>Nome: {user.nome}</Text>
            <Text>Idade: {user.idade}</Text>
            <Text>Email: {user.email}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
