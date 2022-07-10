import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react'
import {collection, query, where, getDocs} from 'firebase/firestore';
import { db } from "../firebase"; 
import Logo_VacunAssist_1 from '../img/Logo_VacunAssist_1.png';
//import "bootstrap/dist/css/bootstrap.min.css" para ver todo re loko

export default function RecordVaccinators(){
    const { user } = useAuth();
    const [vacunadores, setVacunadores] = useState( [] )
    const [mati, setMati] = useState( 0 )

    const getVacunadores = async (string) => {
        const vaccinators = query(collection(db, string), where("user.vaccinator", "!=", false));
        const querySnapshot1 = await getDocs(vaccinators);
        var arr1= []
        querySnapshot1.forEach((doc) => {
            arr1.push(doc.data())
        }
        );
        arr1 = [...new Set(arr1)]
        setVacunadores(arr1)
        setMati(1)
    }

    useEffect( () => {
        getVacunadores("Persona");
        // eslint-disable-next-time
    }, [])
  return (
        <div className='container'>
            <div className='barra'>
                    <img src={Logo_VacunAssist_1} width={200} alt="VacunAssist Logo"/>
                </div>
            
            <div className="text-x1 mb-4">
                <button className="botonbarraadmi"><a href="./HomeAdmin">VOLVER A HOME</a></button>
            </div>

            <br></br>
            <br></br>

            <h1 className="text-x1 mb-4"><b><big>Bienvenido administrador {user.email}</big></b></h1>

            <h1><b><big>Vacunadores</big></b></h1>
            <br></br>
            <table className="shadow-lg bg-white">
            <thead>
            <tr>
                <th className="bg-green-100 border text-left px-20 py-1">Email</th>
                <th className="bg-green-100 border text-left px-20 py-1">Nombre</th>
                <th className="bg-green-100 border text-left px-20 py-1">Apellido</th>
            </tr>
            </thead>
            <tbody>
            {mati == 1 ?
            vacunadores.map( (vacunador) => (
                            <tr key={vacunador.id}>
                                <td className="border px-8 py-4">{vacunador.user.email}</td>
                                <td className="border px-8 py-4">{vacunador.user.name}</td>
                                <td className="border px-8 py-4">{vacunador.user.LastName}</td>
                            </tr>
                        )) : ""}
            </tbody>
        </table>
        </div>
  )

}