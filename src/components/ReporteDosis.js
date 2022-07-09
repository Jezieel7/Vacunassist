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
    const [vacunatorio, setVacunatorio] = useState('')
    const [desde, setDesde] = useState('') //para fecha
    const [hasta, setHasta] = useState('') //para fecha
    const [mati, setMati] = useState( 0 )
    var [ user, setUser] = useState({
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
        var arr2= [];
        var i;
        var corte;
        var campos= 0;
        const querySnapshot1 = await getDocs(listado);
        querySnapshot1.forEach((doc) => {
            if(doc.data().user.email !== "lautaro@gmail.com" && doc.data().user.email !== "mativacunador@gmail.com" && doc.data().user.email !== "jezielvacunador@gmail.com" && doc.data().user.email !== "dainavacunadora@gmail.com")
                for(i=0;i<10;i++){
                    corte= doc.data().user.turns[i].split(',')
                    if(corte[4]=="present"){
                        console.log("presente "+doc.data().user.email)
                        user.email= doc.data().user.email
                        user.name= doc.data().user.name
                        user.LastName= doc.data().user.LastName
                        user.DNI= doc.data().user.DNI
                        user.zone= doc.data().user.zone
                        user.vacuna= corte[0]
                        user.dosis=corte[1]
                        user.vaccinationDate= corte[2]
                        setUser(user)
                        arr1[campos]= user
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
    
    useEffect( () => {
        getListadoPersonas("Persona");
        // eslint-disable-next-time
    }, [])
    const handleChange = ({target: {name, value}}) => {
        if(name === "DNI"){
            setDni(value); 
        }
        else{
            setVacunatorio(value);
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
                        <label htmlFor="DNI" className="block text-gray-700 text-sm font-fold mb-2">Filtrar por DNI: </label>
                        <input type="number" name="DNI" placeholder="12345678" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange}/>
                    </div></center>
                    <center><div className="text-x1 mb-4">
                        <label htmlFor="vacunatorio" className="form-control">Filtrar por vacunatorio: </label>
                        <br></br>
                        <input type="radio" value={"Terminal"} name="vacunatorio" className="form-control" onChange={handleChange}/> Terminal
                        <br></br>
                        <input type="radio" value={"Municipalidad"} name="vacunatorio" className="form-control" onChange={handleChange}/> Municipalidad
                        <br></br>
                        <input type="radio" value={"Cementerio"} name="vacunatorio" className="form-control" onChange={handleChange}/> Cementerio
                        <br></br>
                        <input type="radio" value={""} name="vacunatorio" className="form-control" onChange={handleChange} onSelect/> No Filtrar
                        <br></br>
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" >Filtrar NO ANDA AGREGAR EL ONCLICK</button>
                    </div></center>
                    <h1><center>Reporte de vacunas aplicadas</center></h1>
                    <center><table className="shadow-lg bg-white">
                    <thead>
                    <tr>
                        <th className="bg-green-100 border text-left px-20 py-1">Email</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Nombre</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Apellido</th>
                        <th className="bg-green-100 border text-left px-20 py-1">DNI</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Vacunatorio</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Vacuna</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Dosis</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Fecha de aplicación</th>
                    </tr>
                    </thead>
                    <tbody>
                        {mati == 1 && dni == 0 && desde=="" && hasta==""? //caso base (sin filtros)
                            personas.map( (user) => (
                                <tr key={user.email}>
                                    <td className="border px-8 py-4">{user.email}</td>
                                    <td className="border px-8 py-4">{user.name}</td>
                                    <td className="border px-8 py-4">{user.LastName}</td>
                                    <td className="border px-8 py-4">{user.DNI}</td>
                                    <td className="border px-8 py-4">{user.zone}</td>
                                    <td className="border px-8 py-4">{user.vacuna}</td>
                                    <td className="border px-8 py-4">{user.dosis}</td>
                                    <td className="border px-8 py-4">{user.vaccinationDate}</td>
                                </tr>
                        )) : ""}
                    </tbody>
                    </table></center>
                </div>
            </div>
        </div>
  )
}