import React, { useState } from 'react'
import "../auth.form.scss"
import {useNavigate , Link} from 'react-router'
import { useAuth } from '../hooks/useAuth'
const Login = ()=>{
     
    const {loading ,handleLogin} = useAuth()
     const navigate = useNavigate()//use for page redirection
    const [email,setEmail] = useState("")
    const[password,setPassword] = useState("")
    const [error, setError] = useState("")

 const  handleSubmit = async (e) =>{
        e.preventDefault()//stops the browser to refresh the page or used to stop the browser's default behaviour for a specfic event.
        setError("")
        const res = await handleLogin({email,password})
        if (res && res.success) {
            navigate('/')//navigation happen without refreshing the page so this is called client side Routing
        } else {
            setError(res?.message || "Login failed")
        }
 }
   if(loading){
      return (
          <main><h1>Loading......</h1></main>
       )
    }
 return (
        <main>
            <div className = "form-container">
                <h1>Login</h1>
                <form onSubmit ={handleSubmit}>
   
                    <div className="input-group">
                        <label htmlFor="email">Email  : </label>
                        <input 
                        onChange={(e)=> {setEmail(e.target.value)}}
                        type="email"
                         id="email"
                         name="email"
                          placeholder="    Enter the email  "/> 
                          
                    </div>   
                    <div className="input-group">
                        <label htmlFor="password">Password  : </label>
                        <input 
                          onChange={(e)=> {setPassword(e.target.value)}}
                        type="password" id="password" name="password" placeholder="    Enter the Password "/>
                    </div>
                    {error && <p className="form-error" style={{color: '#ff4d4d', fontSize: '12px'}}>{error}</p>}
                    <button className="button primary-button" >
                        Login
                    </button>

                </form>
                    <p className="auth-link"> Don't have an account  ? <Link to={"/register"}>Register an Account</Link></p>
            </div>
  
        </main>
    )
}

export default Login      