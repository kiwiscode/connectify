import { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import LogoutModal from "./LogoutModal";
import axios from "axios";

import {
  Button,
  Modal,
  Stack,
  Popover,
  OverlayTrigger,
  Col,
} from "react-bootstrap";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import { Badge } from "@mui/material";
import useWindowDimensions from "../../hooks/getWindowDimensions";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function LeftSideNavBar({
  refreshPosts,
  setLoadingTrue,
  setLoadingFalse,
  visible,
  parentCallBack,
}) {
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);

  const [isHomeRouteActive, setIsHomeRouteActive] = useState(false);
  const [isNotificationsRouteActive, setIsNotificationsRouteActive] =
    useState(false);

  const [isMessagesRouteActive, setIsMessagesRouteActive] = useState(false);
  const [isProfileRouteActive, setIsProfileRouteActive] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getClickLocation = (e) => {
      const classList = e.target.classList;
      const parentNodeClassName = e.srcElement.parentNode.className;
      const svgGroupClassName = e.srcElement.parentNode.className.baseVal;

      if (
        (parentNodeClassName !== "nav-bar-test vstack gap-2" &&
          parentNodeClassName === "home-nav-link active") ||
        classList.contains("home-svg") ||
        classList.contains("nav-home-text") ||
        classList.contains("home-nav-link-parent-div") ||
        parentNodeClassName === "p-2 home-nav-link-parent-div" ||
        svgGroupClassName === "home-svg-group"
      ) {
        setIsHomeRouteActive(true);
        setIsNotificationsRouteActive(false);
        setIsMessagesRouteActive(false);
        setIsProfileRouteActive(false);
      } else if (
        (parentNodeClassName !== "nav-bar-test vstack gap-2" &&
          parentNodeClassName === "notifications-nav-link active") ||
        classList.contains("notifications-svg") ||
        classList.contains("nav-notifications-text") ||
        classList.contains("notifications-nav-link-parent-div") ||
        parentNodeClassName === "p-2 notifications-nav-link-parent-div" ||
        svgGroupClassName === "notifications-svg-group"
      ) {
        setIsNotificationsRouteActive(true);
        setIsHomeRouteActive(false);
        setIsMessagesRouteActive(false);
        setIsProfileRouteActive(false);
      } else if (
        (parentNodeClassName !== "nav-bar-test vstack gap-2" &&
          parentNodeClassName === "messages-nav-link active") ||
        classList.contains("messages-svg") ||
        classList.contains("nav-messages-text") ||
        classList.contains("messages-nav-link-parent-div") ||
        parentNodeClassName === "p-2 messages-nav-link-parent-div" ||
        svgGroupClassName === "messages-svg-group"
      ) {
        setIsMessagesRouteActive(true);
        setIsNotificationsRouteActive(false);
        setIsHomeRouteActive(false);
        setIsProfileRouteActive(false);
      } else if (
        (parentNodeClassName !== "nav-bar-test vstack gap-2" &&
          parentNodeClassName === "profile-nav-link active") ||
        classList.contains("profile-svg") ||
        classList.contains("nav-profile-text") ||
        classList.contains("profile-nav-link-parent-div") ||
        parentNodeClassName === "p-2 profile-nav-link-parent-div" ||
        svgGroupClassName === "profile-svg-group"
      ) {
        setIsProfileRouteActive(true);
        setIsNotificationsRouteActive(false);
        setIsHomeRouteActive(false);
        setIsMessagesRouteActive(false);
      }
    };

    document.addEventListener("click", getClickLocation);

    return () => {
      document.removeEventListener("click", getClickLocation);
    };
  }, []);

  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { getToken, userInfo } = useContext(UserContext);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");
  const [showSecondModal, setShowSecondModal] = useState(false);
  const maxCharacters = 140;

  const [modalImage, setModalImage] = useState("");
  //handle and convert it in base 64
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

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

  const handlePost = () => {
    if (content || chosenEmoji || modalImage) {
      handleClose();
      axios
        .post(
          `${API_URL}/home/post`,
          {
            content,
            modalImage,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )

        .then((response) => {
          if (setLoadingTrue) {
            setLoadingTrue();
          }

          setModalImage("");
          setTimeout(() => {
            parentCallBack(response.data.createdPost);
            if (setLoadingTrue) {
              setLoadingFalse();
            }
            if (refreshPosts) {
              refreshPosts();
            }
          }, 1500);
          setContent("");
        })
        .catch((err) => {
          return err;
        });
    } else {
      handleShow();
    }
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

  const onEmojiClick = (emojiObject) => {
    const sym = emojiObject.unified.split("_");
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);

    setChosenEmoji(emoji);
    setContent((prevText) => prevText + emoji);
  };

  useEffect(() => {
    const closeEmojiContainer = (e) => {
      if (
        e.target.classList.contains("post-modal-emoji-picker") ||
        e.srcElement.parentElement.className ===
          "svg-border-parent show-emoji" ||
        e.srcElement.parentNode.className === "p-2" ||
        e.target.classList.value === ""
      ) {
        setshowEmojisBar(false);
      } else {
        setshowEmojisBar(true);
      }
    };

    document.body.addEventListener("click", closeEmojiContainer);

    return () => {
      document.body.removeEventListener("click", closeEmojiContainer);
    };
  }, []);

  const popoverBottom = (
    <Popover
      className={`${showEmojisBar ? "hideEmojiContainer" : ""}`}
      id="popover-positioned-bottom"
      title="Popover bottom"
    >
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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const changeNotificationReadedStatus = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/notifications/mark-as-read`,
        {
          userId: userInfo._id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("Response from db =>", response);
    } catch (error) {
      console.error(
        "An error occurred while changing active user notification readed status:",
        error
      );
    }
  };

  const locateHomePage = () => {
    if (window.location.href !== "http://localhost:5173/home") {
      window.location.href = "http://localhost:5173/home";
    }
  };

  const locateNotificationsPage = () => {
    if (window.location.href !== "http://localhost:5173/notifications") {
      changeNotificationReadedStatus();
      window.location.href = "http://localhost:5173/notifications";
    }
  };

  const locateMessagesPage = () => {
    if (window.location.href !== "http://localhost:5173/messages") {
      window.location.href = "http://localhost:5173/messages";
    }
  };

  const locateProfilePage = () => {
    if (window.location.href !== "http://localhost:5173/profile") {
      window.location.href = "http://localhost:5173/profile";
    }
  };

  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const getActiveUserInfo = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/notifications/unread-notifications`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const unreadNotifications = await response.data.unReadNotifications;

      setUnReadNotifications(unreadNotifications);
      console.log("Response =>", response);
    } catch (error) {
      console.error(
        "An error occurred while fetching active user info:",
        error
      );
    }
  };

  console.log("Notifications =>", unReadNotifications);

  useEffect(() => {
    getActiveUserInfo();
  }, []);

  const { height, width } = useWindowDimensions();

  const checkHowManyUnReadMessages = () => {
    const allUnReadedMessages = userInfo?.messages?.filter((allMessages) => {
      return allMessages.readed === false;
    });

    return allUnReadedMessages;
  };

  console.log("How many unreaded messages =>", checkHowManyUnReadMessages());

  return (
    <>
      <Col
        style={{
          padding: "16px",
          width:
            width < 768 && width >= 600
              ? "10%"
              : width < 600 && width >= 500
              ? "11%"
              : "",
          position: "relative",
          height: "100vh",
        }}
        className="left-column"
        xs={1} // 0px - 576px aralığı
        sm={1} // 576px - 768px aralığı
        md={1} // 768px - 992px aralığı
        lg={width <= 1201 && width >= 992 ? 1 : 3} // 992px - 1400px aralığı
        xxl={3} // 1400px ve sonrası aralığı */}
      >
        <div
          style={{
            height: "100%",
            // position: "fixed",
            // finish after test mode theme mode start to check
            // top: "0px",
            // finish after test mode theme mode finish to check
          }}
        >
          {/* nav bar test for left column start to check  */}
          <Stack className="nav-bar-left-side" gap={2}>
            {/* First  */}
            <NavLink className="home-nav-link" to={"/home"}>
              <div className="p-2 connectify-basic-icon">
                {" "}
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
                    fill="#3b5998"
                    rx="5"
                    ry="5"
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
            </NavLink>
            {/* Second */}
            <NavLink
              // to={"/home"}
              onClick={locateHomePage}
              className={`home-nav-link home-nav-link-${themeName}`}
            >
              <span
                style={{
                  cursor: "pointer",
                }}
                className="p-2 home-nav-link-parent-div"
              >
                {" "}
                <div
                  className={`home-parent-of-span-svg home-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "white" : ""}
                    fill="currentColor"
                    style={{}}
                    width={`${1.75}rem`}
                    height={`${1.75}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="home-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="home-svg-group">
                      {window.location.href === "http://localhost:5173/home" ? (
                        <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
                      ) : (
                        <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
                      )}
                    </g>
                  </svg>
                  <span
                    className={`nav-home-text nav-home-text-${themeName}`}
                    style={{
                      marginLeft: "15px",
                      fontWeight:
                        window.location.href === "http://localhost:5173/home"
                          ? "700"
                          : "400",
                      fontSize: "20px",
                      lineHeight: "24px",
                      position: "relative",
                      top: "3px",
                    }}
                  >
                    Home
                  </span>
                </div>
              </span>
            </NavLink>
            {/* Third */}

            <NavLink
              style={{
                position: "relative",
              }}
              // to={"/notifications"}
              onClick={locateNotificationsPage}
              className={`notifications-nav-link notifications-nav-link-${themeName}`}
            >
              <span
                style={{
                  cursor: "pointer",
                }}
                className="p-2 notifications-nav-link-parent-div"
              >
                <div
                  className={`notifications-parent-of-span-svg notifications-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                    position: "relative",
                  }}
                >
                  {width < 1200 ? null : (
                    <>
                      {unReadNotifications?.length === 0 ? null : (
                        <div
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            backgroundColor: "rgb(29, 155, 240)",
                            boxSizing: "content-box",
                            top: "4px",
                            left: "24px",
                            minWidth: "18px",
                            minHeight: "18px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid white",
                          }}
                        >
                          {" "}
                          <span
                            style={{
                              fontWeight: "400",
                              fontSize: "11px",
                              lineHeight: "12px",
                              color: "white",
                            }}
                          >
                            {unReadNotifications?.length}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <svg
                    style={{}}
                    color={themeName === "dark-theme" ? "white" : ""}
                    fill="currentColor"
                    width={`${1.75}rem`}
                    height={`${1.75}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="notifications-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="notifications-svg-group">
                      {window.location.href ===
                      "http://localhost:5173/notifications" ? (
                        <path d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z"></path>
                      ) : (
                        <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path>
                      )}
                    </g>
                  </svg>

                  <span
                    className="nav-notifications-text"
                    style={{
                      marginLeft: "15px",
                      fontWeight:
                        window.location.href ===
                        "http://localhost:5173/notifications"
                          ? "700"
                          : "400",
                      fontSize: "20px",
                      lineHeight: "24px",
                      position: "relative",
                      top: "3px",
                    }}
                  >
                    Notifications{" "}
                  </span>
                </div>
              </span>
            </NavLink>
            {/* Fourth  */}
            <NavLink
              // to={"/messages"}
              onClick={locateMessagesPage}
              className={`messages-nav-link messages-nav-link-${themeName}`}
            >
              <span
                style={{
                  cursor: "pointer",
                }}
                className="p-2 messages-nav-link-parent-div"
              >
                <div
                  className={`messages-parent-of-span-svg messages-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                    position: "relative",
                  }}
                >
                  {width < 1200 ? null : (
                    <>
                      {checkHowManyUnReadMessages().length < 1 ? null : (
                        <div
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            backgroundColor: "rgb(29, 155, 240)",
                            boxSizing: "content-box",
                            top: "4px",
                            left: "24px",
                            minWidth: "18px",
                            minHeight: "18px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid white",
                          }}
                        >
                          {" "}
                          <span
                            style={{
                              fontWeight: "400",
                              fontSize: "11px",
                              lineHeight: "12px",
                              color: "white",
                            }}
                          >
                            {checkHowManyUnReadMessages().length}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <svg
                    color={themeName === "dark-theme" ? "white" : ""}
                    fill="currentColor"
                    width={`${1.75}rem`}
                    height={`${1.75}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="messages-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="messages-svg-group">
                      {window.location.href ===
                      "http://localhost:5173/messages" ? (
                        <path d="M1.998 4.499c0-.828.671-1.499 1.5-1.499h17c.828 0 1.5.671 1.5 1.499v2.858l-10 4.545-10-4.547V4.499zm0 5.053V19.5c0 .828.671 1.5 1.5 1.5h17c.828 0 1.5-.672 1.5-1.5V9.554l-10 4.545-10-4.547z"></path>
                      ) : (
                        <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                      )}
                    </g>
                  </svg>

                  <span
                    className="nav-messages-text"
                    style={{
                      marginLeft: "15px",
                      fontWeight:
                        window.location.href ===
                        "http://localhost:5173/messages"
                          ? "700"
                          : "400",
                      fontSize: "20px",
                      lineHeight: "24px",
                      position: "relative",
                      top: "3px",
                    }}
                  >
                    Messages{" "}
                  </span>
                </div>
              </span>
            </NavLink>
            {/* Fifth  */}
            <NavLink
              // to={"/profile"}
              onClick={locateProfilePage}
              className={`profile-nav-link profile-nav-link-${themeName}`}
            >
              <span
                style={{
                  cursor: "pointer",
                }}
                className="p-2 profile-nav-link-parent-div"
              >
                <div
                  className={`profile-parent-of-span-svg home-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "white" : ""}
                    fill="currentColor"
                    width={`${1.75}rem`}
                    height={`${1.75}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="profile-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="profile-svg-group">
                      {window.location.href ===
                      "http://localhost:5173/profile" ? (
                        <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path>
                      ) : (
                        <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                      )}
                    </g>
                  </svg>

                  <span
                    className="nav-profile-text"
                    style={{
                      marginLeft: "15px",
                      fontWeight:
                        window.location.href === "http://localhost:5173/profile"
                          ? "700"
                          : "400",
                      fontSize: "20px",
                      lineHeight: "24px",
                      position: "relative",
                      top: "3px",
                    }}
                  >
                    Profile{" "}
                  </span>
                </div>
              </span>
            </NavLink>
          </Stack>
          {/* nav bar test for left column finish to check  */}
          {/* Sixth  */}
          <div className="p-2 post-btn-left-side-nav-bar">
            <>
              <Button
                variant="primary"
                onClick={handleShow}
                className={`responsive-post-button ${
                  visible ? "visible" : "hidden"
                }`}
                size="sm"
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className=" compose-tweet-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp"
                  fill="currentColor"
                  style={{ color: "rgb(255, 255, 255)" }}
                >
                  <g>
                    <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
                  </g>
                </svg>
              </Button>

              <Button
                variant="primary"
                onClick={handleShow}
                // className="compose-tweet compose-tweet-2"
                className={`compose-tweet compose-tweet-2 `}
                size="sm"
                style={{
                  maxWidth: "233px",
                  minHeight: "52px",
                }}
              >
                <span
                  style={{
                    fontSize: "17px",
                  }}
                  className="compose-tweet-text compose-tweet-2"
                >
                  Post
                </span>
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className=" compose-tweet-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp"
                  fill="currentColor"
                  style={{ color: "rgb(255, 255, 255)" }}
                >
                  <g>
                    <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
                  </g>
                </svg>
              </Button>

              <Modal
                backdropClassName={
                  themeName === "dark-theme" ? `back-drop-${themeName}` : ""
                }
                style={{
                  margin: "0px",
                  padding: "0px",
                }}
                dialogClassName={width <= 700 ? "modal-fullscreen" : ""}
                className={
                  width <= 700 && themeName !== "dark-theme"
                    ? ""
                    : width <= 700 && themeName === "dark-theme"
                    ? `width-smaller-700-post-modal-left-side-navigation-bar width-smaller-700-post-modal-left-side-navigation-bar-${themeName}`
                    : `post-modal-from-left-side-navigation-bar post-modal-from-left-side-navigation-bar-${themeName}`
                }
                show={show}
                onHide={handleClose}
              >
                <Modal.Header
                  className="signin-modal-header-child-non-reactivate"
                  style={{
                    border: "none",
                  }}
                >
                  <div
                    onClick={handleClose}
                    className={
                      themeName === "dark-theme"
                        ? `close-button-${themeName}`
                        : `close-button`
                    }
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
                        color={
                          themeName === "dark-theme" ? "white" : "rgb(15,20,25)"
                        }
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
                <Modal.Body>
                  <Stack direction="horizontal" gap={1}>
                    <div className="p-0">
                      {" "}
                      {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                        <img
                          src={userInfo.imageUrl}
                          width={40}
                          height={40}
                          alt=""
                          style={{
                            position: "relative",
                            bottom: "30px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            fill="rgb(83, 100, 113)"
                            className="bi bi-person-circle"
                            viewBox="0 0 16 16"
                            style={{
                              position: "relative",
                              bottom: "30px",
                              borderRadius: "50%",
                            }}
                          >
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="p-0 ">
                      <textarea
                        onChange={handleChange}
                        rows="4"
                        cols="50"
                        value={content}
                        maxLength={maxCharacters}
                        className="input-post"
                        placeholder="What is happening?!"
                        style={{
                          resize: "none",
                          padding: "8px",
                          color:
                            themeName === "dark-theme"
                              ? "white"
                              : "rgba(15,20,25,1.00)",
                          lineHeight: "24px",
                          fontWeight: "400",
                          fontSize: `${content ? "15px" : "20px"}`,
                          width: "100%",
                          height: "100px",
                          backgroundColor:
                            themeName === "dark-theme"
                              ? "black"
                              : "transparent",
                        }}
                      />
                    </div>
                  </Stack>
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

                <Modal.Footer
                  style={{
                    borderTop:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                  className="post-modal-footer ml-1"
                >
                  <Stack direction="horizontal" gap={0}>
                    {/* INFO */}
                    <div
                      className="p-2 image-choose-p-2"
                      onClick={() =>
                        document.getElementById("formuploadModal").click()
                      }
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
                    {/* INFO */}
                    <div className="p-2">
                      {/* emoji mart start to check */}

                      <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        overlay={popoverBottom}
                      >
                        <div
                          className={`svg-border-parent chat-detail-emoji-svg-border-parent svg-border-parent-${themeName}`}
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
                      {/* <div className="p-2 "> */}{" "}
                      {content !== "" || modalImage ? (
                        <Button
                          style={{
                            border: "none",
                          }}
                          variant="primary"
                          onClick={() => handlePost()}
                          className={`post-btn compose-tweet-textArea`}
                        >
                          Post
                        </Button>
                      ) : (
                        <Button
                          style={{
                            border: "none",
                          }}
                          variant="primary"
                          onClick={() => handlePost()}
                          className={`emptyContent post-btn compose-tweet-textArea`}
                        >
                          Post
                        </Button>
                      )}
                    </div>
                  </Stack>
                </Modal.Footer>
              </Modal>
            </>
          </div>
          {/* Seventh  */}
          <div className="p-2">
            <LogoutModal />
          </div>
        </div>
      </Col>
    </>
  );
}

export default LeftSideNavBar;
