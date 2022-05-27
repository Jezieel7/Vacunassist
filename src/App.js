import {Routes, Route} from 'react-router-dom';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Form } from './components/Form';
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
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Form/>}/>
        </Routes>
      </AuthProvider>
    </div>
  );
}
export default App;