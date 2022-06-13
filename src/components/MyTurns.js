import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react'
import {getDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
export default function MyTurns(){
    const { user, logout, loading } = useAuth();
    const [ turnCovid, setTurnCovid ] = useState('');
    const [ turnFlu, setTurnFlu ] = useState('');
    const [ turnYellowFever, setTurnYellowFever ] = useState('');
    const [ hasYellowFever, setHasYellowFever ] = useState('');
    const [age, setAge] = useState(0)
    let numberaux = 0;

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
    const update = async (e) => { //e es un evento
        e.preventDefault(); //para evitar comportamiento por defecto
        const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
        if (numberaux==1){
            e.cancelable(); //esta funcion no existe, aun asi lo que tiene que hacer lo hace asi que estamos bien. Cancelable hace que no se ejecute mas de un Sweet.
            //console.log("se cancelo el evento xD")
        }
        if((turnYellowFever !== "Solicitud aceptada. Se te asignará un turno en los próximos días")&&(numberaux==0)){
            await updateDoc(product, {"user.turnYellowFever": "Solicitud aceptada. Se te asignará un turno en los próximos días"});//dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
            MySwal.fire("Solicitud aceptada. Se te asignará un turno en los próximos días.");
            numberaux++;
        }
        else
            numberaux=0; //esto para testing, borrar si algo sale mal
    }
    const getProductById = async (id) => {
        const userRef = doc(db,id);
        const snapshot = await getDoc(userRef);
        if(snapshot.exists()){
            setAge(calculoDeEdad(snapshot.data().user.birthDate))
            setTurnCovid(snapshot.data().user.turnCovid);
            setTurnFlu(snapshot.data().user.turnFlu);
            setTurnYellowFever(snapshot.data().user.turnYellowFever);
            setHasYellowFever(snapshot.data().user.hasYellowFever);
        }else{
            console.log('el producto no existe');
        }
    }
    useEffect( () => {
        getProductById(`Persona/${user.email}`);
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
                    <h1 className="text-x1 mb-4">Bienvenido a VacunAssist {user.email}</h1>
                    <div className="text-x1 mb-4">
                    <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={handleLogout}>CERRAR SESIÓN</button>
                    <br></br>
                    </div>
                    <div className="text-x1 mb-4">  
                    <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./data">VER MI PERFIL</a></button>
                    <br></br>
                    </div>
                    <div className="text-x1 mb-4">    
                    <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./record">VER MI HISTORIAL DE VACUNACIÓN</a></button>
                    </div>
                    <h1>Mis Turnos</h1>
                    <form onSubmit={update}>
                        <div className='mb-3'>
                            <label className='form-label'>Turno de la vacuna COVID-19: </label>
                            <input value={turnCovid} type="text" size={82} className='form-control' disabled/>     
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Turno de la vacuna de gripe: </label>
                            <input value={turnFlu} type="text" size={84} className='form-control' disabled/>   
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Turno de la vacuna de fiebre amarilla: </label>
                            <input value={turnYellowFever} type="text" size={75} className='form-control' disabled/>      
                        </div>
                        {((turnYellowFever !== "Solicitud aceptada. Se te asignará un turno en los próximos días")&&(numberaux==0)&&(hasYellowFever !== "true")&&(age<60)) ?
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={update}>SOLICITAR VACUNA DE FIEBRE AMARILLA </button> : 
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={update} disabled>SOLICITAR VACUNA DE FIEBRE AMARILLA </button>
                        }
                        <p>Direcciones de vacunatorios: Municipalidad (51 e/10 y 11 Nro. 770), Terminal (3 e/ 41 y 42 Nro. 480), Cementerio (138 e/73 y 74 Nro. 2035).</p>
                    </form>
                </div>
            </div>
        </div>
    )
}