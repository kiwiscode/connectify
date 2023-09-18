import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function UserProfile() {
  const navigate = useNavigate();
  const { logout, getToken } = useContext(UserContext);

  const handleLogout = () => {
    console.log("Button clicked");
    axios
      .post(`${API_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => {
        logout();
        navigate("/");
      })
      .catch((err) => {
        err;
      });
  };

  return (
    <>
      <div>User Profile</div>
      <button onClick={() => handleLogout()}>Logout</button>
    </>
  );
}

export default UserProfile;
