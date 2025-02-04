import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase-konfiguration (indsæt din egen fra Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyBRz4vtoX5jDbOQReCCZnM-MjVDky_nLy0",
    authDomain: "amandassonner.firebaseapp.com",
    projectId: "amandassonner",
    storageBucket: "amandassonner.firebasestorage.app",
    messagingSenderId: "625879249246",
    appId: "1:625879249246:web:5bee326b25cda741c09fcf",
    measurementId: "G-HZ6MSQ17YK"
  };

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
//export default app;