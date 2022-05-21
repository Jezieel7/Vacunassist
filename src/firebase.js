// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc } from '@firebase/firestore'
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
export const db= getFirestore(app)

export const createUserDocument = async (user) =>{
  if(!user) return; //esto por si meten huevadas, igual no se si funciona, no lo probe
  //crear referencia al documento (uso email para identificar a los panas)
  const userRef = doc(db,`Persona/${user.email}`)
  // buscar documento, al final no lo uso esto pero lo dejo por si sirve despues
  //const snapshot = await getDoc(userRef)
  user.clave= 1234 //implementar algun metodo que devuelva un numero aleatorio
   // crea el documento del user que se esta registrando
  await setDoc(userRef, {user});
    
    
    /*const {email} =user;
    try{
      userRef.set({
        email,
        createdAt: new Date(),
      });
    }
    catch(error){
      console.log('error creando usuario', error)
    }*/
  
}

export const createUserData = async (user, zona, factorRiesgo) =>{
  if(!user) return;
  const userRef = doc(db,`Persona/${user.email}`);
  await updateDoc(userRef, {zona:zona, factorRiesgo:factorRiesgo});
}