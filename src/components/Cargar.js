import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserData } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Cargar = () => {
    //HU: Cargar info
    const [ zona, setZona ] = useState( '' ) //valor x defecto
    const [ factorRiesgo, setFactorRiesgo] = useState(false) //valor x defecto
    //HU: Cargar info vacuna COVID
    const [ cantidadDosisCOVID, setCantidadDosisCOVID ] = useState( '' )
    //HU: Cargar info vacuna GRIPE
    const [ tieneVacuna, setTieneVacuna ] = useState( '' )
    const [ fechaVacGripe, setFechaVacGripe ] = useState( '' )
    //HU: Cargar info vacuna FIEBRE AMARILLA
    const [ dosisAmarilla, setDosisAmarilla ] = useState( '' )
    const [ añoDosisAmarilla, setAñoDosisAmarilla ] =useState( '' )

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
                  <h1> Datos Importantes </h1>
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
                      <h1> Datos Vacuna COVID-19 </h1>
                      <div className='mb-3'>
                          <label className='form-label'>Cantidad de dosis de COVID-19 recibidas</label>
                          <input
                              value={cantidadDosisCOVID}
                              onChange={(e) => setCantidadDosisCOVID(e.target.value)}
                              type="number"
                              className='form-control'
                              required
                              min={0}
                              max={2}
                          />    
                      </div>  
                      <h1> Datos Vacuna GRIPE </h1>
                      <div className='mb-3'>
                          <label className='form-label'>¿Posee la vacuna para la gripe?</label>
                          <input
                              value={tieneVacuna}
                              onChange={(e) => setTieneVacuna(e.target.value)}
                              type="text"
                              className='form-control'
                              required
                          />    
                      </div>
                      <div className='mb-3'>
                          <label className='form-label'>¿En qué fecha se la dió?</label>
                          <input
                              value={fechaVacGripe}
                              onChange={(e) => setFechaVacGripe(e.target.value)}
                              type="date"
                              className='form-control'
                              required
                          />    
                      </div> 
                      <h1> Datos Vacuna FIEBRE AMARILLA </h1>
                      <div className='mb-3'>
                          <label className='form-label'>¿Tiene la vacuna de la fiebre amarilla?</label>
                          <input
                              value={dosisAmarilla}
                              onChange={(e) => setDosisAmarilla(e.target.value)}
                              type="text"
                              className='form-control'
                              required
                          />    
                      </div>
                      <div className='mb-3'>
                          <label className='form-label'>Año en que se la aplicó</label>
                          <input
                              value={añoDosisAmarilla}
                              onChange={(e) => setAñoDosisAmarilla(e.target.value)}
                              type="number"
                              className='form-control'
                              required
                              min={1500}
                              max={2022}
                          />    
                      </div>
                      <button type='submit' className='btn btn-primary'>guarda los datos pa</button>
                  </form>
              </div>
          </div>
      </div>
    )
  }

export default Cargar