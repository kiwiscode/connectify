import { useContext, useEffect, useState } from "react";
import useWindowDimensions from "../../../../../../hooks/getWindowDimensions";
import { Button, Modal } from "react-bootstrap";
import { ThemeContext } from "../../../../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../../components/ui/LoadingSpinner";
import { useFontSizeHandler } from "../../../../../../utils/useFontSizeHandler";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useAntdMessageHandler } from "../../../../../../utils/useAntdMessageHandler";
import { UserContext } from "../../../../../../context/UserContext";

const API_URL = import.meta.env.VITE_APP_API_URL;

function Flow_Password_Reset() {
  const { getToken, updateUser } = useContext(UserContext);
  const { themeName } = useContext(ThemeContext);
  const { showCustomMessage, contextHolder } = useAntdMessageHandler();
  const {
    getFontSizeAndLineHeight13,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight26,
    getFontSizeAndLineHeight31,
  } = useFontSizeHandler();

  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [tabLoading, setTabLoading] = useState(false);

  const font13 = getFontSizeAndLineHeight13();
  const font15 = getFontSizeAndLineHeight15();
  const font26 = getFontSizeAndLineHeight26();
  const font31 = getFontSizeAndLineHeight31();

  // modal içi stateler
  const [findConnectifyAccount, setFindConnectifyAccount] = useState("");
  // confirm username
  const [confirmUsername, setConfirmUsername] = useState("");
  // username doğruluğunu kontrol et
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

  // password unutan kullanıcı işlemleri
  const [forgotPasswordInProcessUser, setForgotPasswordInProcessUser] =
    useState([]);

  // accountu bul
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

  // masked email oluşturma
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

  // emaili gönder forgot password adına
  const [
    receivedVerificationCodeForPasswordChange,
    setReceivedVerificationCodeForPasswordChange,
  ] = useState();

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

  // verification code doğrulama inputu
  const handleTabChange = () => {
    setTabLoading(true);
    setTimeout(() => {
      setVerificationCodeInput("");
      setTabLoading(false);
      setTabIndex(tabIndex + 1);
    }, 500);
  };

  const [verificationCodeInput, setVerificationCodeInput] = useState("");

  // şifre değiştirirken input error kontrolleri
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
  const [checkedValue, setCheckedValue] = useState(false);

  const [validPassword, setValidPassword] = useState(null);

  const [newPassword, setNewPasswordForgotPasswordProcess] = useState("");

  const [confirmPassword, setNewPasswordForgotPasswordProcessConfirm] =
    useState("");

  const [forgotMyPasswordChecked, setForgotMyPasswordChecked] = useState(false);
  const [suspiciousActivity, setSuspiciousActivityChecked] = useState(false);
  const [differentReason, setDifferentReason] = useState(false);

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

  const [loginInput, setLoginInput] = useState({
    multi_factor_authentication: "",
    password: "",
  });

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|proton|zoho|mail|aol|yandex)\.(com|org|net|gov|edu|mil|co|info|de|co.uk|ca|me|tr|com.tr)$/;

  const phoneRegex =
    /^(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})$/;

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

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("token", token);

        updateUser(user);

        console.log("Response =>", response);

        setTimeout(() => {
          navigate("/home");
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

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
      !regex.test(confirmPassword) ||
      !regex.test(newPassword)
    ) {
      setValidPassword(false);
    } else {
      seterrorMessageForFirstInput("");
      seterrorMessageForSecondInput("");
      setValidPassword(true);
    }
  }, [newPassword, confirmPassword]);

  return (
    <>
      {contextHolder}
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
              show={true}
            >
              <Modal.Header
                className="signin-modal-header-child-non-reactivate"
                style={{
                  border: "none",
                }}
              >
                <div
                  onClick={() => navigate(-1)}
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
                        margin: "5px",
                      }}
                      width={20}
                      height={20}
                      color={
                        themeName === "dark-theme" ? "white" : "rgb(15,20,25)"
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
                        className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
                        style={{
                          overflowY: "auto",
                          position: "relative",
                        }}
                      >
                        <div
                          className="chirp-bold-font"
                          style={{
                            display: "flex",
                            textAlign: "left",
                            width: "81.5%",
                            fontSize: font26.fontSize,
                            lineHeight: font26.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Find your C account
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A                                  "
                                : "rgb(83, 100, 113)",
                            lineHeight: "20px",
                            width: "81.5%",
                            fontSize: font15.fontSize,
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
                          label="Phone, email, or username"
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
                              color: themeName === "dark-theme" ? "white" : "",
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
                            opacity: findConnectifyAccount.length ? "1" : "0.5",
                          }}
                          onClick={() => handleFindConnectifyAccount()}
                          className={`login-button mt-5 ${themeName}-white-btn`}
                          variant="dark"
                        >
                          Next
                        </Button>
                      </Modal.Body>
                    )}
                  </>
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
                      {/* start to check confirm username */}
                      <Modal.Body
                        className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
                        style={{
                          overflowY: "auto",
                          position: "relative",
                        }}
                      >
                        <div
                          className="chirp-bold-font"
                          style={{
                            display: "flex",
                            textAlign: "left",
                            width: "81.5%",
                            fontSize: font26.fontSize,
                            lineHeight: font26.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Confirm your username
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A                                  "
                                : "rgb(83, 100, 113)",
                            lineHeight: "20px",
                            width: "81.5%",
                            fontSize: font15.fontSize,
                          }}
                        >
                          Verify your identity by entering the username
                          associated with your Connectify account.
                        </div>
                        <TextField
                          className="mt-4"
                          autoFocus={true}
                          value={confirmUsername}
                          onChange={(e) => setConfirmUsername(e.target.value)}
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
                              color: themeName === "dark-theme" ? "white" : "",
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
                            pointerEvents: confirmUsername.length
                              ? "auto"
                              : "none",
                            cursor: confirmUsername.length
                              ? "pointer"
                              : "default",
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
                    <Modal.Body className="signin-modal-body-child-non-reactivate">
                      <div
                        className="mb-4 chirp-bold-font"
                        style={{
                          display: "flex",
                          textAlign: "left",
                          width: "81.5%",
                          fontSize: font26.fontSize,
                          lineHeight: font26.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Where should we send a confirmation code?
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A                                  "
                              : "rgb(83, 100, 113)",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          display: "flex",
                          textAlign: "left",
                          width: "81.5%",
                        }}
                      >
                        Before you can change your password, we need to make
                        sure it’s really you.
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A                                  "
                              : "rgb(83, 100, 113)",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
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
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        <div
                          className="chirp-bold-font"
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          Send an email to{" "}
                          {getMaskedEmail(forgotPasswordInProcessUser.email)}
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
                        className="mt-4 connectify-support-forgot-password-screen chirp-regular-font"
                        style={{
                          textAlign: "left",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          width: "81.5%",
                          color: themeName === "dark-theme" ? "white" : "black",
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
                        onClick={() => handleSendForgotPasswordCodeToEmail()}
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
                        }}
                      >
                        Cancel
                      </Button>
                    </Modal.Body>
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
                    <Modal.Body
                      style={{
                        overflowY: "auto",
                        position: "relative",
                      }}
                      className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
                    >
                      <div
                        className="chirp-bold-font"
                        style={{
                          display: "flex",
                          textAlign: "left",
                          width: "81.5%",
                          fontSize: font26.fontSize,
                          lineHeight: font26.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        We sent you a code
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A                                  "
                              : "rgb(83, 100, 113)",
                          width: "81.5%",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Check your email to get your confirmation code. If you
                        need to request a new code, go back and reselect a
                        confirmation.
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
                            color: themeName === "dark-theme" ? "white" : "",
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            color: themeName === "dark-theme" ? "#71767B" : "",
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
                    <Modal.Body className="signin-modal-body-child-non-reactivate">
                      <>
                        <div
                          className="chirp-bold-font"
                          style={{
                            display: "flex",
                            textAlign: "left",
                            width: "81.5%",
                            fontSize: font26.fontSize,
                            lineHeight: font26.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Choose a new password
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A                                  "
                                : "rgb(83, 100, 113)",
                            width: "81.5%",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          Make sure your new password is 8 characters or more.
                          Try including numbers, letters, and punctuation marks
                          for a{" "}
                          <span
                            style={{
                              color: "rgb(29, 155, 240)",
                            }}
                          >
                            strong password.
                          </span>
                        </div>
                        <div
                          className="mt-4 chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A                                  "
                                : "rgb(83, 100, 113)",
                            width: "81.5%",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
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
                            className="chirp-regular-font"
                            style={{
                              position: "relative",
                              left: "10px",
                              width: "81.5%",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
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
                            className="chirp-regular-font"
                            style={{
                              position: "relative",
                              left: "10px",
                              width: "81.5%",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
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
                            opacity:
                              confirmPassword.length &&
                              newPassword.length &&
                              validPassword
                                ? "1"
                                : "0.5",
                            cursor:
                              confirmPassword.length &&
                              newPassword.length &&
                              validPassword
                                ? "pointer"
                                : "default",
                            pointerEvents:
                              confirmPassword.length &&
                              newPassword.length &&
                              validPassword
                                ? "auto"
                                : "none",
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
              ) : tabIndex === 5 ? (
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
                        className="chirp-bold-font"
                        style={{
                          display: "flex",
                          textAlign: "left",
                          width: "81.5%",
                          fontSize: font26.fontSize,
                          lineHeight: font26.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        {"Why'd you change your password"}
                      </div>
                      <div
                        className="chirp-regular-font mt-2"
                        style={{
                          width: "81.5%",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          fontWeight: "400",
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                        }}
                      >
                        Your feedback helps us understand when and why people
                        need to change their passwords.
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
                          className="chirp-bold-font"
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
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
                          className="chirp-bold-font"
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
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
                              : themeName !== "dark-theme" && suspiciousActivity
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
                          className="chirp-bold-font"
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
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
                              : themeName !== "dark-theme" && differentReason
                              ? "hover-background-effect-clicked-light-theme ms-auto"
                              : themeName === "dark-theme" && !differentReason
                              ? "hover-background-effect-dark-theme ms-auto"
                              : themeName !== "dark-theme" && !differentReason
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
                      </div>
                      <Button
                        style={{
                          width: "81.5%",
                          height: "52px",
                          position: "absolute",
                          bottom: "20px",
                          opacity: checkedValue ? "" : 0.5,
                          pointerEvents: checkedValue ? "auto" : "none",
                          cursor: checkedValue ? "pointer" : "default",
                        }}
                        onClick={() => {
                          setTabLoading(true);
                          setTimeout(() => {
                            setTabLoading(false);
                            checkedValue ? setTabIndex(tabIndex + 1) : null;
                          }, 500);
                        }}
                        className={`login-button mt-5 ${themeName}-white-btn chirp-bold-font`}
                        variant="dark"
                      >
                        Next
                      </Button>
                    </Modal.Body>
                  )}
                </>
              ) : tabIndex === 6 ? (
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
                            className="chirp-bold-font"
                            style={{
                              width: "81.5%",
                              fontSize: font31.fontSize,
                              lineHeight: font31.lineHeight,
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            {"You're all set"}
                          </div>
                          <div
                            className="mt-2 chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                          >
                            {"You've successfully changed your password."}
                          </div>
                          <div
                            className="mt-2 chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
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
                            . Enable it in your settings to help make sure that
                            you, and only you, can access your account.
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
              ) : tabIndex === 7 ? (
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
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                              display: "flex",
                              textAlign: "left",
                              width: "81.5%",
                              fontSize: font26.fontSize,
                              lineHeight: font26.lineHeight,
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
                                      fontSize: font13.fontSize,
                                      position: "relative",
                                      bottom: "5px",
                                      color:
                                        themeName === "dark-theme"
                                          ? "#3C3F41"
                                          : "",
                                    }}
                                  >
                                    {loginInput.multi_factor_authentication.match(
                                      emailRegex
                                    )
                                      ? `Email`
                                      : loginInput.multi_factor_authentication.match(
                                          phoneRegex
                                        )
                                      ? `Phone`
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
                                    {loginInput.multi_factor_authentication.match(
                                      emailRegex
                                    )
                                      ? `${loginInput.multi_factor_authentication}`
                                      : loginInput.multi_factor_authentication.match(
                                          phoneRegex
                                        )
                                      ? `${loginInput.multi_factor_authentication}`
                                      : `@${loginInput.multi_factor_authentication}`}
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
                                    themeName === "dark-theme" ? "#71767B" : "",
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
                                setTabIndex(1);
                                setTabLoading(false);
                              }, 500);
                            }}
                            className="chirp-regular-font"
                            style={{
                              position: "relative",
                              left: "10px",
                              bottom: "5px",
                              width: "81.5%",
                              color: "rgb(29, 155, 240)",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                            }}
                          >
                            <span
                              className="chirp-regular-font forgot-password-login-variant-one-screen "
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
                              opacity: loginInput.password.length ? "1" : "0.5",
                            }}
                            className={`login-button mt-5 ${themeName}-white-btn chirp-bold-font`}
                            variant="dark"
                          >
                            Log in
                          </Button>
                          <div
                            className="chirp-regular-font"
                            style={{
                              position: "absolute",
                              bottom: "15px",
                              width: "90%",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
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
                                className="hover-blue-underline "
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
              margin: "0px",
              padding: "0px",
              overflow: "hidden",
            }}
            backdropClassName={
              themeName === "dark-theme" ? `back-drop-${themeName}` : ""
            }
            contentClassName={
              themeName === "dark-theme"
                ? "dark-theme-modal"
                : "light-theme-modal"
            }
            show={true}
            size="lg"
            centered={true}
            className={
              tabIndex > 0 && tabIndex !== 8 && themeName === "dark-theme"
                ? "forgot-password-modal-opened-dark-theme signin-modal-parent-non-reactivate"
                : tabIndex > 0 && tabIndex !== 8 && themeName === "light-theme"
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
                onClick={() => navigate(-1)}
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
                      margin: "5px",
                      display: tabIndex === 7 ? "none" : "",
                    }}
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
                  {/* close signin modal icon finish to check  */}
                </div>
              </div>
            </Modal.Header>
            {tabIndex === 0 ? (
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
                        className="chirp-bold-font"
                        style={{
                          width: "81.5%",
                          fontSize: font31.fontSize,
                          lineHeight: font31.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Find your C account
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A                                  "
                              : "rgb(83, 100, 113)",
                          width: "81.5%",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
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
                        label="Phone, email, or username"
                        style={{
                          width: "81.5%",
                          height: "58px",
                        }}
                        InputLabelProps={{
                          style: {
                            color: themeName === "dark-theme" ? "#71767B" : "",
                          },
                        }}
                        InputProps={{
                          style: {
                            color: themeName === "dark-theme" ? "white" : "",
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
                          opacity: findConnectifyAccount.length ? "1" : "0.5",
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
            ) : tabIndex === 1 ? (
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
                        className="chirp-bold-font"
                        style={{
                          width: "81.5%",
                          fontSize: font31.fontSize,
                          lineHeight: font31.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Confirm your username
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A                                  "
                              : "rgb(83, 100, 113)",
                          width: "81.5%",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Verify your identity by entering the username associated
                        with your Connectify account.
                      </div>
                      <TextField
                        className="mt-4"
                        autoFocus={true}
                        value={confirmUsername}
                        onChange={(e) => setConfirmUsername(e.target.value)}
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
                            color: themeName === "dark-theme" ? "#71767B" : "",
                          },
                        }}
                        InputProps={{
                          style: {
                            color: themeName === "dark-theme" ? "white" : "",
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
                          pointerEvents: confirmUsername.length
                            ? "auto"
                            : "none",
                          cursor: confirmUsername.length
                            ? "pointer"
                            : "default",
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
                  <Modal.Body className="signin-modal-body-child-non-reactivate">
                    <div
                      className="mb-4 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Where should we send a confirmation code?
                    </div>
                    <div
                      className="mt-2 chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A                                  "
                            : "rgb(83, 100, 113)",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        display: "flex",
                        textAlign: "left",
                        width: "81.5%",
                      }}
                    >
                      Before you can change your password, we need to make sure
                      it’s really you.
                    </div>
                    <div
                      className="mt-2 chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A                                  "
                            : "rgb(83, 100, 113)",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
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
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      <div
                        className="chirp-bold-font"
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Send an email to{" "}
                        {getMaskedEmail(forgotPasswordInProcessUser.email)}
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
                      className="mt-4 connectify-support-forgot-password-screen chirp-regular-font"
                      style={{
                        textAlign: "left",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        width: "81.5%",
                        color: themeName === "dark-theme" ? "white" : "black",
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
                      onClick={() => handleSendForgotPasswordCodeToEmail()}
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
                      }}
                    >
                      Cancel
                    </Button>
                  </Modal.Body>
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
                  <Modal.Body
                    style={{
                      overflowY: "auto",
                      position: "relative",
                    }}
                    className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
                  >
                    <div
                      className="chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      We sent you a code
                    </div>
                    <div
                      className="mt-2 chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A                                  "
                            : "rgb(83, 100, 113)",
                        width: "81.5%",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                    >
                      Check your email to get your confirmation code. If you
                      need to request a new code, go back and reselect a
                      confirmation.
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
                          color: themeName === "dark-theme" ? "white" : "",
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: themeName === "dark-theme" ? "#71767B" : "",
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
                  <Modal.Body className="signin-modal-body-child-non-reactivate">
                    <>
                      <div
                        className="chirp-bold-font"
                        style={{
                          width: "81.5%",
                          fontSize: font31.fontSize,
                          lineHeight: font31.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Choose a new password
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A                                  "
                              : "rgb(83, 100, 113)",
                          width: "81.5%",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
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
                        className="mt-4 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A                                  "
                              : "rgb(83, 100, 113)",
                          width: "81.5%",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
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
                            color: themeName === "dark-theme" ? "#71767B" : "",

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
                              color: themeName === "dark-theme" ? "white" : "",
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
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
                          className="chirp-regular-font"
                          style={{
                            position: "relative",
                            left: "10px",
                            width: "81.5%",
                            fontSize: font13.fontSize,
                            lineHeight: font13.lineHeight,
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
                            color: themeName === "dark-theme" ? "#71767B" : "",
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
                              color: themeName === "dark-theme" ? "white" : "",
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
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
                          className="chirp-regular-font"
                          style={{
                            position: "relative",
                            left: "10px",
                            width: "81.5%",
                            fontSize: font13.fontSize,
                            lineHeight: font13.lineHeight,
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
                            confirmPassword.length &&
                            newPassword.length &&
                            validPassword
                              ? "1"
                              : "0.5",
                          cursor:
                            confirmPassword.length &&
                            newPassword.length &&
                            validPassword
                              ? "pointer"
                              : "default",
                          pointerEvents:
                            confirmPassword.length &&
                            newPassword.length &&
                            validPassword
                              ? "auto"
                              : "none",
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
            ) : tabIndex === 5 ? (
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
                      className="chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      {"Why'd you change your password"}
                    </div>
                    <div
                      className="chirp-regular-font mt-2"
                      style={{
                        width: "81.5%",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      Your feedback helps us understand when and why people need
                      to change their passwords.
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
                        className="chirp-bold-font"
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
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
                          themeName === "dark-theme" && forgotMyPasswordChecked
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
                        className="chirp-bold-font"
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
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
                            : themeName !== "dark-theme" && suspiciousActivity
                            ? "hover-background-effect-clicked-light-theme ms-auto"
                            : themeName === "dark-theme" && !suspiciousActivity
                            ? "hover-background-effect-dark-theme ms-auto"
                            : themeName !== "dark-theme" && !suspiciousActivity
                            ? "hover-background-effect-light-theme ms-auto"
                            : ""
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
                        className="chirp-bold-font"
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
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
                            : themeName !== "dark-theme" && differentReason
                            ? "hover-background-effect-clicked-light-theme ms-auto"
                            : themeName === "dark-theme" && !differentReason
                            ? "hover-background-effect-dark-theme ms-auto"
                            : themeName !== "dark-theme" && !differentReason
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
                    </div>
                    <Button
                      style={{
                        width: "81.5%",
                        height: "52px",
                        position: "absolute",
                        bottom: "20px",
                        opacity: checkedValue ? "" : 0.5,
                        pointerEvents: checkedValue ? "auto" : "none",
                        cursor: checkedValue ? "pointer" : "default",
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
                      className={`login-button mt-5 ${themeName}-white-btn chirp-bold-font`}
                      variant="dark"
                    >
                      Next
                    </Button>
                  </Modal.Body>
                )}
              </>
            ) : tabIndex === 6 ? (
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
                          className="chirp-bold-font"
                          style={{
                            width: "81.5%",
                            fontSize: font31.fontSize,
                            lineHeight: font31.lineHeight,
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          {"You're all set"}
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          {"You've successfully changed your password."}
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
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
                          . Enable it in your settings to help make sure that
                          you, and only you, can access your account.
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
            ) : tabIndex === 7 ? (
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
                          className="chirp-bold-font"
                          style={{
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                            display: "flex",
                            textAlign: "left",
                            width: "81.5%",
                            fontSize: font31.fontSize,
                            lineHeight: font31.lineHeight,
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
                                    fontSize: font13.fontSize,
                                    position: "relative",
                                    bottom: "5px",
                                    color:
                                      themeName === "dark-theme"
                                        ? "#3C3F41"
                                        : "",
                                  }}
                                >
                                  {loginInput.multi_factor_authentication.match(
                                    emailRegex
                                  )
                                    ? `Email`
                                    : loginInput.multi_factor_authentication.match(
                                        phoneRegex
                                      )
                                    ? `Phone`
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
                                  {loginInput.multi_factor_authentication.match(
                                    emailRegex
                                  )
                                    ? `${loginInput.multi_factor_authentication}`
                                    : loginInput.multi_factor_authentication.match(
                                        phoneRegex
                                      )
                                    ? `${loginInput.multi_factor_authentication}`
                                    : `@${loginInput.multi_factor_authentication}`}
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
                                  themeName === "dark-theme" ? "#71767B" : "",
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
                              color: themeName === "dark-theme" ? "white" : "",

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
                                themeName === "dark-theme" ? "white" : "black",
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
                              setTabIndex(1);
                              setTabLoading(false);
                            }, 500);
                          }}
                          className="chirp-regular-font"
                          style={{
                            position: "relative",
                            left: "10px",
                            bottom: "5px",
                            width: "81.5%",
                            color: "rgb(29, 155, 240)",
                            fontSize: font13.fontSize,
                            lineHeight: font13.lineHeight,
                          }}
                        >
                          <span
                            className="forgot-password-login-variant-one-screen chirp-regular-font "
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
                            opacity: loginInput.password.length ? "1" : "0.5",
                          }}
                          className={`login-button mt-5 ${themeName}-white-btn chirp-bold-font`}
                          variant="dark"
                        >
                          Log in
                        </Button>
                        <div
                          className="chirp-regular-font"
                          style={{
                            position: "absolute",
                            bottom: "30px",
                            width: "81.5%",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
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
    </>
  );
}

export default Flow_Password_Reset;
