import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Container,
  Row,
  Col,
  Stack,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Picker from "emoji-picker-react";
import axios from "axios";
import "../../index.css";

// socket io cleaning up socket.id after logout from online users client start to check
// import io from "socket.io-client";
// socket io cleaning up socket.id after logout from online users client finish to check

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

// const socket = io.connect(API_URL);

function SigninModal() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    console.log("BUTTON CLICKED");
    setShow(true);
  };

  const handleLogin = () => {
    axios
      .post(`${API_URL}/auth/login`, {
        username,
        password,
      })
      .then((response) => {
        handleClose();
        const { token, user } = response.data;
        console.log("User =>", user);

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("token", token);
        updateUser(user);
        setError("");
        navigate("/home");
        window.location.reload();
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
      <Container className="text-end" fluid="true">
        <Row>
          <Col
            xxl={12}
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            style={
              {
                // backgroundColor: "grey",
              }
            }
          >
            <p
              style={{
                // backgroundColor: "purple",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
              className="have-account"
            >
              <span
                className="  responsive-input-group-text 
                "
                style={{
                  position: "relative",
                  right: "98px",
                }}
              >
                Already have an account ?
              </span>
            </p>
            <Button variant="light" onClick={handleShow} className="sign-in ">
              Sign in
            </Button>
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
                    {/* create message icon start to check  */}
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
                    {/* create message icon finish to check  */}
                  </div>
                </div>

                <span>Connectify</span>
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
              <Modal.Footer
                style={{
                  border: "none",
                }}
              >
                <Button
                  className="login-button"
                  variant="dark"
                  onClick={handleLogin}
                >
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
  const { getToken, logout, userInfo } = useContext(UserContext);

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
      {/* start to check  */}

      <div
        style={{
          marginLeft: "5px",
        }}
        className="logout-nav"
        onClick={handleShow}
      >
        {/* start to check */}
        {userInfo.imageUrl.slice(0, 3) !== "../" ? (
          <div>
            <img
              className="profile-img"
              src={userInfo.imageUrl}
              width={40}
              height={40}
              alt=""
              style={{
                borderRadius: "50%",
              }}
            />
          </div>
        ) : (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="rgb(83, 100, 113)"
              className="profile-svg bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
            </svg>
          </div>
        )}

        {/* finish to check */}

        <div className="info-logout">
          <span
            style={{
              color: "rgb(15,20,25)",
              lineHeight: "20px",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            {localeInfo.username}
          </span>
          <span
            style={{
              color: "rgb(83, 100, 113)",
              fontSize: "15px",
              lineHeight: "20px",
              fontWeight: "400",
            }}
          >
            @{localeInfo.username}
          </span>
        </div>
        <svg
          width={`${1.25}em`}
          height={`${1.25}em`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="bi bi-three-dots none-backgroundColor logout-three-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
        >
          <g>
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
          </g>
        </svg>
      </div>

      {/* finish to check */}
      <Modal
        show={show}
        onHide={handleClose}
        className="logout-modal"
        size="sm"
      >
        <Modal.Body>
          <div className="logout-body">
            <p className="logout-p" onClick={handleLogout}>
              Log out @{localeInfo.username}
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
// IMPORTANT => refreshPosts as a props !
function PostModal({ refreshPosts, setLoadingTrue, setLoadingFalse, visible }) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { getToken, userInfo } = useContext(UserContext);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");
  const [showSecondModal, setShowSecondModal] = useState(false);
  const maxCharacters = 140;

  const [modalImage, setModalImage] = useState("");

  //handle and convert it in base 64
  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log("FILE FROM MODAL.JSX =>", file);
    setFileToBase(file);
    console.log(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    console.log("SET FILE TO BASE FILE FROM MODAL.JSX =>", file);

    reader.onloadend = () => {
      setModalImage(reader.result);
    };
  };

  const toggleEmojis = () => {
    setshowEmojisBar("");
    if (showEmojisBar === "") {
      setshowEmojisBar("hide");
    } else if (showEmojisBar === "hide") {
      setshowEmojisBar("");
    }
    setShowSecondModal(true);
  };

  const onEmojiClick = (emojiObject) => {
    setChosenEmoji(emojiObject);
    setContent((prevText) => prevText + emojiObject.emoji);
  };

  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= maxCharacters) {
      setContent(inputText);
    } else {
      setError("Tweet length to 140 characters");
    }
  };

  const handleClose = () => {
    setShow(false);
    setShowSecondModal(false);
  };
  const handleShow = () => setShow(true);

  const handlePost = () => {
    if (content || chosenEmoji || modalImage) {
      handleClose();
      axios
        .post(
          `${API_URL}/home/post`,
          {
            content,
            modalImage,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )

        .then(() => {
          setLoadingTrue();
          setModalImage("");
          setTimeout(() => {
            // IMPORTANT => we are using refreshPosts() it means we are using prop as a function !
            setLoadingFalse();
            refreshPosts();
          }, 1500);
          // handleGetAllPosts();
          setContent("");
        })
        .catch((err) => {
          return err;
        });
    } else {
      handleShow();
      console.log("No content !");
      console.log("Nothing to share !");
    }
  };

  const closeImage = () => {
    setModalImage("");
  };

  const handleMouseOver = (e) => {
    console.log("MOUSE OVER =>", e);
    console.log(e.target.classList);
    const shallowCopy = e.target.classList[0];
    console.log(shallowCopy);
    if (shallowCopy === "target") {
      e.target.style.background = "#595b5b";
    }
  };

  const handleMouseOut = (e) => {
    console.log("MOUSE OVER =>", e);
    console.log(e.target.classList);
    const shallowCopy = e.target.classList[0];
    console.log(shallowCopy);
    if (shallowCopy === "target") {
      e.target.style.background = "#47494a";
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        className={`responsive-post-button ${visible ? "visible" : "hidden"}`}
        size="sm"
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className=" compose-tweet-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp"
          fill="currentColor"
          style={{ color: "rgb(255, 255, 255)" }}
        >
          <g>
            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
          </g>
        </svg>
      </Button>

      <Button
        variant="primary"
        onClick={handleShow}
        className="compose-tweet compose-tweet-2"
        size="sm"
      >
        <span
          style={{
            fontSize: "17px",
            margin: "0",
            padding: "0",
            fontWeight: "700",
            lineHeight: "20px",
            top: "0",
          }}
          className="compose-tweet-text compose-tweet-2"
        >
          Post
        </span>
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className=" compose-tweet-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp"
          fill="currentColor"
          style={{ color: "rgb(255, 255, 255)" }}
        >
          <g>
            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
          </g>
        </svg>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          style={{
            border: "none",
          }}
        >
          <div
            onClick={handleClose}
            className="close-button"
            style={{ borderRadius: "50%", cursor: "pointer" }}
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
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>{" "}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Stack direction="horizontal" gap={1}>
            <div className="p-0">
              {" "}
              {userInfo.imageUrl.slice(0, 3) !== "../" ? (
                <img
                  src={userInfo.imageUrl}
                  width={40}
                  height={40}
                  alt=""
                  style={{ position: "relative", bottom: "30px" }}
                />
              ) : (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="rgb(83, 100, 113)"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                    style={{ position: "relative", bottom: "30px" }}
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-0 ">
              <textarea
                onChange={handleChange}
                rows="4"
                cols="50"
                value={content}
                maxLength={maxCharacters}
                className="input-post"
                placeholder="What is happening?!"
                style={{
                  resize: "none",
                  padding: "8px",
                  color: "rgba(15,20,25,1.00)",
                  lineHeight: "24px",
                  fontWeight: "400",
                  fontSize: `${content ? "15px" : "20px"}`,
                  width: "100%",
                  height: "100px",
                }}
              />
            </div>
          </Stack>
          <div className="d-flex align-items-center">
            <div className="p-2">
              {/* start to check */}

              {/* finish to check */}
            </div>
            <div className="p-2">
              {modalImage && (
                <div style={{ position: "relative" }}>
                  <div
                    className="target"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "rgba(71,73,74,255)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => handleMouseOver(e)}
                    onMouseOut={(e) => handleMouseOut(e)}
                    onClick={closeImage}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        color: "white",
                        fontSize: "22px",
                      }}
                    >
                      &times;
                    </div>
                  </div>
                  <img
                    className="img-fluid"
                    style={{
                      width: "100%",
                      display: "block",
                      overflow: "hidden",
                      border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
                      borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
                    }}
                    src={modalImage ? modalImage : ""}
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="post-modal-footer ml-1">
          <Stack direction="horizontal" gap={0}>
            {/* INFO */}
            <div className="p-2">
              <div
                style={{
                  // border: "1px solid black",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
                className="svg-border-parent"
              >
                <svg
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document.getElementById("formuploadModal").click()
                  }
                  width={20}
                  height={20}
                  color="rgb(29,155,240)"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="bi bi-image-fill post-modal-image-fill r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                  </g>
                </svg>
              </div>

              <input
                onChange={handleImage}
                type="file"
                id="formuploadModal"
                name="modalImage"
                className="form-control"
                style={{ display: "none" }}
              />
            </div>
            {/* INFO */}
            <div className="p-2">
              <div
                className="svg-border-parent"
                style={{
                  // border: "1px solid black",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
              >
                <svg
                  onClick={() => toggleEmojis()}
                  color="rgb(29,155,240)"
                  fill="currentColor"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="post-modal-emoji-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <g>
                    <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className="p-2 ms-auto">
              {/* <div className="p-2 "> */}{" "}
              {content !== "" || modalImage ? (
                <Button
                  variant="primary"
                  onClick={() => handlePost()}
                  className={`post-btn compose-tweet-textArea`}
                >
                  Post
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => handlePost()}
                  className={`emptyContent post-btn compose-tweet-textArea`}
                >
                  Post
                </Button>
              )}
            </div>
          </Stack>
        </Modal.Footer>
        <div
          className={`${showEmojisBar}`}
          style={{
            position: "fixed",
            zIndex: 9999,
            marginTop: "315px",
            marginLeft: "55px",
          }}
        >
          <Picker
            onEmojiClick={onEmojiClick}
            emojiStyle="twitter"
            width={"320px"}
            height={"400px"}
          />
        </div>
      </Modal>
    </>
  );
}

function CommentModal({ post, width, height, refreshPosts }) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [modalImage, setModalImage] = useState("");
  const [error, setError] = useState("");

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");
  const [showSecondModal, setShowSecondModal] = useState(false);

  const { userInfo } = useContext(UserContext);
  const maxCharacters = 140;
  //handle and convert it in base 64
  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log("FILE FROM MODAL.JSX =>", file);
    setFileToBase(file);
    console.log(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    console.log("SET FILE TO BASE FILE FROM MODAL.JSX =>", file);

    reader.onloadend = () => {
      setModalImage(reader.result);
    };
  };

  const toggleEmojis = () => {
    setshowEmojisBar("");
    if (showEmojisBar === "") {
      setshowEmojisBar("hide");
    } else if (showEmojisBar === "hide") {
      setshowEmojisBar("");
    }
    setShowSecondModal(true);
  };
  const onEmojiClick = (emojiObject) => {
    setChosenEmoji(emojiObject);
    setContent((prevText) => prevText + emojiObject.emoji);
  };

  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= maxCharacters) {
      setContent(inputText);
    } else {
      setError("Tweet length to 140 characters");
    }
  };

  const handleClose = () => {
    setShow(false);
    setShowSecondModal(false);
  };

  const handleShow = () => setShow(true);
  const closeImage = () => {
    setModalImage("");
  };

  const handleMouseOver = (e) => {
    console.log("MOUSE OVER =>", e);
    console.log(e.target.classList);
    const shallowCopy = e.target.classList[0];
    console.log(shallowCopy);
    if (shallowCopy === "target") {
      e.target.style.background = "#595b5b";
    }
  };

  const handleMouseOut = (e) => {
    console.log("MOUSE OVER =>", e);
    console.log(e.target.classList);
    const shallowCopy = e.target.classList[0];
    console.log(shallowCopy);
    if (shallowCopy === "target") {
      e.target.style.background = "#47494a";
    }
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

  const handleAddComment = (postId) => {
    console.log("Post id =>", postId);
    axios
      .post(`${API_URL}/comment`, {
        userId: userInfo._id,
        postId,
        commentPost: content,
        modalImage,
      })
      .then((response) => {
        console.log("Response =>", response);

        const mainPagePosts = JSON.parse(localStorage.getItem("mainPagePosts"));

        mainPagePosts.unshift(response.data.createdPost);

        localStorage.setItem("mainPagePosts", JSON.stringify(mainPagePosts));

        setTimeout(() => {
          refreshPosts();
          handleClose();
        }, 500);
        setModalImage("");
        setContent("");
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  return (
    <>
      <div>
        <svg
          onClick={handleShow}
          width={width}
          height={height}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="bi bi-chat r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
          color="rgb(83, 100, 113)"
          fill="currentColor"
        >
          <g>
            <path
              stroke="rgb(83, 100, 113)"
              strokeWidth="0.1"
              d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
            ></path>
          </g>
        </svg>
        <span
          className="post-description"
          style={{ color: "rgb(83, 100, 113)" }}
        >
          {post.comments && post.comments.length ? (
            <span>{post.comments.length}</span>
          ) : null}
        </span>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          style={{
            border: "none",
          }}
        >
          <div
            onClick={handleClose}
            className="close-button"
            style={{ borderRadius: "50%", cursor: "pointer" }}
          >
            <div>
              <svg
                style={{
                  border: "none",
                  fontSize: "15px",
                  margin: "5px",
                }}
                width={20}
                height={20}
                color="rgb(15,20,25)"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>{" "}
            </div>
          </div>
        </Modal.Header>

        {/* start to check twitterdaki gibi post içeriği gelecek body içerisine  */}
        <Modal.Body>
          <Container>
            <Row>
              <Col
                xs={2}
                sm={2}
                md={2}
                lg={2}
                xxl={2}
                style={{
                  textAlign: "center",
                }}
              >
                {/* profile image start to check */}
                <div>
                  {post.userId ? (
                    <>
                      {post.userId.imageUrl.slice(0, 3) !== "../" ? (
                        <img
                          width={40}
                          height={40}
                          src={post.userId.imageUrl}
                          alt=""
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          fill="rgb(83, 100, 113)"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
                      )}
                      <div
                        className="responsive-comment-line-parent-div"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className="responsive-comment-line "
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                            margin: "5px 0px 5px 0px",
                            width: "2px",

                            height: `${
                              post.content.length < 38
                                ? "60px"
                                : post.content.length >= 38 &&
                                  post.content.length < 75
                                ? "80px"
                                : post.content.length >= 75 &&
                                  post.content.length <= 140
                                ? "100px"
                                : "0px"
                            }`,
                          }}
                        ></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill="rgb(83, 100, 113)"
                        className="bi bi-person-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                      </svg>
                      <div
                        className="responsive-comment-line-parent-div"
                        style={{
                          display: "flex",
                          border: "1px solid black",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className="responsive-comment-line "
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                            margin: "5px 0px 5px 0px",
                            width: "2px",

                            height: `${
                              post.content
                                ? post.content.length < 38
                                  ? "60px"
                                  : post.content.length >= 38 &&
                                    post.content.length < 75
                                  ? "80px"
                                  : post.content.length >= 75 &&
                                    post.content.length <= 140
                                  ? "100px"
                                  : "0px"
                                : null
                            }:`,
                          }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
                {/* profile image finish to check  */}
              </Col>
              <Col xs={10} sm={10} md={10} lg={10} xxl={10} style={{}}>
                {/* post owner full name + verified account svg + post owner user name + post created date and content start to check  */}

                <div>
                  {post.userId ? (
                    <>
                      <span
                        className="hover-fullname"
                        style={{
                          fontWeight: "700",
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                      >
                        {post.authorFullName}
                      </span>

                      <span>
                        {/* start to check  */}{" "}
                        <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                          <svg
                            width={`${1.25}em`}
                            height={`${1.25}em`}
                            viewBox="0 0 22 22"
                            aria-label="Verified account"
                            role="img"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                            data-testid="icon-verified"
                            color="rgba(29,155,240,1.00)"
                            fill="currentColor"
                          >
                            <g>
                              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                            </g>
                          </svg>
                        </span>{" "}
                      </span>

                      <span
                        style={{
                          color: "rgb(83, 100, 113)",
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
                        }}
                      >
                        @{post.authorUserName}
                      </span>

                      <span
                        style={{
                          color: "rgb(83, 100, 113)",
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
                        }}
                      >
                        {" "}
                        ·{" "}
                        <span className="date-post-detail">
                          {getCreatedDate(post.createdAt)}
                        </span>
                      </span>

                      {/* finish to check  */}
                    </>
                  ) : null}
                </div>

                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: "400",
                    lineHeight: "24px",
                    overflowWrap: "break-word",
                    maxWidth: "100%",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "400",
                      lineHeight: "20px",
                    }}
                  >
                    <span>{post.content}</span>
                    {post.image ? (
                      <>
                        {post.image.url.slice(0, 3) !== "ima" ? (
                          <div>{post.image.url}</div>
                        ) : null}
                      </>
                    ) : null}
                  </div>

                  {post.userId ? (
                    <>
                      {post.userId._id !== userInfo._id && post.isReposted ? (
                        <>
                          <div
                            style={{
                              marginTop: "10px",
                            }}
                          >
                            <span
                              style={{
                                color: "rgb(83, 100, 113)",
                                fontSize: "15px",
                                fontWeight: "400",
                                lineHeight: "20px",
                              }}
                            >
                              Replying to
                            </span>

                            <span
                              style={{
                                color: "rgb(29, 155, 240)",
                                fontSize: "15px",
                                fontWeight: "400",
                                lineHeight: "20px",
                                marginLeft: "3px",
                              }}
                            >
                              @{post.authorUserName}
                            </span>
                            <span
                              style={{
                                color: "rgb(29, 155, 240)",
                                fontSize: "15px",
                                fontWeight: "400",
                                lineHeight: "20px",
                                marginLeft: "3px",
                              }}
                            >
                              and
                            </span>
                            <span
                              style={{
                                color: "rgb(29, 155, 240)",
                                fontSize: "15px",
                                fontWeight: "400",
                                lineHeight: "20px",
                                marginLeft: "3px",
                              }}
                            >
                              @{post.reposted[0].username}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {post.userId._id !== userInfo._id ? (
                            <div
                              style={{
                                marginTop: "10px",
                              }}
                            >
                              <span
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                  lineHeight: "20px",
                                }}
                              >
                                Replying to
                              </span>

                              <span
                                style={{
                                  color: "rgb(29, 155, 240)",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                  lineHeight: "20px",
                                  marginLeft: "3px",
                                }}
                              >
                                @{post.authorUserName}
                              </span>
                            </div>
                          ) : null}
                        </>
                      )}
                    </>
                  ) : null}
                </div>

                {/* post owner full name + verified account svg + post owner user name + post created date and content  finish to check  */}
              </Col>
            </Row>
          </Container>

          <Container
            style={{
              marginTop: "0px",
            }}
          >
            <Row>
              <Col
                xs={2}
                sm={2}
                md={2}
                lg={2}
                xxl={2}
                style={{
                  textAlign: "center",
                }}
              >
                {/* profile image start to check */}
                <div>
                  {userInfo ? (
                    <>
                      {userInfo.imageUrl.slice(0, 3) !== "../" ? (
                        <img
                          width={40}
                          height={40}
                          src={userInfo.imageUrl}
                          alt=""
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          fill="rgb(83, 100, 113)"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
                      )}
                    </>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      fill="rgb(83, 100, 113)"
                      className="bi bi-person-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                  )}
                </div>
                {/* profile image finish to check  */}
              </Col>
              <Col xs={10} sm={10} md={10} lg={10} xxl={10} style={{}}>
                <textarea
                  onChange={handleChange}
                  rows="4"
                  cols="50"
                  value={content}
                  maxLength={maxCharacters}
                  className="input-post"
                  placeholder={
                    post.userId
                      ? userInfo._id === post.userId._id
                        ? "Add another post"
                        : "Post your reply"
                      : null
                  }
                  style={{
                    resize: "none",
                    color: "rgba(15,20,25,1.00)",
                    lineHeight: "24px",
                    fontWeight: "400",
                    fontSize: `${content ? "15px" : "20px"}`,

                    width: "100%",
                    height: "100px",
                  }}
                />
              </Col>
            </Row>
          </Container>

          <div className="d-flex align-items-center">
            <div className="p-2">
              {/* start to check */}

              {/* finish to check */}
            </div>
            <div className="p-2">
              {modalImage && (
                <div style={{ position: "relative" }}>
                  <div
                    className="target"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "rgba(71,73,74,255)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => handleMouseOver(e)}
                    onMouseOut={(e) => handleMouseOut(e)}
                    onClick={closeImage}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        color: "white",
                        fontSize: "22px",
                      }}
                    >
                      &times;
                    </div>
                  </div>
                  <img
                    className="img-fluid"
                    style={{
                      width: "100%",
                      display: "block",
                      overflow: "hidden",
                      border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
                      borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
                    }}
                    src={modalImage ? modalImage : ""}
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        {/* finish to check twitterdaki gibi post içeriği gelecek body içerisine  */}

        <Modal.Footer
          style={{ border: "none" }}
          className="post-modal-footer ml-1"
        >
          <Stack direction="horizontal" gap={0}>
            {/* INFO */}
            <div className="p-2">
              <div
                style={{
                  // border: "1px solid black",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
                className="svg-border-parent"
              >
                <svg
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document.getElementById("formuploadModal").click()
                  }
                  width={20}
                  height={20}
                  color="rgb(29,155,240)"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="bi bi-image-fill post-modal-image-fill r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                  </g>
                </svg>
              </div>

              <input
                onChange={handleImage}
                type="file"
                id="formuploadModal"
                name="modalImage"
                className="form-control"
                style={{ display: "none" }}
              />
            </div>
            {/* INFO */}
            <div className="p-2">
              <div
                className="svg-border-parent"
                style={{
                  // border: "1px solid black",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
              >
                <svg
                  onClick={() => toggleEmojis()}
                  color="rgb(29,155,240)"
                  fill="currentColor"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="post-modal-emoji-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <g>
                    <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className="p-2 ms-auto">
              {content !== "" || modalImage ? (
                <Button
                  variant="primary"
                  onClick={() => handleAddComment(post._id)}
                  className={`post-btn compose-tweet-textArea`}
                >
                  <span>
                    {post.userId._id === userInfo._id ? "Post" : "Reply"}
                  </span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className={`emptyContent post-btn compose-tweet-textArea`}
                >
                  {post.userId ? (
                    <span>
                      {post.userId._id === userInfo._id ? "Post" : "Reply"}
                    </span>
                  ) : null}
                </Button>
              )}
            </div>
          </Stack>
        </Modal.Footer>
        <div
          className={`${showEmojisBar}`}
          style={{
            position: "fixed",
            zIndex: 9999,
            marginTop: "190px",
            marginLeft: "55px",
          }}
        >
          <Picker
            onEmojiClick={onEmojiClick}
            emojiStyle="twitter"
            width={"320px"}
            height={"400px"}
          />
        </div>
      </Modal>
    </>
  );
}

export { SigninModal, LogoutModal, PostModal, CommentModal };
