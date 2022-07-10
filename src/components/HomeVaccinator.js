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

                <div className='barra'>
                    <img src={Logo_VacunAssist_1} width={200} alt="VacunAssist Logo"/>
                </div>

                <button className="botonbarravacunador"> <a href="./recordTurnToday">VER PERSONAS CON TURNO HOY</a></button>

                <button className="botonbarravacunador" ><a href="./RegisterOnlyVaccinators">REGISTRAR PERSONA</a></button>

                <button className="botonbarravacunador" ><a href="./registerAppliedDose">REGISTRAR DOSIS APLICADA</a></button>

                <button className="botonbarravacunador" ><a href="./ModificarFactorRiesgo">MODIFICAR FACTOR DE RIESGO</a></button>

                <button className="botonbarravacunador" onClick={handleLogout}>CERRAR SESIÓN</button>

                <h1 className="text-x1 mb-4"><b><big>Bienvenido vacunador {user.email}</big></b></h1>

                </div>
            </div>
        </div>
  )
}
