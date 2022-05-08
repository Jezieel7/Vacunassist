import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert } from "./Alert";
import { Link, useNavigate } from "react-router-dom";

export function Login(){
    const [user, setUser] = useState({
        email: '',
        password: '',
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
            await login(user.email, user.password);
            navigate('/');
        } catch (error) {
            if(error.code === "auth/weak-password"){
                setError("Contrasenia debil, deberia tener al menos 6 caracteres")
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
        <div className="w-full max-w-xs m-auto">
            {error && <Alert message={error}/>}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-fold mb-2">email</label>
                    <input type="email" name="email" placeholder="yourEmail@company" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange}/>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-fold mb-2">password</label>
                    <input type="password" name="password" placeholder="******" id="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange}/>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">login</button>
                    <a href="#!" className="inline-block align baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={handleResetPassword}>No te acordas?</a>
                </div>
            </form>
            <p className="my-4 text-sm flex justify-between px-3">No tenei una cuenta? <Link to='/register'>Registrate pai</Link></p>
        </div>
    );
}