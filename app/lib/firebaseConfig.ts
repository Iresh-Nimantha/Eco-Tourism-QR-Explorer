import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR7ZEPQWW-V9bCIlrM9w2rrTkEwl_FgkE",
  authDomain: "eco-tourism-qr-explorer.firebaseapp.com",
  projectId: "eco-tourism-qr-explorer",
  storageBucket: "eco-tourism-qr-explorer.appspot.com",
  messagingSenderId: "1018161272766",
  appId: "1:1018161272766:web:71106e663ddd6cc136cbef",
  measurementId: "G-JLPCLKR69S",
};

const app = initializeApp(firebaseConfig);
export const textdb = getFirestore(app);
