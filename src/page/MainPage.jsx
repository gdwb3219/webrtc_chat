import React, { useState } from "react";
import logo from "../logo.svg";
import "../App.css";
import VideoChat from "../VideoChat";
import { Link } from "react-router-dom";

function MainPage() {
  const [stream, setStream] = useState(null);
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
        </header>
      </div>
    </>
  );
}

export default MainPage;
