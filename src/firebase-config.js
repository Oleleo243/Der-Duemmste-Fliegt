// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvwOHEfCbzxaTLWF_6HvneTjDlNEIgy4I",
  authDomain: "chat-app-3f93a.firebaseapp.com",
  projectId: "chat-app-3f93a",
  storageBucket: "chat-app-3f93a.appspot.com",
  messagingSenderId: "119211771215",
  appId: "1:119211771215:web:518ea36fc5175a4c46313a",
  measurementId: "G-MNMJ24BSQK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);