// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore, doc, setDoc } from '@firebase/firestore'
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

function calculoDeEdad(BirthDate) {
  let hoy = new Date();
  console.log(hoy)
  let cumpleanios = new Date(BirthDate);
  console.log(BirthDate)
  let edad = hoy.getFullYear() - cumpleanios.getFullYear();
  let m = hoy.getMonth() - cumpleanios.getMonth();
  if (m < 0 || (m == 0 && hoy.getDate() < cumpleanios.getDate())) { //aca no seria m==0 en vez de m===0 ???
      edad--;
  }
  console.log(edad);
  return edad;
}
function calculoGripe(vaccinationDateFlu){ //esta funcion es igual a la de calculo de edad pero weno
  let hoy = new Date()
  let ultimaVacGripe = new Date(vaccinationDateFlu)
  let años= hoy.getFullYear() - ultimaVacGripe.getFullYear();
  let m = hoy.getMonth() - ultimaVacGripe.getMonth();
  if (m < 0 || (m == 0 && hoy.getDate() < ultimaVacGripe.getDate())) { //aca no seria m==0 en vez de m===0 ???
      años--;
  }
  return años;
}


export const createUserDocument = async (user) =>{
  if(!user) return; //esto por si meten huevadas, igual no se si funciona, no lo probe
  //crear referencia al documento (uso email para identificar a los panas)
  const userRef = doc(db,`Persona/${user.email}`)
  let numero= Math.floor(Math.random()*10000);
  while(numero < 1000 || numero > 10000){
    numero= Math.floor(Math.random()*10000);
  }
  user.key= numero 
  let hoy = new Date(); //si mas adelante quiero guardar fechas, crear otro hoy, antes de las operaciones de gripe pero despues de covid
  //VACUNA COVID 
  if((calculoDeEdad(user.birthDate) > 60)){ 
    if((user.doseAmountCovid < 2)){ 
       //AUTOMATICO, DE RIESGO = MAYOR DE 60, CON MENOS DE 2 DOSIS, LE ASIGNO EN 3 DIAS
      hoy.setDate(hoy.getDate() + 3) 
      user.turnCovid = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 12:00 horas, en el vacunatorio ${user.zone}`
    } 
  }else{ 
    if(user.riskFactor == "true"){
      if(user.doseAmountCovid < 2){
        hoy.setDate(hoy.getDate() + 4)
        //AUTOMATICO, DE RIESGO = MENOR DE 60, PERO CON FACTORES DE RIESGO Y MENOS DE 2 DOSIS, LE ASIGNO EN 4 DIAS
        user.turnCovid = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 12:30 horas, en el vacunatorio ${user.zone}`
      }  
    }else{
      if(user.doseAmountCovid < 2){
        //MANUAL, NO ES DE RIESGO = MENOR DE 60, MENOS DE 2 DOSIS
        user.turnCovid = "Se le notifico a los administradores su solicitud de turno para la vacuna del COVID-19"
      }
    }
  }   
  //VACUNA GRIPE
  if((calculoDeEdad(user.birthDate) > 60)){
    if(user.hasVaccineFlu == "false"){ // +60 AÑOS, SIN VACUNA
      hoy.setDate(hoy.getDate() - 1) //ESTO LO HICE PARA QUE NO QUEDE MISMO DIA QUE COVID
      hoy.setMonth(hoy.getMonth() + 2) //+1 MES, PUSE 2 PORQUE EL GETMONTH TOMA ENERO COMO 0, ENTONCES MAYO POR EJEMPLO ES EL MES 4 EN VEZ DE 5
      user.turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 14:00 horas, en el vacunatorio ${user.zone}`
      //LE DOY TURNO PARA 1 MES, EN VACUNATORIO DE PREFERENCIA 
    }else{
      if(calculoGripe(user.vaccinationDateFlu)){ //+60 AÑOS, CON VACUNA VENCIDA
        hoy.setDate(hoy.getDate() - 2)
        hoy.setMonth(hoy.getMonth() + 2) //+1 MES
        user.turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 14:30 horas, en el vacunatorio ${user.zone}`
      }
    }
  }else{ 
    if(user.hasVaccineFlu == "false"){ //-60 AÑOS, SIN VACUNA
      hoy.setDate(hoy.getDate() - 3)
      hoy.setMonth(hoy.getMonth() + 6) //+5 MESES
      user.turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 13:00 horas, en el vacunatorio ${user.zone}`
      //LE DOY TURNO PARA 5 MESES, EN VACUNATORIO DE PREFERENCIA. 
    }else{
      if(calculoGripe(user.vaccinationDateFlu)){ //-60 AÑOS, CON VACUNA VENCIDA
        hoy.setDate(hoy.getDate() - 4)
        hoy.setMonth(hoy.getMonth() + 6) //+5 MESES
        user.turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 13:30 horas, en el vacunatorio ${user.zone}`
      }
    }
  }
  // SI ALGUN DIA SE QUIERE HACER MAS "PRO" EL TEMA DE TURNOS, UNA BUENA IDEA PODRÍA SER TENER UN CALENDARIO, CON UN LIMITE DE TURNOS POR DIA, Y TENER CADA 30 MINUTOS (PONELE) UN TURNO
   // crea el documento del user que se esta registrando
  await setDoc(userRef, {user});
} //MATI ESTUVO POR ACÁ