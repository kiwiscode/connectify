import axios from "axios";
import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
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
        const { status } = err.response;
        const { errorMessage } = err.response.data;
        if (status === 403) {
          setError(errorMessage);
          setSuccess("");
        }
        if (status === 402) {
          setError(errorMessage);
          setSuccess("");
        }

        if (status === 501) {
          setError(errorMessage);
          setSuccess("");
        }
      });
  };

  return (
    <>
      <div>
        <div>
          <InputGroup className="mb-2">
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Fullname"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
          <div>
            <Button onClick={() => handleSignUp()}>Create Account</Button>
          </div>
        </div>
        {error}
        {success}
      </div>
    </>
  );
}

export default SignUpPage;
