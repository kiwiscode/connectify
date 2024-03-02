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
        if (response.status === 201) {
          setSuccess("Verification email sent");
          setFullname("");
          setUsername("");
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
        if (status === 409) {
          setError(errorMessage);
          setSuccess("");
        }
      });
  };

  return (
    <>
      <Container className="text-end" fluid="true">
        <Row>
          <Col
            style={
              {
                // backgroundColor: "blue",
              }
            }
            xxl={12}
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <div>
              <div className="header-container">
                <p>
                  <span className="header-first header">Happening now</span>
                </p>
                <p>
                  <span className="header-second header">Join today.</span>
                </p>
              </div>

              <div
                className="responsive-input-group"
                style={{
                  float: "right",
                }}
              >
                <InputGroup className="mb-2">
                  <Form.Control
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    placeholder="Fullname"
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    maxLength={50}
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

                  <p
                    style={{
                      // backgroundColor: "indianred",
                      textAlign: "start",
                    }}
                    className="by-signing"
                  >
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
            </div>
          </Col>
        </Row>
      </Container>
      <div
        style={{
          display: " flex",
          justifyContent: "right",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            lineHeight: "16px",
            fontWeight: "400",
            color: "#f7555f",
          }}
        >
          {error ? error + "." : null}
        </div>
        <div
          style={{
            fontSize: "13px",
            lineHeight: "16px",
            fontWeight: "400",
            color: "rgb(83, 100, 113)",
          }}
        >
          {success ? success + "." : null}
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
