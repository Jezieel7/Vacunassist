import { useAuth } from "../context/AuthContext";
import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
export default function ModificarFactorRiesgo(){
    const [ error, setError ] = useState();
    const { logout, loading } = useAuth();
    const [ riesgo, setRiesgo] = useState('');
    const [ user, setUser ] = useState({
        email: ''
    });

    const handleChange = ({target: {name, value}}) => {
        if(name === "email"){
            setUser({...user, [name]: value});
        }else{
            setRiesgo(value);
        }
    };

    const submitRiesgo = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const docRef = doc(db,`Persona/${user.email}`);
            const docSnap = await getDoc(docRef); 
            if (docSnap.exists()) {
                await updateDoc(docRef, {"user.riskFactor": riesgo});
                if(riesgo == "true")
                    MySwal.fire("Por favor, recuerdele a esta persona que si tiene turnos puede cancelarlos y pedir otros con mayor prioridad");
                else
                    MySwal.fire(`Se registro el nuevo factor de riesgo`);
            } else {
                MySwal.fire(`El email ingresado no pertenece a un usuario del sistema`);
                throw error;
            }
        } catch (error) {
            setError(error.message);
        }
    }
    if(loading) return <h1>loading</h1>
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <div className="text-x1 mb-4">
                        <br></br>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./HomeVaccinator">VOLVER A HOME</a></button>
                    </div>
                    <h1>Modificar factor de riesgo</h1>
                    <form onSubmit={submitRiesgo}>
                        <div className='mb-3'>
                            <label className='form-label'>Email del usuario: </label>
                            <input type="email" className='form-control' name="email" value={user.email} onChange={handleChange}/>     
                        </div>
                        <div className='mb-3'> 
                            <label className='form-label' htmlFor="riskFactor">Actualizar riesgo: </label>
                            <input type="radio" name="riskFactor" className='form-control' value={true} onChange={handleChange} required/> Si
                            <input type="radio" name="riskFactor" className='form-control' value={false} onChange={handleChange} required/> No
                        </div>
                        <button onClick={submitRiesgo}>Registrar nuevo factor de riesgo</button>
                    </form>
                </div>
            </div>
        </div>
    )
}