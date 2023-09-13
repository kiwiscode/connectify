import axios from "axios";
import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Button, Form, InputGroup } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function LogInPage() {
  // const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showmodal, setShowmodal] = useState("hide");
  const [showbutton, setShowbutton] = useState("hide");
  const [hideme, setHideme] = useState("");
  const { updatedUser } = useContext(UserContext);
  const handleShowButton = () => {
    setShowbutton("");
    setHideme("hide");
    setShowmodal("");
  };
  const handleLogin = () => {
    setShowmodal("");
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
        if (response) {
          setError("");
          updatedUser(user);
          // navigate("/userProfile");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response !== undefined) {
          const { status } = err.response;
          const { errorMessage } = err.response.data;
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
        } else {
          return;
        }
      });
  };
  return (
    <>
      <div>
        <div>
          <div className={`signin-info-modal ${showmodal} `}>
            <InputGroup className="mb-2">
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>{" "}
            <InputGroup className="mb-2">
              <Form.Control
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </div>
          <div>
            <p className={`${hideme}`}>Already have an account ?</p>
            <Button
              onClick={() => handleLogin()}
              variant="light"
              className={`${showbutton}`}
            >
              Sign in
            </Button>
            <Button
              variant="light"
              onClick={() => handleShowButton()}
              className={`${hideme}`}
            >
              Sign in{" "}
            </Button>
            {error}
          </div>
        </div>
      </div>
    </>
  );
}

export default LogInPage;
