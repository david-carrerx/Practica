import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7TpXsKRJNE5n7h3wn-uLjnLCDeYskO_8",
  authDomain: "cinemaparadiso-b2948.firebaseapp.com",
  projectId: "cinemaparadiso-b2948",
  storageBucket: "cinemaparadiso-b2948.appspot.com",
  messagingSenderId: "655582431280",
  appId: "1:655582431280:web:7e2518e370b6cb243185f5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
