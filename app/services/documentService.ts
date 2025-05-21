import { db } from '@/firebaseConfig';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { IDocumento } from '../interfaces/IDocumento';

export async function getAllDocumentsByEmail(
  email: string
): Promise<IDocumento[]> {
  const q = query(collection(db, 'documents'), where('userEmail', '==', email));
  const snapshot = await getDocs(q);
  const documentos: IDocumento[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    documentos.push({
      id: doc.id,
      nome: data.nome || '',
      status: data.status || '',
      categoria: data.categoria || '',
      descricao: data.descricao || '',
      userEmail: data.userEmail || '',
      fileBase64: data.fileBase64 || '',
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
    } as IDocumento);
  });

  return documentos;
}

export async function handleDeleteDocument(id: string) {
  try {
    const docRef = doc(db, 'documents', id);
    await deleteDoc(docRef);

    console.log('Documento deletado com sucesso');
  } catch (error) {
    console.log('Erro ao deletar documento: ', error);
  }
}


export async function updateDocument(
  id: string,
  nome: string,
  descricao: string,
  categoria: string
) {
  try {
    const docRef = doc(db, 'documents', id);
    await updateDoc(docRef, {
      nome,
      descricao,
      categoria,
    });

    console.log('Documento atualizado com sucesso');
  } catch (error) {
    console.log('Erro ao atualizar documento: ', error);
  }
}