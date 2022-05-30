import {Routes, Route} from 'react-router-dom';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Cargar } from './components/Cargar';
import { RegisterOnlyVaccinator } from './components/RegisterOnlyVaccinator';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import MyTurns from './components/MyTurns';
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
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="/registervaccinator" element={<RegisterOnlyVaccinator/>}/>
        </Routes>
      </AuthProvider>
    </div>
  );
}
export default App;