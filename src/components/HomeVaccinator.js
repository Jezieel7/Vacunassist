import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react';
import {getDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from "../firebase";
import Logo_VacunAssist_1 from '../img/Logo_VacunAssist_1.png';

export default function Record(){
    const {user, logout, loading} = useAuth();
    const handleLogout = async () => {
        await logout();
    }
    if(loading) return <h1>loading</h1>  
  return (
    <div className='container'>
            <div className='row'>
                <div className='col'>
                <img src={Logo_VacunAssist_1} width={200} alt="VacunAssist Logo"/> 
                <h1 className="text-x1 mb-4">Bienvenido vacunador {user.email}</h1>
                    <div className="text-x1 mb-4">
                        <br></br>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" >VER PERSONAS CON TURNO HOY</button>
                    </div>
                    <div className="text-x1 mb-4">
                        <br></br>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={handleLogout}>CERRAR SESIÓN</button>
                    </div> 
                </div>
            </div>
        </div>
  )
}
