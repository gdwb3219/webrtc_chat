import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

function MainPage() {
  const [message, setMessage] = useState("");

  const socket = io.connect("http://localhost:3001");

  const sendMessage = () => {
    socket.emit("send'em", { message: message });
    console.log("Message는 보냈다!");
  };

  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <button className='enter-button'>
            <Link className='link-style' to='meeting1'>
              방 1 입장
            </Link>
          </button>

          <button className='enter-button'>
            <Link className='link-style' to='meeting2'>
              방 2 입장
            </Link>
          </button>

          <div className='enter-button'>
            <Link className='link-style' to='meeting2'>
              방 2 입장
            </Link>
          </div>
        </header>
      </div>
    </>
  );
}

export default MainPage;
