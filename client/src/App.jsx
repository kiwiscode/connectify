import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import UserProfile from "./pages/UserProfilePage";
import { Routes, Route } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/user-profile" element={<UserProfile />}></Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
