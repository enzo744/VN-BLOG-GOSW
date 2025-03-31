import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getEnv } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API"),
  authDomain: "blog-goswami.firebaseapp.com",
  projectId: "blog-goswami",
  storageBucket: "blog-goswami.firebasestorage.app",
  messagingSenderId: "933256321336",
  appId: "1:933256321336:web:90dbc59eab91aa4e1349cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}
