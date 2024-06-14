import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, Stack } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { message } from "antd";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
import io from "socket.io-client";
const socket = io.connect(`${API_URL}`);
import { ThemeContext } from "../context/ThemeContext";
import UnfollowModal from "../components/unfollow-modal/UnfollowModal";
import useWindowDimensions from "../hooks/getWindowDimensions";

function FollowingDetailPage() {
  const { userId } = useParams();

  const navigate = useNavigate();

  const { getToken, userInfo } = useContext(UserContext);

  const [following, setFollowing] = useState([]);

  const [isHovered, setIsHovered] = useState(false);
  const [showUnfollowModal, setshowUnfollowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  // start to check shared post view message

  // finish to check shared post view message
  const [subscription, setSubscription] = useState(null);

  const getSubscription = async () => {
    try {
      const response = await axios.get(`${API_URL}/subscription`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log(
        "response data detail =>",
        response.data.activeSubscription[0]
      );
      console.log(
        "response data detail 2 =>",
        response.data.activeCancelledSubscription[0]
      );

      setSubscription(
        response.data.activeSubscription[0]
          ? response.data.activeSubscription[0]
          : response.data.activeCancelledSubscription[0]
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [remainingTimeSubscriptions, setRemainingTimeSubscriptions] = useState(
    []
  );
  const [
    remainingTimeSubscriptionsOwnerIds,
    setRemainingTimeSubscriptionsOwnerIds,
  ] = useState([]);
  const getRemainingTimeSubscriptions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/remaining_time_subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setRemainingTimeSubscriptions(response.data.remainingTimeSubscriptions);

      setRemainingTimeSubscriptionsOwnerIds(
        response.data.remainingTimeSubscriptions.map((eachSub) => {
          return eachSub.owner;
        })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getSubscription();
    getRemainingTimeSubscriptions();
  }, []);
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

  useEffect(() => {
    getFollowing();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };
  const [activeTab, setActiveTab] = useState("");

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
  const handleFollowingNotification = (selectedUser, userInfo, type) => {
    console.log("Sending notification to => ", selectedUser.username);

    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: selectedUser.username,
      type: type,
      contactHasBeenMade: userInfo,
      senderInfo: userInfo,
    });
  };
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);
  const [postModalOpenedFromLeftSide, setPostModalOpenedFromLeftSide] =
    useState(false);

  const handleCallBackForModalOpenedStateFromChild = (childData) => {
    console.log("Child data received from child => ", childData);
    setPostModalOpenedFromLeftSide(childData);
  };
  const { width } = useWindowDimensions();
  const [headerPosition, setHeaderPosition] = useState(0);

  const handleScroll = () => {
    const scrollPosition = window.pageYOffset;

    if (scrollPosition < 53) {
      setHeaderPosition(-scrollPosition);
    } else {
      setHeaderPosition(-53);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerPosition]);

  const [hoveredTab, setHoveredTab] = useState(null);

  const handleHover = (tab) => {
    setHoveredTab(tab);
  };

  const handleLeave = () => {
    setHoveredTab(null);
  };
  const handleShowFollowers = () => {
    setActiveTab("followers");
    navigate(`/profile/${followingofthemonitoreduser._id}/followers`);
  };

  const handleShowFollowing = () => {
    setActiveTab("following");
    navigate(`/profile/${followingofthemonitoreduser._id}/following`);
  };

  return (
    <>
      {!postModalOpenedFromLeftSide && <ResponsiveNavigationBarBottom />}

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
          minHeight: width <= 700 ? "100dvh" : "",
        }}
      >
        <div
          style={{
            backgroundColor: "transparent",
            minHeight: "53px",
            zIndex: 99999,
            backdropFilter: "blur(12px)",
            transform: width <= 500 && `translateY(${headerPosition}px)`,
            transition:
              width <= 500 && "transform 0.3s cubic-bezier(0, 0, 0, 1)",
            position: width > 500 && "sticky",
            top: width > 500 && "0px",
            width: width > 500 && "100%",
          }}
        >
          {width <= 500 ? (
            <>
              <div
                style={{
                  minHeight: "53px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "53px",
                      height: "53px",
                      maxHeight: "53px",
                    }}
                  >
                    <div
                      onClick={() => navigate(-1)}
                      className={`arrow arrow-${themeName}`}
                      style={{
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <svg
                        fill={
                          themeName === "dark-theme"
                            ? "rgb(231,233,234)"
                            : "rgb(15, 20, 25)"
                        }
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      height: "53px",
                      maxHeight: "53px",
                    }}
                  >
                    <div
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                      }
                      style={{
                        fontSize: "17px",
                        lineHeight: "20px",
                      }}
                    >
                      {followingofthemonitoreduser.fullname}
                    </div>
                    <div
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                      style={{
                        fontSize: "13px",
                        lineHeight: "16px",
                      }}
                    >
                      @{followingofthemonitoreduser.username}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "hover-effect-dark-theme-pointer-plus chirp-bold-font"
                        : themeName !== "dark-theme"
                        ? "hover-effect-light-theme-pointer-plus"
                        : null
                    }
                    onMouseEnter={() => handleHover("followers")}
                    onMouseLeave={handleLeave}
                    onClick={handleShowFollowers}
                    style={{
                      color:
                        activeTab === "followers" && themeName !== "dark-theme"
                          ? "#0f141a"
                          : activeTab === "followers" &&
                            themeName === "dark-theme"
                          ? "#e6e9ea"
                          : themeName === "dark-theme"
                          ? "#71767A"
                          : "#526371",
                      fontWeight: activeTab === "followers" ? "700" : "500",
                      lineHeight: "20px",
                      fontSize: "15px",
                      cursor: "pointer",
                      flex: 1,
                      textAlign: "center",
                      transition: "background 0.3s",
                      maxHeight: "inherit",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "16px 0px 16px 0px",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      <span
                        className={
                          themeName === "dark-theme" &&
                          activeTab === "followers"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : themeName !== "dark-theme" &&
                              activeTab === "followers"
                            ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                            : themeName === "dark-theme" &&
                              activeTab !== "followers"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                            : themeName !== "dark-theme" &&
                              activeTab !== "followers"
                            ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                            : null
                        }
                      >
                        Followers
                      </span>
                      {activeTab === "followers" && (
                        <div
                          style={{
                            backgroundColor: "rgb(29, 155, 240)",
                            height: "4px",
                            width: "100%",
                            minWidth: "52px",
                            position: "absolute",
                            bottom: "0px",
                            borderRadius: "9999px",
                          }}
                        ></div>
                      )}
                    </div>
                  </div>

                  <div
                    className={
                      themeName === "dark-theme"
                        ? "hover-effect-dark-theme-pointer-plus "
                        : themeName !== "dark-theme"
                        ? "hover-effect-light-theme-pointer-plus "
                        : null
                    }
                    onMouseEnter={() => handleHover("following")}
                    onMouseLeave={handleLeave}
                    onClick={handleShowFollowing}
                    style={{
                      color:
                        activeTab === "following" && themeName !== "dark-theme"
                          ? "#0f141a"
                          : activeTab === "following" &&
                            themeName === "dark-theme"
                          ? "#e6e9ea"
                          : themeName === "dark-theme"
                          ? "#71767A"
                          : "#526371",
                      fontWeight: activeTab === "following" ? "700" : "500",
                      lineHeight: "20px",
                      fontSize: "15px",
                      cursor: "pointer",
                      flex: 1,
                      textAlign: "center",
                      transition: "background 0.3s",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "16px 0px 16px 0px",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      <span
                        className={
                          themeName === "dark-theme" &&
                          activeTab === "following"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : themeName !== "dark-theme" &&
                              activeTab === "following"
                            ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                            : themeName === "dark-theme" &&
                              activeTab !== "following"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                            : themeName !== "dark-theme" &&
                              activeTab !== "following"
                            ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                            : null
                        }
                      >
                        Following
                      </span>{" "}
                      {activeTab === "following" && (
                        <div
                          style={{
                            backgroundColor: "rgb(29, 155, 240)",
                            height: "4px",
                            width: "100%",
                            minWidth: "52px",
                            position: "absolute",
                            bottom: "0px",
                            borderRadius: "9999px",
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  minHeight: "53px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0px 16px",
                  }}
                >
                  <div
                    onClick={handleGoBack}
                    // className="p-2 arrow"
                    className={`p-2 arrow arrow-${themeName}`}
                    style={{
                      width: "36px",
                      height: " 36px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      color={themeName === "dark-theme" ? "white" : ""}
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
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 p-2 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 p-2 chirp-bold-font"
                    }
                    style={{
                      fontSize: "20px",
                      lineHeight: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: ".2rem",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="chirp-bold-font"
                        style={{
                          lineHeight: width <= 500 ? "20px" : "24px",
                          fontSize: width <= 500 ? "17px" : "20px",
                        }}
                      >
                        {followingofthemonitoreduser.fullname}
                      </div>
                    </div>

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
                  </div>{" "}
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "hover-effect-dark-theme-pointer-plus chirp-bold-font"
                        : themeName !== "dark-theme"
                        ? "hover-effect-light-theme-pointer-plus"
                        : null
                    }
                    onMouseEnter={() => handleHover("followers")}
                    onMouseLeave={handleLeave}
                    onClick={handleShowFollowers}
                    style={{
                      color:
                        activeTab === "followers" && themeName !== "dark-theme"
                          ? "#0f141a"
                          : activeTab === "followers" &&
                            themeName === "dark-theme"
                          ? "#e6e9ea"
                          : themeName === "dark-theme"
                          ? "#71767A"
                          : "#526371",
                      fontWeight: activeTab === "followers" ? "700" : "500",
                      lineHeight: "20px",
                      fontSize: "15px",
                      cursor: "pointer",
                      flex: 1,
                      textAlign: "center",
                      transition: "background 0.3s",
                      maxHeight: "inherit",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "16px 0px 16px 0px",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      <span
                        className={
                          themeName === "dark-theme" &&
                          activeTab === "followers"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : themeName !== "dark-theme" &&
                              activeTab === "followers"
                            ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                            : themeName === "dark-theme" &&
                              activeTab !== "followers"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                            : themeName !== "dark-theme" &&
                              activeTab !== "followers"
                            ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                            : null
                        }
                      >
                        Followers
                      </span>
                      {activeTab === "followers" && (
                        <div
                          style={{
                            backgroundColor: "rgb(29, 155, 240)",
                            height: "4px",
                            width: "100%",
                            minWidth: "52px",
                            position: "absolute",
                            bottom: "0px",
                            borderRadius: "9999px",
                          }}
                        ></div>
                      )}
                    </div>
                  </div>

                  <div
                    className={
                      themeName === "dark-theme"
                        ? "hover-effect-dark-theme-pointer-plus "
                        : themeName !== "dark-theme"
                        ? "hover-effect-light-theme-pointer-plus "
                        : null
                    }
                    onMouseEnter={() => handleHover("following")}
                    onMouseLeave={handleLeave}
                    onClick={handleShowFollowing}
                    style={{
                      color:
                        activeTab === "following" && themeName !== "dark-theme"
                          ? "#0f141a"
                          : activeTab === "following" &&
                            themeName === "dark-theme"
                          ? "#e6e9ea"
                          : themeName === "dark-theme"
                          ? "#71767A"
                          : "#526371",
                      fontWeight: activeTab === "following" ? "700" : "500",
                      lineHeight: "20px",
                      fontSize: "15px",
                      cursor: "pointer",
                      flex: 1,
                      textAlign: "center",
                      transition: "background 0.3s",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "16px 0px 16px 0px",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      <span
                        className={
                          themeName === "dark-theme" &&
                          activeTab === "following"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : themeName !== "dark-theme" &&
                              activeTab === "following"
                            ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                            : themeName === "dark-theme" &&
                              activeTab !== "following"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                            : themeName !== "dark-theme" &&
                              activeTab !== "following"
                            ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                            : null
                        }
                      >
                        Following
                      </span>{" "}
                      {activeTab === "following" && (
                        <div
                          style={{
                            backgroundColor: "rgb(29, 155, 240)",
                            height: "4px",
                            width: "100%",
                            minWidth: "52px",
                            position: "absolute",
                            bottom: "0px",
                            borderRadius: "9999px",
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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
                    handleFollowingNotification(
                      selectedUser,
                      userInfo,
                      "followed"
                    );
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
                    handleClose();
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
                  !isFollowing &&
                  themeName === "dark-theme" &&
                  isHovered !== buttonId
                    ? "white"
                    : !isFollowing &&
                      themeName === "dark-theme" &&
                      isHovered === buttonId
                    ? "#d7dbdc"
                    : isHovered === buttonId &&
                      isFollowing &&
                      themeName !== "dark-theme"
                    ? "rgba(255,234,235,255)"
                    : isHovered === buttonId &&
                      isFollowing &&
                      themeName === "dark-theme"
                    ? "#230608"
                    : isFollowing && themeName === "dark-theme"
                    ? "black"
                    : isFollowing && themeName !== "dark-theme"
                    ? "white"
                    : !isFollowing &&
                      themeName !== "dark-theme" &&
                      isHovered === buttonId
                    ? "#272c30"
                    : "black",
                color:
                  !isFollowing && themeName === "dark-theme"
                    ? "black"
                    : isHovered === buttonId && isFollowing
                    ? "rgba(244,34,45,255)"
                    : isFollowing && themeName !== "dark-theme"
                    ? "black"
                    : "white",
              };

              return (
                <div key={user._id} className="following-user">
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
                                fill={
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)"
                                }
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
                        {user?.hasSubscription ||
                        (!subscription?.isActive &&
                          subscription?.remainingTimeSubscription &&
                          subscription?.cancelledDate &&
                          subscription?.owner === user?._id) ||
                        remainingTimeSubscriptionsOwnerIds.includes(
                          user?._id
                        ) ? (
                          <span>
                            {/* start to check  */}{" "}
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
                                data-testid="verified-icon"
                                color="rgba(29,155,240,1.00)"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                </g>
                              </svg>
                            </span>{" "}
                          </span>
                        ) : null}
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
    </>
  );
}

export default FollowingDetailPage;
