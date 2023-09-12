import axios from "axios";
import { useState } from "react";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function LogInPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  const handleLogin = () => {
    axios
      .post(`${API_URL}/auth/login`, {
        username,
        email,
        password,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button onClick={() => handleLogin()}>Sign in</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogInPage;
