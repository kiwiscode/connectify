import { useContext, useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./navbar.css";
import { message } from "antd";
import PostModal from "../Main-Left-Side-Navbar/PostModal";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function ResponsiveNavigationBarBottom({
  refreshPosts,
  setLoadingTrue,
  setLoadingFalse,
  isUserProfile,
  isUserSpesificProfile,
  isSubModalOpened,
  isSubModalTabIndexNull,
}) {
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const { getToken } = useContext(UserContext);
  // start to check shared post view message
  const [currentCreatedPost, setcurrentCreatedPost] = useState(null);

  const handleCallback = (childData) => {
    // Update the name in the component's state
    setcurrentCreatedPost(childData);
    postSharedMessage(childData.authorUserName, childData._id);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const postSharedMessage = (postOwner, postId) => {
    messageApi.success({
      type: "success",
      content: (
        <div>
          <span>Your post was sent.</span>
          <>
            <Link
              to={`/${postOwner}/status/${postId}`}
              style={{
                color: "white",
                marginLeft: "5px",
              }}
            >
              View
            </Link>
          </>
        </div>
      ),
      duration: 6,
      className: "custom-message-style-responsive",
    });
  };

  const redirectToMessages = () => {
    setTimeout(() => {
      window.location.href = "http://localhost:5173/messages";
    }, 1000);
  };

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const scrollingUp = prevScrollPos > currentScrollPos;

    setPrevScrollPos(currentScrollPos);

    if (scrollingUp) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const { userInfo } = useContext(UserContext);

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

  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);
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
  useEffect(() => {
    getActiveUserInfo();
  }, []);

  const checkHowManyUnReadMessages = () => {
    const allUnReadedMessages = userInfo?.messages?.filter((allMessages) => {
      return allMessages.readed === false;
    });

    return allUnReadedMessages;
  };
  return (
    <>
      {!isSubModalOpened && isSubModalTabIndexNull === null ? (
        <>
          <Stack
            style={{
              height: "50px",
              backgroundColor: themeName === "dark-theme" ? "black" : "white",
              filter:
                themeName === "dark-theme"
                  ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                  : "",

              boxShadow:
                themeName === "dark-theme"
                  ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                  : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
            }}
            direction="horizontal"
            gap={4}
            className={
              themeName === "dark-theme"
                ? `responsive-navigation-bar-bottom responsive-navigation-bar-bottom-${themeName} ${
                    visible ? "visible" : "hidden"
                  } `
                : `responsive-navigation-bar-bottom ${
                    visible ? "visible" : "hidden"
                  } `
            }
          >
            <div className="p-2">
              <NavLink
                // to="/home"
                onClick={locateHomePage}
              >
                <svg
                  color={themeName === "dark-theme" ? "white" : "black"}
                  fill="currentColor"
                  style={{}}
                  width={26}
                  height={26}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                >
                  <g className="home-svg-group">
                    {window.location.href === "http://localhost:5173/home" ? (
                      <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
                    ) : (
                      <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
                    )}
                  </g>
                </svg>
              </NavLink>
            </div>
            <div
              style={{
                position: "relative",
              }}
              className="p-2"
            >
              <NavLink onClick={locateNotificationsPage}>
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
                <svg
                  style={{}}
                  color={themeName === "dark-theme" ? "white" : "black"}
                  fill="currentColor"
                  width={26}
                  height={26}
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
              </NavLink>
            </div>
            <div
              style={{
                position: "relative",
              }}
              className="p-2"
            >
              {" "}
              <NavLink onClick={locateMessagesPage}>
                <>
                  {checkHowManyUnReadMessages()?.length < 1 ? null : (
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
                        {checkHowManyUnReadMessages()?.length}
                      </span>
                    </div>
                  )}
                </>
                <svg
                  color={themeName === "dark-theme" ? "white" : "black"}
                  fill="currentColor"
                  width={26}
                  height={26}
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
              </NavLink>
            </div>
            <div className="p-2">
              {" "}
              <NavLink onClick={locateProfilePage}>
                <svg
                  color={themeName === "dark-theme" ? "white" : "black"}
                  fill="currentColor"
                  width={26}
                  height={26}
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
              </NavLink>
            </div>
          </Stack>
          <div className="responsive-navigation-bar-bottom">
            <PostModal
              // IMPORTANT => calling the refreshPosts as a prop from PostModal component and refreshing the posts !
              setLoadingTrue={setLoadingTrue}
              setLoadingFalse={setLoadingFalse}
              refreshPosts={refreshPosts}
              visible={visible}
              parentCallBack={handleCallback}
            ></PostModal>
          </div>
        </>
      ) : null}
      {contextHolder}
    </>
  );
}

export default ResponsiveNavigationBarBottom;
