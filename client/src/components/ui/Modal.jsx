import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";
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
      <Container
        style={{
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
        <Row style={{ justifyContent: "end" }}>
          <Col md={6}>
            <p className="have-account">Already have an account ?</p>
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
                  <a href="">Sign up</a>
                </span>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function LogoutModal() {
  const navigate = useNavigate();
  const localeInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [show, setShow] = useState(false);
  const { getToken, logout } = useContext(UserContext);

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    e.preventDefault();
    setShow(true);
  };

  const handleLogout = () => {
    axios
      .post(`${API_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => {
        navigate("/");
        logout();
      })
      .catch((err) => {
        err;
      });
  };

  return (
    <>
      <a href="" onClick={handleShow}>
        <div>
          <div className="username-nav">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="25"
              fill="currentColor"
              className="bi bi-person-circle"
              viewBox="0 0 20 20"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>
            <span>{localeInfo.username}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="25"
              fill="currentColor"
              className="bi bi-three-dots"
              viewBox="0 0 20 20"
              style={{ marginLeft: "20px" }}
              onClick={() => handleShow()}
            >
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
          </div>
        </div>
      </a>
      <Modal
        show={show}
        onHide={handleClose}
        className="logout-modal"
        size="sm"
      >
        <Modal.Body>
          <p
            className="logout-p"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            Log out @{localeInfo.username}
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}

function PostModal() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const maxCharacters = 140;

  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= maxCharacters) {
      setText(inputText);
    } else {
      setError("Tweet length to 140 characters");
    }
  };
  console.log(text);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handlePost = () => {
    handleClose();

    const token = localStorage.getItem("token");
    axios
      .post(
        `${API_URL}/home/post`,
        {
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="compose-tweet">
        Post
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <span style={{ marginLeft: "30px", marginTop: "15px" }}>
          What is happening?!
        </span>
        <Modal.Body>
          <textarea
            rows="4"
            cols="50"
            value={text}
            className="input-post"
            onChange={handleChange}
            maxLength={maxCharacters}
            style={{ resize: "none", marginLeft: "30px", marginTop: "15px" }}
          />
        </Modal.Body>
        <Modal.Footer className="post-modal-footer ml-1  ">
          <Button
            variant="primary"
            onClick={handlePost}
            className="post-btn float-sm-end "
          >
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export { SigninModal, LogoutModal, PostModal };
