// authService.ts
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";

/**
 * Faz login de um usuário com email e senha.
 * @param email Email do usuário
 * @param senha Senha do usuário
 * @returns Usuário autenticado
 */
export async function login(email: string, senha: string): Promise<User> {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error("Usuário ou senha inválidos");
    } else {
      throw new Error(`Erro ao autenticar: ${error.message}`);
    }
  }
}

/**
 * Registra um novo usuário com email e senha.
 * @param email Email do novo usuário
 * @param senha Senha do novo usuário
 * @returns Usuário criado
 */
export async function registrarUsuario(email: string, senha: string): Promise<User> {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(`Erro ao registrar: ${error.message}`);
  }
}

/**
 * Faz logout do usuário atual.
 */
export async function logout(): Promise<void> {
  const auth = getAuth();
  await signOut(auth);
}

/**
 * Retorna o usuário logado atual (ou null se ninguém estiver logado).
 */
export function obterUsuarioAtual(): User | null {
  const auth = getAuth();
  return auth.currentUser;
}
