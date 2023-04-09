import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

import { io, Socket } from "socket.io-client";
import { getSessionDetail } from '../Api';

let room : any = null;
var socket : Socket;

function displayMessage(message:any){
  const div = document.createElement("div")
  div.textContent = message
  document.getElementById("messageContainer")?.append(div)
}

function SessionPage() {
  const [session, setSession] = useState(); 
  const [sessionParams, setSessionParams] = useSearchParams();
  const [message, setMessage]= useState();
  const [joined, setJoined] = useState(); 

  room = sessionParams.get("id")  
  useEffect(()=>{
    socket = io('ws://localhost:3000');
    socket.on('connection', function() {
      // set the new count on the client
      console.log("connected to socket.io sv")
    })
    socket.on('sendMessageToUsers', payload => {
      // set the new count on the client
      console.log(payload)
      displayMessage(payload.message)
      console.log(socket.id)
    })
    fetchSession(room);
  },[])
  const joinSession = () => {
    socket.emit("joinRoom", room, message => {
      console.log("Joined room: ", message)
    })
    console.log(socket.id)   
    setJoined(true);
  };

  const update = (str) => {
    setMessage(str)
  }

  const handleClick = () => {

    socket?.emit('sendMessage', socket.id, message, room);
    displayMessage(message)
    console.log("sent a message")
    setMessage("")
  }


  const fetchSession = (room:any): void => {
    getSessionDetail(room)
    .then(({ data: { session } }: Session | any) => setSession(session))
    .catch((err: Error) => console.log(err))
  }


  return (
    <div>
      <h1>{session?.name}</h1>
      <button type="button" onClick={joinSession}>Join</button>
      {joined && <div>
        <div id="messageContainer">

          </div>
          <input id='textInput' onChange={(e)=>{
            update(e.target.value);
          }} value={message}/>
          <button type="button" onClick={handleClick}>
            Send
          </button>
          <h2>{session?.description}</h2>
        
      </div>
    }
    </div>

  )
}

export default SessionPage