import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, Stack, Button, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import CustomNotification from "../components/Notifications/CustomNotification";
import { message } from "antd";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
import io from "socket.io-client";
import LeftSideNavBar from "../components/Main-Left-Side-Navbar/LeftSideNavbar";
import RightSideColumn from "../components/Main-Right-Side-Column/RightSideColumn";
import { ThemeContext } from "../context/ThemeContext";
import UnfollowModal from "../components/unfollow-modal/UnfollowModal";
import useWindowDimensions from "../hooks/getWindowDimensions";
const socket = io.connect(`${API_URL}`);

function FollowingDetailPage() {
  const { userId } = useParams();

  const navigate = useNavigate();

  const { getToken, userInfo } = useContext(UserContext);

  const [following, setFollowing] = useState([]);

  const [isHovered, setIsHovered] = useState(false);
  const [showUnfollowModal, setshowUnfollowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

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
      className: "custom-message-style",
    });
  };
  // finish to check shared post view message

  // socket io 1 client start to check
  const [notificationTest, setnotificationTest] = useState([]);
  const [notificationText, setnotificationText] = useState([]);
  const [activeUserFollowing, setactiveUserFollowing] = useState([]);
  const [clicked, setClicked] = useState(false);
  const getActiveUser = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setactiveUserFollowing(response.data.user.following);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };
  useEffect(() => {
    getActiveUser();
  }, [clicked]);

  const checkActiveUserFollowingIds = () => {
    return activeUserFollowing.map((eachFollowedUser) => {
      return eachFollowedUser._id;
    });
  };

  // socket io 4 client start to check
  useEffect(() => {
    socket.on("socket_id_for_user", (socketId) => {
      localStorage.setItem("socketId", socketId);
    });

    socket.emit("setUsername", userInfo.username);
  }, []);
  // socket io 4 client finish to check

  useEffect(() => {
    socket.on("getNotification", (data) => {
      if (data.senderName !== userInfo.username) {
        setnotificationTest((prev) => [...prev, data]);
      } else {
        console.log("You cannot send a notification to yourself.");
      }
    });

    socket.on("getText", (data) => {
      console.log("Data get text =>", data);
      if (data.senderName !== userInfo.username) {
        setnotificationText(data);

        toast(
          <CustomNotification
            senderName={data.senderName}
            type={data.type}
            contactHasBeenMade={data.contactHasBeenMade}
            senderInfo={data.senderInfo}
            text={data.text ? data.text : null}
          />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
          }
        );
      } else {
        console.log("You cannot send a notification to yourself.");
      }
    });
  }, [socket]);

  useEffect(() => {
    getFollowing();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };
  const [activeTab, setActiveTab] = useState("");

  const getTabStyle = (tab) => {
    return {
      color:
        activeTab === tab && themeName !== "dark-theme"
          ? "rgb(29, 155, 240"
          : activeTab === tab && themeName === "dark-theme"
          ? "white"
          : themeName === "dark-theme"
          ? "#71767A"
          : "rgb(83,100,113)",
      fontWeight: activeTab === tab ? "700" : "400",
      lineHeight: "20px",
      fontSize: "15px",
      cursor: "pointer",
      flex: 1,
      textAlign: "center",
      transition: "background 0.3s",
      textDecoration: "none",
    };
  };

  const openUnfollowModal = (selectedUser) => {
    setSelectedUser(selectedUser);
    setIsHovered(false);
    setshowUnfollowModal(true);
  };

  const handleClose = () => setshowUnfollowModal(false);

  const [followingofthemonitoreduser, setfollowingofthemonitoreduser] =
    useState([]);
  const getFollowing = () => {
    axios
      .get(`${API_URL}/profile/${userId}/following`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setfollowingofthemonitoreduser(response.data.user);
        setActiveTab("following");
        setFollowing(response.data.following);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  // socket io 5 client start to check
  const handleNotification = (selectedUser, userInfo, type) => {
    console.log("Sending notification to => ", selectedUser.username);

    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: selectedUser.username,
      type: type,
      contactHasBeenMade: userInfo,
      senderInfo: userInfo,
    });
  };
  // socket io 5 client finish to check

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

  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);

  const { height, width } = useWindowDimensions();
  return (
    <>
      {contextHolder}
      <ToastContainer theme={themeName === "dark-theme" ? "dark" : "light"} />

      <ResponsiveNavigationBarBottom />
      {/* <ResponsiveNavigationBarTop /> */}

      <Container
        style={{
          overflowX: "hidden",
          overflowY: "hidden",
        }}
        fluid
      >
        <Row
          style={{
            borderTop: "none",
            borderBottom: "none",
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          <LeftSideNavBar parentCallBack={handleCallback} />

          {/* following  detail start to check  */}

          <Col
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={11} // 768px - 992px aralığı
            lg={
              windowWidth <= 1201 && windowWidth >= 992
                ? 7
                : windowWidth > 1201
                ? 5
                : ""
            } // 992px - 1400px aralığı
            xxl={5} // 1400px ve sonrası aralığı
            className={`main-column `}
            style={{
              borderLeft:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",

              borderRight:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
              borderTop: "none ",
              borderBottom: "none",
              padding: "0px",
              position: "relative",
              minHeight: width <= 700 ? "100vh" : "",
            }}
          >
            <Stack
              style={{
                padding: "0px 12px",
              }}
              direction="horizontal"
              gap={0}
            >
              {/* start to check  */}
              <div
                onClick={handleGoBack}
                className={`p-2 arrow arrow-${themeName}`}
                style={{
                  position: "relative",
                  bottom: "15px",
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

              {/* finish to check  */}

              <div
                className="p-2"
                style={{
                  fontWeight: "700",
                  fontSize: "20px",
                  height: "100px",
                }}
              >
                <div>{followingofthemonitoreduser.username}</div>
                <div
                  style={{
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                  }}
                  className="profile-paragraph"
                >
                  @{followingofthemonitoreduser.username}
                </div>
              </div>
            </Stack>

            <div
              style={{
                display: "flex",
                padding: "16px 0px 16px 0px",
              }}
            >
              <Link
                to={`/profile/${followingofthemonitoreduser._id}/followers`}
                style={getTabStyle("followers")}
              >
                Followers
              </Link>
              <Link
                to={`/profile/${followingofthemonitoreduser._id}/following`}
                style={getTabStyle("following")}
              >
                Following
              </Link>
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
                padding: "0px 12px",
              }}
            >
              {following && following.length ? (
                following.map((user, index) => {
                  const buttonId = `followButton_${index}`;

                  const isFollowing = checkActiveUserFollowingIds().includes(
                    user._id
                  );

                  const handleFollow = (selectedUser) => {
                    axios
                      .post(
                        `${API_URL}/follow`,
                        {
                          activeUserId: userInfo._id,
                          theFollowedUserID: user._id,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${getToken()}`,
                          },
                        }
                      )
                      .then(() => {
                        setClicked(!clicked);
                        handleNotification(selectedUser, userInfo, "followed");
                        setIsHovered(false);
                        getFollowing();
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  };

                  const handleUnfollow = (selectedUser) => {
                    axios
                      .post(
                        `${API_URL}/unfollow
                      `,
                        {
                          activeUserId: userInfo._id,
                          theUnfollowedUserID: selectedUser._id,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${getToken()}`,
                          },
                        }
                      )
                      .then(() => {
                        setClicked(!clicked);
                        getFollowing();
                        handleClose();
                        // }, 500);
                      })
                      .catch((error) => {
                        console.log("Error =>", error);
                      });
                  };

                  const handleMouseEnter = () => {
                    setIsHovered(buttonId);
                  };

                  const handleMouseLeave = () => {
                    setIsHovered(false);
                  };

                  const buttonStyles = {
                    cursor: "pointer",
                    textAlign: "center",
                    border:
                      isHovered === buttonId &&
                      isFollowing &&
                      themeName !== "dark-theme"
                        ? "1px solid rgba(253,201,206,255)"
                        : isHovered === buttonId &&
                          isFollowing &&
                          themeName === "dark-theme"
                        ? "1px solid #e71f2c"
                        : isFollowing && themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : "1px solid rgb(70, 70, 70)",
                    borderRadius: "9999px",
                    transitionDuration: "0.2s",
                    backgroundColor:
                      isHovered === buttonId &&
                      isFollowing &&
                      themeName !== "dark-theme"
                        ? "rgba(255,234,235,255)"
                        : isHovered === buttonId &&
                          isFollowing &&
                          themeName === "dark-theme"
                        ? "#230608"
                        : isFollowing && themeName !== "dark-theme"
                        ? "white"
                        : "black",
                    color:
                      isHovered === buttonId && isFollowing
                        ? "rgba(244,34,45,255)"
                        : isFollowing && themeName !== "dark-theme"
                        ? "black"
                        : "white",
                  };

                  return (
                    <div key={user.id} className="following-user">
                      {user.isDeactivated ? null : (
                        <>
                          <Stack
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                            direction="horizontal"
                          >
                            {user.imageUrl.slice(0, 3) !== "../" ? (
                              <Link to={`/profile/${user._id}`}>
                                <img
                                  src={user.imageUrl}
                                  alt={`${user.fullname}'s profile`}
                                  width={40}
                                  height={40}
                                  className="profile-image"
                                  style={{
                                    borderRadius: "50%",
                                  }}
                                />
                              </Link>
                            ) : (
                              <div>
                                <Link to={`/profile/${user._id}`}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    fill="rgb(83, 100, 113)"
                                    className="bi bi-person-circle"
                                    viewBox="0 0 16 16"
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                  >
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                  </svg>
                                </Link>
                              </div>
                            )}
                            {/* User Info */}
                            <div className="user-info p-2">
                              {/* Fullname */}
                              <div
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "700",
                                  lineHeight: "20px",
                                  padding: "2px 0px",
                                }}
                                className="fullname"
                              >
                                <Link
                                  to={`/profile/${user._id}`}
                                  className="hover-fullname"
                                  style={{
                                    textDecoration: "none",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "700",
                                      lineHeight: "20px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      width: "200px",
                                      display: "initial",
                                    }}
                                  >
                                    {user.fullname}
                                  </div>
                                </Link>
                              </div>

                              {/* Username */}
                              <div
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "400",
                                  lineHeight: "20px",
                                  color: "rgb(83, 100, 113)",
                                  position: "relative",
                                }}
                                className="username"
                              >
                                <Link
                                  style={{
                                    textDecoration: "none",
                                  }}
                                  to={`/profile/${user._id}`}
                                >
                                  <span
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "400",
                                      lineHeight: "20px",
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      position: "relative",
                                    }}
                                  >
                                    @{user.username}
                                  </span>
                                </Link>
                                {user._id !== userInfo._id ? (
                                  <span
                                    style={{
                                      position: "absolute",
                                      textAlign: "center",
                                      top: "3px",
                                      marginLeft: "4px",
                                      fontWeight: "500",
                                      lineHeight: "10px",
                                      fontSize: "11px",
                                      wordWrap: "break-word",
                                      whiteSpace: "nowrap",
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      backgroundColor:
                                        themeName === "dark-theme"
                                          ? "#202327"
                                          : "rgba(239,243,244,1.00)",
                                      borderRadius: "3px",
                                      padding: "4px",
                                      overflowX: "hidden",
                                      overflowY: "hidden",
                                    }}
                                  >
                                    Follows you
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            {/* Verified Account Icon (Assuming 'verified' is a boolean property) start to check */}
                            <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                              <svg
                                style={{
                                  position: "relative",
                                  bottom: "10px",
                                  right: "7px",
                                }}
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
                            {/* Verified Account Icon (Assuming 'verified' is a boolean property) finish to check */}
                            {/* Following Button start to check */}
                            <div
                              className="follow-following-section-spesific-profile ms-auto"
                              style={
                                buttonStyles && user._id !== userInfo._id
                                  ? buttonStyles
                                  : null
                              }
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              onClick={() =>
                                isFollowing
                                  ? openUnfollowModal(user)
                                  : handleFollow(user)
                              }
                            >
                              {user._id !== userInfo._id ? (
                                <div
                                  style={{
                                    padding: "8px 16px",
                                    lineHeight: "20px",
                                    fontSize: "15px",
                                    fontWeight: "700",
                                  }}
                                >
                                  {isFollowing
                                    ? isHovered === buttonId
                                      ? "Unfollow"
                                      : "Following"
                                    : "Follow"}
                                </div>
                              ) : null}
                            </div>
                            {/* Following Button finish to check */}
                            {/* unfollow modal start to check  */}
                            <UnfollowModal
                              selectedUser={selectedUser}
                              handleUnfollow={handleUnfollow}
                              showUnfollowModal={showUnfollowModal}
                              handleClose={handleClose}
                            />
                            {/* unfollow modal finish to check  */}
                          </Stack>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <>
                  {/* when no followers yet from for followers section in general start to check  */}
                  <div
                    style={{
                      textAlign: "left",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        lineHeight: "36px",
                        fontSize: "31px",
                        fontWeight: "800",
                        margin: "10px",
                      }}
                    >
                      {userId !== userInfo._id
                        ? "@" +
                          followingofthemonitoreduser.username +
                          " " +
                          "isn’t following anyone"
                        : "Be in the know"}
                    </div>
                    <div
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                        lineHeight: "20px",
                        fontSize: "15px",
                        fontWeight: "400",
                        margin: "10px",
                      }}
                    >
                      {userId !== userInfo._id
                        ? "Once they follow accounts, they’ll show up here."
                        : "Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in."}
                    </div>
                  </div>
                  {/* when no followers yet from for followers section in general finish to check  */}{" "}
                </>
              )}
            </div>
          </Col>
          {/* following  detail finish to check  */}

          {/* 3.column burası olucak  */}
          <RightSideColumn />
        </Row>
      </Container>
    </>
  );
}

export default FollowingDetailPage;
