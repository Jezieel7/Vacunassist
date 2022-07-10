import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs} from "firebase/firestore";
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
export default function ReportePersona(){
    let hoy = new Date();
    let today = ''
    {hoy.getMonth() < 9 ? 
     today = `${hoy.getFullYear()}-0${hoy.getMonth()+1}-${hoy.getDate()}` : 
     today = `${hoy.getFullYear()}-${hoy.getMonth()+1}-${hoy.getDate()}` }
    const [personas, setPersonas] = useState( [] ) //crear registro, dentro de ese registro que esten todos los campos necesarios, entonces, en personas va a estar directamente todos los datos necesarios para el output
    const [personas2, setPersonas2] = useState( [] )
    const [personas3, setPersonas3] = useState( [] )

    const [dni, setDni] = useState(0)
    const [vacuna, setVacuna] = useState('')
    const [desde, setDesde] = useState('') //para fecha
    const [hasta, setHasta] = useState('') //para fecha

    const [mati, setMati] = useState( 0 )
    const [ user, setUser] = useState({
        email: '',
        name: '',
        LastName: '',
        DNI: '',
        zone: '',
        vacuna:'',
        dosis: '',
        vaccinationDate: ''
    });

    const getListadoPersonas = async (string) => {
        const listado = query(collection(db, string), where("user.vaccinator", "!=", "true"));
        var arr1= [];
        var i;
        var corte;
        var campos= 0;
        var string;
        const querySnapshot1 = await getDocs(listado);
        querySnapshot1.forEach((doc) => {
            if(doc.data().user.email !== "lautaro@gmail.com" && doc.data().user.email !== "mativacunador@gmail.com" && doc.data().user.email !== "jezielvacunador@gmail.com" && doc.data().user.email !== "dainavacunadora@gmail.com")
                for(i=0;i<10;i++){
                    corte= doc.data().user.turns[i].split(',')
                    if(corte[4]=="present"){
                        user.email= doc.data().user.email
                        user.name= doc.data().user.name
                        user.LastName= doc.data().user.LastName
                        user.DNI= doc.data().user.DNI
                        user.zone= doc.data().user.zone
                        user.vacuna= corte[0]
                        user.dosis=corte[1]
                        user.vaccinationDate= corte[2]
                        setUser(user)
                        string= `${user.email}+${user.name}+${user.LastName}+${user.DNI}+${user.zone}+${user.vacuna}+${user.dosis}+${user.vaccinationDate}`
                        arr1[campos]= string.split('+')
                        campos++
                    }
                }
        });
        console.log(arr1)
        console.log(campos)
        setPersonas(arr1);
        setDni(0)
        console.log("personas size: "+personas.length)
        setMati(1);
    }

    const getListadoFiltrado = async (e) => {
        e.preventDefault()
        var arr1= []; //arreglo que contiene cada string cortado
        var i; //indice para el for
        var corte; //string para cortar el string de turns[i]
        var campos= 0; //para que no haya duplicados, y ademas esta variable nos dice el lenght
        var string; //string resultado, basicamente es toda una fila resultante de datos
        var yaHiceFiltro= false; //para que se entre por solo un foreach
        var parecido; //dni de una persona pasada a string, sirve para ver si tiene coincidencia con el dni insertado por teclado
        var dniString= dni.toString(); //dni que se ingresa por teclado, pasado a string
        var desdeStringCortao= desde.split('-')
        var hastaStringCortao= hasta.split('-')
        var fecha;


        if((dni==0)&&(vacuna=="")&&(desde=="")&&(hasta=="")){
            MySwal.fire(`Para filtrar, seleccione y complete(en caso de las fechas) el/los criterio/s para la busqueda`);
        }
        else{
            if((yaHiceFiltro==false)&&(dni!=0)&&(vacuna=="")&&(desde=="")&&(hasta=="")){ //DNI
                personas.forEach((persona) => {
                    parecido=persona[3]
                    if((persona[3] == dni)||(parecido.startsWith(dniString))){
                        arr1[campos]=persona;
                        campos++
                    }
                });
                setPersonas2(arr1)
                yaHiceFiltro=true;
                console.log("Checkpoint de Mati: filtro por DNI "+ dni)
            }
            if((yaHiceFiltro==false)&&(dni==0)&&(vacuna!="")&&(desde=="")&&(hasta=="")){ //VACUNA
                personas.forEach((persona) => {
                    parecido=persona[3]
                    if(persona[5] == vacuna){
                        arr1[campos]=persona;
                        campos++
                    }
                });
                setPersonas2(arr1)
                yaHiceFiltro=true;
                console.log("Checkpoint de Mati: filtro por vacuna "+ vacuna)
            }
            if((yaHiceFiltro==false)&&(dni!=0)&&(vacuna!="")&&(desde=="")&&(hasta=="")){ //DNI + VACUNA
                personas.forEach((persona) => {
                    parecido=persona[3]
                    if(((persona[3] == dni)||(parecido.startsWith(dniString)))&&(persona[5] == vacuna)){
                        arr1[campos]=persona;
                        campos++
                    }
                });
                setPersonas2(arr1)
                yaHiceFiltro=true;
                console.log("Checkpoint de Mati: filtro por DNI "+ dni +" y vacuna " + vacuna)
            }
            if((yaHiceFiltro==false)&&(dni==0)&&(vacuna=="")&&(desde!="")&&(hasta=="")){ //DESDE
                personas.forEach((persona) => {
                    parecido=persona[3]
                    fecha=persona[7].split('-')
                    console.log(fecha)
                    var f=new Date(fecha[0],fecha[1],fecha[2])
                    console.log(f)
                    var fdesde= new Date(desdeStringCortao[0],desdeStringCortao[1],desdeStringCortao[2])
                    var fhasta= new Date(hastaStringCortao[0],hastaStringCortao[1],hastaStringCortao[2])
                    f.setHours(0,0,0,0);
                    fdesde.setHours(0,0,0,0);
                    fhasta.setHours(0,0,0,0);
                    if(f>=fdesde){
                        arr1[campos]=persona;
                        campos++
                    }
                });
                setPersonas2(arr1)
                yaHiceFiltro=true;
                console.log("Checkpoint de Mati: filtro por fecha: desde "+ desde)
            }
            if((yaHiceFiltro==false)&&(dni==0)&&(vacuna=="")&&(desde=="")&&(hasta!="")){ //HASTA
                personas.forEach((persona) => {
                    parecido=persona[3]
                    fecha=persona[7].split('-')
                    console.log(fecha)
                    var f=new Date(fecha[0],fecha[1],fecha[2])
                    console.log(f)
                    var fdesde= new Date(desdeStringCortao[0],desdeStringCortao[1],desdeStringCortao[2])
                    var fhasta= new Date(hastaStringCortao[0],hastaStringCortao[1],hastaStringCortao[2])
                    f.setHours(0,0,0,0);
                    fdesde.setHours(0,0,0,0);
                    fhasta.setHours(0,0,0,0);
                    if(f<=fhasta){
                        arr1[campos]=persona;
                        campos++
                    }
                });
                setPersonas2(arr1)
                yaHiceFiltro=true;
                console.log("Checkpoint de Mati: filtro por fecha: hasta "+ hasta)
            }
            if((yaHiceFiltro==false)&&(dni==0)&&(vacuna=="")&&(desde!="")&&(hasta!="")){ //DESDE + HASTA
                personas.forEach((persona) => {
                    parecido=persona[3]
                    fecha=persona[7].split('-')
                    console.log(fecha)
                    var f=new Date(fecha[0],fecha[1],fecha[2])
                    console.log(f)
                    var fdesde= new Date(desdeStringCortao[0],desdeStringCortao[1],desdeStringCortao[2])
                    var fhasta= new Date(hastaStringCortao[0],hastaStringCortao[1],hastaStringCortao[2])
                    f.setHours(0,0,0,0);
                    fdesde.setHours(0,0,0,0);
                    fhasta.setHours(0,0,0,0);
                    if((f<=fhasta)&&(f>=fdesde)){
                        arr1[campos]=persona;
                        campos++
                    }
                });
                setPersonas2(arr1)
                yaHiceFiltro=true;
                console.log("Checkpoint de Mati: filtro por fecha: desde "+ desde + " hasta "+ hasta)
            }
            if((yaHiceFiltro==false)&&(dni==0)&&(vacuna!="")&&(desde=="")&&(hasta!="")){ //VACUNA + HASTA
                personas.forEach((persona) => {
                    parecido=persona[3]
                    fecha=persona[7].split('-')
                    console.log(fecha)
                    var f=new Date(fecha[0],fecha[1],fecha[2])
                    console.log(f)
                    var fdesde= new Date(desdeStringCortao[0],desdeStringCortao[1],desdeStringCortao[2])
                    var fhasta= new Date(hastaStringCortao[0],hastaStringCortao[1],hastaStringCortao[2])
                    f.setHours(0,0,0,0);
                    fdesde.setHours(0,0,0,0);
                    fhasta.setHours(0,0,0,0);
                    if((f<=fhasta)&&(persona[5] == vacuna)){
                        arr1[campos]=persona;
                        campos++
                    }
                });
                setPersonas2(arr1)
                yaHiceFiltro=true;
                console.log("Checkpoint de Mati: filtro por fecha y vacuna: vacuna "+ vacuna + " hasta "+ hasta)
            }
        }
        setPersonas2(arr1);
        setMati(1);
    }
    
    useEffect( () => {
        getListadoPersonas("Persona");
        // eslint-disable-next-time
    }, [])
    const handleChange = ({target: {name, value}}) => {
        if(name === "DNI"){
            setDni(value); 
        }
        else{
            if(name==="desde"){
                setDesde(value);
            }else{
                if(name==="hasta"){
                    setHasta(value);
                }else{
                    setVacuna(value)
                }
            }
        }
    };

  return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <div className="text-x1 mb-4">
                        <br></br>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./HomeAdmin">VOLVER A HOME</a></button>
                    </div>
                    <center><div className="text-x1 mb-4">
                        <label htmlFor="DNI" >Filtrar por DNI: </label>
                        <input type="number" name="DNI" placeholder="12345678" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange}/>
                    </div></center>
                    <center><div className="text-x1 mb-4">
                        <label htmlFor="vacuna" className="form-control">Filtrar por vacuna: </label>
                        <br></br>
                        <input type="radio" value={"flu"} name="vacuna" className="form-control" onChange={handleChange}/> Gripe
                        <br></br>
                        <input type="radio" value={"yellowFever"} name="vacuna" className="form-control" onChange={handleChange}/> Fiebre amarilla
                        <br></br>
                        <input type="radio" value={"covid"} name="vacuna" className="form-control" onChange={handleChange}/> COVID-19
                        <br></br>
                        <input type="radio" value={""} name="vacuna" className="form-control" onChange={handleChange} onSelect/> No Filtrar
                        <br></br>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={getListadoFiltrado}>Filtrar</button>
                    </div></center>
                    <center><div className="text-x1 mb-4">
                        <p>Filtrar por fechas</p>
                        <label htmlFor="desde" >Desde: </label>
                        <input type="date" name="desde" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange}/>
                        <label htmlFor="hasta" >Hasta: </label>
                        <input type="date" name="hasta" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange}/>
                    </div></center>
                    <h1><center>Reporte de vacunas aplicadas {dni} {desde} {hasta} {vacuna}</center></h1>
                    <center><table className="shadow-lg bg-white">
                    <thead>
                    <tr>
                        <th className="bg-green-100 border text-left px-20 py-1">Email</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Nombre</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Apellido</th>
                        <th className="bg-green-100 border text-left px-20 py-1">DNI</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Vacunatorio de preferencia</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Vacuna</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Dosis</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Fecha de aplicación</th>
                    </tr>
                    </thead>
                    <tbody>
                        {mati == 1 && dni == 0 && desde=="" && hasta=="" && vacuna==""? //caso base (sin filtros)
                            personas.map( (user) => (
                                <tr key={user.email}>
                                    <td className="border px-8 py-4">{user[0]}</td>
                                    <td className="border px-8 py-4">{user[1]}</td>
                                    <td className="border px-8 py-4">{user[2]}</td>
                                    <td className="border px-8 py-4">{user[3]}</td>
                                    <td className="border px-8 py-4">{user[4]}</td>
                                    <td className="border px-8 py-4">{user[5]}</td>
                                    <td className="border px-8 py-4">{user[6]}</td>
                                    <td className="border px-8 py-4">{user[7]}</td>
                                </tr>
                        )) : ""}
                        {mati == 1 &&( (dni != 0) || (desde!="") || (hasta!="") || (vacuna!=""))? //caso con filtros
                            personas2.map( (user) => (
                                <tr key={user.email}>
                                    <td className="border px-8 py-4">{user[0]}</td>
                                    <td className="border px-8 py-4">{user[1]}</td>
                                    <td className="border px-8 py-4">{user[2]}</td>
                                    <td className="border px-8 py-4">{user[3]}</td>
                                    <td className="border px-8 py-4">{user[4]}</td>
                                    <td className="border px-8 py-4">{user[5]}</td>
                                    <td className="border px-8 py-4">{user[6]}</td>
                                    <td className="border px-8 py-4">{user[7]}</td>
                                </tr>
                        )) : ""}
                    </tbody>
                    </table></center>
                </div>
            </div>
        </div>
  )
}