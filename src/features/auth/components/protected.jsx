//"Protected routes prevent unauthorized users from accessing private pages by checking authentication state before rendering protected components."
import { useAuth } from "../hooks/useAuth";
import {  Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
  const {loading,user} = useAuth()// reads the ath states and globally using the auth data like loading and user state
 // calling for navigation from home page to login page 
  if(loading){
    return(<main><h1>Loading....</h1></main>)
  }
  if(!user){
return <Navigate to={'/login'}/>
  }
  return children//than it is authenticated and renders to protected component.

}
export default Protected
