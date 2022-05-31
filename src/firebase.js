import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc } from '@firebase/firestore'
import DatePicker from "react-datepicker";
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
function calculoDeEdad(BirthDate) {
  let hoy = new Date();
  console.log(hoy)
  let cumpleanios = new Date(BirthDate);
  console.log(BirthDate)
  let edad = hoy.getFullYear() - cumpleanios.getFullYear();
  let m = hoy.getMonth() - cumpleanios.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanios.getDate())) { //aca no seria m==0 en vez de m===0 ???
      edad--;
  }
  return edad;
}
function calculoGripe(vaccinationDateFlu){ //esta funcion es igual a la de calculo de edad pero weno
  let hoy = new Date()
  let ultimaVacGripe = new Date(vaccinationDateFlu)
  let años= hoy.getFullYear() - ultimaVacGripe.getFullYear();
  let m = hoy.getMonth() - ultimaVacGripe.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < ultimaVacGripe.getDate())) { //aca no seria m==0 en vez de m===0 ???
      años--;
  }
  return años;
}
export const createUserDocumentVaccinator = async (user) =>{
  if(!user) return;
  const userRef = doc(db,`Persona/${user.email}`)
  await setDoc(userRef, {user});
}
export const createUserDocument = async (user) =>{
  if(!user) return;
  const userRef = doc(db,`Persona/${user.email}`)
  let numero= Math.floor(Math.random()*10000);
  while(numero < 1000 || numero > 10000){
    numero= Math.floor(Math.random()*10000);
  }
  user.key= numero 
  await setDoc(userRef, {user});
}
export const asignTurn = async (birthDate, turnCovid, turnFlu, turnYellowFever, doseAmountCovid, zone, riskFactor, hasVaccineFlu, vaccinationDateFlu, email) =>{
  let hoy = new Date(); //si mas adelante quiero guardar fechas, crear otro hoy, antes de las operaciones de gripe pero despues de covid
  //VACUNA COVID 
  if((calculoDeEdad(birthDate) > 60)){ 
    if((doseAmountCovid < 2)){ 
      //AUTOMATICO, DE RIESGO = MAYOR DE 60, CON MENOS DE 2 DOSIS, LE ASIGNO EN 3 DIAS
      hoy.setDate(hoy.getDate() + 3) 
      turnCovid = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 12:00 horas, en el vacunatorio ${zone}`
    } 
  }else{ 
    if(riskFactor === "true"){
      if(doseAmountCovid < 2){
        hoy.setDate(hoy.getDate() + 4)
        //AUTOMATICO, DE RIESGO = MENOR DE 60, PERO CON FACTORES DE RIESGO Y MENOS DE 2 DOSIS, LE ASIGNO EN 4 DIAS
        turnCovid = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 12:30 horas, en el vacunatorio ${zone}`
      }  
    }else{
      if(doseAmountCovid < 2){
        //MANUAL, NO ES DE RIESGO = MENOR DE 60, MENOS DE 2 DOSIS
        turnCovid = "Se le notifico a los administradores su solicitud de turno para la vacuna del COVID-19"
      }
    }
  }   
  //VACUNA GRIPE
  if((calculoDeEdad(birthDate) > 60)){
    if(hasVaccineFlu === "false"){ // +60 AÑOS, SIN VACUNA
      hoy.setDate(hoy.getDate() - 1) //ESTO LO HICE PARA QUE NO QUEDE MISMO DIA QUE COVID
      hoy.setMonth(hoy.getMonth() + 2) //+1 MES, PUSE 2 PORQUE EL GETMONTH TOMA ENERO COMO 0, ENTONCES MAYO POR EJEMPLO ES EL MES 4 EN VEZ DE 5
      turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 14:00 horas, en el vacunatorio ${zone}`
      //LE DOY TURNO PARA 1 MES, EN VACUNATORIO DE PREFERENCIA 
    }else{
      if(calculoGripe(vaccinationDateFlu)){ //+60 AÑOS, CON VACUNA VENCIDA
        hoy.setDate(hoy.getDate() - 2)
        hoy.setMonth(hoy.getMonth() + 2) //+1 MES
        turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 14:30 horas, en el vacunatorio ${zone}`
      }
    }
  }else{ 
    if(hasVaccineFlu === "false"){ //-60 AÑOS, SIN VACUNA
      hoy.setDate(hoy.getDate() - 3)
      hoy.setMonth(hoy.getMonth() + 6) //+5 MESES
      turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 13:00 horas, en el vacunatorio ${zone}`
      //LE DOY TURNO PARA 5 MESES, EN VACUNATORIO DE PREFERENCIA. 
    }else{
      if(calculoGripe(vaccinationDateFlu)){ //-60 AÑOS, CON VACUNA VENCIDA
        hoy.setDate(hoy.getDate() - 4)
        hoy.setMonth(hoy.getMonth() + 6) //+5 MESES
        turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 13:30 horas, en el vacunatorio ${zone}`
      }
    }
  }
   // SI ALGUN DIA SE QUIERE HACER MAS "PRO" EL TEMA DE TURNOS, UNA BUENA IDEA PODRÍA SER TENER UN CALENDARIO, CON UN LIMITE DE TURNOS POR DIA, Y TENER CADA 30 MINUTOS (PONELE) UN TURNO
  const userRef= doc(db,`Persona/${email}`) //traemos todos los datos
  await updateDoc(userRef, {"user.turnCovid": turnCovid, "user.turnFlu": turnFlu, "user.turnYellowFever": turnYellowFever}) //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
}