import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserData } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Cargar = () => {
    const [ zona, setZona ] = useState( '' ) //valor x defecto
    const [ factorRiesgo, setFactorRiesgo] = useState(false) //valor x defecto
    const navigate = useNavigate()
    const {user} = useAuth();
    const store= async (e) => { //funcion para almacenar
        e.preventDefault()
        await createUserData(user, zona, factorRiesgo);
        navigate('/') //nos lleva a home
    } //en el return es lo que se ve en pantalla, para is2, copiar y pegar desde el div classsname mb-3 hasta su cierre para cada dato
    return (
      <div className='container'>
          <div className='row'>
              <div className='col'>
                  <h1>Cargar Datos Importantes</h1>
                  <form onSubmit={store}>
                  <div className='mb-3'>
                          <label className='form-label'>Vacunatorio</label>
                          <input
                              value={zona}
                              onChange={(e) => setZona(e.target.value)}
                              type="text"
                              className='form-control'
                              required
                          />    
                      </div>
                      <div className='mb-3'>
                          <label className='form-label'>¿Sos una persona con factores de riesgo?</label>
                          <input
                              value={factorRiesgo}
                              onChange={(e) => setFactorRiesgo(e.target.value)}
                              type="text"
                              className='form-control'
                              required
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