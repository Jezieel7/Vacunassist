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
    doseYearYellowFever: ''
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
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanios.getDate())) {
        edad--;
    }
    console.log(edad);
    return edad;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
        await signup(user.email, user.password);
        await createUserDocument(user)
        MySwal.fire(`Su codigo de validación es: ${user.key}, por favor, anotela`)
        console.log(user.doseAmountCovid)
        if((calculoDeEdad(user.birthDate) > 60)){
          if((user.doseAmountCovid < 2)){
            MySwal.fire("Se le asigno un turno para la vacuna del COVID-19 automaticamente");
          }
          if(user.hasVaccineFlu == false){
            MySwal.fire("Se le asigno un turno para la vacuna de la gripe dentro de los proximos 3 meses automaticamente");
          }
        }else if(user.riskFactor == true){
          MySwal.fire("Se le asigno un turno para la vacuna del COVID-19 automaticamente");
        }else if(!(user.doseAmountCovid == 2)){
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
               Prev
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