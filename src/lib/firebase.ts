// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"; // ✅ Include getApps and getApp
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR7ZEPQWW-V9bCIlrM9w2rrTkEwl_FgkE",
  authDomain: "eco-tourism-qr-explorer.firebaseapp.com",
  projectId: "eco-tourism-qr-explorer",
  storageBucket: "eco-tourism-qr-explorer.firebasestorage.app",
  messagingSenderId: "1018161272766",
  appId: "1:1018161272766:web:71106e663ddd6cc136cbef",
};

// Prevent re-initializing Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export Firestore instance
const db = getFirestore(app);

export { db };
