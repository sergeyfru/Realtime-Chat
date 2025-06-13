import { useRef, useState } from 'react';
import io from 'socket.io-client'



export const SocketIO_Chat = () => {
  const socket = io('http://localhost:3001',{
    transports:['websocket'],
    withCredentials:true,
    auth:{
      serverOffset: 0
  }
  })

  const [messages,setMessages] = useState(['hi','priv'])
  let testOfMessages = ['hi','priv']

  const inputRef = useRef()

  const sendMessage = (e) =>{
    e.preventDefault()
    const msg = inputRef.current.value.trim()

    if(msg){
      socket.emit('chat message', msg)
    }
    inputRef.current.value =''
    
  }
  socket.on('chat message', (msg)=>{
    const newMessages = [...messages,msg]
    console.log(newMessages);
    setMessages(newMessages)
    
    // setMessages(newMessages)
  })

  return (
    <>
      <ul id="messages">
        <h2>messages:</h2>
        {messages.map((item,i) =>{
          return(
            <li key={i}>{item}</li>
          )
        })}
      </ul>
      <form id="form" action="" onSubmit={(e)=>sendMessage(e)}>
        <input id="input" autoComplete="off" ref={inputRef}/>
        <button>Send</button>
      </form>
    </>
  );
};
