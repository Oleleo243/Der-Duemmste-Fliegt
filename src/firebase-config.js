// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,onAuthStateChanged, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { getDatabase } from "firebase/database";

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
  measurementId: "G-MNMJ24BSQK",
  databaseURL: "https://chat-app-3f93a-default-rtdb.europe-west1.firebasedatabase.app/",

};

// Initialize Firebase with a unique name for each tab
// is neccecary to avoid same uid in tabs in the same browser
const appName = `app-${Math.random().toString(36).substring(7)}`;
const app = initializeApp(firebaseConfig, appName);
export const auth = getAuth(app);

export let uid = null;
onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    console.log("Current UID:", uid);
  }
});

export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);