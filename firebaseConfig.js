import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCI_IcgXV3l71PuBuyWgbdbyAZ6SgacurU",
  authDomain: "mobile-c7edc.firebaseapp.com",
  projectId: "mobile-c7edc",
  storageBucket: "mobile-c7edc.firebasestorage.app",
  messagingSenderId: "212692407441",
  appId: "1:212692407441:web:d63bd59468bed8c3f59b30",
  measurementId: "G-6PL8V9E52C"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

// Exporta o banco de dados
export { db };
