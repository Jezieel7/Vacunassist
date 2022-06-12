import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react'
import {collection, query, where, getDocs} from 'firebase/firestore';
import { db } from "../firebase"; 
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
            <h1 className="text-x1 mb-4">Bienvenido administrador {user.email}</h1>
            <div className="text-x1 mb-4">
                <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./HomeAdmin">VOLVER A HOME</a></button>
            </div>
            <h1>Vacunadores</h1>
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