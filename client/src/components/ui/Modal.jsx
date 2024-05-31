import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Button, Modal, Container, Row, Col, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
{
}
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "../../index.css";

import dataEmojiMartPicker from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { Divider } from "antd";
import LoadingSpinner from "./LoadingSpinner";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
  TextField,
} from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
import io from "socket.io-client";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import BootstrapTooltip from "../BootstrapToolTip/BootstrapToolTip";
const socket = io.connect(`${API_URL}`);
function SigninModal({ deactivatedScreen, widthSmaller700 }) {
  const [{ theme, themeName }] = useContext(ThemeContext);

  const googleAuth = () => {
    window.open(`${API_URL}/auth/google/callback`, "_self");
  };
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const { showCustomMessage, contextHolder } = useAntdMessageHandler();

  const handleClose = () => {
    setTabIndex(0);
    setShow(false);
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

  const { width } = useWindowDimensions();

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
          }, 500);
        }
      })
      .catch((err) => {
        console.log("Error is running right now !", err);
        if (err) {
          if (err.response.status === 400) {
            showCustomMessage("Sorry, we could not find your account.", 4);
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
        console.log("Response user logged in =>", response);
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
            window.location.href = "http://localhost:5173/home";
          }, 600);
        }
      })
      .catch((error) => {
        console.log("Error =>", error);
        if (error.response.status === 501) {
          showCustomMessage("Wrong password!", 4);
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
        window.alert("Deactivated user return login !!!");
        setIsLoading(true);
        setTimeout(() => {
          navigate("/home");
          window.location.href = "http://localhost:5173/home";
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

    return maskedUsername + "@" + maskedDomain + "." + maskedDot;
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
        showCustomMessage("Sorry, we could not find your account.", 4);
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
    setTabLoading(true);
    // setIsWaitingForConfirmationCodeSendingProcess(true);
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

        setTimeout(() => {
          // setIsWaitingForConfirmationCodeSendingProcess(false);
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

  const [validPassword, setValidPassword] = useState(null);

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
    if (
      confirmPassword !== newPassword ||
      newPassword !== confirmPassword ||
      (!regex.test(confirmPassword) && confirmPassword.length) ||
      (!regex.test(newPassword) && newPassword.length)
    ) {
      setValidPassword(false);
    } else {
      seterrorMessageForFirstInput("");
      seterrorMessageForSecondInput("");
      setValidPassword(true);
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
    if (validPassword) {
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
    }
  };

  const [forgotMyPasswordChecked, setForgotMyPasswordChecked] = useState(false);

  const [suspiciousActivity, setSuspiciousActivityChecked] = useState(false);

  const [differentReason, setDifferentReason] = useState(false);

  const handleLoginAfterForgotPasswordProcess = () => {
    console.log("Trying to log in !");
    setTabLoading(true);
    axios
      .post(`${API_URL}/login-after-forgot-password-process`, {
        newPassword,
        user: forgotPasswordInProcessUser,
      })
      .then((response) => {
        const { token, user } = response.data;
        window.alert("After forgot password process user return login !!!");

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("token", token);

        updateUser(user);

        console.log("Response =>", response);

        setTimeout(() => {
          navigate("/home");
          window.location.href = "http://localhost:5173/home";
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
          showCustomMessage("Incorrect. Please try again.", 4);
        }
      });
  };

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|proton|zoho|mail|aol|yandex)\.(com|org|net|gov|edu|mil|co|info|de|co.uk|ca|me|tr|com.tr)$/;

  return (
    <>
      {contextHolder}
      {deactivatedScreen ? (
        <>
          <Button
            className="deactivated-footer-login"
            style={{
              cursor: "pointer",
              maxWidth: widthSmaller700 ? "200px" : "76px",
              maxHeight: "36px",
              textAlign: "center",
              border: "1px solid rgb(185, 202, 211)",
              borderRadius: "9999px",
              lineHeight: "20px",
              fontSize: "15px",
              fontWeight: "700",
              backgroundColor: "rgba(29,155,240,1.00)",
              // padding: "5px",
              // paddingLeft: "16px",
              // paddingRight: "16px",
              // backgroundColor: "yellow",
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
                Already have an account?
              </span>
            </p>
            <Button
              variant="light"
              onClick={handleShowLoginModal}
              className={`sign-in sign-in-${themeName}`}
              style={{
                color: "rgb(29, 155, 240)",
                border:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
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
                  margin: "0px",
                  padding: "0px",
                }}
                dialogClassName={"modal-fullscreen"}
                contentClassName={
                  themeName === "dark-theme"
                    ? "dark-theme-reactivate-account-modal"
                    : "reactivate-account-modal"
                }
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
                    className={`close-button close-button-${themeName}`}
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
                        color={
                          themeName === "dark-theme" ? "white" : `rgb(15,20,25)`
                        }
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
                  <Modal.Body
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "400px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          fontWeight: "800",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Reactivate your account?
                      </div>
                      <div
                        style={{
                          marginTop: "5px",
                          color:
                            themeName === "dark-theme"
                              ? "#71767A                                  "
                              : "rgb(83, 100, 113)",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >{`You deactivated your account on ${userdeactivateddate}.On ${userdeletiondate}, it will no longer be possible for you to restore your Connectify account if it was accidentally or wrongfully deactivated. By clicking "Yes, reactivate", you will halt the deactivation process and reactivate your account.`}</div>
                    </div>
                    <Button
                      style={{
                        minHeight: "52px",
                        width: "400px",
                        color: themeName === "dark-theme" ? "black" : "white",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                      }}
                      className={`login-button mt-5 next-btn ${themeName}-white-btn`}
                      // variant="dark"
                      onClick={handleDeactivatedUserReturnLogin}
                    >
                      Yes, reactivate
                    </Button>
                    <Button
                      className={`mt-3 forgot-password-btn ${themeName}-black-btn`}
                      style={{
                        minHeight: "52px",

                        width: "400px",
                        color: themeName === "dark-theme" ? "white" : "black",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "white",
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
                style={{
                  margin: "0px",
                  padding: "0px",
                }}
                backdropClassName={
                  themeName === "dark-theme" ? `back-drop-${themeName}` : ""
                }
                centered={true}
                contentClassName={
                  themeName === "dark-theme"
                    ? "dark-theme-reactivate-account-modal"
                    : "reactivate-account-modal"
                }
                className="signin-modal-parent-non-reactivate"
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
                    className={`close-button close-button-${themeName}`}
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
                        color={
                          themeName === "dark-theme" ? "white" : `rgb(15,20,25)`
                        }
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
                  <Modal.Body
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "400px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          fontWeight: "800",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Reactivate your account?
                      </div>
                      <div
                        style={{
                          marginTop: "5px",
                          color:
                            themeName === "dark-theme"
                              ? "#71767A                                  "
                              : "rgb(83, 100, 113)",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                          textAlign: "left",
                        }}
                      >{`You deactivated your account on ${userdeactivateddate}.On ${userdeletiondate}, it will no longer be possible for you to restore your Connectify account if it was accidentally or wrongfully deactivated. By clicking "Yes, reactivate", you will halt the deactivation process and reactivate your account.`}</div>
                    </div>

                    <Button
                      style={{
                        minHeight: "52px",
                        width: "400px",
                        color: themeName === "dark-theme" ? "black" : "white",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                      }}
                      className={`login-button mt-5 next-btn ${themeName}-white-btn`}
                      // variant="dark"
                      onClick={handleDeactivatedUserReturnLogin}
                    >
                      Yes, reactivate
                    </Button>
                    <Button
                      className={`mt-3 forgot-password-btn ${themeName}-black-btn`}
                      style={{
                        minHeight: "52px",

                        width: "400px",
                        color: themeName === "dark-theme" ? "white" : "black",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "white",
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
                      margin: "0px",
                      padding: "0px",
                    }}
                    contentClassName={
                      themeName === "dark-theme" ? "dark-theme-sub-modal" : ""
                    }
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
                        className={`close-button close-button-${themeName}`}
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
                            color={
                              themeName === "dark-theme"
                                ? "white"
                                : "rgb(15,20,25)"
                            }
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
                          <Modal.Body
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
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
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",

                                height: "100%",
                                justifyContent: "center",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                    fontSize: "31px",
                                    fontWeight: "700",
                                    lineHeight: "36px",
                                    letterSpacing: "0.5px",
                                  }}
                                  className="sign-in-header mb-4"
                                >
                                  Sign in to C
                                </div>
                                <Button
                                  // onClick={googleAuth}
                                  style={{
                                    backgroundColor:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "transparent",
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
                                      <path
                                        fill="none"
                                        d="M0 0h48v48H0z"
                                      ></path>
                                    </g>
                                  </svg>
                                </Button>
                              </div>
                              <Divider
                                className={`theme-divider-${themeName}`}
                                style={{
                                  width: "300px",
                                  minWidth: "300px",
                                  margin: "5px",
                                }}
                                plain
                              >
                                <span
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  or
                                </span>
                              </Divider>
                              <TextField
                                autoFocus
                                className="mt-2"
                                id="outlined-basic"
                                label="Email, or username"
                                variant="outlined"
                                value={loginInput.usernameOrEmail}
                                type="text"
                                onChange={(e) => {
                                  setFindConnectifyAccount(e.target.value);
                                  setLoginInput((prevInfo) => ({
                                    ...prevInfo,
                                    usernameOrEmail: e.target.value,
                                  }));
                                }}
                                style={{
                                  width: "300px",
                                  height: "58px",
                                }}
                                InputProps={{
                                  style: {
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  },
                                }}
                                InputLabelProps={{
                                  style: {
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767B"
                                        : "",
                                  },
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor:
                                      themeName === "dark-theme"
                                        ? "rgb(70, 70, 70)"
                                        : "#cfd9de !important",
                                    border:
                                      themeName === "dark-theme"
                                        ? "1px solid rgb(70, 70, 70) !important"
                                        : "",
                                  },
                                  "& .Mui-focused input + fieldset": {
                                    border: "2px solid #1d9bf0 !important",
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
                                className={`login-button mt-4 next-btn ${themeName}-white-btn`}
                                variant="dark"
                                onClick={handleLoginVariantOneStartProcess}
                              >
                                Next
                              </Button>
                              <Button
                                style={{
                                  width: "300px",
                                  height: "36px",
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                  fontSize: "15px",
                                  fontWeight: "700",
                                  lineHeight: "20px",
                                }}
                                className={`mt-4 forgot-password-btn ${themeName}-black-btn`}
                                variant="light"
                                onClick={() => {
                                  setTabLoading(true);
                                  setTimeout(() => {
                                    setStartForgotPasswordProcess(true);
                                    setTabIndex(tabIndex + 1);
                                    setShow(true);
                                    setTabLoading(false);
                                  }, 500);
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
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A                                  "
                                        : "rgb(83, 100, 113)",
                                    fontSize: "15px",
                                    lineHeight: "20px",
                                    fontWeight: "400",
                                    marginLeft: "5px",
                                  }}
                                  className="grid-item mt-5"
                                >
                                  <span>
                                    Don&apos;t have an account?{" "}
                                    <span
                                      className="hover-blue-underline"
                                      onClick={handleCloseLoginModal}
                                      style={{
                                        cursor: "pointer",
                                        color: "#1C9BEF",
                                      }}
                                    >
                                      Sign up
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Modal.Body>
                        )}
                      </>
                    ) : tabIndex === 1 ? (
                      <>
                        {tabLoading ? (
                          <Modal.Body
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <>
                            <Modal.Body
                              className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
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
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                Find your Caccount
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A                                  "
                                      : "rgb(83, 100, 113)",
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
                                InputLabelProps={{
                                  style: {
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767B"
                                        : "",
                                  },
                                }}
                                InputProps={{
                                  style: {
                                    color:
                                      themeName === "dark-theme" ? "white" : "",
                                  },
                                }}
                                sx={{
                                  color: "yellow",
                                  "& .Mui-focused input + fieldset": {
                                    border: "2px solid #1d9bf0 !important",
                                  },
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor:
                                      themeName === "dark-theme"
                                        ? "rgb(70, 70, 70)"
                                        : "#cfd9de !important",
                                    border:
                                      themeName === "dark-theme"
                                        ? "1px solid rgb(70, 70, 70) !important"
                                        : "",
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
                                className={`login-button mt-5 ${themeName}-white-btn`}
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
                          <Modal.Body
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <>
                            {/* start to check confirm username */}
                            <Modal.Body
                              className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
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
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                Confirm your username
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A                                  "
                                      : "rgb(83, 100, 113)",
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
                                InputLabelProps={{
                                  style: {
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767B"
                                        : "",
                                  },
                                }}
                                InputProps={{
                                  style: {
                                    color:
                                      themeName === "dark-theme" ? "white" : "",
                                  },
                                }}
                                sx={{
                                  "& .Mui-focused input + fieldset": {
                                    border: "2px solid #1d9bf0 !important",
                                  },
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor:
                                      themeName === "dark-theme"
                                        ? "rgb(70, 70, 70)"
                                        : "#cfd9de !important",
                                    border:
                                      themeName === "dark-theme"
                                        ? "1px solid rgb(70, 70, 70) !important"
                                        : "",
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
                                className={`login-button mt-5 ${themeName}-white-btn`}
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
                          <Modal.Body
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              Where should we send a confirmation code?
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A                                  "
                                    : "rgb(83, 100, 113)",
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
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A                                  "
                                    : "rgb(83, 100, 113)",
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
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
                                className={
                                  themeName === "dark-theme"
                                    ? "hover-background-effect-clicked-dark-theme"
                                    : themeName !== "dark-theme"
                                    ? "hover-background-effect-clicked-light-theme"
                                    : null
                                }
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
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
                                width: "90%",
                                height: "52px",
                              }}
                              onClick={() =>
                                handleSendForgotPasswordCodeToEmail()
                              }
                              className={`login-button mt-5 mb-3 ${themeName}-white-btn`}
                              variant="dark"
                            >
                              Next
                            </Button>

                            <Button
                              className={`cancel-btn-reactivate-tab ${themeName}-black-btn`}
                              style={{
                                position: "absolute",
                                bottom: "20px",
                                height: "52px",
                                width: "90%",
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
                          <Modal.Body
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
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
                            className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              We sent you a code
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A                                  "
                                    : "rgb(83, 100, 113)",
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
                              InputProps={{
                                style: {
                                  color:
                                    themeName === "dark-theme" ? "white" : "",
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  color:
                                    themeName === "dark-theme" ? "#71767B" : "",
                                },
                              }}
                              sx={{
                                "& .Mui-focused input + fieldset": {
                                  border: "2px solid #1d9bf0 !important",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    themeName === "dark-theme"
                                      ? "rgb(70, 70, 70)"
                                      : "#cfd9de !important",
                                  border:
                                    themeName === "dark-theme"
                                      ? "1px solid rgb(70, 70, 70) !important"
                                      : "",
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
                                  width: "90%",
                                  minHeight: "52px",
                                  color: "white",
                                }}
                                onClick={() => {
                                  verificationCodeInput ===
                                  receivedVerificationCodeForPasswordChange
                                    ? handleTabChange()
                                    : showCustomMessage(
                                        "Invalid verification code.",
                                        4
                                      );
                                }}
                                className={`login-button ${themeName}-white-btn`}
                                variant="dark"
                              >
                                Next
                              </Button>
                            ) : (
                              <>
                                <Button
                                  className={`cancel-btn-reactivate-tab ${themeName}-black-btn`}
                                  style={{
                                    position: "absolute",
                                    bottom: "20px",
                                    width: "90%",
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
                          <Modal.Body
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
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
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                Choose a new password
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A                                  "
                                      : "rgb(83, 100, 113)",
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
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A                                  "
                                      : "rgb(83, 100, 113)",
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
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767B"
                                        : "",
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
                                  inputProps={{
                                    style: {
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "",
                                    },
                                  }}
                                  autoFocus
                                  sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      borderColor: errorMessageForFirstInput
                                        ? "rgb(244, 33, 46)!important"
                                        : themeName === "dark-theme"
                                        ? "rgb(70, 70, 70)"
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
                                          color={
                                            themeName === "dark-theme"
                                              ? "white"
                                              : `rgb(15, 20, 25)`
                                          }
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
                                          color={
                                            themeName === "dark-theme"
                                              ? "white"
                                              : `rgb(15, 20, 25)`
                                          }
                                          fill="currentColor"
                                          onClick={handleClickShowPassword}
                                          onMouseDown={handleMouseDownPassword}
                                          style={{
                                            cursor: "pointer",
                                          }}
                                          width={22}
                                          height={22}
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
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767B"
                                        : "",
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
                                  inputProps={{
                                    style: {
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "",
                                    },
                                  }}
                                  sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      borderColor: errorMessageForSecondInput
                                        ? "rgb(244, 33, 46)!important"
                                        : themeName === "dark-theme"
                                        ? "rgb(70, 70, 70)"
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
                                          color={
                                            themeName === "dark-theme"
                                              ? "white"
                                              : `rgb(15, 20, 25)`
                                          }
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
                                          color={
                                            themeName === "dark-theme"
                                              ? "white"
                                              : `rgb(15, 20, 25)`
                                          }
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
                                  width: "90%",
                                  height: "52px",
                                  position: "absolute",
                                  bottom: "20px",
                                  opacity: validPassword ? "1" : "0.5",
                                }}
                                onClick={
                                  validPassword
                                    ? () => {
                                        handleChangePassword();
                                      }
                                    : ""
                                }
                                className={`login-button mt-5 ${themeName}-white-btn`}
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
                          <Modal.Body
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              {"Why'd you change your password"}
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                lineHeight: "20px",
                                width: "81.5%",
                                fontSize: "15px",
                                fontWeight: "400",
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",
                              }}
                            >
                              Your feedback helps us understand when and why
                              people need to change their passwords.
                            </div>
                            <div
                              className={`mt-5 scrollbar-add scrollbar-add-${themeName}`}
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
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
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
                                  themeName === "dark-theme" &&
                                  forgotMyPasswordChecked
                                    ? "hover-background-effect-clicked-dark-theme ms-auto"
                                    : themeName !== "dark-theme" &&
                                      forgotMyPasswordChecked
                                    ? "hover-background-effect-clicked-light-theme ms-auto"
                                    : themeName === "dark-theme" &&
                                      !forgotMyPasswordChecked
                                    ? "hover-background-effect-dark-theme ms-auto"
                                    : themeName !== "dark-theme" &&
                                      !forgotMyPasswordChecked
                                    ? "hover-background-effect-light-theme ms-auto"
                                    : ""
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
                                      : themeName !== "dark-theme"
                                      ? "2px solid #71767A"
                                      : "2px solid rgb(70, 70, 70)",
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
                              className={`mt-3 scrollbar-add scrollbar-add-${themeName}`}
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
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
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
                                  themeName === "dark-theme" &&
                                  suspiciousActivity
                                    ? "hover-background-effect-clicked-dark-theme ms-auto"
                                    : themeName !== "dark-theme" &&
                                      suspiciousActivity
                                    ? "hover-background-effect-clicked-light-theme ms-auto"
                                    : themeName === "dark-theme" &&
                                      !suspiciousActivity
                                    ? "hover-background-effect-dark-theme ms-auto"
                                    : themeName !== "dark-theme" &&
                                      !suspiciousActivity
                                    ? "hover-background-effect-light-theme ms-auto"
                                    : ""
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
                                      : themeName !== "dark-theme"
                                      ? "2px solid #71767A"
                                      : "2px solid rgb(70, 70, 70)",
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
                              className={`mt-3 scrollbar-add scrollbar-add-${themeName}`}
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
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
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
                                  themeName === "dark-theme" && differentReason
                                    ? "hover-background-effect-clicked-dark-theme ms-auto"
                                    : themeName !== "dark-theme" &&
                                      differentReason
                                    ? "hover-background-effect-clicked-light-theme ms-auto"
                                    : themeName === "dark-theme" &&
                                      !differentReason
                                    ? "hover-background-effect-dark-theme ms-auto"
                                    : themeName !== "dark-theme" &&
                                      !differentReason
                                    ? "hover-background-effect-light-theme ms-auto"
                                    : ""
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
                                      : themeName !== "dark-theme"
                                      ? "2px solid #71767A"
                                      : "2px solid rgb(70, 70, 70)",
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
                              className={`login-button mt-5 ${themeName}-white-btn`}
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
                          <Modal.Body
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <Modal.Body className="signin-modal-body-child-non-reactivate">
                            {" "}
                            <div
                              style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                className="mb-5"
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
                                    color:
                                      themeName === "dark-theme" ? "white" : "",
                                  }}
                                >
                                  {"You're all set"}
                                </div>
                                <div
                                  className="mt-2"
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
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
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
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
                                  that you, and only you, can access your
                                  account.
                                </div>
                                <Button
                                  style={{
                                    width: "100%",
                                    height: "52px",
                                  }}
                                  onClick={() => {
                                    handleLoginAfterForgotPasswordProcess();
                                  }}
                                  className={`login-button mt-5 ${themeName}-white-btn`}
                                  variant="dark"
                                >
                                  Continue to C
                                </Button>
                              </div>
                            </div>
                          </Modal.Body>
                        )}
                      </>
                    ) : tabIndex === 8 ? (
                      <>
                        <>
                          {tabLoading ? (
                            <Modal.Body
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                              }}
                              className="signin-modal-body-child-non-reactivate"
                            >
                              <LoadingSpinner
                                strokeColor={"rgb(29, 155, 240)"}
                              ></LoadingSpinner>
                            </Modal.Body>
                          ) : (
                            <>
                              <Modal.Body
                                className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName} mt-4`}
                                style={{
                                  overflowY: "auto",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
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
                                  className="mt-4"
                                  style={{
                                    width: "81.5%",
                                  }}
                                >
                                  <TextField
                                    style={{
                                      width: "100%",
                                      height: "60px",
                                    }}
                                    disabled
                                    id="filled-disabled"
                                    label={
                                      <div
                                        style={{
                                          flexDirection: "column",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontSize: "13px",
                                            position: "relative",
                                            bottom: "5px",
                                            color:
                                              themeName === "dark-theme"
                                                ? "#3C3F41"
                                                : "",
                                          }}
                                        >
                                          {loginInput.usernameOrEmail.match(
                                            emailRegex
                                          )
                                            ? `Email`
                                            : `Username`}
                                        </div>
                                        <div
                                          style={{
                                            position: "relative",
                                            bottom: "5px",
                                            color:
                                              themeName === "dark-theme"
                                                ? "#3C3F41"
                                                : "#999A9B",
                                          }}
                                        >
                                          {loginInput.usernameOrEmail.match(
                                            emailRegex
                                          )
                                            ? `${loginInput.usernameOrEmail}`
                                            : `@${loginInput.usernameOrEmail}`}
                                        </div>
                                      </div>
                                    }
                                    variant="filled"
                                    InputProps={{
                                      disableUnderline: true,
                                    }}
                                    InputLabelProps={{
                                      style: {
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767B"
                                            : "",
                                      },
                                    }}
                                    sx={{
                                      "& .MuiFilledInput-root": {
                                        background:
                                          themeName === "dark-theme"
                                            ? "#0D0E11 !important"
                                            : "#f7f9fa !important",
                                        height: "60px",
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
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "",
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
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "black",
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor:
                                          themeName === "dark-theme"
                                            ? "rgb(70, 70, 70)"
                                            : "#cfd9de !important",
                                        border:
                                          themeName === "dark-theme"
                                            ? "1px solid rgb(70, 70, 70) !important"
                                            : "",
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
                                            color={
                                              themeName === "dark-theme"
                                                ? "white"
                                                : `rgb(15, 20, 25)`
                                            }
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
                                            color={
                                              themeName === "dark-theme"
                                                ? "white"
                                                : `rgb(15, 20, 25)`
                                            }
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
                                  onClick={() => {
                                    setTabLoading(true);
                                    setTimeout(() => {
                                      setStartForgotPasswordProcess(true);
                                      setTabIndex(1);
                                      setShow(true);
                                      setTabLoading(false);
                                    }, 500);
                                  }}
                                  style={{
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
                                  <span
                                    className="forgot-password-login-variant-one-screen"
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    Forgot password?
                                  </span>
                                </div>

                                <Button
                                  style={{
                                    position: "absolute",
                                    bottom: "60px",
                                    width: "90%",
                                    height: "52px",
                                    opacity: loginInput.password.length
                                      ? "1"
                                      : "0.5",
                                  }}
                                  onClick={() => handleLoginVariantOneStep2()}
                                  className={`login-button mt-5 ${themeName}-white-btn`}
                                  variant="dark"
                                >
                                  Log in
                                </Button>
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "15px",
                                    width: "90%",
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    lineHeight: "20px",
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A                                  "
                                        : "rgb(83, 100, 113)",
                                    // height: "52px",
                                  }}
                                >
                                  <span>
                                    Don&apos;t have an account?{" "}
                                    <span
                                      className="hover-blue-underline"
                                      onClick={handleCloseLoginModal}
                                      style={{
                                        cursor: "pointer",
                                        color: "#1C9BEF",
                                      }}
                                    >
                                      Sign up
                                    </span>
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
                  style={{
                    padding: 0,
                    margin: 0,
                  }}
                  backdropClassName={
                    themeName === "dark-theme" ? `back-drop-${themeName}` : ""
                  }
                  contentClassName={
                    themeName === "dark-theme"
                      ? "dark-theme-modal"
                      : "light-theme-modal"
                  }
                  show={showLoginModal}
                  onHide={handleCloseLoginModal}
                  size="lg"
                  centered={true}
                  className={
                    tabIndex > 0 && tabIndex !== 8 && themeName === "dark-theme"
                      ? "forgot-password-modal-opened-dark-theme signin-modal-parent-non-reactivate"
                      : tabIndex > 0 &&
                        tabIndex !== 8 &&
                        themeName === "light-theme"
                      ? `forgot-password-modal-opened signin-modal-parent-non-reactivate`
                      : "signin-modal-parent-non-reactivate"
                  }
                >
                  <Modal.Header
                    className="signin-modal-header-child-non-reactivate"
                    style={{
                      border: "none",
                    }}
                  >
                    <div
                      onClick={handleCloseLoginModal}
                      className={`close-button close-button-${themeName}`}
                      style={{
                        borderRadius: "50%",
                        cursor: "pointer",
                        visibility: tabLoading ? "hidden" : "initial",
                      }}
                    >
                      <div>
                        {/* close signin modal icon start to check  */}
                        <svg
                          style={{
                            border: "none",
                            fontSize: "15px",
                            margin: "5px",
                            display: tabIndex === 7 ? "none" : "",
                          }}
                          onClick={handleCloseLoginModal}
                          width={20}
                          height={20}
                          color={
                            themeName === "dark-theme"
                              ? "white"
                              : `rgb(15,20,25)`
                          }
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
                        <Modal.Body
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
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
                          <div>
                            <div
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                                fontSize: "31px",
                                fontWeight: "700",
                                lineHeight: "36px",
                                letterSpacing: "0.5px",
                              }}
                              className="sign-in-header mt-4 mb-4"
                            >
                              Sign in to C
                            </div>
                            <Button
                              // onClick={googleAuth}
                              style={{
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "transparent",
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
                            className={`theme-divider-${themeName}`}
                            style={{
                              width: "300px",
                              minWidth: "300px",
                              margin: "5px",
                            }}
                            plain
                          >
                            <span
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              or
                            </span>
                          </Divider>
                          <TextField
                            autoFocus
                            className="mt-1"
                            id="outlined-basic"
                            label="Email, or username"
                            variant="outlined"
                            value={loginInput.usernameOrEmail}
                            type="text"
                            onChange={(e) => {
                              setFindConnectifyAccount(e.target.value);
                              setLoginInput((prevInfo) => ({
                                ...prevInfo,
                                usernameOrEmail: e.target.value,
                              }));
                            }}
                            style={{
                              width: "300px",
                              height: "58px",
                            }}
                            InputProps={{
                              style: {
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              },
                            }}
                            InputLabelProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "#71767B" : "",
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  themeName === "dark-theme"
                                    ? "rgb(70, 70, 70)"
                                    : "#cfd9de !important",
                                border:
                                  themeName === "dark-theme"
                                    ? "1px solid rgb(70, 70, 70) !important"
                                    : "",
                              },
                              "& .Mui-focused input + fieldset": {
                                border: "2px solid #1d9bf0 !important",
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
                              maxHeight: "36px",
                              fontSize: "15px",
                              fontWeight: "700",
                              lineHeight: "20px",
                            }}
                            className={`login-button mt-4 next-btn ${themeName}-white-btn`}
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
                              maxHeight: "36px",
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                              fontSize: "15px",
                              fontWeight: "700",
                              lineHeight: "20px",
                            }}
                            className={`mt-4 forgot-password-btn ${themeName}-black-btn`}
                            variant="light"
                            onClick={() => {
                              setTabLoading(true);
                              setTimeout(() => {
                                setStartForgotPasswordProcess(true);
                                setTabIndex(tabIndex + 1);
                                setShow(true);
                                setTabLoading(false);
                              }, 500);
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
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: "400",
                                marginLeft: "5px",
                              }}
                              className="grid-item mt-5"
                            >
                              <span>
                                Don&apos;t have an account?{" "}
                                <span
                                  className="hover-blue-underline"
                                  onClick={handleCloseLoginModal}
                                  style={{
                                    color: "#1C9BEF",
                                  }}
                                >
                                  Sign up
                                </span>
                              </span>
                            </div>
                          </div>
                        </Modal.Body>
                      )}
                    </>
                  ) : tabIndex === 1 ? (
                    <>
                      {tabLoading ? (
                        <Modal.Body
                          style={{
                            padding: 0,
                            margin: 0,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <>
                          <Modal.Body
                            className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              Find your C account
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A                                  "
                                    : "rgb(83, 100, 113)",
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
                              InputLabelProps={{
                                style: {
                                  color:
                                    themeName === "dark-theme" ? "#71767B" : "",
                                },
                              }}
                              InputProps={{
                                style: {
                                  color:
                                    themeName === "dark-theme" ? "white" : "",
                                },
                              }}
                              sx={{
                                "& .Mui-focused input + fieldset": {
                                  border: "2px solid #1d9bf0 !important",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    themeName === "dark-theme"
                                      ? "rgb(70, 70, 70)"
                                      : "#cfd9de !important",
                                  border:
                                    themeName === "dark-theme"
                                      ? "1px solid rgb(70, 70, 70) !important"
                                      : "",
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
                              className={`login-button mt-5 ${themeName}-white-btn`}
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
                        <Modal.Body
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <>
                          {/* start to check confirm username */}
                          <Modal.Body
                            className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              Confirm your username
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A                                  "
                                    : "rgb(83, 100, 113)",
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
                              InputLabelProps={{
                                style: {
                                  color:
                                    themeName === "dark-theme" ? "#71767B" : "",
                                },
                              }}
                              InputProps={{
                                style: {
                                  color:
                                    themeName === "dark-theme" ? "white" : "",
                                },
                              }}
                              sx={{
                                "& .Mui-focused input + fieldset": {
                                  border: "2px solid #1d9bf0 !important",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    themeName === "dark-theme"
                                      ? "rgb(70, 70, 70)"
                                      : "#cfd9de !important",
                                  border:
                                    themeName === "dark-theme"
                                      ? "1px solid rgb(70, 70, 70) !important"
                                      : "",
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
                              className={`login-button mt-5 ${themeName}-white-btn`}
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
                        <Modal.Body
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
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
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            }}
                          >
                            Where should we send a confirmation code?
                          </div>
                          <div
                            className="mt-2"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A                                  "
                                  : "rgb(83, 100, 113)",
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
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A                                  "
                                  : "rgb(83, 100, 113)",
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
                              color:
                                themeName === "dark-theme" ? "white" : "black",
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
                              className={
                                themeName === "dark-theme"
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme"
                                  ? "hover-background-effect-clicked-light-theme"
                                  : null
                              }
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
                              color:
                                themeName === "dark-theme" ? "white" : "black",
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
                            className={`login-button mt-5 mb-3 ${themeName}-white-btn`}
                            variant="dark"
                          >
                            Next
                          </Button>

                          <Button
                            className={`cancel-btn-reactivate-tab ${themeName}-black-btn`}
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
                        <Modal.Body
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
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
                          className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
                        >
                          <div
                            style={{
                              width: "81.5%",
                              lineHeight: "36px",
                              fontWeight: "700",
                              fontSize: "31px",
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            }}
                          >
                            We sent you a code
                          </div>
                          <div
                            className="mt-2"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A                                  "
                                  : "rgb(83, 100, 113)",
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
                            InputProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              },
                            }}
                            InputLabelProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "#71767B" : "",
                              },
                            }}
                            sx={{
                              "& .Mui-focused input + fieldset": {
                                border: "2px solid #1d9bf0 !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  themeName === "dark-theme"
                                    ? "rgb(70, 70, 70)"
                                    : "#cfd9de !important",
                                border:
                                  themeName === "dark-theme"
                                    ? "1px solid rgb(70, 70, 70) !important"
                                    : "",
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
                                  : showCustomMessage(
                                      "Invalid verification code.",
                                      4
                                    );
                              }}
                              className={`login-button ${themeName}-white-btn`}
                              variant="dark"
                            >
                              Next
                            </Button>
                          ) : (
                            <>
                              <Button
                                className={`cancel-btn-reactivate-tab ${themeName}-black-btn`}
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
                        <Modal.Body
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              Choose a new password
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A                                  "
                                    : "rgb(83, 100, 113)",
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
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A                                  "
                                    : "rgb(83, 100, 113)",
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
                                  color:
                                    themeName === "dark-theme" ? "#71767B" : "",

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
                                inputProps={{
                                  style: {
                                    color:
                                      themeName === "dark-theme" ? "white" : "",
                                  },
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: errorMessageForFirstInput
                                      ? "rgb(244, 33, 46)!important"
                                      : themeName === "dark-theme"
                                      ? "rgb(70, 70, 70) !important"
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
                                        color={
                                          themeName === "dark-theme"
                                            ? "white"
                                            : `rgb(15, 20, 25)`
                                        }
                                        fill="currentColor"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        style={{
                                          cursor: "pointer",
                                        }}
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
                                        color={
                                          themeName === "dark-theme"
                                            ? "white"
                                            : `rgb(15, 20, 25)`
                                        }
                                        fill="currentColor"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        width={22}
                                        height={22}
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
                                  color:
                                    themeName === "dark-theme" ? "#71767B" : "",
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
                                inputProps={{
                                  style: {
                                    color:
                                      themeName === "dark-theme" ? "white" : "",
                                  },
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: errorMessageForSecondInput
                                      ? "rgb(244, 33, 46)!important"
                                      : themeName === "dark-theme"
                                      ? "rgb(70, 70, 70) !important"
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
                                        color={
                                          themeName === "dark-theme"
                                            ? "white"
                                            : `rgb(15, 20, 25)`
                                        }
                                        fill="currentColor"
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
                                        color={
                                          themeName === "dark-theme"
                                            ? "white"
                                            : `rgb(15, 20, 25)`
                                        }
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
                              onClick={
                                validPassword
                                  ? () => {
                                      handleChangePassword();
                                    }
                                  : ""
                              }
                              className={`login-button mt-5 ${themeName}-white-btn`}
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
                        <Modal.Body
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
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
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            }}
                          >
                            {"Why'd you change your password"}
                          </div>
                          <div
                            className="mt-2"
                            style={{
                              lineHeight: "20px",
                              width: "81.5%",
                              fontSize: "15px",
                              fontWeight: "400",
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                            }}
                          >
                            Your feedback helps us understand when and why
                            people need to change their passwords.
                          </div>
                          <div
                            className={`mt-5 scrollbar-add scrollbar-add-${themeName}`}
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
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
                                themeName === "dark-theme" &&
                                forgotMyPasswordChecked
                                  ? "hover-background-effect-clicked-dark-theme ms-auto"
                                  : themeName !== "dark-theme" &&
                                    forgotMyPasswordChecked
                                  ? "hover-background-effect-clicked-light-theme ms-auto"
                                  : themeName === "dark-theme" &&
                                    !forgotMyPasswordChecked
                                  ? "hover-background-effect-dark-theme ms-auto"
                                  : themeName !== "dark-theme" &&
                                    !forgotMyPasswordChecked
                                  ? "hover-background-effect-light-theme ms-auto"
                                  : ""
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
                                    : themeName !== "dark-theme"
                                    ? "2px solid #71767A"
                                    : "2px solid rgb(70, 70, 70)",
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
                            className={`mt-3 scrollbar-add scrollbar-add-${themeName}`}
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
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
                                themeName === "dark-theme" && suspiciousActivity
                                  ? "hover-background-effect-clicked-dark-theme ms-auto"
                                  : themeName !== "dark-theme" &&
                                    suspiciousActivity
                                  ? "hover-background-effect-clicked-light-theme ms-auto"
                                  : themeName === "dark-theme" &&
                                    !suspiciousActivity
                                  ? "hover-background-effect-dark-theme ms-auto"
                                  : themeName !== "dark-theme" &&
                                    !suspiciousActivity
                                  ? "hover-background-effect-light-theme ms-auto"
                                  : ""
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
                                    : themeName !== "dark-theme"
                                    ? "2px solid #71767A"
                                    : "2px solid rgb(70, 70, 70)",
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
                            className={`mt-3 scrollbar-add scrollbar-add-${themeName}`}
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
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
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
                                themeName === "dark-theme" && differentReason
                                  ? "hover-background-effect-clicked-dark-theme ms-auto"
                                  : themeName !== "dark-theme" &&
                                    differentReason
                                  ? "hover-background-effect-clicked-light-theme ms-auto"
                                  : themeName === "dark-theme" &&
                                    !differentReason
                                  ? "hover-background-effect-dark-theme ms-auto"
                                  : themeName !== "dark-theme" &&
                                    !differentReason
                                  ? "hover-background-effect-light-theme ms-auto"
                                  : ""
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
                                    : themeName !== "dark-theme"
                                    ? "2px solid #71767A"
                                    : "2px solid rgb(70, 70, 70)",
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
                              if (checkedValue) {
                                setTabLoading(true);
                                setTimeout(() => {
                                  setTabLoading(false);
                                  setTabIndex(tabIndex + 1);
                                }, 500);
                              }
                            }}
                            className={`login-button mt-5 ${themeName}-white-btn`}
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
                        <Modal.Body
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
                          <LoadingSpinner
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </Modal.Body>
                      ) : (
                        <Modal.Body
                          style={{
                            padding: "0px",
                            margin: "0px",
                          }}
                          className="signin-modal-body-child-non-reactivate"
                        >
                          {" "}
                          <div
                            style={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div
                              className="mb-5"
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
                                  color:
                                    themeName === "dark-theme" ? "white" : "",
                                }}
                              >
                                {"You're all set"}
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "rgb(83, 100, 113)",
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
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "rgb(83, 100, 113)",
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
                              <Button
                                style={{
                                  width: "100%",
                                  height: "52px",
                                }}
                                onClick={() => {
                                  handleLoginAfterForgotPasswordProcess();
                                }}
                                className={`login-button mt-5 ${themeName}-white-btn`}
                                variant="dark"
                              >
                                Continue to C
                              </Button>
                            </div>
                          </div>
                        </Modal.Body>
                      )}
                    </>
                  ) : tabIndex === 8 ? (
                    <>
                      <>
                        {tabLoading ? (
                          <Modal.Body
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                            className="signin-modal-body-child-non-reactivate"
                          >
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </Modal.Body>
                        ) : (
                          <>
                            <Modal.Body
                              className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
                              style={{
                                overflowY: "auto",
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                  display: "flex",
                                  textAlign: "left",
                                  width: "81.5%",
                                  lineHeight: "36px",
                                  fontWeight: "700",
                                  fontSize: "31px",
                                }}
                              >
                                Enter your password
                              </div>

                              <div
                                className="mt-5"
                                style={{
                                  width: "81.5%",
                                }}
                              >
                                <TextField
                                  style={{
                                    width: "100%",
                                    height: "60px",
                                  }}
                                  disabled
                                  id="filled-disabled"
                                  label={
                                    <div
                                      style={{
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: "13px",
                                          position: "relative",
                                          bottom: "5px",
                                          color:
                                            themeName === "dark-theme"
                                              ? "#3C3F41"
                                              : "",
                                        }}
                                      >
                                        {loginInput.usernameOrEmail.match(
                                          emailRegex
                                        )
                                          ? `Email`
                                          : `Username`}
                                      </div>
                                      <div
                                        style={{
                                          position: "relative",
                                          bottom: "5px",
                                          color:
                                            themeName === "dark-theme"
                                              ? "#3C3F41"
                                              : "",
                                        }}
                                      >
                                        {loginInput.usernameOrEmail.match(
                                          emailRegex
                                        )
                                          ? `${loginInput.usernameOrEmail}`
                                          : `@${loginInput.usernameOrEmail}`}
                                      </div>
                                    </div>
                                  }
                                  variant="filled"
                                  InputProps={{
                                    disableUnderline: true,
                                  }}
                                  InputLabelProps={{
                                    style: {
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767B"
                                          : "",
                                    },
                                  }}
                                  sx={{
                                    "& .MuiFilledInput-root": {
                                      background:
                                        themeName === "dark-theme"
                                          ? "#0D0E11 !important"
                                          : "#f7f9fa !important",
                                      height: "60px",
                                    },
                                  }}
                                />{" "}
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
                                    color:
                                      themeName === "dark-theme" ? "white" : "",

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
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      borderColor:
                                        themeName === "dark-theme"
                                          ? "rgb(70, 70, 70)"
                                          : "#cfd9de !important",
                                      border:
                                        themeName === "dark-theme"
                                          ? "1px solid rgb(70, 70, 70) !important"
                                          : "",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: "2px solid #1d9bf0 !important",
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
                                          onMouseDown={handleMouseDownPassword}
                                          style={{
                                            cursor: "pointer",
                                          }}
                                          color={
                                            themeName === "dark-theme"
                                              ? "white"
                                              : `rgb(15, 20, 25)`
                                          }
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
                                          color={
                                            themeName === "dark-theme"
                                              ? "white"
                                              : `rgb(15, 20, 25)`
                                          }
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
                                onClick={() => {
                                  setTabLoading(true);
                                  setTimeout(() => {
                                    setStartForgotPasswordProcess(true);
                                    setTabIndex(1);
                                    setShow(true);
                                    setTabLoading(false);
                                  }, 500);
                                }}
                                style={{
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
                                <span
                                  className="forgot-password-login-variant-one-screen"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                >
                                  Forgot password?
                                </span>
                              </div>

                              <Button
                                style={{
                                  position: "absolute",
                                  bottom: "70px",
                                  width: "81.5%",
                                  height: "52px",
                                  opacity: loginInput.password.length
                                    ? "1"
                                    : "0.5",
                                }}
                                onClick={() => handleLoginVariantOneStep2()}
                                className={`login-button mt-5 ${themeName}-white-btn`}
                                variant="dark"
                              >
                                Log in
                              </Button>
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "30px",
                                  width: "81.5%",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                  lineHeight: "20px",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A                                  "
                                      : "rgb(83, 100, 113)",
                                  // height: "52px",
                                }}
                              >
                                <span>
                                  Don&apos;t have an account?{" "}
                                  <span
                                    className="hover-blue-underline"
                                    onClick={handleCloseLoginModal}
                                    style={{
                                      color: "#1C9BEF",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Sign up
                                  </span>
                                </span>
                              </div>
                            </Modal.Body>
                          </>
                        )}
                      </>
                    </>
                  ) : null}
                </Modal>
              )}
            </>
          ) : (
            <Modal
              style={{
                margin: "0px",
                padding: "0px",
              }}
              backdropClassName={
                themeName === "dark-theme" ? `back-drop-${themeName}` : ""
              }
              centered={true}
              show={isLoading}
              onHide={handleCloseLoginModal}
              className={
                width > 700 ? `signin-modal-parent-non-reactivate` : ""
              }
              contentClassName={
                themeName === "dark-theme"
                  ? "dark-theme-spinner-modal-sign-in"
                  : "light-theme-spinner-modal-sign-in"
              }
              dialogClassName={width <= 700 ? "modal-fullscreen" : ""}
            >
              <Modal.Body
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "643.5px",
                  padding: "0px",
                  margin: "0px",
                }}
                className="signin-modal-body-child-non-reactivate"
              >
                <div
                  onClick={handleCloseLoginModal}
                  className="close-button"
                  style={{
                    borderRadius: "50%",
                    cursor: "pointer",
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    visibility: isLoading || tabLoading ? "hidden" : "initial",
                  }}
                >
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
                </div>
                <div>
                  <LoadingSpinner
                    strokeColor={"rgb(29, 155, 240)"}
                  ></LoadingSpinner>
                </div>
              </Modal.Body>
            </Modal>
          )}
        </>
      )}
    </>
  );
}

function CommentModal({
  post,
  width,
  height,
  refreshPosts,
  isImagePostDetail,
  isPostDetailPage,
  postSharedMessage,
  sendDataToParent,
  isCutePopoverOnRightSide,
}) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");
  const [showSecondModal, setShowSecondModal] = useState(false);

  const { userInfo } = useContext(UserContext);
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
  const [data, setData] = useState("");

  const handleShow = (isModalOpened) => {
    setData(isModalOpened);
    sendDataToParent(isModalOpened);
    setShow(true);
  };
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

  const handleNotification = (post, userInfo, type) => {
    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: post.userId.username,
      type: type,
      contactHasBeenMade: post,
      senderInfo: userInfo,
    });
  };

  const handleAddComment = (postId) => {
    startPostSharingAnimationActivate();

    axios
      .post(`${API_URL}/comment`, {
        userId: userInfo._id,
        postId,
        commentPost: content,
        modalImage,
      })
      .then((response) => {
        const lineElement = document.querySelector(
          ".post_sharing_line_animation"
        );
        setTimeout(() => {
          cancelPostSharingAnimationActivate();
          lineElement.classList.add("paused");
          lineElement.classList.remove("post_sharing_line_animation");
        }, 300);

        setTimeout(() => {
          lineElement.classList.remove("paused");
        }, 350);
        setModalImage("");
        setContent("");

        setTimeout(() => {
          if (postSharedMessage) {
            postSharedMessage(
              response.data.createdPost.authorUserName,
              response.data.createdPost._id
            );
          }
          if (refreshPosts) {
            refreshPosts();
          }
          handleNotification(post, userInfo, "comment");
          setModalImage("");
          setContent("");
          handleClose();
        }, 350);
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

  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [commentIconHovered, setCommentIconHovered] = useState(null);

  const [
    postSharingStartedActivateAnimate,
    setPostSharingStartedActivateAnimate,
  ] = useState(null);
  const startPostSharingAnimationActivate = () => {
    setPostSharingStartedActivateAnimate(true);
  };

  const cancelPostSharingAnimationActivate = () => {
    setPostSharingStartedActivateAnimate(null);
  };

  return (
    <>
      <div
      // style={{
      //   width: "100px",
      // }}
      >
        <BootstrapTooltip
          title="Reply"
          themeName={themeName === "dark-theme" ? "dark-theme" : "light-theme"}
        >
          <span
            onClick={() => handleShow(true)}
            style={{
              cursor: "pointer",
              minWidth: "34px",
              minHeight: "34px",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              backgroundColor:
                commentIconHovered && themeName !== "dark-theme"
                  ? "#e4eef7"
                  : commentIconHovered && themeName === "dark-theme"
                  ? "#1e3140"
                  : null,
            }}
            onMouseEnter={() => setCommentIconHovered(true)}
            onMouseLeave={() => setCommentIconHovered(false)}
          >
            <svg
              style={{}}
              width={isCutePopoverOnRightSide ? "1em" : width}
              height={isCutePopoverOnRightSide ? "1em" : width}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="bi bi-chat r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
              fill={
                themeName === "dark-theme" && !commentIconHovered
                  ? "#71767A"
                  : themeName !== "dark-theme" && !commentIconHovered
                  ? "rgb(83, 100, 113)"
                  : themeName === "dark-theme" && commentIconHovered
                  ? "#1d9aee"
                  : themeName !== "dark-theme" && commentIconHovered
                  ? "#1c94e4"
                  : null
              }
            >
              <g>
                <path
                  stroke={
                    isImagePostDetail
                      ? "white"
                      : themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)"
                  }
                  strokeWidth="0.1"
                  d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
                ></path>
              </g>
            </svg>
          </span>
          <span
            className="post-description"
            style={{
              color: isImagePostDetail
                ? "white"
                : themeName === "dark-theme" && !commentIconHovered
                ? "#71767A"
                : themeName !== "dark-theme" && !commentIconHovered
                ? "rgb(83, 100, 113)"
                : themeName === "dark-theme" && commentIconHovered
                ? "#1d9aee"
                : themeName !== "dark-theme" && commentIconHovered
                ? "#1c94e4"
                : null,
              position: "relative",
              bottom: isCutePopoverOnRightSide ? "4px" : "5px",
              fontSize: isCutePopoverOnRightSide ? "12px" : null,
            }}
          >
            {post.comments && post.comments.length ? (
              <span>{post.comments.length}</span>
            ) : null}
          </span>
        </BootstrapTooltip>
      </div>
      <Modal
        style={{
          padding: "0px",
          margin: "0px",
        }}
        show={show}
        onHide={handleClose}
        backdropClassName={
          themeName === "dark-theme" ? `back-drop-${themeName}` : ""
        }
        contentClassName={
          windowWidth <= 700 && themeName === "dark-theme"
            ? `comment-modal-${themeName}`
            : themeName === "dark-theme"
            ? `comment-modal comment-modal-${themeName}`
            : windowWidth <= 700
            ? ""
            : "comment-modal"
        }
        dialogClassName={windowWidth <= 700 ? "modal-fullscreen" : ""}
      >
        {" "}
        <div
          className={
            postSharingStartedActivateAnimate
              ? "post_sharing_line_animation"
              : ""
          }
          style={{
            display: postSharingStartedActivateAnimate ? "" : "none",
            position: "absolute",
            border: "2px solid #1C9BEF",
            height: "0.2rem",
            top: "0px",
            borderTopLeftRadius: "4px",
            marginLeft: "6px",
          }}
        ></div>
        <div
          onClick={handleClose}
          style={{
            cursor: "pointer",
            padding: "12px",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? `close-button-${themeName}`
                : `close-button`
            }
            style={{
              display: "inline-flex",
              borderRadius: "50%",
            }}
          >
            <svg
              style={{
                border: "none",
                fontSize: "15px",
                margin: "5px",
              }}
              onClick={handleClose}
              width={20}
              height={20}
              color={themeName === "dark-theme" ? "white" : "rgb(15,20,25)"}
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
        {/* start to check twitterdaki gibi post içeriği gelecek body içerisine  */}
        <Modal.Body
          className="mt-3"
          style={{
            padding: "0px",
            margin: "0px",
            overflowX: "hidden",
            zIndex: 9999,
          }}
        >
          <Container
            style={{
              padding: "0px",
              margin: "0px",
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
                  padding: "0px",
                  margin: "0px",
                }}
              >
                {/* profile image start to check */}
                <div>
                  {post.userId ? (
                    <>
                      {post.userId?.imageUrl?.slice(0, 3) !== "../" ? (
                        <img
                          width={40}
                          height={40}
                          src={post.userId?.imageUrl}
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
                          fill={
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)"
                          }
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
                            border:
                              themeName !== "dark-theme"
                                ? "1px solid rgba(0, 0, 0, 0.2)"
                                : // : "0.1px solid rgb(70, 70, 70)",
                                  "1px solid rgb(70, 70, 70)",
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
                            border:
                              themeName !== "dark-theme"
                                ? "1px solid rgba(0, 0, 0, 0.2)"
                                : // : "0.1px solid rgb(70, 70, 70)",
                                  "1px solid rgb(70, 70, 70)",
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
                <div
                  style={{
                    float: "left",
                    position: "relative",
                    right: "30px",
                  }}
                >
                  <div>
                    {post.userId ? (
                      <>
                        <span
                          className="hover-fullname"
                          style={{
                            fontWeight: "700",
                            fontSize: "15px",
                            lineHeight: "20px",
                            color: themeName === "dark-theme" ? "white" : "",
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
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          @{post.authorUserName}
                        </span>

                        <span
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
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
                        color: themeName === "dark-theme" ? "white" : "black",
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
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "rgb(83, 100, 113)",
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
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
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
                </div>
                {/* post owner full name + verified account svg + post owner user name + post created date and content  finish to check  */}
              </Col>
            </Row>
          </Container>

          <Container
            style={{
              padding: "0px",
              margin: "0px",
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
                  padding: "0px",
                  margin: "0px",
                }}
              >
                {/* profile image start to check */}
                <div>
                  {userInfo ? (
                    <>
                      {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
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
                          fill={
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)"
                          }
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
                      fill={
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)"
                      }
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
              <Col
                xs={10}
                sm={10}
                md={10}
                lg={10}
                xxl={10}
                style={{
                  padding: "0px",
                  margin: "0px",
                  position: "relative",
                  right: "20px",
                }}
              >
                <textarea
                  autoFocus
                  onChange={handleChange}
                  rows="4"
                  cols="50"
                  value={content}
                  // maxLength={maxCharacters}
                  maxLength={400}
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
                    color:
                      themeName == "dark-theme"
                        ? "white"
                        : "rgba(15,20,25,1.00)",
                    lineHeight: "24px",
                    fontWeight: "400",

                    fontSize: `${content ? "20px" : "20px"}`,
                    backgroundColor:
                      themeName === "dark-theme" ? "black" : "transparent",
                    width: "95%",
                    height: "auto",
                    float: "left",
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
          style={{
            paddingBottom: "0px",
            paddingTop: "0px",
            margin: "0px",
            border: "none",
          }}
        >
          <Stack direction="horizontal" gap={0}>
            {/* INFO */}

            {/* comment modal svg start to check  */}
            <BootstrapTooltip
              title="Media"
              themeName={
                themeName === "dark-theme" ? "dark-theme" : "light-theme"
              }
            >
              <div
                className=""
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
                  className={`svg-border-parent svg-border-parent-${themeName}`}
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
            </BootstrapTooltip>
            {/* comment modal svg finish to check  */}

            {/* emoji mart start to check */}
            <div>
              <PopupState variant="popover" popupId="demo-popup-popover">
                {(popupState) => (
                  <div>
                    <BootstrapTooltip
                      title="Emoji"
                      themeName={
                        themeName === "dark-theme"
                          ? "dark-theme"
                          : "light-theme"
                      }
                    >
                      <Button
                        {...bindTrigger(popupState)}
                        style={{
                          border: "none",
                          // backgroundColor: "transparent",
                          padding: "0px",
                          margin: "0px",
                          cursor: "pointer",
                          position: "relative",
                        }}
                        variant="text"
                      >
                        <div
                          className={`svg-border-parent svg-border-parent-${themeName}`}
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
                      </Button>
                    </BootstrapTooltip>
                    <Popover
                      open={popupState.open}
                      onClose={popupState.close}
                      {...bindPopover(popupState)}
                      // anchorReference="anchorPosition"
                      // anchorPosition={{ top: 0, left: 0 }}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: 140,
                      }}
                      // transformOrigin creates problem start to check
                      // transformOrigin={{
                      //   vertical: "top",
                      //   horizontal: "center",
                      // }}
                      // transformOrigin creates problem finish to check
                      className={`${
                        themeName === "dark-theme"
                          ? "popover-material-ui-dark-theme"
                          : themeName !== "dark-theme"
                          ? "popover-material-ui-light-theme"
                          : "hideshowMessageDeletePopover "
                      }`}
                    >
                      <Picker
                        autoFocus
                        theme={themeName === "dark-theme" ? "dark" : "light"}
                        data={dataEmojiMartPicker}
                        onEmojiSelect={onEmojiClick}
                        maxFrequentRows={0}
                        emojiSize={20}
                        emojiButtonSize={28}
                      />
                    </Popover>
                  </div>
                )}
              </PopupState>
              {/* emoji mart finish to check */}
            </div>
            <div className="p-2 ms-auto">
              {content !== "" || modalImage ? (
                <Button
                  style={{
                    border: "none",
                  }}
                  variant="primary"
                  onClick={() =>
                    handleAddComment(
                      post.isComment && (isPostDetailPage || isImagePostDetail)
                        ? post.postId
                        : post._id
                    )
                  }
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
      </Modal>
    </>
  );
}

export { SigninModal, CommentModal };
