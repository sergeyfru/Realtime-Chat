import React, { useState } from "react";
import { socket } from "../socket";
import { Room } from "./Room/Room";

export function ConnectionManager() {
  const [roomCode, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [username, setUsername] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);


  function connect() {
    
    socket.connect();
    
    const roomCode = prompt("Do you have room Code?");
    const userName = prompt("Your name: ");
    // let roomName = ``;
    if (roomCode.trim() === "") {
      console.log('Have a code');
      
      socket.emit('createRoom',({userName}))

      socket.on('roomCreated',(roomCode)=>{
        setRoom(roomCode)
        alert(`Room created! Code for room: ${roomCode}`)
      })
    }else{
      socket.emit('joinRoom',({roomCode,userName}))
      socket.on('roomError',msg=>{
        alert(msg)
        socket.disconnect()
      })
      socket.on('roomJoined',msg=>{
        setRoom(roomCode)
        alert(msg)
      })
    }
    socket.on('updateUsers',(users)=>{
      console.log('update');
      console.log(users);
      
      setUsers(users)
    })

    // socket.emit("join", { roomCode, userName, roomName });
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>



      {socket.connected && <Room roomCode={roomCode} users={users}></Room>}
      
      {/* (
        <div>
<h3>Room Code: {roomCode}</h3>
      <ul>
          {users.map((user,i) => {
            return (<li key={i}>{user.name}</li>)
          })}
        </ul>
          </div>
        )} */}
       
      
    </>
  );
}
