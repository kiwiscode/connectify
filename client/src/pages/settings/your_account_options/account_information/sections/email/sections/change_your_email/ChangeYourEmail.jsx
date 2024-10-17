import { Col, Modal, Button } from "react-bootstrap";
import { useAntdMessageHandler } from "../../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../../../context/UserContext";
import SettingsNavigation from "../../../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import axios from "axios";
import LoadingSpinner from "../../../../../../../../components/ui/LoadingSpinner";
import BootstrapTooltip from "../../../../../../../../components/BootstrapToolTip/BootstrapToolTip";
import { useFontSizeHandler } from "../../../../../../../../utils/useFontSizeHandler";
const API_URL = import.meta.env.VITE_APP_API_URL;

function ChangeYourEmail() {
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { userInfo, getToken } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
  const handleTabIndexState = () => {
    setTabIndex(tabIndex + 1);
  };
  const handlePasswordConfirmation = () => {
    axios
      .post(`${API_URL}/auth/password-check`, {
        verifyPasswordInput: passwordInput,
        userId: userInfo._id,
      })
      .then(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          handleTabIndexState();
        }, 300);
      })
      .catch(() => {
        showCustomMessage("Wrong password!");
      });
  };

  const [allowEmailDiscovery, setAllowEmailDiscovery] = useState(null);

  const [email, setEmail] = useState("");
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const [emailTypeError, setemailTypeError] = useState(true);
  useEffect(() => {
    const checkEmail = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/auth/email-check`,
          { email },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (response.status === 201) {
          setemailTypeError(null);
        }

        if (response.status === 200) {
          setemailTypeError(200);
        }
      } catch (error) {
        if (error.response.status === 304) {
          setemailTypeError(304);
        }
      }
    };

    checkEmail();
  }, [email]);

  const [emailVerificationCodeStatus, setemailVerificationCodeStatus] =
    useState("");
  const [emailVerificationCode, setemailVerificationCode] = useState("");

  const sendEmailVerificationCode = (recipientEmail) => {
    if (tabIndex === 3) {
      setShowOptionsReceivedEmail(false);
    }
    axios
      .post(
        `${API_URL}/auth/send-email-verification-code`,
        {
          receiverEmail: recipientEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          setemailVerificationCodeStatus(201);
          setemailVerificationCode(response.data.code);
        }
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };
  const [confirmEmailVerificationCode, setconfirmEmailVerificationCode] =
    useState("");
  const handleChangeEmailVerificationCode = (e) => {
    setconfirmEmailVerificationCode(e.target.value);
  };
  const [showOptionsReceivedEmail, setShowOptionsReceivedEmail] =
    useState(false);
  const showOptionsReceivedEmailRef = useRef(null);
  const handleClickOutside = (event) => {
    if (
      showOptionsReceivedEmailRef.current &&
      !showOptionsReceivedEmailRef.current.contains(event.target)
    ) {
      setShowOptionsReceivedEmail(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const errorMessageAndCleanTextInput = () => {
    setTimeout(() => {
      setconfirmEmailVerificationCode("");
      showCustomMessage(
        "The code you entered is incorrect. Please try again.",
        4
      );
    }, 300);
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/user_update_email`,
        {
          newEmail: email,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.status !== 200) {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
  return (
    <>
      {" "}
      {contextHolder}
      <SettingsNavigation />
      <>
        <Modal
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          style={{
            height: "100%",
            overflowX: "hidden",
            overflowY: "hidden",
            margin: "0px",
            padding: "0px",
            backgroundColor:
              width < 700 && themeName === "dark-theme"
                ? "black"
                : width < 700 && themeName !== "dark-theme"
                ? "white"
                : "",
          }}
          show={true}
          centered={true}
          dialogClassName={
            width <= 700 ? "modal-fullscreen" : "modal_center_with_width"
          }
          contentClassName={
            width > 700 && themeName === "dark-theme"
              ? "dark-theme-sub-modal settings-modal-type"
              : width > 700 && themeName !== "dark-theme"
              ? "light-theme-sub-modal settings-modal-type"
              : width <= 700 && themeName === "dark-theme"
              ? "dark-theme-sub-modal "
              : null
          }
        >
          <Modal.Body
            style={{
              padding: "0px",
              margin: "0px",
            }}
          >
            {!loading ? (
              <>
                {tabIndex === 1 ? (
                  <>
                    <div className="icon">
                      <div
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={50}
                          height={30}
                          viewBox="0 0 100 100"
                        >
                          {/* İçi dolu bir kare */}
                          <rect
                            x="5"
                            y="5"
                            width="90"
                            height="90"
                            fill="#1C9BEF"
                            rx="5"
                            ry="5"
                            style={{
                              filter:
                                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                            }}
                          />

                          <text
                            x="27.5"
                            y="70"
                            fontFamily="Arial"
                            fontSize="60"
                            fill="#FFF"
                            stroke="#FFF"
                            strokeWidth="2"
                          >
                            C
                          </text>
                        </svg>
                      </div>
                    </div>

                    <div
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: width < 700 ? "26px" : "31px",
                          lineHeight: "36px",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-2"
                        }
                      >
                        Verify your password
                      </div>
                      <div
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-2  chirp-regular-font mt-2"
                        }
                      >
                        Re-enter your C password to continue.
                      </div>
                      <FormControl
                        sx={{
                          marginTop: "2rem",
                          width: "100%",
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
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "2px solid #1d9bf0 !important",
                            },
                          }}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          value={passwordInput}
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
                                      : "rgb(15, 20, 25)"
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
                                      : "rgb(15, 20, 25)"
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
                    </div>
                    <div
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                        position: "absolute",
                        bottom: "20px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        className={
                          !passwordInput.length && themeName === "dark-theme"
                            ? "background-hover-cancel-btn-dark-theme"
                            : !passwordInput.length &&
                              themeName !== "dark-theme"
                            ? "background-hover-cancel-btn-light-theme"
                            : passwordInput.length && themeName === "dark-theme"
                            ? "background-hover-next-btn-dark-theme"
                            : passwordInput.length && themeName !== "dark-theme"
                            ? "background-hover-next-btn-light-theme"
                            : null
                        }
                        onClick={() => {
                          if (passwordInput.length) {
                            handlePasswordConfirmation();
                          } else {
                            navigate("/settings/email");
                          }
                        }}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                          color:
                            !passwordInput.length && themeName === "dark-theme"
                              ? "white"
                              : !passwordInput.length &&
                                themeName !== "dark-theme"
                              ? "black"
                              : passwordInput.length &&
                                themeName === "dark-theme"
                              ? "black"
                              : passwordInput.length &&
                                themeName !== "dark-theme"
                              ? "white"
                              : null,
                          backgroundColor:
                            !passwordInput.length && themeName === "dark-theme"
                              ? "black"
                              : !passwordInput.length &&
                                themeName !== "dark-theme"
                              ? "white"
                              : passwordInput.length &&
                                themeName === "dark-theme"
                              ? "white"
                              : passwordInput.length &&
                                themeName !== "dark-theme"
                              ? "black"
                              : null,
                          border:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                        }}
                      >
                        {passwordInput.length
                          ? "Next"
                          : !passwordInput.length
                          ? "Cancel"
                          : null}
                      </Button>
                    </div>
                  </>
                ) : tabIndex === 2 ? (
                  <>
                    <div className="icon">
                      <div
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={50}
                          height={30}
                          viewBox="0 0 100 100"
                        >
                          {/* İçi dolu bir kare */}
                          <rect
                            x="5"
                            y="5"
                            width="90"
                            height="90"
                            fill="#1C9BEF"
                            rx="5"
                            ry="5"
                            style={{
                              filter:
                                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                            }}
                          />

                          <text
                            x="27.5"
                            y="70"
                            fontFamily="Arial"
                            fontSize="60"
                            fill="#FFF"
                            stroke="#FFF"
                            strokeWidth="2"
                          >
                            C
                          </text>
                        </svg>
                      </div>
                    </div>
                    <div
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: font31.fontSize,
                          lineHeight: font31.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-1"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-1"
                        }
                      >
                        Change email
                      </div>
                      <div
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-2"
                        }
                      >
                        Your current email is {userInfo.email}. What would you
                        like to update it to? Your email is not displayed in
                        your public profile on C.
                      </div>
                      <div
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-4"
                            : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-4"
                        }
                      >
                        If you change your email address, any existing Google
                        SSO connections will be removed. Review Connected
                        accounts{" "}
                        <span className="hover-blue-underline">here</span>.
                      </div>
                    </div>
                    <div
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                      }}
                    >
                      <TextField
                        autoFocus
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        value={email}
                        type="text"
                        onChange={handleEmailChange}
                        style={{
                          width: "100%",
                          height: "58px",
                          marginTop: "3rem",
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
                            border:
                              emailTypeError === 304 ||
                              (emailTypeError === 200 && email.length)
                                ? "2px solid rgb(244, 33, 46)!important"
                                : "2px solid #1d9bf0 !important",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              emailTypeError === 304 ||
                              (emailTypeError === 200 && email.length)
                                ? "rgb(244, 33, 46)!important"
                                : themeName === "dark-theme"
                                ? "rgb(70, 70, 70) !important"
                                : "#cfd9de !important",
                          },
                          "& .MuiInputLabel-shrink": {
                            color:
                              emailTypeError === 304 ||
                              (emailTypeError === 200 && email.length)
                                ? "rgb(244, 33, 46)!important"
                                : "#1f9cf0 !important",
                          },
                        }}
                      />
                    </div>

                    <div
                      style={{
                        width: "100%",
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                      }}
                    >
                      {emailTypeError === 304 && email.length ? (
                        <div
                          className="chirp-regular-font"
                          style={{
                            width: "81.5%",
                            color: "rgb(244, 33, 46)",
                            fontSize: font13.fontSize,
                            lineHeight: font13.lineHeight,
                            position: "relative",
                            left: "10px",
                          }}
                        >
                          {"Please enter a valid email."}
                        </div>
                      ) : emailTypeError === 200 && email.length ? (
                        <div
                          className="chirp-regular-font"
                          style={{
                            width: "81.5%",
                            color: "rgb(244, 33, 46)",
                            fontSize: font13.fontSize,
                            lineHeight: font13.lineHeight,
                            position: "relative",
                            left: "10px",
                          }}
                        >
                          {"Email has already been taken."}
                        </div>
                      ) : null}
                    </div>
                    <div
                      className="mt-4"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                        }
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Let people who have your email address find and connect
                        with you on C.{" "}
                        <span className="hover-blue-underline">Learn more</span>
                      </div>
                      <div>
                        {" "}
                        <div
                          onClick={() =>
                            setAllowEmailDiscovery(!allowEmailDiscovery)
                          }
                          style={{
                            marginRight: "36px",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            position: "relative",
                            left: "30px",
                          }}
                          className={
                            themeName === "dark-theme" && allowEmailDiscovery
                              ? "hover-background-effect-clicked-dark-theme"
                              : themeName !== "dark-theme" &&
                                allowEmailDiscovery
                              ? "hover-background-effect-clicked-light-theme"
                              : themeName === "dark-theme" &&
                                !allowEmailDiscovery
                              ? "hover-background-effect-dark-theme"
                              : themeName !== "dark-theme" &&
                                !allowEmailDiscovery
                              ? "hover-background-effect-light-theme"
                              : ""
                          }
                        >
                          <div
                            style={{
                              backgroundColor: allowEmailDiscovery
                                ? "#1d9bf0"
                                : "transparent",
                              border: allowEmailDiscovery
                                ? ""
                                : themeName === "dark-theme"
                                ? "2px solid rgb(70,70,70)"
                                : "2px solid #0f141a",

                              borderWidth: "2px ",
                              width: "20px",
                              height: "20px",
                              position: "relative",
                              left: "8px",
                              top: "8px",
                              borderRadius: "3px",
                            }}
                          >
                            <svg
                              style={{
                                position: "relative",
                                left: "2px",
                                bottom: "4px",
                                display: allowEmailDiscovery
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
                      </div>{" "}
                    </div>
                    <div
                      className="mt-5"
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {emailTypeError ? (
                        <Button
                          className={
                            themeName === "dark-theme"
                              ? "background-hover-cancel-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                              : "background-hover-cancel-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                          }
                          onClick={() => {
                            setLoading(true);
                            setTimeout(() => {
                              navigate("/settings/email");
                            }, 300);
                            setTimeout(() => {
                              setLoading(false);
                            }, 600);
                          }}
                          style={{
                            width: "100%",
                            minHeight: "52px",
                            paddingLeft: "80px",
                            paddingRight: "80px",
                            border: "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "0px",
                              margin: "0px",
                            }}
                          >
                            <span>
                              {" "}
                              <span>Cancel</span>
                            </span>
                          </div>
                        </Button>
                      ) : (
                        <Button
                          className={
                            themeName === "dark-theme"
                              ? "background-hover-next-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                              : "background-hover-next-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                          }
                          onClick={() => {
                            setLoading(true);
                            setTimeout(() => {
                              sendEmailVerificationCode(email);
                              setTabIndex(3);
                            }, 300);
                            setTimeout(() => {
                              setLoading(false);
                            }, 600);
                          }}
                          style={{
                            width: "100%",
                            minHeight: "52px",
                            paddingLeft: "80px",
                            paddingRight: "80px",
                            border: "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "0px",
                              margin: "0px",
                            }}
                          >
                            <span>
                              {" "}
                              <span>Next</span>
                            </span>
                          </div>
                        </Button>
                      )}
                    </div>
                  </>
                ) : tabIndex === 3 ? (
                  <>
                    {" "}
                    <div
                      style={{
                        position: "absolute",
                        left: "0px",
                        top: "10px",
                      }}
                    >
                      <div className="settings-header-with-arrow">
                        <div
                          onClick={() => {
                            setTabIndex(tabIndex - 1);
                          }}
                          className={`arrow arrow-${themeName} mt-2`}
                          style={{
                            position: "relative",
                            width: "36px",
                            height: " 36px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "5px",
                          }}
                        >
                          {" "}
                          <svg
                            color={themeName === "dark-theme" ? "white" : ""}
                            fill="currentColor"
                            style={{
                              position: "absolute",
                              border: "none",
                            }}
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                          >
                            <g>
                              <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                            </g>
                          </svg>
                        </div>
                      </div>{" "}
                    </div>
                    <div className="icon">
                      <div
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={50}
                          height={30}
                          viewBox="0 0 100 100"
                        >
                          {/* İçi dolu bir kare */}
                          <rect
                            x="5"
                            y="5"
                            width="90"
                            height="90"
                            fill="#1C9BEF"
                            rx="5"
                            ry="5"
                            style={{
                              filter:
                                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                            }}
                          />

                          <text
                            x="27.5"
                            y="70"
                            fontFamily="Arial"
                            fontSize="60"
                            fill="#FFF"
                            stroke="#FFF"
                            strokeWidth="2"
                          >
                            C
                          </text>
                        </svg>
                      </div>
                    </div>
                    <div
                      ref={showOptionsReceivedEmailRef}
                      style={{
                        position: "absolute",
                        right: "0px",
                        top: "0px",
                        display: showOptionsReceivedEmail ? "flex" : "none",
                        flexDirection: "column",
                        borderRadius: "16px",
                        filter:
                          themeName === "dark-theme"
                            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                            : "",
                        boxShadow:
                          themeName === "dark-theme"
                            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                        zIndex: 9999,
                        transform: `scale(${
                          showOptionsReceivedEmail ? "1" : "0.8"
                        })`,
                        animation: "fadeIn 0.5s ease",
                      }}
                    >
                      <div
                        className="chirp-regular-font"
                        style={{
                          border: "none",
                          outlineStyle: "none",
                          cursor: "pointer",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          padding: "12px",
                          color: themeName === "dark-theme" ? "white" : "",
                        }}
                      >
                        {"Didn't receive email?"}
                      </div>
                      <div
                        onClick={() => {
                          sendEmailVerificationCode(email);
                        }}
                        className={`resend-email resend-email-${themeName} chirp-bold-font`}
                        style={{
                          border: "none",
                          outlineStyle: "none",
                          cursor: "pointer",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          padding: "12px",
                          color: themeName === "dark-theme" ? "white" : "",
                        }}
                      >
                        {"Resend email"}
                      </div>
                      <BootstrapTooltip
                        title="This feature is not yet active. "
                        themeName={
                          themeName === "dark-theme"
                            ? "dark-theme"
                            : "light-theme"
                        }
                      >
                        <div
                          className={`use-phone-instead use-phone-instead-${themeName} chirp-regular-font`}
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                            fontWeight: "700",
                            padding: "12px",
                            opacity: "0.5",
                            borderBottomRightRadius: "16px",
                            borderBottomLeftRadius: "16px",
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          {"Use phone instead"}{" "}
                        </div>
                      </BootstrapTooltip>
                    </div>{" "}
                    <div
                      style={{
                        width: "81.5%",
                        marginTop: "2rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: font31.fontSize,
                          lineHeight: font31.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        }
                      >
                        We sent you a code
                      </div>
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-2"
                        }
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Enter the verification code sent to {email.slice(0, 2)}
                        **********@gmail.com.
                      </div>
                    </div>
                    <TextField
                      className="mt-4"
                      error={
                        emailVerificationCode.length &&
                        emailVerificationCodeStatus === 404
                          ? "true"
                          : ""
                      }
                      autoFocus={true}
                      value={confirmEmailVerificationCode}
                      onChange={(e) => handleChangeEmailVerificationCode(e)}
                      type="text"
                      id="outlined-basic"
                      variant={"outlined"}
                      label={`Verification code`}
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
                              ? "rgb(70,70,70) !important"
                              : "#cfd9de !important",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: "#1f9cf0 !important",
                        },
                      }}
                    />
                    <div
                      onClick={() =>
                        setShowOptionsReceivedEmail(!showOptionsReceivedEmail)
                      }
                      style={{
                        width: "81.5%",
                      }}
                    >
                      <div
                        className="didn-t-receive-email-text chirp-regular-font"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          left: "10px",
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,
                          color: "#1f9cf0",
                          display: "inline-block",
                          float: "left",
                        }}
                      >
                        {"Didn't receive email?"}
                      </div>
                    </div>
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                        opacity: confirmEmailVerificationCode.length
                          ? "1"
                          : "0.5",
                      }}
                      onClick={
                        emailVerificationCode.length &&
                        emailVerificationCodeStatus === 201 &&
                        emailVerificationCode === confirmEmailVerificationCode
                          ? () => {
                              setLoading(true);
                              handleUpdateEmail();
                              setTimeout(() => {
                                setLoading(false);
                                navigate("/settings/email");
                              }, 500);
                            }
                          : () => errorMessageAndCleanTextInput()
                      }
                      className={`next-btn ${themeName}-white-btn`}
                    >
                      Next
                    </Button>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LoadingSpinner
                    strokeColor={"rgb(29, 155, 240)"}
                    fontSize={true}
                  ></LoadingSpinner>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </>
      <Col
        xs={10}
        sm={10}
        md={11}
        lg={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        xxl={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        className={`right-side-column-settings-account-page`}
        style={{
          borderLeft:
            width < 1000
              ? themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : "1px solid rgb(70, 70, 70)"
              : null,
          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          margin: "0px",
          width: width > 1400 ? "600px" : width <= 500 ? "100%" : null,
          position: "relative",
          right: "10px",
        }}
      >
        <div className="settings-header-with-arrow ">
          <div
            onClick={() => {
              navigate(-1);
            }}
            className={`arrow arrow-${themeName} mt-2`}
            style={{
              position: "relative",
              width: "36px",
              height: " 36px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "5px",
            }}
          >
            {" "}
            <svg
              color={themeName === "dark-theme" ? "white" : ""}
              fill="currentColor"
              style={{
                position: "absolute",
                border: "none",
              }}
              width={20}
              height={20}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
            >
              <g>
                <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
              </g>
            </svg>
          </div>
          <div
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Change email
          </div>
        </div>{" "}
        <div
          style={{
            padding: "0px 24px",
            position: "relative",
          }}
        >
          {" "}
          <div
            className="chirp-regular-font"
            style={{
              position: "absolute",
              top: "10%",
              left: "6%",
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
              minWidth: "fit-content",
              color:
                themeName === "dark-theme" ? "#383B3D" : "rgb(168,177,184)",
            }}
          >
            Current
          </div>
          <div
            className={"mt-3"}
            type="text"
            style={{
              height: "56px",
              width: "100%",
              borderRadius: "4px",
              backgroundColor:
                themeName === "dark-theme" ? "#111214" : "rgb(248,249,250)",
            }}
          />
          <input
            type="text"
            defaultValue={userInfo.email}
            style={{
              height: "50px",
              position: "absolute",
              top: "5%",
              left: "6%",
              width: "87%",
              minWidth: "fit-content",
              border: "none",
              outline: "none",
              paddingTop: "15px",
              textAlign: "left",
              paddingLeft: "0px",
              paddingRight: "0px",
              paddingBottom: "0px",
              backgroundColor: "transparent",
              color:
                themeName === "dark-theme" ? "#383B3D" : "rgb(168,177,184)",
            }}
          />
        </div>{" "}
        <div
          className="mt-4"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            display: "inline-block",
            width: "100%",
          }}
        ></div>
        <div
          onClick={() => {
            navigate("/i/flow/add_email");
          }}
          className={
            themeName === "dark-theme"
              ? "dark-theme-stylish-blue-background-color chirp-regular-font"
              : "light-theme-stylish-blue-background-color chirp-regular-font"
          }
          style={{
            padding: "16px",
            textAlign: "center",
            color: "rgb(29, 155, 240)",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
            cursor: "pointer",
          }}
        >
          Update email address
        </div>
      </Col>
    </>
  );
}

export default ChangeYourEmail;
