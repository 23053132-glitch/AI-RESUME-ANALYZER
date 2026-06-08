//global state management layer is auth.context

//Context API acts as centralized global state management for authentication data across the application."
import { createContext, useState, useEffect } from "react"
import { getMe } from "./services/auth.api";
export const AuthContext = createContext()
export const AuthProvider = ({ children }) =>{
    const [user,setUser]=useState(null) // an array with current state value and a function to update 
    const [loading,setLoading] = useState(true) // start true so Protected waits for getMe() before redirecting

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                console.error(err)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    return(
     <AuthContext.Provider 
     value = {{
        user,
        setUser,
        loading,
        setLoading
     }}
     >  
     {children}
     </AuthContext.Provider>
    )
}
