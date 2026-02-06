import React, { useEffect, useState } from 'react'
import '../css/Chat.css'
import {db, auth} from '../Firebase'
import {useAuthState} from "react-firebase-hooks/auth"
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

function Chat() {

  const [user] = useAuthState(auth)
  
  const[users, setUsers] = useState([])
  const[messages, setMessages] = useState([])
  const[newMessage, setNewMessage] = useState('')


   const handleSendMessage = async (e)=>{
    alert('sending messages is disabled now')
  }


  useEffect(()=>{
    const fetchUsers = async () =>{
        const userCollection = collection(db, "users")
      
        onSnapshot(userCollection, (snapshot)=>{
          const userList = snapshot.doc.map(doc=>doc.data())
          setUsers(userList)
          console.log(userList)
        })
    }
    fetchUsers();
  },[])

  useEffect(()=>{
    const msgRef = collection(db, 'Chats', 'room1', 'messages');
    const q = query(msgRef, orderBy('timestamp'))

    const unsubscribe = onSnapshot(q,(snapshot)=>{
      const msgs = snapshot.docs.map((doc)=>doc.data());
      setMessages(msgs)
    })
    return()=> unsubscribe();
  },[])

  return (
   <>
    <div className='chat-container'>
      <h1 style={{color:'white'}}>Your personal chats</h1>


      <div className='chats'>
        {messages.length===0 ? (<p>No message available</p>):(
          messages.map((msg,index)=>{
            const sender = users.find((u)=>u.uid.trim()===msg.sender.trim());
            const senderName = sender ? sender.name : 'Unknown'
            return(
              <div key={index}  style={{textAlign:user.uid===msg.sender? 'right':'left', padding:'10px 0 0 20px'}}>
                  <strong>{senderName} :</strong>
                  {msg.message}
              </div>
            )

          })
        )}

      </div>

      <form id='chat-form' onSbimt={handleSendMessage}>

        <input
        id='chat-inp'
        value={newMessage}
        onChange={(event)=>{setNewMessage(event.target.value)}}
        placeholder='Enter your message' />

        <button id="chat-btn" >
           <div class="svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
      </svg>
    </div>
    <span>Send</span></button>
      </form>
    </div>
   </>
  )
}

export default Chat