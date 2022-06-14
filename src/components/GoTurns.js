import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect, useRef } from 'react'
import {collection, query, where, getDocs} from 'firebase/firestore';
import { db } from "../firebase"; 
import { doc, updateDoc} from 'firebase/firestore';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
export default function GoTurns(){
    const inputRef= useRef(null);
    const { user } = useAuth();
    const [personasTurnCovid, setPersonasTurnCovid] = useState([]);
    const [personasTurnYellowFever, setPersonasTurnYellowFever] = useState([]);
    const [mati, setMati] = useState(0);
    const [zone, setZone] =useState('');
    const [turn, setTurn] = useState('');
    let numberaux = 0;
    let numberaux2 = 0;
    const getPersonas = async (string) => {
        const personasCOVID = query(collection(db, string), where("user.turnCovid", "==", "Se le notifico a los administradores su solicitud de turno para la vacuna del COVID-19"));
        const personasAMARILLA = query(collection(db, string), where("user.turnYellowFever", "==", "Solicitud aceptada. Se te asignará un turno en los próximos días"));
        const querySnapshot1 = await getDocs(personasCOVID);
        const querySnapshot2 = await getDocs(personasAMARILLA);
        var arr1= [];
        var arr2= [];
        querySnapshot1.forEach((doc) => {
            arr1.push(doc.data());
        });
        querySnapshot2.forEach((doc) => {
            arr2.push(doc.data());
        });
        arr1 = [...new Set(arr1)];
        console.log(arr1.length);
        setPersonasTurnCovid(arr1);
        arr2 = [...new Set(arr2)];
        console.log(arr2.length);
        setPersonasTurnYellowFever(arr2);
        setMati(1); //este set es para que se cargue todo bien
    }
    const updateCOVID = async (e) => { //e es un evento
        e.preventDefault();
        const product= doc(db,`Persona/${inputRef.current.value}`); //traemos todos los datos a product
        if (numberaux==1){
            e.cancelable(); //esta funcion no existe, aun asi lo que tiene que hacer lo hace asi que estamos bien. Cancelable hace que no se ejecute mas de un Sweet.
            //console.log("se cancelo el evento xD")
        }
        if(numberaux==0){
            await updateDoc(product, {"user.turnCovid": turn}); //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
            numberaux++;
            MySwal.fire("Turno asignado");
        }
    }
    const updateYellow = async (e) => { //e es un evento
        e.preventDefault();
        const product= doc(db,`Persona/${inputRef.current.value}`); //traemos todos los datos a product
        console.log(inputRef.current.value);
        console.log(turn);
        console.log(turn.toString());
        console.log(turn.toString());
        if(numberaux2==1){
            e.cancelable();
        }
        if(numberaux2==0){
            await updateDoc(product, {"user.turnYellowFever": turn}); //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
            numberaux++;
            MySwal.fire("Turno asignado");
        }
    }
    useEffect( () => {
        getPersonas("Persona");
        // eslint-disable-next-time onClick={setMail(persona.user.email)}
    }, [])

  return (
    <div className='container'>
            <div className='row'>
                <div className='col'>
                    <h1 className="text-x1 mb-4">Bienvenido administrador {user.email}</h1>
                    <div className="text-x1 mb-4">
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./HomeAdmin">VOLVER A HOME</a></button>
                    </div>
                    <h1><center>TURNOS PENDIENTES</center></h1>
                    {/* aca hacer el mapeo y que por cada coincidencia que aparezca esto, en vez de name y eso iria persona.user.name*/}
                    {mati == 1 ?
                        personasTurnCovid.map( (persona) => (
                            <tr key= {persona.id}>
                            <h1>TURNO</h1>
                            <div className='mb-3'>
                                <label className='form-label'>Nombre: </label>
                                <input value={persona.user.name} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>    
                                <label className='form-label'>Apellido: </label>
                                <input value={persona.user.LastName} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>    
                                <label className='form-label'>Mail: </label>
                                <input value={persona.user.email} ref={inputRef}  type="text" className='form-control' disabled/> 
                            </div> 
                            <div className='mb-3'>  
                                <label className='form-label'>Vacunatorio de preferencia: </label>
                                <input value={persona.user.zone} type="text" className='form-control' disabled/>
                            </div>   
                            <div className='mb-3'> 
                                <label className='form-label'>vacuna: </label>
                                <input value={"COVID-19"} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>turno: </label>
                                <input name="turn" onChange={(e) => setTurn(e.target.value)}  type="text" className='form-control' />
                            </div>
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={updateCOVID}>ASIGNAR VACUNA DE COVID</button>
                            </tr>   
                        ))
                         
                        : "No hay turnos de covid "}
                    {mati == 1 ?
                        personasTurnYellowFever.map( (persona) => (
                            <tr key= {persona.id}>
                            <h1>TURNO</h1>
                            <div className='mb-3'>
                                <label className='form-label'>Nombre: </label>
                                <input value={persona.user.name} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>    
                                <label className='form-label'>Apellido: </label>
                                <input value={persona.user.LastName} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>    
                                <label className='form-label'>Mail: </label>
                                <input value={persona.user.email} ref={inputRef} type="text" className='form-control' disabled/> 
                            </div> 
                            <div className='mb-3'>  
                                <label className='form-label'>Vacunatorio de preferencia: </label>
                                <input value={persona.user.zone}  onChange={(e) => setZone(e.target.value)} type="text" className='form-control' disabled/>
                            </div>   
                            <div className='mb-3'> 
                                <label className='form-label'>vacuna: </label>
                                <input value={"FIEBRE AMARILLA"} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>turno: </label>
                                <input name="turn" onChange={(e) => setTurn(e.target.value)} type="text" className='form-control' />
                            </div>
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={updateYellow}>ASIGNAR VACUNA DE FIEBRE AMARILLA</button>
                            </tr>   
                        ))
                         
                        : " No hay turnos de Fiebre amarilla"}    
                </div>
            </div>
        </div>
  )
}