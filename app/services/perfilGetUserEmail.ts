import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export async function buscarUsuarioPorEmail(email: string) {
  try {
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data(); // <-- isso precisa retornar os dados corretos!
    } else {
      console.log('Nenhum usuário encontrado com esse email.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}
