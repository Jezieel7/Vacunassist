import { Link } from "react-router-dom";
import React from "react";
export default function Register({ user, setUser }){
    const handleChange = ({target: {name, value}}) => {
        setUser({...user, [name]: value});
    };
    return (
        <div className="w-full max-w-xs m-auto">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-fold mb-2">Email</label>
                    <input type="email" name="email" placeholder="yourEmail@company" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-fold mb-2">Contraseña</label>
                    <input type="password" name="password" placeholder="******" id="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-fold mb-2">Nombre</label>
                    <input type="text" name="name" placeholder="Juan" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="LastName" className="block text-gray-700 text-sm font-fold mb-2">Apellido</label>
                    <input type="text" name="LastName" placeholder="Perez" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="birthDate" className="block text-gray-700 text-sm font-fold mb-2">Fecha de nacimiento</label>
                    <input type="date" name="birthDate" placeholder="01/01/1986" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="DNI" className="block text-gray-700 text-sm font-fold mb-2">DNI</label>
                    <input type="number" name="DNI" placeholder="12345678" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required/>
                </div>
            <p className="my-4 text-sm flex justify-between px-3">¿Ya tenés una cuenta? <Link to='/login'>Inicia sesión!</Link></p>
       </div>
    );
}