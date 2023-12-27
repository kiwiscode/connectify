import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import UserProfile from "./pages/UserProfilePage";
import SpesificUserProfile from "./pages/SpesificUserProfile";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MessagesPage from "./pages/MessagesPage";
import ChatDetailsPage from "./pages/ChatDetailsPage";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/home" element={<MainPage />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/profile/:id" element={<SpesificUserProfile />}></Route>
        <Route path="/messages" element={<MessagesPage />}></Route>
        <Route
          path="/messages/:chatRoomId"
          element={<ChatDetailsPage />}
        ></Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
