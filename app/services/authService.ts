import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function login(email : string, senha : string) {
    const q = query(
      collection(db, "usuarios"),
      where("email", "==", email),
      where("senha", "==", senha) 
    );
  
    const snapshot = await getDocs(q);
  
    if (snapshot.empty) {
      throw new Error("Usuário ou senha inválidos");
    }
  
    const usuario = snapshot.docs[0].data();
    return usuario;
  }


  export async function verificarEmailJaCadastrado(email: string): Promise<boolean> {
    const q = query(collection(db, "usuarios"), where("email", "==", email));
    const snapshot = await getDocs(q);
    return !snapshot.empty; // true se já existe usuário
  }
