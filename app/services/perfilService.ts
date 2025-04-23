import { collection, query, where, getDocs, updateDoc, DocumentReference } from 'firebase/firestore';
import { db } from "@/firebaseConfig";

// Definição da interface para os dados do usuário com todos os campos opcionais
interface Usuario {
  nome?: string;
  telefone?: string;
  email?: string;
  senha?: string;
}

// Ajuste para permitir que qualquer campo seja passado para a função de atualização
export async function atualizarUsuarioPorEmail(email: string, novosDados: Usuario): Promise<boolean> {
  try {
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('Usuário não encontrado com esse e-mail.');
      return false;
    }

    const doc = querySnapshot.docs[0];
    const docRef: DocumentReference = doc.ref;

    // Garantir que o Firestore aceite os dados como um objeto genérico (Record<string, any>)
    await updateDoc(docRef, novosDados as Record<string, any>);
    console.log('Usuário atualizado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return false;
  }
}
