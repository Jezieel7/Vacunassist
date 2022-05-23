import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react'
import { Link,useParams } from 'react-router-dom'
import {collection, getDocs, getDoc, deleteDoc, doc, updateDoc} from 'firebase/firestore'
import { db } from "../firebase";

export function Home(){
    const {user, logout, loading} = useAuth();
    const handleLogout = async () => {
        await logout();
    }
    
    const [ name, setName ] = useState('') //valor x defecto
    const [LastName, setLastName] = useState('') //valor x defecto
    const [birthDate, setBirthDate] =useState('')

    const update = async (e) => { //e es un evento
        e.preventDefault() //para evitar comportamiento por defecto
        const product= doc(db,`Persona/${user.email}`) //traemos todos los datos a product
        await updateDoc(product, {"user.name": name, "user.LastName": LastName}) //la data son los datos actualizados, updateDoc es de firestore, para actualizar los datos
    }
    const getProductById = async (id) => {
        const userRef = doc(db,id)
        const snapshot = await getDoc(userRef)
        if(snapshot.exists()){
            setName(snapshot.data().user.name)
            setLastName(snapshot.data().user.LastName)
            setBirthDate(snapshot.data().user.birthDate)
        }else{
            console.log('el producto no existe')
        }
    }
    
    useEffect( () => {
        getProductById(`Persona/${user.email}`)
        // eslint-disable-next-time
    }, [])    
    
    if(loading) return <h1>loading</h1>

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                <h1 className="text-x1 mb-4">Bienvenido {user.email}</h1>
                    <h1>MIS DATOS</h1>
                    <form onSubmit={update}>
                        <div className='mb-3'>
                            <label className='form-label'>Nombre</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                className='form-control'
                                disabled
                            />    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Apellido</label>
                            <input
                                value={LastName} 
                                onChange={(e) => setLastName(e.target.value)}
                                type="text"
                                className='form-control'
                                disabled
                            />    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Fecha de Nacimiento</label>
                            <input
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                type="text"
                                className='form-control'
                                disabled
                            />    
                        </div>
                        <button type='submit' className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black">ACTUALIZAR DATOS</button>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={handleLogout}>CERRAR SESIÓN</button>
                    </form>
                </div>
            </div>
        </div>
    )
    }
export default Home