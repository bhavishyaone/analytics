import api from "../services/api.js";
import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext(null)

export function AuthProvider({children}){
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){

            api.get("/auth/me")

            .then(res => setUser(res.data.user))
            .catch(()=>{
                localStorage.removeItem('token')
            })
            .finally(()=>setLoading(false))
        }
        else{
            setLoading(false)
        }
    },[])


    const login = async(email,password)=>{
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('token', res.data.token)
        const me = await api.get('/auth/me')
        setUser(me.data.user)
        return res.data
    
    }

    const register = async (email, password) => {
        const res = await api.post('/auth/register', { email, password })
        localStorage.setItem('token', res.data.token)
        const me = await api.get('/auth/me')
        setUser(me.data.user)
        return res.data
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }


    const isAuthenticated = !!user
    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    )


}


export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) 
    throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}