import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserData } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);
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

    function calculoDeEdad(fecha) {
        let hoy = new Date();
        let cumpleanos = new Date(fecha);
        let edad = hoy.getFullYear() - cumpleanos.getFullYear();
        let m = hoy.getMonth() - cumpleanos.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        console.log(edad);
        return edad;
    }

    const store= async (e) => { //funcion para almacenar
        e.preventDefault()
        await createUserData(user, zona, factorRiesgo, cantidadDosisCOVID, tieneVacuna, fechaVacGripe, dosisAmarilla, añoDosisAmarilla);
        if((calculoDeEdad(user.fechaNac) > 60 && user.cantidadDosisCOVID < 2) || factorRiesgo){
            MySwal.fire("Se le asigno un turno automaticamente");
            //asignarle turno automaticamente.
        }else{
            MySwal.fire("Se le notifico a los administradores su solicitud de turno");
            //solicitar turno a administradores.
        }
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
                          <label className='form-label' for="factor-riesgo">¿Sos una persona con factores de riesgo?</label>
                          <input
                              value={true}
                              onChange={(e) => setFactorRiesgo(e.target.value)}
                              type="radio"
                              className='form-control'
                              name="factor-riesgo"
                              required
                          /> Si
                          <input
                              value={false}
                              onChange={(e) => setFactorRiesgo(e.target.value)}
                              type="radio"
                              className='form-control'
                              name="factor-riesgo"
                              required
                          /> No    
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
                          <label className='form-label' for="tiene-gripe">¿Posee la vacuna para la gripe?</label>
                          <input
                              value={true}
                              onChange={(e) => setTieneVacuna(e.target.value)}
                              type="radio"
                              className='form-control'
                              name="tiene-gripe"
                              required
                          /> Si
                         <input
                              value={false}
                              onChange={(e) => setTieneVacuna(e.target.value)}
                              type="radio"
                              className='form-control'
                              name="tiene-gripe"
                              required
                          /> No  
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
                          <label className='form-label' for="fiebre-amarilla">¿Tiene la vacuna de la fiebre amarilla?</label>
                          <input
                              value={true}
                              onChange={(e) => setDosisAmarilla(e.target.value)}
                              type="radio"
                              className='form-control'
                              name="fiebre-amarilla"
                              required
                          /> Si 
                          <input
                              value={false}
                              onChange={(e) => setDosisAmarilla(e.target.value)}
                              type="radio"
                              className='form-control'
                              name="fiebre-amarilla"
                              required
                          /> No
                      </div>
                      <div className='mb-3'>
                          <label className='form-label'>Año en que se la aplicó</label>
                          <input
                              value={añoDosisAmarilla}
                              onChange={(e) => setAñoDosisAmarilla(e.target.value)}
                              type="number"
                              className='form-control'
                              required
                              min={1900}
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