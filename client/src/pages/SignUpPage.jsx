import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Modal, Popover, OverlayTrigger } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { Divider } from "antd";
import LogInPage from "./LogInPage";

import {
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormControl,
  TextField,
} from "@mui/material";

import LoadingSpinner from "../components/ui/LoadingSpinner";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { ThemeContext } from "../context/ThemeContext";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function SignUpPage() {
  const [{ theme, themeName }] = useContext(ThemeContext);
  const {
    getFontSizeAndLineHeight64,
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight26,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
    getFontSizeAndLineHeight11,
  } = useFontSizeHandler();
  const font64 = getFontSizeAndLineHeight64();
  const font31 = getFontSizeAndLineHeight31();
  const font26 = getFontSizeAndLineHeight26();
  const font20 = getFontSizeAndLineHeight20();
  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
  const font13 = getFontSizeAndLineHeight13();
  const font11 = getFontSizeAndLineHeight11();
  const [fullname, setFullname] = useState("");
  const [fullnameFilled, setfullnameFilled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { getToken, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [signedUpWithGoogle, setsignedUpWithGoogle] = useState(false);
  const [signedUpWithVariantOne, setsignedUpWithVariantOne] = useState(false);

  const googleAuth = () => {
    window.open(`${API_URL}/auth/google/callback`, "_self");
  };

  const { showCustomMessage, contextHolder } = useAntdMessageHandler();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const [showCreateAccountModal, setshowCreateAccountModal] = useState(false);
  const handleCloseCreateAccountModal = () => {
    setshowCreateAccountModal(false);
    setTabIndex(0);
  };

  const [tabLoading, setTabLoading] = useState(null);

  const [firstAppearence, setFirstAppearance] = useState(true);
  const handleShowCreateAccountModal = () => {
    setTabLoading(true);
    setshowCreateAccountModal(true);
    setTimeout(() => {
      setTabLoading(false);
    }, 500);
  };

  const handleChangeFullName = (e) => {
    if (e.target.value.length <= 50) {
      setFullname(e.target.value);
      setfullnameFilled(false);
      setFirstAppearance(false);
      setcheckFields((prevState) => ({
        ...prevState,
        nameInput: true,
      }));
    }
  };

  const rangeOfYears120Year = 120;
  const currentYear = new Date().getFullYear();
  const rangeNumbers = [];

  for (let i = currentYear; i >= currentYear - rangeOfYears120Year; i--) {
    rangeNumbers.push(i);
  }

  const [showMonthPicker, setshowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");

  const [showDayPicker, setshowDayPicker] = useState(false);
  const [selectedDay, setselectedDay] = useState("");

  const [showYearPicker, setshowYearPicker] = useState(false);
  const [selectedYear, setselectedYear] = useState(new Date().getFullYear());
  const [displayedYear, setdisplayedYear] = useState("");

  const [styleOfBoxMonth, setStyleOfBoxMonth] = useState(false);
  const [styleOfBoxDay, setStyleOfBoxDay] = useState(false);
  const [styleOfBoxYear, setStyleOfBoxYear] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };
  const getDaysInMonth = (month) => {
    switch (month) {
      case "January":
      case "March":
      case "May":
      case "July":
      case "August":
      case "October":
      case "December":
        return 31;
      case "April":
      case "June":
      case "September":
      case "November":
        return 30;
      case "February":
        return isLeapYear(selectedYear) ? 29 : 28;
      default:
        return 0; // Geçersiz ay ismi durumu
    }
  };

  const dayNum = [];

  const currentMonth = months[new Date().getMonth()];

  console.log("Selected month =>", selectedMonth);
  console.log("Current month =>", currentMonth);

  if (selectedMonth) {
    for (let i = 1; i <= getDaysInMonth(selectedMonth); i++) {
      dayNum.push(i);
    }
  } else {
    for (let i = 1; i <= getDaysInMonth(currentMonth); i++) {
      dayNum.push(i);
    }
  }

  const handleMonthClick = () => {
    setshowMonthPicker(!showMonthPicker);
  };

  const handleMonthSelect = (month) => {
    setTimeout(() => {
      setSelectedMonth(month);
      setshowMonthPicker(false);
    }, 300);
  };

  const handleDayClick = () => {
    setshowDayPicker(!showDayPicker);
    setStyleOfBoxDay(true);
  };

  const handleDaySelect = (day) => {
    setTimeout(() => {
      setselectedDay(day);
      setshowDayPicker(false);
      setStyleOfBoxDay(false);
    }, 300);
  };

  const handleYearClick = () => {
    setshowYearPicker(!showYearPicker);
    setStyleOfBoxYear(true);
  };

  const [yearSelectedShow, setYearSelectedShow] = useState(false);

  const handleYearSelect = (year) => {
    setTimeout(() => {
      setselectedYear(year);
      setdisplayedYear(year);
      setYearSelectedShow(true);
      setshowYearPicker(false);
      setStyleOfBoxYear(false);
    }, 300);
  };

  // later start to check
  const [onFocusedToFullNameField, setonFocusedToFullNameField] =
    useState(false);

  const [informationsAreCorrect, setinformationsAreCorrect] = useState(false);

  const [checkFields, setcheckFields] = useState({
    nameInput: false,
    emailInput: false,
    dateofbirthInput: false,
  });
  const [tabIndex, setTabIndex] = useState(0);

  const [hoveredIndexMonth, setIshoveredIndexMonth] = useState(null);
  // later finish to check
  const popoverContent = (
    <Popover
      className={`scrollbar-add scrollbar-add-${themeName}`}
      style={{
        padding: "8px",
        height: "250px",
        width: "175px",
        overflowY: "scroll",
        backgroundColor: themeName === "dark-theme" ? "black" : "#e4e2e9",
        border: "none",
        filter:
          themeName === "dark-theme"
            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
            : "",

        boxShadow:
          themeName === "dark-theme"
            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
      }}
      id="monthPopover"
    >
      {months.map((month, index) => (
        <div
          className="testtt !!!"
          onMouseEnter={() => {
            setIshoveredIndexMonth(index);
          }}
          key={index}
          onClick={() => handleMonthSelect(month)}
          style={{
            color: themeName === "dark-theme" ? "white" : "black",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: hoveredIndexMonth === index ? "#5aa0ff" : "",
            borderRadius: "4px",
          }}
        >
          {month}
        </div>
      ))}
    </Popover>
  );

  const [hoveredIndexDay, setIshoveredIndexDay] = useState(null);
  const popoverDayContent = (
    <Popover
      className={`scrollbar-add scrollbar-add-${themeName}`}
      style={{
        padding: "8px",
        height: "250px",
        width: "175px",
        border: "none",
        overflowY: "scroll",
        backgroundColor: themeName === "dark-theme" ? "black" : "#e4e2e9",
        filter:
          themeName === "dark-theme"
            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
            : "",

        boxShadow:
          themeName === "dark-theme"
            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
      }}
      id="dayPopover"
    >
      {dayNum.map((day, index) => (
        <div
          onMouseEnter={() => {
            setIshoveredIndexDay(index);
          }}
          key={index}
          onClick={() => handleDaySelect(day)}
          style={{
            color: themeName === "dark-theme" ? "white" : "black",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: hoveredIndexDay === index ? "#5aa0ff" : "",
            borderRadius: "4px",
          }}
        >
          {day}
        </div>
      ))}
    </Popover>
  );
  const [hoveredIndexYear, setIshoveredIndexYear] = useState(null);
  const popoverYearContent = (
    <Popover
      className={`scrollbar-add scrollbar-add-${themeName}`}
      style={{
        padding: "8px",
        height: "250px",
        width: "175px",
        border: "none",
        overflowY: "scroll",
        backgroundColor: themeName === "dark-theme" ? "black" : "#e4e2e9",
        filter:
          themeName === "dark-theme"
            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
            : "",

        boxShadow:
          themeName === "dark-theme"
            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
      }}
      id="yearPopover"
    >
      {rangeNumbers.map((year, index) => (
        <div
          onMouseEnter={() => {
            setIshoveredIndexYear(index);
          }}
          key={index}
          onClick={() => handleYearSelect(year)}
          style={{
            color: themeName === "dark-theme" ? "white" : "black",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: hoveredIndexYear === index ? "#5aa0ff" : "",
            borderRadius: "4px",
          }}
        >
          {year}
        </div>
      ))}
    </Popover>
  );

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const [emailTypeError, setemailTypeError] = useState("");

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
          setcheckFields((prevState) => ({
            ...prevState,
            emailInput: true,
          }));
        }

        if (response.status === 200) {
          setemailTypeError(200);
          setcheckFields((prevState) => ({
            ...prevState,
            emailInput: false,
          }));
        }
      } catch (error) {
        if (error.response.status === 304) {
          setemailTypeError(304);
          setcheckFields((prevState) => ({
            ...prevState,
            emailInput: false,
          }));
        }
      }
    };

    checkEmail();
  }, [email]);

  useEffect(() => {
    if (email.length === 0) {
      setcheckFields((prevState) => ({
        ...prevState,
        emailInput: false,
      }));
    }
    if (fullname.length === 0) {
      setcheckFields((prevState) => ({
        ...prevState,
        nameInput: false,
      }));
    }
    if (
      checkFields.nameInput &&
      checkFields.emailInput &&
      checkFields.dateofbirthInput
    ) {
      setinformationsAreCorrect(true);
    } else {
      setinformationsAreCorrect(false);
    }
    if (selectedMonth && selectedDay && selectedYear) {
      setcheckFields((prevState) => ({
        ...prevState,
        dateofbirthInput: true,
      }));
    }
  }, [email, fullname, selectedMonth, selectedDay, selectedYear]);

  console.log("Check fields outside of useEffect =>", checkFields);

  console.log("fullname =>", fullname);
  console.log("email =>", email);
  console.log("date of birth =>", selectedMonth, selectedDay, selectedYear);

  const [firstClicked, setfirstClicked] = useState(false);
  const [secondClicked, setsecondClicked] = useState(false);
  const [thirdClicked, setthirdClicked] = useState(false);

  const [emailVerificationCode, setemailVerificationCode] = useState("");

  const [confirmEmailVerificationCode, setconfirmEmailVerificationCode] =
    useState("");

  const [emailVerificationCodeStatus, setemailVerificationCodeStatus] =
    useState("");

  const handleChangeEmailVerificationCode = (e) => {
    setconfirmEmailVerificationCode(e.target.value);
  };

  const [clickedReceiveEmail, setclickedReceiveEmail] = useState(false);

  const sendEmailVerificationCode = (recipientEmail) => {
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
        console.log("Response =>", response);
        if (response.status === 201) {
          setemailVerificationCodeStatus(201);
          setemailVerificationCode(response.data.code);
        }
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  console.log("Email verification code =>", emailVerificationCode);
  console.log(
    "Email verification api call status =>",
    emailVerificationCodeStatus
  );

  console.log("Confirming email code =>", confirmEmailVerificationCode);

  const [showOptionsReceivedEmail, setShowOptionsReceivedEmail] =
    useState(false);

  const errorMessageAndCleanTextInput = () => {
    setTimeout(() => {
      setconfirmEmailVerificationCode("");
      showCustomMessage(
        "The code you entered is incorrect. Please try again.",
        4
      );
    }, 300);
  };

  useEffect(() => {
    const getClickedLocation = (e) => {
      const classList = e.target?.classList;
      const parentNodeClassName = e.srcElement?.parentNode.className;
      const svgGroupClassName = e.srcElement?.parentNode.className.baseVal;

      if (!classList.contains("didn-t-receive-email-text")) {
        setShowOptionsReceivedEmail(false);
      }

      if (
        parentNodeClassName === "parent-div-month-content-over-flow-y" ||
        classList.contains("child-div-after-overlay-trigger") ||
        classList.contains("svg-month-picker") ||
        svgGroupClassName === "path-parent-g" ||
        classList.contains("selected-month-string-parent-div") ||
        parentNodeClassName === "child-div-after-overlay-trigger" ||
        classList.contains("main-outline-text")
      ) {
        setStyleOfBoxMonth(true);
      } else {
        setStyleOfBoxMonth(false);
        setshowMonthPicker(false);
      }

      if (
        parentNodeClassName === "parent-div-day-picker-content-over-flow-y" ||
        classList.contains("child-div-day-picker-after-overlay-trigger") ||
        classList.contains("svg-day-picker") ||
        svgGroupClassName === "path-parent-g-day-picker" ||
        classList.contains("selected-day-string-parent-div") ||
        parentNodeClassName === "child-div-day-picker-after-overlay-trigger" ||
        classList.contains("main-outline-text-day-picker")
      ) {
        setStyleOfBoxDay(true);
      } else {
        setStyleOfBoxDay(false);
        setshowDayPicker(false);
      }

      if (
        parentNodeClassName === "parent-div-year-picker-content-over-flow-y" ||
        classList.contains("child-div-year-picker-after-overlay-trigger") ||
        classList.contains("svg-year-picker") ||
        svgGroupClassName === "path-parent-g-year-picker" ||
        classList.contains("selected-year-string-parent-div") ||
        parentNodeClassName === "child-div-year-picker-after-overlay-trigger" ||
        classList.contains("main-outline-text-year-picker")
      ) {
        setStyleOfBoxYear(true);
      } else {
        setStyleOfBoxYear(false);
        setshowYearPicker(false);
      }
    };
    document.addEventListener("click", getClickedLocation);

    return () => {
      document.removeEventListener("click", getClickedLocation);
    };
  }, []);

  const [passwordError, setpasswordError] = useState(false);
  const [passwordIsValid, setpasswordIsValid] = useState(false);

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  useEffect(() => {
    if (passwordRegex.test(password) && password.length) {
      setpasswordIsValid(true);
    } else if (password.length && !passwordRegex.test(password)) {
      setpasswordIsValid(false);
      setError(
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter."
      );
    }
  }, [password]);

  console.log("Password.length =>", password.length);
  console.log("Password is valid ? =>", passwordIsValid);

  const signedUserInfo = {
    fullname,
    email,
    password,
    selectedMonth,
    selectedDay,
    selectedYear,
  };

  console.log("Signed user info so far =>", signedUserInfo);
  const handleLogin = () => {
    axios
      .post(`${API_URL}/auth/login`, {
        authentication: signedUserInfo,
        password,
      })
      .then((response) => {
        const { token, user } = response.data;

        console.log("Response data =>", response.data);
        if (signedUpWithGoogle) {
          console.log("Signed up with google !");
        } else if (signedUpWithVariantOne) {
          ("Signed up with variant one !");
        }

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("token", token);
        updateUser(user);
        console.log("Response after log in =>", response);
        navigate("/home");
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };
  const handleSignUp = () => {
    axios
      .post(`${API_URL}/auth/signup`, {
        signedUserInfo,
      })
      .then((response) => {
        console.log("Response =>", response);

        setTabLoading(true);
        setTimeout(() => {
          handleLogin();
        }, 500);
      })
      .catch((err) => {
        console.log("Error =>", err);
        const { status } = err.response;

        if (status === 402) {
          setpasswordError(true);
          setSuccess("");
          setpasswordIsValid(false);
        }
      });
  };

  const { height, width } = useWindowDimensions();

  console.log("Height =>", height);
  console.log("Width =>", width);

  return (
    <>
      {contextHolder}
      {width <= 700 ? (
        <>
          <Modal
            style={{
              height: "100%",
              margin: "0px",
              padding: "0px",
            }}
            contentClassName={
              themeName === "dark-theme"
                ? `create-account-modal-${themeName}`
                : ""
            }
            dialogClassName={"modal-fullscreen"}
            show={showCreateAccountModal}
            onHide={handleCloseCreateAccountModal}
            centered={true}
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
              style={{
                border: "none",
                visibility: tabLoading ? "hidden" : "visible",
              }}
            >
              <>
                {tabIndex !== 3 ? (
                  <>
                    {tabIndex !== 0 && tabIndex !== 3 ? (
                      <div onClick={() => setTabIndex(tabIndex - 1)}>
                        {" "}
                        <div
                          className={`p2 arrow arrow-${themeName}`}
                          style={{
                            position: "relative",
                            width: "34px",
                            height: " 34px",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                        >
                          <svg
                            style={{
                              position: "absolute",
                              bottom: "7px",
                              border: "none",
                              left: "7px",
                            }}
                            color={
                              themeName === "dark-theme"
                                ? "white"
                                : `rgb(15,20,25)`
                            }
                            fill="currentColor"
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
                      </div>
                    ) : (
                      <div
                        onClick={handleCloseCreateAccountModal}
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
                              margin: "5px",
                            }}
                            onClick={handleCloseCreateAccountModal}
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
                    )}
                  </>
                ) : null}
              </>
              <div
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
                  zIndex: "999",
                  transform: `scale(${showOptionsReceivedEmail ? "1" : "0.8"})`,
                  animation: "fadeIn 0.5s ease",
                }}
              >
                <div
                  className="chirp-regular-font"
                  style={{
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
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }
                >
                  <div
                    className={`use-phone-instead use-phone-instead-${themeName} chirp-bold-font`}
                    style={{
                      // cursor: "pointer",
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      padding: "12px",
                      opacity: "0.5",
                      color: themeName === "dark-theme" ? "white" : "",
                    }}
                  >
                    {"Use phone instead"}{" "}
                  </div>
                </BootstrapTooltip>
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
                    style={{
                      overflowY: "auto",
                      position: "relative",
                    }}
                    className={`scrollbar-add signin-modal-body-child-non-reactivate create-account-first-tab scrollbar-add-${themeName}`}
                  >
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
                      Create your account
                    </div>

                    {onFocusedToFullNameField ? (
                      <InputLabel
                        style={{
                          width: "81.5%",
                          textAlign: "right",
                        }}
                      >
                        <div
                          className="chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                            fontSize: font13.fontSize,
                            lineHeight: font13.lineHeight,
                          }}
                        >
                          {fullname.length} / {50}
                        </div>
                      </InputLabel>
                    ) : null}

                    <TextField
                      autoFocus={true}
                      onFocus={() => setonFocusedToFullNameField(true)}
                      onBlur={() => setonFocusedToFullNameField(false)}
                      value={fullname}
                      onChange={(e) => handleChangeFullName(e)}
                      type="text"
                      id="outlined-basic"
                      variant={"outlined"}
                      label={`Name`}
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
                          border:
                            !fullnameFilled &&
                            fullname.length === 0 &&
                            !firstAppearence
                              ? "2px solid rgb(244, 33, 46)!important"
                              : "2px solid #1d9bf0 !important",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            !fullnameFilled &&
                            fullname.length === 0 &&
                            !firstAppearence
                              ? "rgb(244, 33, 46)!important"
                              : themeName === "dark-theme"
                              ? "rgb(70, 70, 70) !important"
                              : "#cfd9de !important",
                        },
                        "& .MuiInputLabel-shrink": {
                          color:
                            !fullnameFilled &&
                            fullname.length === 0 &&
                            !firstAppearence
                              ? "rgb(244, 33, 46)!important"
                              : "#1f9cf0 !important",
                        },
                      }}
                    />
                    {!fullnameFilled &&
                    fullname.length === 0 &&
                    !firstAppearence ? (
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
                        {"What's your name?"}
                      </div>
                    ) : null}

                    <TextField
                      className="mt-4"
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      value={email}
                      type="text"
                      onChange={handleEmailChange}
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

                    <div
                      style={{
                        display: " flex",
                        justifyContent: "right",
                      }}
                    >
                      <div
                        className="chirp-regular-font"
                        style={{
                          width: "81.5%",
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,
                          color: "#f7555f",
                        }}
                      >
                        {error ? error : null}
                      </div>
                      <div
                        className="chirp-regular-font"
                        style={{
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,
                          color: "rgb(83, 100, 113)",
                        }}
                      >
                        {success ? success + "." : null}
                      </div>
                    </div>
                    <div
                      className="mt-4"
                      style={{
                        width: "81.5%",
                      }}
                    >
                      <div
                        className="chirp-bold-font"
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "",
                        }}
                      >
                        Date of birth
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          fontSize: font14.fontSize,
                          lineHeight: font14.lineHeight,
                        }}
                      >
                        This will not be shown publicly. Confirm your own age,
                        even if this account is for a business, a pet, or
                        something else.
                      </div>
                      {/* date of birth start to check  */}
                      <div
                        className="mt-4 chirp-regular-font"
                        style={{
                          width: "100%",
                          height: "58px",
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: font14.fontSize,
                          lineHeight: font14.lineHeight,
                        }}
                      >
                        {" "}
                        <OverlayTrigger
                          show={showMonthPicker}
                          trigger="click"
                          placement="top"
                          overlay={popoverContent}
                        >
                          <div
                            className="child-div-after-overlay-trigger parent-div-month-content-over-flow-y"
                            onClick={handleMonthClick}
                            style={{
                              borderRadius: "4px",
                              cursor: "pointer",
                              color: "#536471",
                              flex: "255.5px",
                              padding: "4px",
                              border: "1px solid",
                              borderWidth: styleOfBoxMonth ? "2px" : "1px",
                              borderColor: styleOfBoxMonth
                                ? "#1d9bf0                          "
                                : themeName === "dark-theme"
                                ? "rgb(70,70,70)"
                                : "#cfd9de",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div
                                className="main-outline-text"
                                style={{
                                  color:
                                    themeName === "dark-theme" ? "#71767B" : "",
                                }}
                              >
                                Month
                              </div>
                              <div
                                className="mt-2 selected-month-string-parent-div"
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {selectedMonth}
                              </div>
                            </div>
                            <div
                              style={{
                                float: "right",
                                position: "relative",
                                top: "30%",
                              }}
                            >
                              <svg
                                width={`${1.5}em`}
                                height={`${1.5}em`}
                                color="rgba(83,100,113,1.00)"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="svg-month-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                              >
                                <g className="path-parent-g">
                                  <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                                </g>
                              </svg>
                            </div>
                            {/* dropdown month picker start to check  */}

                            {/* dropdown month picker finish to check  */}
                          </div>
                        </OverlayTrigger>
                        <OverlayTrigger
                          show={showDayPicker}
                          trigger="click"
                          placement="top"
                          overlay={popoverDayContent}
                        >
                          <div
                            className="child-div-day-picker-after-overlay-trigger parent-div-day-picker-content-over-flow-y"
                            onClick={handleDayClick}
                            style={{
                              borderRadius: "4px",
                              cursor: "pointer",
                              color: "#536471",
                              flex: "113.75px",
                              padding: "4px",
                              marginLeft: "15px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: styleOfBoxDay ? "2px" : "1px",
                              borderColor: styleOfBoxDay
                                ? "#1d9bf0                          "
                                : themeName === "dark-theme"
                                ? "rgb(70,70,70)"
                                : "rgb(207, 217, 222)",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div
                                className="main-outline-text-day-picker"
                                style={{
                                  color:
                                    themeName === "dark-theme" ? "#71767A" : "",
                                }}
                              >
                                Day
                              </div>
                              <div
                                className="mt-2 selected-day-string-parent-div"
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {selectedDay}
                              </div>
                            </div>
                            <div
                              style={{
                                float: "right",
                                position: "relative",
                                top: "30%",
                              }}
                            >
                              <svg
                                width={`${1.5}em`}
                                height={`${1.5}em`}
                                color="rgba(83,100,113,1.00)"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="svg-day-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                              >
                                <g className="path-parent-g-day-picker">
                                  <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </OverlayTrigger>
                        <OverlayTrigger
                          show={showYearPicker}
                          trigger="click"
                          placement="top"
                          overlay={popoverYearContent}
                        >
                          <div
                            className="child-div-year-picker-after-overlay-trigger parent-div-year-picker-content-over-flow-y"
                            onClick={handleYearClick}
                            style={{
                              borderRadius: "4px",

                              cursor: "pointer",
                              color: "#536471",
                              flex: "136.75px",
                              padding: "4px",
                              marginLeft: "15px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: styleOfBoxYear ? "2px" : "1px",
                              borderColor: styleOfBoxYear
                                ? "#1d9bf0                          "
                                : themeName === "dark-theme"
                                ? "rgb(70,70,70)"
                                : "#cfd9de",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div
                                className="main-outline-text-year-picker"
                                style={{
                                  color:
                                    themeName === "dark-theme" ? "#71767A" : "",
                                }}
                              >
                                Year
                              </div>
                              <div
                                className="mt-2 selected-year-string-parent-div"
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {displayedYear}
                              </div>
                            </div>
                            <div
                              style={{
                                float: "right",
                                position: "relative",
                                top: "30%",
                              }}
                            >
                              <svg
                                width={`${1.5}em`}
                                height={`${1.5}em`}
                                color="rgba(83,100,113,1.00)"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="svg-year-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                              >
                                <g className="path-parent-g-year-picker">
                                  <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </OverlayTrigger>
                      </div>

                      {/* date of birth finish to check  */}
                    </div>

                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                        opacity:
                          checkFields.nameInput &&
                          checkFields.emailInput &&
                          checkFields.dateofbirthInput &&
                          displayedYear &&
                          email &&
                          fullname
                            ? "1"
                            : "0.5",
                      }}
                      onClick={
                        informationsAreCorrect &&
                        selectedMonth &&
                        selectedDay &&
                        displayedYear &&
                        email &&
                        fullname
                          ? () => {
                              setTabLoading(true);
                              setTimeout(() => {
                                setTabLoading(false);
                                setTabIndex(tabIndex + 1);
                              }, 500);
                            }
                          : null
                      }
                      className={`next-btn ${themeName}-white-btn chirp-bold-font`}
                    >
                      Next
                    </Button>
                  </Modal.Body>
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
                  <Modal.Body
                    className={`scrollbar-add signin-modal-body-child-non-reactivate scrollbar-add-${themeName}`}
                    style={{
                      overflowY: "auto",
                      position: "relative",
                    }}
                  >
                    <div
                      className="mb-4 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font26.fontSize,
                        lineHeight: font26.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      Customize your experience
                    </div>
                    <div
                      style={{
                        overflowY: "auto",
                        position: "relative",
                        width: "81.5%",
                      }}
                    >
                      <div
                        className="mt-2.5 chirp-bold-font"
                        style={{
                          color: themeName === "dark-theme" ? "white" : "",
                          fontSize: font20.fontSize,
                          lineHeight: font20.lineHeight,
                        }}
                      >
                        Get more out of C
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              width: "81.5%",
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            {" "}
                            Receive email about your Connectify activity and
                            recommendations.
                          </div>
                          <div
                            onClick={() => setfirstClicked(!firstClicked)}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                            }}
                            className={
                              themeName === "dark-theme" && firstClicked
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" && firstClicked
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" && !firstClicked
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" && !firstClicked
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: firstClicked
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: firstClicked
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #536471",

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
                                  bottom: "2px",
                                  display: firstClicked ? "initial" : "none",
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
                      <div
                        className="mt-3 chirp-bold-font"
                        style={{
                          color: themeName === "dark-theme" ? "white" : "",
                          fontSize: font20.fontSize,
                          lineHeight: font20.lineHeight,
                        }}
                      >
                        Connect with people you know
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              width: "81.5%",
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            {" "}
                            Let others find your Connectify account by your
                            email address.
                          </div>
                          <div
                            onClick={() => setsecondClicked(!secondClicked)}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                            }}
                            className={
                              themeName === "dark-theme" && secondClicked
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" && secondClicked
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" && !secondClicked
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" && !secondClicked
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: secondClicked
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: secondClicked
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #536471",

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
                                  bottom: "2px",
                                  display: secondClicked ? "initial" : "none",
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
                      <div
                        className="mt-3 chirp-bold-font"
                        style={{
                          color: themeName === "dark-theme" ? "white" : "",
                          fontSize: font20.fontSize,
                          lineHeight: font20.lineHeight,
                        }}
                      >
                        Personalized ads
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              width: "81.5%",
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            {" "}
                            You will always see ads on Connectify based on your
                            Connectify activity. When this setting is enabled,
                            Connectify may further personalize ads from
                            Connectify advertisers, on and off Connectify, by
                            combining your Connectify activity with other online
                            activity and information from our partners.
                          </div>
                          <div
                            onClick={() => setthirdClicked(!thirdClicked)}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                            }}
                            className={
                              themeName === "dark-theme" && thirdClicked
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" && thirdClicked
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" && !thirdClicked
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" && !thirdClicked
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: thirdClicked
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: thirdClicked
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #536471",

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
                                  bottom: "2px",
                                  display: thirdClicked ? "initial" : "none",
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
                    </div>

                    <div
                      className="mt-4 chirp-regular-font"
                      style={{
                        width: "81.5%",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A                                  "
                            : "rgb(83, 100, 113)",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                    >
                      By signing up, you agree to our{" "}
                      <span className="customize-experience-tab">Terms</span>,{" "}
                      <span className="customize-experience-tab">
                        Privacy Policy
                      </span>
                      , and{" "}
                      <span className="customize-experience-tab">
                        Cookie Use
                      </span>
                      . Connectify may use your contact information, including
                      your email address and phone number for purposes outlined
                      in our Privacy Policy.{" "}
                      <span className="customize-experience-tab">
                        Learn more
                      </span>
                    </div>

                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                        opacity:
                          checkFields.nameInput &&
                          checkFields.emailInput &&
                          checkFields.dateofbirthInput
                            ? "1"
                            : "0.5",
                      }}
                      onClick={
                        informationsAreCorrect
                          ? () => {
                              setTabLoading(true);
                              sendEmailVerificationCode(email);
                              setTimeout(() => {
                                setTabLoading(false);
                                setTabIndex(tabIndex + 1);
                              }, 500);
                            }
                          : null
                      }
                      className={`next-btn ${themeName}-white-btn`}
                    >
                      Next
                    </Button>
                  </Modal.Body>
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
                  <Modal.Body
                    style={{ overflowX: "hidden" }}
                    className="signin-modal-body-child-non-reactivate mt-4"
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "0px",
                        top: "0px",
                        display: clickedReceiveEmail ? "block" : "none",
                      }}
                    >
                      Test
                    </div>
                    <div
                      className="mb-4 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font26.fontSize,
                        lineHeight: font26.lineHeight,
                        zIndex: "100",
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      <div className="chirp-bold-font">We sent you a code</div>
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
                        Enter it below to verify{" "}
                        <span>{email ? email : ""}</span>
                      </div>
                    </div>

                    <TextField
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
                              setTabLoading(true);
                              setTimeout(() => {
                                setTabLoading(false);
                                setTabIndex(tabIndex + 1);
                              }, 500);
                            }
                          : () => errorMessageAndCleanTextInput()
                      }
                      className={`next-btn ${themeName}-white-btn`}
                    >
                      Next
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
                    style={{ overflowX: "hidden" }}
                    className="signin-modal-body-child-non-reactivate"
                  >
                    <div
                      className="mb-4 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font26.fontSize,
                        lineHeight: font26.lineHeight,
                        zIndex: "100",
                      }}
                    >
                      <div
                        style={{
                          letterSpacing: "0.5px",
                          color: themeName === "dark-theme" ? "white" : "",
                        }}
                      >
                        {"You'll need a password"}
                      </div>
                      <div
                        className="mt-2.5 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Make sure it’s 8 characters or more.
                      </div>
                    </div>
                    <FormControl
                      sx={{ m: 1, width: "81.5%", height: "58px" }}
                      variant="outlined"
                    >
                      <InputLabel
                        sx={{
                          "&.MuiInputLabel-shrink": {
                            color:
                              !passwordIsValid && password.length
                                ? "rgb(244, 33, 46) !important"
                                : "#1f9cf0 !important",
                          },
                        }}
                        htmlFor="outlined-adornment-password"
                      >
                        Password
                      </InputLabel>
                      <OutlinedInput
                        autoFocus
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                          color: themeName === "dark-theme" ? "white" : "",

                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              password.length && !passwordIsValid
                                ? "rgb(244, 33, 46)!important"
                                : themeName === "dark-theme"
                                ? "rgb(70,70,70) !important"
                                : "#cfd9de !important",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border:
                              password.length && !passwordIsValid
                                ? "2px solid rgb(244, 33, 46)!important"
                                : "2px solid #1d9bf0 !important",
                          },
                        }}
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
                      {password.length && !passwordIsValid ? error : ""}
                    </div>
                    <div
                      className="chirp-regular-font"
                      style={{
                        width: "81.5%",
                        position: "absolute",
                        bottom: "100px",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A                                  "
                            : "rgb(83, 100, 113)",
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      By signing up, you agree to our{" "}
                      <span className="last-step-account-create-password-tab">
                        Terms
                      </span>
                      ,{" "}
                      <span className="last-step-account-create-password-tab">
                        Privacy Policy
                      </span>
                      , and{" "}
                      <span className="last-step-account-create-password-tab">
                        Cookie Use
                      </span>
                      . Connectify may use your contact information, including
                      your email address and phone number for purposes outlined
                      in our Privacy Policy.{" "}
                      <span className="last-step-account-create-password-tab">
                        Learn more
                      </span>
                    </div>
                    {/* password.length && !passwordIsValid */}
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                        opacity:
                          password.length >= 8 && passwordIsValid ? "1" : "0.5",
                      }}
                      onClick={
                        password.length >= 8 && passwordIsValid
                          ? handleSignUp
                          : null
                      }
                      className={`next-btn ${themeName}-white-btn`}
                    >
                      Next
                    </Button>
                  </Modal.Body>
                )}
              </>
            ) : (
              <></>
            )}
          </Modal>
        </>
      ) : (
        <>
          <Modal
            style={{
              padding: "0px",
              margin: "0px",
            }}
            backdropClassName={
              themeName === "dark-theme" ? `back-drop-${themeName}` : ""
            }
            dialogClassName="test"
            contentClassName={
              themeName === "dark-theme"
                ? `create-account-modal-${themeName}`
                : ""
            }
            className={"signin-modal-parent-non-reactivate"}
            show={showCreateAccountModal}
            onHide={handleCloseCreateAccountModal}
            centered={true}
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
              style={{
                border: "none",
                visibility: tabLoading ? "hidden" : "visible",
              }}
            >
              <>
                {tabIndex !== 3 ? (
                  <>
                    {tabIndex !== 0 && tabIndex !== 3 ? (
                      <div onClick={() => setTabIndex(tabIndex - 1)}>
                        {" "}
                        <div
                          className={`p2 arrow arrow-${themeName}`}
                          style={{
                            position: "relative",
                            width: "34px",
                            height: " 34px",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                        >
                          <svg
                            style={{
                              position: "absolute",
                              bottom: "7px",
                              border: "none",
                              left: "7px",
                            }}
                            color={
                              themeName === "dark-theme"
                                ? "white"
                                : `rgb(15,20,25)`
                            }
                            fill="currentColor"
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
                      </div>
                    ) : (
                      <div
                        onClick={handleCloseCreateAccountModal}
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
                              margin: "5px",
                            }}
                            onClick={handleCloseCreateAccountModal}
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
                    )}
                  </>
                ) : null}
              </>
              <div
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
                  zIndex: "999",
                  transform: `scale(${showOptionsReceivedEmail ? "1" : "0.8"})`,
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
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }
                >
                  <div
                    className={`use-phone-instead use-phone-instead-${themeName} chirp-bold-font`}
                    style={{
                      // cursor: "pointer",
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
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
                    className={`scrollbar-add signin-modal-body-child-non-reactivate create-account-first-tab scrollbar-add-${themeName}`}
                    style={{
                      overflowY: "auto",
                      position: "relative",
                      overflowX: "hidden",
                    }}
                  >
                    <div
                      className="mb-4 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Create your account
                    </div>
                    {onFocusedToFullNameField ? (
                      <InputLabel
                        style={{
                          width: "81.5%",
                          textAlign: "right",
                        }}
                      >
                        <div
                          className="chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                            fontSize: font13.fontSize,
                            lineHeight: font13.lineHeight,
                          }}
                        >
                          {fullname.length} / {50}
                        </div>
                      </InputLabel>
                    ) : null}
                    <TextField
                      autoFocus={true}
                      onFocus={() => setonFocusedToFullNameField(true)}
                      onBlur={() => setonFocusedToFullNameField(false)}
                      value={fullname}
                      onChange={(e) => handleChangeFullName(e)}
                      type="text"
                      id="outlined-basic"
                      variant={"outlined"}
                      label={`Name`}
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
                          border:
                            !fullnameFilled &&
                            fullname.length === 0 &&
                            !firstAppearence
                              ? "2px solid rgb(244, 33, 46)!important"
                              : "2px solid #1d9bf0 !important",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            !fullnameFilled &&
                            fullname.length === 0 &&
                            !firstAppearence
                              ? "rgb(244, 33, 46)!important"
                              : themeName === "dark-theme"
                              ? "rgb(70, 70, 70) !important"
                              : "#cfd9de !important",
                        },
                        "& .MuiInputLabel-shrink": {
                          color:
                            !fullnameFilled &&
                            fullname.length === 0 &&
                            !firstAppearence
                              ? "rgb(244, 33, 46)!important"
                              : "#1f9cf0 !important",
                        },
                      }}
                    />
                    {!fullnameFilled &&
                    fullname.length === 0 &&
                    !firstAppearence ? (
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
                        {"What's your name?"}
                      </div>
                    ) : null}
                    <TextField
                      className="mt-4"
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      value={email}
                      type="text"
                      onChange={handleEmailChange}
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
                    <div
                      style={{
                        display: " flex",
                        justifyContent: "right",
                      }}
                    >
                      <div
                        className="chirp-regular-font"
                        style={{
                          width: "81.5%",
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,
                          color: "#f7555f",
                          position: "relative",
                          left: "10px",
                        }}
                      >
                        {error ? error : null}
                      </div>
                      <div
                        className="chirp-regular-font"
                        style={{
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,
                          color: "rgb(83, 100, 113)",
                        }}
                      >
                        {success ? success + "." : null}
                      </div>
                    </div>
                    <div
                      className="mt-4 "
                      style={{
                        width: "81.5%",
                      }}
                    >
                      <div
                        className="chirp-bold-font"
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "",
                        }}
                      >
                        Date of birth
                      </div>
                      <div
                        className="mt-2 chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          fontSize: font14.fontSize,
                          lineHeight: font14.lineHeight,
                        }}
                      >
                        This will not be shown publicly. Confirm your own age,
                        even if this account is for a business, a pet, or
                        something else.
                      </div>
                      {/* date of birth start to check  */}
                      <div
                        className="mt-4"
                        style={{
                          width: "440px",
                          height: "58px",
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: font14.fontSize,
                          lineHeight: font14.lineHeight,
                        }}
                      >
                        {" "}
                        <OverlayTrigger
                          show={showMonthPicker}
                          trigger="click"
                          placement="top"
                          overlay={popoverContent}
                        >
                          <div
                            className="child-div-after-overlay-trigger parent-div-month-content-over-flow-y"
                            onClick={handleMonthClick}
                            style={{
                              borderRadius: "4px",
                              cursor: "pointer",
                              color: "#536471",
                              flex: "50%",
                              padding: "4px",
                              border: "1px solid",
                              borderWidth: styleOfBoxMonth ? "2px" : "1px",
                              borderColor: styleOfBoxMonth
                                ? "#1d9bf0                          "
                                : themeName === "dark-theme"
                                ? "rgb(70, 70, 70)"
                                : "rgb(207, 217, 222)",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div
                                className="main-outline-text"
                                style={{
                                  color:
                                    themeName === "dark-theme" ? "#71767B" : "",
                                }}
                              >
                                Month
                              </div>
                              <div
                                className="mt-2 selected-month-string-parent-div"
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {selectedMonth}
                              </div>
                            </div>
                            <div
                              style={{
                                float: "right",
                                position: "relative",
                                top: "30%",
                              }}
                            >
                              <svg
                                width={`${1.5}em`}
                                height={`${1.5}em`}
                                color="rgba(83,100,113,1.00)"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="svg-month-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                              >
                                <g className="path-parent-g">
                                  <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                                </g>
                              </svg>
                            </div>
                            {/* dropdown month picker start to check  */}

                            {/* dropdown month picker finish to check  */}
                          </div>
                        </OverlayTrigger>
                        <OverlayTrigger
                          show={showDayPicker}
                          trigger="click"
                          placement="top"
                          overlay={popoverDayContent}
                        >
                          <div
                            className="child-div-day-picker-after-overlay-trigger parent-div-day-picker-content-over-flow-y"
                            onClick={handleDayClick}
                            style={{
                              borderRadius: "4px",
                              cursor: "pointer",
                              color: "#536471",
                              flex: "25%",
                              padding: "4px",
                              marginLeft: "15px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: styleOfBoxDay ? "2px" : "1px",
                              borderColor: styleOfBoxDay
                                ? "#1d9bf0                          "
                                : themeName === "dark-theme"
                                ? "rgb(70,70,70)"
                                : "rgb(207, 217, 222)",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div
                                className="main-outline-text-day-picker"
                                style={{
                                  color:
                                    themeName === "dark-theme" ? "#71767A" : "",
                                }}
                              >
                                Day
                              </div>
                              <div
                                className="mt-2 selected-day-string-parent-div"
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {selectedDay}
                              </div>
                            </div>
                            <div
                              style={{
                                float: "right",
                                position: "relative",
                                top: "30%",
                              }}
                            >
                              <svg
                                width={`${1.5}em`}
                                height={`${1.5}em`}
                                color="rgba(83,100,113,1.00)"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="svg-day-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                              >
                                <g className="path-parent-g-day-picker">
                                  <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </OverlayTrigger>
                        <OverlayTrigger
                          show={showYearPicker}
                          trigger="click"
                          placement="top"
                          overlay={popoverYearContent}
                        >
                          <div
                            className="child-div-year-picker-after-overlay-trigger parent-div-year-picker-content-over-flow-y"
                            onClick={handleYearClick}
                            style={{
                              borderRadius: "4px",

                              cursor: "pointer",
                              color: "#536471",
                              flex: "25%",
                              padding: "4px",
                              marginLeft: "15px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: styleOfBoxYear ? "2px" : "1px",
                              borderColor: styleOfBoxYear
                                ? "#1d9bf0                          "
                                : themeName === "dark-theme"
                                ? "rgb(70,70,70)"
                                : "rgb(207, 217, 222)",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div
                                className="main-outline-text-year-picker"
                                style={{
                                  color:
                                    themeName === "dark-theme" ? "#71767A" : "",
                                }}
                              >
                                Year
                              </div>
                              <div
                                className="mt-2 selected-year-string-parent-div"
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {displayedYear}
                              </div>
                            </div>
                            <div
                              style={{
                                float: "right",
                                position: "relative",
                                top: "30%",
                              }}
                            >
                              <svg
                                width={`${1.5}em`}
                                height={`${1.5}em`}
                                color="rgba(83,100,113,1.00)"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="svg-year-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                              >
                                <g className="path-parent-g-year-picker">
                                  <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </OverlayTrigger>
                      </div>

                      {/* date of birth finish to check  */}
                    </div>{" "}
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                        opacity:
                          checkFields.nameInput &&
                          checkFields.emailInput &&
                          checkFields.dateofbirthInput &&
                          displayedYear &&
                          email &&
                          fullname
                            ? "1"
                            : "0.5",
                      }}
                      onClick={
                        informationsAreCorrect &&
                        selectedMonth &&
                        selectedDay &&
                        displayedYear &&
                        email &&
                        fullname
                          ? () => {
                              setTabLoading(true);
                              setTimeout(() => {
                                setTabLoading(false);
                                setTabIndex(tabIndex + 1);
                              }, 500);
                            }
                          : null
                      }
                      className={`next-btn ${themeName}-white-btn chirp-bold-font`}
                    >
                      Next
                    </Button>{" "}
                  </Modal.Body>
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
                  <Modal.Body
                    style={{
                      padding: "0px",
                      margin: "0px",
                      position: "relative",
                    }}
                    className={`signin-modal-body-child-non-reactivate`}
                  >
                    <div
                      className={`scrollbar-add scrollbar-add-${themeName} `}
                      style={{
                        overflowY: "scroll",
                        height: "80%",
                        paddingLeft: "62px",
                        paddingTop: "36px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                        }}
                      >
                        <div
                          className="mb-4 chirp-bold-font"
                          style={{
                            width: "81.5%",
                            fontSize: font31.fontSize,
                            lineHeight: font31.lineHeight,
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          Customize your experience
                        </div>
                        <div
                          className="mt-3 chirp-bold-font"
                          style={{
                            color: themeName === "dark-theme" ? "white" : "",
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                        >
                          Get more out of C
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                width: "81.5%",
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              }}
                            >
                              {" "}
                              Receive email about your Connectify activity and
                              recommendations.
                            </div>
                            <div
                              onClick={() => setfirstClicked(!firstClicked)}
                              style={{
                                marginRight: "36px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                              }}
                              className={
                                themeName === "dark-theme" && firstClicked
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" && firstClicked
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" && !firstClicked
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" && !firstClicked
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: firstClicked
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: firstClicked
                                    ? ""
                                    : themeName === "dark-theme"
                                    ? "2px solid rgb(70,70,70)"
                                    : "2px solid #536471",

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
                                    bottom: "2px",
                                    display: firstClicked ? "initial" : "none",
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
                        <div
                          className="mt-3 chirp-bold-font"
                          style={{
                            color: themeName === "dark-theme" ? "white" : "",
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                        >
                          Connect with people you know
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                width: "81.5%",
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              }}
                            >
                              {" "}
                              Let others find your account by your email
                              address.
                            </div>
                            <div
                              onClick={() => setsecondClicked(!secondClicked)}
                              style={{
                                marginRight: "36px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                              }}
                              className={
                                themeName === "dark-theme" && secondClicked
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" && secondClicked
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" && !secondClicked
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" && !secondClicked
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: secondClicked
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: secondClicked
                                    ? ""
                                    : themeName === "dark-theme"
                                    ? "2px solid rgb(70,70,70)"
                                    : "2px solid #536471",

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
                                    bottom: "2px",
                                    display: secondClicked ? "initial" : "none",
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
                        <div
                          className="mt-3 chirp-bold-font"
                          style={{
                            color: themeName === "dark-theme" ? "white" : "",
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                        >
                          Personalized ads
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                width: "81.5%",
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              }}
                            >
                              {" "}
                              You will always see ads on Connectify based on
                              your Connectify activity. When this setting is
                              enabled, Connectify may further personalize ads
                              from Connectify advertisers, on and off
                              Connectify, by combining your Connectify activity
                              with other online activity and information from
                              our partners.
                            </div>
                            <div
                              onClick={() => setthirdClicked(!thirdClicked)}
                              style={{
                                marginRight: "36px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                              }}
                              className={
                                themeName === "dark-theme" && thirdClicked
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" && thirdClicked
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" && !thirdClicked
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" && !thirdClicked
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: thirdClicked
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: thirdClicked
                                    ? ""
                                    : themeName === "dark-theme"
                                    ? "2px solid rgb(70,70,70)"
                                    : "2px solid #536471",

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
                                    bottom: "2px",
                                    display: thirdClicked ? "initial" : "none",
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
                        <div
                          className="mt-5 chirp-regular-font"
                          style={{
                            paddingBottom: "36px",
                            width: "81.5%",
                            color:
                              themeName === "dark-theme"
                                ? "#71767A                                  "
                                : "rgb(83, 100, 113)",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          <span>By signing up, you agree to our </span>
                          <span className="customize-experience-tab">
                            Terms
                          </span>
                          ,{" "}
                          <span className="customize-experience-tab">
                            Privacy Policy
                          </span>
                          , and{" "}
                          <span className="customize-experience-tab">
                            Cookie Use
                          </span>
                          . Connectify may use your contact information,
                          including your email address and phone number for
                          purposes outlined in our Privacy Policy.{" "}
                          <span className="customize-experience-tab">
                            Learn more
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        width: "100%",
                        height: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        filter:
                          themeName === "dark-theme"
                            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                            : "",
                        boxShadow:
                          themeName === "dark-theme"
                            ? "inset 0px 4px 3px -3px rgba(50, 50, 50, 0.75)"
                            : "",
                      }}
                    >
                      <Button
                        style={{
                          width: "81.5%",
                          height: "52px",
                          backgroundColor:
                            themeName === "dark-theme" ? "white" : "#0f141a",
                          opacity:
                            checkFields.nameInput &&
                            checkFields.emailInput &&
                            checkFields.dateofbirthInput
                              ? "1"
                              : "0.5",
                        }}
                        onClick={
                          informationsAreCorrect
                            ? () => {
                                setTabLoading(true);
                                sendEmailVerificationCode(email);
                                setTimeout(() => {
                                  setTabLoading(false);
                                  setTabIndex(tabIndex + 1);
                                }, 500);
                              }
                            : null
                        }
                        className={`next-btn ${themeName}-white-btn`}
                      >
                        Next
                      </Button>
                    </div>
                  </Modal.Body>
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
                  <Modal.Body
                    style={{ overflowX: "hidden" }}
                    className="signin-modal-body-child-non-reactivate"
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "0px",
                        top: "0px",
                        display: clickedReceiveEmail ? "block" : "none",
                      }}
                    >
                      Test
                    </div>
                    <div
                      className="mb-4 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        zIndex: "100",
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      <div>We sent you a code</div>
                      <div
                        className="chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          width: "81.5%",
                        }}
                      >
                        Enter it below to verify{" "}
                        <span>{email ? email : ""}</span>
                      </div>
                    </div>

                    <TextField
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
                              setTabLoading(true);
                              setTimeout(() => {
                                setTabLoading(false);
                                setTabIndex(tabIndex + 1);
                              }, 500);
                            }
                          : () => errorMessageAndCleanTextInput()
                      }
                      className={`next-btn ${themeName}-white-btn`}
                    >
                      Next
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
                    style={{}}
                    className="signin-modal-body-child-non-reactivate"
                  >
                    <div
                      className="mb-4 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        zIndex: "100",
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      <div>{"You'll need a password"}</div>
                      <div
                        className="chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Make sure it’s 8 characters or more.
                      </div>
                    </div>

                    <FormControl
                      sx={{ m: 1, width: "81.5%", height: "58px" }}
                      variant="outlined"
                    >
                      <InputLabel
                        sx={{
                          "&.MuiInputLabel-shrink": {
                            color:
                              !passwordIsValid && password.length
                                ? "rgb(244, 33, 46)!important"
                                : "#1f9cf0 !important",
                          },
                        }}
                        htmlFor="outlined-adornment-password"
                      >
                        Password
                      </InputLabel>
                      <OutlinedInput
                        autoFocus
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                          color: themeName === "dark-theme" ? "white" : "",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              password.length && !passwordIsValid
                                ? "rgb(244, 33, 46)!important"
                                : themeName === "dark-theme"
                                ? "rgb(70,70,70) !important"
                                : "#cfd9de !important",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border:
                              password.length && !passwordIsValid
                                ? "2px solid rgb(244, 33, 46)!important"
                                : "2px solid #1d9bf0 !important",
                          },
                        }}
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
                      {password.length && !passwordIsValid ? error : ""}
                    </div>
                    <div
                      className="chirp-regular-font"
                      style={{
                        width: "81.5%",
                        position: "absolute",
                        bottom: "100px",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A                                  "
                            : "rgb(83, 100, 113)",
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      By signing up, you agree to our{" "}
                      <span className="last-step-account-create-password-tab">
                        Terms
                      </span>
                      ,{" "}
                      <span className="last-step-account-create-password-tab">
                        Privacy Policy
                      </span>
                      , and{" "}
                      <span className="last-step-account-create-password-tab">
                        Cookie Use
                      </span>
                      . Connectify may use your contact information, including
                      your email address and phone number for purposes outlined
                      in our Privacy Policy.{" "}
                      <span className="last-step-account-create-password-tab">
                        Learn more
                      </span>
                    </div>
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                        opacity:
                          password.length >= 8 && passwordIsValid ? "1" : "0.5",
                      }}
                      onClick={
                        password.length >= 8 && passwordIsValid
                          ? handleSignUp
                          : null
                      }
                      className={`next-btn ${themeName}-white-btn`}
                    >
                      Next
                    </Button>
                  </Modal.Body>
                )}
              </>
            ) : (
              <></>
            )}
          </Modal>
        </>
      )}

      <Col
        style={{
          height: "92.2vh",
          maxHeight: "100%",
          padding: "32px",
          maxWidth: "45.9%",
          minWidth: "380px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        xxl={6}
        xl={6}
        lg={6}
        md={6}
        sm={6}
        xs={6}
      >
        <div
          style={{
            position: "relative",
            left: "10px",
            top: "20px",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              padding: "0px",
              margin: "0px",
              display: width <= 1000 ? "" : "none",
            }}
            className="mb-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
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
                  filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
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
          <div
            style={{
              width: "100vw",
            }}
          >
            <span
              style={{
                color: themeName === "dark-theme" ? "white" : "",
                fontSize: width <= 500 ? "40px" : font64.fontSize,
                lineHeight: width <= 500 ? "52px" : font64.lineHeight,
              }}
              className="chirp-extended-heavy"
            >
              Happening now
            </span>
          </div>
          <div
            className="mt-5"
            style={{
              margin: "0px 0px 32px",
            }}
          >
            <span
              style={{
                fontSize: font31.fontSize,
                lineHeight: font31.lineHeight,
                color: themeName === "dark-theme" ? "white" : "",
              }}
              className="chirp-extended-heavy"
            >
              Join today.
            </span>
          </div>
          <div className="responsive-input-group">
            <div>
              <Button
                // onClick={googleAuth}
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
                  border:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
                variant="light"
                className={`google-variant-sign-in google-variant-sign-in-${themeName}`}
              >
                <span
                  className="chirp-regular-font"
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                    marginLeft: "10px",
                    color: themeName === "dark-theme" ? "white" : "black",
                  }}
                >
                  Sign up with Google
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

              <Divider
                className={`ant-divider-theme ant-divider-${themeName}`}
                style={{
                  margin: "5px 0px",
                  padding: "0px",
                  maxHeight: "20px",
                  width: "300px",
                  minWidth: "300px",
                  color: themeName === "dark-theme" ? "white" : "",
                }}
                plain
              >
                or
              </Divider>

              <Button
                onClick={handleShowCreateAccountModal}
                className="create-btn chirp-bold-font"
              >
                Create account
              </Button>

              <p
                style={{
                  fontSize: font11.fontSize,
                  lineHeight: font11.lineHeight,
                  margin: "10px 0px",
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                }}
                className="by-signing chirp-regular-font"
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
                  <span style={{ color: " rgb(29, 155, 240)" }}>Cokie Use</span>
                </a>
                .
              </p>
              <LogInPage />
            </div>
          </div>
        </div>
      </Col>
      {/* </Row>
      </Container> */}
    </>
  );
}

export default SignUpPage;
