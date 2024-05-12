import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

function MainPage() {
  const [stream, setStream] = useState(null);
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
