import { onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import Cargar from './components/Cargar';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Register } from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { auth } from './firebase';


function App(){
  /*const userGlobal = useAuth();
  if(userGlobal){
    const correoUsuarioGlobal= userGlobal.email
  }
  const [usuarioGlobal, setUsuarioGlobal] = useState(null);
  onAuthStateChanged(auth, (usuarioFirebase) => {
    if(usuarioFirebase){
      setUsuarioGlobal(usuarioFirebase);
    }else{
      setUsuarioGlobal(null);
    }
  });*/
  return ( 
    <div className="bg-slate-300 h-screen text-black flex">
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="cargar" element={<Cargar/>}/>
        </Routes>
      </AuthProvider>
    </div>

  );
}

export default App;