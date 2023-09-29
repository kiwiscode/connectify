import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import UserProfile from "./pages/UserProfilePage";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/home" element={<MainPage />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
