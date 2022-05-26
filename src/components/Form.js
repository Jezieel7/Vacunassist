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
        console.log(user.doseAmountCovid)
        if((calculoDeEdad(user.birthDate) > 60)){ //si es mayor de 60 años (riesgo)
          if((user.doseAmountCovid < 2)){ //si no tiene las 2 dosis de covid, se asigna automatico
            MySwal.fire("Se le asigno un turno para la vacuna del COVID-19 automaticamente");
          }
          if((user.hasVaccineFlu == false)||(calculoGripe(user.vaccinationDateFlu) > 1)){
            MySwal.fire("Se le asigno un turno para la vacuna de la gripe dentro de los proximos 3 meses automaticamente");
          }
        }else if(user.riskFactor == true){ //si no tiene 60 años, pero tiene factores de riesgo, se asigna automaticamente
          MySwal.fire("Se le asigno un turno para la vacuna del COVID-19 automaticamente");
        }else if(!(user.doseAmountCovid == 2)){ //si no tiene las 2 dosis, se asigna manual
          MySwal.fire("Se le notifico a los administradores su solicitud de turno para la vacuna del COVID-19");
        }else{
          MySwal.fire("Se le asigno un turno para la vacuna de la gripe dentro de los proximos 6 meses automaticamente");
        }
        navigate('/')
    } catch (error) {
        if(error.code === "auth/weak-password"){
            setError("Contrasenia debil, deberia tener al menos 6 caracteres")
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
               {page === FormTitles.length - 1 ? "Prev" : ""}
             </button>
             <button
               onClick={() => {
                 if (page === FormTitles.length - 1) {
                   alert("FORM SUBMITTED");
                   console.log(user);
                 } else {
                   setPage((currPage) => currPage + 1);
                 }
               }}
             >
               {page === FormTitles.length - 1 ? "Submit" : "Next"}
             </button>
           </div>
         </div>
        </form>
    </div>
  );
}