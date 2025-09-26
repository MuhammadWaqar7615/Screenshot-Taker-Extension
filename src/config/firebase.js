// // src/config/firebase.js:
// // Import firebase core
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // 👉 yahan apne firebase ka config paste karo
// const firebaseConfig = {
//   apiKey: "AIzaSyBnTqKu1Mwd41OoD_9u4FUPPDzYDRWcIvc",
//   authDomain: "screenshots-73056.firebaseapp.com",
//   projectId: "screenshots-73056",
//   storageBucket: "screenshots-73056.firebasestorage.app",
//   messagingSenderId: "682916255085",
//   appId: "1:682916255085:web:f848ffe2524ae2f4c4b664",
//   measurementId: "G-QXN5PWF6SN"
// };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Auth aur Firestore ka export
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// export default app;

// src/config/firebase.js:
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
