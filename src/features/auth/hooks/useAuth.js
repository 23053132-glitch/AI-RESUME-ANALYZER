//brain of the authenticattion system
//it contain all the bussiness logic like login,logout,register,change the state.loading handling

import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import {login,logout,register,getMe} from "../services/auth.api";

export const useAuth = () =>{
    const context = useContext(AuthContext) 

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    const {user,setUser,loading,setLoading} =  context

    const handleLogin = async({email,password})=>{ // api login is called
        setLoading(true) //this means api request is sent
        try{
            const data = await login({email,password})//    Frontend Receives Response
            setUser(data.user)//global User State Updated
            return { success: true }
        }
        catch(err){
            console.error(err)
            return { success: false, message: err.response?.data?.message || "Login failed" }
        }
        finally{
            setLoading(false)
        }
    }

const handleRegister = async({ username,email,password})=>{ // api login is called
        setLoading(true)
             try{
            const data = await register({username,email,password})
            setUser(data.user)
            return { success: true }
        }
        catch(err){
            console.error(err)
            return { success: false, message: err.response?.data?.message || "Registration failed" }
        }
        finally{
            setLoading(false)
        }
    }
     const handleLogout = async()=>{ // api login is called
    setLoading(true)
    try{
        const data = await logout()
        setUser(null)
    }catch(err){
          console.error(err)
    } finally{
        setLoading(false)
    }
    }



    
    return {user,loading ,handleLogin,handleLogout,handleRegister}
}
