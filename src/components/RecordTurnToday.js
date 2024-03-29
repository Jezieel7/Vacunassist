import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react'
import {query, where, getDocs, collection} from 'firebase/firestore';
import { db } from "../firebase"; 
import Logo_VacunAssist_1 from '../img/Logo_VacunAssist_1.png';

//import "bootstrap/dist/css/bootstrap.min.css" para ver todo re loko

export default function RecordTurnToday(){
    const { user } = useAuth();
    let hoy = new Date();
    let today = ''
    {hoy.getMonth() < 9 ? 
        today = `${hoy.getDate()}/${hoy.getMonth()+1}/${hoy.getFullYear()}` : 
        today = `${hoy.getDate()}/${hoy.getMonth()+1}/${hoy.getFullYear()}` }
    const [personas, setPersonas] = useState( [] )
    const [personas2, setPersonas2] = useState( [] )
    const [personas3, setPersonas3] = useState( [] )
    const [mati, setMati] = useState( 0 )
    const [vacunatorios, setVacunatorios] = useState( [] );

    const getCadaPersonaFiltrar = async (string) => {
        const flu = query(collection(db, string), where("user.turnFlu", "!=", ""));
        const covid = query(collection(db, string), where("user.turnCovid", "!=", ""));
        const yellow = query(collection(db, string), where("user.turnYellowFever", "!=", ""));
        var arr1= []
        var arr2= []
        var arr3= []
        const querySnapshot1 = await getDocs(flu);
        querySnapshot1.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let aux1= doc.data().user.turnFlu.split(' ')
        if (aux1[4] == today){
            if(!personas.includes(doc.data()))
                arr1.push(doc.data())
        }
        });
        const querySnapshot2 = await getDocs(covid);
        querySnapshot2.forEach((doc) => {
        let aux2= doc.data().user.turnCovid.split(' ')
        if (aux2[4] == today){
            if(!personas2.includes(doc.data()))
                arr2.push(doc.data())
        }
        });
        
        const querySnapshot3 = await getDocs(yellow);
        querySnapshot3.forEach((doc) => {
        let aux3= doc.data().user.turnYellowFever.split(' ')
        if (aux3[4] == today){
          if(!personas3.includes(doc.data()))
                arr3.push(doc.data())
        }
        });
        arr1 = [...new Set(arr1)]
        arr2 = [...new Set(arr2)]
        arr3 = [...new Set(arr3)]
        setPersonas(arr1)
        setPersonas2(arr2)
        setPersonas3(arr3)

        const listado = query(collection(db, "Vacunatorio")); 
        var arr1= []; 
        const otra = await getDocs(listado); 
        otra.forEach((doc) => { 
            arr1.push(doc.data()); 
        }); 
        arr1 = [...new Set(arr1)]; 
        setVacunatorios(arr1);
        setMati(1);
        
    }

    useEffect( () => {
        getCadaPersonaFiltrar("Persona");
        // eslint-disable-next-time
    }, [])

  return (
        <div className='container'>

            <div className='barra'>
                    <img src={Logo_VacunAssist_1} width={200} alt="VacunAssist Logo"/>
            </div>


            <div className="text-x1 mb-4">
                {user.email=="lautaro@gmail.com"? 
                <button className="botonbarraadmi"><a href="./HomeAdmin">VOLVER A HOME</a></button>:
                <button className="botonbarravacunador"><a href="./HomeVaccinator">VOLVER A HOME</a></button>
                }
            </div>
            <br></br>
            <br></br>
            {user.email=="lautaro@gmail.com"? 
            <h1 className="text-x1 mb-4"><b><big>Bienvenido administrador {user.email}</big></b></h1>:
            <h1 className="text-x1 mb-4"><b><big>Bienvenido vacunador {user.email}</big></b></h1>
            }
   
            <h1><center><b><big>Personas con turno hoy, {today}</big></b></center></h1>
            <br></br>
            <table className="shadow-lg bg-white">
            <thead>
            <tr>
                <th className="bg-green-100 border text-left px-20 py-1">Email</th>
                <th className="bg-green-100 border text-left px-20 py-1">Nombre</th>
                <th className="bg-green-100 border text-left px-20 py-1">Apellido</th>
                <th className="bg-green-100 border text-left px-20 py-1">DNI</th>
                <th className="bg-green-100 border text-left px-20 py-1">Vacuna</th>
                <th className="bg-green-100 border text-left px-20 py-1">Dosis</th>
                <th className="bg-green-100 border text-left px-20 py-1">Vacunatorio</th>
            </tr>
            </thead>
            <tbody>
            {(mati == 1) ?
            personas.map( (persona) => (
                            <tr key={persona.id}>
                                <td className="border px-8 py-4">{persona.user.email}</td>
                                <td className="border px-8 py-4">{persona.user.name}</td>
                                <td className="border px-8 py-4">{persona.user.LastName}</td>
                                <td className="border px-8 py-4">{persona.user.DNI}</td>
                                <td className="border px-8 py-4">Gripe</td>
                                <td className="border px-8 py-4">-</td>
                                {(persona.user.zone == 1 || persona.user.zone == 2 || persona.user.zone == 3) ?
                                    <td className="border px-8 py-4">{vacunatorios[persona.user.zone-1].nombre}</td> :
                                    <td className="border px-8 py-4">{persona.user.zone}</td>
                                }
                            </tr>
                        )) : ""}
            {mati == 1 ?
            personas2.map( (persona) => (
                            <tr key={persona.id}>
                                <td className="border px-8 py-4">{persona.user.email}</td>
                                <td className="border px-8 py-4">{persona.user.name}</td>
                                <td className="border px-8 py-4">{persona.user.LastName}</td>
                                <td className="border px-8 py-4">{persona.user.DNI}</td>
                                <td className="border px-8 py-4">Covid</td>
                                <td className="border px-8 py-4">{persona.user.doseAmountCovid == "0" ? "Primera" : "Segunda"}</td>
                                {(persona.user.zone == 1 || persona.user.zone == 2 || persona.user.zone == 3) ?
                                    <td className="border px-8 py-4">{vacunatorios[persona.user.zone-1].nombre}</td> :
                                    <td className="border px-8 py-4">{persona.user.zone}</td>
                                }
                            </tr>
                        )) : ""}
            {mati == 1 ?
            personas3.map( (persona) => (
                            <tr key={persona.id}>
                                <td className="border px-8 py-4">{persona.user.email}</td>
                                <td className="border px-8 py-4">{persona.user.name}</td>
                                <td className="border px-8 py-4">{persona.user.LastName}</td>
                                <td className="border px-8 py-4">{persona.user.DNI}</td>
                                <td className="border px-8 py-4">Fiebre amarilla</td>
                                <td className="border px-8 py-4">-</td>
                                {(persona.user.zone == 1 || persona.user.zone == 2 || persona.user.zone == 3) ?
                                    <td className="border px-8 py-4">{vacunatorios[persona.user.zone-1].nombre}</td> :
                                    <td className="border px-8 py-4">{persona.user.zone}</td>
                                }
                            </tr>
                        )) : ""}
            </tbody>
        </table>
        </div>
  )

}