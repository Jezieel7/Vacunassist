import { useAuth } from "../context/AuthContext"; 
import React, { useState, useEffect, useRef } from 'react'; 
import { doc, getDoc, updateDoc, collection, query, getDocs} from "firebase/firestore"; 
import { db } from "../firebase"; 
import Swal from 'sweetalert2'; 
import withReactContent from 'sweetalert2-react-content'; 
const MySwal = withReactContent(Swal); 
export default function Vacunatorios(){ 
    const [ error, setError ] = useState(); 
    const { loading } = useAuth(); 
    const [ direccion, setDireccion] = useState(''); 
    const [ nombre, setNombre] = useState('');
    const [vacunatorios, setVacunatorios] = useState( [] ); 
    const [mati, setMati] = useState( 0 ); 
    const inputRef= useRef(null);

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
 
    useEffect( () => { 
        getListadoVacunatorios("Vacunatorio"); 
        // eslint-disable-next-time 
    }, []) 
 
    const handleChange = ({target: {name, value}}) => { 
        if(name === "nombre"){ 
            setNombre(value); 
        }else{ 
            setDireccion(value); 
        } 
    };
 
    const submitVacunatorio = async (e) => {  
        e.preventDefault();  
        setError('');  
        try {  
            const docRef = doc(db,`Vacunatorio/Cementerio`);  
            const docSnap = await getDoc(docRef);   
            if (docSnap.exists()) {  
                await updateDoc(docRef, {"nombre": nombre, "direccion": direccion});  
                MySwal.fire(`Se registraron los cambios en el vacunatorio`);  
            } else {  
                MySwal.fire(`El id no existe`);  
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
                        <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./HomeAdmin">VOLVER A HOME</a></button>  
                    </div>  
                    <h1>VACUNATORIOS</h1>  
                    <form onSubmit={submitVacunatorio}>  
                        <div className='mb-3'>   
                            <label className='form-label'>Vacunatorio: </label>  
                            <input type="search" name="text" list="vacunatorios" autocomplete="off" inlist="vacunatorios"></input>  
                            <datalist id="vacunatorios">  
                            {mati == 1 ?  
                                vacunatorios.map( (vacunatorio) => (  
                                    <option type="text" className='form-control' name="vacunatorio" value={vacunatorio.id}>{vacunatorio.nombre} {vacunatorio.direccion}</option> 
                                ))   
                            : ""}  
                            </datalist>  
                        </div>  
                        <label className='form-label'>Actualizar informacion: </label>  
                        <div className='mb-3'> 
                            <label className='form-label' htmlFor="nombre">Nombre: </label>  
                            <input value={nombre} type="text" name="nombre" size={84} className='form-control' onChange={handleChange}/>  
                        </div>  
                        <div className='mb-3'>   
                            <label className='form-label' htmlFor="direccion">Direccion: </label>  
                            <input value={direccion} type="text" name="direccion" size={84} className='form-control' onChange={handleChange}/>  
                        </div>  
                        <button onClick={submitVacunatorio}>Confirmar actualizacion de datos</button>  
                    </form>  
                </div>  
            </div>  
        </div> 
    )
}
