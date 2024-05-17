import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Button, Modal, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import useSound from "use-sound";

import ActiveLightModeSound from "../../assets/light-mode-active.mp3";
import ActiveDarkModeSound from "../../assets/dark-mode-active.mp3";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

import io from "socket.io-client";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
const socket = io.connect(API_URL);
function LogoutModal() {
  const [
    { theme, themeName, activeFontSizeOption },
    toggleThemeBetweenLightDarkMode,
    toggleChangeFontSize,
  ] = useContext(ThemeContext);

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
            style={{
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
              color: themeName === "dark-theme" ? "white" : "black",
            }}
          >
            This will deactivate your account
          </List.Item>
          <List.Item
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
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
            style={{
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
              color: themeName === "dark-theme" ? "white" : "black",
            }}
          >
            What else you should know
          </List.Item>
          <List.Item
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
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
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
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
              padding: "12px",
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
              color: themeName === "dark-theme" ? "white" : "black",
            }}
          >
            Confirm your password
          </div>
          <div
            style={{
              padding: "12px",
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
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
            style={{
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
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
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
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
            style={{
              fontSize: "20px",
              fontWeight: "800",
              lineHeight: "24px",
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
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
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
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
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
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
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
  const localeInfo = JSON.parse(localStorage.getItem("userInfo"));
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

  const handleShow = () => {
    setShow(true);
  };

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
  const [user, setUser] = useState([]);

  // const getUser = async () => {
  //   try {
  //     const url = `${API_URL}/auth/login-success`;
  //     const { data } = await axios.get(url, { withCredentials: true });
  //     updateUser(data.user);
  //     setUser(data.user);
  //     console.log("data =>", data);
  //     localStorage.setItem("userInfo", JSON.stringify(data.user));
  //     localStorage.setItem("token", data.token);
  //   } catch (err) {
  //     console.log("Error =>", err);
  //   }
  // };

  // useEffect(() => {
  //   getUser();
  // }, []);

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

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "white",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: themeName === "dark-theme" ? "#495a68" : "",
    },
  }));

  const [hoveredOption, setHoveredOption] = useState(null);

  const [play] = useSound(
    themeName === "dark-theme"
      ? ActiveLightModeSound
      : themeName === "light-theme"
      ? ActiveDarkModeSound
      : null
  );

  return (
    <>
      {width <= 700 && (
        <Modal
          style={{
            height: "100vh",
            margin: "0px",
            padding: "0px",
            backgroundColor: themeName === "dark-theme" ? "black" : "white",
            zIndex: 9999,
            width: "100%",
          }}
          show={showDisplayOptionsModal}
          onHide={handleCloseDisplayOptionsModal}
          dialogClassName="modal-fullscreen"
          className={
            themeName === "dark-theme"
              ? "dark-theme-display-options-modal"
              : "display-options-modal"
          }
        >
          <div
            style={{
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "5%",
              }}
            >
              <div
                onClick={handleCloseDisplayOptionsModal}
                // className="p-2 arrow"
                className={`p-2 arrow arrow-${themeName}`}
                style={{
                  position: "relative",
                  bottom: "3px",
                  width: "30px",
                  height: " 30px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <svg
                  color={themeName === "dark-theme" ? "white" : ""}
                  fill="currentColor"
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    border: "none",
                    left: "5px",
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
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "24px",
                  color: themeName === "dark-theme" ? "#E6E9EA" : "black",
                }}
              >
                Display
              </h2>
            </div>
            <div
              className="mt-4"
              style={{
                lineHeight: "15px",
                fontSize: "12px",
                fontWeight: "400",
                color:
                  themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              }}
            >
              Manage your font size, color, and background. These settings
              affect all the C accounts on this browser.
            </div>
            <div className="mt-4">
              <div
                style={{
                  float: "left",
                  height: "65px",
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
                  display: "flex",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    color: themeName === "dark-theme" ? "#E6E9EA" : "black",
                  }}
                >
                  C
                </div>
                <div
                  style={{
                    marginLeft: "5px",
                  }}
                >
                  {" "}
                  <span
                    style={{
                      position: "relative",
                      bottom: "2px",
                    }}
                    className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5"
                  >
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
                </div>

                <div
                  style={{
                    color: themeName === "dark-theme" ? "#71767A" : "",
                    marginLeft: "5px",
                  }}
                >
                  @C
                </div>
                <div
                  style={{
                    color: themeName === "dark-theme" ? "#71767A" : "",
                    marginLeft: "5px",
                  }}
                >
                  <span>&middot;</span>
                  <span
                    style={{
                      marginLeft: "5px",
                    }}
                  >
                    1h
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: themeName === "dark-theme" ? "#E6E9EA" : "black",
                }}
              >
                At the hart of C are short messages called posts{" "}
                <span className="double-dash">-</span>- just like this one{" "}
                <span className="double-dash">-</span>- which can include
                photos, videos, links, text, hashtags, and mentions like{" "}
                <span
                  style={{
                    color: "#1C9BEF",
                  }}
                >
                  @C
                </span>
                .
              </div>
            </div>

            <div
              className="mt-3"
              style={{
                margin: "-16px",

                borderBottom:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>
          </div>
          <div
            style={{
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "19px",
                lineHeight: "23px",
                fontWeight: "800",
                color: themeName === "dark-theme" ? "#E6E9EA" : "black",
              }}
            >
              Font size
            </div>
            <div className="mt-4">
              <div
                style={{
                  display: "flex",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    lineHeight: "14px",
                    fontWeight: "400",
                    color: themeName === "dark-theme" ? "#E6E9EA" : "black",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>Aa</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <BootstrapTooltip title="Extra small">
                    <div
                      onMouseEnter={() => setHoveredOption("Extra small")}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        backgroundColor:
                          hoveredOption === "Extra small" &&
                          themeName !== "dark-theme"
                            ? "#e8f2fb"
                            : hoveredOption === "Extra small" &&
                              themeName === "dark-theme"
                            ? "#0a141d                            "
                            : null,
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "15px",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        onClick={() => toggleChangeFontSize("Extra Small 12px")}
                        style={{
                          zIndex: 9999,
                          width:
                            activeFontSizeOption !== "Extra Small 12px"
                              ? "10px"
                              : "16px",
                          height:
                            activeFontSizeOption !== "Extra Small 12px"
                              ? "10px"
                              : "16px",
                          borderRadius: "50%",
                          backgroundColor:
                            activeFontSizeOption === "Extra Small 12px" ||
                            activeFontSizeOption === "Default 16px" ||
                            activeFontSizeOption === "Small 14px" ||
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "#1C9BEF"
                              : "#8ECCF8",
                        }}
                      ></div>
                    </div>
                  </BootstrapTooltip>
                  <div
                    style={{
                      marginLeft: "-13px",
                      marginRight: "-13px",
                    }}
                    className={
                      themeName !== "dark-theme"
                        ? `border-display-font-size-option ${
                            activeFontSizeOption === "Default 16px" ||
                            activeFontSizeOption === "Small 14px" ||
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "active"
                              : "non-active"
                          } `
                        : `border-display-font-size-option-dark-theme ${
                            activeFontSizeOption === "Default 16px" ||
                            activeFontSizeOption === "Small 14px" ||
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "active"
                              : "non-active"
                          } `
                    }
                  ></div>
                  <BootstrapTooltip title="Small">
                    <div
                      onMouseEnter={() => setHoveredOption("Small")}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        backgroundColor:
                          hoveredOption === "Small" &&
                          themeName !== "dark-theme"
                            ? "#e8f2fb"
                            : hoveredOption === "Small" &&
                              themeName === "dark-theme"
                            ? "#0a141d                            "
                            : null,
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        onClick={() => toggleChangeFontSize("Small 14px")}
                        style={{
                          zIndex: 9999,
                          width:
                            activeFontSizeOption !== "Small 14px"
                              ? "10px"
                              : "16px",
                          height:
                            activeFontSizeOption !== "Small 14px"
                              ? "10px"
                              : "16px",
                          borderRadius: "50%",
                          backgroundColor:
                            activeFontSizeOption === "Default 16px" ||
                            activeFontSizeOption === "Small 14px" ||
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "#1C9BEF"
                              : "#8ECCF8",
                        }}
                      ></div>
                    </div>
                  </BootstrapTooltip>
                  <div
                    style={{
                      marginLeft: "-13px",
                      marginRight: "-13px",
                    }}
                    className={
                      themeName !== "dark-theme"
                        ? `border-display-font-size-option ${
                            activeFontSizeOption === "Default 16px" ||
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "active"
                              : "non-active"
                          } `
                        : `border-display-font-size-option-dark-theme ${
                            activeFontSizeOption === "Default 16px" ||
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "active"
                              : "non-active"
                          } `
                    }
                  ></div>
                  <BootstrapTooltip title="Default">
                    <div
                      onMouseEnter={() => setHoveredOption("Default")}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        backgroundColor:
                          hoveredOption === "Default" &&
                          themeName !== "dark-theme"
                            ? "#e8f2fb"
                            : hoveredOption === "Default" &&
                              themeName === "dark-theme"
                            ? "#0a141d                            "
                            : null,
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        onClick={() => toggleChangeFontSize("Default 16px")}
                        style={{
                          zIndex: 9999,
                          width:
                            activeFontSizeOption !== "Default 16px"
                              ? "10px"
                              : "16px",
                          height:
                            activeFontSizeOption !== "Default 16px"
                              ? "10px"
                              : "16px",
                          borderRadius: "50%",
                          backgroundColor:
                            activeFontSizeOption === "Default 16px" ||
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "#1C9BEF"
                              : "#8ECCF8",
                        }}
                      ></div>
                    </div>
                  </BootstrapTooltip>
                  <div
                    style={{
                      marginLeft: "-13px",
                      marginRight: "-13px",
                    }}
                    className={
                      themeName !== "dark-theme"
                        ? `border-display-font-size-option ${
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "active"
                              : "non-active"
                          } `
                        : `border-display-font-size-option-dark-theme ${
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "active"
                              : "non-active"
                          } `
                    }
                  ></div>
                  <BootstrapTooltip title="Large">
                    <div
                      onMouseEnter={() => setHoveredOption("Large")}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        backgroundColor:
                          hoveredOption === "Large" &&
                          themeName !== "dark-theme"
                            ? "#e8f2fb"
                            : hoveredOption === "Large" &&
                              themeName === "dark-theme"
                            ? "#0a141d                            "
                            : null,
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        onClick={() => toggleChangeFontSize("Large 18px")}
                        style={{
                          zIndex: 9999,

                          width:
                            activeFontSizeOption !== "Large 18px"
                              ? "10px"
                              : "16px",
                          height:
                            activeFontSizeOption !== "Large 18px"
                              ? "10px"
                              : "16px",
                          borderRadius: "50%",
                          backgroundColor:
                            activeFontSizeOption === "Large 18px" ||
                            activeFontSizeOption === "Extra Large 20px"
                              ? "#1C9BEF"
                              : "#8ECCF8",
                        }}
                      ></div>
                    </div>
                  </BootstrapTooltip>
                  <div
                    style={{
                      marginLeft: "-13px",
                    }}
                    className={
                      themeName !== "dark-theme"
                        ? `border-display-font-size-option ${
                            activeFontSizeOption === "Extra Large 20px"
                              ? "active"
                              : "non-active"
                          } `
                        : `border-display-font-size-option-dark-theme ${
                            activeFontSizeOption === "Extra Large 20px"
                              ? "active"
                              : "non-active"
                          } `
                    }
                  ></div>
                  <BootstrapTooltip title="Extra large">
                    <div
                      onMouseEnter={() => setHoveredOption("Extra large")}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        backgroundColor:
                          hoveredOption === "Extra large" &&
                          themeName !== "dark-theme"
                            ? "#e8f2fb"
                            : hoveredOption === "Extra large" &&
                              themeName === "dark-theme"
                            ? "#0a141d"
                            : null,
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "-13px",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        onClick={() => toggleChangeFontSize("Extra Large 20px")}
                        style={{
                          zIndex: 9999,

                          width:
                            activeFontSizeOption === "Extra Large 20px"
                              ? "16px"
                              : "10px",
                          height:
                            activeFontSizeOption === "Extra Large 20px"
                              ? "16px"
                              : "10px",
                          borderRadius: "50%",
                          backgroundColor:
                            activeFontSizeOption === "Extra Large 20px"
                              ? "#1C9BEF"
                              : "#8ECCF8",
                        }}
                      ></div>
                    </div>
                  </BootstrapTooltip>
                </div>
                <div
                  style={{
                    marginLeft: "20px",
                    fontSize: "18px",
                    lineHeight: "22px",
                    fontWeight: "400",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: themeName === "dark-theme" ? "#E6E9EA" : "black",
                  }}
                >
                  Aa
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          ></div>
          <div
            style={{
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "19px",
                lineHeight: "23px",
                fontWeight: "800",
                color: themeName === "dark-theme" ? "#E6E9EA" : "black",
              }}
            >
              Color
            </div>
            <div
              className="mt-4"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#1C9BEF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  border: "none",
                }}
              >
                <svg
                  width={25}
                  height={25}
                  fill="white"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-6zzn7w r-q1j0wu"
                >
                  <g>
                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                  </g>
                </svg>
              </div>
              <Tooltip title="This feature is not yet active. ">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#FFD400",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    border: "none",
                  }}
                ></div>
              </Tooltip>

              <Tooltip title="This feature is not yet active. ">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#F9197F",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                  }}
                ></div>
              </Tooltip>

              <Tooltip title="This feature is not yet active. ">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#7855FF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                  }}
                ></div>
              </Tooltip>

              <Tooltip title="This feature is not yet active. ">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#FE7900",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                  }}
                ></div>
              </Tooltip>

              <Tooltip title="This feature is not yet active. ">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#00BA7C",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                  }}
                ></div>
              </Tooltip>
            </div>
          </div>
          <div
            style={{
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          ></div>{" "}
          <div
            style={{
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "19px",
                lineHeight: "23px",
                fontWeight: "800",
                color: themeName === "dark-theme" ? "#E6E9EA" : "black",
              }}
            >
              Background
            </div>
            <div
              className="mt-4"
              style={{
                display: "flex",
                flexDirection: width <= 600 ? "column" : "",
                justifyContent: "space-between",
                gap: "2%",
                position: "relative",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (themeName !== "light-theme") {
                    toggleThemeBetweenLightDarkMode();
                    play();
                  }
                }}
              >
                <div
                  style={{
                    width: width <= 600 ? "80vw" : "180px",
                    marginTop: width <= 600 ? "10px" : "",
                    height: "60px",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    backgroundColor: "white",
                    border:
                      themeName !== "dark-theme" ? "2px solid #1d9bf0" : "",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    {" "}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        position: "relative",
                        backgroundColor: "transparent",
                      }}
                      className={
                        themeName === "light-theme"
                          ? `ms-auto hover-forgot-password-send-email-stack-svg-verified-email
                                 hover-forgot-password-send-email-stack-svg-verified-email-${themeName}`
                          : `ms-auto 
                                  hover-forgot-password-send-email-stack-svg-verified-email-variant-2 hover-forgot-password-send-email-stack-svg-verified-email-variant-2-${themeName}`
                      }
                    >
                      <div
                        style={{
                          backgroundColor:
                            themeName === "light-theme"
                              ? "#1d9bf0"
                              : "transparent",
                          border:
                            themeName === "light-theme"
                              ? "none"
                              : themeName !== "dark-theme"
                              ? "2px solid #71767A"
                              : "2px solid rgb(70, 70, 70)",
                          width: "20px",
                          height: "20px",
                          position: "relative",
                          // left: "10px",
                          top: "10px",
                          borderRadius: "50%",
                        }}
                      >
                        <svg
                          style={{
                            position: "relative",
                            left: "2px",
                            bottom: "4px",
                            display:
                              themeName === "light-theme" ? "initial" : "none",
                          }}
                          width={16}
                          height={16}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                          fill={
                            themeName === "light-theme" &&
                            themeName === "light-theme"
                              ? "white"
                              : ""
                          }
                        >
                          <g>
                            <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  >
                    Default
                  </div>
                </div>
              </div>
              <BootstrapTooltip title="This feature is not yet active. ">
                <div>
                  <div
                    style={{
                      width: width <= 600 ? "80vw" : "180px",
                      marginTop: width <= 600 ? "10px" : "",
                      height: "60px",
                      backgroundColor: "#15202B",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      border:
                        // themeName === "dark-theme"
                        //   ? "2px solid #1d9bf0"
                        //   : themeName === "light-theme"
                        //   ? "none"
                        //   :
                        "1px solid rgb(70,70,70)",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "transparent",
                      }}
                    >
                      {" "}
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          position: "relative",
                          backgroundColor: "#15202B",
                          // backgroundColor: "transparent",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#15202B",
                            border: "2px solid rgb(70, 70, 70)",
                            width: "20px",
                            height: "20px",
                            position: "relative",
                            // left: "10px",
                            top: "10px",
                            borderRadius: "50%",
                          }}
                        >
                          <svg
                            style={{
                              position: "relative",
                              left: "0px",
                              bottom: "6px",
                              display: "none",
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
                      style={{
                        backgroundColor: "transparent",
                        color: "#F6F9F9",
                        fontSize: "15px",
                        fontWeight: "700",
                      }}
                    >
                      Dim
                    </div>
                  </div>
                </div>
              </BootstrapTooltip>
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (themeName !== "dark-theme") {
                    toggleThemeBetweenLightDarkMode();
                    play();
                  }
                }}
              >
                <div
                  style={{
                    width: width <= 600 ? "80vw" : "180px",
                    marginTop: width <= 600 ? "10px" : "",
                    height: "60px",
                    backgroundColor: "black",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    border:
                      themeName === "dark-theme" ? "2px solid #1d9bf0" : "",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    {" "}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        position: "relative",
                        backgroundColor: "transparent",
                      }}
                      className={
                        themeName === "dark-theme"
                          ? `ms-auto hover-forgot-password-send-email-stack-svg-verified-email
                                 hover-forgot-password-send-email-stack-svg-verified-email-${themeName}`
                          : `ms-auto 
                                  hover-forgot-password-send-email-stack-svg-verified-email-variant-2 hover-forgot-password-send-email-stack-svg-verified-email-variant-2-${themeName}`
                      }
                    >
                      <div
                        style={{
                          backgroundColor:
                            themeName === "dark-theme"
                              ? "#1d9bf0"
                              : "transparent",
                          border:
                            themeName === "dark-theme"
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
                            display:
                              themeName === "dark-theme" ? "initial" : "none",
                          }}
                          width={16}
                          height={16}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                          fill={themeName === "dark-theme" ? "white" : ""}
                        >
                          <g>
                            <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "transparent",
                      color: "#E6E9EA",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  >
                    Lights out
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
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
                className="mt-3"
                style={{
                  color: themeName === "dark-theme" ? "#71767A" : "#536471",
                  letterSpacing: "-1.1px",
                  fontSize: "16px",
                  fontWeight: "600",
                  lineHeight: "20px",
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
          zIndex: 9999,
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
          <div
            style={{
              width: "92%",
            }}
          >
            <div
              className="mt-2"
              style={{
                width: "100%",

                lineHeight: "24px",
                fontWeight: "700",
                fontSize: "20px",
                color: themeName === "dark-theme" ? "white" : "black",
              }}
            >
              Log out of C?
            </div>
            <div
              style={{
                lineHeight: "20px",
                fontWeight: "400",
                fontSize: "15px",
                color: themeName === "dark-theme" ? " #71767A" : "#536471",
              }}
              className="mt-2"
            >
              You can always log back in at any time. If you just want to switch
              accounts, you can do that by adding an existing account.
            </div>

            <Button
              // className="login-button mt-4 next-btn"
              className={`login-button mt-4 next-btn ${themeName}-white-btn`}
              variant="dark"
              style={{
                width: "256px",
                height: "44px",
                color: themeName === "dark-theme" ? "black" : "white",
                backgroundColor:
                  themeName === "dark-theme" ? "white" : "#0f141a",
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
              className={`mt-2 forgot-password-btn ${themeName}-black-btn`}
              variant="light"
              style={{
                width: "256px",
                height: "44px",
                color: themeName === "dark-theme" ? "white" : "black",
                backgroundColor: themeName === "dark-theme" ? "black" : "white",
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
                        className="localeInfo-username"
                        style={{
                          color: themeName === "dark-theme" ? "white" : "black",
                          lineHeight: "20px",
                          fontWeight: "700",
                          fontSize: "15px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "120px",
                          textAlign: "left",
                        }}
                      >
                        {localeInfo?.username}
                      </div>
                      <div
                        className="localeInfo-username"
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          fontSize: "15px",
                          lineHeight: "20px",
                          fontWeight: "400",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "120px",
                          textAlign: "left",
                        }}
                      >
                        @{localeInfo?.username}
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
                    height: width <= 700 ? "12%" : "100px",
                    width: "250px",
                  }}
                  className="logout-body"
                >
                  {width <= 700 ? (
                    <div>
                      <div
                        onClick={() => {
                          showDisplayModal();
                          popupState.close();
                        }}
                        style={{
                          paddingBottom: "12px",
                          paddingTop: "12px",
                          lineHeight: "20px",
                          fontWeight: "700",
                          fontSize: "15px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                          // height: "100%",
                        }}
                        className={`logout-p logout-popover logout-popover-${themeName}`}
                      >
                        <span
                          style={{
                            position: "relative",
                            left: "10px",
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          Display
                        </span>
                      </div>
                      <div
                        onClick={() => {
                          popupState.close();
                        }}
                      >
                        <RightSideColumn
                          widthSmaller700={width <= 700 ? true : false}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* settings icon start to check  */}
                  <div
                    onClick={() => {
                      handleShow();
                      popupState.close();
                    }}
                    className={`settings-and-privacy settings-and-privacy-${themeName}`}
                    style={{
                      paddingBottom: "12px",
                      paddingTop: "12px",
                      lineHeight: "20px",
                      fontWeight: "700",
                      fontSize: "15px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      color={themeName === "dark-theme" ? "white" : ""}
                      fill="currentColor"
                      style={{
                        position: "relative",
                        left: "10px",
                      }}
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
                    <span
                      style={{
                        position: "relative",
                        left: "10px",
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                      className="logout-p"
                    >
                      Settings and privacy
                    </span>
                  </div>
                  {/* settings icon finish to check  */}
                  <div
                    className={`logout-p logout-popover logout-popover-${themeName}`}
                    onClick={() => {
                      handleOpenLogoutModal();
                      popupState.close();
                    }}
                    style={{
                      paddingBottom: "12px",
                      paddingTop: "5px",
                      lineHeight: "20px",
                      fontWeight: "700",
                      fontSize: "15px",
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
                      }}
                      className="logout-p"
                    >
                      Log out @{localeInfo?.username}
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
              // className="mt-4"
              style={{
                padding: "0px",
                margin: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                    display: "flex",
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
                    height: width <= 700 ? "12%" : "100px",
                    width: "250px",
                  }}
                  className="logout-body"
                >
                  {width <= 700 ? (
                    <div>
                      <div
                        onClick={() => {
                          showDisplayModal();
                          popupState.close();
                        }}
                        style={{
                          paddingBottom: "12px",
                          paddingTop: "12px",
                          lineHeight: "20px",
                          fontWeight: "700",
                          fontSize: "15px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                          // height: "100%",
                        }}
                        className={`logout-p logout-popover logout-popover-${themeName}`}
                      >
                        <span
                          style={{
                            position: "relative",
                            left: "10px",
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          Display
                        </span>
                      </div>
                      <div
                        onClick={() => {
                          popupState.close();
                        }}
                      >
                        <RightSideColumn
                          widthSmaller700={width <= 700 ? true : false}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* settings icon start to check  */}
                  <div
                    onClick={() => {
                      handleShow();
                      popupState.close();
                    }}
                    className={`settings-and-privacy settings-and-privacy-${themeName}`}
                    style={{
                      paddingBottom: "12px",
                      paddingTop: "12px",
                      lineHeight: "20px",
                      fontWeight: "700",
                      fontSize: "15px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      color={themeName === "dark-theme" ? "white" : ""}
                      fill="currentColor"
                      style={{
                        position: "relative",
                        left: "10px",
                      }}
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
                    <span
                      style={{
                        position: "relative",
                        left: "10px",
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                      className="logout-p"
                    >
                      Settings and privacy
                    </span>
                  </div>
                  {/* settings icon finish to check  */}
                  <div
                    className={`logout-p logout-popover logout-popover-${themeName}`}
                    onClick={() => {
                      handleOpenLogoutModal();
                      popupState.close();
                    }}
                    style={{
                      paddingBottom: "12px",
                      paddingTop: "5px",
                      lineHeight: "20px",
                      fontWeight: "700",
                      fontSize: "15px",
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
                      }}
                      className="logout-p"
                    >
                      Log out @{localeInfo?.username}
                    </span>
                  </div>
                </div>
              </Popover>
            </div>
          )}
        </PopupState>
      )}
      {/* popover basic test finish to check  */}

      {/* settings and privacy modal start to check  */}
      <Modal
        backdropClassName={
          themeName === "dark-theme" ? `back-drop-${themeName}` : ""
        }
        show={show}
        onHide={handleClose}
        centered="true"
        dialogClassName={width <= 700 ? "modal-fullscreen" : ""}
        contentClassName={
          width <= 700
            ? `settings-and-privacy-second-smaller-than-700-width settings-and-privacy-second-smaller-than-700-width-${themeName}`
            : `settings-and-privacy-second settings-and-privacy-second-${themeName}`
        }
        style={{
          margin: "0px",
          padding: "0px",
        }}
      >
        <Modal.Header
          className="signin-modal-header-child-non-reactivate"
          style={{
            border: "none",
          }}
        >
          {current > 0 ? (
            <div
              className={`previous-button previous-button-${themeName}`}
              style={{ borderRadius: "50%", cursor: "pointer" }}
            >
              <div>
                <svg
                  style={{
                    border: "none",
                    fontSize: "15px",
                    margin: "5px",
                  }}
                  color={themeName === "dark-theme" ? "white" : ""}
                  fill="currentColor"
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
              className={`previous-button previous-button-${themeName}`}
              style={{ borderRadius: "50%", cursor: "pointer" }}
            >
              <div>
                <svg
                  color={themeName === "dark-theme" ? "white" : ""}
                  fill="currentColor"
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
              className={`previous-button previous-button-${themeName}`}
              style={{ borderRadius: "50%", cursor: "pointer" }}
            >
              <div>
                <svg
                  color={themeName === "dark-theme" ? "white" : ""}
                  fill="currentColor"
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
              className={`previous-button previous-button-${themeName}`}
              style={{ borderRadius: "50%", cursor: "pointer" }}
            >
              <div>
                <svg
                  color={themeName === "dark-theme" ? "white" : ""}
                  fill="currentColor"
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
                className={`close-button close-button-${themeName}`}
                style={{ borderRadius: "50%", cursor: "pointer" }}
              >
                <div>
                  <svg
                    color={
                      themeName === "dark-theme" ? "white" : "rgb(15,20,25)"
                    }
                    fill="currentColor"
                    style={{
                      border: "none",
                      fontSize: "15px",
                      margin: "5px",
                    }}
                    onClick={handleClose}
                    width={20}
                    height={20}
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
        <Modal.Body
          style={{
            padding: "0px",
          }}
        >
          {/* main navigation bar start to check  */}
          <Divider
            className={`divider-your-account-settings-and-privacy-${themeName}`}
            orientation="left"
            style={{
              fontWeight: "700",
              fontSize: "20px",
              lineHeight: "24px",
              color: themeName === "dark-theme" ? "white" : "black",
            }}
          >
            <div>
              {selectedSection !== "Account information" &&
              selectedSection !== "Change your password" &&
              selectedSection !== "Deactivate your account"
                ? "Your Account"
                : selectedSection}
            </div>
          </Divider>
          <div
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              margin: "0px 12px",
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
                <div key={index}>
                  <List.Item
                    onClick={() => setInitialOptionClicked(true)}
                    onMouseEnter={() => {
                      if (!initialOptionClicked) {
                        setIsHoveredIndex(index);
                      }
                    }}
                    onMouseLeave={() => setIsHoveredIndex(null)}
                    className="mt-3"
                    style={{
                      backgroundColor:
                        isHoveredIndex === index && themeName !== "dark-theme"
                          ? "#f7f9f9"
                          : isHoveredIndex === index &&
                            themeName === "dark-theme"
                          ? "#16181c"
                          : "",
                      padding: "12px",
                      width: "100%",
                      margin: "0px",
                    }}
                  >
                    {item && index === 0 ? (
                      <>
                        <div
                          onClick={showAccountInformationSection}
                          style={{
                            height: "100px",
                            padding: "12px",
                            cursor: "pointer",
                          }}
                          className={`${showListItem}`}
                        >
                          <Stack direction="horizontal" gap={3}>
                            <div className="p-2">
                              <svg
                                width={`${1.25}em`}
                                height={`${1.25}em`}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                fill={
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)"
                                }
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
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
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
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
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
                              className={`${showListItem} `}
                            >
                              <Stack direction="horizontal" gap={3}>
                                <div className="p-2">
                                  <svg
                                    fill={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)"
                                    }
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
                                        color:
                                          themeName === "dark-theme"
                                            ? "white"
                                            : "black",
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
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
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
                                  className={`${showListItem} `}
                                >
                                  <Stack direction="horizontal" gap={3}>
                                    <div className="p-2">
                                      <svg
                                        fill={
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)"
                                        }
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
                                            color:
                                              themeName === "dark-theme"
                                                ? "white"
                                                : "black",
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
                                              themeName === "dark-theme"
                                                ? "#71767A"
                                                : "rgb(83, 100, 113)",
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
                                Something went wrong, and the modal data cannot
                                be loaded.
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </List.Item>
                </div>
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
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
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
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Username
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
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
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
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
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Email
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
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
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
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
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Verified
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                          }}
                        >
                          {userInfo.verified
                            ? "Yes"
                            : `${(
                                <span
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",

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
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Account creation
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
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
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <FormControl
                    className="mt-4"
                    sx={{
                      width: "90%",
                    }}
                    variant="outlined"
                  >
                    <InputLabel
                      sx={{
                        color: errorInputStyle3
                          ? "rgb(244, 33, 46)"
                          : "#606368",
                        "&.MuiInputLabel-shrink": {
                          color: errorInputStyle3
                            ? "rgb(244, 33, 46)!important"
                            : "#1f9cf0 !important",
                        },
                      }}
                      htmlFor="outlined-adornment-password"
                    >
                      Current password
                    </InputLabel>
                    <OutlinedInput
                      inputProps={{
                        sx: {
                          color: themeName === "dark-theme" ? "white" : "black",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errorInputStyle3
                            ? "rgb(244, 33, 46)!important"
                            : "#cfd9de !important",
                          border:
                            themeName === "dark-theme" && !errorInputStyle3
                              ? "1px solid rgb(70, 70, 70) !important"
                              : themeName === "dark-theme" && errorInputStyle3
                              ? "1px solid rgb(244, 33, 46) !important"
                              : "",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: errorInputStyle3
                            ? "2px solid rgb(244, 33, 46)!important"
                            : "2px solid #1d9bf0 !important",
                        },
                      }}
                      // onBlur={() => setfirstInputActive(false)}
                      onChange={(e) => setOldPassword(e.target.value)}
                      value={oldPassword}
                      id="outlined-adornment-password"
                      type={"password"}
                      label="Current password"
                    />
                  </FormControl>
                  {errorInputStyle3 ? (
                    <>
                      <div
                        className="mt-1"
                        style={{
                          display: "inline-block",
                          color: "rgba(244,39,49,255)",
                          textAlign: "left",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                          width: "92%",
                          position: "relative",
                          left: "5px",
                        }}
                      >
                        <span
                          style={{
                            position: "relative",
                            left: "10px",
                          }}
                        >
                          {errorInput3}
                        </span>
                      </div>
                    </>
                  ) : null}
                  <>
                    <div
                      className="mt-1 "
                      style={{
                        display: !errorInputStyle3 ? "inline-block" : "none",
                        color: "rgb(29, 155, 240)",
                        textAlign: "left",
                        fontSize: "13px",
                        lineHeight: "16px",
                        fontWeight: "400",
                        width: "92%",
                        position: "relative",
                        left: "5px",
                      }}
                    >
                      <span
                        className="forgot-password-logout-settings-and-privacy-modal"
                        onClick={() => startForgotPasswordProcess()}
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          left: "10px",
                        }}
                      >
                        Forgot password?
                      </span>
                    </div>
                  </>
                  <>
                    <div
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
                  </>
                  <FormControl
                    className="mt-3"
                    sx={{
                      width: "90%",
                    }}
                    variant="outlined"
                  >
                    <InputLabel
                      sx={{
                        color:
                          errorInputStyle4 || errorInputStyle2
                            ? "rgb(244, 33, 46)"
                            : "#606368",
                        "&.MuiInputLabel-shrink": {
                          color:
                            errorInputStyle4 || errorInputStyle2
                              ? "rgb(244, 33, 46)!important"
                              : "#1f9cf0 !important",
                        },
                      }}
                      htmlFor="outlined-adornment-password"
                    >
                      New password
                    </InputLabel>
                    <OutlinedInput
                      inputProps={{
                        sx: {
                          color: themeName === "dark-theme" ? "white" : "black",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            errorInputStyle4 || errorInputStyle2
                              ? "rgb(244, 33, 46)!important"
                              : "#cfd9de !important",
                          border:
                            themeName === "dark-theme" &&
                            !errorInputStyle4 &&
                            !errorInputStyle2
                              ? "1px solid rgb(70, 70, 70) !important"
                              : themeName === "dark-theme" &&
                                errorInputStyle4 &&
                                errorInputStyle2
                              ? "1px solid rgb(244, 33, 46) !important"
                              : "",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border:
                            errorInputStyle4 || errorInputStyle2
                              ? "2px solid rgb(244, 33, 46)!important"
                              : "2px solid #1d9bf0 !important",
                        },
                      }}
                      // onBlur={() => setfirstInputActive(false)}
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      id="outlined-adornment-password"
                      type={"password"}
                      label="New password"
                    />
                  </FormControl>
                  {errorInputStyle4 ? (
                    <>
                      <div
                        className="mt-1"
                        style={{
                          display: "inline-block",
                          color: "rgba(244,39,49,255)",
                          textAlign: "left",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                          width: "92%",
                          position: "relative",
                          left: "5px",
                        }}
                      >
                        <span
                          style={{
                            position: "relative",
                            left: "10px",
                          }}
                        >
                          {errorInput4}
                        </span>
                      </div>
                    </>
                  ) : null}
                  {errorInputStyle2 ? (
                    <>
                      <div
                        className="mt-1"
                        style={{
                          display: "inline-block",
                          color: "rgba(244,39,49,255)",
                          textAlign: "left",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                          width: "92%",
                          position: "relative",
                          left: "5px",
                        }}
                      >
                        <span
                          style={{
                            position: "relative",
                            left: "10px",
                          }}
                        >
                          {errorInput2}
                        </span>
                      </div>
                    </>
                  ) : null}
                  <FormControl
                    className="mt-4"
                    sx={{
                      width: "90%",
                    }}
                    variant="outlined"
                  >
                    <InputLabel
                      sx={{
                        color: errorInputStyle ? "rgb(244, 33, 46)" : "#606368",
                        "&.MuiInputLabel-shrink": {
                          color: errorInputStyle
                            ? "rgb(244, 33, 46)!important"
                            : "#1f9cf0 !important",
                        },
                      }}
                      htmlFor="outlined-adornment-password"
                    >
                      Confirm password
                    </InputLabel>
                    <OutlinedInput
                      inputProps={{
                        sx: {
                          color: themeName === "dark-theme" ? "white" : "black",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errorInputStyle
                            ? "rgb(244, 33, 46)!important"
                            : "#cfd9de !important",
                          border:
                            themeName === "dark-theme" && !errorInputStyle
                              ? "1px solid rgb(70, 70, 70) !important"
                              : themeName === "dark-theme" && errorInputStyle
                              ? "1px solid rgb(244, 33, 46) !important"
                              : "",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: errorInputStyle
                            ? "2px solid rgb(244, 33, 46)!important"
                            : "2px solid #1d9bf0 !important",
                        },
                      }}
                      // onBlur={() => setfirstInputActive(false)}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      id="outlined-adornment-password"
                      type={"password"}
                      label="                      Confirm password                      "
                    />
                  </FormControl>
                  {errorInputStyle ? (
                    <>
                      <div
                        className="mt-1"
                        style={{
                          display: "inline-block",
                          color: "rgba(244,39,49,255)",
                          textAlign: "left",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                          width: "92%",
                          position: "relative",
                          left: "5px",
                        }}
                      >
                        <span
                          style={{
                            position: "relative",
                            left: "10px",
                          }}
                        >
                          {errorInput}
                        </span>
                      </div>
                    </>
                  ) : null}{" "}
                  <>
                    <div
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
                  </>
                  <div
                    className="mt-1"
                    style={{
                      textAlign: "right",
                      borderTop:
                        themeName !== "dark-theme"
                          ? "1px solid rgba(0, 0, 0, 0.1)"
                          : // : "0.1px solid rgb(70, 70, 70)",
                            "1px solid rgb(70, 70, 70)",

                      width: "100%",
                    }}
                  >
                    <Button
                      style={{
                        height: "45px",
                        marginTop: "15px",
                        position: "relative",
                        right: "20px",
                        border: "none",
                        maxWidth: "69.17px",
                        maxHeight: "36px",
                        minHeight: "36px",
                        fontSize: "15px",
                        cursor:
                          oldPassword && newPassword && confirmNewPassword
                            ? "pointer"
                            : "default",
                        opacity:
                          oldPassword && newPassword && confirmNewPassword
                            ? ""
                            : "0.5",
                      }}
                      onClick={
                        oldPassword && newPassword && confirmNewPassword
                          ? () => handleChangePassword()
                          : null
                      }
                      className={
                        oldPassword && newPassword && confirmNewPassword
                          ? "change-password-btn"
                          : "disabled-change-password-btn"
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {/* change password inputs finish to check  */}

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
                  padding: "12px",
                  display: "flex",
                  flexDirection: "row",
                }}
                className={`steps-parent-tag-${themeName}`}
                current={current}
                items={items}
              />
              <div>{steps[current].content}</div>

              <div>
                {current < steps.length - 1 && current !== 1 && (
                  <Button
                    style={{
                      backgroundColor:
                        themeName === "dark-theme" ? "#16181c" : "#0f141a",

                      color: "white",
                      fontSize: "15px",
                      fontWeight: "500",
                      lineHeight: "20px",
                      float: "right",
                      border: " none",
                      position: "relative",
                      right: "15px",
                    }}
                    className="deactivate-next-btn deactivate-tab-next-btn"
                    variant="info"
                    onClick={() => next()}
                  >
                    Next
                  </Button>
                )}

                {current < steps.length - 1 && current === 1 && (
                  <Button
                    style={{
                      backgroundColor:
                        themeName === "dark-theme" ? "#16181c" : "#0f141a",
                      marginTop: "100px",

                      color: "white",
                      fontSize: "15px",
                      fontWeight: "500",
                      lineHeight: "20px",
                      float: "right",
                      border: " none",
                      position: "relative",
                      right: "15px",
                    }}
                    className="deactivate-next-btn deactivate-tab-next-btn"
                    variant="info"
                    onClick={() =>
                      confirmed
                        ? next()
                        : showCustomMessage(
                            "The password you entered was incorrect.",
                            4
                          )
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
                      position: "relative",
                      right: "15px",
                    }}
                    variant="danger"
                    onClick={() => {
                      handleDeactivateUser();
                    }}
                    className="deactivate-tab-deactivate-btn"
                  >
                    Deactivate
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>

      {/* settings and privacy modal finish to check  */}

      {/* forgot password option from change password screen start to check  */}
      <Modal
        style={{
          margin: "0px",
          padding: "0px",
        }}
        backdropClassName={
          themeName === "dark-theme" ? `back-drop-${themeName}` : ""
        }
        show={startForgotPasswordProcessModal}
        onHide={handleCloseForgotPasswordProcessModal}
        centered="true"
        dialogClassName={width <= 700 ? "modal-fullscreen" : ""}
        contentClassName={
          width <= 700
            ? `forgot-password-process-modal-from-change-password-section forgot-password-process-modal-from-change-password-section-${themeName}`
            : `forgot-password-process forgot-password-process-${themeName}`
        }
      >
        <Modal.Body
          style={{
            padding: "0px",
          }}
        >
          {/* account information list start to check  */}
          {tabIndex === 0 ? (
            <>
              <div
                className="mt-5"
                style={{
                  width: "100%",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: themeName === "dark-theme" ? "white" : "black",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "15px",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  How do you want to reset your password?
                </span>
              </div>
              <div
                className="mt-4"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "left",

                  width: "100%",
                  padding: "16px",
                }}
              >
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
                <div
                  style={{
                    marginLeft: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      color: themeName === "dark-theme" ? "white" : "black",
                      fontWeight: "700",
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                  >
                    {userInfo.fullname}
                  </div>
                  <div
                    style={{
                      textDecoration: "none",
                      color: "rgb(83, 100, 113)",
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                  >
                    @{userInfo.username}
                  </div>
                </div>
              </div>
              <div
                style={{
                  color: themeName === "dark-theme" ? "white" : "black",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                  width: "100%",
                  position: "relative",
                  left: "15px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                You can use the information associated with your account.
              </div>
              <div
                className="mt-3"
                style={{
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    left: "5px",
                    alignItems: "center",
                  }}
                >
                  <Radio checked={true} name="radio-buttons" />
                  <div
                    style={{
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    Send an email to
                  </div>
                  <div
                    style={{
                      visibility: "hidden",
                    }}
                  >
                    a
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "700",
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    {getMaskedEmail(userInfo.email)}
                  </div>
                </div>
              </div>
              <div
                className="mt-2"
                style={{
                  width: "100%",
                }}
              >
                <Button
                  style={{
                    height: "45px",
                    border: "none",
                    maxWidth: "69.17px",
                    maxHeight: "36px",
                    minHeight: "36px",
                    fontSize: "15px",
                    position: "relative",
                    left: "15px",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                  className={"change-password-btn"}
                  onClick={() => {
                    handleSendForgotPasswordCodeToEmail();
                  }}
                >
                  Next
                </Button>
              </div>
              <div
                className="mt-4"
                style={{
                  cursor: "pointer",
                  color: "#55acee",
                  width: "100%",
                  fontSize: "13px",
                  fontWeight: "400",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "15px",
                  }}
                >
                  <BootstrapTooltip title="This feature is not yet active. ">
                    Don’t have access to these?
                  </BootstrapTooltip>
                </span>
              </div>
            </>
          ) : null}
          {/* account information list finish to check  */}

          {/* change password inputs start to check  */}
          {showEnterVerificationCodeScreen ? (
            <>
              {" "}
              <div
                className="mt-5"
                style={{
                  width: "100%",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: themeName === "dark-theme" ? "white" : "black",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "15px",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  Check your email
                </span>
              </div>
              <div
                className="mt-4"
                style={{
                  color: themeName === "dark-theme" ? "white" : "black",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                  width: "100%",
                  position: "relative",
                  left: "15px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                {
                  "You'll receive a code to verify here so you can reset your account password."
                }
              </div>
              <div
                className="mt-4"
                style={{
                  width: "100%",
                }}
              >
                <TextField
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
                      border:
                        themeName === "dark-theme"
                          ? "1px solid rgb(70,70,70) !important"
                          : "1px solid #cfd9de !important",
                    },
                    "& .MuiInputLabel-shrink": {
                      color: "#1f9cf0 !important",
                    },
                  }}
                />{" "}
              </div>
              <div
                className="mt-4"
                style={{
                  width: "100%",
                }}
              >
                <Button
                  style={{
                    height: "45px",
                    border: "none",
                    maxWidth: "69.17px",
                    maxHeight: "36px",
                    minHeight: "36px",
                    fontSize: "15px",
                    position: "relative",
                    left: "15px",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                  onClick={() => {
                    verificationCodeInput ===
                    receivedVerificationCodeForPasswordChange
                      ? handleTabChangeAfterSuccessVerificationCode()
                      : showCustomMessage("Invalid verification code.", 4);
                  }}
                  className={"change-password-btn"}
                >
                  Verify
                </Button>
              </div>
              <div
                className="mt-3"
                style={{
                  color: themeName === "dark-theme" ? "white" : "black",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                  width: "90%",

                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    right: "15px",
                  }}
                >
                  {
                    "If you don't see the email, check other places it might be, like your junk, spam, social, or other folders."
                  }
                </span>
              </div>
              <div
                onClick={() => {
                  handleSendForgotPasswordCodeToEmail();
                }}
                className="mt-5"
                style={{
                  cursor: "pointer",
                  color: "#55acee",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                  width: "90%",

                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    right: "15px",
                  }}
                >
                  {"Didn’t receive your code?"}
                </span>
              </div>
            </>
          ) : null}
          {/* change password inputs finish to check  */}

          {verificationCodeSuccessChangePasswordScreen &&
          !whyDidYouChangeyourpasswordScreen ? (
            <>
              {" "}
              <div className={showDetailChangePasswordInfo ? "" : "hide"}>
                <div
                  className="mt-5"
                  style={{
                    width: "100%",
                    fontSize: "28px",
                    fontWeight: "700",
                    color: themeName === "dark-theme" ? "white" : "black",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                  >
                    Reset your password
                  </span>
                </div>{" "}
                <div
                  className="mt-4"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "left",
                    width: "100%",
                  }}
                >
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
                  <div
                    style={{
                      marginLeft: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        fontWeight: "700",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontFamily:
                          "Helvetica Neue, Helvetica, Arial, sans-serif",
                      }}
                    >
                      {userInfo.fullname}
                    </div>
                    <div
                      style={{
                        textDecoration: "none",
                        color: "rgb(83, 100, 113)",
                        lineHeight: "20px",
                        fontSize: "15px",
                        fontWeight: "400",
                        fontFamily:
                          "Helvetica Neue, Helvetica, Arial, sans-serif",
                      }}
                    >
                      @{userInfo.username}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    style={{
                      color: themeName === "dark-theme" ? "white" : "black",
                      fontWeight: "400",
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                  >
                    Strong passwords include numbers, letters, and punctuation
                    marks.
                  </span>{" "}
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#55acee",
                      width: "100%",
                      fontSize: "13px",
                      fontWeight: "400",
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                  >
                    Learn more
                  </span>
                </div>
                <div>
                  <FormControl
                    className="mt-3"
                    sx={{
                      width: "100%",
                    }}
                    variant="outlined"
                  >
                    <InputLabel
                      sx={{
                        color: errorResetPassword
                          ? "rgb(244, 33, 46)"
                          : "#606368",
                        "&.MuiInputLabel-shrink": {
                          color: errorResetPassword
                            ? "rgb(244, 33, 46)!important"
                            : "#1f9cf0 !important",
                        },
                      }}
                      htmlFor="outlined-adornment-password"
                    >
                      Enter your new password
                    </InputLabel>
                    <OutlinedInput
                      inputProps={{
                        sx: {
                          color: themeName === "dark-theme" ? "white" : "black",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errorResetPassword
                            ? "rgb(244, 33, 46)!important"
                            : "#cfd9de !important",
                          border:
                            themeName === "dark-theme" && !errorResetPassword
                              ? "1px solid rgb(70, 70, 70) !important"
                              : themeName === "dark-theme" && errorResetPassword
                              ? "1px solid rgb(244, 33, 46) !important"
                              : "",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: errorResetPassword
                            ? "2px solid rgb(244, 33, 46)!important"
                            : "2px solid #1d9bf0 !important",
                        },
                      }}
                      // onBlur={() => setfirstInputActive(false)}
                      onChange={(e) =>
                        setnewPasswordResetPassword(e.target.value)
                      }
                      value={newPasswordResetPassword}
                      id="outlined-adornment-password"
                      type={"password"}
                      label="Enter your new password
                      "
                    />
                  </FormControl>
                </div>
                {errorResetPassword ? (
                  <>
                    <span
                      className="mt-1"
                      style={{
                        display: "flex",
                        color: "rgba(244,39,49,255)",
                        textAlign: "left",
                        fontSize: "13px",
                        lineHeight: "16px",
                        fontWeight: "400",
                        width: "92%",
                        position: "relative",
                        left: "5px",
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          left: "10px",
                        }}
                      >
                        {errorResetPassword}
                      </span>
                    </span>
                  </>
                ) : null}
                <FormControl
                  className="mt-4"
                  sx={{
                    width: "100%",
                  }}
                  variant="outlined"
                >
                  <InputLabel
                    sx={{
                      color: errorResetPassword2
                        ? "rgb(244, 33, 46)"
                        : "#606368",
                      "&.MuiInputLabel-shrink": {
                        color: errorResetPassword2
                          ? "rgb(244, 33, 46)!important"
                          : "#1f9cf0 !important",
                      },
                    }}
                    htmlFor="outlined-adornment-password"
                  >
                    Enter your password one more time
                  </InputLabel>
                  <OutlinedInput
                    inputProps={{
                      sx: {
                        color: themeName === "dark-theme" ? "white" : "black",
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: errorResetPassword2
                          ? "rgb(244, 33, 46)!important"
                          : "#cfd9de !important",
                        border:
                          themeName === "dark-theme" && !errorResetPassword2
                            ? "1px solid rgb(70, 70, 70) !important"
                            : themeName === "dark-theme" && errorResetPassword2
                            ? "1px solid rgb(244, 33, 46) !important"
                            : "",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: errorResetPassword2
                          ? "2px solid rgb(244, 33, 46)!important"
                          : "2px solid #1d9bf0 !important",
                      },
                    }}
                    // onBlur={() => setfirstInputActive(false)}
                    onChange={(e) =>
                      setnewPasswordResetPasswordRepeat(e.target.value)
                    }
                    value={newPasswordResetPasswordRepeat}
                    id="outlined-adornment-password"
                    type={"password"}
                    label="Enter your password one more time
                      "
                  />
                </FormControl>
                {errorResetPassword2 ? (
                  <>
                    <div
                      className="mt-1"
                      style={{
                        display: "inline-block",
                        color: "rgba(244,39,49,255)",
                        textAlign: "left",
                        fontSize: "13px",
                        lineHeight: "16px",
                        fontWeight: "400",
                        width: "92%",
                        position: "relative",
                        left: "5px",
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          left: "10px",
                        }}
                      >
                        {errorResetPassword2}
                      </span>
                    </div>
                  </>
                ) : null}{" "}
                <FormControlLabel
                  sx={{
                    color: themeName === "dark-theme" ? "white" : "black",
                    "& .MuiSvgIcon-root": {
                      color: themeName === "dark-theme" ? "white" : "",
                    },
                  }}
                  control={<Checkbox />}
                  label="Remember me"
                />
                <div>
                  <span
                    style={{
                      color: themeName === "dark-theme" ? "white" : "black",
                      fontWeight: "400",
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                  >
                    Resetting your password will log you out of all your active
                    Connectify sessions.
                  </span>{" "}
                </div>
                <div
                  className="mt-1"
                  style={{
                    textAlign: "left",
                  }}
                >
                  <Button
                    className="reset-password-btn"
                    onClick={resetPassword}
                    style={{
                      height: "45px",
                      marginTop: "15px",
                      border: "none",
                      minWidth: "142px",
                      maxWidth: "145px",
                      maxHeight: "36px",
                      minHeight: "36px",
                      fontSize: "15px",
                      cursor: "pointer",
                      borderRadius: "9999px",
                    }}
                  >
                    Reset password
                  </Button>
                </div>
              </div>
            </>
          ) : whyDidYouChangeyourpasswordScreen &&
            !showAfterChangePasswordScreen ? (
            <>
              <div
                className="mt-5"
                style={{
                  width: "100%",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: themeName === "dark-theme" ? "white" : "black",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "15px",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  Why did you change your password?
                </span>
              </div>
              <div
                className="mt-4"
                style={{
                  width: "100%",
                }}
              >
                <FormControl
                  style={{
                    position: "relative",
                    left: "15px",
                  }}
                >
                  <RadioGroup
                    sx={{
                      color: themeName === "dark-theme" ? "white" : "black",
                      "& .MuiSvgIcon-root": {
                        color: themeName === "dark-theme" ? "white" : "",
                      },
                    }}
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="Forgot password"
                      control={<Radio />}
                      label="Forgot password"
                    />
                    <FormControlLabel
                      value="Account may have been accessed by someone else"
                      control={<Radio />}
                      label="Account may have been accessed by someone else"
                    />{" "}
                    <FormControlLabel
                      value="Another reason"
                      control={<Radio />}
                      label="Another reason"
                    />
                    <div
                      className="mt-3"
                      style={{
                        width: "100%",
                      }}
                    >
                      <Button
                        style={{
                          height: "45px",
                          border: "none",
                          maxWidth: "69.17px",
                          maxHeight: "36px",
                          minHeight: "36px",
                          fontSize: "15px",
                          fontFamily:
                            "Helvetica Neue, Helvetica, Arial, sans-serif",
                        }}
                        className={"change-password-btn"}
                        onClick={() => {
                          setshowAfterChangePasswordScreen(true);
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </RadioGroup>
                </FormControl>
              </div>
              <div></div>
              <div></div>{" "}
            </>
          ) : showAfterChangePasswordScreen ? (
            <>
              <div
                className="mt-5"
                style={{
                  width: "100%",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: themeName === "dark-theme" ? "white" : "black",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "15px",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  {"You’re all set. You've successfully changed your password."}{" "}
                </span>
              </div>
              <div
                className="mt-5"
                style={{
                  cursor: "pointer",
                  color: "#55acee",
                  width: "100%",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "15px",
                  }}
                >
                  Review your applications
                </span>
              </div>
              <div
                className="mt-1"
                style={{
                  color: themeName === "dark-theme" ? "white" : "black",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                  width: "100%",
                  position: "relative",
                  left: "15px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                {
                  "Take a moment to review the applications that have access to your account. Revoke those you don't recognize or no longer use."
                }
              </div>
              <div
                className="mt-1"
                style={{
                  cursor: "pointer",
                  color: "#55acee",
                  width: "100%",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "15px",
                  }}
                >
                  Add a phone number to your account
                </span>
              </div>
              <div
                className="mt-1"
                style={{
                  color: themeName === "dark-theme" ? "white" : "black",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                  width: "100%",
                  position: "relative",
                  left: "15px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                {
                  "This makes it easy to get back into your account if you're ever locked out."
                }
              </div>
              <div
                onClick={handleCloseForgotPasswordProcessModal}
                className="mt-5"
                style={{
                  cursor: "pointer",
                  color: "#55acee",
                  width: "100%",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "15px",
                  }}
                >
                  Continue to Connectify
                </span>
              </div>
            </>
          ) : null}
        </Modal.Body>
      </Modal>
      {/* forgot password option from change password screen finish to check  */}
    </>
  );
}

export default LogoutModal;
