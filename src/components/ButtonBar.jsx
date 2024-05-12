import React from "react";
import "../css/ButtonBar.css";

function ButtonBar() {
  return (
    <>
      <div className='dashboard'>
        <div className="status-container">
          <div className="timer">타이머</div>
          <div className="refresh">새로고침</div>
        </div>
        <div className="topic-container">
          <div className="topic">1번 토픽</div>
          <div className="topic">2번 토픽</div>
          <div className="topic">3번 토픽</div>
        </div>
      </div>
    </>
  );
}

export default ButtonBar;
