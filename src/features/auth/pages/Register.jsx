import React,{useState} from 'react'
import {useNavigate , Link} from 'react-router'
import { useAuth } from '../hooks/useAuth'
const Register = ()=>{
    
        const navigate = useNavigate()
        const[username,setUsername] = useState("")
        const [email,setEmail] = useState("")
        const[password,setPassword] = useState("")
        const [error, setError] = useState("")
        const {loading ,handleRegister} = useAuth()
        const handleSubmit = async (e) =>{
        e.preventDefault()
        setError("")
        const res = await handleRegister({username,email,password})
        if (res && res.success) {
            navigate("/")
        } else {
            setError(res?.message || "Registration failed")
        }
    }

    

     if(loading){
        return (
            <main><h1>Loading........</h1></main>
        )
    }
    
   // handlesubmit ---> does not refersh the paages automatically run
 return (
      <main>
            <div className = "form-container">
                <h1>Register</h1>
                <form onSubmit ={handleSubmit}>
                      <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                           onChange={(e)=> {setUsername(e.target.value)}}
                        type="text"
                         id="username" name="username" placeholder="    Enter the Name "/>
                    </div>   
                    <div className="input-group">
                        <label htmlFor="email">Email </label>
                        <input
                         onChange={(e)=> {setEmail(e.target.value)}}
                        type="email"
                         id="email" name="email" placeholder="    Enter the email  "/>
                    </div>   
                    <div className="input-group">
                        <label htmlFor="password">Password </label>
                        <input
                           onChange={(e)=> {setPassword(e.target.value)}}
                        type="password" id="password" name="password" placeholder="    Enter the Password "/>
                    </div>
                    {error && <p className="form-error" style={{color: '#ff4d4d', fontSize: '12px'}}>{error}</p>}
                    <button className="button primary-button" >
                        Register
                    </button>

                </form>
                <p className="auth-link">Already have an account ? <Link to={"/login"}>Login</Link></p>
            </div>
  
        </main>
    )
}
export default Register