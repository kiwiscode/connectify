import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Stack,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import Picker from "emoji-picker-react";
import axios from "axios";
import "../../index.css";

import { message, Steps } from "antd";
import { Divider, List } from "antd";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
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
            You’re about to start the process of deactivating your Connectify
            account. Your display name, @username, and public profile will no
            longer be viewable on Connectify.com, Connectify for iOS, or
            Connectify for Android.
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
            To use your current @username or email address with a different
            Connectify account, change them before you deactivate this account.
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

  const handleShow = () => {
    setShow(true);
  };

  // start to check

  const popoverTop = (
    <Popover
      id="popover-positioned-top"
      title="Popover top"
      className={`${showlogoutPopup ? "" : "hideLogoutPopup"}`}
    >
      <div
        style={{
          textAlign: "left",
          height: "auto",
          width: 250,
          display: "flex",
          flexDirection: "column",
          padding: "5px 12px 5px 12px",
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
    setTabIndex(0);
    setShowDetailAccountInfo(false);
    setshowListItem(true);
  };

  const showSecondTab = () => {
    setTabIndexSecond((prevState) => (prevState === 0 ? 0 : 1));
    setShowDetailChangePasswordInfo(false);
    setshowListItem(true);
  };

  const showThirdTab = () => {
    setTabIndexThird((prevState) => (prevState === 0 ? 0 : 2));
    setShowDetailDeactivateAccountInfo(false);
    setshowListItem(true);
  };

  const handleClose = () => {
    setShow(false);
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

          successMessage();
        })
        .catch((error) => {
          if (error.response.status === 402) {
            seterrorInput4(
              "Your password needs to be at least 8 characters. Please enter a longer one.      "
            );
            seterrorInputStyle4(true);

            seterrorInput("");
            seterrorInputStyle(false);

            seterrorInputStyle2(false);
            seterrorInput2("");
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
        parentNodeClassName === "p-2 responsive-logout"
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
  }, []);

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

        <Stack
          className="stack-logout-navigation-parent"
          style={{
            width: "80%",
            borderRadius: "9999px",
            cursor: "pointer",
          }}
          direction="horizontal"
        >
          <div className="p-2 profile-img-and-svg">
            {/* start to check */}
            {userInfo.imageUrl.slice(0, 3) !== "../" ? (
              <div>
                <img
                  className="profile-img logout-profile-img"
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
          </div>
          {/* finish to check */}

          <div className="p-2 responsive-logout">
            <div>
              <div
                className="localeInfo-username"
                style={{
                  color: "rgb(15,20,25)",
                  lineHeight: "20px",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                {localeInfo.username}
              </div>
              <span
                className="localeInfo-username"
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
          </div>
          <div className="p-2 ms-auto responsive-logout">
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
        </Stack>
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
                  {errorInputStyle4 ? (
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
                        {errorInput4}
                      </div>
                    </>
                  ) : null}
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
                      marginTop: "100px",
                      backgroundColor: "#0f141a",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "500",
                      lineHeight: "20px",
                      float: "right",
                      border: " none",
                    }}
                    className="deactivate-next-btn deactivate-tab-next-btn"
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
    </>
  );
}

export default LogoutModal;
