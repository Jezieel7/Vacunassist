import { useAuth } from "../context/AuthContext";
import { getAuth } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import {getDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from "../firebase";
import Logo_VacunAssist_1 from '../img/Logo_VacunAssist_1.png';
export function Home(){
    const {user, logout, loading, resetPassword} = useAuth();
    const handleLogout = async () => {
        await logout();
    }
    const [ name, setName ] = useState(''); //valor x defecto
    const [LastName, setLastName] = useState(''); //valor x defecto
    const [birthDate, setBirthDate] = useState('');
    const [DNI, setDNI] = useState('');
    const [password, setPassword] = useState('');
    const [zone, setZone] =useState('');
    const [doseAmountCovid, setDoseAmountCovid] =useState('');
    const [doseYearYellowFever, setDoseYearYellowFever] =useState('');
    const [hasVaccineFlu, setHasVaccineFlu] =useState('');
    const [hasYellowFever, setHasYellowFever] =useState('');
    const [riskFactor, setRiskFactor] =useState('');
    const [vaccinationDateFlu, setVaccinationDateFlu] =useState('');
    const [email, setEmail] =useState('');
    const [key, setKey] =useState('');

    const update = async (e) => { //e es un evento
        e.preventDefault(); //para evitar comportamiento por defecto
        const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
        const snapshot = await getDoc(product);
        if(password != snapshot.data().user.password){
            await resetPassword(user.email);
            console.log('se te mando un mail')
        }
        await updateDoc(product, {"user.name": name, "user.LastName": LastName, "user.birthDate": birthDate, "user.DNI": DNI
        , "user.password": password, "user.zone": zone, "user.doseAmountCovid": doseAmountCovid, "user.doseYearYellowFever": doseYearYellowFever
        , "user.hasVaccineFlu": hasVaccineFlu, "user.hasYellowFever": hasYellowFever, "user.riskFactor": riskFactor, "user.vaccinationDateFlu": vaccinationDateFlu, 
        "user.email": email, "user.key": key}); //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
    }
    const getProductById = async (id) => {
        const userRef = doc(db,id);
        const snapshot = await getDoc(userRef);
        if(snapshot.exists()){
            setName(snapshot.data().user.name);
            setLastName(snapshot.data().user.LastName);
            setBirthDate(snapshot.data().user.birthDate);
            setDNI(snapshot.data().user.DNI);
            setPassword(snapshot.data().user.password);
            setZone(snapshot.data().user.zone);
            setDoseAmountCovid(snapshot.data().user.doseAmountCovid);
            setDoseYearYellowFever(snapshot.data().user.doseYearYellowFever);
            setHasVaccineFlu(snapshot.data().user.hasVaccineFlu);
            setHasYellowFever(snapshot.data().user.hasYellowFever);
            setRiskFactor(snapshot.data().user.riskFactor);
            setVaccinationDateFlu(snapshot.data().user.vaccinationDateFlu);
            setEmail(snapshot.data().user.email);
            setKey(snapshot.data().user.key);
        }else{
            console.log('el producto no existe');
        }
    }
    useEffect( () => {
        getProductById(`Persona/${user.email}`);
        // eslint-disable-next-time
    }, [])    
    if(loading) return <h1>loading</h1>
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                <img src={Logo_VacunAssist_1} width={200} alt="VacunAssist Logo"/> 
                <h1 className="text-x1 mb-4">Bienvenido {user.email}</h1>
                    <h1>MIS DATOS</h1>
                    <form onSubmit={update}>
                        <div className='mb-3'>
                            <label className='form-label'>Nombre: </label>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='form-control' disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Apellido: </label>
                            <input value={LastName}  onChange={(e) => setLastName(e.target.value)} type="text" className='form-control' disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Fecha de Nacimiento: </label>
                            <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} type="text" className='form-control' disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>DNI: </label>
                            <input value={DNI} onChange={(e) => setDNI(e.target.value)} type="text" className='form-control' disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Clave: </label>
                            <input value={key} onChange={(e) => setKey(e.target.value)} type="text" className='form-control' disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Contraseña (si la cambias, confirmar cambio de contraseña por mail también por motivos de seguridad): </label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" className='form-control'/>  
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Dosis de COVID-19: </label>
                            <input value={doseAmountCovid} onChange={(e) => setDoseAmountCovid(e.target.value)} type="number" className='form-control' min={0} max={2} disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Vacuna de la gripe: </label>
                            {hasVaccineFlu === "true" ? "Si" : "No"}  
                            <br></br>
                            <input type="radio" name="hasVaccineFlu" className='form-control' value={true} onChange={(e) => setHasVaccineFlu(e.target.value)} disabled/> Si
                            <input type="radio" name="hasVaccineFlu" className='form-control' value={false} onChange={(e) => setHasVaccineFlu(e.target.value)} disabled/> No    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Fecha que se dió vacuna de la gripe: </label>
                            <input value={vaccinationDateFlu} onChange={(e) => setVaccinationDateFlu(e.target.value)} type="text" className='form-control'disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Vacuna de la fiebre amarilla: </label>
                            {hasYellowFever === "true" ? "Si" : "No"}  
                            <br></br>                           
                            <input type="radio" name="hasYellowFever" className='form-control' value={true} onChange={(e) => setHasYellowFever(e.target.value)}disabled /> Si 
                            <input type="radio" name="hasYellowFever" className='form-control' value={false} onChange={(e) => setHasYellowFever(e.target.value)}disabled /> No     
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Año que se dió la vacuna de la fiebre amarilla: </label>
                            <input value={doseYearYellowFever} onChange={(e) => setDoseYearYellowFever(e.target.value)} type="number" className='form-control' min={1900} max={2022}disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Centro de vacunación de preferencia: </label>                           
                            {zone}
                            <br></br>
                            <input type="radio" name="zone" className='form-control' value={"Municipalidad"} onChange={(e) => setZone(e.target.value)} /> Municipalidad (51 e/10 y 11 Nro. 770)
                            <br></br>
                            <input type="radio" name="zone" className='form-control' value={"Terminal"} onChange={(e) => setZone(e.target.value)} /> Terminal (3 e/ 41 y 42 Nro. 480)
                            <br></br>
                            <input type="radio" name="zone" className='form-control' value={"Cementerio"} onChange={(e) => setZone(e.target.value)} /> Cementerio (138 e/73 y 74 Nro. 2035)                                   
                        </div>
                        <button type='submit' className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black">ACTUALIZAR CENTRO DE VACUNACION DE PREFERENCIA</button>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={handleLogout}>CERRAR SESIÓN</button>
                    </form>
                    <div className="text-x1 mb-4">
                        <br></br>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black">
                            <a href="./">VER MIS TURNOS</a>
                        </button>
                    </div> 
                </div>
            </div>
        </div>
    )
}
export default Home;