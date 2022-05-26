import { useAuth } from "../context/AuthContext";
import React from 'react'
export default function MyTurns(){
    const {user, logout, loading} = useAuth();
    const handleLogout = async () => {
        await logout();
    }
    if(loading) return <h1>loading</h1>
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                <h1 className="text-x1 mb-4">Bienvenido {
user.email
}</h1>
                    <h1>MIS Turnos</h1>
                        <div className='mb-3'>
                            <label className='form-label'>turno covid</label>
                            <input
                                value={user.turnCovid}
                                type="text"
                                className='form-control'
                                disabled
                            />
                            <input
                                value={
user.zone
}
                                type="text"
                                className='form-control'
                                disabled
                            />       
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>turno gripe</label>
                            <input
                                value={user.turnFlu} 
                                type="text"
                                className='form-control'
                                disabled
                            />
                            <input
                                value={
user.zone
}
                                type="text"
                                className='form-control'
                                disabled
                            />    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>turno fiebre amarilla</label>
                            <input
                                value={user.turnYellowFever}
                                type="text"
                                className='form-control'
                                disabled
                            />
                            <input
                                value={
user.zone
}
                                type="text"
                                className='form-control'
                                disabled
                            />       
                        </div>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={handleLogout}>CERRAR SESIÓN</button>
                </div>
            </div>
        </div>
    )
    }
