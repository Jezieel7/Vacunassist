import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs} from "firebase/firestore";
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
export default function ReportePersona(){
    const { user } = useAuth();
    let hoy = new Date();
    let today = ''
    {hoy.getMonth() < 9 ? 
     today = `${hoy.getFullYear()}-0${hoy.getMonth()+1}-${hoy.getDate()}` : 
     today = `${hoy.getFullYear()}-${hoy.getMonth()+1}-${hoy.getDate()}` }
    const [personas, setPersonas] = useState( [] )
    const [personas2, setPersonas2] = useState( [] )
    const [personas3, setPersonas3] = useState( [] )
    const [dni, setDni] = useState(0)
    const [vacunatorio, setVacunatorio] = useState('')
    const [mati, setMati] = useState( 0 )

    const getListadoPersonas = async (string) => {
        const listado = query(collection(db, string), where("user.vaccinator", "!=", "true"));
        var arr1= [];
        const querySnapshot1 = await getDocs(listado);
        querySnapshot1.forEach((doc) => {
            if(doc.data().user.email !== "lautaro@gmail.com" && doc.data().user.email !== "mativacunador@gmail.com" && doc.data().user.email !== "jezielvacunador@gmail.com" && doc.data().user.email !== "dainavacunadora@gmail.com")
                arr1.push(doc.data());
        });
        arr1 = [...new Set(arr1)];
        setPersonas(arr1); 
        setDni(0)
        console.log("personas size: "+personas.length)
        setMati(1);
    }
    const getListadoDNI = async (e) => {
        e.preventDefault()
        const listado = query(collection(db, "Persona"), where("user.vaccinator", "!=", "true"));
        var arr1= [];
        const querySnapshot1 = await getDocs(listado);
        var dniString= dni.toString();
        var parecido;
        if((vacunatorio=="")&&(dni==0)){
            MySwal.fire(`Para filtrar, ingrese un DNI para buscar similitudes (que sean o empiezen por el DNI ingresado), o un vacunatorio, o ambos`);
        }else{
            if((vacunatorio=="")&&(dni!=0)){ //si no eligió vacunatorio, se hace solo el filtro de DNI
                querySnapshot1.forEach((doc) => {
                if(doc.data().user.email !== "lautaro@gmail.com" && doc.data().user.email !== "mativacunador@gmail.com" && doc.data().user.email !== "jezielvacunador@gmail.com" && doc.data().user.email !== "dainavacunadora@gmail.com"){
                    parecido=doc.data().user.DNI.toString();
                    if((doc.data().user.DNI == dni)||(parecido.startsWith(dniString))){
                        arr1.push(doc.data());
                    }     
                }
                });
                console.log("Checkpoint de Mati: filtro por DNI")
            }
            else{
                if((vacunatorio != "")&&(dni!=0)){ //si se eligió vacunatorio y DNI, se hacen ambos filtros
                    querySnapshot1.forEach((doc) => {
                    if(doc.data().user.email !== "lautaro@gmail.com" && doc.data().user.email !== "mativacunador@gmail.com" && doc.data().user.email !== "jezielvacunador@gmail.com" && doc.data().user.email !== "dainavacunadora@gmail.com"){
                        parecido=doc.data().user.DNI.toString();
                        if(((doc.data().user.DNI == dni)||(parecido.startsWith(dniString)))&&(doc.data().user.zone == vacunatorio)){
                            arr1.push(doc.data());
                        }     
                    }
                    });
                    console.log("Checkpoint de Mati: filtro por DNI y vacunatorio")
                }
                else{
                    if((vacunatorio!= "")&&(dni==0)){ //si se eligió vacunatorio pero no DNI, se hace solo el filtro de vacunatorio
                        querySnapshot1.forEach((doc) => {
                        if(doc.data().user.email !== "lautaro@gmail.com" && doc.data().user.email !== "mativacunador@gmail.com" && doc.data().user.email !== "jezielvacunador@gmail.com" && doc.data().user.email !== "dainavacunadora@gmail.com"){
                            parecido=doc.data().user.DNI.toString();
                            if(doc.data().user.zone == vacunatorio){
                                arr1.push(doc.data());
                            }     
                        }
                        });
                        console.log("Checkpoint de Mati: filtro por vacunatorio")
                    }
                }
            }
        }
        arr1 = [...new Set(arr1)];
        setPersonas2(arr1);
        console.log("lista filtrada tamaño (puede malir sal): "+personas2.length) 
        console.log("filtrando por dni: "+dni)
        console.log("filtrando por vacunatorio: "+vacunatorio)
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
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={getListadoDNI}>Filtrar</button>
                    </div></center>
                    <h1><center>Reporte de personas registradas</center></h1>
                    <center><table className="shadow-lg bg-white">
                    <thead>
                    <tr>
                        <th className="bg-green-100 border text-left px-20 py-1">Email</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Nombre</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Apellido</th>
                        <th className="bg-green-100 border text-left px-20 py-1">DNI</th>
                        <th className="bg-green-100 border text-left px-20 py-1">Vacunatorio</th>
                    </tr>
                    </thead>
                    <tbody>
                        {mati == 1 && dni == 0 && vacunatorio=="" ? //caso base (sin filtros)
                            personas.map( (persona) => (
                                <tr key={persona.id}>
                                    <td className="border px-8 py-4">{persona.user.email}</td>
                                    <td className="border px-8 py-4">{persona.user.name}</td>
                                    <td className="border px-8 py-4">{persona.user.LastName}</td>
                                    <td className="border px-8 py-4">{persona.user.DNI}</td>
                                    <td className="border px-8 py-4">{persona.user.zone}</td>
                                </tr>
                        )) : ""}
                        {mati == 1 && ((dni != 0)||(vacunatorio!=""))?
                            personas2.map( (persona) => (
                                <tr key={persona.id}>
                                    <td className="border px-8 py-4">{persona.user.email}</td>
                                    <td className="border px-8 py-4">{persona.user.name}</td>
                                    <td className="border px-8 py-4">{persona.user.LastName}</td>
                                    <td className="border px-8 py-4">{persona.user.DNI}</td>
                                    <td className="border px-8 py-4">{persona.user.zone}</td>
                                </tr>
                        )) : ""}
                    </tbody>
                    </table></center>
                </div>
            </div>
        </div>
  )
}

