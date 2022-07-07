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
    const [birthDate, setBirthDate] = useState('');
    const [ turnFlu, setTurnFlu ] = useState('');
    const [ turnYellowFever, setTurnYellowFever ] = useState('');
    const [ hasYellowFever, setHasYellowFever ] = useState('');
    const [riskFactor, setRiskFactor] =useState('');
    const [vaccinationDateFlu, setVaccinationDateFlu] =useState('');
    const [hasVaccineFlu, setHasVaccineFlu] =useState('');
    const [doseAmountCovid, setDoseAmountCovid] =useState('');
    const [zone, setZone] =useState('');
    const [age, setAge] = useState(0)
    const [turns, setTurns] = useState([])
    let numberaux = 0;
    let numberaux2 = 0;
    let numberaux3 = 0;
    let minMesesCovid= 9999;

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

    const asignTurnCovid = async (birthDate, turnCovid, doseAmountCovid, zone, riskFactor, email) =>{
        let hoy = new Date(); //si mas adelante quiero guardar fechas, crear otro hoy, antes de las operaciones de gripe pero despues de covid
        //VACUNA COVID 
        if((calculoDeEdad(birthDate) > 60)){ 
          if((doseAmountCovid < 2)){ 
            //AUTOMATICO, DE RIESGO = MAYOR DE 60, CON MENOS DE 2 DOSIS, LE ASIGNO EN 3 DIAS
            hoy.setDate(hoy.getDate() + 3) 
            turnCovid = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()+1}/${hoy.getFullYear()} a las 12:00 horas, en el vacunatorio ${zone}`
          } 
        }else{
          if(calculoDeEdad(birthDate) < 18)
            //MANUAL, MENOR DE 18
            turnCovid= 'Menores de 18 no reciben turno para vacuna de COVID-19'
          else{ 
            if(riskFactor === "true"){
              if(doseAmountCovid < 2){
                hoy.setDate(hoy.getDate() + 4)
                //AUTOMATICO, DE RIESGO = MENOR DE 60, PERO CON FACTORES DE RIESGO Y MENOS DE 2 DOSIS, LE ASIGNO EN 4 DIAS
                turnCovid = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()+1}/${hoy.getFullYear()} a las 12:30 horas, en el vacunatorio ${zone}`
              }  
            }else{
              if(doseAmountCovid < 2){
                //MANUAL, NO ES DE RIESGO = MENOR DE 60, MENOS DE 2 DOSIS
                turnCovid = "Se le notifico a los administradores su solicitud de turno para la vacuna del COVID-19"
              }
            }
          }
        } 
        const userRef= doc(db,`Persona/${email}`) //traemos todos los datos
        MySwal.fire(turnCovid);
        await updateDoc(userRef, {"user.turnCovid": turnCovid}) //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
    }

    const asignTurnFlu = async (birthDate, turnFlu, zone, hasVaccineFlu, vaccinationDateFlu, email) =>{
        let hoy = new Date(); //si mas adelante quiero guardar fechas, crear otro hoy, antes de las operaciones de gripe pero despues de covid
        if((calculoDeEdad(birthDate) > 60)){
          if(hasVaccineFlu === "false"){ // +60 AÑOS, SIN VACUNA
            hoy.setDate(hoy.getDate() - 1) //ESTO LO HICE PARA QUE NO QUEDE MISMO DIA QUE COVID
            hoy.setMonth(hoy.getMonth() + 2) //+1 MES, PUSE 2 PORQUE EL GETMONTH TOMA ENERO COMO 0, ENTONCES MAYO POR EJEMPLO ES EL MES 4 EN VEZ DE 5
            if(hoy.getMonth() == 0){
              hoy.setMonth(1)
            }
            turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 14:00 horas, en el vacunatorio ${zone}`
            //LE DOY TURNO PARA 1 MES, EN VACUNATORIO DE PREFERENCIA 
          }else{
            if(calculoDeEdad(vaccinationDateFlu)>=1){ //+60 AÑOS, CON VACUNA VENCIDA
              hoy.setDate(hoy.getDate() - 2)
              hoy.setMonth(hoy.getMonth() + 2) //+1 MES
              if(hoy.getMonth() == 0){
                hoy.setMonth(1)
              }
              turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 14:30 horas, en el vacunatorio ${zone}`
            }
          }
        }else{ 
          if(hasVaccineFlu === "false"){ //-60 AÑOS, SIN VACUNA
            hoy.setDate(hoy.getDate() - 3)
            hoy.setMonth(hoy.getMonth() + 6) //+5 MESES
            if(hoy.getMonth() == 0){
              hoy.setMonth(1)
            }
            turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 13:00 horas, en el vacunatorio ${zone}`
            //LE DOY TURNO PARA 5 MESES, EN VACUNATORIO DE PREFERENCIA. 
          }else{
            if(calculoDeEdad(vaccinationDateFlu)>=1){ //-60 AÑOS, CON VACUNA VENCIDA
              hoy.setDate(hoy.getDate() - 4)
              hoy.setMonth(hoy.getMonth() + 6) //+5 MESES
              if(hoy.getMonth() == 0){
                hoy.setMonth(1)
              }
              turnFlu = `Tiene turno el día ${hoy.getDate()}/${hoy.getMonth()}/${hoy.getFullYear()} a las 13:30 horas, en el vacunatorio ${zone}`
            }
          }
        }
         // SI ALGUN DIA SE QUIERE HACER MAS "PRO" EL TEMA DE TURNOS, UNA BUENA IDEA PODRÍA SER TENER UN CALENDARIO, CON UN LIMITE DE TURNOS POR DIA, Y TENER CADA 30 MINUTOS (PONELE) UN TURNO
        const userRef= doc(db,`Persona/${email}`) //traemos todos los datos
        MySwal.fire(turnFlu);
        await updateDoc(userRef, {"user.turnFlu": turnFlu}) //dentro de la llave, entramos al mapa user, y modificamos cada dato, updateDoc es de firestore, para actualizar los datos
    }

    const update1 = async (e) => { //CASO FIEBRE AMARILLA
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

    const update2 = async (e) => { //CASO COVID
        e.preventDefault(); //para evitar comportamiento por defecto
        const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
        if (numberaux2==1){
            e.cancelable(); //esta funcion no existe, aun asi lo que tiene que hacer lo hace asi que estamos bien. Cancelable hace que no se ejecute mas de un Sweet.
            //console.log("se cancelo el evento xD")
        }
        if(((turnCovid == "")||(turnCovid=="Menores de 18 no reciben turno para vacuna de COVID-19"))&&(numberaux2==0)){
            asignTurnCovid(birthDate, turnCovid, doseAmountCovid, zone, riskFactor, user.email);
            numberaux2++;
        }
        else
            numberaux2=0; //esto para testing, borrar si algo sale mal
    }

    const update3 = async (e) => { //CASO GRIPE
        e.preventDefault(); //para evitar comportamiento por defecto
        const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
        if (numberaux3==1){
            e.cancelable(); //esta funcion no existe, aun asi lo que tiene que hacer lo hace asi que estamos bien. Cancelable hace que no se ejecute mas de un Sweet.
            //console.log("se cancelo el evento xD")
        }
        if((turnFlu == "")&&(numberaux3==0)){
            asignTurnFlu(birthDate, turnFlu, zone, hasVaccineFlu, vaccinationDateFlu, user.email);
            numberaux3++;
        }
        else
            numberaux3=0; //esto para testing, borrar si algo sale mal
    }

    /*const comprobarMenoraMayorDeEdad = async (id) => { //FUNCION PARA VER SI EL USER PASO A TENER 18 AÑOS 
        const userRef = doc(db,id);
        const snapshot = await getDoc(userRef);
        if((age>=18)&&(snapshot.data().user.turnCovid == "Menores de 18 no reciben turno para vacuna de COVID-19")){
            await updateDoc(userRef, {"user.turnCovid": ""})
        }
    }*/
    const getProductById = async (id) => {
        const userRef = doc(db,id);
        const snapshot = await getDoc(userRef);
        if(snapshot.exists()){
            setAge(calculoDeEdad(snapshot.data().user.birthDate))
            setTurnFlu(snapshot.data().user.turnFlu);
            setTurnCovid(snapshot.data().user.turnCovid)
            setTurnYellowFever(snapshot.data().user.turnYellowFever);
            setHasYellowFever(snapshot.data().user.hasYellowFever);
            setHasVaccineFlu(snapshot.data().user.hasVaccineFlu);
            setRiskFactor(snapshot.data().user.riskFactor);
            setZone(snapshot.data().user.zone);
            setDoseAmountCovid(snapshot.data().user.doseAmountCovid);
            setVaccinationDateFlu(snapshot.data().user.vaccinationDateFlu);
            setBirthDate(snapshot.data().user.birthDate);
            setTurns(snapshot.data().user.turns)
            if((age >= 18 )&& (turnCovid == "Menores de 18 no reciben turno para vacuna de COVID-19") ){
                asignTurnCovid(birthDate, turnCovid, doseAmountCovid, zone, riskFactor, user.email)
            }
        
            //ver como calcular que pasen 3 meses, para volver a darse covid
        }else{
            console.log('el producto no existe');
        }
    }
    const update = async (e) => {
      e.preventDefault();
      console.log("probando a ver si anda ahorita")
    }
    const informar1 = async (e) => { //CASO GRIPE
      MySwal.fire("No puede solicitar turno para vacuna amarilla por 1 de las siguientes razones: Ya posee turno, o tiene más de 60 años, o tiene la vacuna");
    }
    const informar2 = async (e) => { //CASO GRIPE
      MySwal.fire("No puede solicitar turno para covid por 1 de las siguientes razones: Ya posee turno, o tiene menos de 18 años, o ya tiene 2 dosis, o se dio la vacuna recientemente");
    }
    const informar3 = async (e) => { //CASO GRIPE
      MySwal.fire("No puede solicitar turno para gripe por 1 de las siguientes razones: Ya posee turno, o tiene la vacuna, y todavia no esta vencida");
    }

    const cancelarTurnoCovid = async () => {
      if((turnCovid !== "Menores de 18 no reciben turno para vacuna de COVID-19") && (turnCovid !== "")){
        if(window.confirm("¿Está seguro que desea cancelar este turno?")){
          setTurnCovid('');
          const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
          await updateDoc(product, {"user.turnCovid": ""});
          alert("Su turno ha sido cancelado, si desea puede solicitar otro.");
        }
      }else if((turnCovid == "")||(turnCovid == "Menores de 18 no reciben turno para vacuna de COVID-19")){
        alert("No puede cancelar un turno que no fue dado");
      }else if(turnCovid == "Se le notifico a los administradores su solicitud de turno para la vacuna del COVID-19"){
        setTurnCovid('');
        const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
        await updateDoc(product, {"user.turnCovid": ""});
        alert("Su solicitud ha sido cancelada, si desea puede solicitar otra.");
      }
    }

    const cancelarTurnoFlu = async () => {
      if(turnFlu !== ""){
        if(window.confirm("¿Está seguro que desea cancelar este turno?")){
          setTurnFlu('');
          const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
          await updateDoc(product, {"user.turnFlu": ""});
          alert("Su turno ha sido cancelado, si desea puede solicitar otro.");
        }
      }else if(turnFlu == ""){
        alert("No puede cancelar un turno que no fue dado");
      }else if(turnCovid == "Solicitud aceptada. Se te asignará un turno en los próximos días"){
        setTurnFlu('');
        const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
        await updateDoc(product, {"user.turnFlu": ""});
        alert("Su solicitud ha sido cancelada, si desea puede solicitar otro.");
      }
    }

    const cancelarTurnoYellowFever = async () => {
      if(turnYellowFever !== ""){
        if(window.confirm("¿Está seguro que desea cancelar este turno?")){
          setTurnYellowFever('');
          const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
          await updateDoc(product, {"user.turnYellowFever": ""});
          alert("Su turno ha sido cancelado, si desea puede solicitar otro.");
        }
      }else if(turnYellowFever == ""){
        alert("No puede cancelar un turno que no fue dado");
      }else if(turnYellowFever !== "Solicitud aceptada. Se te asignará un turno en los próximos días"){
        setTurnYellowFever('');
        const product= doc(db,`Persona/${user.email}`); //traemos todos los datos a product
        await updateDoc(product, {"user.turnYellowFever": ""});
        alert("Su solicitud ha sido cancelada, si desea puede solicitar otra.");
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
                            {((turnCovid=="Menores de 18 no reciben turno para vacuna de COVID-19")&&(age>=18)) ?
                              <input value={""} type="text" size={82} className='form-control' disabled/>:
                              <input value={turnCovid} type="text" size={82} className='form-control' disabled/> 
                            }
                            {
                              (turnCovid !== "Se le notifico a los administradores su solicitud de turno para la vacuna del COVID-19")?
                              <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={cancelarTurnoCovid}>Cancelar turno</button>:
                              <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={cancelarTurnoCovid}>Cancelar solicitud</button>
                            }
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Turno de la vacuna de gripe: </label>
                            <input value={turnFlu} type="text" size={84} className='form-control' disabled/>
                            {
                              (turnFlu !== "Solicitud aceptada. Se te asignará un turno en los próximos días")?
                              <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={cancelarTurnoFlu}>Cancelar  turno</button>:
                              <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={cancelarTurnoFlu}>Cancelar Solicitud</button>
                            }
                              
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Turno de la vacuna de fiebre amarilla: </label>
                            <input value={turnYellowFever} type="text" size={75} className='form-control' disabled/>
                            {
                              (turnYellowFever !== "Solicitud aceptada. Se te asignará un turno en los próximos días")?
                              <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={cancelarTurnoYellowFever}>Cancelar turno</button>:
                              <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={cancelarTurnoYellowFever}>Cancelar solicitud</button>
                            }     
                        </div>
                        {((turnYellowFever !== "Solicitud aceptada. Se te asignará un turno en los próximos días")&&(numberaux==0)&&(hasYellowFever !== "true")&&(age<60)) ?
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={update1}>SOLICITAR VACUNA DE FIEBRE AMARILLA </button> : 
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={informar1} >SOLICITAR VACUNA DE FIEBRE AMARILLA </button>
                        }
                        <br></br>
                        {(((turnCovid == "")||(turnCovid=="Menores de 18 no reciben turno para vacuna de COVID-19"))&&(numberaux2==0)&&(doseAmountCovid < 2)&&(age>=18)) ?
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={update2}>SOLICITAR VACUNA DE COVID </button> : 
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={informar2} >SOLICITAR VACUNA DE COVID </button>
                        }
                        <br></br>
                        {((turnFlu == "")&&(numberaux3==0)&&((((hasVaccineFlu == "true")&&(calculoDeEdad(vaccinationDateFlu)>=1)))||(hasVaccineFlu == "false"))) ?
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={update3}>SOLICITAR VACUNA DE GRIPE</button> : 
                            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={informar3} >SOLICITAR VACUNA DE GRIPE </button>
                        }
                        <p>Direcciones de vacunatorios: Municipalidad (51 e/10 y 11 Nro. 770), Terminal (3 e/ 41 y 42 Nro. 480), Cementerio (138 e/73 y 74 Nro. 2035).</p>
                    </form>
                </div>
            </div>
        </div>
    )
}