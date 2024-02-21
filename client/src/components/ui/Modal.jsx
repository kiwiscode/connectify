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
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import Picker from "emoji-picker-react";
import axios from "axios";
import "../../index.css";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { message, Steps, theme } from "antd";
import { Divider, List } from "antd";

// socket io cleaning up socket.id after logout from online users client start to check
// import io from "socket.io-client";
// socket io cleaning up socket.id after logout from online users client finish to check

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

// const socket = io.connect(API_URL);

function SigninModal({ deactivatedScren }) {
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

  const [openDeactivateLoginModal, setOpenDeactivateLoginModal] =
    useState(false);
  const [userdeactivateddatenomutation, setuserdeactivateddatenomutation] =
    useState(null);
  const [userdeactivateddate, setUserDeactivatedDate] = useState(null);

  const [deadLinefordeleteuser, setdeadLinefordeleteuser] = useState(null);

  const [userdeletiondate, setUserdeletiondate] = useState(null);
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
          if (status === 400 && errorMessage === "Deactivated user !") {
            console.log("Deactivate user trying to login !");
            console.log("Error message =>", err);

            setOpenDeactivateLoginModal(true);
            setuserdeactivateddatenomutation(
              err.response.data.user.deactivatedDate
            );

            // 1 month later start to check

            const inputDate2 = new Date(err.response.data.user.deactivatedDate);

            const thirtyDaysLater = new Date(
              inputDate2.getTime() + 30 * 24 * 60 * 60 * 1000
            );

            const options2 = {
              year: "numeric",
              month: "short",
              day: "numeric",
            };

            const formattedDate2 = thirtyDaysLater.toLocaleDateString(
              "en-US",
              options2
            );
            console.log("Formatted 30 days later date =>", formattedDate2);

            // 1 month later finish to check

            const inputDate = new Date(err.response.data.user.deactivatedDate);

            const options = { year: "numeric", month: "short", day: "numeric" };

            const formattedDate = inputDate.toLocaleDateString(
              "en-US",
              options
            );
            console.log(formattedDate);
            setUserDeactivatedDate(formattedDate);
            setUserdeletiondate(formattedDate2);
          } else if (status === 400) {
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

  const handleDeactivatedUserReturnLogin = () => {
    console.log("User deactivated date =>", userdeactivateddate);

    console.log("User will delete from database on =>", userdeletiondate);
    console.log(
      "No mutation deactivated date =>",
      userdeactivateddatenomutation
    );
    console.log("Username =>", username);
    console.log("Password =>", password);

    axios
      .post(`${API_URL}/auth/deactivate-user-back`, {
        username,
        password,
      })
      .then((response) => {
        console.log("User =>", response);

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
      .catch((error) => {
        console.log("Error =>", error);
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
            {deactivatedScren ? (
              <>
                {/* <div
                  onClick={handleShow}
                  style={{
                    cursor: "pointer",
                    minWidth: "76px",
                    minHeight: "36px",
                    textAlign: "center",
                    border: "1px solid rgb(185, 202, 211)",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    borderRadius: "9999px",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "700",
                    padding: "5px",
                    backgroundColor: "rgba(29,155,240,1.00)",
                    color: "white",
                  }}
                >
                  Log in
                </div> */}
                <Button
                  className="deactivated-footer-login"
                  style={{
                    cursor: "pointer",
                    maxWidth: "76px",
                    maxHeight: "36px",
                    textAlign: "center",
                    border: "1px solid rgb(185, 202, 211)",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    borderRadius: "9999px",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "700",
                    padding: "5px",
                    backgroundColor: "rgba(29,155,240,1.00)",
                    color: "white",
                  }}
                  // variant="light"
                  onClick={handleShow}
                  // className="sign-in "
                >
                  Log in
                </Button>
              </>
            ) : (
              <>
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
                <Button
                  variant="light"
                  onClick={handleShow}
                  className="sign-in "
                >
                  Sign in
                </Button>
              </>
            )}
            {openDeactivateLoginModal ? (
              <>
                <Modal
                  dialogClassName="signin-modal-dialog"
                  contentClassName="modal-content"
                  className="signin-modal"
                  show={show}
                  onHide={handleClose}
                  size="lg"
                  centered={true}
                >
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        // width: "420px",
                      }}
                      className="sign-in-header mt-4 mb-4"
                    >
                      <div
                        style={{
                          textAlign: "left",
                        }}
                      >
                        Reactivate your account?
                      </div>
                      <div
                        style={{
                          marginTop: "5px",
                          color: "rgb(83, 100, 113)",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                          textAlign: "left",
                        }}
                      >{`You deactivated your account on ${userdeactivateddate}.On ${userdeletiondate}, it will no longer be possible for you to restore your Connectify account if it was accidentally or wrongfully deactivated. By clicking "Yes, reactivate", you will halt the deactivation process and reactivate your account.`}</div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer
                    style={{
                      border: "none",
                    }}
                  >
                    <Button
                      style={{
                        // width: "400px",
                        minHeight: "52px",
                        backgroundColor: "rgb(15, 20, 25)",
                      }}
                      className="login-button"
                      // variant="dark"
                      onClick={handleDeactivatedUserReturnLogin}
                    >
                      Yes, reactivate
                    </Button>
                    <Button
                      style={{
                        // width: "400px",
                        minHeight: "52px",
                        color: "black",
                      }}
                      className="login-button"
                      variant="light"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            ) : (
              <>
                <Modal
                  show={show}
                  onHide={handleClose}
                  size="lg"
                  centered={true}
                >
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
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

function LogoutModal() {
  const [messageApi, contextHolder] = message.useMessage();
  const successMessage = () => {
    messageApi.success({
      type: "success",
      content: "Your password has been successfully updated.",
      duration: 4,
      className: "custom-message-style",
    });
  };

  const wrongPasswordMessage = () => {
    messageApi.success({
      type: "success",
      content: "The password you entered was incorrect.",
      duration: 4,
      className: "custom-message-style",
    });
  };

  const [firstContent, setfirstContent] = useState(
    "This will deactivate your account"
  );
  const data = [
    "See your account information like your phone number and email address.",
    "Change your password at any time.",
    "Find out how you can deactivate your account",
  ];

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [errorInputStyle, seterrorInputStyle] = useState(false);
  const [errorInput, seterrorInput] = useState("");
  const [errorInputStyle2, seterrorInputStyle2] = useState(false);
  const [errorInput2, seterrorInput2] = useState("");
  const [errorInputStyle3, seterrorInputStyle3] = useState(false);
  const [errorInput3, seterrorInput3] = useState("");
  const [deactivatePassword, setdeactivatePassword] = useState("");

  const handleDeactivateUser = () => {
    console.log("User ready to deactivate his/her profile !");

    axios
      .post(
        `${API_URL}/profile/deactivate-account`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response =>", response);
        navigate("/settings/deactivated");
        logout();
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const [confirmed, setConfirmed] = useState(false);
  const checkConfirmPassword = () => {
    console.log("Check confirm password !");
    axios
      .post(
        `${API_URL}/profile/deactivate-password-confirmation`,
        {
          userId: userInfo._id,
          deactivatePassword,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response =>", response);
        const status = response.status;
        if (status === 200) {
          console.log("Password confirmation is correct !");
          setConfirmed(true);
        }
      })
      .catch((error) => {
        setConfirmed(false);
        console.log("Error =>", error);
      });
  };

  useEffect(() => {
    if (deactivatePassword) {
      checkConfirmPassword();
    }
  }, [deactivatePassword]);

  const steps = [
    {
      title: "First",
      content: (
        <List
          style={{
            border: "none",
            padding: "12px",
          }}
          size="small"
          bordered
        >
          <List.Item
            style={{
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
            }}
          >
            This will deactivate your account
          </List.Item>
          <List.Item
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgb(83, 100, 113)",
            }}
          >
            You’re about to start the process of deactivating your X account.
            Your display name, @username, and public profile will no longer be
            viewable on X.com, X for iOS, or X for Android.
          </List.Item>
          <List.Item
            style={{
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
            }}
          >
            What else you should know
          </List.Item>
          <List.Item
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgb(83, 100, 113)",
            }}
          >
            Some account information may still be available in search engines,
            such as Google or Bing. Learn more
          </List.Item>

          <List.Item
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgb(83, 100, 113)",
            }}
          >
            To use your current @username or email address with a different X
            account, change them before you deactivate this account.
          </List.Item>
        </List>
      ),
    },
    {
      title: "Second",
      content: (
        <div className="responsive-input-group input-group">
          {errorInputStyle3 ? (
            <>
              <div
                className="mt-0"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "rgba(244,39,49,255)",
                  fontSize: "13px",
                  lineHeight: "16px",
                  fontWeight: "400",
                }}
              >
                {errorInput3}
              </div>
            </>
          ) : null}

          <div
            className="mt-2"
            style={{
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
            }}
          >
            Confirm your password
          </div>
          <div
            className="mt-2"
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgb(83,100,113)",
            }}
          >
            Complete your deactivation request by entering the password
            associated with your account.
          </div>
          <InputGroup className="mt-3">
            <Form.Control
              style={{
                borderColor: errorInputStyle ? "rgba(244,39,49,255)" : "",
              }}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Password"
              type="password"
              value={deactivatePassword}
              onChange={(e) => {
                setdeactivatePassword(e.target.value);
              }}
            />
          </InputGroup>
        </div>
      ),
    },
    {
      title: "Last",
      content: (
        <List
          style={{
            border: "none",
            padding: "12px",
          }}
          size="small"
          bordered
        >
          <List.Item
            style={{
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
            }}
          >
            You Are Deactivating Your Account
          </List.Item>
          <List.Item
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgb(83, 100, 113)",
            }}
          >
            {
              "Deactivating your account means you won't be able to use it anymore, and your account information will be permanently deleted"
            }
          </List.Item>
          <List.Item
            style={{
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
            }}
          >
            When you deactivate your account:
          </List.Item>
          <List.Item
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgb(83, 100, 113)",
            }}
          >
            All your content on Connectify will be removed.
          </List.Item>

          <List.Item
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgb(83, 100, 113)",
            }}
          >
            {"Your friends and followers won't be able to contact you."}
          </List.Item>
          <List.Item
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgb(83, 100, 113)",
            }}
          >
            {"Your profile won't be visible to other Connectify users."}
          </List.Item>
        </List>
      ),
    },
  ];
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const [showDetailAccountInfo, setShowDetailAccountInfo] = useState(false);
  const [showDetailChangePasswordInfo, setShowDetailChangePasswordInfo] =
    useState(false);
  const [showDetailDeactivateAccountInfo, setShowDetailDeactivateAccountInfo] =
    useState(false);

  const [selectedSection, setSelectedSection] = useState(null);

  const [showListItem, setshowListItem] = useState(null);
  const showAccountInformationSection = () => {
    setshowListItem("hide");
    setShowDetailAccountInfo(true);
    setSelectedSection("Account information");
  };

  const showChangePasswordSection = () => {
    setshowListItem("hide");
    setShowDetailChangePasswordInfo(true);
    setSelectedSection("Change your password");
  };

  const showDeactivateAccountSection = () => {
    setshowListItem("hide");
    setShowDetailDeactivateAccountInfo(true);
    setSelectedSection("Deactivate your account");
  };

  const navigate = useNavigate();
  const localeInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [show, setShow] = useState(false);
  const { getToken, logout, userInfo } = useContext(UserContext);

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

  const [showlogoutPopup, setShowLogoutPopup] = useState(false);

  // const handleShow = (e) => {
  //   e.preventDefault();
  //   setShow(true);
  // };

  const handleShow = () => {
    console.log("BUTTON CLICKED");
    setShow(true);
  };
  useEffect(() => {
    const closeLogoutPopup = (e) => {
      if (
        e.target.classList.contains("profile-img") ||
        e.target.classList.contains("profile-svg") ||
        e.srcElement.parentNode.className === "logout-nav" ||
        e.srcElement.parentNode.className === "info-logout" ||
        e.target.classList.contains("info-logout") ||
        e.target.classList.contains("bi-three-dots") ||
        e.srcElement.parentNode.className === "nav-bar-home"
      ) {
        setShowLogoutPopup(false);
      } else {
        setShowLogoutPopup(true);
      }
    };

    document.body.addEventListener("click", closeLogoutPopup);

    return () => {
      document.body.removeEventListener("click", closeLogoutPopup);
    };
  }, []);

  // start to check

  const popoverTop = (
    <Popover
      id="popover-positioned-top"
      title="Popover top"
      className={`${showlogoutPopup ? "hideLogoutPopup" : ""}`}
    >
      <div
        style={{
          textAlign: "left",

          height: "auto",
          width: 250,
          display: "flex",
          flexDirection: "column",
          padding: "5px 0px 5px 0px",
        }}
        className="logout-body"
      >
        {/* settings icon start to check  */}
        <div
          onClick={handleShow}
          className="settings-and-privacy"
          style={{
            paddingBottom: "12px",
            paddingTop: "12px",
            lineHeight: "20px",
            fontWeight: "700",
            fontSize: "15px",
          }}
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
          >
            <g>
              <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
            </g>
          </svg>
          <span className="logout-p">Settings and privacy</span>
        </div>
        {/* settings icon finish to check  */}

        <p
          style={{
            paddingBottom: "12px",
            paddingTop: "12px",
            lineHeight: "20px",
            fontWeight: "700",
            fontSize: "15px",
          }}
          className="logout-p logout-popover"
          onClick={handleLogout}
        >
          Log out @{localeInfo.username}
        </p>
      </div>
    </Popover>
  );
  const [responsivePlacementLogoutPopup, setresponsivePlacementLogoutPopup] =
    useState("top");

  // finish to check

  const updatePlacementBasedOnScreenWidth = () => {
    const screenWidth = window.innerWidth;
    const newPlacement = screenWidth <= 466 ? "bottom" : "top";
    setresponsivePlacementLogoutPopup(newPlacement);
  };

  useEffect(() => {
    window.addEventListener("resize", updatePlacementBasedOnScreenWidth);

    return () => {
      window.removeEventListener("resize", updatePlacementBasedOnScreenWidth);
    };
  }, []);

  function formatDateTime(inputDate) {
    const dateObj = new Date(inputDate);

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const output = `${formattedDate}, ${formattedTime}`;

    return output;
  }

  const [tabIndex, setTabIndex] = useState(0);
  const [tabIndexSecond, setTabIndexSecond] = useState(1);
  const [tabIndexThird, setTabIndexThird] = useState(2);

  const showInitialTab = () => {
    console.log("Button clicked");
    setTabIndex(0);
    setShowDetailAccountInfo(false);
    setshowListItem(true);
  };

  const showSecondTab = () => {
    console.log("Button clicked");
    console.log("CURRENT INDEX =>", tabIndexSecond);
    setTabIndexSecond((prevState) => (prevState === 0 ? 0 : 1));
    setShowDetailChangePasswordInfo(false);
    setshowListItem(true);
  };

  const showThirdTab = () => {
    console.log("Button clicked");
    console.log("CURRENT INDEX =>", tabIndexSecond);
    setTabIndexThird((prevState) => (prevState === 0 ? 0 : 2));
    setShowDetailDeactivateAccountInfo(false);
    setshowListItem(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleChangePassword = () => {
    if (newPassword === oldPassword) {
      seterrorInputStyle2(true);
      seterrorInput2(
        "New password cannot be the same as your existing password.      "
      );
      seterrorInput("");
      seterrorInputStyle(false);

      seterrorInputStyle3(false);
      seterrorInput3("");
    } else if (newPassword === confirmNewPassword) {
      axios
        .post(
          `${API_URL}/profile/change-password`,
          {
            userId: userInfo._id,
            oldPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
        .then(() => {
          setOldPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          seterrorInputStyle(false);
          seterrorInputStyle2(false);
          seterrorInputStyle3(false);
          seterrorInput("");
          seterrorInput2("");
          seterrorInput3("");

          successMessage();
        })
        .catch(() => {
          seterrorInput3("The password you entered was incorrect.");
          seterrorInputStyle3(true);

          seterrorInput("");
          seterrorInputStyle(false);

          seterrorInputStyle2(false);
          seterrorInput2("");
        });
    } else {
      seterrorInput("Passwords do not match.");
      seterrorInputStyle(true);

      seterrorInputStyle2(false);
      seterrorInput2("");

      seterrorInputStyle3(false);
      seterrorInput3("");
    }
  };

  return (
    <>
      {contextHolder}
      {/* popover basic test start to check  */}
      <OverlayTrigger
        trigger="click"
        placement={`${responsivePlacementLogoutPopup}`}
        overlay={popoverTop}
      >
        {/* start to check  */}
        <div
          style={{
            marginLeft: "5px",
          }}
          className="logout-nav"
          // onClick={handleShow}
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
                width={40}
                height={40}
                fill="rgb(83, 100, 113)"
                className="profile-svg bi bi-person-circle"
                viewBox="0 0 16 16"
                style={{
                  borderRadius: "50%",
                }}
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
      </OverlayTrigger>
      {/* popover basic test finish to check  */}

      {/* settings and privacy modal start to check  */}
      <Modal
        show={show}
        onHide={handleClose}
        centered="true"
        contentClassName="settings-and-privacy-second"
      >
        <Modal.Header
          style={{
            border: "none",
          }}
        >
          {current > 0 ? (
            <div
              className="previous-button"
              style={{ borderRadius: "50%", cursor: "pointer" }}
            >
              <div>
                <svg
                  style={{
                    border: "none",
                    fontSize: "15px",
                    margin: "5px",
                  }}
                  onClick={() => prev()}
                  height={20}
                  width={20}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                  </g>
                </svg>
              </div>
            </div>
          ) : showDetailAccountInfo ? (
            <div
              className="previous-button"
              style={{ borderRadius: "50%", cursor: "pointer" }}
            >
              <div>
                <svg
                  style={{
                    border: "none",
                    fontSize: "15px",
                    margin: "5px",
                  }}
                  onClick={showInitialTab}
                  height={20}
                  width={20}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                  </g>
                </svg>
              </div>
            </div>
          ) : showDetailChangePasswordInfo ? (
            <div
              className="previous-button"
              style={{ borderRadius: "50%", cursor: "pointer" }}
            >
              <div>
                <svg
                  style={{
                    border: "none",
                    fontSize: "15px",
                    margin: "5px",
                  }}
                  onClick={showSecondTab}
                  height={20}
                  width={20}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                  </g>
                </svg>
              </div>
            </div>
          ) : showDetailDeactivateAccountInfo ? (
            <div
              className="previous-button"
              style={{ borderRadius: "50%", cursor: "pointer" }}
            >
              <div>
                <svg
                  style={{
                    border: "none",
                    fontSize: "15px",
                    margin: "5px",
                  }}
                  onClick={showThirdTab}
                  height={20}
                  width={20}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                  </g>
                </svg>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          {/* main navigation bar start to check  */}
          <Divider
            orientation="left"
            style={{ fontWeight: "700", fontSize: "20px", lineHeight: "24px" }}
          >
            <div>{selectedSection ? selectedSection : "Your Account"}</div>
          </Divider>
          <div
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgb(83, 100, 113)",
            }}
          >
            {selectedSection
              ? null
              : `See information about your account, download an archive of your
        data, or learn about your account deactivation options`}
          </div>

          {tabIndex === 0 ? (
            <List
              style={{
                width: "100%",
                borderStyle: "none",
                borderBottom: "none",
                borderTop: "none",
                height:
                  showDetailAccountInfo ||
                  showDetailChangePasswordInfo ||
                  showDetailDeactivateAccountInfo
                    ? "0px"
                    : "auto",
              }}
              size="large"
              bordered
              grid={2}
              itemLayout="horizontal"
            >
              {data.map((item, index) => (
                <List.Item key={index}>
                  {item && index === 0 ? (
                    <>
                      <div
                        onClick={showAccountInformationSection}
                        style={{
                          height: "100px",
                          padding: "12px",
                          cursor: "pointer",
                        }}
                        className={`${showListItem} account-info-div`}
                      >
                        <Stack direction="horizontal" gap={3}>
                          <div className="p-2">
                            <svg
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                              color="rgba(83,100,113,1.00)"
                              fill="currentColor"
                            >
                              <g>
                                <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                              </g>
                            </svg>
                          </div>
                          <div className="p-2">
                            {" "}
                            <div>
                              <div
                                style={{
                                  lineHeight: "20px",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                }}
                              >
                                Account information
                              </div>
                              <span
                                style={{
                                  fontSize: "13px",
                                  lineHeight: "16px",
                                  fontWeight: "400",
                                  color:
                                    "rgb(83, 100, 113)                      ",
                                }}
                              >
                                {item}
                              </span>
                            </div>
                          </div>
                          <div className="p-2 ms-auto">
                            {" "}
                            <svg
                              color="rgba(83,100,113,1.00)"
                              fill="currentColor"
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1q142lx r-f727ji"
                            >
                              <g>
                                <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                              </g>
                            </svg>
                          </div>
                        </Stack>
                      </div>
                    </>
                  ) : (
                    <>
                      {item && index === 1 ? (
                        <>
                          <div
                            onClick={showChangePasswordSection}
                            style={{
                              height: "100px",
                              padding: "12px",
                              cursor: "pointer",
                            }}
                            className={`${showListItem} change-password-div`}
                          >
                            <Stack direction="horizontal" gap={3}>
                              <div className="p-2">
                                <svg
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M13 9.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9.14 1.77l-5.83 5.84-4-1L6.41 22H2v-4.41l5.89-5.9-1-4 5.84-5.83 7.06 2.35 2.35 7.06zm-12.03 1.04L4 18.41V20h1.59l6.1-6.11 4 1 4.17-4.16-1.65-4.94-4.94-1.65-4.16 4.17 1 4z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div className="p-2">
                                {" "}
                                <div>
                                  <div
                                    style={{
                                      lineHeight: "20px",
                                      fontSize: "15px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Change your password
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      lineHeight: "16px",
                                      fontWeight: "400",
                                      color:
                                        "rgb(83, 100, 113)                      ",
                                    }}
                                  >
                                    {item}
                                  </span>
                                </div>
                              </div>
                              <div className="p-2 ms-auto">
                                <svg
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1q142lx r-f727ji"
                                >
                                  <g>
                                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                                  </g>
                                </svg>
                              </div>
                            </Stack>
                          </div>
                        </>
                      ) : (
                        <>
                          {item && index === 2 ? (
                            <>
                              <div
                                onClick={showDeactivateAccountSection}
                                style={{
                                  height: "100px",
                                  padding: "12px",
                                  cursor: "pointer",
                                }}
                                className={`${showListItem} deactivate-account-div`}
                              >
                                <Stack direction="horizontal" gap={3}>
                                  <div className="p-2">
                                    <svg
                                      color="rgba(83,100,113,1.00)"
                                      fill="currentColor"
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                    >
                                      <g>
                                        <path d="M21.398 6.52c-.887-1.79-2.647-2.91-4.601-3.01-1.65-.09-3.367.56-4.796 2.01-1.43-1.45-3.147-2.1-4.798-2.01-1.954.1-3.714 1.22-4.601 3.01-.896 1.81-.846 4.17.514 6.67 1.353 2.48 4.003 5.12 8.382 7.67l.504.3.503-.3c4.378-2.55 7.028-5.19 8.379-7.67 1.36-2.5 1.41-4.86.514-6.67zm-2.27 5.71c-1.074 1.97-3.256 4.27-7.126 6.61-3.872-2.34-6.055-4.64-7.129-6.61-1.112-2.04-1.031-3.7-.479-4.82.561-1.13 1.667-1.84 2.91-1.91 1.077-.05 2.338.38 3.452 1.61L8.588 10.3l4.009 2.5-1.428 2.15 1.665 1.1 2.569-3.85-3.991-2.5 1.405-2.06c1.21-1.63 2.662-2.2 3.88-2.14 1.242.07 2.347.78 2.908 1.91.553 1.12.634 2.78-.477 4.82z"></path>
                                      </g>
                                    </svg>
                                  </div>
                                  <div className="p-2">
                                    {" "}
                                    <div>
                                      <div
                                        style={{
                                          lineHeight: "20px",
                                          fontSize: "15px",
                                          fontWeight: "400",
                                        }}
                                      >
                                        Deactivate your account
                                      </div>
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          lineHeight: "16px",
                                          fontWeight: "400",
                                          color:
                                            "rgb(83, 100, 113)                      ",
                                        }}
                                      >
                                        {item}.
                                      </span>
                                    </div>
                                  </div>
                                  <div className="p-2  ms-auto">
                                    <svg
                                      color="rgba(83,100,113,1.00)"
                                      fill="currentColor"
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1q142lx r-f727ji"
                                    >
                                      <g>
                                        <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                                      </g>
                                    </svg>
                                  </div>
                                </Stack>
                              </div>
                            </>
                          ) : (
                            <>
                              Something went wrong, and the modal data cannot be
                              loaded.
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </List.Item>
              ))}
            </List>
          ) : (
            <>???</>
          )}
          {/* main navigation bar finish to check  */}

          {/* account information list start to check  */}
          {tabIndex === 0 ? (
            <>
              <div
                style={{
                  width: "100%",
                  border: "none",
                }}
              >
                <List.Item
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "12px",
                    // cursor: "pointer",
                    listStyle: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                  }}
                  className={showDetailAccountInfo ? "info-account" : "hide"}
                >
                  <Stack direction="horizontal" gap={3}>
                    <div className="p-2">
                      {" "}
                      <div>
                        <div
                          style={{
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          Username
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            color: "rgb(83, 100, 113)",
                          }}
                        >
                          @{userInfo.username}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 ms-auto">
                      {" "}
                      <svg
                        style={{
                          opacity: "0.5",
                        }}
                        color="rgba(83,100,113,1.00)"
                        fill="currentColor"
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1q142lx r-f727ji"
                      >
                        <g>
                          <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                        </g>
                      </svg>
                    </div>
                  </Stack>
                </List.Item>
                <List.Item
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "12px",
                    // cursor: "pointer",
                    listStyle: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                  }}
                  className={showDetailAccountInfo ? "info-account" : "hide"}
                >
                  <Stack direction="horizontal" gap={3}>
                    <div className="p-2">
                      {" "}
                      <div>
                        <div
                          style={{
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          Email
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            color: "rgb(83, 100, 113)",
                          }}
                        >
                          {userInfo.email}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 ms-auto">
                      {" "}
                      <svg
                        style={{
                          opacity: "0.5",
                        }}
                        color="rgba(83,100,113,1.00)"
                        fill="currentColor"
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1q142lx r-f727ji"
                      >
                        <g>
                          <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                        </g>
                      </svg>
                    </div>
                  </Stack>
                </List.Item>
                <List.Item
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "12px",
                    // cursor: "pointer",
                    listStyle: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                  }}
                  className={showDetailAccountInfo ? "info-account" : "hide"}
                >
                  <Stack direction="horizontal" gap={3}>
                    <div className="p-2">
                      {" "}
                      <div>
                        <div
                          style={{
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          Verified
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            color: "rgb(83, 100, 113)",
                          }}
                        >
                          {userInfo.verified
                            ? "Yes"
                            : `${(
                                <span
                                  style={{
                                    color: "rgb(83, 100, 113)",

                                    fontSize: "13px",
                                    cursor: "pointer",
                                    lineHeight: "16px",
                                  }}
                                >
                                  No.
                                </span>
                              )}${(
                                <span
                                  style={{
                                    color: "rgb(29, 155, 240)",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    lineHeight: "16px",
                                  }}
                                >
                                  Learn more
                                </span>
                              )}`}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 ms-auto">
                      {" "}
                      <svg
                        style={{
                          opacity: "0.5",
                        }}
                        color="rgba(83,100,113,1.00)"
                        fill="currentColor"
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1q142lx r-f727ji"
                      >
                        <g>
                          <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                        </g>
                      </svg>
                    </div>
                  </Stack>
                </List.Item>
                <List.Item
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "12px",
                    // cursor: "pointer",
                    listStyle: "none",
                  }}
                  className={showDetailAccountInfo ? "info-account" : "hide"}
                >
                  <Stack direction="horizontal" gap={3}>
                    <div className="p-2">
                      {" "}
                      <div>
                        <div
                          style={{
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          Account creation
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            color: "rgb(83, 100, 113)",
                          }}
                        >
                          {formatDateTime(userInfo.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 ms-auto">
                      {" "}
                      <svg
                        style={{
                          opacity: "0.5",
                        }}
                        color="rgba(83,100,113,1.00)"
                        fill="currentColor"
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1q142lx r-f727ji"
                      >
                        <g>
                          <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                        </g>
                      </svg>
                    </div>
                  </Stack>
                </List.Item>
              </div>
            </>
          ) : null}
          {/* account information list finish to check  */}

          {/* change password inputs start to check  */}
          {tabIndexSecond === 1 ? (
            <>
              <div className={showDetailChangePasswordInfo ? "" : "hide"}>
                <div className="responsive-input-group input-group">
                  <InputGroup className="mb-2">
                    <Form.Control
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      placeholder="Current password"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </InputGroup>
                  {errorInputStyle3 ? (
                    <>
                      <div
                        className="mt-0"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "rgba(244,39,49,255)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        {errorInput3}
                      </div>
                    </>
                  ) : null}
                  <InputGroup className="mt-2">
                    <Form.Control
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      placeholder="New password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </InputGroup>
                  {errorInputStyle2 ? (
                    <>
                      <div
                        className="mt-2"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "rgba(244,39,49,255)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        {errorInput2}
                      </div>
                    </>
                  ) : null}
                  <InputGroup className="mt-3">
                    <Form.Control
                      style={{
                        borderColor: errorInputStyle
                          ? "rgba(244,39,49,255)"
                          : "",
                      }}
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      placeholder="Confirm password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </InputGroup>
                  {errorInputStyle ? (
                    <>
                      <div
                        className="mt-2"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "rgba(244,39,49,255)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        {errorInput}
                      </div>
                    </>
                  ) : null}
                  <div>
                    <Button
                      style={{
                        opacity:
                          oldPassword && newPassword && confirmNewPassword
                            ? ""
                            : "0.5",
                      }}
                      onClick={() => handleChangePassword()}
                      className="change-password-btn"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {/* change password inputs finish to check  */}

          {/* deactivate user steps from navigation bar redirection start to check  */}
          {tabIndexThird === 2 ? (
            <div
              style={{
                width: "100%",
              }}
              className={`settings-privacy-navigation deactivate-account ${
                showDetailDeactivateAccountInfo ? "" : "hide"
              } `}
            >
              <Steps
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
                className="steps"
                current={current}
                items={items}
              />
              <div>{steps[current].content}</div>

              <div>
                {current < steps.length - 1 && current !== 1 && (
                  <Button
                    style={{
                      backgroundColor: "#0f141a",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "500",
                      lineHeight: "20px",
                      float: "right",
                      border: " none",
                    }}
                    className="deactivate-next-btn"
                    variant="info"
                    onClick={() => next()}
                  >
                    Next
                  </Button>
                )}

                {current < steps.length - 1 && current === 1 && (
                  <Button
                    style={{
                      marginTop: "100px",
                      backgroundColor: "#0f141a",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "500",
                      lineHeight: "20px",
                      float: "right",
                      border: " none",
                    }}
                    className="deactivate-next-btn"
                    variant="info"
                    onClick={() =>
                      confirmed ? next() : wrongPasswordMessage()
                    }
                  >
                    Next
                  </Button>
                )}

                {current === steps.length - 1 && (
                  <Button
                    style={{
                      marginTop: "100px",
                      backgroundColor: "rgb(244, 33, 46)",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "500",
                      lineHeight: "20px",
                      float: "right",
                      border: " none",
                    }}
                    variant="danger"
                    onClick={() => {
                      handleDeactivateUser();
                    }}
                  >
                    Deactivate
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </Modal.Body>

        {/* deactivate user steps from navigation bar redirection finish to check  */}
      </Modal>

      {/* settings and privacy modal finish to check  */}
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

  const onEmojiClick = (emojiObject) => {
    const sym = emojiObject.unified.split("_");
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);

    setChosenEmoji(emoji);
    setContent((prevText) => prevText + emoji);
    console.log("Choosed emoji =>", chosenEmoji);
    console.log("Content =>", content);
  };

  useEffect(() => {
    const closeEmojiContainer = (e) => {
      if (
        e.target.classList.contains("post-modal-emoji-picker") ||
        e.srcElement.parentElement.className ===
          "svg-border-parent show-emoji" ||
        e.srcElement.parentNode.className === "p-2" ||
        e.target.classList.value === ""
      ) {
        setshowEmojisBar(false);
      } else {
        setshowEmojisBar(true);
      }
    };

    document.body.addEventListener("click", closeEmojiContainer);

    return () => {
      document.body.removeEventListener("click", closeEmojiContainer);
    };
  }, []);

  const popoverBottom = (
    <Popover
      className={`${showEmojisBar ? "hideEmojiContainer" : ""}`}
      id="popover-positioned-bottom"
      title="Popover bottom"
    >
      <Picker
        style={{ padding: "12px" }}
        data={data}
        onEmojiSelect={onEmojiClick}
        maxFrequentRows={0}
        emojiSize={20}
        emojiButtonSize={28}
      />
    </Popover>
  );

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
            <div
              className="p-2 image-choose-p-2"
              onClick={() => document.getElementById("formuploadModal").click()}
            >
              <div
                style={{
                  // border: "1px solid black",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
                className="svg-border-parent svg-border-parent-image-choose"
              >
                <svg
                  style={{
                    cursor: "pointer",
                  }}
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
              {/* emoji mart start to check */}

              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={popoverBottom}
              >
                <div
                  className="svg-border-parent"
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                >
                  <svg
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
              </OverlayTrigger>

              {/* emoji mart finish to check */}
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
      </Modal>
    </>
  );
}

function CommentModal({
  post,
  width,
  height,
  refreshPosts,
  isImagePostDetail,
}) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [modalImage, setModalImage] = useState("");
  const [error, setError] = useState("");

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");
  const [showSecondModal, setShowSecondModal] = useState(false);

  const { userInfo, socket } = useContext(UserContext);
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

  // socket io 5 client start to check
  const handleNotification = (post, userInfo, type) => {
    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: post.userId.username,
      type: type,
      contactHasBeenMade: post,
      senderInfo: userInfo,
    });
  };
  // socket io 5 client finish to check

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
        handleNotification(post, userInfo, "comment");

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

  const onEmojiClick = (emojiObject) => {
    const sym = emojiObject.unified.split("_");
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);

    setChosenEmoji(emoji);
    setContent((prevText) => prevText + emoji);
    console.log("Choosed emoji =>", chosenEmoji);
    console.log("Content =>", content);
  };

  const popoverBottom = (
    <Popover id="popover-positioned-bottom" title="Popover bottom">
      <Picker
        style={{ padding: "12px" }}
        data={data}
        onEmojiSelect={onEmojiClick}
        maxFrequentRows={0}
        emojiSize={20}
        emojiButtonSize={28}
      />
    </Popover>
  );

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
          fill={isImagePostDetail ? "white" : "rgb(83, 100, 113)"}
        >
          <g>
            <path
              stroke={isImagePostDetail ? "white" : "rgb(83, 100, 113)"}
              strokeWidth="0.1"
              d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
            ></path>
          </g>
        </svg>
        <span
          className="post-description"
          style={{ color: isImagePostDetail ? "white" : "rgb(83, 100, 113)" }}
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
            <div
              className="p-2"
              onClick={() => document.getElementById("formuploadModal").click()}
            >
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
            {/* <div className="p-2">
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
            </div> */}
            <div className="p-2">
              {/* emoji mart start to check */}

              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={popoverBottom}
              >
                <div
                  className="svg-border-parent"
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                >
                  <svg
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
              </OverlayTrigger>

              {/* emoji mart finish to check */}
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
