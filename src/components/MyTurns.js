import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react'
import { Link,useParams } from 'react-router-dom'
import {collection, getDocs, getDoc, deleteDoc, doc, updateDoc} from 'firebase/firestore'
import { db } from "../firebase";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

export default function MyTurns(){
    const {user, logout, loading} = useAuth();
    const [ turnCovid, setTurnCovid ] = useState('')
    const [ turnFlu, setTurnFlu ] = useState('')
    const [ turnYellowFever, setTurnYellowFever ] = useState('')
    const [hasYellowFever, setHasYellowFever] =useState('')
    //se debe mirar si ya tiene vacuna amarilla
    const update = async (e) => { //e es un evento
        e.preventDefault() //para evitar comportamiento por defecto
        const product= doc(db,`Persona/${user.email}`) //traemos todos los datos a product
        if(hasYellowFever == "true"){
            await updateDoc(product, {"user.turnYellowFever": ""})             
            MySwal.fire(`No puede solicitar un turno para esta vacuna, usted ya la tiene`)
        }else{
            await updateDoc(product, {"user.turnYellowFever": "Solicitud aceptada. Se te asignará un turno en los próximos días"}) //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
            MySwal.fire("Solicitud aceptada. Se te asignará un turno en los próximos días")}
    }
    const getProductById = async (id) => {
        const userRef = doc(db,id)
        const snapshot = await getDoc(userRef)
        if(snapshot.exists()){
            setTurnCovid(snapshot.data().user.turnCovid)
            setTurnFlu(snapshot.data().user.turnFlu)
            setTurnYellowFever(snapshot.data().user.turnYellowFever)
            setHasYellowFever(snapshot.data().user.hasYellowFever)
        }else{
            console.log('el producto no existe')
        }
    }
    
    useEffect( () => {
        getProductById(`Persona/${user.email}`)
        // eslint-disable-next-time
    }, [])


    const handleLogout = async () => {
        await logout();
    }
    if(loading) return <h1>loading</h1>
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                <h1 className="text-x1 mb-4">Bienvenido {user.email}</h1>
                    <h1>MIS Turnos</h1>
                    <form onSubmit={update}>
                        <div className='mb-3'>
                            <label className='form-label'>turno covid</label>
                            <input
                                value={turnCovid}
                                type="text"
                                className='form-control'
                                disabled
                            />     
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>turno gripe</label>
                            <input
                                value={turnFlu} 
                                type="text"
                                className='form-control'
                                disabled
                            />   
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>turno fiebre amarilla</label>
                            <input
                                value={turnYellowFever}
                                type="text"
                                className='form-control'
                                disabled
                            />      
                        </div>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={update}>SOLICITAR VACUNA DE FIEBRE AMARILLA</button>
                    </form>
                        <p></p>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black">
                            <a href="/">VOLVER AL MENU</a>
                        </button>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={handleLogout}>CERRAR SESIÓN</button>
                </div>
            </div>
        </div>
    )
    }
