import { useAuth } from "../context/AuthContext";
import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
export default function MyTurns(){
    const [ error, setError ] = useState();
    const { logout, loading } = useAuth();
    const [ vaccination, setVaccination] = useState({
        type: '',
        dose: '',
        vaccinationDate: new Date(),
        observations: ''
    });
    const [ user, setUser ] = useState({
        email: '',
        doseAmountCovid: '',
        turnCovid: ''
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
    const getLengthOfObject = (obj) => { 
        let lengthOfObject = Object.keys(obj).length; 
        return lengthOfObject
    }
    const submitDose = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const docRef = doc(db,`Persona/${user.email}`);
            const docSnap = await getDoc(docRef); 
            //Busca el correo del chabón, si no existe muestra error, si existe:
            if (docSnap.exists()) {
                //Recuperar los datos de dosis covid.
                setUser({...user, doseAmountCovid: docSnap.data().user.doseAmountCovid});
                // Si el usuario tiene un 2 en doseAmount, no deja registrar la dosis, ya que tiene el máximo de dosis permitido sino
                if(user.doseAmountCovid === "2"){
                    MySwal.fire(`El usuario ya tiene el maximo de vacunas del covid permitidas`);
                    throw error;
                }else{
                    //obtenemos tamaño de users.turns
                    let mati= docSnap.data().user.turns       //docSnap = snapshot       
                    let size= getLengthOfObject(mati);
                    //let stringturndireccion = `user.turns.${size}`
                    //ya tenemos lenght y ahora como hacemo
                    setUser({...user, doseAmountCovid: (docSnap.data().user.doseAmountCovid + 1)});
                    await updateDoc(docRef, {
                        "user.doseAmountCovid": user.doseAmountCovid, "user.turnCovid": user.turnCovid, "user.turns.${size}": ""
                    });
                    /**Se agrega un nuevo registro en el array de vacunas que contiene:
                    El tipo de vacuna.
                    El numero de la dosis que fue suministrada.
                    La fecha en la que se dio.
                    Observaciones.
                    **/ 
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
                            <input value={vaccination.observations} type="text" className='form-control'/>      
                        </div>
                        <button onClick={submitDose}>Registrar dosis</button>
                    </form>
                </div>
            </div>
        </div>
    )
}