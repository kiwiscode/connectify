import axios from "axios";
import { useState } from "react";
import { Button, Form, InputGroup, Container, Row, Col } from "react-bootstrap";
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
        if (status === 402) {
          setError(errorMessage);
          setSuccess("");
        }
        if (status === 403) {
          setError(errorMessage);
          setSuccess("");
        }
        if (status === 405) {
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
      <Container
        style={{
          justifyContent: "center",
          marginTop: "120px",
        }}
      >
        <Row style={{ justifyContent: "end" }}>
          <Col md={6}>
            <div>
              <div className="header-container">
                <p>
                  <span className="header-first header">Happening now</span>
                </p>
                <p>
                  <span className="header-second header">Join today.</span>
                </p>
              </div>
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
                  <Button onClick={() => handleSignUp()} className="create-btn">
                    Create account
                  </Button>
                  <p className="by-signing">
                    By signing up, you agree to the{" "}
                    <a href="">
                      {" "}
                      <span style={{ color: " rgb(29, 155, 240)" }}>
                        Terms of Service{" "}
                      </span>
                    </a>
                    and{" "}
                    <a href="">
                      <span style={{ color: " rgb(29, 155, 240)" }}>
                        Privacy Policy
                      </span>
                    </a>
                    ,including{" "}
                    <a href="">
                      <span style={{ color: " rgb(29, 155, 240)" }}>
                        Cokkie Use
                      </span>
                    </a>
                    .
                  </p>
                </div>
              </div>
              {error}
              {success}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SignUpPage;
