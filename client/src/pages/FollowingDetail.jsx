import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, Stack, Button, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LogoutModal, PostModal } from "../components/ui/Modal";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import ResponsiveNavigationBarTop from "../components/Navbar/ResponsiveNavigationTop";
import { Bounce, ToastContainer, toast } from "react-toastify";
import CustomNotification from "../components/Notifications/CustomNotification";
import { message } from "antd";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
import io from "socket.io-client";

function FollowingDetailPage() {
  const socket = io.connect(`${API_URL}`);
  const { userId } = useParams();

  const navigate = useNavigate();

  // const { getToken, userInfo, socket } = useContext(UserContext);
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
            theme: "light",
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
      color: activeTab === tab ? "rgb(29, 155, 240" : "rgb(83,100,113)",
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

  return (
    <>
      {contextHolder}
      <ToastContainer />

      <ResponsiveNavigationBarBottom />
      {/* <ResponsiveNavigationBarTop /> */}

      <Container
        style={{
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Row
          style={{
            height: "100vh",
            borderTop: "none",
            borderBottom: "none",
          }}
        >
          <Col className="left-column" xs={12} sm={12} md={1} lg={3} xxl={3}>
            <nav className="nav-bar-home ">
              <Link to="/home">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-chevron-double-left like-icon"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    <path d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                  </svg>
                </div>
              </Link>

              <div className="inner-div inner-div-fonts">
                <Link to="/home">
                  <div className="home">
                    <div>
                      <svg
                        width={26}
                        height={26}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                      >
                        <g>
                          <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
                        </g>
                      </svg>

                      <span>Home</span>
                    </div>
                  </div>
                </Link>

                {/* start to check notification component place  */}
                <Link>
                  <div className="notifications">
                    <div>
                      <svg
                        width={26}
                        height={26}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                      >
                        <g>
                          <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path>
                        </g>
                      </svg>
                      <span>Notifications </span>
                    </div>
                  </div>
                </Link>
                {/* finish to check notification component place  */}

                <Link to="/messages">
                  <div className="messages">
                    <div>
                      <svg
                        width={26}
                        height={26}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                      >
                        <g>
                          <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                        </g>
                      </svg>
                      <span>Messages</span>
                    </div>
                  </div>
                </Link>

                <Link to={"/profile"}>
                  <div className="profile">
                    <div>
                      <svg
                        width={26}
                        height={26}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                      >
                        <g>
                          <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                        </g>
                      </svg>

                      <span>Profile</span>
                    </div>
                  </div>
                </Link>
                <PostModal parentCallBack={handleCallback}></PostModal>
              </div>

              <LogoutModal></LogoutModal>
            </nav>
          </Col>

          {/* following  detail start to check  */}

          <Col
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={11} // 768px - 992px aralığı
            lg={6} // 1200px - 1400px aralığı
            xxl={6} // 1400px ve sonrası aralığı
            className={`main-column`}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <Stack direction="horizontal" gap={0}>
              {/* start to check  */}
              <div
                onClick={handleGoBack}
                className="p-2 arrow"
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
                <div className="profile-paragraph">
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

            <Row
              style={{
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            ></Row>

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
                  minWidth: "25%",
                  textAlign: "center",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  borderRadius: "9999px",
                  lineHeight: "20px",
                  fontSize: "15px",
                  fontWeight: "700",
                  padding: "5px",
                  marginRight: "15px",
                  transitionDuration: "0.2s",
                  border:
                    isHovered === buttonId && isFollowing
                      ? "1px solid rgba(253,201,206,255)"
                      : isFollowing
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : "1px solid rgb(185, 202, 211)",
                  backgroundColor:
                    isHovered === buttonId && isFollowing
                      ? "rgba(255,234,235,255)"
                      : isFollowing
                      ? "white"
                      : "black",
                  color:
                    isHovered === buttonId && isFollowing
                      ? "rgba(244,34,45,255)"
                      : isFollowing
                      ? "black"
                      : "white",
                };

                return (
                  <div key={user.id} className="following-user">
                    {user.isDeactivated ? null : (
                      <>
                        <Stack direction="horizontal">
                          {user.imageUrl.slice(0, 3) !== "../" ? (
                            <Link to={`/profile/${user._id}`}>
                              <img
                                src={user.imageUrl}
                                alt={`${user.fullname}'s profile`}
                                width={40}
                                height={40}
                                className="profile-image"
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
                              }}
                              className="fullname"
                            >
                              <Link
                                to={`/profile/${user._id}`}
                                className="hover-fullname"
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    lineHeight: "20px",
                                  }}
                                >
                                  {user.fullname}
                                </span>
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
                                    color: "rgb(83, 100, 113)",
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
                                    color: "rgb(83, 100, 113)",
                                    fontSize: "11px",
                                    wordWrap: "break-word",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "rgba(239,243,244,1.00)",
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
                              <>
                                {isFollowing
                                  ? isHovered === buttonId
                                    ? "Unfollow"
                                    : "Following"
                                  : "Follow"}
                              </>
                            ) : null}
                          </div>
                          {/* Following Button finish to check */}
                          {/* unfollow modal start to check  */}
                          <Modal show={showUnfollowModal} onHide={handleClose}>
                            <Modal.Body
                              style={{
                                textAlign: "center",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "20px",
                                    lineHeight: "24px",
                                    textAlign: "left",
                                  }}
                                >
                                  Unfollow @{selectedUser.username}?
                                </span>
                                <div
                                  style={{
                                    color: "rgb(83, 100, 113)",
                                    fontWeight: "400",
                                    fontSize: "15px",
                                    lineHeight: "20px",
                                    textAlign: "left",
                                  }}
                                >
                                  Their posts will no longer show up in your
                                  Following timeline. You can still view their
                                  profile, unless their posts are protected.
                                </div>
                              </div>
                            </Modal.Body>
                            <Modal.Footer
                              style={{
                                border: "none",
                              }}
                            >
                              <Button
                                variant="dark"
                                onClick={() => handleUnfollow(selectedUser)}
                              >
                                Unfollow
                              </Button>
                              <Button
                                className="hover-unfollow-cancel"
                                style={{ color: "black" }}
                                variant="light"
                                onClick={handleClose}
                              >
                                Cancel
                              </Button>
                            </Modal.Footer>
                          </Modal>
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
                      color: "rgb(83, 100, 113)",
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
          </Col>
          {/* following  detail finish to check  */}

          {/* 3.column burası olucak  */}
          <Col
            className="side-bar-column d-none d-lg-block d-xxl-block"
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={6} // 768px - 992px aralığı
            lg={3} // 1200px - 1400px aralığı
            xxl={3} // 1400px ve sonrası aralığı
            style={{
              height: "100%",
              backgroundColor: "indianred",
            }}
          >
            Side bar column
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default FollowingDetailPage;
