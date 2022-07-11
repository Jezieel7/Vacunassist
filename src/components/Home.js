import { useAuth } from "../context/AuthContext";
import { getAuth } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import {getDoc, doc, updateDoc, query, getDocs, collection} from 'firebase/firestore';
import { db } from "../firebase";
import Logo_VacunAssist_1 from '../img/Logo_VacunAssist_1.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
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
    const [vacunatorios, setVacunatorios] = useState( [] ); 
    const [mati, setMati] = useState( 0 );

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
        MySwal.fire("Se modifico el vacunatorio de preferencia");
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
        getListadoVacunatorios("Vacunatorio"); 
        // eslint-disable-next-time
    }, [])   
    
    const getListadoVacunatorios = async (string) => { 
        const listado = query(collection(db, string)); 
        var arr1= []; 
        const querySnapshot1 = await getDocs(listado); 
        querySnapshot1.forEach((doc) => { 
            arr1.push(doc.data()); 
        }); 
        arr1 = [...new Set(arr1)]; 
        setVacunatorios(arr1);
        setMati(1);
    }

    if(loading) return <h1>loading</h1>
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                <div className='barra'>
                    <img src={Logo_VacunAssist_1} width={200} alt="VacunAssist Logo"/>
                </div>
                <button className="botonbarra"><a href="./">VER MIS TURNOS</a></button>
                <button className="botonbarra"><a href="./record">VER MI HISTORIAL DE VACUNACIÓN</a></button>
                <button className="botonbarra" onClick={handleLogout}>CERRAR SESIÓN</button>
                <br></br>
                <h1 className="text-x1 mb-4"><b><big>Bienvenido a VacunAssist {user.email}</big></b></h1>
                        
                    <h1><b><big>Mis datos</big></b></h1>
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
                            <label className='form-label'>Dosis de COVID-19: </label>
                            <input value={doseAmountCovid} onChange={(e) => setDoseAmountCovid(e.target.value)} type="number" className='form-control' min={0} max={2} disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Vacuna de la gripe: </label>
                            {hasVaccineFlu === "true" ? "Si" : "No"}  
                            <br></br> 
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Fecha que se dió vacuna de la gripe: </label>
                            <input value={vaccinationDateFlu} onChange={(e) => setVaccinationDateFlu(e.target.value)} type="text" className='form-control'disabled/>    
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Vacuna de la fiebre amarilla: </label>
                            {hasYellowFever === "true" ? "Si" : "No"}  
                            <br></br>                                
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Año que se dió la vacuna de la fiebre amarilla: </label>
                            <input value={doseYearYellowFever} onChange={(e) => setDoseYearYellowFever(e.target.value)} type="number" className='form-control' min={1900} max={2022}disabled/>    
                        </div>
                        <div className='mb-3'>
                            {mati == 1 ?
                            <label className='form-label'>Centro de vacunación de preferencia: {(zone == 1 || zone == 2 || zone == 3) ? vacunatorios[zone-1].nombre : zone}</label> : ""}                          
                            {mati == 1 ? 
                            <div>
                            <br></br>
                            <input type="radio" name="zone" className='form-control' value={1} onChange={(e) => setZone(e.target.value)} /> {vacunatorios[0].nombre} {vacunatorios[0].direccion}
                            <br></br>
                            <input type="radio" name="zone" className='form-control' value={2} onChange={(e) => setZone(e.target.value)} /> {vacunatorios[1].nombre} {vacunatorios[1].direccion}
                            <br></br>
                            <input type="radio" name="zone" className='form-control' value={3} onChange={(e) => setZone(e.target.value)} /> {vacunatorios[2].nombre} {vacunatorios[2].direccion}
                            </div> : " "}                                   
                        </div>
                        <button type='submit' className="botonbarra">ACTUALIZAR CENTRO DE VACUNACION DE PREFERENCIA</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Home;