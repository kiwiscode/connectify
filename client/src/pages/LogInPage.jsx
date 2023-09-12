import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function LogInPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { updatedUser } = useContext(UserContext);

  const handleLogin = () => {
    axios
      .post(`${API_URL}/auth/login`, {
        username,
        password,
      })
      .then((response) => {
        const { token, user } = response.data;
        console.log(response);
        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("followers", JSON.stringify(user.followers));
        localStorage.setItem("following", JSON.stringify(user.following));
        localStorage.setItem("posts", JSON.stringify(user.posts));
        updatedUser(user);
        setError("");
        navigate("/");
      })
      .catch((err) => {
        const { status } = err.response;
        const { errorMessage } = err.response.data;
        console.log(err.response.data.errorMessage);
        if (status === 403) {
          setError(errorMessage);
        }
        if (status === 402) {
          setError(errorMessage);
        }
        if (status === 400) {
          setError(errorMessage);
        }
        if (status === 401) {
          setError(errorMessage);
        }
      });
  };
  return (
    <>
      <div>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button onClick={() => handleLogin()}>Sign in</button>
            {error}
          </div>
        </div>
      </div>
    </>
  );
}

export default LogInPage;
