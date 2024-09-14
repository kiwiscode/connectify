import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Button, Modal, Stack } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import Picker from "emoji-picker-react";
import axios from "axios";
import "../../index.css";

import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { Steps } from "antd";
import { Divider, List } from "antd";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ThemeContext } from "../../context/ThemeContext";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import RightSideColumn from "../Main-Right-Side-Column/RightSideColumn";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

import io from "socket.io-client";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";

const socket = io.connect(API_URL);
function LogoutModal({
  isResponsiveNavigationBarTop,
  isMobileNavigationBarTop,
}) {
  const [{ theme, themeName }] = useContext(ThemeContext);

  const data = [
    "See your account information like your phone number and email address.",
    "Change your password at any time.",
    "Find out how you can deactivate your account",
  ];

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorInputStyle, seterrorInputStyle] = useState(false);
  const [errorInput, seterrorInput] = useState("");
  const [errorInputStyle2, seterrorInputStyle2] = useState(false);
  const [errorInput2, seterrorInput2] = useState("");
  const [errorInputStyle3, seterrorInputStyle3] = useState(false);
  const [errorInput3, seterrorInput3] = useState("");
  const [errorInputStyle4, seterrorInputStyle4] = useState(false);
  const [errorInput4, seterrorInput4] = useState("");
  const [deactivatePassword, setdeactivatePassword] = useState("");

  const handleDeactivateUser = () => {
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
      .then(() => {
        navigate("/settings/deactivated");
        logout();
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const [confirmed, setConfirmed] = useState(false);
  const checkConfirmPassword = () => {
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
        const status = response.status;
        if (status === 200) {
          setConfirmed(true);
        }
      })
      .catch(() => {
        setConfirmed(false);
      });
  };

  useEffect(() => {
    if (deactivatePassword) {
      checkConfirmPassword();
    }
  }, [deactivatePassword]);

  const { width } = useWindowDimensions();
  const {
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
  const [initialOptionClicked, setInitialOptionClicked] = useState(false);
  const steps = [
    {
      title: (
        <div
          style={{
            color: themeName === "dark-theme" ? "white" : "",
          }}
        >
          First
        </div>
      ),
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
            className="chirp-heavy-font"
            style={{
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
              fontSize: font20.fontSize,
              lineHeight: "24px",
              color: themeName === "dark-theme" ? "white" : "black",
            }}
          >
            This will deactivate your account
          </List.Item>
          <List.Item
            className="chirp-regular-font"
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          >
            You’re about to start the process of deactivating your Connectify
            account. Your display name, @username, and public profile will no
            longer be viewable on Connectify.com, Connectify for iOS, or
            Connectify for Android.
          </List.Item>
          <List.Item
            className="chirp-heavy-font"
            style={{
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
              color: themeName === "dark-theme" ? "white" : "black",
            }}
          >
            What else you should know
          </List.Item>
          <List.Item
            className="chirp-regular-font"
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          >
            Some account information may still be available in search engines,
            such as Google or Bing. Learn more
          </List.Item>

          <List.Item
            className="chirp-regular-font"
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
            }}
          >
            To use your current @username or email address with a different
            Connectify account, change them before you deactivate this account.
          </List.Item>
        </List>
      ),
    },
    {
      title: (
        <div
          style={{
            color: themeName === "dark-theme" ? "white" : "",
          }}
        >
          Second
        </div>
      ),
      content: (
        <div className="responsive-input-group input-group">
          {errorInputStyle3 ? (
            <>
              <div
                className="mt-0 chirp-regular-font"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "rgba(244,39,49,255)",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                }}
              >
                {errorInput3}
              </div>
            </>
          ) : null}
          <div
            className="mt-2 chirp-heavy-font"
            style={{
              padding: "12px",
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
              color: themeName === "dark-theme" ? "white" : "black",
            }}
          >
            Confirm your password
          </div>
          <div
            className="chirp-regular-font"
            style={{
              padding: "12px",
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
            }}
          >
            Complete your deactivation request by entering the password
            associated with your account.
          </div>
          <TextField
            className="mt-2"
            autoFocus={true}
            value={deactivatePassword}
            onChange={(e) => {
              setdeactivatePassword(e.target.value);
            }}
            type="password"
            id="outlined-basic"
            variant={"outlined"}
            label={`Password`}
            style={{
              width: "90%",
              height: "58px",
              position: "relative",
              left: "15px",
            }}
            InputProps={{
              style: {
                color: themeName === "dark-theme" ? "white" : "black",
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
          />{" "}
        </div>
      ),
    },
    {
      title: (
        <div
          style={{
            color: themeName === "dark-theme" ? "white" : "",
          }}
        >
          Last
        </div>
      ),
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
            className="chirp-heavy-font"
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
              color: themeName === "dark-theme" ? "white" : "black",
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          >
            You Are Deactivating Your Account
          </List.Item>
          <List.Item
            className="chirp-regular-font"
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          >
            {
              "Deactivating your account means you won't be able to use it anymore, and your account information will be permanently deleted"
            }
          </List.Item>
          <List.Item
            className="chirp-heavy-font"
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
              color: themeName === "dark-theme" ? "white" : "black",
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          >
            When you deactivate your account:
          </List.Item>
          <List.Item
            className="chirp-regular-font"
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          >
            All your content on Connectify will be removed.
          </List.Item>

          <List.Item
            className="chirp-regular-font"
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          >
            {"Your friends and followers won't be able to contact you."}
          </List.Item>
          <List.Item
            className="chirp-regular-font"
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
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

  const [show, setShow] = useState(false);
  const { getToken, logout, userInfo } = useContext(UserContext);

  const [showLogoutSpinner, setshowLogoutSpinner] = useState(false);
  const handleLogout = () => {
    setshowLogoutSpinner(true);
    socket.emit("logout", localStorage.getItem("socketId"));

    axios
      .post(`${API_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => {
        setTimeout(() => {
          logout();
          setshowLogoutSpinner(false);
          navigate("/");
        }, 1000);
      })
      .catch((err) => {
        err;
      });
  };

  const handleLogoutFromGoogleAccount = () => {
    axios
      .get(`${API_URL}/auth/google-logout`)
      .then(() => {
        setshowLogoutSpinner(true);
        setTimeout(() => {
          logout();
          navigate("/");
          setshowLogoutSpinner(false);
        }, 1000);
      })
      .catch((err) => {
        err;
      });
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const [showlogoutPopup, setShowLogoutPopup] = useState(false);

  // start to check

  const [showAfterChangePasswordScreen, setshowAfterChangePasswordScreen] =
    useState(null);

  const [showDisplayOptionsModal, setshowDisplayOptionsModal] = useState(null);

  const handleCloseDisplayOptionsModal = () => {
    setshowDisplayOptionsModal(false);
  };

  const showDisplayModal = () => {
    setshowDisplayOptionsModal(true);
  };

  const [responsivePlacementLogoutPopup, setresponsivePlacementLogoutPopup] =
    useState("top");

  // finish to check

  const updatePlacementBasedOnScreenWidth = () => {
    const screenWidth = window.innerWidth;
    const newPlacement = screenWidth <= 500 ? "bottom" : "top";
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
    setInitialOptionClicked(false);
    setSelectedSection(null);
    setTabIndex(0);
    setShowDetailAccountInfo(false);
    setshowListItem(true);
  };

  const showSecondTab = () => {
    setInitialOptionClicked(false);
    setSelectedSection(null);
    setTabIndexSecond((prevState) => (prevState === 0 ? 0 : 1));
    setShowDetailChangePasswordInfo(false);
    setshowListItem(true);
  };

  const showThirdTab = () => {
    setInitialOptionClicked(false);
    setSelectedSection(null);
    setTabIndexThird((prevState) => (prevState === 0 ? 0 : 2));
    setShowDetailDeactivateAccountInfo(false);
    setshowListItem(true);
  };

  const handleChangePassword = () => {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (newPassword === oldPassword) {
      seterrorInputStyle2(true);
      seterrorInput2(
        "New password cannot be the same as your existing password.      "
      );
      seterrorInput("");
      seterrorInputStyle(false);

      seterrorInputStyle3(false);
      seterrorInput3("");

      seterrorInputStyle4(false);
      seterrorInput4("");
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
          seterrorInputStyle4(false);
          seterrorInput("");
          seterrorInput2("");
          seterrorInput3("");
          seterrorInput4("");

          showCustomMessage("Your password has been successfully updated.", 4);
        })
        .catch((error) => {
          if (error.response.status === 402) {
            seterrorInput4(
              "Your password needs to be at least 8 characters. Please enter a longer one."
            );
            seterrorInputStyle4(true);

            seterrorInput("");
            seterrorInputStyle(false);

            seterrorInputStyle2(false);
            seterrorInput2("");

            seterrorInputStyle3(false);
            seterrorInput3("");
          }
          if (error.response.status === 401) {
            seterrorInput3("The password you entered was incorrect.");
            seterrorInputStyle3(true);

            seterrorInput("");
            seterrorInputStyle(false);

            seterrorInputStyle2(false);
            seterrorInput2("");

            seterrorInput4("");
            seterrorInputStyle4(false);
          }
        });
    } else if (!regex.test(newPassword) || newPassword.length < 6) {
      seterrorInput4(
        "Your password needs to be at least 8 characters. Please enter a longer one."
      );
      seterrorInputStyle4(true);
      seterrorInput3("");
      seterrorInputStyle3(false);

      seterrorInput("");
      seterrorInputStyle(false);

      seterrorInputStyle2(false);
      seterrorInput2("");
    } else {
      seterrorInput("Passwords do not match.");
      seterrorInputStyle(true);

      seterrorInputStyle2(false);
      seterrorInput2("");

      seterrorInputStyle3(false);
      seterrorInput3("");

      seterrorInput4("");
      seterrorInputStyle4(false);
    }
  };

  useEffect(() => {
    const getClickLocation = (e) => {
      const classList = e.target.classList;
      const parentNodeClassName = e.srcElement.parentNode.className;
      const parentNodeClassNameBaseVal =
        e.srcElement.parentNode.className.baseVal;

      if (
        classList.contains("logout-profile-img") ||
        parentNodeClassName === "p-2 profile-img-and-svg" ||
        classList.contains("p-2 profile-img-and-svg") ||
        classList.contains("stack-logout-navigation-parent") ||
        classList.contains("responsive-logout") ||
        classList.contains("p-2 responsive-logout") ||
        classList.contains("logout-three-dots") ||
        classList.contains("localeInfo-username") ||
        parentNodeClassName === "stack-logout-navigation-parent hstack" ||
        parentNodeClassName === "p-2 responsive-logout" ||
        parentNodeClassNameBaseVal === "profile-svg bi bi-person-circle" ||
        classList.contains("profile-svg-logout-modal") ||
        parentNodeClassNameBaseVal ===
          "profile-svg-logout-modal bi bi-person-circle"
      ) {
        setShowLogoutPopup(true);
      } else {
        setShowLogoutPopup(false);
      }
    };

    document.body.addEventListener("click", getClickLocation);
    return () => {
      document.body.removeEventListener("click", getClickLocation);
    };
  }, [showlogoutPopup]);

  const { updateUser } = useContext(UserContext);

  const [isHoveredIndex, setIsHoveredIndex] = useState(null);

  const [startForgotPasswordProcessModal, setStartForgotPasswordProcessModal] =
    useState(false);

  const handleClose = () => {
    setTimeout(() => {
      setTabIndex(0);
    }, 300);
    setShow(false);
  };

  const startForgotPasswordProcess = () => {
    handleClose();
    setStartForgotPasswordProcessModal(true);
  };

  const handleCloseForgotPasswordProcessModal = () => {
    setshowAfterChangePasswordScreen(false);
    setwhyDidYouChangeyourpasswordScreen(false);
    setverificationCodeSuccessChangePasswordScreen(false);
    setShowEnterVerificationCodeScreen(false);
    setSelectedSection("Your Account");
    setnewPasswordResetPassword("");
    setnewPasswordResetPasswordRepeat("");
    setTimeout(() => {
      setTabIndex(0);
    }, 300);
    setStartForgotPasswordProcessModal(false);
  };

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
  const [
    receivedVerificationCodeForPasswordChange,
    setReceivedVerificationCodeForPasswordChange,
  ] = useState(null);
  const [
    isWaitingForConfirmationCodeSendingProcess,
    setIsWaitingForConfirmationCodeSendingProcess,
  ] = useState(false);

  const [showEnterVerificationCodeScreen, setShowEnterVerificationCodeScreen] =
    useState(false);
  const handleSendForgotPasswordCodeToEmail = () => {
    axios
      .post(
        `${API_URL}/send-forgot-password-code-to-email
  `,
        { forgotPasswordInProcessUser: userInfo }
      )
      .then((response) => {
        setReceivedVerificationCodeForPasswordChange(
          response.data.result.verificationCode.toString()
        );
        setIsWaitingForConfirmationCodeSendingProcess(true);

        setTimeout(() => {
          setTabIndex(null);
          setShowEnterVerificationCodeScreen(true);
          setIsWaitingForConfirmationCodeSendingProcess(false);
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };
  const [verificationCodeInput, setVerificationCodeInput] = useState("");

  const { showCustomMessage, contextHolder } = useAntdMessageHandler();

  const [
    verificationCodeSuccessChangePasswordScreen,
    setverificationCodeSuccessChangePasswordScreen,
  ] = useState(false);

  const handleTabChangeAfterSuccessVerificationCode = () => {
    setVerificationCodeInput("");
    setShowEnterVerificationCodeScreen(false);
    setverificationCodeSuccessChangePasswordScreen(true);
  };

  const [newPasswordResetPassword, setnewPasswordResetPassword] = useState("");
  const [newPasswordResetPasswordRepeat, setnewPasswordResetPasswordRepeat] =
    useState("");

  const [isValidPassword, setIsValidPassword] = useState(null);

  const [errorResetPassword, setErrorResetPassword] = useState("");
  const [errorResetPassword2, setErrorResetPassword2] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const [
    whyDidYouChangeyourpasswordScreen,
    setwhyDidYouChangeyourpasswordScreen,
  ] = useState(null);

  useEffect(() => {
    setIsValidPassword(passwordRegex.test(newPasswordResetPassword));
  }, [newPasswordResetPassword]);

  const handleChangePasswordSubmit = () => {
    axios
      .post(
        `${API_URL}/change-password-forgot-password-process`,
        {
          newPassword: newPasswordResetPassword,
          user: userInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {})
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const resetPassword = () => {
    if (!isValidPassword) {
      setErrorResetPassword(
        "Your password needs to be at least 8 characters. Please enter a longer one."
      );
      setErrorResetPassword2("");
    } else if (newPasswordResetPassword !== newPasswordResetPasswordRepeat) {
      setErrorResetPassword("");
      setErrorResetPassword2("Passwords do not match.");
    } else {
      setErrorResetPassword("");
      setErrorResetPassword2("");
      handleChangePasswordSubmit();
      setwhyDidYouChangeyourpasswordScreen(true);
    }
  };

  const [hoveredOption, setHoveredOption] = useState(null);

  const [defaultModeClicked, setdefaultModeClicked] = useState(false);

  const [
    rightSideColumSubscriptionModalStatus,
    setRightSideColumSubscriptionModalStatus,
  ] = useState(null);
  const grapRightSideColumnSubscriptionModalOpenedOrClosedStatus = (data) => {
    console.log(
      "Data received from rightsidecolumn component for subscription modal status =>",
      data
    );
    setRightSideColumSubscriptionModalStatus(data);
  };

  return (
    <>
      {isMobileNavigationBarTop && (
        <div
          onClick={() => setShowLogoutModal(true)}
          className={
            themeName === "dark-theme"
              ? "hover-effect-dark-theme-pointer-plus"
              : "hover-effect-light-theme-pointer-plus"
          }
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexBasis: "auto",
            boxSizing: "border-box",
            flexShrink: "0",
            margin: "0px",
            minHeight: "0px",
            minWidth: "0px",
            position: "relative",
            padding: "16px",
          }}
        >
          <div
            href=""
            style={{
              maxWidth: "100%",
              outlineStyle: "none",
              cursor: "pointer",
              flexGrow: "1",
              boxSizing: "border-box",
              display: "flex",
              flexBasis: "auto",
              flexDirection: "column",
              flexShrink: "0",
              listStyle: "none",
              margin: "0px",
              padding: "0px",
              minWidth: "0px",
              minHeight: "0px",
              position: "relative",
              textDecoration: "none",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexGrow: "1",
                padding: "16px",
                boxSizing: "border-box",
                flexBasis: "auto",
                flexShrink: "0",
                margin: "0px",
                padding: "0px",
                minWidth: "0px",
                minHeight: "0px",
                position: "relative",
                textDecoration: "none",
                pointerEvents: "auto",
                cursor: "pointer",
              }}
            >
              <svg
                style={{
                  marginRight: "24px",
                  userSelect: "none",
                  flexShrink: "0",
                  maxWidth: "100%",
                  position: "relative",
                  alignItems: "center",
                  display: "inline-block",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
                fill={
                  themeName === "dark-theme"
                    ? "rgb(231,233,234)"
                    : "rgb(15, 20, 25)"
                }
                width={24}
                height={24}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                data-testid="icon"
              >
                <g>
                  <path d="M4 4.5C4 3.12 5.12 2 6.5 2h11C18.88 2 20 3.12 20 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 22 4 20.88 4 19.5V16h2v3.5c0 .28.22.5.5.5h11c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-11c-.28 0-.5.22-.5.5V8H4V4.5zm6.95 3.04L15.42 12l-4.47 4.46-1.41-1.42L11.58 13H2v-2h9.58L9.54 8.96l1.41-1.42z"></path>
                </g>
              </svg>
              <div
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                }
                style={{
                  textOverflow: "unset",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                  minWidth: "0px",
                  fontSize: font20.fontSize,
                  whiteSpace: "nowrap",
                  textAlign: "inherit",
                  flexGrow: "1",
                  lineHeight: "24px",
                  overflow: "hidden",
                  boxSizing: "border-box",
                  margin: "0px",
                  padding: "0px",
                  position: "relative",
                  listStyle: "none",
                  textDecoration: "none",
                }}
              >
                Log out
              </div>
            </div>
          </div>
        </div>
      )}

      {contextHolder}
      {showLogoutSpinner ? (
        <>
          <Modal
            className="logout-modal-variant-parent-visible-mode-spinner"
            style={{
              backgroundColor:
                showLogoutSpinner && themeName !== "dark-theme"
                  ? "white"
                  : showLogoutSpinner && themeName === "dark-theme"
                  ? "black"
                  : "",
              zIndex: 99999,
            }}
            size="sm"
            centered={true}
            show={showLogoutModal}
          >
            {/* start to check  */}

            <Modal.Body
              style={{
                backgroundColor: themeName === "dark-theme" ? "black" : "white",
                border: "2px solid black !important",
              }}
              className="logout-modal-variant"
            >
              <LoadingSpinner
                strokeColor={"rgb(29, 155, 240)"}
              ></LoadingSpinner>
              <div
                className="mt-3 chirp-bold-font"
                style={{
                  color: themeName === "dark-theme" ? "#71767A" : "#536471",
                  letterSpacing: "-.5px",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                Logging out
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <></>
      )}

      <Modal
        className={
          width <= 700
            ? `logout-modal-variant-parent-smaller-than-700 logout-modal-variant-parent-smaller-than-700-${themeName}`
            : `logout-modal-variant-parent logout-modal-variant-parent-${themeName}`
        }
        style={{
          backgroundColor:
            showLogoutModal && themeName !== "dark-theme"
              ? "#999999"
              : showLogoutModal && themeName === "dark-theme"
              ? "#232E36"
              : "",
          zIndex: 99999,
        }}
        size="sm"
        centered={true}
        show={showLogoutModal}
      >
        {/* start to check  */}

        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="logout-modal-variant"
        >
          <svg
            style={{}}
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
          </svg>{" "}
          <div
            className="mt-2"
            style={{
              width: "89%",
            }}
          >
            <div
              className="mt-2 chirp-bold-font"
              style={{
                width: "100%",

                fontSize: font20.fontSize,
                lineHeight: font20.lineHeight,
                color: themeName === "dark-theme" ? "white" : "black",
              }}
            >
              Log out of C?
            </div>
            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
                color: themeName === "dark-theme" ? " #71767A" : "#536471",
              }}
              className="mt-2 chirp-regular-font"
            >
              You can always log back in at any time. If you just want to switch
              accounts, you can do that by adding an existing account.
            </div>
            <Button
              // className="login-button mt-4 next-btn"
              className={`login-button mt-4 next-btn ${themeName}-white-btn chirp-bold-font`}
              variant="dark"
              style={{
                width: "256px",
                height: "44px",
                color: themeName === "dark-theme" ? "black" : "white",
                backgroundColor:
                  themeName === "dark-theme" ? "white" : "#0f141a",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              onClick={() =>
                userInfo.signedUpWithGoogle.isSignedUpWithGoogle
                  ? handleLogoutFromGoogleAccount()
                  : handleLogout()
              }
            >
              Log out
            </Button>
            <Button
              onClick={() => setShowLogoutModal(false)}
              className={` forgot-password-btn ${themeName}-black-btn chirp-bold-font`}
              variant="light"
              style={{
                width: "256px",
                height: "44px",
                color: themeName === "dark-theme" ? "white" : "black",
                backgroundColor: themeName === "dark-theme" ? "black" : "white",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
                position: "relative",
                top: "12px",
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {contextHolder}
      {/* popover basic test start to check  */}
      {width > 1201 && (
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <Button
                className={width <= 1440 ? "mt-5" : ""}
                {...bindTrigger(popupState)}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                }}
                variant="text"
              >
                <Stack
                  className={`stack-logout-navigation-parent stack-logout-navigation-parent-${themeName}`}
                  style={{
                    borderRadius: "9999px",
                    cursor: "pointer",
                    // padding: "3px",
                    width: "250px",

                    position: "relative",
                    right: "12px",
                  }}
                  direction="horizontal"
                >
                  <div
                    style={{ position: "relative", left: "10px" }}
                    className="profile-img-and-svg"
                  >
                    {/* start to check */}
                    {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                      <div>
                        <img
                          className="profile-img logout-profile-img"
                          src={userInfo?.imageUrl}
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
                          fill={
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)"
                          }
                          className="profile-svg-logout-modal bi bi-person-circle"
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
                  </div>
                  {/* finish to check */}

                  <div
                    className="p-2 responsive-logout"
                    style={{ position: "relative", left: "10px" }}
                  >
                    <div>
                      <div
                        className="chirp-bold-font"
                        style={{
                          color: themeName === "dark-theme" ? "white" : "black",
                          // lineHeight: "20px",
                          fontSize: font15.fontSize,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "120px",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                          }
                        >
                          {userInfo?.fullname}
                        </span>
                        {userInfo?.isPrivate && (
                          <span
                            style={{
                              marginLeft: "5px",
                            }}
                          >
                            <svg
                              fill={
                                themeName === "dark-theme"
                                  ? "#E6E9EA"
                                  : "#0F141A"
                              }
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              viewBox="0 0 24 24"
                              aria-label="Protected account"
                              role="img"
                              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-18jsvk2 r-f9ja8p r-og9te1"
                              data-testid="icon-lock"
                            >
                              <g>
                                <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
                              </g>
                            </svg>
                          </span>
                        )}
                      </div>
                      <div
                        className="chirp-regular-font"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "120px",
                          textAlign: "left",
                        }}
                      >
                        @{userInfo?.username}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      right: "12px",
                    }}
                    className="ms-auto responsive-logout"
                  >
                    <svg
                      color={themeName === "dark-theme" ? "white" : ""}
                      fill="currentColor"
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
                </Stack>
              </Button>{" "}
              <Popover
                style={{
                  display: rightSideColumSubscriptionModalStatus ? "none" : "",
                }}
                open={popupState.open}
                onClose={popupState.close}
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                className={`${
                  themeName === "dark-theme"
                    ? "popover-material-ui-dark-theme"
                    : themeName !== "dark-theme"
                    ? "popover-material-ui-light-theme"
                    : "hideshowMessageDeletePopover "
                }`}
              >
                {" "}
                <div
                  style={{
                    height: width <= 700 ? "12%" : "50px",
                    width: "300px",
                  }}
                  className="logout-body"
                >
                  <div
                    className={`logout-popover logout-popover-${themeName}`}
                    onClick={() => {
                      handleOpenLogoutModal();
                      popupState.close();
                    }}
                    style={{
                      paddingBottom: "12px",
                      paddingTop: "5px",
                      lineHeight: "20px",
                      fontWeight: "700",
                      fontSize: font15.fontSize,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        position: "relative",
                        left: "10px",
                        color: themeName === "dark-theme" ? "white" : "",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                      className="chirp-bold-font"
                    >
                      Log out @{userInfo?.username}
                    </span>
                  </div>
                </div>
              </Popover>
            </div>
          )}
        </PopupState>
      )}

      {width <= 1201 && width > 500 && (
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div
              style={{
                padding: "0px",
                margin: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "84px",
              }}
            >
              <Button
                className={
                  themeName === "dark-theme"
                    ? "hover-home-dark-theme"
                    : "hover-home"
                }
                {...bindTrigger(popupState)}
                style={{
                  border: "none",
                  borderRadius: "50%",
                  height: "60px",
                  width: "60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                variant="text"
              >
                <Stack
                  style={{
                    cursor: "pointer",
                    height: "50px",
                    width: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  direction="horizontal"
                >
                  {/* start to check */}
                  {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                    <img
                      src={userInfo?.imageUrl}
                      width={40}
                      height={40}
                      alt=""
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={40}
                      fill={
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)"
                      }
                      className="profile-svg-logout-modal bi bi-person-circle"
                      viewBox="0 0 16 16"
                      style={{
                        borderRadius: "50%",
                      }}
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                  )}

                  {/* finish to check */}
                </Stack>
              </Button>{" "}
              <Popover
                style={{
                  display: rightSideColumSubscriptionModalStatus ? "none" : "",
                }}
                open={popupState.open}
                onClose={popupState.close}
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                className={`${
                  themeName === "dark-theme"
                    ? "popover-material-ui-dark-theme"
                    : themeName !== "dark-theme"
                    ? "popover-material-ui-light-theme"
                    : "hideshowMessageDeletePopover "
                }`}
              >
                {" "}
                <div
                  style={{
                    height: width <= 700 ? "12%" : "50px",
                    width: "300px",
                  }}
                  className="logout-body"
                >
                  {/* settings icon finish to check  */}
                  <div
                    className={`logout-popover chirp-bold-font logout-popover-${themeName}`}
                    onClick={() => {
                      handleOpenLogoutModal();
                      popupState.close();
                    }}
                    style={{
                      paddingBottom: "12px",
                      paddingTop: "5px",
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        position: "relative",
                        left: "10px",
                        color: themeName === "dark-theme" ? "white" : "",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                      className="chirp-bold-font"
                    >
                      Log out @{userInfo?.username}
                    </span>
                  </div>
                </div>
              </Popover>
            </div>
          )}
        </PopupState>
      )}

      {/* popover basic test finish to check  */}
    </>
  );
}

export default LogoutModal;
