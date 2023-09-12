import axios from "axios";
import { useState } from "react";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function SignUpPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = () => {
    axios
      .post(`${API_URL}/auth/signup`, {
        fullname,
        username,
        email,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.message);
        }
        setError("");
      })
      .catch((err) => {
        if (err.response.status === 403) {
          setError(err.response.data.errorMessage);
          setSuccess("");
        }
        if (err.response.status === 402) {
          setError(err.response.data.errorMessage);
          setSuccess("");
        }
        if (err.response.status === 501) {
          setError(err.response.data.errorMessage);
          setSuccess("");
        }
      });
  };

  return (
    <>
      <div>
        <div>
          <input
            type="text"
            value={fullname}
            placeholder="Fullname"
            onChange={(e) => setFullname(e.target.value)}
          />
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button onClick={() => handleSignUp()}>Create Account</button>
          </div>
        </div>
        {error}
        {success}
      </div>
    </>
  );
}

export default SignUpPage;
