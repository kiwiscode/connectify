import {
  Container,
  Row,
  Col,
  Button,
  Stack,
  InputGroup,
  Modal,
  Form,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { SigninModal } from "../components/ui/Modal";
import { useContext, useState } from "react";
import axios from "axios";
import { Layout, Flex } from "antd";
import { ThemeContext } from "../context/ThemeContext";
const { Footer } = Layout;
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function DeactivatedPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);

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
        setFullname("");
        setUsername("");

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

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);

  const navigate = useNavigate();

  const redirectHomePageToSignUp = () => {
    navigate("/");
  };

  return (
    <>
      {/* start to check signup modal  */}
      <Modal show={show} onHide={handleClose} size="lg" centered={true}>
        <Modal.Header
          style={{
            border: "none",
          }}
        >
          <div
            onClick={handleClose}
            className="close-button"
            style={{
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            <div>
              <svg
                style={{
                  border: "none",
                  fontSize: "15px",
                  margin: "5px",
                }}
                onClick={handleClose}
                width={20}
                height={20}
                color="rgb(15,20,25)"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>{" "}
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
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
                <span style={{ color: " rgb(29, 155, 240)" }}>Cokkie Use</span>
              </a>
              .
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            border: "none",
          }}
        >
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
        </Modal.Footer>
      </Modal>
      {/* finish to check signup modal */}
      <Container fluid>
        <Row
          style={{
            height: "100vh",
            borderTop: "none",
            borderBottom: "none",
          }}
        >
          <Col
            style={{
              borderRight:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
            className="left-column-settings-deactivated d-none d-xs-none sm-none d-md-block d-lg-block d-xxl-block"
            xs={2} // 0px - 576px aralığı
            sm={2} // 576px - 768px aralığı
            md={1} // 768px - 992px aralığı
            lg={3} // 1200px - 1400px aralığı
            xxl={3} // 1400px ve sonrası aralığı
          >
            <div
              style={{
                width: "100%",
                textAlign: "center",
                position: "relative",
                top: "10%",
              }}
            >
              <div
                className={`deactivation-page-settings deactivation-page-settings-${themeName}`}
                style={{
                  cursor: "pointer",
                  borderRadius: "9999px",
                  padding: "12px",
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    width: "166px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "7.5%",
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "white" : "black"}
                    fill="currentColor"
                    width={26}
                    height={26}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g>
                      <path d="M22.25 13.46v-2.92l-2.36-1.57c-.17-.12-.26-.33-.21-.53l.58-2.54-2.17-2.17-2.53.59c-.21.04-.42-.04-.53-.21l-1.57-2.36h-2.92L8.96 4.11c-.11.17-.32.25-.52.21L5.9 3.73 3.73 5.9l.58 2.54c.05.2-.03.41-.21.53l-2.35 1.57v2.92l2.35 1.57c.18.12.26.33.21.53l-.58 2.54 2.17 2.17 2.54-.59c.2-.04.41.04.52.21l1.58 2.36h2.92l1.57-2.36c.11-.17.32-.25.53-.21l2.53.59 2.17-2.17-.58-2.54c-.05-.2.04-.41.21-.53l2.36-1.57zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3c1.65 0 3 1.34 3 3s-1.35 3-3 3z"></path>
                    </g>
                  </svg>

                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      lineHeight: "24px",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    Settings
                  </span>
                </div>
              </div>
            </div>
          </Col>

          {/* start to check  main column */}

          <Col
            className="d-none d-lg-block d-xxl-block md-none"
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={6} // 768px - 992px aralığı
            lg={3} // 1200px - 1400px aralığı
            xxl={3} // 1400px ve sonrası aralığı
            style={{
              padding: "0px",
              borderRight:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "16px",
              }}
            >
              <div
                style={{
                  marginBottom: "15px",
                  fontWeight: "700",
                  fontSize: "20px",
                  lineHeight: "24px",
                }}
              >
                Settings
              </div>
              <div
                style={{
                  marginBottom: "15px",
                  fontWeight: "700",
                  fontSize: "20px",
                  lineHeight: "24px",
                }}
              >
                Privacy
              </div>
              <div
                className={`deactivated-info-left-side deactivated-info-left-side-${themeName}`}
                style={{}}
              >
                <div
                  style={{
                    // width: "90%",

                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <div>Personalization and data</div>
                    <span
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      Allow some
                    </span>
                  </div>
                  <div
                    className="ms-auto"
                    style={{
                      height: "auto",
                      margin: "auto 0",
                    }}
                  >
                    <svg
                      style={{}}
                      color="rgb(113, 118, 123)"
                      fill="currentColor"
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="ms-auto r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-1q142lx r-f727ji"
                    >
                      <g>
                        <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                      </g>
                    </svg>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Your C data</div>
                    <svg
                      color="rgb(113, 118, 123)"
                      fill="currentColor"
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-1q142lx r-f727ji"
                    >
                      <g>
                        <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    // width: "90%",

                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <div>Cookie preferences</div>
                    <span
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      Manage your cookie experience on C.
                    </span>
                  </div>
                  <div
                    className="ms-auto"
                    style={{
                      height: "auto",
                      margin: "auto 0",
                    }}
                  >
                    <svg
                      style={{}}
                      color="rgb(113, 118, 123)"
                      fill="currentColor"
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="ms-auto r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-1q142lx r-f727ji"
                    >
                      <g>
                        <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: "15px",
                  lineHeight: "20px",
                  fontWeight: "400",
                }}
                className="mt-5"
              >
                These settings apply to this browser or device while you’re
                logged out. They don’t have any effect when you’re logged in.
              </div>
            </div>
            <div
              style={{
                borderBottom:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>

            <div
              style={{
                padding: "16px",
                fontSize: "20px",
                fontWeight: "800",
                lineHeight: "24px",
                color: themeName === "dark-theme" ? "white" : "black",
              }}
            >
              General
            </div>
            <div>
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    lineHeight: "20px",
                    color: themeName === "dark-theme" ? "white" : "black",
                  }}
                >
                  Additional resources
                </div>
                <svg
                  color="rgb(113, 118, 123)"
                  fill="currentColor"
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-1q142lx r-f727ji"
                >
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </Col>
          {/* finish to check  main column */}

          {/* 3.column burası olucak */}
          <Col
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={11} // 768px - 992px aralığı
            lg={6} // 1200px - 1400px aralığı
            xxl={6} // 1400px ve sonrası aralığı
            style={{
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "8px",
              }}
            >
              <div
                style={{
                  marginBottom: "15px",
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "24px",
                }}
              >
                Deactivated
              </div>
              <div
                style={{
                  marginBottom: "15px",
                  fontSize: "20px",
                  fontWeight: "800",
                  lineHeight: "24px",
                }}
              >
                Your account is deactivated
              </div>
              <div
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "16px",
                }}
              >
                Sorry to see you go. #GoodBye
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* start to check  */}

      <Flex
        style={{
          backgroundColor: "rgba(29,155,240,1.00)",
          position: "fixed",
          bottom: "0",
          width: "100%",
        }}
        gap="middle"
        wrap="wrap"
      >
        <Footer
          style={{
            textAlign: "center",
            color: "#fff",
            backgroundColor: "rgba(29,155,240,1.00)",
            maxHeight: "72px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Stack
            className="deactivated-footer"
            style={{
              display: "flex",
              justifyContent: " center",
            }}
            direction="horizontal"
            gap={1}
          >
            <div
              className="p-2 ms-auto deactivated-footer-text"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                // marginLeft: "50px",
              }}
            >
              <div
                style={{
                  fontSize: "23px",
                  fontWeight: "700",
                  lineHeight: "23px",
                }}
              >
                Don’t miss what’s happening
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "400",
                  lineHeight: "20px",
                }}
              >
                People on Connectify are the first to know.
              </div>
            </div>
            <div className="p-2 ms-auto">
              <SigninModal deactivatedScreen={true} />
            </div>
            <div onClick={redirectHomePageToSignUp} className="p-0">
              <Button
                className="deactivated-footer-signup"
                style={{
                  cursor: "pointer",
                  maxWidth: "87px",
                  maxHeight: "36px",
                  textAlign: "center",
                  border: "none",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  borderRadius: "9999px",
                  lineHeight: "20px",
                  fontSize: "15px",
                  fontWeight: "700",
                  padding: "5px",
                  backgroundColor: "#eff3f4",
                  color: "black",
                }}
                onClick={handleShow}
              >
                Sign up
              </Button>
            </div>
          </Stack>
        </Footer>
      </Flex>
      {/* finish to check  */}
    </>
  );
}

export default DeactivatedPage;
