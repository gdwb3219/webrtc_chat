import React, { useEffect, useState } from "react";
import "../css/ButtonBar.css";


function ButtonBar() {
  // 객체 배열 생성
  const [objects, setObjects] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [lastSelectedIds, setLastSelectedIds] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // 초기 로딩 여부를 추적하는 상태

  // 컴포넌트 마운트 시 객체 배열 초기화
  useEffect(() => {
      const initialObjects = [];
      for (let i = 1; i <= 30; i++) {
        initialObjects.push({ id: i });
      }
      setObjects(initialObjects);
    }, []);

  // 랜덤 객체 선택 함수
  const handleRandomDisplay = () => {
    const selected = [];
    const availableObjects = objects.filter(obj => !lastSelectedIds.includes(obj.id));

    while (selected.length < 3) {
      if (availableObjects.length === 0) {
        // 사용 가능한 객체가 없으면 초기 상태로 리셋
        selected.push(...objects.slice(0, 3));
        break;
      }
      const randomIndex = Math.floor(Math.random() * availableObjects.length);
      const candidate = availableObjects[randomIndex];
      selected.push(candidate);
      availableObjects.splice(randomIndex, 1); // 선택된 객체 제거
    }

    setSelectedObjects(selected);
    setLastSelectedIds(selected.map(obj => obj.id));
    setIsFirstLoad(false); // 첫 로딩 상태 해제
  };

  return (
    <>
      <div className='dashboard'>
        <div className="status-container">
          <div className="timer">타이머</div>
          <div className="refresh" onClick={handleRandomDisplay}>새로고침</div>
        </div>
        {isFirstLoad ? (
        <div className="topic-container">
          <div className="topic">Not Yet</div>
          <div className="topic">Not Yet</div>
          <div className="topic">Not Yet</div>
        </div>
      ) : (

        <div className="topic-container">
            {selectedObjects.map(obj => (
              <div className="topic" key={obj.id}>{obj.id}번 토픽</div>
            ))}
          
        </div>)}
      </div>
    </>
  );
}

export default ButtonBar;
