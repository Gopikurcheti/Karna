import React from 'react'
import '../css/Home.css'
import { useNavigate } from 'react-router-dom'

function Home() {

  const navigate = useNavigate()

  return (
    <>
         <div className='container'>
              <div className="first">
                <img src="/karna.jpg" width="200" style={{borderRadius:'12px'}}/>
                 <h1 style={{textAlign:'center',color:'white'}}> Welcome to the world of K.A.R.N.A&nbsp;<img src='sun.png' width='35px'/></h1>
                 <p style={{fontSize:'22px',fontWeight:'600', textAlign:'center', color:'white'}}>Skill beyond limits. Intelligence without ego...</p>


                 <button id="btn" onClick={()=>{navigate("/login")}}>Continue</button>
              </div>

         </div>
    </>
  )
}

export default Home