// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlgquYcoHUKCR3lJflJI5k5qfYbKNsFnw",
  authDomain: "calit-2f888.firebaseapp.com",
  projectId: "calit-2f888",
  storageBucket: "calit-2f888.appspot.com",
  messagingSenderId: "897053833663",
  appId: "1:897053833663:web:f0adeed8e52f11eafa090a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
