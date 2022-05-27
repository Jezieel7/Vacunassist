import React from 'react'
export default function Cargar({ user, setUser }){
    const handleChange = ({target: {name, value}}) => {
        setUser({...user, [name]: value});
    };
    return (
      <div className='container'>
          <div className='row'>
              <div className='col'>
                  <h1>   </h1>
                  <div className='mb-3'>
                  <label className='form-label' htmlFor="zone">Vacunatorio de preferencia</label>
                          <input type="radio" name="zone" className='form-control' value={"Municipalidad"} onChange={handleChange} required/> Municipalidad
                          <input type="radio" name="zone" className='form-control' value={"Terminal"} onChange={handleChange} required/> Terminal
                          <input type="radio" name="zone" className='form-control' value={"Cementerio"} onChange={handleChange} required/> Cementerio    
                      </div>
                      <div className='mb-3'>
                          <label className='form-label' htmlFor="riskFactor">¿Sos una persona con factores de riesgo?</label>
                          <input type="radio" name="riskFactor" className='form-control' value={true} onChange={handleChange} required/> Si
                          <input type="radio" name="riskFactor" className='form-control' value={false} onChange={handleChange} required/> No 
                      </div>
                      <h1> Datos Vacuna COVID-19 </h1>
                      <div className='mb-3'>
                          <label className='form-label' htmlFor="doseAmountCovid">Cantidad de dosis de COVID-19 recibidas</label>
                          <input type="number" name="doseAmountCovid" className='form-control' onChange={handleChange} required min={0} max={2}/>    
                      </div>
                      <h1> Datos Vacuna GRIPE </h1>
                      <div className='mb-3'>
                          <label className='form-label' htmlFor="hasVaccineFlu">¿Posee la vacuna para la gripe?</label>
                          <input type="radio" name="hasVaccineFlu" className='form-control' value={true} onChange={handleChange} required/> Si
                          <input type="radio" name="hasVaccineFlu" className='form-control' value={false} onChange={handleChange} required/> No
                      </div>
                      { (user.hasVaccineFlu == "true") ?
                      <div className='mb-3'>
                          <label className='form-label' htmlFor="vaccinationDateFlu">¿En qué fecha se la dió?</label>
                          <input type="date" name="vaccinationDateFlu" className='form-control' onChange={handleChange} required />    
                      </div>
                      : ""} 
                      <h1> Datos Vacuna FIEBRE AMARILLA </h1>
                      <div className='mb-3'>
                          <label className='form-label' htmlFor="hasYellowFever">¿Tiene la vacuna de la fiebre amarilla?</label>
                          <input type="radio" name="hasYellowFever" className='form-control' value={true} onChange={handleChange} required/> Si 
                          <input type="radio" name="hasYellowFever" className='form-control' value={false} onChange={handleChange} required/> No
                      </div>
                      { (user.hasYellowFever == "true") ?
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="doseYearYellowFever">Año en que se la aplicó</label>
                                <input type="number" name="doseYearYellowFever" className='form-control' onChange={handleChange} min={1900} max={2022} required/>    
                            </div>
                        : ""
                      }
              </div>
          </div>
      </div>
    )
}