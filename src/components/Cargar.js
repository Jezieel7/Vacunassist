import React, { useState, useEffect } from 'react';
import {getDoc, doc, updateDoc, query, getDocs, collection} from 'firebase/firestore';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { db, asignTurn} from "../firebase";
import Logo_VacunAssist_1 from '../img/Logo_VacunAssist_1.png';
export function Cargar(){
    const {user, loading} = useAuth();
    const [error, setError] = useState();
    const navigate = useNavigate();
    const [birthDate, setBirthDate] = useState('');
    const [zone, setZone] = useState('');
    const [doseAmountCovid, setDoseAmountCovid] = useState('');
    const [doseYearYellowFever, setDoseYearYellowFever] = useState('');
    const [hasVaccineFlu, setHasVaccineFlu] = useState('');
    const [hasYellowFever, setHasYellowFever] = useState('');
    const [riskFactor, setRiskFactor] = useState('');
    const [vaccinationDateFlu, setVaccinationDateFlu] = useState('');
    const [turnCovid, setTurnCovid] = useState('');
    const [turnFlu, setTurnFlu] = useState('');
    const [turnYellowFever, setTurnYellowFever] = useState('');
    const [vacunatorios, setVacunatorios] = useState( [] ); 
    const [mati, setMati] = useState( 0 );

    const getProductById = async (id) => {
        const userRef = doc(db,id);
        const snapshot = await getDoc(userRef);
        if(snapshot.exists()){
            setBirthDate(snapshot.data().user.birthDate);
            setZone(snapshot.data().user.zone);
            setDoseAmountCovid(snapshot.data().user.doseAmountCovid);
            setDoseYearYellowFever(snapshot.data().user.doseYearYellowFever);
            setHasVaccineFlu(snapshot.data().user.hasVaccineFlu);
            setHasYellowFever(snapshot.data().user.hasYellowFever);
            setRiskFactor(snapshot.data().user.riskFactor);
            setVaccinationDateFlu(snapshot.data().user.vaccinationDateFlu);
        }else{
            console.log('el producto no existe');
        }
    }
    useEffect( () => {
        getProductById(`Persona/${user.email}`);
        getListadoVacunatorios("Vacunatorio"); 
        // eslint-disable-next-time
    }, [])
    if(loading) return <h1>loading</h1>
    function calculoDeEdad(BirthDate) {
        let hoy = new Date();
        let cumpleanios = new Date(BirthDate);
        let edad = hoy.getFullYear() - cumpleanios.getFullYear();
        let m = hoy.getMonth() - cumpleanios.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanios.getDate())) {
            edad--;
        }
        return edad;
    }
    function calculoGripe(vaccinationDateFlu){
        let hoy = new Date();
        let ultimaVacGripe = new Date(vaccinationDateFlu);
        let anios= hoy.getFullYear() - ultimaVacGripe.getFullYear();
        let m = hoy.getMonth() - ultimaVacGripe.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < ultimaVacGripe.getDate())) {
            anios--;
        }
        return anios;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let boolCovid = false; 
            let boolFlu = false; 
            if((calculoDeEdad(user.birthDate) > 60)){ 
                if((user.doseAmountCovid < 2)){ 
                    boolCovid = true; //AUTOMATICO, DE RIESGO = MAYOR DE 60, CON MENOS DE 2 DOSIS
                } 
            }else{ 
                if(user.riskFactor === "true"){
                    if(user.doseAmountCovid < 2){
                        boolCovid = true; //AUTOMATICO, DE RIESGO = MENOR DE 60, PERO CON FACTORES DE RIESGO Y MENOS DE 2 DOSIS
                    }  
                }else{
                    if(user.doseAmountCovid < 2){
                        boolCovid = true; //MANUAL, NO ES DE RIESGO = MENOR DE 60, MENOS DE 2 DOSIS
                    }
                }
            }
            if((calculoDeEdad(user.birthDate) < 18)){
                boolCovid= false;
            }    
            //VACUNA GRIPE 
            if(user.hasVaccineFlu === "false"){ //MIRAR CASO DE SI TIENE +60 AÑOS, SIN VACUNA, Y CON VACUNA VENCIDA, ESTO EN FIREBASE.JS
                boolFlu = true; //AUTOMATICO, NO TIENE VACUNA GRIPE
            }else{
                if(calculoGripe(user.vaccinationDateFlu)>=1){ 
                    boolFlu = true; //AUTOMATICO, TIENE VACUNA GRIPE VENCIDA
                }
            }
            //AVISOS 
            if(boolCovid && boolFlu){ 
                alert("Se le asigno una vacuna para el covid y para la gripe"); 
            }else if(boolCovid){ 
                alert("Se le asigno una vacuna para el covid"); 
            }else if(boolFlu){ 
                alert("Se le asigno una vacuna para la gripe"); 
            }
            const userRef= doc(db,`Persona/${user.email}`) //traemos todos los datos a product
            await updateDoc(userRef, {"user.zone": zone, "user.doseAmountCovid": doseAmountCovid, "user.doseYearYellowFever": doseYearYellowFever, "user.hasVaccineFlu": hasVaccineFlu, "user.hasYellowFever": hasYellowFever, "user.riskFactor": riskFactor, "user.vaccinationDateFlu": vaccinationDateFlu,"user.notificar": "1"}) //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
            asignTurn(birthDate, turnCovid, turnFlu, turnYellowFever, doseAmountCovid, vacunatorios[zone-1].nombre, riskFactor, hasVaccineFlu, vaccinationDateFlu, user.email);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };
     
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

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='col'>
                    <div className='barra'>
                        <img src={Logo_VacunAssist_1} width={200} alt="VacunAssist Logo"/>
                    </div>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor="zone"><b><big>Vacunatorio de preferencia</big></b></label>
                            {mati == 1 ? 
                            <div>
                            <br></br>
                            <input type="radio" name="zone" className='form-control' value={1} onChange={(e) => setZone(e.target.value)} required/> {vacunatorios[0].nombre} {vacunatorios[0].direccion}
                            <br></br>
                            <input type="radio" name="zone" className='form-control' value={2} onChange={(e) => setZone(e.target.value)} required/> {vacunatorios[1].nombre} {vacunatorios[1].direccion}
                            <br></br>
                            <input type="radio" name="zone" className='form-control' value={3} onChange={(e) => setZone(e.target.value)} required/> {vacunatorios[2].nombre} {vacunatorios[2].direccion}
                            </div> : ""}
                        </div>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor="riskFactor">¿Sos una persona con factores de riesgo?</label>
                            <input type="radio" name="riskFactor" className='form-control' value={true} onChange={(e) => setRiskFactor(e.target.value)} required/> Si
                            <input type="radio" name="riskFactor" className='form-control' value={false} onChange={(e) => setRiskFactor(e.target.value)} required/> No 
                        </div>
                        <h1><b><big>Datos Vacuna COVID-19</big></b></h1>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor="doseAmountCovid">Cantidad de dosis de COVID-19 recibidas</label>
                            <input type="number" name="doseAmountCovid" className='form-control' onChange={(e) => setDoseAmountCovid(e.target.value)} required min={0} max={2}/>    
                        </div>
                        <h1><b><big>Datos Vacuna GRIPE</big></b></h1>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor="hasVaccineFlu">¿Posee la vacuna para la gripe?</label>
                            <input type="radio" name="hasVaccineFlu" className='form-control' value={true} onChange={(e) => setHasVaccineFlu(e.target.value)} required/> Si
                            <input type="radio" name="hasVaccineFlu" className='form-control' value={false} onChange={(e) => setHasVaccineFlu(e.target.value)} required/> No
                        </div>
                        { (hasVaccineFlu === "true") ?
                        <div className='mb-3'>
                            <label className='form-label' htmlFor="vaccinationDateFlu">¿En qué fecha se la dió?</label>
                            <input type="date" name="vaccinationDateFlu" className='form-control' onChange={(e) => setVaccinationDateFlu(e.target.value)} required />    
                        </div>
                        : ""} 
                        <h1><b><big> Datos Vacuna FIEBRE AMARILLA</big></b></h1>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor="hasYellowFever">¿Tiene la vacuna de la fiebre amarilla?</label>
                            <input type="radio" name="hasYellowFever" className='form-control' value={true} onChange={(e) => setHasYellowFever(e.target.value)} required/> Si 
                            <input type="radio" name="hasYellowFever" className='form-control' value={false} onChange={(e) => setHasYellowFever(e.target.value)} required/> No
                        </div>
                        { (hasYellowFever === "true") ?
                        <div className='mb-3'>
                            <label className='form-label' htmlFor="doseYearYellowFever">Año en que se la aplicó</label>
                            <input type="number" name="doseYearYellowFever" className='form-control' onChange={(e) => setDoseYearYellowFever(e.target.value)} min={1900} max={2022} required/>    
                        </div>
                        : ""}
                        <button>Cargar datos</button>
                    </div>
                </div>
            </form>
      </div>
    )
}