import { useAuth } from "../context/AuthContext";

export function Home(){
    const {user, logout, loading} = useAuth();

    const handleLogout = async () => {
        await logout();
    }
    
    if(loading) return <h1>loading</h1>

    return  <div className="w-full max-w-xs m-auto text-black">
                <div className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-x1 mb-4">Bienvenido wachin {user.email}</h1>
                    <button className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black" onClick={handleLogout}>logout</button>
                </div>
            </div>;
}