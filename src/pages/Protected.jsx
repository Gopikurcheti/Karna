import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../Firebase'

function Protected({Component}) {
   const navigate= useNavigate()
   const[loading, setLoading] = useState(true)
   const[loggedIn, setLoggedIn] = useState(false)

   useEffect(()=>{
     const checkUser =  onAuthStateChanged( auth, (user)=>{
        if(user){
            setLoggedIn(true)
        }
        else{
            navigate("/login")
        }
        setLoading(false)
       })
       return()=>checkUser()
   },[navigate])

   if(loading){
        return<h2>Loading...</h2>
   }

   return loggedIn  ? <Component/>: null;
}

export default Protected