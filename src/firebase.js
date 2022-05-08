// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHFWuuXgq4KZFuuYkMDjszxzLPk7Oc6tk",
  authDomain: "vacunassist-97fc7.firebaseapp.com",
  projectId: "vacunassist-97fc7",
  storageBucket: "vacunassist-97fc7.appspot.com",
  messagingSenderId: "1085275692040",
  appId: "1:1085275692040:web:5dcd7341d8f13346cbc5bd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)