import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Modal,
  Popover,
  OverlayTrigger,
  Row,
} from "react-bootstrap";
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
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../hooks/getWindowDimensions";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function SignUpPage() {
  const [fullname, setFullname] = useState("");
  const [fullnameFilled, setfullnameFilled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { getToken, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [signedUpWithGoogle, setsignedUpWithGoogle] = useState(false);
  const [signedUpWithVariantOne, setsignedUpWithVariantOne] = useState(false);

  const googleAuth = () => {
    window.open(`${API_URL}/auth/google/callback`, "_self");
  };

  const catchErrorMessage = (message) => {
    messageApi.success({
      type: "success",
      content: message,
      duration: 4,
      className: "custom-message-style",
    });
  };
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
      className="testt !"
      style={{
        height: "250px",
        width: "150px",
        overflowY: "scroll",
        backgroundColor: "#e4e2e9",
        border: "none",
        boxShadow:
          "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
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
            padding: "8px",
            cursor: "pointer",
            backgroundColor: hoveredIndexMonth === index ? "#3c90fa" : "",
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
      style={{
        height: "250px",
        width: "150px",
        border: "none",
        overflowY: "scroll",
        backgroundColor: "#e4e2e9",
        boxShadow:
          "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
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
            padding: "8px",
            cursor: "pointer",
            backgroundColor: hoveredIndexDay === index ? "#3c90fa" : "",
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
      style={{
        height: "250px",
        width: "150px",
        border: "none",
        overflowY: "scroll",
        backgroundColor: "#e4e2e9",
        boxShadow:
          "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
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
            padding: "8px",
            cursor: "pointer",
            backgroundColor: hoveredIndexYear === index ? "#3c90fa" : "",
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
      catchErrorMessage("The code you entered is incorrect. Please try again.");
    }, 300);
  };

  useEffect(() => {
    const getClickedLocation = (e) => {
      const classList = e.target?.classList;
      const parentNodeClassName = e.srcElement?.parentNode.className;
      const svgGroupClassName = e.srcElement?.parentNode.className.baseVal;
      console.log("Target classlist =>", classList);
      console.log("Target parent classlist =>", parentNodeClassName);
      console.log(
        "Target classlist parent node base value =>",
        svgGroupClassName
      );

      if (classList.contains("didn-t-receive-email-text")) {
        setShowOptionsReceivedEmail(!showOptionsReceivedEmail);
      } else {
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
          setTabLoading(false);
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
            }}
            dialogClassName={"modal-fullscreen"}
            show={showCreateAccountModal}
            onHide={handleCloseCreateAccountModal}
            centered={true}
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
              style={{
                border: "none",
              }}
            >
              <>
                {tabIndex !== 3 ? (
                  <>
                    {tabIndex !== 0 && tabIndex !== 3 ? (
                      <div onClick={() => setTabIndex(tabIndex - 1)}>
                        {" "}
                        <div
                          className="p-2 arrow"
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
                              fontSize: "15px",
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
                      </div>
                    ) : (
                      <div
                        onClick={handleCloseCreateAccountModal}
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
                            onClick={handleCloseCreateAccountModal}
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
                  boxShadow:
                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                  zIndex: "999",
                  transform: `scale(${showOptionsReceivedEmail ? "1" : "0.8"})`,
                  animation: "fadeIn 0.5s ease",
                }}
              >
                <div
                  style={{
                    cursor: "pointer",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "400",
                    padding: "12px",
                  }}
                >
                  {"Didn't receive email?"}
                </div>
                <div
                  onClick={() => {
                    sendEmailVerificationCode(email);
                  }}
                  className="resend-email"
                  style={{
                    cursor: "pointer",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "700",
                    padding: "12px",
                  }}
                >
                  {"Resend email"}
                </div>
                <div
                  className="use-phone-instead"
                  style={{
                    // cursor: "pointer",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "700",
                    padding: "12px",
                    opacity: "0.5",
                  }}
                >
                  {"Use phone instead"}
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
                    style={{
                      overflowY: "auto",
                      position: "relative",
                    }}
                    className="signin-modal-body-child-non-reactivate create-account-first-tab"
                  >
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
                          style={{
                            color: "rgb(83, 100, 113)",
                            fontSize: "13px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          {fullname.length}/{50}
                        </div>
                      </InputLabel>
                    ) : (
                      <InputLabel
                        style={{
                          width: "81.5%",
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            color: "rgb(83, 100, 113)",
                            fontSize: "13px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          {fullname.length}/{50}
                        </div>
                      </InputLabel>
                    )}

                    <TextField
                      autoFocus={true}
                      onMouseEnter={() => setonFocusedToFullNameField(true)}
                      onMouseLeave={() => setonFocusedToFullNameField(false)}
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
                        style={{
                          width: "81.5%",
                          color: "rgb(244, 33, 46)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
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
                        style={{
                          width: "81.5%",
                          color: "rgb(244, 33, 46)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                          position: "relative",
                          left: "10px",
                        }}
                      >
                        {"Please enter a valid email."}
                      </div>
                    ) : emailTypeError === 200 && email.length ? (
                      <div
                        style={{
                          width: "81.5%",
                          color: "rgb(244, 33, 46)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
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
                        style={{
                          width: "81.5%",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                          color: "#f7555f",
                        }}
                      >
                        {error ? error : null}
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
                    <div
                      className="mt-4"
                      style={{
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
                        Date of birth
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          color: "rgb(83, 100, 113)",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
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
                          width: "100%",
                          height: "58px",
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        {" "}
                        <OverlayTrigger
                          show={showMonthPicker}
                          trigger="click"
                          placement="bottom"
                          overlay={popoverContent}
                        >
                          <div
                            className="child-div-after-overlay-trigger parent-div-month-content-over-flow-y"
                            onClick={handleMonthClick}
                            style={{
                              cursor: "pointer",
                              color: "#536471",
                              flex: "255.5px",
                              padding: "4px",
                              border: "1px solid",
                              borderWidth: styleOfBoxMonth ? "2px" : "1px",
                              borderColor: styleOfBoxMonth
                                ? "#1d9bf0                          "
                                : "#cfd9de",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div className="main-outline-text">Month</div>
                              <div
                                className="mt-2 selected-month-string-parent-div"
                                style={{
                                  fontSize: "17px",
                                  lineHeight: "20px",
                                  color: "black",
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
                          placement="bottom"
                          overlay={popoverDayContent}
                        >
                          <div
                            className="child-div-day-picker-after-overlay-trigger parent-div-day-picker-content-over-flow-y"
                            onClick={handleDayClick}
                            style={{
                              cursor: "pointer",
                              color: "#536471",
                              flex: "113.75px",
                              padding: "4px",
                              marginLeft: "15px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: styleOfBoxDay ? "2px" : "1px",
                              borderColor: styleOfBoxDay
                                ? "#1d9bf0                          "
                                : "#cfd9de",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div className="main-outline-text-day-picker">
                                Day
                              </div>
                              <div
                                className="mt-2 selected-day-string-parent-div"
                                style={{
                                  fontSize: "17px",
                                  lineHeight: "20px",
                                  color: "black",
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
                          placement="bottom"
                          overlay={popoverYearContent}
                        >
                          <div
                            className="child-div-year-picker-after-overlay-trigger parent-div-year-picker-content-over-flow-y"
                            onClick={handleYearClick}
                            style={{
                              cursor: "pointer",
                              color: "#536471",
                              flex: "136.75px",
                              padding: "4px",
                              marginLeft: "15px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: styleOfBoxYear ? "2px" : "1px",
                              borderColor: styleOfBoxYear
                                ? "#1d9bf0                          "
                                : "#cfd9de",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div className="main-outline-text-year-picker">
                                Year
                              </div>
                              <div
                                className="mt-2 selected-year-string-parent-div"
                                style={{
                                  fontSize: "17px",
                                  lineHeight: "20px",
                                  color: "black",
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
                        backgroundColor: "#0f141a",
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
                              }, 300);
                            }
                          : null
                      }
                      className="next-btn"
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
                  <Modal.Body className="signin-modal-body-child-non-reactivate">
                    <LoadingSpinner
                      strokeColor={"rgb(29, 155, 240)"}
                    ></LoadingSpinner>
                  </Modal.Body>
                ) : (
                  <Modal.Body
                    className="signin-modal-body-child-non-reactivate"
                    style={{
                      overflowY: "auto",
                      position: "relative",
                    }}
                  >
                    <div
                      className="mb-4"
                      style={{
                        width: "81.5%",
                        lineHeight: "32px",
                        fontWeight: "700",
                        fontSize: "26px",
                        letterSpacing: "0.5px",
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
                        className="mt-2.5"
                        style={{
                          fontWeight: "700",
                          fontSize: "20px",
                          lineHeight: "24px",
                        }}
                      >
                        Get more out of Connectify
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
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
                              firstClicked
                                ? "hover-customize-your-experience-tab-get-more-out-of-variant"
                                : "hover-customize-your-experience-tab-get-more-out-of-variant-2"
                            }
                          >
                            <div
                              style={{
                                backgroundColor: firstClicked
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: firstClicked
                                  ? "none"
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
                        className="mt-3"
                        style={{
                          fontWeight: "700",
                          fontSize: "20px",
                          lineHeight: "24px",
                        }}
                      >
                        Connect with people you know
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
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
                              secondClicked
                                ? "hover-customize-your-experience-tab-connect-with-people-you-know"
                                : "hover-customize-your-experience-tab-connect-with-people-you-know-variant-2"
                            }
                          >
                            <div
                              style={{
                                backgroundColor: secondClicked
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: secondClicked
                                  ? "none"
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
                        className="mt-3"
                        style={{
                          fontWeight: "700",
                          fontSize: "20px",
                          lineHeight: "24px",
                        }}
                      >
                        Personalized ads
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
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
                              thirdClicked
                                ? "hover-customize-your-experience-tab-personalized-ads"
                                : "hover-customize-your-experience-tab-personalized-ads-variant-2"
                            }
                          >
                            <div
                              style={{
                                backgroundColor: thirdClicked
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: thirdClicked
                                  ? "none"
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
                      className="mt-4"
                      style={{
                        width: "81.5%",
                        color: "rgb(83, 100, 113)",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
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
                        backgroundColor: "#0f141a",
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
                              }, 300);
                            }
                          : null
                      }
                      className="next-btn"
                    >
                      Next
                    </Button>
                  </Modal.Body>
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
                      className="mb-4"
                      style={{
                        width: "81.5%",
                        lineHeight: "32px",
                        fontWeight: "700",
                        fontSize: "26px",
                        zIndex: "100",
                      }}
                    >
                      <div
                        style={{
                          letterSpacing: "0.5px",
                        }}
                      >
                        We sent you a codeasd
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          color: "rgb(83, 100, 113)",
                          fontSize: "15px",
                          lineHeight: "20px",
                          fontWeight: "400",
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
                    <div
                      style={{
                        width: "81.5%",
                      }}
                    >
                      <div
                        className="didn-t-receive-email-text"
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
                        {"Didn't receive email?"}
                      </div>
                    </div>
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor: "#0f141a",
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
                              }, 300);
                            }
                          : () => errorMessageAndCleanTextInput()
                      }
                      className="next-btn"
                    >
                      Next
                    </Button>
                  </Modal.Body>
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
                  <Modal.Body
                    style={{ overflowX: "hidden" }}
                    className="signin-modal-body-child-non-reactivate"
                  >
                    <div
                      className="mb-4"
                      style={{
                        width: "81.5%",
                        lineHeight: "32px",
                        fontWeight: "700",
                        fontSize: "26px",
                        zIndex: "100",
                      }}
                    >
                      <div
                        style={{
                          letterSpacing: "0.5px",
                        }}
                      >
                        {"You'll need a password"}
                      </div>
                      <div
                        className="mt-2.5"
                        style={{
                          color: "rgb(83, 100, 113)",
                          fontSize: "15px",
                          lineHeight: "20px",
                          fontWeight: "400",
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
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              password.length && !passwordIsValid
                                ? "rgb(244, 33, 46)!important"
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
                        label="Password"
                      />
                    </FormControl>
                    <div
                      style={{
                        width: "81.5%",
                        color: "rgb(244, 33, 46)",
                        fontSize: "13px",
                        fontWeight: "400",
                        lineHeight: "16px",
                        position: "relative",
                        left: "10px",
                      }}
                    >
                      {password.length && !passwordIsValid ? error : ""}
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        position: "absolute",
                        bottom: "100px",
                        color: "rgb(83, 100, 113)",
                        fontSize: "13px",
                        fontWeight: "400",
                        lineHeight: "16px",
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
                        backgroundColor: "#0f141a",
                        opacity:
                          password.length >= 8 && passwordIsValid ? "1" : "0.5",
                      }}
                      onClick={
                        password.length >= 8 && passwordIsValid
                          ? handleSignUp
                          : null
                      }
                      className="next-btn"
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
            className={"signin-modal-parent-non-reactivate"}
            show={showCreateAccountModal}
            onHide={handleCloseCreateAccountModal}
            centered={true}
          >
            <Modal.Header
              className="signin-modal-header-child-non-reactivate"
              style={{
                border: "none",
              }}
            >
              <>
                {tabIndex !== 3 ? (
                  <>
                    {tabIndex !== 0 && tabIndex !== 3 ? (
                      <div onClick={() => setTabIndex(tabIndex - 1)}>
                        {" "}
                        <div
                          className="p-2 arrow"
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
                              fontSize: "15px",
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
                      </div>
                    ) : (
                      <div
                        onClick={handleCloseCreateAccountModal}
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
                            onClick={handleCloseCreateAccountModal}
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
                  boxShadow:
                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                  zIndex: "999",
                  transform: `scale(${showOptionsReceivedEmail ? "1" : "0.8"})`,
                  animation: "fadeIn 0.5s ease",
                }}
              >
                <div
                  style={{
                    cursor: "pointer",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "400",
                    padding: "12px",
                  }}
                >
                  {"Didn't receive email?"}
                </div>
                <div
                  onClick={() => {
                    sendEmailVerificationCode(email);
                  }}
                  className="resend-email"
                  style={{
                    cursor: "pointer",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "700",
                    padding: "12px",
                  }}
                >
                  {"Resend email"}
                </div>
                <div
                  className="use-phone-instead"
                  style={{
                    // cursor: "pointer",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "700",
                    padding: "12px",
                    opacity: "0.5",
                  }}
                >
                  {"Use phone instead"}
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
                    className="signin-modal-body-child-non-reactivate create-account-first-tab"
                    style={{
                      overflowY: "auto",
                      position: "relative",
                      overflowX: "hidden",
                    }}
                  >
                    <div
                      className="mb-4"
                      style={{
                        width: "81.5%",
                        lineHeight: "36px",
                        fontWeight: "700",
                        fontSize: "31px",
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
                          style={{
                            color: "rgb(83, 100, 113)",
                            fontSize: "13px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          {fullname.length}/{50}
                        </div>
                      </InputLabel>
                    ) : (
                      <InputLabel
                        style={{
                          width: "81.5%",
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            color: "rgb(83, 100, 113)",
                            fontSize: "13px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          {fullname.length}/{50}
                        </div>
                      </InputLabel>
                    )}
                    <TextField
                      autoFocus={true}
                      onMouseEnter={() => setonFocusedToFullNameField(true)}
                      onMouseLeave={() => setonFocusedToFullNameField(false)}
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
                        style={{
                          width: "81.5%",
                          color: "rgb(244, 33, 46)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
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
                        style={{
                          width: "81.5%",
                          color: "rgb(244, 33, 46)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                          position: "relative",
                          left: "10px",
                        }}
                      >
                        {"Please enter a valid email."}
                      </div>
                    ) : emailTypeError === 200 && email.length ? (
                      <div
                        style={{
                          width: "81.5%",
                          color: "rgb(244, 33, 46)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
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
                        style={{
                          width: "81.5%",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                          color: "#f7555f",
                          position: "relative",
                          left: "10px",
                        }}
                      >
                        {error ? error : null}
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
                    <div
                      className="mt-4"
                      style={{
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
                        Date of birth
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          color: "rgb(83, 100, 113)",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
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
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        {" "}
                        <OverlayTrigger
                          show={showMonthPicker}
                          trigger="click"
                          placement="bottom"
                          overlay={popoverContent}
                        >
                          <div
                            className="child-div-after-overlay-trigger parent-div-month-content-over-flow-y"
                            onClick={handleMonthClick}
                            style={{
                              cursor: "pointer",
                              color: "#536471",
                              flex: "50%",
                              padding: "4px",
                              border: "1px solid",
                              borderWidth: styleOfBoxMonth ? "2px" : "1px",
                              borderColor: styleOfBoxMonth
                                ? "#1d9bf0                          "
                                : "rgb(207, 217, 222)",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div className="main-outline-text">Month</div>
                              <div
                                className="mt-2 selected-month-string-parent-div"
                                style={{
                                  fontSize: "17px",
                                  lineHeight: "20px",
                                  color: "black",
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
                          placement="bottom"
                          overlay={popoverDayContent}
                        >
                          <div
                            className="child-div-day-picker-after-overlay-trigger parent-div-day-picker-content-over-flow-y"
                            onClick={handleDayClick}
                            style={{
                              cursor: "pointer",
                              color: "#536471",
                              flex: "25%",
                              padding: "4px",
                              marginLeft: "15px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: styleOfBoxDay ? "2px" : "1px",
                              borderColor: styleOfBoxDay
                                ? "#1d9bf0                          "
                                : "rgb(207, 217, 222)",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div className="main-outline-text-day-picker">
                                Day
                              </div>
                              <div
                                className="mt-2 selected-day-string-parent-div"
                                style={{
                                  fontSize: "17px",
                                  lineHeight: "20px",
                                  color: "black",
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
                          placement="bottom"
                          overlay={popoverYearContent}
                        >
                          <div
                            className="child-div-year-picker-after-overlay-trigger parent-div-year-picker-content-over-flow-y"
                            onClick={handleYearClick}
                            style={{
                              cursor: "pointer",
                              color: "#536471",
                              flex: "25%",
                              padding: "4px",
                              marginLeft: "15px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: styleOfBoxYear ? "2px" : "1px",
                              borderColor: styleOfBoxYear
                                ? "#1d9bf0                          "
                                : "rgb(207, 217, 222)",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-block",
                                float: "left",
                              }}
                            >
                              <div className="main-outline-text-year-picker">
                                Year
                              </div>
                              <div
                                className="mt-2 selected-year-string-parent-div"
                                style={{
                                  fontSize: "17px",
                                  lineHeight: "20px",
                                  color: "black",
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
                        backgroundColor: "#0f141a",
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
                              }, 300);
                            }
                          : null
                      }
                      className="next-btn"
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
                        className="mt-3"
                        style={{
                          fontWeight: "700",
                          fontSize: "20px",
                          lineHeight: "24px",
                        }}
                      >
                        Get more out of Connectify
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
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
                              firstClicked
                                ? "hover-customize-your-experience-tab-get-more-out-of-variant"
                                : "hover-customize-your-experience-tab-get-more-out-of-variant-2"
                            }
                          >
                            <div
                              style={{
                                backgroundColor: firstClicked
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: firstClicked
                                  ? "none"
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
                        className="mt-3"
                        style={{
                          fontWeight: "700",
                          fontSize: "20px",
                          lineHeight: "24px",
                        }}
                      >
                        Connect with people you know
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
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
                            }}
                          >
                            {" "}
                            Let others find your account by your email address.
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
                              secondClicked
                                ? "hover-customize-your-experience-tab-connect-with-people-you-know"
                                : "hover-customize-your-experience-tab-connect-with-people-you-know-variant-2"
                            }
                          >
                            <div
                              style={{
                                backgroundColor: secondClicked
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: secondClicked
                                  ? "none"
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
                        className="mt-3"
                        style={{
                          fontWeight: "700",
                          fontSize: "20px",
                          lineHeight: "24px",
                        }}
                      >
                        Personalized ads
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
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
                              thirdClicked
                                ? "hover-customize-your-experience-tab-personalized-ads"
                                : "hover-customize-your-experience-tab-personalized-ads-variant-2"
                            }
                          >
                            <div
                              style={{
                                backgroundColor: thirdClicked
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: thirdClicked
                                  ? "none"
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
                      className="mt-2"
                      style={{
                        width: "81.5%",
                        color: "rgb(83, 100, 113)",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
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
                        backgroundColor: "#0f141a",
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
                              }, 300);
                            }
                          : null
                      }
                      className="next-btn"
                    >
                      Next
                    </Button>
                  </Modal.Body>
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
                      className="mb-4"
                      style={{
                        width: "81.5%",
                        lineHeight: "36px",
                        fontWeight: "700",
                        fontSize: "31px",
                        zIndex: "100",
                      }}
                    >
                      <div>We sent you a code</div>
                      <div
                        style={{
                          color: "rgb(83, 100, 113)",
                          fontSize: "15px",
                          lineHeight: "20px",
                          fontWeight: "400",
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
                    <div
                      style={{
                        width: "81.5%",
                      }}
                    >
                      <div
                        className="didn-t-receive-email-text"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          left: "10px",
                          fontSize: "13px",
                          fontWeight: "400",
                          lineHeight: "16px",
                          color: "#1f9cf0                   ",
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
                        backgroundColor: "#0f141a",
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
                              }, 300);
                            }
                          : () => errorMessageAndCleanTextInput()
                      }
                      className="next-btn"
                    >
                      Next
                    </Button>
                  </Modal.Body>
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
                  <Modal.Body
                    style={{}}
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
                      className="mb-4"
                      style={{
                        width: "81.5%",
                        lineHeight: "36px",
                        fontWeight: "700",
                        fontSize: "31px",
                        zIndex: "100",
                      }}
                    >
                      <div>{"You'll need a password"}</div>
                      <div
                        style={{
                          color: "rgb(83, 100, 113)",
                          fontSize: "15px",
                          lineHeight: "20px",
                          fontWeight: "400",
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
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              password.length && !passwordIsValid
                                ? "rgb(244, 33, 46)!important"
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
                        label="Password"
                      />
                    </FormControl>
                    <div
                      style={{
                        width: "81.5%",
                        color: "rgb(244, 33, 46)",
                        fontSize: "13px",
                        fontWeight: "400",
                        lineHeight: "16px",
                        position: "relative",
                        left: "10px",
                      }}
                    >
                      {password.length && !passwordIsValid ? error : ""}
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        position: "absolute",
                        bottom: "100px",
                        color: "rgb(83, 100, 113)",
                        fontSize: "13px",
                        fontWeight: "400",
                        lineHeight: "16px",
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
                        backgroundColor: "#0f141a",
                        opacity:
                          password.length >= 8 && passwordIsValid ? "1" : "0.5",
                      }}
                      onClick={
                        password.length >= 8 && passwordIsValid
                          ? handleSignUp
                          : null
                      }
                      className="next-btn"
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
          height: "100vh",
          maxHeight: "664px",
          padding: "16px",
          maxWidth: "623px",
          minWidth: "380px",
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
            height: "100%",
            padding: "20px",
          }}
        >
          <div
            style={{
              margin: "48px 0px",
            }}
          >
            <span
              style={{
                letterSpacing: width < 501 ? "-0.8px" : "-1.2px",
                fontSize: width < 501 ? "40px" : "64px",
                lineHeight: width < 501 ? "52px" : "84px ",
                fontWeight: "700",
              }}
              className="header-first header"
            >
              Happening now
            </span>
          </div>
          <div
            style={{
              margin: "0px 0px 32px",
            }}
          >
            <span
              style={{
                letterSpacing: width < 501 ? "-0.8px" : "-1.2px",
                fontSize: width < 501 ? "23px" : "31px",
                lineHeight: width < 501 ? "28px" : "36px",
                fontWeight: "700",
              }}
              className="header-second header "
            >
              Join today.
            </span>
          </div>

          <div className="responsive-input-group">
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
                style={{
                  margin: "5px 0px",
                  padding: "0px",
                  maxHeight: "20px",
                  width: "300px",
                  minWidth: "300px",
                }}
                plain
              >
                or
              </Divider>

              <Button
                onClick={handleShowCreateAccountModal}
                className="create-btn"
              >
                Create account
              </Button>

              <p
                style={{
                  // backgroundColor: "indianred",
                  textAlign: "start",
                  lineHeight: "12px",
                  fontSize: "11px",
                  fontWeight: "400",
                  margin: "10px 0px",
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
