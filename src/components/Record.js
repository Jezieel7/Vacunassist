import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react'
import {getDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from "../firebase"; 
//import "bootstrap/dist/css/bootstrap.min.css" para ver todo re loko

export default function Record(){

    const { user, logout, loading } = useAuth();
    const [ col0, setCol0 ] = useState('');
    const [ col1, setCol1 ] = useState('');
    const [ col2, setCol2 ] = useState('');
    const [ col3, setCol3 ] = useState('');
    const [ col4, setCol4 ] = useState('');
    const [ col5, setCol5 ] = useState('');
    const [ col6, setCol6 ] = useState('');
    const [ col7, setCol7 ] = useState('');
    const [ col8, setCol8 ] = useState('');
    const [ col9, setCol9 ] = useState('');

    
    const getProductById = async (id) => {
        const userRef = doc(db,id);
        const snapshot = await getDoc(userRef);
        if(snapshot.exists()){
            setCol0(snapshot.data().user.turns[0].split(',')); //split divide al string en , transformando a col en un vector
            setCol1(snapshot.data().user.turns[1].split(',')); //cuidado con observaciones, si se usan ',' estariamos cortando el string
            setCol2(snapshot.data().user.turns[2].split(','));
            setCol3(snapshot.data().user.turns[3].split(','));
            setCol4(snapshot.data().user.turns[4].split(','));
            setCol5(snapshot.data().user.turns[5].split(','));
            setCol6(snapshot.data().user.turns[6].split(','));
            setCol7(snapshot.data().user.turns[7].split(','));
            setCol8(snapshot.data().user.turns[8].split(','));
            setCol9(snapshot.data().user.turns[9].split(','));
        }else{
            console.log('el producto no existe');
        }
    }
    useEffect( () => {
        getProductById(`Persona/${user.email}`);
        // eslint-disable-next-time
    }, []) 
    
  return (
    <div className='container'>
        <h1 className="text-x1 mb-4">Bienvenido a VacunAssist {user.email}</h1>
        <div className="text-x1 mb-4">
            <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"><a href="./">VER MIS TURNOS</a></button>
        </div>
        <table className="shadow-lg bg-white">
        <thead>
        <tr>
            <th className="bg-green-100 border text-left px-20 py-1">Vacuna</th>
            <th className="bg-green-100 border text-left px-20 py-1">Dosis</th>
            <th className="bg-green-100 border text-left px-20 py-1">Fecha</th>
            <th className="bg-green-100 border text-left px-20 py-1">Observaciones</th>
        </tr>
        </thead>
        <tbody>
        {(col0 != "") ?
        <tr>
            <td className="border px-8 py-4">{col0[0]}</td>
            <td className="border px-8 py-4">{col0[1]}</td>
            <td className="border px-8 py-4">{col0[2]}</td>
            <td className="border px-8 py-4">{col0[3]}</td>
        </tr>
        : ""            
        }
        {(col1 != "") ?
        <tr>
            <td className="border px-8 py-4">{col1[0]}</td>
            <td className="border px-8 py-4">{col1[1]}</td>
            <td className="border px-8 py-4">{col1[2]}</td>
            <td className="border px-8 py-4">{col1[3]}</td>
        </tr>
        : ""            
        }
        {(col2 != "") ?
        <tr>
            <td className="border px-8 py-4">{col2[0]}</td>
            <td className="border px-8 py-4">{col2[1]}</td>
            <td className="border px-8 py-4">{col2[2]}</td>
            <td className="border px-8 py-4">{col2[3]}</td>
        </tr>
        : ""            
        }
        {(col3 != "") ?
        <tr>
            <td className="border px-8 py-4">{col3[0]}</td>
            <td className="border px-8 py-4">{col3[1]}</td>
            <td className="border px-8 py-4">{col3[2]}</td>
            <td className="border px-8 py-4">{col3[3]}</td>
        </tr>
        : ""            
        }
        {(col4 != "") ?
        <tr>
            <td className="border px-8 py-4">{col4[0]}</td>
            <td className="border px-8 py-4">{col4[1]}</td>
            <td className="border px-8 py-4">{col4[2]}</td>
            <td className="border px-8 py-4">{col4[3]}</td>
        </tr>
        : ""            
        }
        {(col5 != "") ?
        <tr>
            <td className="border px-8 py-4">{col5[0]}</td>
            <td className="border px-8 py-4">{col5[1]}</td>
            <td className="border px-8 py-4">{col5[2]}</td>
            <td className="border px-8 py-4">{col5[3]}</td>
        </tr>
        : ""            
        }
        {(col6 != "") ?
        <tr>
            <td className="border px-8 py-4">{col6[0]}</td>
            <td className="border px-8 py-4">{col6[1]}</td>
            <td className="border px-8 py-4">{col6[2]}</td>
            <td className="border px-8 py-4">{col6[3]}</td>
        </tr>
        : ""            
        }
        {(col7 != "") ?
        <tr>
            <td className="border px-8 py-4">{col7[0]}</td>
            <td className="border px-8 py-4">{col7[1]}</td>
            <td className="border px-8 py-4">{col7[2]}</td>
            <td className="border px-8 py-4">{col7[3]}</td>
        </tr>
        : ""            
        }
        {(col8 != "") ?
        <tr>
            <td className="border px-8 py-4">{col8[0]}</td>
            <td className="border px-8 py-4">{col8[1]}</td>
            <td className="border px-8 py-4">{col8[2]}</td>
            <td className="border px-8 py-4">{col8[3]}</td>
        </tr>
        : ""            
        }
        {(col9 != "") ?
        <tr>
            <td className="border px-8 py-4">{col9[0]}</td>
            <td className="border px-8 py-4">{col9[1]}</td>
            <td className="border px-8 py-4">{col9[2]}</td>
            <td className="border px-8 py-4">{col9[3]}</td>
        </tr>
        : ""            
        }
        </tbody>
    </table>
    </div>
  )
}