import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect, useRef } from 'react'
import {collection, query, where, getDocs} from 'firebase/firestore';
import { db } from "../firebase"; 
import { doc, updateDoc} from 'firebase/firestore';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import emailjs from '@emailjs/browser'; 
import Logo_VacunAssist_1 from '../img/Logo_VacunAssist_1.png';

const MySwal = withReactContent(Swal);
export default function GoTurns(){
    const inputRefZone= useRef("vacunatorio");
    const inputRefZone2= useRef("vacunatorio")
    const inputRefEmail= useRef("mail");
    const inputRefEmail2= useRef("mail")
    const form = useRef(); 
    //const inputRef= useRef(null);
    //const inputRef2= useRef("vacunatorio")
    const { user } = useAuth();
    const [personasTurnCovid, setPersonasTurnCovid] = useState([]);
    const [personasTurnYellowFever, setPersonasTurnYellowFever] = useState([]);
    const [mati, setMati] = useState(0);
    const [zone, setZone] =useState('');
    const [turn, setTurn] = useState('');
    const [turn2, setTurn2] = useState('');
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
        if(turn!== ''){
            const product= doc(db,`Persona/${inputRefEmail.current.value}`); //traemos todos los datos a product     
            console.log(inputRefEmail.current.value);
            console.log(turn);  
            await updateDoc(product, {"user.turnCovid": `Tiene turno el día ${turn} a las 10:00 horas, en el vacunatorio ${inputRefZone.current.value}`}); //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
            MySwal.fire("Turno asignado");
            emailjs.sendForm('service_043ut7d', 'template_hzbm87w', 'matiasadorno14@gmail.com' , 'YzH5_MFfCTng8tzFm')
                .then((result) => {
                    console.log(result.text);
                }, (error) => {
                    console.log(error.text);
                }); 
        //mandar mail
        }
    }
    const updateYellow = async (e) => { //e es un evento
        e.preventDefault();
        if(turn2!== ''){
            const product= doc(db,`Persona/${inputRefEmail2.current.value}`); //traemos todos los datos a product
            console.log(inputRefEmail2.current.value);
            console.log(turn2);
            await updateDoc(product, {"user.turnYellowFever": `Tiene turno el día ${turn2} a las 13:30 horas, en el vacunatorio ${inputRefZone2.current.value}`}); //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
            MySwal.fire("Turno asignado");
            emailjs.sendForm('service_043ut7d', 'template_hzbm87w', inputRefEmail2.current.value , 'YzH5_MFfCTng8tzFm')
                .then((result) => {
                    console.log(result.text);
                }, (error) => {
                    console.log(error.text);
                }); 
        //mandar mail
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

                <div className='barra'>
                    <img src={Logo_VacunAssist_1} width={200} alt="VacunAssist Logo"/>
                </div>
                
                <div className="text-x1 mb-4">
                    <button className="botonbarraadmi"><a href="./HomeAdmin">VOLVER A HOME</a></button>
                </div>

                <br></br>
                <br></br>

                <h1 className="text-x1 mb-4"><b><big>Bienvenido administrador {user.email}</big></b></h1>
                

                    <h1><center><b><big>TURNOS PENDIENTES</big></b></center></h1>
                    {/* aca hacer el mapeo y que por cada coincidencia que aparezca esto, en vez de name y eso iria persona.user.name*/}
                    {mati == 1 ?
                        personasTurnCovid.map( (persona) => (
                            <tr key= {persona.id}>
                            <h1><b><big>TURNO</big></b></h1>
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
                                <input value={persona.user.email} ref={inputRefEmail}  type="text" className='form-control' disabled/> 
                            </div> 
                            <div className='mb-3'>  
                                <label className='form-label'>Vacunatorio de preferencia: </label>
                                <input  value={persona.user.zone} ref={inputRefZone} type="text" className='form-control' disabled/>
                            </div>   
                            <div className='mb-3'> 
                                <label className='form-label'>vacuna: </label>
                                <input value={"COVID-19"} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>turno: </label>
                                <input style={{"background-color" : "lime"}} name="turn" onChange={(e) => setTurn(e.target.value)}  type="date" className='form-control' />
                            </div>
                            </tr>   
                        ))
                        
                         
                        : "No hay turnos de covid "}
                    {mati == 1 ?  
                    <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"  ref={form} onClick={updateCOVID}>ASIGNAR VACUNA DE COVID</button> :
                    ""}
                    {mati == 1 ?
                        personasTurnYellowFever.map( (persona) => (
                            <tr key= {persona.id}>
                            <h1>TURNO</h1>
                            <div className='mb-3'>
                                <label className='form-label'>Nombre: </label>
                                <input value={persona.user.name} name="name2" type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>    
                                <label className='form-label'>Apellido: </label>
                                <input value={persona.user.LastName} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>    
                                <label className='form-label'>Mail: </label>
                                <input value={persona.user.email} name="email2" ref={inputRefEmail2} type="text" className='form-control' disabled/> 
                            </div> 
                            <div className='mb-3'>  
                                <label className='form-label'>Vacunatorio de preferencia: </label>
                                <input  value={persona.user.zone} ref={inputRefZone2} type="text" className='form-control' disabled/>
                            </div>   
                            <div className='mb-3'> 
                                <label className='form-label'>vacuna: </label>
                                <input value={"FIEBRE AMARILLA"} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>turno: </label>
                                <input style={{"background-color" : "yellow"}} name="turn2" onChange={(e) => setTurn2(e.target.value)} type="date" className='form-control' />
                            </div>
                            </tr>   
                        ))
                         
                        : " No hay turnos de Fiebre amarilla"}
                    {mati == 1 ?  
                    <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" ref={form}  onClick={updateYellow}>ASIGNAR VACUNA DE FIEBRE AMARILLA</button> :
                    ""}    
                </div>
            </div>
        </div>
  )
}