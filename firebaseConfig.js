import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA0FMwNVIuDYOr-dlLQ3o0enFX2ciw5qUA",
  authDomain: "teste-c4ec5.firebaseapp.com",
  projectId: "teste-c4ec5",
  storageBucket: "teste-c4ec5.appspot.com",
  messagingSenderId: "696642620955",
  appId: "1:696642620955:web:773b2c69782f58ba76b2be"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);


// Inicializando o Firebase Storage
const storage = getStorage(app);

// Inicializa o Firestore
const db = getFirestore(app);

// Exporta o banco de dados
export { db };
// Exportando o Storage
export { storage };
