import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs} from "firebase/firestore";
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toBeDisabled } from "@testing-library/jest-dom/dist/matchers";

const MySwal = withReactContent(Swal);
export function RegisterAppliedDose(){
    const [ error, setError ] = useState();
    const { logout, loading } = useAuth();
    const [ vaccination, setVaccination] = useState({
        type: '',
        dose: '',
        vaccinationDate: (new Date().getFullYear() + "-0" + (new Date().getMonth()+1) + "-" + new Date().getDate()),
        observations: '',
        presence: ''
    });
    let hoy = new Date();
    let today = ''
    {hoy.getMonth() < 9 ? 
     today = `${hoy.getFullYear()}-0${hoy.getMonth()+1}-${hoy.getDate()}` : 
     today = `${hoy.getFullYear()}-${hoy.getMonth()+1}-${hoy.getDate()}` }
    const [personas, setPersonas] = useState( [] );
    const [personas2, setPersonas2] = useState( [] )
    const [personas3, setPersonas3] = useState( [] )
    const [mati, setMati] = useState( 0 );
    const [emailsFlu, setEmailsFlu] = useState( [] )
    const [emailsCovid, setEmailsCovid] = useState( [] )
    const [emailsYellow, setEmailsYellow] = useState( [] )

    const getPersonasConTurno = async (string) => {
        const flu = query(collection(db, string), where("user.turnFlu", "!=", ""));
        const covid = query(collection(db, string), where("user.turnCovid", "!=", ""));
        const yellow = query(collection(db, string), where("user.turnYellowFever", "!=", ""));
        var arr1= [];
        var arr2= [];
        var arr3= [];
        const querySnapshot1 = await getDocs(flu);
        querySnapshot1.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let aux1= doc.data().user.turnFlu.split(' ')
        if (aux1[4] == today){
            if(!personas.includes(doc.data()))
                arr1.push(doc.data());
                emailsFlu.push(doc.data().user.email)
        }
        });
        const querySnapshot2 = await getDocs(covid);
        querySnapshot2.forEach((doc) => {
        let aux2= doc.data().user.turnCovid.split(' ');
        if (aux2[4] == today){
            if(!personas2.includes(doc.data()))
                arr2.push(doc.data());
                emailsCovid.push(doc.data().user.email)
        }
        });
        
        const querySnapshot3 = await getDocs(yellow);
        querySnapshot3.forEach((doc) => {
        let aux3= doc.data().user.turnYellowFever.split(' ');
        if (aux3[4] == today){
          if(!personas3.includes(doc.data()))
                arr3.push(doc.data());
                emailsYellow.push(doc.data().user.email)
        }
        });
        arr1 = [...new Set(arr1)];
        arr2 = [...new Set(arr2)];
        arr3 = [...new Set(arr3)];
        setPersonas(arr1);
        setPersonas2(arr2)
        setPersonas3(arr3)
        setMati(1);
    }

    useEffect( () => {
        getPersonasConTurno("Persona");
        // eslint-disable-next-time
    }, [])

    const [ user, setUser ] = useState({
        email: 'default'
    });

    const handleLogout = async () => {
        await logout();
    }

    const handleChange = ({target: {name, value}}) => {
        if(name == "email"){
            setUser({...user, [name]: value});
        }else{
            setVaccination({...vaccination, [name]: value});
        }
    };
    
    const addVaccinationTurnDataCovid = (userTurns, doseAmountIncrement) => {
        let i = 0;
        while(userTurns[i] !== ''){
            i++;
        }
        userTurns[i] = vaccination.type + "," + doseAmountIncrement + "," + vaccination.vaccinationDate + "," + vaccination.observations + "," + vaccination.presence;
        return userTurns;
        //Object.keys(userTurns).length
    }
    const addVaccinationTurnData = (userTurns) => {
        let i = 0;
        while(userTurns[i] !== ''){
            i++;
        }
        userTurns[i] = vaccination.type + "," + 1 + "," + vaccination.vaccinationDate + "," + vaccination.observations + "," + vaccination.presence;
        return userTurns;
        //Object.keys(userTurns).length
    }
    const submitDose = async (e) => {
        e.preventDefault();
        setError('');
        console.log(user.email)
        console.log(emailsFlu)
        console.log(emailsCovid)
        console.log(emailsYellow)
        try {
            const docRef = doc(db,`Persona/${user.email}`);
            const docSnap = await getDoc(docRef); 
            if(emailsFlu.includes(user.email)){
                vaccination.type= "flu"
            }
            else 
                if(emailsCovid.includes(user.email)){
                    vaccination.type= "covid"
                }
                else{
                    if(emailsYellow.includes(user.email)){
                        vaccination.type="yellowFever"
                    }
                }
            //Busca el correo del chabón, si no existe muestra error, si existe:
            if (docSnap.exists()) {
                if(vaccination.presence === "absent"){
                    let userTurns = docSnap.data().user.turns;
                    const turnData = addVaccinationTurnData(userTurns);
                    await updateDoc(docRef, {"user.turns": turnData});
                }
                //Recuperar los datos de dosis covid.
                let doseAmountIncrement = docSnap.data().user.doseAmountCovid;
                // Si el usuario tiene un 2 en doseAmount, no deja registrar la dosis, ya que tiene el máximo de dosis permitido sino
                if(vaccination.type === "covid" && doseAmountIncrement === "2"){
                    MySwal.fire(`El usuario ya tiene el maximo de vacunas del covid permitidas`);
                    throw error;
                }else if(vaccination.type === "covid" && vaccination.presence === "present"){
                    //obtenemos users.turns
                    let userTurns = docSnap.data().user.turns;
                    /**Se agrega un nuevo registro en el array de vacunas que contiene:
                        El tipo de vacuna.
                        El numero de la dosis que fue suministrada.
                        La fecha en la que se dio.
                        Observaciones.
                    **/
                    const turnData = addVaccinationTurnDataCovid(userTurns, ++doseAmountIncrement);
                    //Aumenta el doseAmount en 1 y ademas, marca el turno covid como vacio.
                    await updateDoc(docRef, {"user.doseAmountCovid": doseAmountIncrement, "user.turnCovid": '', "user.turns": turnData});
                }
                if(vaccination.type === "flu" && vaccination.presence === "present"){
                    let userTurns = docSnap.data().user.turns;
                    const turnData = addVaccinationTurnData(userTurns);
                    await updateDoc(docRef, {"user.turnFlu": '', "user.turns": turnData});
                }
                if(vaccination.type === "yellowFever" && vaccination.presence === "present"){
                    let userTurns = docSnap.data().user.turns;
                    const turnData = addVaccinationTurnData(userTurns);
                    await updateDoc(docRef, {"user.turnYellowFever": '', "user.turns": turnData});
                }
            } else {
                MySwal.fire(`Seleccione un email`);
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
                    <h1>Registro de dosis aplicada</h1>
                    <form onSubmit={submitDose}>
                    <label className='form-label'>Email (entre parentesis la dosis en la que tenía turno): </label>
                    {mati == 1 ?(
                        <select name="email" onChange={handleChange}>
                            <option type="email" className='form-control' name="email">Selecciona un email</option>
                            {personas.map( (persona) => (
                                <option type="email" className='form-control' name="email" value={persona.user.email}>{persona.user.email} (GRIPE)</option>
                            ))}
                            {personas2.map( (persona) => (
                                <option type="email" className='form-control' name="email" value={persona.user.email}>{persona.user.email} (COVID-19)</option>
                            ))}
                            {personas3.map( (persona) => (
                                <option type="email" className='form-control' name="email" value={persona.user.email}>{persona.user.email} (FIEBRE AMARILLA)</option>
                            ))}  
                        </select>
                    ): ""}
                        <div className='mb-3'> 
                            <label className='form-label'>Presencia: </label>
                            <div className='mb-3'> 
                                <label className='form-label'>Ausente: </label>
                                <input type="radio" name="presence" className='form-control' value={"absent"} onChange={handleChange}/>
                            </div>
                            <div className='mb-3'> 
                                <label className='form-label'>Presente: </label>
                                <input type="radio" name="presence" className='form-control' value={"present"} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Observaciones: </label><div></div>
                            <textarea name="observations" className='form-control' onChange={handleChange} placeholder={"Escribe aquí tus observaciones"} maxLength={200} rows="4" cols="40"></textarea>      
                        </div>
                        <button onClick={submitDose}>Registrar dosis</button>
                    </form>
                </div>
            </div>
        </div>
    )
}//ver si anda el select, y el textarea, mirar como hacer que el tipo de vacuna se registre solo.