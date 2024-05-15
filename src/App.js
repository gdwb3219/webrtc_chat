import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./page/MainPage";
import MeetingPage from "./page/MeetingPage";
import WebRTCComponent from "./components/WebRTCComponent";
import NavBar from "./components/NavBar";
import WebRTCComponent2 from "./components/WebRTCComponent2";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/meeting2' element={<WebRTCComponent />} />
        <Route path='/meeting1' element={<WebRTCComponent2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
