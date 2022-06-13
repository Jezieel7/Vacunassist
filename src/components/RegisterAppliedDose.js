import { useAuth } from "../context/AuthContext";
import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
export function RegisterAppliedDose(){
    const [ error, setError ] = useState();
    const { logout, loading } = useAuth();
    const [ vaccination, setVaccination] = useState({
        type: '',
        dose: '',
        vaccinationDate: (new Date().getDate() + "/0" + (new Date().getMonth()+1) + "/" + new Date().getFullYear()),
        observations: '',
        presence: ''
    });
    const [ user, setUser ] = useState({
        email: ''
    });
    const handleLogout = async () => {
        await logout();
    }
    const handleChange = ({target: {name, value}}) => {
        if(name === "email"){
            setUser({...user, [name]: value});
        }else{
            setVaccination({...vaccination, [name]: value});
        }
    };
    const addVaccinationTurnDataCovid = (userTurns, doseAmountIncrement) => {
        let i = 0;
        while(userTurns[i] !== ''){
            i++;
        }
        userTurns[i] = vaccination.type + "," + doseAmountIncrement + "," + vaccination.vaccinationDate + "," + vaccination.observations + "," + vaccination.presence;
        return userTurns;
        //Object.keys(userTurns).length
    }
    const addVaccinationTurnData = (userTurns) => {
        let i = 0;
        while(userTurns[i] !== ''){
            i++;
        }
        userTurns[i] = vaccination.type + "," + 1 + "," + vaccination.vaccinationDate + "," + vaccination.observations + "," + vaccination.presence;
        return userTurns;
        //Object.keys(userTurns).length
    }
    const submitDose = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const docRef = doc(db,`Persona/${user.email}`);
            const docSnap = await getDoc(docRef); 
            //Busca el correo del chabón, si no existe muestra error, si existe:
            if (docSnap.exists()) {
                if(vaccination.presence === "absent"){
                    let userTurns = docSnap.data().user.turns;
                    const turnData = addVaccinationTurnData(userTurns);
                    await updateDoc(docRef, {"user.turns": turnData});
                }
                //Recuperar los datos de dosis covid.
                let doseAmountIncrement = docSnap.data().user.doseAmountCovid;
                // Si el usuario tiene un 2 en doseAmount, no deja registrar la dosis, ya que tiene el máximo de dosis permitido sino
                if(vaccination.type === "covid" && doseAmountIncrement === "2"){
                    MySwal.fire(`El usuario ya tiene el maximo de vacunas del covid permitidas`);
                    throw error;
                }else if(vaccination.type === "covid" && vaccination.presence === "present"){
                    //obtenemos users.turns
                    let userTurns = docSnap.data().user.turns;
                    /**Se agrega un nuevo registro en el array de vacunas que contiene:
                        El tipo de vacuna.
                        El numero de la dosis que fue suministrada.
                        La fecha en la que se dio.
                        Observaciones.
                    **/
                    const turnData = addVaccinationTurnDataCovid(userTurns, ++doseAmountIncrement);
                    //Aumenta el doseAmount en 1 y ademas, marca el turno covid como vacio.
                    await updateDoc(docRef, {"user.doseAmountCovid": doseAmountIncrement, "user.turnCovid": '', "user.turns": turnData});
                }
                if(vaccination.type === "flu" && vaccination.presence === "present"){
                    let userTurns = docSnap.data().user.turns;
                    const turnData = addVaccinationTurnData(userTurns);
                    await updateDoc(docRef, {"user.turnFlu": '', "user.turns": turnData});
                }
                if(vaccination.type === "yellowFever" && vaccination.presence === "present"){
                    let userTurns = docSnap.data().user.turns;
                    const turnData = addVaccinationTurnData(userTurns);
                    await updateDoc(docRef, {"user.turnYellowFever": '', "user.turns": turnData});
                }
            } else {
                MySwal.fire(`El email ingresado no pertenece a un usuario del sistema`);
                throw error;
            }
        } catch (error) {
            setError(error.message);
        }
    }
    if(loading) return <h1>loading</h1>
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={handleLogout}>CERRAR SESIÓN</button>
                    <div className="text-x1 mb-4">
                        <br></br>    
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black">
                            <a href="./data">VER MI PERFIL</a>
                        </button>
                    </div>
                    <h1>Registro de dosis aplicada</h1>
                    <form onSubmit={submitDose}>
                        <div className='mb-3'>
                            <label className='form-label'>Email: </label>
                            <input type="email" className='form-control' name="email" value={user.email} onChange={handleChange}/>     
                        </div>
                        <div className='mb-3'> 
                            <label className='form-label'>Presencia: </label>
                            <div className='mb-3'> 
                                <label className='form-label'>Ausente: </label>
                                <input type="radio" name="presence" className='form-control' value={"absent"} onChange={handleChange}/>
                            </div>
                            <div className='mb-3'> 
                                <label className='form-label'>Presente: </label>
                                <input type="radio" name="presence" className='form-control' value={"present"} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className='mb-3'> 
                            <label className='form-label'>Dosis posibles </label>
                            <div className='mb-3'> 
                                <label className='form-label'>Dosis covid: </label>
                                <input type="radio" name="type" className='form-control' value={"covid"} onChange={handleChange}/>Covid-19
                            </div>
                            <br></br>
                            <div className='mb-3'> 
                                <label className='form-label'>Dosis gripe: </label>
                                <input type="radio" name="type" className='form-control' value={"flu"} onChange={handleChange}/> Gripe
                            </div>
                            <br></br>
                            <div className='mb-3'> 
                                <label className='form-label'>Dosis fiebre amarilla: </label>
                                <input type="radio" name="type" className='form-control' value={"yellowFever"} onChange={handleChange}/> Fiebre amarilla 
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Observaciones: </label>
                            <input name="observations" type="text" className='form-control' onChange={handleChange}/>      
                        </div>
                        <button onClick={submitDose}>Registrar dosis</button>
                    </form>
                </div>
            </div>
        </div>
    )
}