import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs} from "firebase/firestore";
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
export default function ModificarFactorRiesgo(){
    const [ error, setError ] = useState();
    const { logout, loading } = useAuth();
    const [ riesgo, setRiesgo] = useState('');
    const [ user, setUser ] = useState({
        email: 'otro'
    });
    const [personas, setPersonas] = useState( [] );
    const [mati, setMati] = useState( 0 );
    
    const getListadoPersonas = async (string) => {
        const listado = query(collection(db, string), where("user.vaccinator", "!=", "true"));
        var arr1= [];
        const querySnapshot1 = await getDocs(listado);
        querySnapshot1.forEach((doc) => {
            if(doc.data().user.email !== "lautaro@gmail.com" && doc.data().user.email !== "mativacunador@gmail.com" && doc.data().user.email !== "jezielvacunador@gmail.com" && doc.data().user.email !== "dainavacunadora@gmail.com")
                arr1.push(doc.data());
        });
        arr1 = [...new Set(arr1)];
        setPersonas(arr1); //en personas voy a guardar los mails
        setMati(1);
    }

    useEffect( () => {
        getListadoPersonas("Persona");
        // eslint-disable-next-time
    }, [])

    const handleChange = ({target: {name, value}}) => {
        if(name === "email"){
            setUser({...user, [name]: value});
        }else{
            setRiesgo(value);
        }
    };

    const submitRiesgo = async (e) => {
        e.preventDefault();
        setError('');
        console.log(user.email)
        try {
            if(user.email=="listo"){
                MySwal.fire(`Ya actualizó el factor de riesgo, actualize la pagina para ver los cambios, o seleccione otro`);
                throw error;
            }
            if(user.email=="otro"){
                MySwal.fire(`Ingrese un email`);
                throw error;
            }
            const docRef = doc(db,`Persona/${user.email}`);
            const docSnap = await getDoc(docRef); 
            if (docSnap.exists()) {
                await updateDoc(docRef, {"user.riskFactor": riesgo});
                if(riesgo == "true")
                    MySwal.fire("Se registro el nuevo factor de riesgo. Por favor, recuerdele a esta persona que si tiene turnos puede cancelarlos y pedir otros con mayor prioridad");
                else
                    MySwal.fire(`Se registro el nuevo factor de riesgo`);
                user.email="listo"
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
                    <div className="text-x1 mb-4">
                        <br></br>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./HomeVaccinator">VOLVER A HOME</a></button>
                    </div>
                    <h1>Modificar factor de riesgo</h1>
                    <form onSubmit={submitRiesgo}>
                        <div className='mb-3'> 
                            <label className='form-label'>Email (entre parentesis si tiene riesgo actualmente): </label>
                            <input type="search" name="email" list="personas" onChange={handleChange} inlist="personas"></input>
                            <datalist id="personas">
                            {mati == 1 ?
                                personas.map( (persona) => (
                                    <option type="text" className='form-control' name="email" value={persona.user.email}>{persona.user.email}{persona.user.riskFactor=="true"?"(si)":"(no)"}</option>
                                )) 
                            : ""}
                            </datalist>
                        </div>
                        <div className='mb-3'> 
                            <label className='form-label' htmlFor="riskFactor">Actualizar riesgo: </label>
                            <input type="radio" name="riskFactor" className='form-control' value={true} onChange={handleChange} required/> Si
                            <input type="radio" name="riskFactor" className='form-control' value={false} onChange={handleChange} required/> No
                        </div>
                        <button onClick={submitRiesgo}>Registrar nuevo factor de riesgo</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
/*
    {mati == 1 ?(
                            <select type="search" name="email" onChange={handleChange}>
                                <option type="email" className='form-control' name="email" value={"mati"}>Selecciona un email</option>
                                {personas.map( (persona) => (
                                    <option type="email" className='form-control' name="email" value={persona.user.email}>{persona.user.email}{persona.user.riskFactor=="true"?"(si)":"(no)"}</option>
                                ))}  
                            </select>
                        ): ""}
*/