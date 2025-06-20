import axios from "axios";
import {createContext,useEffect, useState} from "react";

export const AuthContext=createContext();

export const AuthProvider =({children})=>{
    const [isAuthenticated,setIsAuthenticated]=useState(null);
    const [user,setUser]=useState(null);

    useEffect(()=>{
        const funct=async()=>{
            try {
                const res=await axios.get("http://localhost:3000/api/v1/users/dashboard");
                 setUser(res.data.data);
                 setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        funct();
    },[]);

    if (isAuthenticated === null) {
        return <p>Loading...</p>; // You can replace this with a spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
}