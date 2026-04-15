// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvQw5DbDkN39vNY6W08vEw3yBZsgW2G8M",
  authDomain: "fuggler-frenzy.firebaseapp.com",
  projectId: "fuggler-frenzy",
  storageBucket: "fuggler-frenzy.firebasestorage.app",
  messagingSenderId: "897306105921",
  appId: "1:897306105921:web:80ef5c5f06efd7c755cec0",
  measurementId: "G-VVM37ZJT7M",
  databaseURL: "https://fuggler-frenzy-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
export const db = getDatabase(app);
export const auth = getAuth(app);

export default app;
