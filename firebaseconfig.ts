// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6JnsBND2QKYxsl5HDm5chxxmiWHED73U",
  authDomain: "the-wall-react-native.firebaseapp.com",
  projectId: "the-wall-react-native",
  storageBucket: "the-wall-react-native.appspot.com",
  messagingSenderId: "535237848017",
  appId: "1:535237848017:web:68d2ba80a9097f8d730ef0",
  measurementId: "G-DTDV3W7B91"
};

// Initialize Firebase
export const FIREBASE_APP        = initializeApp(firebaseConfig);
export const FIREBASE_AUTH       = getAuth(FIREBASE_APP);
export const FIREBASE_DB         = getFirestore(FIREBASE_APP);
export const FIREBASE_COLLECTION = { collection };
export const FIREBASE_ADDOC      = { addDoc };