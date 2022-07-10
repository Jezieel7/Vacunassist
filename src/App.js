import {Routes, Route} from 'react-router-dom';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Cargar } from './components/Cargar';
import { RegisterOnlyVaccinator } from './components/RegisterOnlyVaccinator';
import { RegisterAppliedDose } from './components/RegisterAppliedDose';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import  Record from './components/Record';
import  MyTurns from './components/MyTurns';
import  HomeVaccinator from './components/HomeVaccinator';
import HomeAdmin from './components/HomeAdmin';
import RecordTurnToday from './components/RecordTurnToday'
import RecordVaccinators from './components/RecordVaccinators'
import GoTurns from './components/GoTurns'
import RegisterOnlyVaccinators from './components/RegisterOnlyVaccinators';
import ModificarFactorRiesgo from './components/ModificarFactorRiesgo';
import ReportePersona from './components/ReportePersona';
import ReporteDosis from './components/ReporteDosis'
import Vacunatorios from './components/Vacunatorios';

function App(){
  return ( 
    <div className="bg-slate-300 h-screen text-black flex">
      <AuthProvider>
        <Routes>
          <Route path="/data" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }/>
          <Route path="/" element={
            <ProtectedRoute>
              <MyTurns />
            </ProtectedRoute>
          }/>
          <Route path="/cargar" element={
            <ProtectedRoute>
              <Cargar />
            </ProtectedRoute>
          }/>
          <Route path="/registervaccinator" element={
            <ProtectedRoute>
              <RegisterOnlyVaccinator/>
            </ProtectedRoute>
          }/>
          <Route path="/registerapplieddose" element={
            <ProtectedRoute>
              <RegisterAppliedDose/>
            </ProtectedRoute>
          }/>
          <Route path="/record" element={
            <ProtectedRoute>
              <Record/>
            </ProtectedRoute>
          }/>
          <Route path="/HomeVaccinator" element={
            <ProtectedRoute>
              <HomeVaccinator />
            </ProtectedRoute>
          }/>
          <Route path="/HomeAdmin" element={
            <ProtectedRoute>
              <HomeAdmin />
            </ProtectedRoute>
          }/>
          <Route path="/recordTurnToday" element={
            <ProtectedRoute>
              <RecordTurnToday />
            </ProtectedRoute>
          }/>
          <Route path="/recordVaccinators" element={
            <ProtectedRoute>
              <RecordVaccinators />
            </ProtectedRoute>
          }/>
          <Route path="/goTurns" element={
            <ProtectedRoute>
              <GoTurns />
            </ProtectedRoute>
          }/>
          <Route path="/registerOnlyVaccinators" element={
            <ProtectedRoute>
              <RegisterOnlyVaccinators />
            </ProtectedRoute>
          }/>
          <Route path="/ModificarFactorRiesgo" element={
            <ProtectedRoute>
              <ModificarFactorRiesgo />
            </ProtectedRoute>
          }/>
          <Route path="/ReportePersona" element={
            <ProtectedRoute>
              <ReportePersona />
            </ProtectedRoute>
          }/>
          <Route path="/ReporteDosis" element={
            <ProtectedRoute>
              <ReporteDosis />
            </ProtectedRoute>
          }/>
          <Route path="/Vacunatorios" element={
            <ProtectedRoute>
              <Vacunatorios />
            </ProtectedRoute>
          }/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
        </Routes>
      </AuthProvider>
    </div>
  );
}
export default App;