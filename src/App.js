import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./page/MainPage";
import MeetingPage from "./page/MeetingPage";
import WebRTCComponent from "./components/WebRTCComponent";
import NavBar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/meeting1' element={<MeetingPage />} />
        <Route path='/meeting2' element={<WebRTCComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
