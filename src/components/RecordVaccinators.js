import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react'
import {getDoc, doc} from 'firebase/firestore';
import { db } from "../firebase"; 
//import "bootstrap/dist/css/bootstrap.min.css" para ver todo re loko

export default function RecordVaccinators(){
    const { user } = useAuth();

  return (
        <div className='container'>
            <h1 className="text-x1 mb-4">Bienvenido administrador {user.email}</h1>
            <div className="text-x1 mb-4">
                <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./HomeAdmin">VOLVER A HOME</a></button>
            </div>
            <table className="shadow-lg bg-white">
            <thead>
            <tr>
                <th className="bg-green-100 border text-left px-20 py-1">Vacuna</th>
                <th className="bg-green-100 border text-left px-20 py-1">Dosis</th>
                <th className="bg-green-100 border text-left px-20 py-1">Fecha</th>
                <th className="bg-green-100 border text-left px-20 py-1">Observaciones</th>
            </tr>
            </thead>
            <tbody>
            
            </tbody>
        </table>
        </div>
  )

}