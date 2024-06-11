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

import {
  getCountries,
  getCountryCallingCode,
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function AddYourPhoneNumber() {
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { userInfo, getToken } = useContext(UserContext);

  const [showModal, setShowModal] = useState(true);
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
  const [wrongPasswordMessageActive, setWrongPasswordMessageActive] =
    useState(null);
  const [
    wrongVerificationCodeMessageActive,
    setWrongVerificationCodeMessageActive,
  ] = useState(null);
  const handlePasswordConfirmation = () => {
    axios
      .post(`${API_URL}/auth/password-check`, {
        verifyPasswordInput: passwordInput,
        userId: userInfo._id,
      })
      .then(() => {
        setLoading(true);
        setWrongPasswordMessageActive(false);
        setTimeout(() => {
          setLoading(false);
          handleTabIndexState();
        }, 300);
      })
      .catch(() => {
        setWrongPasswordMessageActive(true);
        showCustomMessage("Wrong password!", 4);
      });
  };

  const [phoneVerificationCodeStatus, setPhoneVerificationCodeStatus] =
    useState("");
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");

  const sendVerificationCodeSMS = async (countryCode, phoneNumber) => {
    try {
      const response = await axios.post(
        `${API_URL}/phone_verification_code`,
        {
          countryCode,
          toNumber: phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (response) {
        console.log("Response =>", response);
        if (response.status === 201) {
          setPhoneVerificationCodeStatus(201);
          setPhoneVerificationCode(response.data.code);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [confirmPhoneVerificationCode, setconfirmPhoneVerificationCode] =
    useState("");
  const handlePhoneVerificationCode = (e) => {
    setconfirmPhoneVerificationCode(e.target.value);
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
      setWrongVerificationCodeMessageActive(true);
      setconfirmPhoneVerificationCode("");
      showCustomMessage(
        "The code you entered is incorrect. Please try again.",
        4
      );
    }, 300);
  };

  const checkIfVerificationCodeMatch = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/verify_code`,
        {
          verificationCodeInput: phoneVerificationCode,
          phoneNumberInput: phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (response) {
        console.log("Response =>", response);
        navigate("/settings/phone");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [country, setCountry] = useState("");
  const [validPhoneNumber, setvalidPhoneNumber] = useState(false);
  const [validPhoneNumber2, setvalidPhoneNumber2] = useState(false);
  const [phoneNumber, setphoneNumber] = useState(null);
  const [onFocusedToPhoneNumberField, setonFocusedToPhoneNumberField] =
    useState(false);
  const [errorPhoneInValidMessage, setErrorPhoneInValidMessage] = useState(" ");
  const [errorPhoneInValidMessage2, setErrorPhoneInValidMessage2] =
    useState(" ");

  const [
    showpopoverCountriesAndTheirPhoneCode,
    setpopoverCountriesAndTheirPhoneCode,
  ] = useState(false);
  const selectRef = useRef(null);
  const handleShowOptions = () => {
    setpopoverCountriesAndTheirPhoneCode(true);
    selectRef.current.focus();
  };
  const sortedCountries = getCountries().sort((a, b) => {
    if (a < b) return -1; // A'dan Z'ye doğru sıralama
    if (a > b) return 1; // Z'den A'ya doğru sıralama
    return 0; // Eşitlik durumu
  });
  const handleSelectChange = (event) => {
    setpopoverCountriesAndTheirPhoneCode(true);
    setCountry(event.target.value || undefined);
  };
  const [clicked, setClicked] = useState(false);

  const [subErrorPhoneVerifiedTabLoading, setsubErrorPhoneVerifiedTabLoading] =
    useState(false);
  const [phoneVerified, setphoneVerified] = useState(false);
  const [showSendVerificationModal, setShowSendVerificationModal] =
    useState(false);

  const handleSendVerificationModalClose = () => {
    setShowSendVerificationModal(false);
  };

  const [editClicked, setEditClicked] = useState(null);

  const [user, setUser] = useState([]);
  const refreshActiveUser = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  useEffect(() => {
    refreshActiveUser();
  }, []);

  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFirstLoading(false);
    }, 200);
  });

  useEffect(() => {
    if (
      (isPossiblePhoneNumber(`${phoneNumber}`, country) &&
        isValidPhoneNumber(`${phoneNumber}`, country)) ||
      (isPossiblePhoneNumber(`${phoneNumber}`, "DE") &&
        isValidPhoneNumber(`${phoneNumber}`, "DE"))
    ) {
      setTimeout(() => {
        setvalidPhoneNumber(true);
        setErrorPhoneInValidMessage("");
      }, 500);
    } else if (!phoneNumber) {
      setTimeout(() => {
        setErrorPhoneInValidMessage("");
        setvalidPhoneNumber("unknown");
      }, 500);
    } else {
      setTimeout(() => {
        setErrorPhoneInValidMessage("Please enter a valid phone number.");
        setvalidPhoneNumber(false);
      }, 500);
    }
  }, [phoneNumber]);

  const handlePhoneNumberCheck = async () => {
    try {
      console.log("Here is working!");
      const response = await axios.post(
        `${API_URL}/auth/phone-number-check`,
        { phone_number_input: phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log("Response =>", response);
      if (response) {
        setErrorPhoneInValidMessage2("");
        setvalidPhoneNumber2(true);
      }
    } catch (error) {
      if (error.response.status === 501) {
        setErrorPhoneInValidMessage2(
          "Your phone number cannot contain spaces. Please choose a phone number without spaces."
        );
        setvalidPhoneNumber2(false);
      } else if (error.response.status === 409) {
        setErrorPhoneInValidMessage2(
          "That phone number has been taken. Please choose another."
        );
        setvalidPhoneNumber2(false);
      }
      console.error("Error =>", error);
      console.error("Error status =>", error.response.status);
    }
  };

  useEffect(() => {
    handlePhoneNumberCheck();
  }, [phoneNumber]);

  return (
    <>
      {" "}
      {contextHolder}
      <SettingsNavigation />
      <>
        <>
          <Modal
            style={{
              padding: "0px",
              margin: "0px",
              zIndex: 99999999,
            }}
            centered
            show={showSendVerificationModal}
            onHide={handleSendVerificationModalClose}
            backdropClassName={
              themeName === "dark-theme" && !showSendVerificationModal
                ? `back-drop-${themeName}`
                : themeName !== "dark-theme" && !showSendVerificationModal
                ? "light-theme-back-drop"
                : themeName === "dark-theme" && showSendVerificationModal
                ? "dark-theme-back-drop-nested-top"
                : themeName !== "dark-theme" && showSendVerificationModal
                ? "light-theme-back-drop-nested-top"
                : null
            }
            className="delete-post nested-modal-first"
            contentClassName={
              themeName === "dark-theme"
                ? "delete-post-modal-dark-theme"
                : "delete-post-modal"
            }
          >
            <Modal.Body>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingBottom: "16px",
                  paddingTop: "16px",
                  maxWidth: "256px",
                }}
              >
                <div
                  className="chirp-bold-font"
                  style={{
                    color: themeName === "dark-theme" ? "white" : "",

                    fontSize: "20px",
                    lineHeight: "24px",
                  }}
                >
                  Verify phone
                </div>
                <div
                  style={{
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",

                    fontSize: "15px",
                    lineHeight: "20px",
                  }}
                  className="mt-2 chirp-regular-font"
                >
                  We'll send your verification code to {phoneNumber}. Standard
                  SMS, call and data fees may apply.
                </div>
              </div>
              <div
                className="mt-2"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={() => {
                    sendVerificationCodeSMS(
                      country
                        ? getCountryCallingCode(country)
                        : getCountryCallingCode("DE"),
                      phoneNumber
                    );
                    setTabIndex(3);
                    setShowSendVerificationModal(false);
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "background-hover-next-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                      : "background-hover-next-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                  }
                  style={{
                    minHeight: "44px",
                    border: "none",
                    backgroundColor:
                      themeName === "dark-theme" ? "white" : "black",
                    maxWidth: "81.5%",
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
                      color: themeName === "dark-theme" ? "black" : "white",
                    }}
                  >
                    <span>
                      {" "}
                      <span
                        style={{
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                      >
                        OK
                      </span>
                    </span>
                  </div>
                </Button>
              </div>{" "}
              <div
                className="mt-2 mb-3"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  className={
                    themeName === "dark-theme"
                      ? "background-hover-cancel-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                      : "background-hover-cancel-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                  }
                  style={{
                    minHeight: "44px",
                    border: "none",
                    backgroundColor:
                      themeName === "dark-theme" ? "white" : "black",
                    maxWidth: "81.5%",
                  }}
                  onClick={() => {
                    setEditClicked(true);
                    setShowSendVerificationModal(false);
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
                      color: themeName === "dark-theme" ? "black" : "white",
                    }}
                  >
                    <span>
                      {" "}
                      <span
                        style={{
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                      >
                        Edit
                      </span>
                    </span>
                  </div>
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </>
      </>
      <>
        <Modal
          backdropClassName={
            themeName === "dark-theme" &&
            !wrongPasswordMessageActive &&
            !wrongVerificationCodeMessageActive
              ? `back-drop-${themeName}`
              : themeName !== "dark-theme" &&
                !wrongPasswordMessageActive &&
                !wrongVerificationCodeMessageActive
              ? "light-theme-back-drop"
              : null
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
            zIndex:
              wrongPasswordMessageActive || wrongVerificationCodeMessageActive
                ? null
                : 9999,
          }}
          show={showModal}
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
                          fontSize: "15px",
                          lineHeight: "20px",
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
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                          }
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
                                  fill={
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black"
                                  }
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
                                  fill={
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black"
                                  }
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
                            navigate("/settings/phone");
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
                          fontSize: "31px",
                          lineHeight: "36px",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-1"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-1"
                        }
                      >
                        Add a phone number
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-2"
                        }
                      >
                        Enter the phone number you’d like to associate with your
                        Connectify account.
                      </div>
                    </div>
                    {/* start to check your phone number */}
                    <div
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                      }}
                    >
                      <div
                        className="mt-5"
                        onClick={handleShowOptions}
                        style={{
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "#536471",
                          width: "100%",
                          minHeight: "58px",
                          padding: "4px",
                          border: "1px solid rgb(207, 217, 222)",
                          borderWidth:
                            showpopoverCountriesAndTheirPhoneCode || editClicked
                              ? "2px"
                              : "1px",
                          borderColor:
                            showpopoverCountriesAndTheirPhoneCode || editClicked
                              ? "#1d9bf0"
                              : themeName === "dark-theme"
                              ? "rgb(70,70,70)"
                              : "#cfd9de",
                        }}
                      >
                        <div
                          onClick={handleShowOptions}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            onClick={handleShowOptions}
                            className="main-outline-text-year-picker"
                            style={{
                              padding: "0px 8px",
                              fontSize: "14px",
                              lineHeight: "16px",
                              fontWeight: "400",
                              color: showpopoverCountriesAndTheirPhoneCode
                                ? "#1d9bf0"
                                : "rgba(83,100,113,1.00)",
                            }}
                          >
                            <span
                              style={{
                                color:
                                  themeName === "dark-theme" ? "#71767A" : "",
                              }}
                            >
                              Country code
                            </span>
                            <div
                              onClick={handleShowOptions}
                              className="mt-2 selected-year-string-parent-div"
                              style={{
                                fontSize: "17px",
                                lineHeight: "20px",
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              {country ? (
                                <>
                                  +{getCountryCallingCode(country)}{" "}
                                  {en[country]}
                                </>
                              ) : (
                                <>
                                  +{getCountryCallingCode("DE")} {en["DE"]}
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            onClick={handleShowOptions}
                            style={{
                              position: "relative",
                              top: "10px",
                            }}
                          >
                            <svg
                              onClick={handleShowOptions}
                              width="24"
                              height="24"
                              color={
                                showpopoverCountriesAndTheirPhoneCode
                                  ? "#1d9bf0"
                                  : themeName === "dark-theme"
                                  ? "rgb(70,70,70)"
                                  : "rgba(83,100,113,1.00)"
                              }
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="svg-year-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                            >
                              <g
                                onClick={handleShowOptions}
                                className="path-parent-g-year-picker"
                              >
                                <path
                                  onClick={handleShowOptions}
                                  d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"
                                ></path>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>{" "}
                    </div>
                    <div
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                      }}
                    >
                      <select
                        onClick={handleShowOptions}
                        onBlur={() => {
                          setEditClicked(false);
                          setpopoverCountriesAndTheirPhoneCode(false);
                        }}
                        ref={selectRef}
                        style={{
                          position: "relative",
                          bottom: "58px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "#536471",
                          width: "100%",
                          minHeight: "58px",
                          padding: "4px",
                          border: "1px solid rgb(207, 217, 222)",
                          borderWidth: showpopoverCountriesAndTheirPhoneCode
                            ? "2px"
                            : "1px",
                          opacity: 0,
                        }}
                        value={country}
                        onChange={handleSelectChange}
                      >
                        <option value="">{en["ZZ"]}</option>
                        {sortedCountries.map((country, index) => (
                          <option key={country._id} value={country}>
                            +{getCountryCallingCode(country)} {en[country]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                      }}
                    >
                      <TextField
                        error={
                          (validPhoneNumber || validPhoneNumber2) &&
                          phoneNumber?.length
                        }
                        autoFocus={true}
                        onFocus={() => setEditClicked(false)}
                        onMouseEnter={() => {
                          setonFocusedToPhoneNumberField(true);
                        }}
                        onMouseLeave={() =>
                          setonFocusedToPhoneNumberField(false)
                        }
                        value={phoneNumber}
                        onChange={(e) => setphoneNumber(e.target.value)}
                        type="text"
                        id="outlined-basic"
                        variant={"outlined"}
                        label={`Your phone number`}
                        style={{
                          width: "100%",
                          height: "58px",
                          position: "relative",
                          bottom: "45px",
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
                            border:
                              !validPhoneNumber || !validPhoneNumber2
                                ? "2px solid rgb(244, 33, 46)!important"
                                : "2px solid #1d9bf0 !important",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              !validPhoneNumber || !validPhoneNumber2
                                ? "rgb(244, 33, 46)!important"
                                : themeName === "dark-theme"
                                ? "rgb(70,70,70) !important"
                                : "#cfd9de !important",
                          },
                          "& .MuiInputLabel-shrink": {
                            color:
                              !validPhoneNumber || !validPhoneNumber2
                                ? "rgb(244, 33, 46)!important"
                                : "#1f9cf0 !important",
                          },
                        }}
                      />
                      <div
                        style={{
                          color: "rgb(244, 33, 46)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                          position: "relative",
                          left: "10px",
                          bottom: "45px",
                        }}
                      >
                        {errorPhoneInValidMessage
                          ? errorPhoneInValidMessage
                          : errorPhoneInValidMessage2
                          ? errorPhoneInValidMessage2
                          : null}
                      </div>
                    </div>
                    {/* finish to check your phone number  */}
                    {/* footer text and check box  start to check */}
                    <div
                      style={{
                        width: "100%",
                        gap: "2.5%",
                        display: "flex",
                        position: "relative",
                        bottom: "20px",
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                      }}
                    >
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "white"
                              : "rgb(83, 100, 113)",
                          fontSize: "15px",
                          lineHeight: "20px",
                          fontWeight: "400",
                          position: "relative",
                          bottom: "4px",
                        }}
                      >
                        Let people who have your phone number find and connect
                        with you on Connectify.{" "}
                        <span
                          className="learn-more-add-phone-number chirp-regular-font"
                          style={{
                            color: "rgb(29, 155, 240)",
                            cursor: "pointer",
                          }}
                        >
                          Learn more
                        </span>
                      </div>
                      <div
                        style={{
                          width: "50px",
                          minHeight: "50px",
                        }}
                      >
                        <div
                          onClick={() => setClicked(!clicked)}
                          style={{
                            width: "36px",
                            minHeight: "36px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            marginBlock: "0.5em",
                          }}
                          className={
                            themeName === "dark-theme" && clicked
                              ? "hover-background-effect-clicked-dark-theme"
                              : themeName !== "dark-theme" && clicked
                              ? "hover-background-effect-clicked-light-theme"
                              : themeName === "dark-theme" && !clicked
                              ? "hover-background-effect-dark-theme"
                              : themeName !== "dark-theme" && !clicked
                              ? "hover-background-effect-light-theme"
                              : ""
                          }
                        >
                          <div
                            style={{
                              backgroundColor: clicked
                                ? "#1d9bf0"
                                : "transparent",
                              border: clicked
                                ? "none"
                                : themeName === "dark-theme"
                                ? "2px solid rgb(70,70,70)"
                                : "2px solid #536471",

                              borderWidth: "2px ",
                              width: "20px",
                              minHeight: "20px",
                              position: "relative",
                              left: "8px",
                              top: "8px",
                              borderRadius: "3px",
                            }}
                          >
                            <svg
                              style={{
                                position: "relative",
                                left: clicked ? "2px" : "",
                                top: clicked ? "2px" : "",
                                display: clicked ? "block" : "none",
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
                    </div>
                    {/* footer text and check box  finish to check */}
                    {validPhoneNumber &&
                    phoneNumber?.length &&
                    validPhoneNumber !== "unknown" ? (
                      <Button
                        style={{
                          width: "81.5%",
                          height: "52px",
                          color: "white",
                          fontSize: "17px",
                          fontWeight: "700",
                          lineHeight: "20px",
                          position: "absolute",
                          bottom: "20px",
                        }}
                        className={`login-button next-btn ${themeName}-white-btn`}
                        variant="dark"
                        onClick={() => {
                          if (validPhoneNumber && validPhoneNumber2) {
                            setShowSendVerificationModal(true);
                          }
                        }}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        style={{
                          width: "81.5%",
                          height: "52px",
                          color: themeName === "dark-theme" ? "white" : "black",
                          fontSize: "17px",
                          fontWeight: "700",
                          lineHeight: "20px",
                          position: "absolute",
                          bottom: "20px",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "background-hover-cancel-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : "background-hover-cancel-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        }
                        variant="light"
                        onClick={() => {
                          setsubErrorPhoneVerifiedTabLoading(true);
                          navigate("/settings/phone");
                          setTimeout(() => {
                            setphoneVerified(false);
                            setTabIndex(null);
                            setCountry("");
                            setsubErrorPhoneVerifiedTabLoading(false);
                          }, 500);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
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
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
                          padding: "12px",
                          color: themeName === "dark-theme" ? "white" : "",
                        }}
                      >
                        {"Didn't receive the code?"}
                      </div>
                      <div
                        onClick={() => {
                          sendVerificationCodeSMS(
                            country
                              ? getCountryCallingCode(country)
                              : getCountryCallingCode("DE"),
                            phoneNumber
                          );
                          setShowOptionsReceivedEmail(false);
                        }}
                        className={`resend-phone-number-code resend-phone-number-code-${themeName} chirp-bold-font`}
                        style={{
                          borderBottomRightRadius: "16px",
                          borderBottomLeftRadius: "16px",
                          outlineStyle: "none",
                          cursor: "pointer",
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "700",
                          padding: "12px",
                          color: themeName === "dark-theme" ? "white" : "",
                        }}
                      >
                        {"Resend"}
                      </div>
                    </div>{" "}
                    <div
                      style={{
                        width: "81.5%",
                        marginTop: "2rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "32px",
                          lineHeight: "26px",
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
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                      >
                        Enter it below to verify {phoneNumber}.
                      </div>
                    </div>
                    <TextField
                      className="mt-4"
                      error={
                        phoneVerificationCode?.length &&
                        phoneVerificationCodeStatus === 404
                          ? "true"
                          : ""
                      }
                      autoFocus={true}
                      value={confirmPhoneVerificationCode}
                      onChange={(e) => handlePhoneVerificationCode(e)}
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
                      style={{
                        width: "81.5%",
                      }}
                    >
                      <div
                        onClick={() =>
                          setShowOptionsReceivedEmail(!showOptionsReceivedEmail)
                        }
                        className="hover-blue-underline"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          left: "10px",
                          fontSize: "13px",
                          fontWeight: "400",
                          lineHeight: "16px",
                          color: "#1f9cf0",
                          display: "inline-block",
                          float: "left",
                        }}
                      >
                        {"Didn't receive code?"}
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
                        opacity: confirmPhoneVerificationCode.length
                          ? "1"
                          : "0.5",
                      }}
                      onClick={
                        phoneVerificationCode?.length &&
                        phoneVerificationCodeStatus === 201 &&
                        phoneVerificationCode === confirmPhoneVerificationCode
                          ? () => {
                              // setLoading(true);
                              checkIfVerificationCodeMatch();
                              setTimeout(() => {
                                // setLoading(false);
                                // navigate("/settings/phone");
                              }, 500);
                            }
                          : () => errorMessageAndCleanTextInput()
                      }
                      className={`next-btn ${themeName}-white-btn`}
                    >
                      Verify
                    </Button>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "15px",
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
              if (navigationHistoryArray[1] !== "/i/flow/add_phone") {
                navigate(-1);
              } else {
                navigate("/settings/account");
              }
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
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Change phone
          </div>
        </div>{" "}
        {firstLoading ? (
          <div
            style={{
              fontSize: "15px",
              width: "100%",
            }}
          >
            <LoadingSpinner strokeColor={"rgb(29, 155, 240)"}></LoadingSpinner>
          </div>
        ) : (
          <>
            {user.phoneNumber?.length ? (
              <>
                <div
                  style={{
                    padding: "0px 24px",
                    position: "relative",
                  }}
                >
                  {" "}
                  <div
                    style={{
                      position: "absolute",
                      top: "10%",
                      left: "6%",
                      fontSize: "12px",
                      lineHeight: "18px",
                      fontWeight: "400",
                      minWidth: "fit-content",
                      //   width: "80%",
                      color:
                        themeName === "dark-theme"
                          ? "#383B3D"
                          : "rgb(168,177,184)",
                      // zIndex: 9999,
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
                        themeName === "dark-theme"
                          ? "#111214"
                          : "rgb(248,249,250)",
                    }}
                  />
                  <input
                    type="text"
                    defaultValue={user?.phoneNumber[0]?.withPlusSign}
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
                        themeName === "dark-theme"
                          ? "#383B3D"
                          : "rgb(168,177,184)",
                    }}
                  />
                </div>
                <div
                  className="mt-4"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",

                    width: "100%",
                  }}
                ></div>
                <div
                  onClick={() => {
                    navigate("/i/flow/add_phone");
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "dark-theme-stylish-blue-background-color mt-1"
                      : "light-theme-stylish-blue-background-color mt-1"
                  }
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "rgb(29, 155, 240)",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "400",
                    cursor: "pointer",
                  }}
                >
                  Update phone number
                </div>
                <div
                  onClick={() => {
                    setShowDeletePhoneNumberModal(true);
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "deactivate-btn-dark-theme mt-1"
                      : "deactivate-btn-light-theme mt-1"
                  }
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#F4212D",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "400",
                    cursor: "pointer",
                  }}
                >
                  Delete phone number
                </div>
              </>
            ) : (
              <div
                onClick={() => {
                  navigate("/i/flow/add_phone");
                }}
                className={
                  themeName === "dark-theme"
                    ? "dark-theme-stylish-blue-background-color mt-1"
                    : "light-theme-stylish-blue-background-color mt-1"
                }
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "rgb(29, 155, 240)",
                  lineHeight: "20px",
                  fontSize: "15px",
                  fontWeight: "400",
                  cursor: "pointer",
                }}
              >
                Add phone number
              </div>
            )}
          </>
        )}
      </Col>
    </>
  );
}

export default AddYourPhoneNumber;
