import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect, useRef } from 'react'
import {collection, query, where, getDocs, getDoc} from 'firebase/firestore';
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
    const [vacunatorios, setVacunatorios] = useState( [] ); 
    
    function calculoDeEdad(BirthDate) {
        let hoy = new Date();
        let cumpleanios = new Date(BirthDate);
        let edad = hoy.getFullYear() - cumpleanios.getFullYear();
        let m = hoy.getMonth() - cumpleanios.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanios.getDate())) {
            edad--;
        }
        return edad;
    }

    const getPersonas = async (e) => {
        const personasCOVID = query(collection(db, "Persona"), where("user.turnCovid", "==", "Se le notifico a los administradores su solicitud de turno para la vacuna del COVID-19"));
        const personasAMARILLA = query(collection(db, "Persona"), where("user.turnYellowFever", "==", "Solicitud aceptada. Se te asignará un turno en los próximos días"));
        const querySnapshot1 = await getDocs(personasCOVID);
        const querySnapshot2 = await getDocs(personasAMARILLA);
        var arr1= [];
        var arr2= [];
        var arrmail= [];
        var i;
        querySnapshot1.forEach((doc) => {
            arr1.push(doc.data());
        });
        querySnapshot2.forEach((doc) => {
            if(calculoDeEdad(doc.data().user.birthDate)>=60){
                arrmail.push(doc.data().user.email);
            }else{
                arr2.push(doc.data());
            }
        });
        arr1 = [...new Set(arr1)];
        console.log(arr1.length);
        setPersonasTurnCovid(arr1);
        arr2 = [...new Set(arr2)];
        console.log(arr2.length);
        setPersonasTurnYellowFever(arr2);
        //for por cada elemento del vector de mails mayores, actualizando turn
        for (i=0;i<arrmail.length;i++){
            const product= doc(db,`Persona/${arrmail[i]}`); //traemos todos los datos a product
            await updateDoc(product, {"user.turnYellowFever": ``});
        }
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
            const snapshot = await getDoc(product);
            var edad= calculoDeEdad(snapshot.data().user.birthDate)
            var string= snapshot.data().user.birthDate.split('-')
            string[0]= Number(string[0]) + 60;
            string[1]= Number(string[1]);
            var fstring= new Date(string[0],string[1],string[2])
            var stringturn= turn2.split('-')
            stringturn[1]= Number(stringturn[1]);
            var fturn= new Date(stringturn[0],stringturn[1],stringturn[2])
            fstring.setHours(0,0,0,0);
            fturn.setHours(0,0,0,0);
            console.log("fecha del turno "+ fturn+ "fecha limite "+ fstring +"edad "+edad)
            if((edad == 59)&&(fturn>=fstring)){
                MySwal.fire("Ingrese una fecha, que sea antes del "+ fstring.getDate()+"/"+fstring.getMonth()+"/"+fstring.getFullYear() + " ya que este usuario tiene 59 años, y la vacuna de f. amarilla no es recomendable para personas de 60 años o más");
            }
            else{
            console.log(inputRefEmail2.current.value);
            console.log(turn2);
            await updateDoc(product, {"user.turnYellowFever": `Tiene turno el día ` + fturn.getDate()+"/"+fturn.getMonth()+"/"+fturn.getFullYear() + ` a las 13:30 horas, en el vacunatorio ${inputRefZone2.current.value}`}); //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
            MySwal.fire("Turno asignado");
            emailjs.sendForm('service_043ut7d', 'template_hzbm87w', inputRefEmail2.current.value , 'YzH5_MFfCTng8tzFm')
                .then((result) => {
                    console.log(result.text);
                }, (error) => {
                    console.log(error.text);
                });
            } 
        //mandar mail
        }
    }
    const getListadoVacunatorios = async (string) => { 
        const listado = query(collection(db, string)); 
        var arr1= []; 
        const querySnapshot1 = await getDocs(listado); 
        querySnapshot1.forEach((doc) => { 
            arr1.push(doc.data()); 
        }); 
        arr1 = [...new Set(arr1)]; 
        setVacunatorios(arr1);
        setMati(1);
    }
    useEffect( () => {
        getPersonas("Persona");
        getListadoVacunatorios("Vacunatorio"); 
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
                                <label className='form-label'>vacuna: </label>
                                <input value={"COVID-19"} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'> 
                                <label className='form-label'>vacunatorio: </label>
                                {(persona.user.zone == 1 || persona.user.zone == 2 || persona.user.zone == 3) ?
                                    <input value={vacunatorios[persona.user.zone-1]} ref={inputRefZone}  type="text" className='form-control' disabled/> :
                                    <input value={persona.user.zone} ref={inputRefZone}  type="text" className='form-control' disabled/> 
                                }
                            </div>
                            </tr>   
                        ))
                         
                        : "No hay turnos de covid "}
                    {mati == 1 ?
                    <div><label className='form-label'>turno: </label>
                    <input style={{"background-color" : "lime"}} name="turn" onChange={(e) => setTurn(e.target.value)}  type="date" className='form-control' />  
                    <br></br>
                    <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"  ref={form} onClick={updateCOVID}>ASIGNAR VACUNA DE COVID</button></div> :
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
                                <label className='form-label'>vacuna: </label>
                                <input value={"FIEBRE AMARILLA"} type="text" className='form-control' disabled/>
                            </div>
                            <div className='mb-3'> 
                                <label className='form-label'>vacunatorio: </label>
                                {(persona.user.zone == 1 || persona.user.zone == 2 || persona.user.zone == 3) ?
                                    <input value={vacunatorios[persona.user.zone-1]} ref={inputRefZone2}  type="text" className='form-control' disabled/> :
                                    <input value={persona.user.zone} ref={inputRefZone2}  type="text" className='form-control' disabled/> 
                                }
                            </div>
                            </tr>   
                        ))
                        : " No hay turnos de Fiebre amarilla"}
                    {mati == 1 ?
                    <div>
                    <label className='form-label'>turno: </label>
                    <input style={{"background-color" : "yellow"}} name="turn2" onChange={(e) => setTurn2(e.target.value)} type="date" className='form-control' />
                    <br></br>  
                    <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" ref={form}  onClick={updateYellow}>ASIGNAR VACUNA DE FIEBRE AMARILLA</button>
                    </div> :
                    ""}    
                </div>
            </div>
        </div>
  )
}