import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAKZZy_fodfRp9f7dnocBOWdJL-dHNpXaw",
  authDomain: "ds-website-db.firebaseapp.com",
  databaseURL: "https://ds-website-db-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ds-website-db",
  storageBucket: "ds-website-db.firebasestorage.app",
  messagingSenderId: "86256775198",
  appId: "1:86256775198:web:a9db74cce503cf96473e0f"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
