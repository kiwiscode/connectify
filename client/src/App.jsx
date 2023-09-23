import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/home" element={<MainPage />}></Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
