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
{
}
import "bootstrap/dist/css/bootstrap.min.css";
// import Picker from "emoji-picker-react";
import axios from "axios";
import "../../index.css";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { Divider, message } from "antd";
import LoadingSpinner from "./LoadingSpinner";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Box,
} from "@mui/material";

// socket io cleaning up socket.id after logout from online users client start to check
// import io from "socket.io-client";
// socket io cleaning up socket.id after logout from online users client finish to check

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

// const socket = io.connect(API_URL);

function SigninModal({ deactivatedScreen }) {
  const googleAuth = () => {
    window.open(`${API_URL}/auth/google/callback`, "_self");
  };
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const catchErrorMessage = (message) => {
    messageApi.success({
      type: "success",
      content: message,
      duration: 4,
      className: "custom-message-style",
    });
  };

  const handleClose = () => {
    setTabIndex(0);
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  // option 1 enter a new password start to check
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
  // option 1 enter a new password finish to check
  // option 2 confirm your password start to check
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPasswordForConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownPasswordForConfirmPassword = (e) => {
    e.preventDefault();
  };
  // option 2 confirm your password finish to check

  const [openDeactivateLoginModal, setOpenDeactivateLoginModal] =
    useState(false);

  const handleShowReactivatedLoginScreen = () => {
    setOpenDeactivateLoginModal(true);
  };

  const handleCloseReactivatedLoginScreen = () => {
    setOpenDeactivateLoginModal(false);
  };

  const [userdeactivateddatenomutation, setuserdeactivateddatenomutation] =
    useState(null);
  const [userdeactivateddate, setUserDeactivatedDate] = useState(null);

  const [deadLinefordeleteuser, setdeadLinefordeleteuser] = useState(null);

  const [userdeletiondate, setUserdeletiondate] = useState(null);

  const { height, width } = useWindowDimensions();

  const [loginInput, setLoginInput] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleLoginVariantOneStartProcess = () => {
    axios
      .post(`${API_URL}/auth/login-variant-one`, {
        authentication: loginInput,
        password,
      })
      .then((response) => {
        console.log("Response =>", response);
        if (response.status === 201) {
          setTabLoading(true);
          setTimeout(() => {
            setTabIndex(8);
            setShow(true);
            setTabLoading(false);
          }, 300);
        }
      })
      .catch((err) => {
        console.log("Error is running right now !", err);
        if (err) {
          if (err.response.status === 400) {
            catchErrorMessage("Sorry, we could not find your account.");
          }
        }
      });
  };

  const handleLoginVariantOneStep2 = () => {
    axios
      .post(`${API_URL}/auth/login-variant-one-result`, {
        authentication: loginInput,
      })
      .then((response) => {
        console.log("Response =>", response);
        const { token, user } = response.data;
        if (response.status === 201) {
          setTabLoading(true);
          localStorage.setItem("userInfo", JSON.stringify(user));
          localStorage.setItem("token", token);
          updateUser(user);
          console.log("Response after log in =>", response);
          setTimeout(() => {
            navigate("/home");
            setTabLoading(false);
          }, 300);
        }
      })
      .catch((error) => {
        console.log("Error =>", error);
        if (error.response.status === 501) {
          catchErrorMessage("Wrong password!");
        } else if (error.response.status === 400) {
          setTabLoading(true);
          setTimeout(() => {
            setTabLoading(false);
            setOpenDeactivateLoginModal(true);
          }, 300);
          handleShowReactivatedLoginScreen();
          setuserdeactivateddatenomutation(
            error.response.data.user.deactivatedDate
          );
          console.log("Open deactivated modal 2 =>", openDeactivateLoginModal);

          // 1 month later start to check

          const inputDate2 = new Date(error.response.data.user.deactivatedDate);

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

          // 1 month later finish to check

          const inputDate = new Date(error.response.data.user.deactivatedDate);

          const options = { year: "numeric", month: "short", day: "numeric" };

          const formattedDate = inputDate.toLocaleDateString("en-US", options);
          setUserDeactivatedDate(formattedDate);
          setUserdeletiondate(formattedDate2);
        }
      });
  };

  const handleDeactivatedUserReturnLogin = () => {
    console.log("Button clicked ");
    axios
      .post(`${API_URL}/auth/deactivate-user-back`, {
        authentication: loginInput,
      })
      .then((response) => {
        handleCloseReactivatedLoginScreen();
        const { token, user } = response.data;

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("token", token);
        updateUser(user);
        setError("");

        setIsLoading(true);
        setTimeout(() => {
          navigate("/home");
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [startForgotPasswordProcess, setStartForgotPasswordProcess] =
    useState(false);

  const [verificationCodeInput, setVerificationCodeInput] = useState("");

  const [checkedValue, setCheckedValue] = useState(false);

  const handleCloseLoginModal = () => {
    setTabIndex(0);
    setShowLoginModal(false);
    setLoginInput({
      usernameOrEmail: "",
      password: "",
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleShowLoginModal = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTabIndex(0);
      setIsLoading(false);
      setShowLoginModal(true);
    }, 500);
  };

  const { getToken } = useContext(UserContext);
  const [findConnectifyAccount, setFindConnectifyAccount] = useState("");

  const [forgotPasswordInProcessUser, setForgotPasswordInProcessUser] =
    useState([]);

  const getMaskedEmail = (str) => {
    const atIndex = str.indexOf("@");
    const userName = str.slice(0, atIndex);
    const domainIndex = str.indexOf(".");
    const domain = str.slice(atIndex + 1, domainIndex);

    const maskedUsername = userName.slice(0, 2) + "*".repeat(10);
    const maskedDomain = domain.charAt(0) + "*".repeat(4);
    const maskedDot = "*".repeat(3);

    return maskedUsername + "@" + maskedDomain + maskedDot;
  };

  const [tabLoading, setTabLoading] = useState(false);
  const handleFindConnectifyAccount = () => {
    axios
      .post(`${API_URL}/check-find-account`, { findConnectifyAccount })
      .then((response) => {
        console.log("Response from server =>", response);
        if (
          response.status === 201 &&
          response.data.message === "The user entered an email address."
        ) {
          console.log("User entered an email, show confirm username tab.");
          setTabLoading(true);
          setForgotPasswordInProcessUser(response.data.user);
          setTimeout(() => {
            setTabLoading(false);
            setTabIndex(tabIndex + 1);
          }, 500);
        } else if (
          response.status === 201 &&
          response.data.message === "The user entered an username."
        ) {
          console.log(
            "User entered an username, show send email verification code direct."
          );
          setTabLoading(true);
          setForgotPasswordInProcessUser(response.data.user);
          setTimeout(() => {
            setTabLoading(false);
            setTabIndex(tabIndex + 2);
          }, 500);
        }
      })
      .catch((error) => {
        console.log("Error =>", error);
        catchErrorMessage("Sorry, we could not find your account.");
      });
  };

  const [
    receivedVerificationCodeForPasswordChange,
    setReceivedVerificationCodeForPasswordChange,
  ] = useState();

  const [
    isWaitingForConfirmationCodeSendingProcess,
    setIsWaitingForConfirmationCodeSendingProcess,
  ] = useState(false);
  const handleSendForgotPasswordCodeToEmail = () => {
    axios
      .post(
        `${API_URL}/send-forgot-password-code-to-email
  `,
        { forgotPasswordInProcessUser }
      )
      .then((response) => {
        setReceivedVerificationCodeForPasswordChange(
          response.data.result.verificationCode.toString()
        );

        setIsWaitingForConfirmationCodeSendingProcess(true);
        setTabLoading(true);
        setTimeout(() => {
          setIsWaitingForConfirmationCodeSendingProcess(false);
          setTabLoading(false);
          setTabIndex(tabIndex + 1);
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  // if (!regex.test(password) || password.length < 8) {
  //   res.status(402).json({
  //     errorMessage:
  //       "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
  //   });
  //   return;
  // }

  const [newPassword, setNewPasswordForgotPasswordProcess] = useState("");

  const [confirmPassword, setNewPasswordForgotPasswordProcessConfirm] =
    useState("");

  const [errorMessageForFirstInput, seterrorMessageForFirstInput] =
    useState("");
  const [errorMessageForSecondInput, seterrorMessageForSecondInput] =
    useState("");

  const [firstInputActive, setfirstInputActive] = useState(false);
  const [secondInputActive, setsecondInputActive] = useState(false);

  const handleNewPasswordChange = (e) => {
    setNewPasswordForgotPasswordProcess(e.target.value);
    setfirstInputActive(true);
  };

  const handleConfirmPasswordChange = (e) => {
    setNewPasswordForgotPasswordProcessConfirm(e.target.value);
    setsecondInputActive(true);
  };

  useEffect(() => {
    console.log("First input active mode =>", firstInputActive);
    console.log("Second input active mode =>", secondInputActive);
    if (!regex.test(newPassword) && newPassword.length) {
      seterrorMessageForFirstInput(
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter."
      );
    } else {
      seterrorMessageForFirstInput("");
    }
    if (!regex.test(confirmPassword) && confirmPassword.length) {
      seterrorMessageForSecondInput(
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter."
      );
    } else {
      seterrorMessageForSecondInput("");
    }

    if (firstInputActive) {
      if (newPassword !== confirmPassword) {
        seterrorMessageForSecondInput("Passwords do not match.");
      } else {
        seterrorMessageForSecondInput("");
        seterrorMessageForFirstInput("");
      }
    }
    if (secondInputActive) {
      if (confirmPassword !== newPassword) {
        seterrorMessageForFirstInput("Passwords do not match.");
      } else {
        seterrorMessageForSecondInput("");
        seterrorMessageForFirstInput("");
      }
    }
  }, [newPassword, confirmPassword]);
  console.log("New password outside of on change function =>", newPassword);

  console.log("Confirm password outside of on change function =>", newPassword);

  const handleTabChange = () => {
    setTabLoading(true);
    setTimeout(() => {
      setVerificationCodeInput("");
      setTabLoading(false);
      setTabIndex(tabIndex + 1);
    }, 500);
  };

  const handleChangePassword = () => {
    console.log("Tab loading after change password click =>", tabLoading);
    console.log("Tab index after click =>", tabIndex);

    axios
      .post(
        `${API_URL}/change-password-forgot-password-process`,
        {
          newPassword,
          user: forgotPasswordInProcessUser,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          setTabLoading(true);
          setTimeout(() => {
            setTabLoading(false);
            setTabIndex(tabIndex + 1);
          }, 700);
        }
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const [forgotMyPasswordChecked, setForgotMyPasswordChecked] = useState(false);

  const [suspiciousActivity, setSuspiciousActivityChecked] = useState(false);

  const [differentReason, setDifferentReason] = useState(false);

  const handleLoginAfterForgotPasswordProcess = () => {
    console.log("Trying to log in !");

    axios
      .post(`${API_URL}/login-after-forgot-password-process`, {
        newPassword,
        user: forgotPasswordInProcessUser,
      })
      .then((response) => {
        const { token, user } = response.data;

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("token", token);

        updateUser(user);

        console.log("Response =>", response);

        setTabLoading(true);
        setTimeout(() => {
          navigate("/home");
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const [confirmUsername, setConfirmUsername] = useState("");

  const checkUsername = () => {
    axios
      .post(
        `${API_URL}/check-username`,
        { findConnectifyAccount, confirmUsername },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        const resStatu = response.status;
        if (resStatu === 201) {
          setTabLoading(true);
          setTimeout(() => {
            setTabIndex(tabIndex + 1);
            setTabLoading(false);
          }, 300);
        }
      })
      .catch((error) => {
        const errorStatu = error.response.status;
        if (errorStatu === 501) {
          catchErrorMessage("Incorrect. Please try again.");
        }
      });
  };

  return (
    <>
      {contextHolder}
      {deactivatedScreen ? (
        <>
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
            onClick={handleShowLoginModal}
          >
            Log in
          </Button>
        </>
      ) : (
        <div
          style={{
            margin: "50px 0px",
          }}
        >
          <div>
            <p className="have-account">
              <span
                className="  responsive-input-group-text
                "
              >
                Already have an account ?
              </span>
            </p>
            <Button
              variant="light"
              onClick={handleShowLoginModal}
              className="sign-in"
            >
              Sign in
            </Button>
          </div>
        </div>
      )}
      {openDeactivateLoginModal && !isLoading ? (
        <>
          {width <= 700 ? (
            <>
              <Modal
                style={{
                  height: "100%",
                }}
                dialogClassName={"modal-fullscreen"}
                centered={true}
                show={openDeactivateLoginModal}
                onHide={handleCloseReactivatedLoginScreen}
              >
                <Modal.Header
                  className="signin-modal-header-child-non-reactivate"
                  style={{
                    border: "none",
                  }}
                >
                  <div
                    onClick={handleCloseReactivatedLoginScreen}
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
                        onClick={handleCloseReactivatedLoginScreen}
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

                <>
                  {" "}
                  <Modal.Body className="signin-modal-body-child-non-reactivate mt-5">
                    <div
                      style={{
                        width: "81.5%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "26px",
                          fontWeight: "700",
                          lineHeight: "32px",
                          letterSpacing: "0.5px",
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
                        }}
                      >{`You deactivated your account on ${userdeactivateddate}.On ${userdeletiondate} it will no longer be possible for you to restore your Connectify account if it was accidentally or wrongfully deactivated. By clicking "Yes, reactivate", you will halt the deactivation process and reactivate your account.`}</div>
                    </div>

                    <Button
                      style={{
                        width: "81.5%",
                        minHeight: "52px",
                      }}
                      className="login-button mt-4"
                      onClick={handleDeactivatedUserReturnLogin}
                    >
                      Yes, reactivate
                    </Button>
                    <Button
                      className="cancel-btn-reactivate-tab mt-3"
                      style={{
                        width: "81.5%",
                        height: "52px",
                        color: "black",
                      }}
                      variant="light"
                      onClick={handleCloseReactivatedLoginScreen}
                    >
                      Cancel
                    </Button>
                  </Modal.Body>
                </>
              </Modal>
            </>
          ) : (
            <>
              <Modal
                dialogClassName="signin-modal-dialog"
                contentClassName="modal-content"
                className="signin-modal"
                show={openDeactivateLoginModal}
                onHide={handleCloseReactivatedLoginScreen}
              >
                <Modal.Header
                  style={{
                    border: "none",
                  }}
                >
                  <div
                    onClick={handleCloseReactivatedLoginScreen}
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
                        onClick={handleCloseReactivatedLoginScreen}
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

                <>
                  {" "}
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
                </>

                <Modal.Footer
                  style={{
                    border: "none",
                  }}
                >
                  <Button
                    style={{
                      // width: "400px",
                      minHeight: "52px",
                    }}
                    className="login-button"
                    // variant="dark"
                    onClick={handleDeactivatedUserReturnLogin}
                  >
                    Yes, reactivate
                  </Button>
                  <Button
                    className="cancel-btn-reactivate-tab"
                    style={{
                      // width: "400px",
                      minHeight: "52px",
                      color: "black",
                    }}
                    // className="login-button"
                    variant="light"
                    onClick={handleCloseReactivatedLoginScreen}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </>
      ) : (
        <>
          {showLoginModal && !isLoading ? (
            <>
              {width <= 700 ? (
                <>
                  <Modal
                    style={{
                      height: "100%",
                    }}
                    dialogClassName={"modal-fullscreen"}
                    centered={true}
                    show={showLoginModal}
                    onHide={handleCloseLoginModal}
                  >
                    <Modal.Header
                      className="signin-modal-header-child-non-reactivate"
                      style={{
                        border: "none",
                      }}
                    >
                      <div
                        onClick={handleCloseLoginModal}
                        className="close-button"
                        style={{
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          {/* close signin modal icon start to check  */}
                          <svg
                            style={{
                              border: "none",
                              fontSize: "15px",
                              margin: "5px",
                            }}
                            onClick={handleCloseLoginModal}
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
                          {/* close signin modal icon finish to check  */}
                        </div>
                      </div>
                    </Modal.Header>
                    {tabIndex === 0 ? (
                      <>
                        {tabLoading ? (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <Modal.Body
                            className="signin-modal-body-child-non-reactivate"
                            style={
                              {
                                // overflowY: "scroll",
                              }
                            }
                          >
                            <span
                              style={{
                                fontSize: "26px",
                                fontWeight: "700",
                                lineHeight: "32px",
                                letterSpacing: "0.5px",
                              }}
                              className="sign-in-header mt-4 mb-4"
                            >
                              Sign in to Connectify
                            </span>

                            <div>
                              <Button
                                onClick={googleAuth}
                                style={{
                                  backgroundColor: "transparent",
                                  borderWidth: "1px",
                                  minWidth: "300px",
                                  minHeight: "40px",
                                  borderRadius: "9999px",
                                  borderColor: "rgba(0,0,0,0.1)",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                                variant="light"
                                className="google-variant-sign-in"
                              >
                                <span
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "400",
                                    lineHeight: "16px",
                                    marginLeft: "10px",
                                    color: "black",
                                  }}
                                >
                                  Sign in with Google
                                </span>
                                <svg
                                  width={16}
                                  height={16}
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 48 48"
                                  className="LgbsSe-Bz112c"
                                >
                                  <g>
                                    <path
                                      fill="#EA4335"
                                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                    ></path>
                                    <path
                                      fill="#4285F4"
                                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                    ></path>
                                    <path
                                      fill="#FBBC05"
                                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                    ></path>
                                    <path
                                      fill="#34A853"
                                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                    ></path>
                                    <path fill="none" d="M0 0h48v48H0z"></path>
                                  </g>
                                </svg>
                              </Button>
                            </div>
                            <Divider
                              style={{
                                width: "300px",
                                minWidth: "300px",
                                margin: "5px",
                              }}
                              plain
                            >
                              or
                            </Divider>
                            <TextField
                              autoFocus
                              className="mt-2"
                              id="outlined-basic"
                              label="Email, or username"
                              variant="outlined"
                              value={loginInput.usernameOrEmail}
                              type="text"
                              onChange={(e) =>
                                setLoginInput((prevInfo) => ({
                                  ...prevInfo,
                                  usernameOrEmail: e.target.value,
                                }))
                              }
                              style={{
                                width: "300px",
                                height: "58px",
                              }}
                              sx={{
                                "& .Mui-focused input + fieldset": {
                                  border: "2px solid #1d9bf0 !important",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#cfd9de !important",
                                },
                                "& .MuiInputLabel-shrink": {
                                  color: "#1f9cf0 !important",
                                },
                              }}
                            />

                            {error}
                            <Button
                              style={{
                                width: "300px",
                                minHeight: "36px",
                                color: "white",
                                fontSize: "15px",
                                fontWeight: "700",
                                lineHeight: "20px",
                              }}
                              className="login-button mt-4 next-btn"
                              variant="dark"
                              onClick={handleLoginVariantOneStartProcess}
                            >
                              Next
                            </Button>
                            <Button
                              style={{
                                width: "300px",
                                height: "36px",
                                color: "black",
                                fontSize: "15px",
                                fontWeight: "700",
                                lineHeight: "20px",
                              }}
                              className="mt-4 forgot-password-btn"
                              variant="light"
                              onClick={() => {
                                setTabLoading(true);
                                setTimeout(() => {
                                  setStartForgotPasswordProcess(true);
                                  setTabIndex(tabIndex + 1);
                                  setShow(true);
                                  setTabLoading(false);
                                }, 300);
                              }}
                            >
                              Forgot password?
                            </Button>
                            <div
                              style={{
                                width: "300px",
                              }}
                              className="grid-container"
                            >
                              <div
                                style={{
                                  cursor: "pointer",
                                  color: "rgb(83, 100, 113)",
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                  fontWeight: "400",
                                  marginLeft: "5px",
                                }}
                                className="grid-item mt-5"
                              >
                                <span>
                                  Don&apos;t have an account?{" "}
                                  <a
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    href=""
                                  >
                                    Sign up
                                  </a>
                                </span>
                              </div>
                            </div>
                          </Modal.Body>
                        )}
                      </>
                    ) : tabIndex === 1 ? (
                      <>
                        {tabLoading ? (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <>
                            <Modal.Body
                              className="signin-modal-body-child-non-reactivate"
                              style={{
                                overflowY: "auto",
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  textAlign: "left",
                                  width: "81.5%",
                                  lineHeight: "28px",
                                  fontWeight: "700",
                                  fontSize: "26px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                Find your Connectify account
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  lineHeight: "20px",
                                  width: "81.5%",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                }}
                              >
                                Enter the email, or username associated with
                                your account to change your password.
                              </div>
                              <TextField
                                className="mt-4"
                                autoFocus={true}
                                value={findConnectifyAccount}
                                onChange={(e) =>
                                  setFindConnectifyAccount(e.target.value)
                                }
                                type="text"
                                id="outlined-basic"
                                variant={"outlined"}
                                label={`Email, or username`}
                                style={{
                                  width: "81.5%",
                                  height: "58px",
                                }}
                                sx={{
                                  "& .Mui-focused input + fieldset": {
                                    border: "2px solid #1d9bf0 !important",
                                  },
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#cfd9de !important",
                                  },
                                  "& .MuiInputLabel-shrink": {
                                    color: "#1f9cf0 !important",
                                  },
                                }}
                              />

                              <Button
                                style={{
                                  position: "absolute",
                                  bottom: "20px",
                                  width: "81.5%",
                                  height: "52px",
                                  opacity: findConnectifyAccount.length
                                    ? "1"
                                    : "0.5",
                                }}
                                onClick={() => handleFindConnectifyAccount()}
                                className="login-button mt-5"
                                variant="dark"
                              >
                                Next
                              </Button>
                            </Modal.Body>
                          </>
                        )}
                      </>
                    ) : tabIndex === 2 ? (
                      <>
                        {tabLoading ? (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <>
                            {/* start to check confirm username */}
                            <Modal.Body
                              className="signin-modal-body-child-non-reactivate"
                              style={{
                                overflowY: "auto",
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  textAlign: "left",
                                  width: "81.5%",
                                  lineHeight: "28px",
                                  fontWeight: "700",
                                  fontSize: "26px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                Confirm your username
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  lineHeight: "20px",
                                  width: "81.5%",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                }}
                              >
                                Verify your identity by entering the username
                                associated with your Connectify account.
                              </div>
                              <TextField
                                className="mt-4"
                                autoFocus={true}
                                value={confirmUsername}
                                onChange={(e) =>
                                  setConfirmUsername(e.target.value)
                                }
                                type="text"
                                id="outlined-basic"
                                variant={"outlined"}
                                label={`Username`}
                                style={{
                                  width: "81.5%",
                                  height: "58px",
                                }}
                                sx={{
                                  "& .Mui-focused input + fieldset": {
                                    border: "2px solid #1d9bf0 !important",
                                  },
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#cfd9de !important",
                                  },
                                  "& .MuiInputLabel-shrink": {
                                    color: "#1f9cf0 !important",
                                  },
                                }}
                              />

                              <Button
                                style={{
                                  position: "absolute",
                                  bottom: "20px",
                                  width: "81.5%",
                                  height: "52px",
                                  opacity: confirmUsername.length ? "1" : "0.5",
                                }}
                                onClick={() => checkUsername()}
                                className="login-button mt-5"
                                variant="dark"
                              >
                                Next
                              </Button>
                            </Modal.Body>

                            {/* finish to check confirm username  */}
                          </>
                        )}
                      </>
                    ) : tabIndex === 3 ? (
                      <>
                        {tabLoading ? (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <div
                              className="mb-4"
                              style={{
                                display: "flex",
                                textAlign: "left",
                                width: "81.5%",
                                lineHeight: "28px",
                                fontWeight: "700",
                                fontSize: "26px",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Where should we send a confirmation code?
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",
                                fontSize: "15px",
                                fontWeight: "400",
                                display: "flex",
                                textAlign: "left",
                                width: "81.5%",
                              }}
                            >
                              Before you can change your password, we need to
                              make sure it’s really you.
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",
                                fontSize: "15px",
                                fontWeight: "400",
                                display: "flex",
                                textAlign: "left",
                                width: "81.5%",
                              }}
                            >
                              Start by choosing where to send a confirmation
                              code.
                            </div>

                            <div
                              className="mt-4"
                              style={{
                                display: "flex",
                                width: "81.5%",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                  fontWeight: "700",
                                }}
                              >
                                Send an email to{" "}
                                {getMaskedEmail(
                                  forgotPasswordInProcessUser.email
                                )}
                              </div>

                              <div
                                style={{
                                  position: "relative",
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  bottom: "5px",
                                  left: "12%",
                                }}
                                className="hover-forgot-password-send-email-stack-svg-verified-email "
                              >
                                <div
                                  style={{
                                    backgroundColor:
                                      "#1d9bf0                            ",
                                    width: "20px",
                                    height: "20px",
                                    position: "relative",
                                    left: "10px",
                                    top: "10px",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <svg
                                    style={{
                                      position: "relative",
                                      left: "2px",
                                      bottom: "4px",
                                    }}
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                    color="white"
                                    fill="currentColor"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div
                              className="mt-4 connectify-support-forgot-password-screen"
                              style={{
                                textAlign: "left",
                                lineHeight: "20px",
                                fontSize: "15px",
                                fontWeight: "400",
                                width: "81.5%",
                              }}
                            >
                              Contact{" "}
                              <span
                                className="connectify-support-forgot-password-screen"
                                style={{
                                  color: "rgb(29, 155, 240)",
                                }}
                              >
                                Connectify Support
                              </span>{" "}
                              if you don’t have access.
                            </div>

                            <Button
                              style={{
                                position: "absolute",
                                bottom: "70px",
                                width: "81.5%",
                                height: "52px",
                              }}
                              onClick={() =>
                                handleSendForgotPasswordCodeToEmail()
                              }
                              className="login-button mt-5 mb-3"
                              variant="dark"
                            >
                              Next
                            </Button>

                            <Button
                              className="cancel-btn-reactivate-tab"
                              style={{
                                position: "absolute",
                                bottom: "20px",
                                height: "52px",
                                width: "81.5%",
                                color: "black",
                              }}
                              // className="login-button"
                              variant="light"
                              onClick={() => {
                                setTabIndex(0);
                                handleClose();
                              }}
                            >
                              Cancel
                            </Button>
                          </Modal.Body>
                        )}
                      </>
                    ) : tabIndex === 4 ? (
                      <>
                        {tabLoading ? (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <Modal.Body
                            style={{
                              overflowY: "auto",
                              position: "relative",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
                            <div
                              style={{
                                display: "flex",
                                textAlign: "left",
                                width: "81.5%",
                                lineHeight: "28px",
                                fontWeight: "700",
                                fontSize: "26px",
                                letterSpacing: "0.5px",
                              }}
                            >
                              We sent you a code
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",
                                width: "81.5%",
                                fontSize: "15px",
                                fontWeight: "400",
                              }}
                            >
                              Check your email to get your confirmation code. If
                              you need to request a new code, go back and
                              reselect a confirmation.
                            </div>{" "}
                            <TextField
                              className="mt-4"
                              autoFocus={true}
                              value={verificationCodeInput}
                              onChange={(e) => {
                                setVerificationCodeInput(e.target.value);
                              }}
                              type="text"
                              id="outlined-basic"
                              variant={"outlined"}
                              label={`Enter your code`}
                              style={{
                                width: "81.5%",
                                height: "58px",
                              }}
                              sx={{
                                "& .Mui-focused input + fieldset": {
                                  border: "2px solid #1d9bf0 !important",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#cfd9de !important",
                                },
                                "& .MuiInputLabel-shrink": {
                                  color: "#1f9cf0 !important",
                                },
                              }}
                            />
                            {verificationCodeInput.length ? (
                              <Button
                                style={{
                                  position: "absolute",
                                  bottom: "20px",
                                  width: "81.5%",
                                  minHeight: "52px",
                                  color: "white",
                                }}
                                onClick={() => {
                                  verificationCodeInput ===
                                  receivedVerificationCodeForPasswordChange
                                    ? handleTabChange()
                                    : catchErrorMessage(
                                        "Invalid verification code."
                                      );
                                }}
                                className="login-button"
                                variant="dark"
                              >
                                Next
                              </Button>
                            ) : (
                              <>
                                <Button
                                  className={"cancel-btn-reactivate-tab"}
                                  style={{
                                    position: "absolute",
                                    bottom: "20px",
                                    width: "81.5%",
                                    minHeight: "52px",
                                    color: "black",
                                  }}
                                  // className="login-button"
                                  variant={"light"}
                                  onClick={() => setTabIndex(tabIndex - 1)}
                                >
                                  Back
                                </Button>
                              </>
                            )}
                          </Modal.Body>
                        )}
                      </>
                    ) : tabIndex === 5 ? (
                      <>
                        {" "}
                        {tabLoading ? (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  textAlign: "left",
                                  width: "81.5%",
                                  lineHeight: "28px",
                                  fontWeight: "700",
                                  fontSize: "26px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                Choose a new password
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  lineHeight: "20px",
                                  width: "81.5%",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                }}
                              >
                                Make sure your new password is 8 characters or
                                more. Try including numbers, letters, and
                                punctuation marks for a{" "}
                                <span
                                  style={{
                                    color: "rgb(29, 155, 240)",
                                  }}
                                >
                                  strong password.
                                </span>
                              </div>
                              <div
                                className="mt-4"
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  lineHeight: "20px",
                                  width: "81.5%",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                }}
                              >
                                {
                                  "You'll be logged out of all active Connectify sessions after your password is changed."
                                }
                              </div>
                              <FormControl
                                className="mt-4"
                                sx={{
                                  m: 1,
                                  width: "81.5%",
                                }}
                                variant="outlined"
                              >
                                <InputLabel
                                  sx={{
                                    "&.MuiInputLabel-shrink": {
                                      color: errorMessageForFirstInput
                                        ? "rgb(244, 33, 46)!important"
                                        : "#1f9cf0 !important",
                                    },
                                  }}
                                  htmlFor="outlined-adornment-password"
                                >
                                  Enter a new password
                                </InputLabel>
                                <OutlinedInput
                                  sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      borderColor: errorMessageForFirstInput
                                        ? "rgb(244, 33, 46)!important"
                                        : "#cfd9de !important",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: errorMessageForFirstInput
                                          ? "2px solid rgb(244, 33, 46)!important"
                                          : "2px solid #1d9bf0 !important",
                                      },
                                  }}
                                  onBlur={() => setfirstInputActive(false)}
                                  onChange={(e) => handleNewPasswordChange(e)}
                                  value={newPassword}
                                  id="outlined-adornment-password"
                                  type={showPassword ? "text" : "password"}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      {showPassword ? (
                                        <svg
                                          onClick={handleClickShowPassword}
                                          onMouseDown={handleMouseDownPassword}
                                          style={{
                                            cursor: "pointer",
                                          }}
                                          color="rgb(15, 20, 25)"
                                          fill="currentColor"
                                          width={22}
                                          height={22}
                                          viewBox="0 0 24 24"
                                          aria-hidden="true"
                                          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                        >
                                          <g>
                                            <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                                          </g>
                                        </svg>
                                      ) : (
                                        <svg
                                          onClick={handleClickShowPassword}
                                          onMouseDown={handleMouseDownPassword}
                                          style={{
                                            cursor: "pointer",
                                          }}
                                          width={22}
                                          height={22}
                                          color="rgb(15, 20, 25)"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                          aria-hidden="true"
                                          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                        >
                                          <g>
                                            <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                                          </g>
                                        </svg>
                                      )}
                                    </InputAdornment>
                                  }
                                  label="Enter a new password"
                                />
                              </FormControl>
                              {errorMessageForFirstInput ? (
                                <div
                                  style={{
                                    position: "relative",
                                    left: "10px",
                                    width: "81.5%",
                                    fontSize: "13px",
                                    lineHeight: "16px",
                                    fontWeight: "400",
                                    color: "rgb(244, 33, 46)",
                                  }}
                                >
                                  {errorMessageForFirstInput}
                                </div>
                              ) : null}
                              <FormControl
                                className="mt-3"
                                sx={{ m: 1, width: "81.5%" }}
                                variant="outlined"
                              >
                                <InputLabel
                                  sx={{
                                    "&.MuiInputLabel-shrink": {
                                      color: errorMessageForSecondInput
                                        ? "rgb(244, 33, 46)!important"
                                        : "#1f9cf0 !important",
                                    },
                                  }}
                                  htmlFor="outlined-adornment-password"
                                >
                                  Confirm your password
                                </InputLabel>
                                <OutlinedInput
                                  sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      borderColor: errorMessageForSecondInput
                                        ? "rgb(244, 33, 46)!important"
                                        : "#cfd9de !important",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: errorMessageForSecondInput
                                          ? "2px solid rgb(244, 33, 46)!important"
                                          : "2px solid #1d9bf0 !important",
                                      },
                                  }}
                                  onBlur={() => setsecondInputActive(false)}
                                  onChange={(e) =>
                                    handleConfirmPasswordChange(e)
                                  }
                                  value={confirmPassword}
                                  id="outlined-adornment-password"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  endAdornment={
                                    <InputAdornment position="end">
                                      {showConfirmPassword ? (
                                        <svg
                                          onClick={
                                            handleClickShowPasswordForConfirmPassword
                                          }
                                          onMouseDown={
                                            handleMouseDownPasswordForConfirmPassword
                                          }
                                          style={{
                                            cursor: "pointer",
                                          }}
                                          color="rgb(15, 20, 25)"
                                          fill="currentColor"
                                          width={22}
                                          height={22}
                                          viewBox="0 0 24 24"
                                          aria-hidden="true"
                                          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                        >
                                          <g>
                                            <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                                          </g>
                                        </svg>
                                      ) : (
                                        <svg
                                          onClick={
                                            handleClickShowPasswordForConfirmPassword
                                          }
                                          onMouseDown={
                                            handleMouseDownPasswordForConfirmPassword
                                          }
                                          style={{
                                            cursor: "pointer",
                                          }}
                                          width={22}
                                          height={22}
                                          color="rgb(15, 20, 25)"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                          aria-hidden="true"
                                          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                        >
                                          <g>
                                            <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                                          </g>
                                        </svg>
                                      )}
                                    </InputAdornment>
                                  }
                                  label="Confirm your password"
                                />
                              </FormControl>
                              {errorMessageForSecondInput ? (
                                <div
                                  style={{
                                    position: "relative",
                                    left: "10px",
                                    width: "81.5%",
                                    fontSize: "13px",
                                    lineHeight: "16px",
                                    fontWeight: "400",
                                    color: "rgb(244, 33, 46)",
                                  }}
                                >
                                  {errorMessageForSecondInput}
                                </div>
                              ) : null}
                              <Button
                                style={{
                                  width: "81.5%",
                                  height: "52px",
                                  position: "absolute",
                                  bottom: "20px",
                                  opacity:
                                    confirmPassword.length && newPassword.length
                                      ? "1"
                                      : "0.5",
                                }}
                                onClick={() => {
                                  handleChangePassword();
                                }}
                                className="login-button mt-5"
                                variant="dark"
                              >
                                Change password
                              </Button>
                            </>
                          </Modal.Body>
                        )}
                      </>
                    ) : tabIndex === 6 ? (
                      <>
                        {tabLoading ? (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            {" "}
                            <div
                              style={{
                                display: "flex",
                                textAlign: "left",
                                width: "81.5%",
                                lineHeight: "28px",
                                fontWeight: "700",
                                fontSize: "26px",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {"Why'd you change your password"}
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",
                                width: "81.5%",
                                fontSize: "15px",
                                fontWeight: "400",
                              }}
                            >
                              Your feedback helps us understand when and why
                              people need to change their passwords.
                            </div>
                            <div
                              className="mt-5"
                              style={{
                                overflowY: "auto",
                                position: "relative",
                                width: "81.5%",
                                display: "flex",
                              }}
                            >
                              <div
                                className="mt-2"
                                style={{
                                  fontWeight: "700",
                                  fontSize: "16px",
                                  lineHeight: "24px",
                                }}
                              >
                                I forgot my password
                              </div>
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                  position: "relative",
                                }}
                                className={
                                  forgotMyPasswordChecked
                                    ? "ms-auto hover-forgot-password-send-email-stack-svg-verified-email"
                                    : "ms-auto hover-forgot-password-send-email-stack-svg-verified-email-variant-2"
                                }
                                onClick={() => {
                                  setForgotMyPasswordChecked(
                                    !forgotMyPasswordChecked
                                  );
                                  setSuspiciousActivityChecked(false);
                                  setDifferentReason(false);
                                  setCheckedValue(!forgotMyPasswordChecked);
                                }}
                              >
                                <div
                                  style={{
                                    backgroundColor: forgotMyPasswordChecked
                                      ? "#1d9bf0"
                                      : "transparent",
                                    border: forgotMyPasswordChecked
                                      ? "none"
                                      : "1px solid black",
                                    width: "20px",
                                    height: "20px",
                                    position: "relative",
                                    left: "10px",
                                    top: "10px",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <svg
                                    style={{
                                      position: "relative",
                                      left: "2px",
                                      bottom: "4px",
                                      display: forgotMyPasswordChecked
                                        ? "initial"
                                        : "none",
                                    }}
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                    color="white"
                                    fill="currentColor"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div
                              className="mt-3"
                              style={{
                                overflowY: "auto",
                                position: "relative",
                                width: "81.5%",
                                display: "flex",
                              }}
                            >
                              <div
                                className="mt-2.5"
                                style={{
                                  fontWeight: "700",
                                  fontSize: "16px",
                                  lineHeight: "24px",
                                }}
                              >
                                There was suspicious activity on my account
                              </div>

                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                }}
                                className={
                                  suspiciousActivity
                                    ? "ms-auto hover-forgot-password-send-email-stack-svg-verified-email"
                                    : "ms-auto hover-forgot-password-send-email-stack-svg-verified-email-variant-2"
                                }
                                onClick={() => {
                                  setSuspiciousActivityChecked(
                                    !suspiciousActivity
                                  );
                                  setForgotMyPasswordChecked(false);
                                  setDifferentReason(false);
                                  setCheckedValue(!suspiciousActivity);
                                }}
                              >
                                <div
                                  style={{
                                    backgroundColor: suspiciousActivity
                                      ? "#1d9bf0"
                                      : "transparent",
                                    border: suspiciousActivity
                                      ? "none"
                                      : "1px solid black",
                                    width: "20px",
                                    height: "20px",
                                    position: "relative",
                                    left: "10px",
                                    top: "10px",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <svg
                                    style={{
                                      position: "relative",
                                      left: "2px",
                                      bottom: "4px",
                                      display: suspiciousActivity
                                        ? "initial"
                                        : "none",
                                    }}
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                    color="white"
                                    fill="currentColor"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div
                              className="mt-3"
                              style={{
                                overflowY: "auto",
                                position: "relative",
                                width: "81.5%",
                                display: "flex",
                              }}
                            >
                              <div
                                className="mt-2.5"
                                style={{
                                  fontWeight: "700",
                                  fontSize: "16px",
                                  lineHeight: "24px",
                                }}
                              >
                                I changed my password for a different reason
                              </div>

                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                }}
                                className={
                                  differentReason
                                    ? "ms-auto hover-forgot-password-send-email-stack-svg-verified-email"
                                    : "ms-auto hover-forgot-password-send-email-stack-svg-verified-email-variant-2"
                                }
                                onClick={() => {
                                  setDifferentReason(!differentReason);
                                  setSuspiciousActivityChecked(false);
                                  setForgotMyPasswordChecked(false);
                                  setCheckedValue(!differentReason);
                                }}
                              >
                                <div
                                  style={{
                                    backgroundColor: differentReason
                                      ? "#1d9bf0"
                                      : "transparent",
                                    border: differentReason
                                      ? "none"
                                      : "1px solid black",
                                    width: "20px",
                                    height: "20px",
                                    position: "relative",
                                    left: "10px",
                                    top: "10px",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <svg
                                    style={{
                                      position: "relative",
                                      left: "2px",
                                      bottom: "4px",
                                      display: differentReason
                                        ? "initial"
                                        : "none",
                                    }}
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                    color="white"
                                    fill="currentColor"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <Button
                              style={{
                                width: "81.5%",
                                height: "52px",
                                position: "absolute",
                                bottom: "20px",
                                opacity: checkedValue ? "" : 0.5,
                              }}
                              onClick={() => {
                                setTabLoading(true);
                                setTimeout(() => {
                                  setTabLoading(false);
                                  checkedValue
                                    ? setTabIndex(tabIndex + 1)
                                    : null;
                                }, 500);
                              }}
                              className="login-button mt-5"
                              variant="dark"
                            >
                              Next
                            </Button>
                          </Modal.Body>
                        )}
                      </>
                    ) : tabIndex === 7 ? (
                      <>
                        {" "}
                        {tabLoading ? (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            {" "}
                            <div
                              className="mt-5"
                              style={{
                                padding: "16px",
                                width: "81.5%",
                              }}
                            >
                              <div
                                style={{
                                  lineHeight: "36px",
                                  fontWeight: "700",
                                  fontSize: "31px",
                                }}
                              >
                                {"You're all set"}
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  lineHeight: "20px",

                                  fontSize: "15px",
                                  fontWeight: "400",
                                }}
                              >
                                {"You've successfully changed your password."}
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  lineHeight: "20px",

                                  fontSize: "15px",
                                  fontWeight: "400",
                                }}
                              >
                                Add an extra layer of security to your account
                                with{" "}
                                <span
                                  style={{
                                    color: "rgb(29, 155, 240)",
                                  }}
                                >
                                  two-factor authentication
                                </span>
                                . Enable it in your settings to help make sure
                                that you, and only you, can access your account.
                              </div>
                            </div>
                            <Button
                              style={{
                                width: "81.5%",
                                height: "52px",
                              }}
                              onClick={() => {
                                handleLoginAfterForgotPasswordProcess();
                              }}
                              className="login-button mt-5"
                              variant="dark"
                            >
                              Continue to X
                            </Button>
                          </Modal.Body>
                        )}
                      </>
                    ) : tabIndex === 8 ? (
                      <>
                        {" "}
                        <>
                          {tabLoading ? (
                            <Modal.Body className="signin-modal-body-child-non-reactivate">
                              <LoadingSpinner
                                strokeColor={"rgb(29, 155, 240)"}
                              ></LoadingSpinner>
                            </Modal.Body>
                          ) : (
                            <>
                              <Modal.Body
                                className="signin-modal-body-child-non-reactivate"
                                style={{
                                  overflowY: "auto",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    textAlign: "left",
                                    width: "81.5%",
                                    lineHeight: "28px",
                                    fontWeight: "700",
                                    fontSize: "26px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  Enter your password
                                </div>

                                <div
                                  className="mt-5"
                                  style={{
                                    width: "81.5%",
                                    height: "58px",
                                  }}
                                >
                                  <TextField
                                    style={{
                                      width: "100%",
                                    }}
                                    disabled
                                    id="filled-disabled"
                                    label="Username"
                                    defaultValue={loginInput.usernameOrEmail}
                                    variant="filled"
                                    InputProps={{
                                      disableUnderline: true,
                                    }}
                                    sx={{
                                      "& .MuiFilledInput-root": {
                                        background: "#f7f9fa !important",
                                      },
                                    }}
                                  />
                                </div>
                                <FormControl
                                  className="mt-4"
                                  sx={{
                                    m: 1,
                                    width: "81.5%",
                                  }}
                                  variant="outlined"
                                >
                                  <InputLabel
                                    sx={{
                                      "&.MuiInputLabel-shrink": {
                                        color: "#1f9cf0 !important",
                                      },
                                    }}
                                    htmlFor="outlined-adornment-password"
                                  >
                                    Password
                                  </InputLabel>
                                  <OutlinedInput
                                    autoFocus
                                    sx={{
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#cfd9de !important",
                                      },
                                      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          border:
                                            "2px solid #1d9bf0 !important",
                                        },
                                    }}
                                    onChange={(e) =>
                                      setLoginInput((prevInfo) => ({
                                        ...prevInfo,
                                        password: e.target.value,
                                      }))
                                    }
                                    value={loginInput.password}
                                    id="outlined-adornment-password"
                                    type={showPassword ? "text" : "password"}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        {showPassword ? (
                                          <svg
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                              handleMouseDownPassword
                                            }
                                            style={{
                                              cursor: "pointer",
                                            }}
                                            color="rgb(15, 20, 25)"
                                            fill="currentColor"
                                            width={22}
                                            height={22}
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                          >
                                            <g>
                                              <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                                            </g>
                                          </svg>
                                        ) : (
                                          <svg
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                              handleMouseDownPassword
                                            }
                                            style={{
                                              cursor: "pointer",
                                            }}
                                            width={22}
                                            height={22}
                                            color="rgb(15, 20, 25)"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                          >
                                            <g>
                                              <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                                            </g>
                                          </svg>
                                        )}
                                      </InputAdornment>
                                    }
                                    label="Password"
                                  />
                                </FormControl>
                                <div
                                  className="forgot-password-login-variant-one-screen"
                                  onClick={() => {
                                    setTabLoading(true);
                                    setTimeout(() => {
                                      setStartForgotPasswordProcess(true);
                                      setTabIndex(1);
                                      setShow(true);
                                      setTabLoading(false);
                                    }, 300);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    position: "relative",
                                    left: "10px",
                                    bottom: "5px",
                                    width: "81.5%",
                                    color: "rgb(29, 155, 240)",
                                    fontSize: "13px",
                                    fontWeight: "400",
                                    lineHeight: "16px",
                                  }}
                                >
                                  Forgot password
                                </div>

                                <Button
                                  style={{
                                    position: "absolute",
                                    bottom: "60px",
                                    width: "81.5%",
                                    height: "52px",
                                    opacity: loginInput.password.length
                                      ? "1"
                                      : "0.5",
                                  }}
                                  onClick={() => handleLoginVariantOneStep2()}
                                  className="login-button mt-5"
                                  variant="dark"
                                >
                                  Log in
                                </Button>
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "15px",
                                    width: "81.5%",
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    lineHeight: "20px",
                                    color: "rgb(83, 100, 113)",
                                    // height: "52px",
                                  }}
                                >
                                  {"Don't have an account? "}
                                  <span
                                    onClick={() => {
                                      navigate("/");
                                    }}
                                    className="sign-up-link-login-variant-one"
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "15px",
                                      fontWeight: "400",
                                      lineHeight: "20px",
                                      color: "rgb(29, 155, 240)",
                                    }}
                                  >
                                    <a href="">Sign up</a>
                                  </span>
                                </div>
                              </Modal.Body>
                            </>
                          )}
                        </>
                      </>
                    ) : null}
                  </Modal>
                </>
              ) : (
                <Modal
                  show={showLoginModal}
                  onHide={handleCloseLoginModal}
                  size="lg"
                  centered={true}
                  className="signin-modal-parent-non-reactivate"
                >
                  <Modal.Header
                    className="signin-modal-header-child-non-reactivate"
                    style={{
                      border: "none",
                    }}
                  >
                    <div
                      onClick={handleCloseLoginModal}
                      className="close-button"
                      style={{
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <div>
                        {/* close signin modal icon start to check  */}
                        <svg
                          style={{
                            border: "none",
                            fontSize: "15px",
                            margin: "5px",
                          }}
                          onClick={handleCloseLoginModal}
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
                        {/* close signin modal icon finish to check  */}
                      </div>
                    </div>
                  </Modal.Header>
                  {tabIndex === 0 ? (
                    <>
                      {tabLoading ? (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <Modal.Body
                          className="signin-modal-body-child-non-reactivate"
                          style={
                            {
                              // overflowY: "scroll",
                            }
                          }
                        >
                          <span
                            style={{
                              fontSize: "31px",
                              fontWeight: "700",
                              lineHeight: "36px",
                              letterSpacing: "0.5px",
                            }}
                            className="sign-in-header mt-4 mb-4"
                          >
                            Sign in to Connectify
                          </span>

                          <div>
                            <Button
                              onClick={googleAuth}
                              style={{
                                backgroundColor: "transparent",
                                borderWidth: "1px",
                                minWidth: "300px",
                                minHeight: "40px",
                                borderRadius: "9999px",
                                borderColor: "rgba(0,0,0,0.1)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                              variant="light"
                              className="google-variant-sign-in"
                            >
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  lineHeight: "16px",
                                  marginLeft: "10px",
                                  color: "black",
                                }}
                              >
                                Sign in with Google
                              </span>
                              <svg
                                width={16}
                                height={16}
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="LgbsSe-Bz112c"
                              >
                                <g>
                                  <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                  ></path>
                                  <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                  ></path>
                                  <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                  ></path>
                                  <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                  ></path>
                                  <path fill="none" d="M0 0h48v48H0z"></path>
                                </g>
                              </svg>
                            </Button>
                          </div>
                          <Divider
                            style={{
                              width: "300px",
                              minWidth: "300px",
                              margin: "5px",
                            }}
                            plain
                          >
                            or
                          </Divider>
                          <TextField
                            className="mt-1"
                            id="outlined-basic"
                            label="Email, or username"
                            variant="outlined"
                            value={loginInput.usernameOrEmail}
                            type="text"
                            onChange={(e) =>
                              setLoginInput((prevInfo) => ({
                                ...prevInfo,
                                usernameOrEmail: e.target.value,
                              }))
                            }
                            style={{
                              width: "300px",
                              height: "58px",
                            }}
                            sx={{
                              "& .Mui-focused input + fieldset": {
                                border: "2px solid #1d9bf0 !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#cfd9de !important",
                              },
                              "& .MuiInputLabel-shrink": {
                                color: "#1f9cf0 !important",
                              },
                            }}
                          />

                          {error}
                          {/* this button should check username or email coming from input from logininput start to check */}
                          <Button
                            style={{
                              width: "300px",
                              minHeight: "36px",
                              color: "white",
                              fontSize: "15px",
                              fontWeight: "700",
                              lineHeight: "20px",
                            }}
                            className="login-button mt-4 next-btn"
                            variant="dark"
                            // onClick={() => {
                            //   setTabLoading(true);
                            //   setTimeout(() => {
                            //     setStartForgotPasswordProcess(true);
                            //     setTabIndex(tabIndex + 1);
                            //     setShow(true);
                            //     setTabLoading(false);
                            //   }, 300);
                            // }}
                            onClick={handleLoginVariantOneStartProcess}
                          >
                            Next
                          </Button>
                          {/* this button should check username or email coming from input from logininput start to check */}
                          <Button
                            style={{
                              width: "300px",
                              height: "36px",
                              color: "black",
                              fontSize: "15px",
                              fontWeight: "700",
                              lineHeight: "20px",
                            }}
                            className="mt-4 forgot-password-btn"
                            variant="light"
                            onClick={() => {
                              setTabLoading(true);
                              setTimeout(() => {
                                setStartForgotPasswordProcess(true);
                                setTabIndex(tabIndex + 1);
                                setShow(true);
                                setTabLoading(false);
                              }, 300);
                            }}
                          >
                            Forgot password?
                          </Button>
                          <div
                            style={{
                              width: "300px",
                            }}
                            className="grid-container"
                          >
                            <div
                              style={{
                                cursor: "pointer",
                                color: "rgb(83, 100, 113)",
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: "400",
                                marginLeft: "5px",
                              }}
                              className="grid-item mt-5"
                            >
                              <span>
                                Don&apos;t have an account?{" "}
                                <a href="">Sign up</a>
                              </span>
                            </div>
                          </div>
                        </Modal.Body>
                      )}
                    </>
                  ) : tabIndex === 1 ? (
                    <>
                      {tabLoading ? (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <>
                          <Modal.Body
                            className="signin-modal-body-child-non-reactivate"
                            style={{
                              overflowY: "auto",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: "81.5%",
                                lineHeight: "36px",
                                fontWeight: "700",
                                fontSize: "31px",
                              }}
                            >
                              Find your Connectify account
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",
                                width: "81.5%",
                                fontSize: "15px",
                                fontWeight: "400",
                              }}
                            >
                              Enter the email, or username associated with your
                              account to change your password.
                            </div>
                            <TextField
                              className="mt-4"
                              autoFocus={true}
                              value={findConnectifyAccount}
                              onChange={(e) =>
                                setFindConnectifyAccount(e.target.value)
                              }
                              type="text"
                              id="outlined-basic"
                              variant={"outlined"}
                              label={`Email, or username`}
                              style={{
                                width: "81.5%",
                                height: "58px",
                              }}
                              sx={{
                                "& .Mui-focused input + fieldset": {
                                  border: "2px solid #1d9bf0 !important",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#cfd9de !important",
                                },
                                "& .MuiInputLabel-shrink": {
                                  color: "#1f9cf0 !important",
                                },
                              }}
                            />

                            <Button
                              style={{
                                position: "absolute",
                                bottom: "20px",
                                width: "81.5%",
                                height: "52px",
                                opacity: findConnectifyAccount.length
                                  ? "1"
                                  : "0.5",
                              }}
                              onClick={() => handleFindConnectifyAccount()}
                              className="login-button mt-5"
                              variant="dark"
                            >
                              Next
                            </Button>
                          </Modal.Body>
                        </>
                      )}
                    </>
                  ) : tabIndex === 2 ? (
                    <>
                      {" "}
                      {tabLoading ? (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <>
                          {/* start to check confirm username */}
                          <Modal.Body
                            className="signin-modal-body-child-non-reactivate"
                            style={{
                              overflowY: "auto",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: "81.5%",
                                lineHeight: "36px",
                                fontWeight: "700",
                                fontSize: "31px",
                              }}
                            >
                              Confirm your username
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",
                                width: "81.5%",
                                fontSize: "15px",
                                fontWeight: "400",
                              }}
                            >
                              Verify your identity by entering the username
                              associated with your Connectify account.
                            </div>
                            <TextField
                              className="mt-4"
                              autoFocus={true}
                              value={confirmUsername}
                              onChange={(e) =>
                                setConfirmUsername(e.target.value)
                              }
                              type="text"
                              id="outlined-basic"
                              variant={"outlined"}
                              label={`Username`}
                              style={{
                                width: "81.5%",
                                height: "58px",
                              }}
                              sx={{
                                "& .Mui-focused input + fieldset": {
                                  border: "2px solid #1d9bf0 !important",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#cfd9de !important",
                                },
                                "& .MuiInputLabel-shrink": {
                                  color: "#1f9cf0 !important",
                                },
                              }}
                            />

                            <Button
                              style={{
                                position: "absolute",
                                bottom: "20px",
                                width: "81.5%",
                                height: "52px",
                                opacity: confirmUsername.length ? "1" : "0.5",
                              }}
                              onClick={() => checkUsername()}
                              className="login-button mt-5"
                              variant="dark"
                            >
                              Next
                            </Button>
                          </Modal.Body>

                          {/* finish to check confirm username  */}
                        </>
                      )}
                    </>
                  ) : tabIndex === 3 ? (
                    <>
                      {" "}
                      {tabLoading ? (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <div
                            className="mb-4"
                            style={{
                              width: "81.5%",
                              lineHeight: "36px",
                              fontWeight: "700",
                              fontSize: "31px",
                            }}
                          >
                            Where should we send a confirmation code?
                          </div>
                          <div
                            className="mt-2"
                            style={{
                              color: "rgb(83, 100, 113)",
                              lineHeight: "20px",
                              fontSize: "15px",
                              fontWeight: "400",
                              display: "flex",
                              textAlign: "left",
                              width: "81.5%",
                            }}
                          >
                            Before you can change your password, we need to make
                            sure it’s really you.
                          </div>
                          <div
                            className="mt-2"
                            style={{
                              color: "rgb(83, 100, 113)",
                              lineHeight: "20px",
                              fontSize: "15px",
                              fontWeight: "400",
                              display: "flex",
                              textAlign: "left",
                              width: "81.5%",
                            }}
                          >
                            Start by choosing where to send a confirmation code.
                          </div>

                          <div
                            className="mt-4"
                            style={{
                              display: "flex",
                              width: "81.5%",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: "700",
                              }}
                            >
                              Send an email to{" "}
                              {getMaskedEmail(
                                forgotPasswordInProcessUser.email
                              )}
                            </div>

                            <div
                              style={{
                                position: "relative",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                bottom: "5px",
                                left: "12%",
                              }}
                              className="hover-forgot-password-send-email-stack-svg-verified-email "
                            >
                              <div
                                style={{
                                  backgroundColor:
                                    "#1d9bf0                            ",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "10px",
                                  top: "10px",
                                  borderRadius: "50%",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div
                            className="mt-4 connectify-support-forgot-password-screen"
                            style={{
                              textAlign: "left",
                              lineHeight: "20px",
                              fontSize: "15px",
                              fontWeight: "400",
                              width: "81.5%",
                            }}
                          >
                            Contact{" "}
                            <span
                              className="connectify-support-forgot-password-screen"
                              style={{
                                color: "rgb(29, 155, 240)",
                              }}
                            >
                              Connectify Support
                            </span>{" "}
                            if you don’t have access.
                          </div>

                          <Button
                            style={{
                              position: "absolute",
                              bottom: "70px",
                              width: "81.5%",
                              height: "52px",
                            }}
                            onClick={() =>
                              handleSendForgotPasswordCodeToEmail()
                            }
                            className="login-button mt-5 mb-3"
                            variant="dark"
                          >
                            Next
                          </Button>

                          <Button
                            className="cancel-btn-reactivate-tab"
                            style={{
                              position: "absolute",
                              bottom: "20px",
                              height: "52px",
                              width: "81.5%",
                              color: "black",
                            }}
                            // className="login-button"
                            variant="light"
                            onClick={() => {
                              setTabIndex(0);
                              handleClose();
                            }}
                          >
                            Cancel
                          </Button>
                        </Modal.Body>
                      )}
                    </>
                  ) : tabIndex === 4 ? (
                    <>
                      {" "}
                      {tabLoading ? (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <Modal.Body
                          style={{
                            overflowY: "auto",
                            position: "relative",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
                          <div
                            style={{
                              width: "81.5%",
                              lineHeight: "36px",
                              fontWeight: "700",
                              fontSize: "31px",
                            }}
                          >
                            We sent you a code
                          </div>
                          <div
                            className="mt-2"
                            style={{
                              color: "rgb(83, 100, 113)",
                              lineHeight: "20px",
                              width: "81.5%",
                              fontSize: "15px",
                              fontWeight: "400",
                            }}
                          >
                            Check your email to get your confirmation code. If
                            you need to request a new code, go back and reselect
                            a confirmation.
                          </div>{" "}
                          <TextField
                            className="mt-4"
                            autoFocus={true}
                            value={verificationCodeInput}
                            onChange={(e) => {
                              setVerificationCodeInput(e.target.value);
                            }}
                            type="text"
                            id="outlined-basic"
                            variant={"outlined"}
                            label={`Enter your code`}
                            style={{
                              width: "81.5%",
                              height: "58px",
                            }}
                            sx={{
                              "& .Mui-focused input + fieldset": {
                                border: "2px solid #1d9bf0 !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#cfd9de !important",
                              },
                              "& .MuiInputLabel-shrink": {
                                color: "#1f9cf0 !important",
                              },
                            }}
                          />
                          {verificationCodeInput.length ? (
                            <Button
                              style={{
                                position: "absolute",
                                bottom: "20px",
                                width: "81.5%",
                                minHeight: "52px",
                                color: "white",
                              }}
                              onClick={() => {
                                verificationCodeInput ===
                                receivedVerificationCodeForPasswordChange
                                  ? handleTabChange()
                                  : catchErrorMessage(
                                      "Invalid verification code."
                                    );
                              }}
                              className="login-button"
                              variant="dark"
                            >
                              Next
                            </Button>
                          ) : (
                            <>
                              <Button
                                className={"cancel-btn-reactivate-tab"}
                                style={{
                                  position: "absolute",
                                  bottom: "20px",
                                  width: "81.5%",
                                  minHeight: "52px",
                                  color: "black",
                                }}
                                // className="login-button"
                                variant={"light"}
                                onClick={() => setTabIndex(tabIndex - 1)}
                              >
                                Back
                              </Button>
                            </>
                          )}
                        </Modal.Body>
                      )}
                    </>
                  ) : tabIndex === 5 ? (
                    <>
                      {" "}
                      {tabLoading ? (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <>
                            <div
                              style={{
                                width: "81.5%",
                                lineHeight: "36px",
                                fontWeight: "700",
                                fontSize: "31px",
                              }}
                            >
                              Choose a new password
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",
                                width: "81.5%",
                                fontSize: "15px",
                                fontWeight: "400",
                              }}
                            >
                              Make sure your new password is 8 characters or
                              more. Try including numbers, letters, and
                              punctuation marks for a{" "}
                              <span
                                style={{
                                  color: "rgb(29, 155, 240)",
                                }}
                              >
                                strong password.
                              </span>
                            </div>
                            <div
                              className="mt-4"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",
                                width: "81.5%",
                                fontSize: "15px",
                                fontWeight: "400",
                              }}
                            >
                              {
                                "You'll be logged out of all active Connectify sessions after your password is changed."
                              }
                            </div>
                            <FormControl
                              className="mt-4"
                              sx={{
                                m: 1,
                                width: "81.5%",
                              }}
                              variant="outlined"
                            >
                              <InputLabel
                                sx={{
                                  "&.MuiInputLabel-shrink": {
                                    color: errorMessageForFirstInput
                                      ? "rgb(244, 33, 46)!important"
                                      : "#1f9cf0 !important",
                                  },
                                }}
                                htmlFor="outlined-adornment-password"
                              >
                                Enter a new password
                              </InputLabel>
                              <OutlinedInput
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: errorMessageForFirstInput
                                      ? "rgb(244, 33, 46)!important"
                                      : "#cfd9de !important",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      border: errorMessageForFirstInput
                                        ? "2px solid rgb(244, 33, 46)!important"
                                        : "2px solid #1d9bf0 !important",
                                    },
                                }}
                                onBlur={() => setfirstInputActive(false)}
                                onChange={(e) => handleNewPasswordChange(e)}
                                value={newPassword}
                                id="outlined-adornment-password"
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                  <InputAdornment position="end">
                                    {showPassword ? (
                                      <svg
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        color="rgb(15, 20, 25)"
                                        fill="currentColor"
                                        width={22}
                                        height={22}
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                      >
                                        <g>
                                          <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                                        </g>
                                      </svg>
                                    ) : (
                                      <svg
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        width={22}
                                        height={22}
                                        color="rgb(15, 20, 25)"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                      >
                                        <g>
                                          <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                                        </g>
                                      </svg>
                                    )}
                                  </InputAdornment>
                                }
                                label="Enter a new password"
                              />
                            </FormControl>
                            {errorMessageForFirstInput ? (
                              <div
                                style={{
                                  position: "relative",
                                  left: "10px",
                                  width: "81.5%",
                                  fontSize: "13px",
                                  lineHeight: "16px",
                                  fontWeight: "400",
                                  color: "rgb(244, 33, 46)",
                                }}
                              >
                                {errorMessageForFirstInput}
                              </div>
                            ) : null}
                            <FormControl
                              className="mt-3"
                              sx={{ m: 1, width: "81.5%" }}
                              variant="outlined"
                            >
                              <InputLabel
                                sx={{
                                  "&.MuiInputLabel-shrink": {
                                    color: errorMessageForSecondInput
                                      ? "rgb(244, 33, 46)!important"
                                      : "#1f9cf0 !important",
                                  },
                                }}
                                htmlFor="outlined-adornment-password"
                              >
                                Confirm your password
                              </InputLabel>
                              <OutlinedInput
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: errorMessageForSecondInput
                                      ? "rgb(244, 33, 46)!important"
                                      : "#cfd9de !important",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      border: errorMessageForSecondInput
                                        ? "2px solid rgb(244, 33, 46)!important"
                                        : "2px solid #1d9bf0 !important",
                                    },
                                }}
                                onBlur={() => setsecondInputActive(false)}
                                onChange={(e) => handleConfirmPasswordChange(e)}
                                value={confirmPassword}
                                id="outlined-adornment-password"
                                type={showConfirmPassword ? "text" : "password"}
                                endAdornment={
                                  <InputAdornment position="end">
                                    {showConfirmPassword ? (
                                      <svg
                                        onClick={
                                          handleClickShowPasswordForConfirmPassword
                                        }
                                        onMouseDown={
                                          handleMouseDownPasswordForConfirmPassword
                                        }
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        color="rgb(15, 20, 25)"
                                        fill="currentColor"
                                        width={22}
                                        height={22}
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                      >
                                        <g>
                                          <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                                        </g>
                                      </svg>
                                    ) : (
                                      <svg
                                        onClick={
                                          handleClickShowPasswordForConfirmPassword
                                        }
                                        onMouseDown={
                                          handleMouseDownPasswordForConfirmPassword
                                        }
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        width={22}
                                        height={22}
                                        color="rgb(15, 20, 25)"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                      >
                                        <g>
                                          <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                                        </g>
                                      </svg>
                                    )}
                                  </InputAdornment>
                                }
                                label="Confirm your password"
                              />
                            </FormControl>
                            {errorMessageForSecondInput ? (
                              <div
                                style={{
                                  position: "relative",
                                  left: "10px",
                                  width: "81.5%",
                                  fontSize: "13px",
                                  lineHeight: "16px",
                                  fontWeight: "400",
                                  color: "rgb(244, 33, 46)",
                                }}
                              >
                                {errorMessageForSecondInput}
                              </div>
                            ) : null}
                            <Button
                              style={{
                                width: "81.5%",
                                height: "52px",
                                position: "absolute",
                                bottom: "20px",
                                opacity:
                                  confirmPassword.length && newPassword.length
                                    ? "1"
                                    : "0.5",
                              }}
                              onClick={() => {
                                handleChangePassword();
                              }}
                              className="login-button mt-5"
                              variant="dark"
                            >
                              Change password
                            </Button>
                          </>
                        </Modal.Body>
                      )}
                    </>
                  ) : tabIndex === 6 ? (
                    <>
                      {tabLoading ? (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          {" "}
                          <div
                            style={{
                              width: "81.5%",
                              lineHeight: "36px",
                              fontWeight: "700",
                              fontSize: "31px",
                            }}
                          >
                            {"Why'd you change your password"}
                          </div>
                          <div
                            className="mt-2"
                            style={{
                              color: "rgb(83, 100, 113)",
                              lineHeight: "20px",
                              width: "81.5%",
                              fontSize: "15px",
                              fontWeight: "400",
                            }}
                          >
                            Your feedback helps us understand when and why
                            people need to change their passwords.
                          </div>
                          <div
                            className="mt-5"
                            style={{
                              overflowY: "auto",
                              position: "relative",
                              width: "81.5%",
                              display: "flex",
                            }}
                          >
                            <div
                              className="mt-2"
                              style={{
                                fontWeight: "700",
                                fontSize: "16px",
                                lineHeight: "24px",
                              }}
                            >
                              I forgot my password
                            </div>
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                              }}
                              className={
                                forgotMyPasswordChecked
                                  ? "ms-auto hover-forgot-password-send-email-stack-svg-verified-email"
                                  : "ms-auto hover-forgot-password-send-email-stack-svg-verified-email-variant-2"
                              }
                              onClick={() => {
                                setForgotMyPasswordChecked(
                                  !forgotMyPasswordChecked
                                );
                                setSuspiciousActivityChecked(false);
                                setDifferentReason(false);
                                setCheckedValue(!forgotMyPasswordChecked);
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: forgotMyPasswordChecked
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: forgotMyPasswordChecked
                                    ? "none"
                                    : "1px solid black",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "10px",
                                  top: "10px",
                                  borderRadius: "50%",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                    display: forgotMyPasswordChecked
                                      ? "initial"
                                      : "none",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div
                            className="mt-3"
                            style={{
                              overflowY: "auto",
                              position: "relative",
                              width: "81.5%",
                              display: "flex",
                            }}
                          >
                            <div
                              className="mt-2.5"
                              style={{
                                fontWeight: "700",
                                fontSize: "16px",
                                lineHeight: "24px",
                              }}
                            >
                              There was suspicious activity on my account
                            </div>

                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                              className={
                                suspiciousActivity
                                  ? "ms-auto hover-forgot-password-send-email-stack-svg-verified-email"
                                  : "ms-auto hover-forgot-password-send-email-stack-svg-verified-email-variant-2"
                              }
                              onClick={() => {
                                setSuspiciousActivityChecked(
                                  !suspiciousActivity
                                );
                                setForgotMyPasswordChecked(false);
                                setDifferentReason(false);
                                setCheckedValue(!suspiciousActivity);
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: suspiciousActivity
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: suspiciousActivity
                                    ? "none"
                                    : "1px solid black",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "10px",
                                  top: "10px",
                                  borderRadius: "50%",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                    display: suspiciousActivity
                                      ? "initial"
                                      : "none",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div
                            className="mt-3"
                            style={{
                              overflowY: "auto",
                              position: "relative",
                              width: "81.5%",
                              display: "flex",
                            }}
                          >
                            <div
                              className="mt-2.5"
                              style={{
                                fontWeight: "700",
                                fontSize: "16px",
                                lineHeight: "24px",
                              }}
                            >
                              I changed my password for a different reason
                            </div>

                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                              className={
                                differentReason
                                  ? "ms-auto hover-forgot-password-send-email-stack-svg-verified-email"
                                  : "ms-auto hover-forgot-password-send-email-stack-svg-verified-email-variant-2"
                              }
                              onClick={() => {
                                setDifferentReason(!differentReason);
                                setSuspiciousActivityChecked(false);
                                setForgotMyPasswordChecked(false);
                                setCheckedValue(!differentReason);
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: differentReason
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: differentReason
                                    ? "none"
                                    : "1px solid black",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "10px",
                                  top: "10px",
                                  borderRadius: "50%",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                    display: differentReason
                                      ? "initial"
                                      : "none",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <Button
                            style={{
                              width: "81.5%",
                              height: "52px",
                              position: "absolute",
                              bottom: "20px",
                              opacity: checkedValue ? "" : 0.5,
                            }}
                            onClick={() => {
                              setTabLoading(true);
                              setTimeout(() => {
                                setTabLoading(false);
                                checkedValue ? setTabIndex(tabIndex + 1) : null;
                              }, 500);
                            }}
                            className="login-button mt-5"
                            variant="dark"
                          >
                            Next
                          </Button>
                        </Modal.Body>
                      )}
                    </>
                  ) : tabIndex === 7 ? (
                    <>
                      {" "}
                      {tabLoading ? (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          {" "}
                          <div
                            className="mt-5"
                            style={{
                              padding: "16px",
                              width: "81.5%",
                            }}
                          >
                            <div
                              style={{
                                width: "81.5%",
                                lineHeight: "36px",
                                fontWeight: "700",
                                fontSize: "31px",
                              }}
                            >
                              {"You're all set"}
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",

                                fontSize: "15px",
                                fontWeight: "400",
                              }}
                            >
                              {"You've successfully changed your password."}
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",

                                fontSize: "15px",
                                fontWeight: "400",
                              }}
                            >
                              Add an extra layer of security to your account
                              with{" "}
                              <span
                                style={{
                                  color: "rgb(29, 155, 240)",
                                }}
                              >
                                two-factor authentication
                              </span>
                              . Enable it in your settings to help make sure
                              that you, and only you, can access your account.
                            </div>
                          </div>
                          <Button
                            style={{
                              width: "81.5%",
                              height: "52px",
                            }}
                            onClick={() => {
                              handleLoginAfterForgotPasswordProcess();
                            }}
                            className="login-button mt-5"
                            variant="dark"
                          >
                            Continue to X
                          </Button>
                        </Modal.Body>
                      )}
                    </>
                  ) : tabIndex === 8 ? (
                    <>
                      {tabLoading ? (
                        <Modal.Body className="signin-modal-body-child-non-reactivate">
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <>
                          <Modal.Body
                            className="signin-modal-body-child-non-reactivate"
                            style={{
                              overflowY: "auto",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: "81.5%",
                                lineHeight: "36px",
                                fontWeight: "700",
                                fontSize: "31px",
                              }}
                            >
                              Find your Connectify account
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: "rgb(83, 100, 113)",
                                lineHeight: "20px",
                                width: "81.5%",
                                fontSize: "15px",
                                fontWeight: "400",
                              }}
                            >
                              Enter the email, or username associated with your
                              account to change your password.
                            </div>
                            <TextField
                              className="mt-4"
                              autoFocus={true}
                              value={loginInput.password}
                              onChange={(e) =>
                                setLoginInput((prevInfo) => ({
                                  ...prevInfo,
                                  password: e.target.value,
                                }))
                              }
                              type="text"
                              id="outlined-basic"
                              variant={"outlined"}
                              label={`Email, or username`}
                              style={{
                                width: "81.5%",
                                height: "58px",
                              }}
                              sx={{
                                "& .Mui-focused input + fieldset": {
                                  border: "2px solid #1d9bf0 !important",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#cfd9de !important",
                                },
                                "& .MuiInputLabel-shrink": {
                                  color: "#1f9cf0 !important",
                                },
                              }}
                            />

                            <Button
                              style={{
                                position: "absolute",
                                bottom: "20px",
                                width: "81.5%",
                                height: "52px",
                                opacity: findConnectifyAccount.length
                                  ? "1"
                                  : "0.5",
                              }}
                              onClick={() => handleFindConnectifyAccount()}
                              className="login-button mt-5"
                              variant="dark"
                            >
                              Log in
                            </Button>
                          </Modal.Body>
                        </>
                      )}
                    </>
                  ) : null}
                </Modal>
              )}
            </>
          ) : (
            <Modal
              show={isLoading}
              onHide={handleCloseLoginModal}
              size="lg"
              centered={true}
              className="signin-modal-parent-non-reactivate"
            >
              <Modal.Header
                className="signin-modal-header-child-non-reactivate"
                style={{
                  border: "none",
                }}
              >
                <div
                  onClick={handleCloseLoginModal}
                  className="close-button"
                  style={{
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    {/* close signin modal icon start to check  */}
                    <svg
                      style={{
                        border: "none",
                        fontSize: "15px",
                        margin: "5px",
                      }}
                      onClick={handleCloseLoginModal}
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
                    {/* close signin modal icon finish to check  */}
                  </div>
                </div>
              </Modal.Header>

              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              </Modal.Body>
            </Modal>
          )}
        </>
      )}
      {/* start to check tab for forgotpassword process INFO WILL DELETE */}
      {tabIndex === 10 && startForgotPasswordProcess ? (
        <>
          <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered={true}
            className="signin-modal-parent-non-reactivate"
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
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
                  {/* close signin modal icon start to check  */}
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
                  {/* close signin modal icon finish to check  */}
                </div>
              </div>
            </Modal.Header>

            {tabLoading ? (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              </Modal.Body>
            ) : (
              <>
                <Modal.Body className="signin-modal-body-child-non-reactivate">
                  <div
                    style={{
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        lineHeight: "36px",
                        fontWeight: "700",
                        fontSize: "31px",
                      }}
                    >
                      Find your Connectify account
                    </div>
                    <div
                      className="mt-2"
                      style={{
                        color: "rgb(83, 100, 113)",
                        lineHeight: "20px",

                        fontSize: "15px",
                        fontWeight: "400",
                      }}
                    >
                      Enter the email, or username associated with your account
                      to change your password.
                    </div>
                  </div>
                  <InputGroup
                    style={{
                      width: "440px",
                      height: "60px",
                    }}
                    className="mb-2 mt-5"
                  >
                    <Form.Control
                      style={{
                        boxShadow: "none",
                      }}
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      type="text"
                      placeholder="Email, or username"
                      value={findConnectifyAccount}
                      onChange={(e) => setFindConnectifyAccount(e.target.value)}
                    />
                  </InputGroup>{" "}
                  <Button
                    style={{
                      width: "81.5%",
                      height: "52px",
                      position: "absolute",
                      bottom: "20px",
                    }}
                    onClick={() => handleFindConnectifyAccount()}
                    className="login-button mt-5"
                    variant="dark"
                  >
                    Next
                  </Button>
                </Modal.Body>
              </>
            )}
          </Modal>
        </>
      ) : tabIndex === 20 && startForgotPasswordProcess ? (
        <>
          <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered={true}
            className="signin-modal-parent-non-reactivate"
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
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
                  {/* close signin modal icon start to check  */}
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
                  {/* close signin modal icon finish to check  */}
                </div>
              </div>
            </Modal.Header>

            {isWaitingForConfirmationCodeSendingProcess ? (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              </Modal.Body>
            ) : (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <div>
                  <div
                    style={{
                      lineHeight: "36px",
                      fontWeight: "700",
                      fontSize: "31px",
                    }}
                  >
                    Where should we send a confirmation code?
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      color: "rgb(83, 100, 113)",
                      lineHeight: "20px",

                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Before you can change your password, we need to make sure
                    it’s really you.
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      color: "rgb(83, 100, 113)",
                      lineHeight: "20px",

                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Start by choosing where to send a confirmation code.
                  </div>
                </div>

                <Stack direction="horizontal" className="mt-5">
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "700",
                    }}
                  >
                    Send an email to{" "}
                    {getMaskedEmail(forgotPasswordInProcessUser.email)}
                  </div>

                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                    className="hover-forgot-password-send-email-stack-svg-verified-email ms-auto"
                  >
                    <div
                      style={{
                        backgroundColor: "#1d9bf0                            ",
                        width: "20px",
                        height: "20px",
                        position: "relative",
                        left: "10px",
                        top: "10px",
                        borderRadius: "50%",
                      }}
                    >
                      <svg
                        style={{
                          position: "relative",
                          left: "2px",
                          bottom: "4px",
                        }}
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                        color="white"
                        fill="currentColor"
                      >
                        <g>
                          <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                        </g>
                      </svg>
                    </div>
                  </div>
                </Stack>
                <div
                  className="mt-4 connectify-support-forgot-password-screen"
                  style={{
                    textAlign: "left",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "400",
                    width: "100%",
                  }}
                >
                  Contact{" "}
                  <span
                    className="connectify-support-forgot-password-screen"
                    style={{
                      color: "rgb(29, 155, 240)",
                    }}
                  >
                    Connectify Support
                  </span>{" "}
                  if you don’t have access.
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "81.5%",
                    height: "52px",
                    position: "absolute",
                    bottom: "20px",
                  }}
                >
                  <Button
                    style={{
                      width: "440px",
                      height: "57px",
                    }}
                    onClick={() => handleSendForgotPasswordCodeToEmail()}
                    className="login-button mt-5 mb-3"
                    variant="dark"
                  >
                    Next
                  </Button>

                  <Button
                    className="cancel-btn-reactivate-tab"
                    style={{
                      width: "440px",
                      minHeight: "52px",
                      color: "black",
                    }}
                    // className="login-button"
                    variant="light"
                    onClick={() => {
                      setTabIndex(0);
                      handleClose();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Modal.Body>
            )}
          </Modal>
        </>
      ) : tabIndex === 30 && startForgotPasswordProcess ? (
        <>
          <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered={true}
            className="signin-modal-parent-non-reactivate"
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
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
                  {/* close signin modal icon start to check  */}
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
                  {/* close signin modal icon finish to check  */}
                </div>
              </div>
            </Modal.Header>

            {tabLoading ? (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              </Modal.Body>
            ) : (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <div>
                  <div
                    style={{
                      lineHeight: "36px",
                      fontWeight: "700",
                      fontSize: "31px",
                    }}
                  >
                    We sent you a code
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      color: "rgb(83, 100, 113)",
                      lineHeight: "20px",

                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Check your email to get your confirmation code. If you need
                    to request a new code, go back and reselect a confirmation.
                  </div>{" "}
                </div>
                <InputGroup
                  style={{
                    width: "440px",
                    height: "60px",
                  }}
                  className="mb-2 mt-5"
                >
                  <Form.Control
                    style={{
                      boxShadow: "none",
                    }}
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    type="text"
                    placeholder="Enter your code"
                    value={verificationCodeInput}
                    onChange={(e) => {
                      setVerificationCodeInput(e.target.value);
                    }}
                  />
                </InputGroup>{" "}
                {verificationCodeInput.length ? (
                  <Button
                    style={{
                      width: "81.5%",
                      height: "52px",
                      position: "absolute",
                      bottom: "20px",
                      color: "white",
                    }}
                    onClick={() => {
                      verificationCodeInput ===
                      receivedVerificationCodeForPasswordChange
                        ? handleTabChange()
                        : catchErrorMessage("Invalid verification code.");
                    }}
                    className="login-button"
                    variant="dark"
                  >
                    Next
                  </Button>
                ) : (
                  <>
                    <Button
                      className={"cancel-btn-reactivate-tab"}
                      style={{
                        width: "81.5%",
                        height: "52px",
                        position: "absolute",
                        bottom: "20px",
                        color: "black",
                      }}
                      // className="login-button"
                      variant={"light"}
                      onClick={() => setTabIndex(tabIndex - 1)}
                    >
                      Back
                    </Button>
                  </>
                )}
              </Modal.Body>
            )}
          </Modal>
        </>
      ) : tabIndex === 40 && startForgotPasswordProcess ? (
        <>
          <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered={true}
            className="signin-modal-parent-non-reactivate"
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
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
                  {/* close signin modal icon start to check  */}
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
                  {/* close signin modal icon finish to check  */}
                </div>
              </div>
            </Modal.Header>

            {tabLoading ? (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              </Modal.Body>
            ) : (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <>
                  <div
                    style={{
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        lineHeight: "36px",
                        fontWeight: "700",
                        fontSize: "31px",
                      }}
                    >
                      Choose a new password
                    </div>
                    <div
                      className="mt-2"
                      style={{
                        color: "rgb(83, 100, 113)",
                        lineHeight: "20px",

                        fontSize: "15px",
                        fontWeight: "400",
                      }}
                    >
                      Make sure your new password is 8 characters or more. Try
                      including numbers, letters, and punctuation marks for a{" "}
                      <span
                        style={{
                          color: "rgb(29, 155, 240)",
                        }}
                      >
                        strong password.
                      </span>
                    </div>
                    <div
                      className="mt-2"
                      style={{
                        color: "rgb(83, 100, 113)",
                        lineHeight: "20px",

                        fontSize: "15px",
                        fontWeight: "400",
                      }}
                    >
                      {
                        "You'll be logged out of all active Connectify sessions after your password is changed."
                      }
                    </div>
                  </div>
                  <InputGroup
                    style={{
                      width: "440px",
                      height: "60px",
                    }}
                    className="mb-2 mt-2"
                  >
                    <Form.Control
                      style={{
                        boxShadow: "none",
                      }}
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      type="password"
                      placeholder="Enter a new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPasswordForgotPasswordProcess(e.target.value)
                      }
                    />
                  </InputGroup>{" "}
                  <InputGroup
                    style={{
                      width: "440px",
                      height: "60px",
                    }}
                    className="mb-2 mt-2"
                  >
                    <Form.Control
                      style={{
                        boxShadow: "none",
                      }}
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setNewPasswordForgotPasswordProcessConfirm(
                          e.target.value
                        )
                      }
                    />
                  </InputGroup>{" "}
                  <Button
                    style={{
                      width: "81.5%",
                      height: "52px",
                      position: "absolute",
                      bottom: "20px",
                    }}
                    onClick={() => {
                      handleChangePassword();
                    }}
                    className="login-button mt-5"
                    variant="dark"
                  >
                    Change password
                  </Button>
                </>
              </Modal.Body>
            )}
          </Modal>
        </>
      ) : tabIndex === 50 && startForgotPasswordProcess ? (
        <>
          {" "}
          <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered={true}
            className="signin-modal-parent-non-reactivate"
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
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
                  {/* close signin modal icon start to check  */}
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
                  {/* close signin modal icon finish to check  */}
                </div>
              </div>
            </Modal.Header>
            {tabLoading ? (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              </Modal.Body>
            ) : (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                {" "}
                <div
                  style={{
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "36px",
                      fontWeight: "700",
                      fontSize: "31px",
                    }}
                  >
                    {"Why'd you change your password"}
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      color: "rgb(83, 100, 113)",
                      lineHeight: "20px",

                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Your feedback helps us understand when and why people need
                    to change their passwords.
                  </div>
                </div>
                <Stack direction="horizontal" className="mt-5">
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "700",
                    }}
                  >
                    I forgot my password
                  </div>

                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    className={
                      forgotMyPasswordChecked
                        ? "ms-auto hover-forgot-password-send-email-stack-svg-verified-email"
                        : "ms-auto hover-forgot-password-send-email-stack-svg-verified-email-variant-2"
                    }
                    onClick={() => {
                      setForgotMyPasswordChecked(!forgotMyPasswordChecked);
                      setSuspiciousActivityChecked(false);
                      setDifferentReason(false);
                      setCheckedValue(!forgotMyPasswordChecked);
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: forgotMyPasswordChecked
                          ? "#1d9bf0"
                          : "transparent",
                        border: forgotMyPasswordChecked
                          ? "none"
                          : "1px solid black",
                        width: "20px",
                        height: "20px",
                        position: "relative",
                        left: "10px",
                        top: "10px",
                        borderRadius: "50%",
                      }}
                    >
                      <svg
                        style={{
                          position: "relative",
                          left: "2px",
                          bottom: "4px",
                          display: forgotMyPasswordChecked ? "initial" : "none",
                        }}
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                        color="white"
                        fill="currentColor"
                      >
                        <g>
                          <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                        </g>
                      </svg>
                    </div>
                  </div>
                </Stack>
                <Stack direction="horizontal" className="mt-2">
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "700",
                    }}
                  >
                    There was suspicious activity on my account
                  </div>

                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    className={
                      suspiciousActivity
                        ? "ms-auto hover-forgot-password-send-email-stack-svg-verified-email"
                        : "ms-auto hover-forgot-password-send-email-stack-svg-verified-email-variant-2"
                    }
                    onClick={() => {
                      setSuspiciousActivityChecked(!suspiciousActivity);
                      setForgotMyPasswordChecked(false);
                      setDifferentReason(false);
                      setCheckedValue(!suspiciousActivity);
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: suspiciousActivity
                          ? "#1d9bf0"
                          : "transparent",
                        border: suspiciousActivity ? "none" : "1px solid black",
                        width: "20px",
                        height: "20px",
                        position: "relative",
                        left: "10px",
                        top: "10px",
                        borderRadius: "50%",
                      }}
                    >
                      <svg
                        style={{
                          position: "relative",
                          left: "2px",
                          bottom: "4px",
                          display: suspiciousActivity ? "initial" : "none",
                        }}
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                        color="white"
                        fill="currentColor"
                      >
                        <g>
                          <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                        </g>
                      </svg>
                    </div>
                  </div>
                </Stack>
                <Stack direction="horizontal" className="mt-2">
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "700",
                    }}
                  >
                    I changed my password for a different reason
                  </div>

                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    className={
                      differentReason
                        ? "ms-auto hover-forgot-password-send-email-stack-svg-verified-email"
                        : "ms-auto hover-forgot-password-send-email-stack-svg-verified-email-variant-2"
                    }
                    onClick={() => {
                      setDifferentReason(!differentReason);
                      setSuspiciousActivityChecked(false);
                      setForgotMyPasswordChecked(false);
                      setCheckedValue(!differentReason);
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: differentReason
                          ? "#1d9bf0"
                          : "transparent",
                        border: differentReason ? "none" : "1px solid black",
                        width: "20px",
                        height: "20px",
                        position: "relative",
                        left: "10px",
                        top: "10px",
                        borderRadius: "50%",
                      }}
                    >
                      <svg
                        style={{
                          position: "relative",
                          left: "2px",
                          bottom: "4px",
                          display: differentReason ? "initial" : "none",
                        }}
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                        color="white"
                        fill="currentColor"
                      >
                        <g>
                          <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                        </g>
                      </svg>
                    </div>
                  </div>
                </Stack>
                <Button
                  style={{
                    width: "81.5%",
                    height: "52px",
                    position: "absolute",
                    bottom: "20px",
                    opacity: checkedValue ? "" : 0.5,
                  }}
                  onClick={() => {
                    setTabLoading(true);
                    setTimeout(() => {
                      setTabLoading(false);
                      checkedValue ? setTabIndex(tabIndex + 1) : null;
                    }, 500);
                  }}
                  className="login-button mt-5"
                  variant="dark"
                >
                  Next
                </Button>
              </Modal.Body>
            )}
          </Modal>
        </>
      ) : tabIndex === 60 && startForgotPasswordProcess ? (
        <>
          {" "}
          <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered={true}
            className="signin-modal-parent-non-reactivate"
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
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
                  {/* close signin modal icon start to check  */}
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
                  {/* close signin modal icon finish to check  */}
                </div>
              </div>
            </Modal.Header>

            {tabLoading ? (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              </Modal.Body>
            ) : (
              <Modal.Body className="signin-modal-body-child-non-reactivate">
                {" "}
                <div
                  style={{
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "36px",
                      fontWeight: "700",
                      fontSize: "31px",
                    }}
                  >
                    {"You're all set"}
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      color: "rgb(83, 100, 113)",
                      lineHeight: "20px",

                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    {"You've successfully changed your password."}
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      color: "rgb(83, 100, 113)",
                      lineHeight: "20px",

                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Add an extra layer of security to your account with{" "}
                    <span
                      style={{
                        color: "rgb(29, 155, 240)",
                      }}
                    >
                      two-factor authentication
                    </span>
                    . Enable it in your settings to help make sure that you, and
                    only you, can access your account.
                  </div>
                </div>
                <Button
                  style={{
                    width: "440px",
                    height: "52px",
                  }}
                  onClick={() => {
                    handleLoginAfterForgotPasswordProcess();
                  }}
                  className="login-button mt-5"
                  variant="dark"
                >
                  Continue to X
                </Button>
              </Modal.Body>
            )}
          </Modal>
        </>
      ) : null}
      {/* finish to check tab for forgotpassword process INFO WILL DELETE */}
    </>
  );
}

function CommentModal({
  post,
  width,
  height,
  refreshPosts,
  isImagePostDetail,
  setLoadingTrue,
  setLoadingFalse,
  postSharedMessage,
}) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");
  const [showSecondModal, setShowSecondModal] = useState(false);

  const { userInfo, socket } = useContext(UserContext);
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
  const closeImage = () => {
    setModalImage("");
  };

  const handleMouseOver = (e) => {
    const shallowCopy = e.target.classList[0];
    if (shallowCopy === "target") {
      e.target.style.background = "#595b5b";
    }
  };

  const handleMouseOut = (e) => {
    const shallowCopy = e.target.classList[0];
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
    axios
      .post(`${API_URL}/comment`, {
        userId: userInfo._id,
        postId,
        commentPost: content,
        modalImage,
      })
      .then((response) => {
        handleClose();
        setModalImage("");
        setContent("");
        if (setLoadingTrue) {
          setLoadingTrue();
        }
        setTimeout(() => {
          handleNotification(post, userInfo, "comment");
          if (setLoadingFalse) {
            setLoadingFalse();
          }
          refreshPosts();
          postSharedMessage(
            response.data.createdPost.authorUserName,
            response.data.createdPost._id
          );
        }, 1200);
      })
      .catch((error) => {
        console.log("Error message =>", error);

        if (error.response.data) {
          const { errorMessage } = error.response.data;
          setError(errorMessage);
        } else {
          setError(error);
        }
      });
  };

  const onEmojiClick = (emojiObject) => {
    const sym = emojiObject.unified.split("_");
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);

    setChosenEmoji(emoji);
    setContent((prevText) => prevText + emoji);
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
                          style={{
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          fill="rgb(83, 100, 113)"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                          style={{
                            borderRadius: "50%",
                          }}
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
                          style={{
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          fill="rgb(83, 100, 113)"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                          style={{
                            borderRadius: "50%",
                          }}
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

        <Modal.Footer style={{ border: "none" }} className="ml-1">
          <Stack direction="horizontal" gap={0}>
            {/* INFO */}

            {/* comment modal svg start to check  */}
            <div
              className="p-2 image-choose-p-2"
              onClick={() => {
                document.getElementById("formuploadModal").click();
              }}
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
            {/* comment modal svg finish to check  */}

            {/* emoji mart start to check */}
            <div className="p-2">
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
                  style={{
                    border: "none",
                  }}
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
                  style={{
                    border: "none",
                  }}
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

export { SigninModal, CommentModal };
