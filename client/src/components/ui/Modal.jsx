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
  Stack,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Picker from "emoji-picker-react";
import axios from "axios";
import "../../index.css";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function SigninModal() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser, userInfo } = useContext(UserContext);
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

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("token", token);
        updateUser(user);
        setError("");
        navigate("/home");
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
          marginTop: "40px",
        }}
      >
        <Row
          style={{
            justifyContent: "end",
            marginLeft: "80px",
          }}
        >
          <Col md={6}>
            <p className="have-account">Already have an account ?</p>
            <Button variant="light" onClick={handleShow} className="sign-in ">
              Sign in
            </Button>
            <Modal show={show} onHide={handleClose} size="lg" centered={true}>
              <Modal.Header
                closeButton={false} // closeButton'u devre dışı bırak
                style={{
                  border: "none",
                }}
              >
                <button
                  type="button"
                  className="close-button"
                  aria-label="Close"
                  style={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "50%",
                    lineHeight: "20px",
                    fontSize: "20px",
                    paddingBottom: "3px",
                  }}
                  onClick={handleClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
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

      <div className="logout-nav" onClick={handleShow}>
        {/* start to check */}
        {userInfo.imageUrl.slice(0, 3) !== "../" ? (
          <img
            src={userInfo.imageUrl}
            width={40}
            height={40}
            alt=""
            style={{ borderRadius: "50%" }}
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
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="35"
          fill="currentColor"
          className="bi bi-three-dots none-backgroundColor logout-three-dots"
          viewBox="0 0 20 20"
        >
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
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
function PostModal({ refreshPosts, setLoadingTrue, setLoadingFalse }) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { getToken, userInfo } = useContext(UserContext);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");
  const [showSecondModal, setShowSecondModal] = useState(false);
  const maxCharacters = 140;

  console.log("POST MODAL IS WORKING => 1");
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
      <Button variant="primary" onClick={handleShow} className="compose-tweet ">
        <span className="compose-tweet-text">Post</span>
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="compose-tweet-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp"
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
          closeButton={false} // closeButton'u devre dışı bırak
          style={{
            border: "none",
          }}
        >
          <button
            type="button"
            className="close-button"
            aria-label="Close"
            style={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "50%",
              lineHeight: "20px",
              fontSize: "20px",
              paddingBottom: "3px",
            }}
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Stack direction="horizontal" gap={3}>
            <div className="p-2">
              {" "}
              {userInfo.imageUrl.slice(0, 3) !== "../" ? (
                <img
                  src={userInfo.imageUrl}
                  width={35}
                  height={35}
                  alt=""
                  style={{ position: "relative", bottom: "57px" }}
                />
              ) : (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    fill="rgb(83, 100, 113)"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                    style={{ position: "relative", bottom: "57px" }}
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-2">
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
                  fontSize: "20px",
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

        <Modal.Footer className="post-modal-footer ml-1  ">
          <Stack direction="horizontal" gap={0}>
            {/* INFO */}
            <div className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-image-fill"
                viewBox="0 0 16 16"
                style={{
                  cursor: "pointer",
                  color: "rgb(29, 155, 240)",
                }}
                onClick={() =>
                  document.getElementById("formuploadModal").click()
                }
              >
                <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
              </svg>

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-emoji-smile"
                viewBox="0 0 16 16"
                style={{
                  cursor: "pointer",
                  color: "rgb(29, 155, 240)",
                }}
                onClick={() => toggleEmojis()}
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
              </svg>
            </div>
            <div className="p-2 ms-auto">
              {" "}
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

function CommentModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <svg
        onClick={handleShow}
        width={18}
        height={18}
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton={false} // closeButton'u devre dışı bırak
          style={{
            border: "none",
          }}
        >
          <button
            type="button"
            className="close-button"
            aria-label="Close"
            style={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "50%",
              lineHeight: "20px",
              fontSize: "20px",
              paddingBottom: "3px",
            }}
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export { SigninModal, LogoutModal, PostModal, CommentModal };
