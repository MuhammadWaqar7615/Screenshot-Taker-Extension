// Import firebase core
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 👉 yahan apne firebase ka config paste karo
const firebaseConfig = {
  apiKey: "AIzaSyBnTqKu1Mwd41OoD_9u4FUPPDzYDRWcIvc",
  authDomain: "screenshots-73056.firebaseapp.com",
  projectId: "screenshots-73056",
  storageBucket: "screenshots-73056.firebasestorage.app",
  messagingSenderId: "682916255085",
  appId: "1:682916255085:web:f848ffe2524ae2f4c4b664",
  measurementId: "G-QXN5PWF6SN"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth aur Firestore ka export
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;