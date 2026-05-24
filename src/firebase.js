// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace this with your actual Firebase project config keys later!
const firebaseConfig = {
  apiKey: "AIzaSyC6p5qO6BJ_tIS4jLPHjooG_LzM4fr-7O4",
  authDomain: "codeflow-ide-bace6.firebaseapp.com",
  projectId: "codeflow-ide-bace6",
  storageBucket: "codeflow-ide-bace6.firebasestorage.app",
  messagingSenderId: "630937184659",
  appId: "1:630937184659:web:28973c81e5aa5451146066"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Database tools
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);