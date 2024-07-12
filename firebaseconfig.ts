/*
  DOCU: For this kind of error "firestore: PERMISSION_DENIED: Missing or insufficient permissions" 
        see: https://stackoverflow.com/questions/46590155/firestore-permission-denied-missing-or-insufficient-permissions


/* Import the functions you need from the SDKs you need */
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 

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

/*  
  DOCU: Fix for You are initializing Firebase Auth for React Native without providing
  AsyncStorage. Auth state will default to memory persistence and will not
  persist between sessions. In order to persist auth state, install the package
  "@react-native-async-storage/async-storage" and provide it to
  initializeAuth:  

  SOURCE: https://github.com/firebase/firebase-js-sdk/discussions/4510
*/
let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

/* END OF FIX */

/* Initialize Firebase */
export const FIREBASE_APP = app;
export const FIREBASE_AUTH       = auth; 
export const FIREBASE_DB         = getFirestore(FIREBASE_APP); 
export const FIREBASE_COLLECTION = { collection };
export const FIREBASE_ADDOC      = { addDoc };