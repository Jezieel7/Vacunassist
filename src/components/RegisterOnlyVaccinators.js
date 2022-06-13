import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert } from "./Alert";
import { createUserDocument } from "../firebase";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import emailjs from '@emailjs/browser';
const MySwal = withReactContent(Swal);
export default function RegisterOnlyVaccinators(){
    const form = useRef();
    const [user, setUser] = useState({
        email: '',
        password: 'abc564LP9M', //aca deberia haber una funcion random
        name: '',
        birthDate: '',
        LastName: '',
        DNI: '',
        key: '',
        zone: '',
        riskFactor: '',
        doseAmountCovid: '',
        hasVaccineFlu: '',
        vaccinationDateFlu: '',
        hasYellowFever: false,
        doseYearYellowFever: '',
        turnCovid: '',
        turnFlu: '',
        turnYellowFever: '',
        vaccinator: false,
        turns: {
            0: '',
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
            7: '',
            8: '',
            9: ''
        }
    });
    const {signup}= useAuth();
    const [error, setError] = useState();
    const handleChange = ({target: {name, value}}) => {
        setUser({...user, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if(user.DNI === "000000"){
              MySwal.fire(`DNI INVALIDO`);
              throw(error);
            }
            await signup(user.email, user.password);
            await createUserDocument(user);
            emailjs.sendForm('service_043ut7d', 'template_2s1znpv', form.current, 'YzH5_MFfCTng8tzFm')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
            MySwal.fire(`Su codigo de validación es: ${user.key}, por favor, anotelo`);
        } catch (error) {
            setError(error.message);
        }
        
    };
    return (
        <div>
            <div className="text-x1 mb-4">
                <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./HomeVaccinator">VOLVER A HOME</a></button>
            </div>
            <form ref={form} onSubmit={handleSubmit}>
                {error && <Alert message={error}/>}
                <div className="w-full max-w-xs m-auto">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-fold mb-2">Email</label>
                        <input type="email" name="email" placeholder="tuEmail@company" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required/>
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
                </div>
                <button value="Send" onClick={handleSubmit}>Registrate</button>
            </form>
        </div>
    );
}