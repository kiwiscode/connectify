import { useContext, useEffect, useState } from "react";
import { Modal, Stack, Button } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import UnfollowModal from "../unfollow-modal/UnfollowModal";
import useWindowDimensions from "../../hooks/getWindowDimensions";

const API_URL = import.meta.env.VITE_APP_API_URL;

import { SubcsriptionStatusContext } from "../../context/SubscriptionStatusContext";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";
import { StateRefreshTriggersContext } from "../../context/State-refresh-triggers-Context";

function PostEngagements({
  detailedPost,
  postDetailPage,
  imagePostDetailPage,
}) {
  const {
    subscription,

    remainingTimeSubscriptionsOwnerIds,
  } = useContext(SubcsriptionStatusContext);
  const [show, setShow] = useState(false);

  const { userInfo, getToken } = useContext(UserContext);
  const [showReposts, setshowReposts] = useState(false);
  const [activeTab, setActiveTab] = useState("forYou");

  const handleShowReposts = () => {
    // handleShowDetailedPostReposts();
    setActiveTab("reposts");
    setshowReposts(true);
  };
  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight11,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font15 = getFontSizeAndLineHeight15();
  const font11 = getFontSizeAndLineHeight11();
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setActiveTab("reposts");
    handleShowReposts();
    setshowReposts(true);
    setShow(true);
  };

  const handleShowLikes = () => {
    // handleShowDetailedPostLikes();
    setActiveTab("likes");
    setshowReposts(false);
  };

  const [isHovered, setIsHovered] = useState(null);

  const getTabStyle = (tab) => {
    return {
      // textDecoration: activeTab === tab ? "underline" : "none",
      // background: hoveredTab === tab ? "purple" : "none",
      color:
        activeTab === tab && themeName !== "dark-theme"
          ? "rgb(29, 155, 240"
          : activeTab === tab && themeName === "dark-theme"
          ? "white"
          : themeName === "dark-theme"
          ? "#71767A"
          : "rgb(83,100,113)",
      fontWeight: activeTab === tab ? "700" : "400",
      fontSize: font15.fontSize,
      lineHeight: font15.lineHeight,
      cursor: "pointer",
      flex: 1,
      textAlign: "center",
      transition: "background 0.3s", // Hover efekti için geçiş efekti
    };
  };

  const checkMap = detailedPost.reposted
    ? detailedPost.reposted.map((eachReposter) => {
        return eachReposter.fullname;
      })
    : null;

  const [activeUser, setactiveUser] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const getActiveUser = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFollowers(response.data.user.followers);
        setFollowings(response.data.user.following);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  useEffect(() => {
    getActiveUser();
  }, [clicked]);

  const allFollowerIds = () => {
    return followers.map((eachFollower) => {
      return eachFollower._id;
    });
  };

  const allFollowingIds = () => {
    return followings.map((eachFollowing) => {
      return eachFollowing._id;
    });
  };
  const [selectedUser, setSelectedUser] = useState("");
  const [showUnfollowModal, setshowUnfollowModal] = useState(false);

  const { setTriggerRefreshWhoToFollow } = useContext(
    StateRefreshTriggersContext
  );

  const openUnfollowModal = (selectedUser) => {
    setSelectedUser(selectedUser);
    setIsHovered(null);
    setshowUnfollowModal(true);
  };

  const handleCloseUnfollowModal = () => setshowUnfollowModal(false);

  const handleUnfollow = (unfollowedUser) => {
    axios
      .post(
        `${API_URL}/unfollow
      `,
        {
          activeUserId: userInfo._id,
          theUnfollowedUserID: unfollowedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        getActiveUser();
        setClicked(!clicked);
        setIsHovered(null);
        setTriggerRefreshWhoToFollow((prev) => prev + 1);
        handleCloseUnfollowModal();
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  const [{ theme, themeName }] = useContext(ThemeContext);

  const { width } = useWindowDimensions();

  return (
    <>
      {/* view post engagements section start to check */}
      <Stack
        onClick={handleShow}
        // className="view-post-engagements-section transition-gray-hover"
        className={`view-post-engagements-section transition-gray-hover transition-gray-hover-${themeName}`}
        direction="horizontal"
        style={{
          cursor: "pointer",
          justifyContent: "left",
        }}
        gap={0}
      >
        <div style={{}} className="p-2">
          {detailedPost.userId ? (
            detailedPost.userId._id === userInfo._id ? (
              <>
                <svg
                  style={{
                    paddingRight: "4px",
                  }}
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1hvjb8t"
                  fill={
                    themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)"
                  }
                >
                  <g>
                    <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
                  </g>
                </svg>

                <span
                  className="p-0 chirp-regular-font"
                  style={{
                    position: "relative",
                    top: "1px",
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                  }}
                >
                  View post engagements
                </span>
              </>
            ) : null
          ) : null}
        </div>
      </Stack>
      {/* view post engagements section finish to check */}

      <Modal
        show={show}
        onHide={handleClose}
        centered="true"
        contentClassName={`extra-css-engage-modal extra-css-engage-modal-${themeName}`}
        backdropClassName={
          themeName === "dark-theme" ? `back-drop-${themeName}` : ""
        }
        dialogClassName={width <= 700 ? "modal-fullscreen" : ""}
      >
        <Modal.Header
          style={{
            border: "none",
          }}
        >
          <div
            onClick={handleClose}
            className={`close-button close-button-${themeName}`}
            style={{ borderRadius: "50%", cursor: "pointer" }}
          >
            <div>
              <svg
                style={{
                  border: "none",
                  margin: "5px",
                }}
                onClick={handleClose}
                width={20}
                height={20}
                color={themeName === "dark-theme" ? "white" : "rgb(15,20,25)"}
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
        {/* <Modal.Body> */}
        <div
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
            display: "flex",
            padding: "16px 0px 16px 0px",
          }}
        >
          <span
            onClick={() => handleShowReposts()}
            style={getTabStyle("reposts")}
          >
            Reposts
          </span>
          <span onClick={() => handleShowLikes()} style={getTabStyle("likes")}>
            Likes
          </span>
        </div>
        {/* </Modal.Body> */}
        <div>
          {showReposts ? (
            <>
              {detailedPost.reposted && detailedPost.reposted.length > 0 ? (
                <>
                  {detailedPost.reposted.map((eachReposter, index) => {
                    const buttonId = `followButton_${index}`;

                    const isFollowing = allFollowingIds().includes(
                      eachReposter._id
                    );

                    const handleMouseEnter = () => {
                      setIsHovered(buttonId);
                    };

                    const handleMouseLeave = () => {
                      setIsHovered(null);
                    };
                    const buttonStyles = {
                      transitionDuration: "0.2s",
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      fontWeight: "700",
                      display: "inline",
                      maxWidth: "107px",
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
                      backgroundColor:
                        !isFollowing && themeName === "dark-theme"
                          ? "white"
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

                    const handleFollow = () => {
                      axios
                        .post(
                          `${API_URL}/follow`,
                          {
                            activeUserId: userInfo._id,
                            theFollowedUserID: eachReposter._id,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${getToken()}`,
                            },
                          }
                        )
                        .then(() => {
                          // getActiveUser();
                          setClicked(!clicked);
                          setIsHovered(null);
                          setTriggerRefreshWhoToFollow((prev) => prev + 1);
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    };

                    return (
                      <div key={eachReposter._id}>
                        <Stack
                          style={{
                            margin: "5px",
                            padding: "5px",
                          }}
                          direction="horizontal"
                        >
                          <div className="p-0">
                            {" "}
                            {eachReposter.imageUrl.slice(0, 3) !== "../" ? (
                              <>
                                <Link
                                  to={`/profile/${eachReposter._id}`}
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  <img
                                    width={40}
                                    height={40}
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                    src={eachReposter.imageUrl}
                                    alt=""
                                  />
                                </Link>
                              </>
                            ) : (
                              <>
                                <Link
                                  to={`/profile/${eachReposter._id}`}
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  <img
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                    width="40"
                                    height="40"
                                    src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                    alt=""
                                  />
                                </Link>
                              </>
                            )}
                          </div>
                          <div
                            style={{
                              marginLeft: "10px",
                            }}
                            className="p-0"
                          >
                            <Link
                              className="flex justify-start items-center"
                              to={`/profile/${eachReposter._id}`}
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              <div
                                className="hover-fullname chirp-bold-font"
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "rgb(15, 20, 25)",

                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
                                }}
                              >
                                {eachReposter.fullname}
                              </div>
                              {eachReposter.isPrivate && (
                                <div className="ml-[5px] flex">
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
                                </div>
                              )}
                              {/* Verified Account Icon (Assuming 'verified' is a boolean property) start to check */}
                              {eachReposter.hasSubscription ||
                              (!subscription?.isActive &&
                                subscription?.remainingTimeSubscription &&
                                subscription?.cancelledDate &&
                                subscription?.owner === eachReposter._id) ||
                              remainingTimeSubscriptionsOwnerIds.includes(
                                eachReposter._id
                              ) ? (
                                <span>
                                  {/* start to check  */}{" "}
                                  <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                                    <svg
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
                            </Link>
                            <div
                              className="p-0"
                              style={{
                                position: "relative",
                              }}
                            >
                              {" "}
                              <Link
                                to={`/profile/${eachReposter._id}`}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                <span
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
                                  @{eachReposter.username}{" "}
                                </span>
                              </Link>
                              {allFollowerIds().includes(eachReposter._id) ? (
                                <span
                                  className="chirp-medium-font"
                                  style={{
                                    position: "absolute",
                                    textAlign: "center",
                                    top: "4px",
                                    marginLeft: "4px",
                                    fontSize: font11.fontSize,
                                    lineHeight: font11.lineHeight,
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

                          {/* Following Button start to check */}
                          {eachReposter._id !== userInfo._id ? (
                            <>
                              <Button
                                className="ms-auto"
                                style={
                                  buttonStyles &&
                                  eachReposter._id !== userInfo._id
                                    ? buttonStyles
                                    : null
                                }
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() =>
                                  isFollowing
                                    ? openUnfollowModal(eachReposter)
                                    : handleFollow(eachReposter)
                                }
                                variant="dark"
                              >
                                {eachReposter._id !== userInfo._id ? (
                                  <span>
                                    {isFollowing
                                      ? isHovered === buttonId
                                        ? "Unfollow"
                                        : "Following"
                                      : "Follow"}
                                  </span>
                                ) : null}
                              </Button>
                            </>
                          ) : null}

                          {/* Following Button finish to check */}
                        </Stack>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "32px",
                      // backgroundColor: "blue",
                      width: "60%",
                      margin: "auto",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="chirp-heavy-font"
                      style={{
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        textAlign: "left",
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      No reposts yet
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
                      }}
                    >
                      When someone chooses to repost this post, it will show up
                      here.
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {detailedPost.likes && detailedPost.likes.length > 0 ? (
                <>
                  {detailedPost.likes.map((eachLiker, index) => {
                    const buttonId = `followButton_${index}`;

                    const isFollowing = allFollowingIds().includes(
                      eachLiker._id
                    );

                    const handleMouseEnter = () => {
                      setIsHovered(buttonId);
                    };

                    const handleMouseLeave = () => {
                      setIsHovered(null);
                    };
                    const buttonStyles = {
                      transitionDuration: "0.2s",
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      fontWeight: "700",
                      display: "inline",
                      maxWidth: "107px",

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
                      backgroundColor:
                        !isFollowing && themeName === "dark-theme"
                          ? "white"
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

                    const handleFollow = () => {
                      axios
                        .post(
                          `${API_URL}/follow`,
                          {
                            activeUserId: userInfo._id,
                            theFollowedUserID: eachLiker._id,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${getToken()}`,
                            },
                          }
                        )
                        .then(() => {
                          // getActiveUser();
                          setClicked(!clicked);
                          setIsHovered(null);
                          setTriggerRefreshWhoToFollow((prev) => prev + 1);
                        })
                        .catch((error) => {
                          console.error("error =>", error);
                        });
                    };

                    return (
                      <div key={eachLiker._id}>
                        <Stack
                          style={{
                            margin: "5px",
                            padding: "5px",
                          }}
                          direction="horizontal"
                        >
                          <div className="p-0">
                            {" "}
                            {eachLiker.imageUrl.slice(0, 3) !== "../" ? (
                              <>
                                <Link
                                  to={`/profile/${eachLiker._id}`}
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  <img
                                    width={40}
                                    height={40}
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                    src={eachLiker.imageUrl}
                                    alt=""
                                  />
                                </Link>
                              </>
                            ) : (
                              <>
                                <Link
                                  to={`/profile/${eachLiker._id}`}
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  <img
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                    width="40"
                                    height="40"
                                    src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                    alt=""
                                  />
                                </Link>
                              </>
                            )}
                          </div>
                          <div
                            style={{
                              marginLeft: "10px",
                            }}
                            className="p-0"
                          >
                            <Link
                              className="flex justify-start items-center"
                              to={`/profile/${eachLiker._id}`}
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              <div
                                className="hover-fullname chirp-bold-font"
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "rgb(15, 20, 25)",
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
                                }}
                              >
                                {eachLiker.fullname}
                              </div>
                              {eachLiker.isPrivate && (
                                <div className="ml-[5px] flex">
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
                                </div>
                              )}
                            </Link>
                            {/* Verified Account Icon (Assuming 'verified' is a boolean property) start to check */}
                            {eachLiker.hasSubscription ||
                            (!subscription?.isActive &&
                              subscription?.remainingTimeSubscription &&
                              subscription?.cancelledDate &&
                              subscription?.owner === eachLiker._id) ||
                            remainingTimeSubscriptionsOwnerIds.includes(
                              eachLiker._id
                            ) ? (
                              <span>
                                {/* start to check  */}{" "}
                                <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                                  <svg
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
                            <div
                              className="p-0"
                              style={{
                                position: "relative",
                              }}
                            >
                              {" "}
                              <Link
                                to={`/profile/${eachLiker._id}`}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                <span
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
                                  @{eachLiker.username}{" "}
                                </span>
                              </Link>
                              {allFollowerIds().includes(eachLiker._id) ? (
                                <span
                                  className="chirp-medium-font"
                                  style={{
                                    position: "absolute",
                                    textAlign: "center",
                                    top: "4px",
                                    marginLeft: "4px",
                                    fontSize: font11.fontSize,
                                    lineHeight: font11.lineHeight,
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
                          {/* <div className="p-0 ms-auto">asd</div> */}
                          {/* Following Button start to check */}
                          {eachLiker._id !== userInfo._id ? (
                            <>
                              <Button
                                className=" ms-auto"
                                style={
                                  buttonStyles && eachLiker._id !== userInfo._id
                                    ? buttonStyles
                                    : null
                                }
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() =>
                                  isFollowing
                                    ? openUnfollowModal(eachLiker)
                                    : handleFollow(eachLiker)
                                }
                                variant="dark"
                              >
                                {eachLiker._id !== userInfo._id ? (
                                  <>
                                    {isFollowing
                                      ? isHovered === buttonId
                                        ? "Unfollow"
                                        : "Following"
                                      : "Follow"}
                                  </>
                                ) : null}
                              </Button>
                            </>
                          ) : null}
                          {/* Following Button finish to check */}
                        </Stack>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "32px",
                      // backgroundColor: "blue",
                      width: "60%",
                      margin: "auto",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="chirp-heavy-font"
                      style={{
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        textAlign: "left",
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      No Likes yet
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
                      }}
                    >
                      When someone taps the heart to like this post, it’ll show
                      up here.
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* unfollow modal start to check  */}
      <UnfollowModal
        selectedUser={selectedUser}
        handleUnfollow={handleUnfollow}
        showUnfollowModal={showUnfollowModal}
        handleClose={handleCloseUnfollowModal}
      />
      {/* unfollow modal finish to check  */}
    </>
  );
}

export default PostEngagements;
