import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import axios from "axios";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function SigninModal() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updatedUser } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleLogin = () => {
    setShow(false);
    axios
      .post(`${API_URL}/auth/login`, {
        username,
        password,
      })
      .then((response) => {
        navigate("/user-profile");
        const { token, user } = response.data;
        console.log(response);
        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("followers", JSON.stringify(user.followers));
        localStorage.setItem("following", JSON.stringify(user.following));
        localStorage.setItem("posts", JSON.stringify(user.posts));
        if (response.status === 200) {
          setError("");
          updatedUser(user);
          handleClose();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response !== undefined) {
          handleShow();
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
          if (status === 500) {
            setError("Please try again later.");
          }
        } else {
          return;
        }
      });
  };

  return (
    <>
      <Button variant="light" onClick={handleShow}>
        Sign in
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Connectify</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span className="sign-in-header mt-4 mb-4">
            Sign in to Connectify
          </span>
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
          {error}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleLogin}>
            Log in
          </Button>
          <span>
            Don&apos;t have an account?
            <a href="">
              <span>Sign up</span>
            </a>
          </span>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SigninModal;
