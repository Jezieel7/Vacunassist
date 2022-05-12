import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from "../context/AuthContext";

const Cargar = () => {
    //const {user}= useAuth(); QUEDO PENDIENTE, MIRAR SI SE PUEDE PONER EL EMAIL EN LA DB EN REGISTER
    //const [ email, setEmail ] = user.email;
    const [ nombre, setNombre ] = useState( '' ) //valor x defecto
    const [DNI, setDNI] = useState(0) //valor x defecto
    const [ apellido, setApellido ] = useState( '' ) //valor x defecto
    const [ fechaNac, setFechaNac ] = useState( '01/04/2001' ) //valor x defecto
    const navigate = useNavigate()
    const personasCollection=collection(db,"Persona")
    const store= async (e) => { //funcion para almacenar
        e.preventDefault()
        await addDoc( personasCollection,{nombre:nombre,DNI:DNI,apellido:apellido,fechaNac:fechaNac} )
        navigate('/') //nos lleva a home
    } //en el return es lo que se ve en pantalla, para is2, copiar y pegar desde el div classsname mb-3 hasta su cierre para cada dato
    return (
      <div className='container'>
          <div className='row'>
              <div className='col'>
                  <h1>Cargar Datos Importantes</h1>
                  <form onSubmit={store}>
                      <div className='mb-3'>
                          <label className='form-label'>Nombre</label>
                          <input
                              value={nombre}
                              onChange={(e) => setNombre(e.target.value)}
                              type="text"
                              className='form-control'
                          />    
                      </div>
                      <div className='mb-3'>
                          <label className='form-label'>Apellido</label>
                          <input
                              value={apellido}
                              onChange={(e) => setApellido(e.target.value)}
                              type="text"
                              className='form-control'
                          />    
                      </div>
                      <div className='mb-3'>
                          <label className='form-label'>DNI</label>
                          <input
                              value={DNI}
                              onChange={(e) => setDNI(e.target.value)}
                              type="text"
                              className='form-control'
                          />    
                      </div>
                      <div className='mb-3'>
                          <label className='form-label'>Fecha de nacimiento</label>
                          <input
                              value={fechaNac}
                              onChange={(e) => setFechaNac(e.target.value)}
                              type="date"
                              className='form-control'
                          />    
                      </div>
                      <button type='submit' className='btn btn-primary'>store</button>
                  </form>
              </div>
          </div>
      </div>
    )
  }

export default Cargar