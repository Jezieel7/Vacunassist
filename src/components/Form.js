import React, { useState } from "react";
import Register from "./Register";
import Cargar from "./Cargar";
import { useNavigate } from 'react-router-dom'
import { createUserDocument } from "../firebase";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAuth } from "../context/AuthContext";
import { Alert } from "./Alert";
const MySwal = withReactContent(Swal);
export function Form() {
  const [page, setPage] = useState(0);
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    birthDate: '',
    LastName: '',
    DNI: '',
    key: '',
    zone: '',
    riskFactor: '',
    doseAmountCovid: '',
    hasVaccineFlu: '',
    vaccinationDateFlu: '',
    hasYellowFever: false,
    doseYearYellowFever: '',
    turnCovid: '',
    turnFlu: '',
    turnYellowFever: '' 
  });
  const FormTitles = ["Registro", "Datos importantes"];
  const PageDisplay = () => {
    if (page === 0) {
      return <Register user={user} setUser={setUser}/>;
    } else {
      return <Cargar user={user} setUser={setUser}/>;
    }
  };
  const {signup}= useAuth();
  const [error, setError] = useState();
  const navigate = useNavigate()

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
        await signup(user.email, user.password);
        await createUserDocument(user)
        MySwal.fire(`Su codigo de validación es: ${user.key}, por favor, anotela`)
        let boolCovid = false; 
        let boolFlu = false; 
        if((calculoDeEdad(user.birthDate) > 60)){ 
          if((user.doseAmountCovid < 2)){ 
            boolCovid = true; 
          } 
        }else if(user.riskFactor == true){ 
          boolCovid = true; 
        }else{ 
          boolCovid = true; 
        } 
        //VACUNA GRIPE 
        if((calculoDeEdad(user.birthDate) > 60) || (user.hasVaccineFlu == false)){ 
          boolFlu = true; 
        }else{ 
          if(user.hasVaccineFlu == false){ 
            boolFlu = true; 
          }else if(calculoGripe(user.vaccinationDateFlu)){ 
            boolFlu = true; 
          } 
        } 
        if(boolCovid && boolFlu){ 
          alert("Se le asigno una vacuna para el covid y para la gripe"); 
        }else if(boolCovid){ 
          alert("Se le asigno una vacuna para el covid"); 
        }else if(boolFlu){ 
          alert("Se le asigno una vacuna para la gripe"); 
        } 
        navigate('/') 
    } catch (error) {
        if(error.code === "auth/weak-password"){
            setError("Contraseña debil, deberia tener al menos 6 caracteres")
        }
        setError(error.message);
    }
};
  return (
    <div className="form">
        {error && <Alert message={error}/>}
        <form onSubmit={handleSubmit}>
           <div className="form-container">
           <div className="header">
             <h1>{FormTitles[page]}</h1>
           </div>
           <div className="body">{PageDisplay()}</div>
           <div className="footer">
             <button
               disabled={page === 0}
               onClick={() => {
                 setPage((currPage) => currPage - 1);
               }}
             >
               {page === FormTitles.length - 1 ? "Volver" : ""}
             </button>
             <button
               onClick={() => {
                 if (page === FormTitles.length - 1) {
                   //alert("FORM SUBMITTED");
                   console.log(user);
                 } else {
                   setPage((currPage) => currPage + 1);
                 }
               }}
             >
               {page === FormTitles.length - 1 ? "Registrate" : "Próxima hoja"}
             </button>
           </div>
         </div>
        </form>
    </div>
  );
}