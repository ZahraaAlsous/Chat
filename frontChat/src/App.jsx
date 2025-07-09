import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import ChatPage from './Pages/ChatPage.jsx';
import UserProfile from './Pages/profile.jsx';
import GamesPage from './Pages/GamePage.jsx';
import CallHistoryPage from './Pages/CallHIstory.jsx';
import AboutPage from './Pages/AboutPage.jsx';
import TherapyPage from './Pages/TherapyPage.jsx';
import BotPage from './Pages/BotPage.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AudioCallWithCamera from './components/AudioCallWithCamera.jsx';



function App() {
  return (
    <>
       <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ChatPage" element={<ChatPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/calls" element={<CallHistoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/therapy" element={<TherapyPage />} />
          <Route path="/bot" element={<BotPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
      <ToastContainer />
      {/* <OutgoingCall /> */}
      {/* <AudioCallWithCamera /> */}
      {/* <AudioCallWithCamera/> */}
    </>
  );
}

export default App
