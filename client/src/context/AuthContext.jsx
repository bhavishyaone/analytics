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
        setLoading(true)
        try {
            const res = await api.post('/auth/login', { email, password })
            localStorage.setItem('token', res.data.token)
            const me = await api.get('/auth/me')
            setUser(me.data.user)
            return res.data
        } finally {
            setLoading(false)
        }
    }

    const register = async (name, email, password) => {
        setLoading(true)
        try {
            const res = await api.post('/auth/register', { name, email, password })
            localStorage.setItem('token', res.data.token)
            const me = await api.get('/auth/me')
            setUser(me.data.user)
            return res.data
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }


    const updateUser = (patch) => setUser(prev => ({ ...prev, ...patch }))

    const isAuthenticated = !!user
    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated, loading }}>
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