import React, { useEffect, useRef, useState } from "react";
import logo from "../logo.svg";
import "../App.css";
import VideoChat from "../VideoChat";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

function MainPage() {
  const [stream, setStream] = useState(null);
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState();
  const socketRef = useRef(null);

  const socket = io.connect('http://localhost:3001')

  const sendMessage = () => {
    socket.emit("send'em", { message: message})
    console.log("Message는 보냈다!")
  }

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:3001');
  
    socketRef.current.on("received_message", (data) => {
      setMessageReceived(data.message);
      console.log("Message Receive?")
    });
  
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     setMessageReceived(data.message);
  //   });
  // }, [socket]);

  // const handleMessage = (e) => {
  //   setMessage(e.target.value)
  //   console.log(message, "Message")
  // }

  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
          <br />
          <button>
            <Link to='meeting'> 방 입장 </Link>
          </button>
          <br />
          {/* <input onChange={handleMessage}></input> */}
          <button onClick={sendMessage}>메시지 보내기!</button>
          <div className="received">
            <h2>Message : </h2>
            <p>{messageReceived}</p>
          </div>
        </header>
      </div>
    </>
  );
}

export default MainPage;
