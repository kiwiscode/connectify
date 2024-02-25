import { useContext, useEffect, useState } from "react";
import { Modal, Stack, Button, Row } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function PostEngagements({
  detailedPost,
  handleFollowingNotification,
  postDetailPage,
  imagePostDetailPage,
}) {
  const [show, setShow] = useState(false);

  const { userInfo, getToken, socket } = useContext(UserContext);
  const [showLikes, setshowLikes] = useState(true);
  const [showReposts, setshowReposts] = useState(false);
  const [activeTab, setActiveTab] = useState("forYou");

  // const handleShowDetailedPostReposts = () => {
  //   console.log("Show detailed post reposts !");
  // };
  // const handleShowDetailedPostLikes = () => {
  //   console.log("Show detailed post likes !");
  // };

  const handleShowReposts = () => {
    console.log(
      detailedPost.reposted ? detailedPost.reposted : "No reposts yet"
    );
    // handleShowDetailedPostReposts();
    setActiveTab("reposts");
    setshowReposts(true);
    setshowLikes(false);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setActiveTab("reposts");
    handleShowReposts();
    setshowReposts(true);
    setShow(true);
  };

  const navigate = useNavigate();

  const handleShowLikes = () => {
    console.log(detailedPost.likes ? detailedPost.likes : "No likes yet");
    // handleShowDetailedPostLikes();
    setActiveTab("likes");
    setshowReposts(false);
    setshowLikes(true);
  };

  const redirectSpesificProfilePage = (userId) => {
    navigate(`/profile/${userId}`);
    window.location.reload();
  };

  const [isHovered, setIsHovered] = useState(false);

  const [hoveredTab, setHoveredTab] = useState(null);
  const getTabStyle = (tab) => {
    return {
      // textDecoration: activeTab === tab ? "underline" : "none",
      // background: hoveredTab === tab ? "purple" : "none",
      color: activeTab === tab ? "rgb(29, 155, 240" : "rgb(83,100,113)",
      fontWeight: activeTab === tab ? "700" : "400",
      lineHeight: "20px",
      fontSize: "15px",
      cursor: "pointer",
      flex: 1,
      textAlign: "center",
      transition: "background 0.3s", // Hover efekti için geçiş efekti
    };
  };
  const handleHover = (tab) => {
    setHoveredTab(tab);
  };

  const handleLeave = () => {
    setHoveredTab(null);
  };

  const checkMap = detailedPost.reposted
    ? detailedPost.reposted.map((eachReposter) => {
        return eachReposter.fullname;
      })
    : null;

  console.log(checkMap);

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
        console.log("Response for active user =>", response);

        setFollowers(response.data.user.followers);
        setFollowings(response.data.user.following);
        console.log("Current followers array state =>", followers);
      })
      .catch((error) => {
        console.log("Error =>", error);
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

  const openUnfollowModal = (selectedUser) => {
    setSelectedUser(selectedUser);
    setIsHovered(false);
    setshowUnfollowModal(true);

    console.log("Current hovered value =>", isHovered);
  };

  const handleCloseUnfollowModal = () => setshowUnfollowModal(false);

  // // socket io 5 client start to check
  // const handleNotification = (selectedUser, userInfo, type) => {
  //   console.log("Sending notification to => ", selectedUser.username);

  //   socket.emit("sendNotification", {
  //     senderName: userInfo.username,
  //     receiverName: selectedUser.username,
  //     type: type,
  //     contactHasBeenMade: userInfo,
  //     senderInfo: userInfo,
  //   });
  // };
  // // socket io 5 client finish to check

  const handleUnfollow = (unfollowedUser) => {
    console.log("Clicked user =>", unfollowedUser);
    console.log("Clicked unfollowed user id =>", unfollowedUser._id);
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
      .then((res) => {
        console.log("Res =>", res);
        getActiveUser();
        setClicked(!clicked);
        setIsHovered(false);
        handleCloseUnfollowModal();
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  console.log("All follower ids =>", allFollowerIds());
  console.log("All following ids => ", allFollowingIds());
  console.log("Detailed post id =>", detailedPost._id);
  return (
    <>
      {/* view post engagements section start to check */}

      <Stack
        onClick={handleShow}
        className="view-post-engagements-section transition-gray-hover"
        direction="horizontal"
        style={{
          cursor: "pointer",
          justifyContent: "left",
        }}
        gap={0}
      >
        <div className="p-2">
          {detailedPost.userId ? (
            detailedPost.userId._id === userInfo._id ? (
              <>
                <svg
                  style={{
                    paddingRight: "4px",
                    color: "rgba(83,100,113,1.00)",
                  }}
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1hvjb8t"
                  fill="currentColor"
                >
                  <g>
                    <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
                  </g>
                </svg>

                <span
                  className="p-0"
                  style={{
                    position: "relative",
                    top: "1px",
                    fontSize: "15px",
                    lineHeight: "20px",
                    fontWeight: "400",
                    color: "rgba(83,100,113,1.00)",
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
      <div
        style={{
          borderBottom: postDetailPage ? "1px solid rgba(0,0,0,0.1)" : null,
        }}
      ></div>
      <Modal
        show={show}
        onHide={handleClose}
        centered="true"
        contentClassName="extra-css-engage-modal"
      >
        <Modal.Header
          style={{
            border: "none",
          }}
        >
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
        </Modal.Header>
        {/* <Modal.Body> */}
        <div
          style={{
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            padding: "16px 0px 16px 0px",
          }}
        >
          <span
            onMouseEnter={() => handleHover("reposts")}
            onMouseLeave={handleLeave}
            onClick={() => handleShowReposts()}
            style={getTabStyle("reposts")}
          >
            Reposts
          </span>
          <span
            onMouseEnter={() => handleHover("likes")}
            onMouseLeave={handleLeave}
            onClick={() => handleShowLikes()}
            style={getTabStyle("likes")}
          >
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

                    const handleFollow = (clickedUser) => {
                      console.log("Clicked user =>", clickedUser);
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
                          handleFollowingNotification(
                            clickedUser,
                            userInfo,
                            "followed"
                          );
                          console.log("sELECTED uSer =>", selectedUser);

                          setIsHovered(false);
                          console.log("Is still following 3 =>", isFollowing);

                          console.log(
                            "Is following current after handle follow =>",
                            isFollowing
                          );
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    };

                    return (
                      <>
                        {" "}
                        <div key={index}>
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
                                    onClick={() =>
                                      redirectSpesificProfilePage(
                                        eachReposter._id
                                      )
                                    }
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
                                    onClick={() =>
                                      redirectSpesificProfilePage(
                                        eachReposter._id
                                      )
                                    }
                                    to={`/profile/${eachReposter._id}`}
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
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
                                onClick={() =>
                                  redirectSpesificProfilePage(eachReposter._id)
                                }
                                to={`/profile/${eachReposter._id}`}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                <span
                                  className="hover-fullname"
                                  style={{
                                    color: "rgb(15, 20, 25)",

                                    fontSize: "15px",
                                    fontWeight: "700",
                                    lineHeight: "20px",
                                  }}
                                >
                                  {eachReposter.fullname}
                                </span>
                                {/* Verified Account Icon (Assuming 'verified' is a boolean property) start to check */}
                                <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                                  <svg
                                    style={{
                                      position: "relative",
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
                              </Link>
                              <div
                                className="p-0"
                                style={{
                                  position: "relative",
                                }}
                              >
                                {" "}
                                <Link
                                  onClick={() =>
                                    redirectSpesificProfilePage(
                                      eachReposter._id
                                    )
                                  }
                                  to={`/profile/${eachReposter._id}`}
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "rgb(83, 100, 113)",
                                      fontSize: "15px",
                                      lineHeight: "20px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    @{eachReposter.username}{" "}
                                  </span>
                                </Link>
                                {allFollowerIds().includes(eachReposter._id) ? (
                                  <span
                                    style={{
                                      position: "absolute",
                                      textAlign: "center",
                                      top: "4px",
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

                            {/* Following Button start to check */}
                            <div
                              className="follow-following-section-spesific-profile ms-auto"
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
                            >
                              {eachReposter._id !== userInfo._id ? (
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
                          </Stack>
                        </div>
                      </>
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
                      style={{
                        lineHeight: "36px",
                        fontSize: "31px",
                        fontWeight: "800",
                        textAlign: "left",
                      }}
                    >
                      No reposts yet
                    </div>
                    <div
                      style={{
                        color: "rgb(83, 100, 113)",
                        lineHeight: "20px",
                        fontSize: "15px",
                        fontWeight: "400",
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

                    const handleFollow = (clickedUser) => {
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
                          handleFollowingNotification(
                            clickedUser,
                            userInfo,
                            "followed"
                          );
                          console.log("sELECTED uSer =>", selectedUser);

                          setIsHovered(false);
                          console.log("Is still following 3 =>", isFollowing);

                          console.log(
                            "Is following current after handle follow =>",
                            isFollowing
                          );
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    };

                    return (
                      <>
                        {" "}
                        <div key={index}>
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
                                    onClick={() =>
                                      redirectSpesificProfilePage(eachLiker._id)
                                    }
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
                                    onClick={() =>
                                      redirectSpesificProfilePage(eachLiker._id)
                                    }
                                    to={`/profile/${eachLiker._id}`}
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
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
                                onClick={() =>
                                  redirectSpesificProfilePage(eachLiker._id)
                                }
                                to={`/profile/${eachLiker._id}`}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                <span
                                  className="hover-fullname"
                                  style={{
                                    color: "rgb(15, 20, 25)",

                                    fontSize: "15px",
                                    fontWeight: "700",
                                    lineHeight: "20px",
                                  }}
                                >
                                  {eachLiker.fullname}
                                </span>
                              </Link>
                              {/* Verified Account Icon (Assuming 'verified' is a boolean property) start to check */}
                              <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                                <svg
                                  style={{
                                    position: "relative",
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
                              <div
                                className="p-0"
                                style={{
                                  position: "relative",
                                }}
                              >
                                {" "}
                                <Link
                                  onClick={() =>
                                    redirectSpesificProfilePage(eachLiker._id)
                                  }
                                  to={`/profile/${eachLiker._id}`}
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "rgb(83, 100, 113)",
                                      fontSize: "15px",
                                      lineHeight: "20px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    @{eachLiker.username}{" "}
                                  </span>
                                </Link>
                                {allFollowerIds().includes(eachLiker._id) ? (
                                  <span
                                    style={{
                                      position: "absolute",
                                      textAlign: "center",
                                      top: "4px",
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
                            {/* <div className="p-0 ms-auto">asd</div> */}
                            {/* Following Button start to check */}
                            <div
                              className="follow-following-section-spesific-profile ms-auto"
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
                            </div>
                            {/* Following Button finish to check */}
                          </Stack>
                        </div>
                      </>
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
                      style={{
                        lineHeight: "36px",
                        fontSize: "31px",
                        fontWeight: "800",
                        textAlign: "left",
                      }}
                    >
                      No Likes yet
                    </div>
                    <div
                      style={{
                        color: "rgb(83, 100, 113)",
                        lineHeight: "20px",
                        fontSize: "15px",
                        fontWeight: "400",
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
      <Modal show={showUnfollowModal} onHide={handleCloseUnfollowModal}>
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
              Unfollow @{selectedUser.username}
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
              Their posts will no longer show up in your Following timeline. You
              can still view their profile, unless their posts are protected.
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
            // onClick={handleUnfollow}
          >
            Unfollow
          </Button>

          <Button
            className="hover-unfollow-cancel"
            style={{ color: "black" }}
            variant="light"
            onClick={handleCloseUnfollowModal}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* unfollow modal finish to check  */}
    </>
  );
}

export default PostEngagements;
