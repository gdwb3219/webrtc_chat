import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

function MainPage() {
  const [message, setMessage] = useState("");

  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <button className='enter-button'>
            <Link className='link-style' to='meeting2'>
              Meeting Room2 입장
            </Link>
          </button>
          <button className='enter-button'>
            <Link className='link-style' to='meeting1'>
              Meeting Room1 입장
            </Link>
          </button>
        </header>
      </div>
    </>
  );
}

export default MainPage;
