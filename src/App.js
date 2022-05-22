import {Routes, Route} from 'react-router-dom';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Form } from './components/Form';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App(){
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
          <Route path="register" element={<Form/>}/>
        </Routes>
      </AuthProvider>
    </div>
  );
}
//<Route path="register" element={<Register/>}/>
//<Route path="cargar" element={<Cargar/>}/>
export default App;