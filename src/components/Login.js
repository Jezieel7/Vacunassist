import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert } from "./Alert";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from '@firebase/firestore'
import { db } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
export function Login(){
    const [user, setUser] = useState({
        email: '',
        password: '',
        key: '',
    });
    const { login, resetPassword}= useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState();
    const handleChange = ({target: {name, value}}) => {
        setUser({...user, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userRef = doc(db,`Persona/${user.email}`);
            const snapshot = await getDoc(userRef);
            
            

            if(snapshot._document == null){
                MySwal.fire(`El email ingresado no esta registrado en el sistema`);
                throw error;
            }
            if (snapshot.exists){
                if(snapshot.data().user.key === ''){
                    //COMENTARIO VALIOSO PARA HU INICIAR SESION ADMIN
                    if((snapshot.data().user.email === 'lautaro@gmail.com') || (snapshot.data().user.email === 'agustina@gmail.com')){
                        await login(user.email, user.password);
                        navigate('/HomeAdmin');
                    }
                    else{
                        await login(user.email, user.password);
                        navigate('/HomeVaccinator');
                    }
                }
                else{
                    const mismaClave= (Number (snapshot.data().user.key)) !== (Number (user.key))
                    if(!mismaClave){
                        await login(user.email, user.password);
                        navigate('/');
                    }            
                    else{
                        MySwal.fire(`Codigo de validación incorrecto`)
                        throw error;                    
                }
                }   
            }
            else{
                throw error;
            }
        } catch (error) {
            console.log(error.code) //si chilla, borrar esto
            if(error.code === "auth/wrong-password"){
                setError("Contrasenia debil, deberia tener al menos 6 caracteres");
            }
            if(error.code === "Cannot read properties of undefined (reading 'user')"){
                setError("Email no registrado");
            }
            setError(error.message);
        }
    };
    const handleResetPassword = async () => {
        if(!user.email) return setError("ingresa un email");
        try {
            await resetPassword(user.email);
            setError('Te enviamos una wea al correo para que recuperes la dignidad');
        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <div className="container">
            <h1 className="text-x1 mb-4"><b><big>Bienvenido a VacunAssist</big></b></h1>
            {error && <Alert message={error}/>}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-fold mb-2">Email</label>
                    <input type="email" name="email" placeholder="yourEmail@company" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-fold mb-2">Contraseña</label>
                    <input type="password" name="password" placeholder="******" id="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="key" className="block text-gray-700 text-sm font-fold mb-2">Codigo de validación</label>
                    <input type="number" name="key" placeholder="1234" id="key" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange}/>
                </div>
                <div className="flex items-center justify-between">
                    <button className="botonbarra">Inicia sesión</button>
                </div>
                <div className="mb-4"></div>
                <a href="#!" className="inline-block align baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={handleResetPassword}>¿No te acordas la contraseña?</a>
            </form>
            <p className="my-4 text-sm flex justify-between px-3">¿No tenés una cuenta? <Link to='/register'>Registrate ya!</Link></p>
        </div>
    );
}