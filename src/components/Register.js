import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert } from "./Alert";
import { Link, useNavigate } from "react-router-dom";

export function Register(){
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const {signup}= useAuth();

    const navigate = useNavigate();

    const [error, setError] = useState();

    const handleChange = ({target: {name, value}}) => {
        setUser({...user, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(user.email, user.password);
            //navigate('/');
            navigate('/cargar');
        } catch (error) {
            if(error.code === "auth/weak-password"){
                setError("Contrasenia debil, deberia tener al menos 6 caracteres")
            }
            setError(error.message);
        }
        
    };

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
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Registrar</button>
            </form>
            <p className="my-4 text-sm flex justify-between px-3">ya tenei una cuenta? <Link to='/login'>Inicia sesion pai</Link></p>
       </div>
    );
}