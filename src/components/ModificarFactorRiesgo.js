import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs} from "firebase/firestore";
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Logo_VacunAssist_1 from '../img/Logo_VacunAssist_1.png';
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
                MySwal.fire(`Ya actualizó el factor de riesgo, actualize la pagina para ver los cambios, o seleccione otro email`);
                throw error;
            }
            if(user.email=="otro"){
                MySwal.fire(`Ingrese un email`);
                throw error;
            }
            if(user.email=="ya contaba"){
                MySwal.fire(`El usuario ya contaba con este dato`);
                throw error;
            }
            if(riesgo==''){
                MySwal.fire(`Ingrese factor de riesgo`);
                throw error;
            }
            const docRef = doc(db,`Persona/${user.email}`);
            const docSnap = await getDoc(docRef); 
            if (docSnap.exists()) {
                await updateDoc(docRef, {"user.riskFactor": riesgo});
                if(riesgo==docSnap.data().user.riskFactor){
                    MySwal.fire("El usuario ya contaba con este dato");
                    user.email="ya contaba"
                }else{
                if(riesgo == "true"){
                    MySwal.fire("Se registro el nuevo factor de riesgo. Por favor, recuerdele a esta persona que si tiene turnos puede cancelarlos y pedir otros con mayor prioridad");
                    user.email="listo"
                }else{
                    MySwal.fire(`Se registro el nuevo factor de riesgo`);
                    user.email="listo"
                }
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

                <div className='barra'>
                    <img src={Logo_VacunAssist_1} width={200} alt="VacunAssist Logo"/>
                </div>

                <button className="botonbarravacunador"><a href="./HomeVaccinator">VOLVER A HOME</a></button>

                <br></br>
                <br></br>
                <h1 className="text-x1 mb-4"><b><big>Bienvenido vacunador</big></b></h1>
                

                    <h1><b><big>Modificar factor de riesgo</big></b></h1>
                    <form onSubmit={submitRiesgo}>
                        <div className='mb-3'> 
                            <label className='form-label'>Email (entre parentesis si tiene riesgo actualmente): </label>
                            <input type="search" name="email" list="personas" onChange={handleChange} autocomplete="off" inlist="personas"></input>
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
                        <button className="botonbarravacunador" onClick={submitRiesgo}>REGISTRAR NUEVO FACTOR DE RIESGO</button>
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