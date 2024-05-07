import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, Stack, Button, Accordion } from "react-bootstrap";
import { CommentModal } from "../components/ui/Modal";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Bounce, ToastContainer, toast } from "react-toastify";
import CustomNotification from "../components/Notifications/CustomNotification";
import { message } from "antd";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
import io from "socket.io-client";
const socket = io.connect(`${API_URL}`);

import LeftSideNavBar from "../components/Main-Left-Side-Navbar/LeftSideNavbar";
import RightSideColumn from "../components/Main-Right-Side-Column/RightSideColumn";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { ThemeContext } from "../context/ThemeContext";
import UnfollowModal from "../components/unfollow-modal/UnfollowModal";
import PostPopover from "../components/three-dots-popover/Popover";
import useWindowDimensions from "../hooks/getWindowDimensions";
import RepostAction from "../components/ui/RepostAction";
import LikeAction from "../components/ui/LikeAction";

function SpesificUserProfile() {
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);

  const { id } = useParams();

  const navigate = useNavigate();

  // const { getToken, userInfo, socket } = useContext(UserContext);

  // use effect to grab current mouse click location start to check

  const [clickedPostBox, setclickedPostBox] = useState(null);
  console.log("Clicked post outside of use effect =>", clickedPostBox);
  useEffect(() => {
    const getClickLocation = (e) => {
      const clickedElementParentClass = e.target.parentNode.className;
      const clickedElementClass = e.target.classList;
      console.log("target details =>", clickedElementParentClass);
      console.log("Target class list =>", e.target.classList);
      if (
        (clickedElementClass.contains("hover-reposted-text") &&
          clickedElementParentClass !== "post-circle-profile-svg-on-point" &&
          clickedElementParentClass !== "post-circle-profile-image-on-point" &&
          clickedElementParentClass !== "post-circle-postowner-fullname" &&
          clickedElementParentClass !== "post-circle-postowner-username" &&
          clickedElementParentClass !== "post-circle-date-post-detail" &&
          clickedElementParentClass !== "svg-three-dots-post-detail" &&
          clickedElementParentClass === "p-1 next-to-comment") ||
        clickedElementParentClass === "p-1 next-to-repost" ||
        clickedElementParentClass === "p-1 next-to-like" ||
        clickedElementParentClass === "parent-footer-stack" ||
        clickedElementParentClass ===
          "posts-details outside-of-inner-circle-actions" ||
        clickedElementParentClass ===
          "outside-of-inner-circle-action-comment-text vstack gap-1" ||
        clickedElementParentClass === "p-2 parent-comment-text" ||
        clickedElementParentClass ===
          "outside-of-inner-circle-post-info-user-info-svg-three-dots hstack gap-1" ||
        clickedElementParentClass === "mt-0 parent-footer-stack hstack" ||
        clickedElementClass.contains("repost-svg-post-box") ||
        clickedElementParentClass === "post-head" ||
        clickedElementClass.contains("each-post") ||
        clickedElementClass.contains("border-extra") ||
        clickedElementParentClass === "each-post"
      ) {
        console.log("Clicked post box inside of use effect =>", clickedPostBox);
        console.log(
          "You clicked outside of any actions inside clicked post box"
        );
        if (clickedPostBox) {
          navigate(
            `/½${clickedPostBox.userId.username}/status/${
              !clickedPostBox.isReposted
                ? clickedPostBox._id
                : clickedPostBox.repostedFromThisOriginalPost[0]._id
            }`
          );
        }
      }
    };

    document.body.addEventListener("click", getClickLocation);

    return () => {
      document.body.removeEventListener("click", getClickLocation);
    };
  }, [clickedPostBox]);

  // use effect to grab current mouse click location finish to check
  const { getToken, userInfo } = useContext(UserContext);
  const [profileInfo, setProfileInfo] = useState({});
  const [profileInfoPosts, setprofileInfoPosts] = useState([]);
  const [favoriteWindow, setFavoriteWindow] = useState("hide");
  const [postsWindow, setPostWindow] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [postId, setpostId] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState("hide");
  const [isLoading, setIsLoading] = useState(false);

  // socket io 1 client start to check
  const [notificationTest, setnotificationTest] = useState([]);
  const [notificationText, setnotificationText] = useState([]);
  // socket io 1 client finish to check

  // follow unfollow logic start to check
  const [isHovered, setIsHovered] = useState(false);
  const [showUnfollowModal, setshowUnfollowModal] = useState(false);

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
                fontWeight: "700",
                fontSize: "15px",
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

  const getFollowerIds = (array) => {
    return array.map((eachFollower) => {
      return eachFollower._id;
    });
  };

  const getFollowingIds = (array) => {
    if (array) {
      return array.map((eachFollowing) => {
        return eachFollowing._id;
      });
    }
  };

  const handleClose = () => setshowUnfollowModal(false);
  const handleShow = () => setshowUnfollowModal(true);
  // follow unfollow logic finish to check

  const handleUnfollow = () => {
    if (getFollowerIds(profileInfo.followers).includes(userInfo._id)) {
      axios
        .post(
          `${API_URL}/unfollow
          `,
          {
            activeUserId: userInfo._id,
            theUnfollowedUserID: profileInfo._id,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
        .then(() => {
          setTimeout(() => {
            // start to check animation basic
            if (postsWindow === "hide") {
              setShow("");
              handleShowSpesificUserProfilePageFavorites();
            } else if (favoriteWindow === "hide") {
              setShow("");
              handleShowSpesificUserProfilePagePosts();
            }
            // finish to check animation basic

            setProfileInfo((prevProfileInfo) => {
              if (Array.isArray(prevProfileInfo.followers)) {
                const updatedFollowers = prevProfileInfo.followers.filter(
                  (id) => id !== userInfo._id
                );

                return {
                  ...prevProfileInfo,
                  followers: updatedFollowers,
                };
              }

              return prevProfileInfo;
            });
            handleClose();
          }, 500);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // socket io 4 client start to check
  useEffect(() => {
    socket.on("socket_id_for_user", (socketId) => {
      console.log("socket id received from backend =>", socketId);

      localStorage.setItem("socketId", socketId);
    });

    socket.emit("setUsername", userInfo.username);
  }, []);
  // socket io 4 client finish to check

  useEffect(() => {
    socket.on("getNotification", (data) => {
      console.log("Data =>", data);
      if (data.senderName !== userInfo.username) {
        setnotificationTest((prev) => [...prev, data]);
      } else {
        console.log("Kendine notification mu göndericeksin ? ");
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

  // socket io 5 client start to check
  const handleNotification = (post, userInfo, type) => {
    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: post.userId
        ? post.userId.username
        : post.username
        ? post.username
        : null,
      type: type,
      contactHasBeenMade: post,
      senderInfo: userInfo,
    });
  };
  // socket io 5 client finish to check

  const handleFollow = () => {
    console.log("Button clicked !");
    if (getFollowerIds(profileInfo.followers).includes(userInfo._id)) {
      handleShow();
    } else {
      axios
        .post(
          `${API_URL}/follow`,
          {
            activeUserId: userInfo._id,
            theFollowedUserID: profileInfo._id,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
        .then(() => {
          handleNotification(profileInfo, userInfo, "followed");

          setTimeout(() => {
            // start to check animation basic
            if (postsWindow === "hide") {
              setShow("");
              handleShowSpesificUserProfilePageFavorites();
            } else if (favoriteWindow === "hide") {
              setShow("");
              handleShowSpesificUserProfilePagePosts();
            }
            // finish to check animation basic

            setProfileInfo((prevProfileInfo) => {
              if (Array.isArray(prevProfileInfo.followers)) {
                const updatedFollowers = [
                  ...prevProfileInfo.followers,
                  userInfo._id,
                ];

                return {
                  ...prevProfileInfo,
                  followers: updatedFollowers,
                };
              }

              return prevProfileInfo;
            });
          }, 500);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // start to check
  // NOTE must sorted
  const handleShowSpesificUserProfilePagePosts = () => {
    axios
      .get(`${API_URL}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log(
          "After opening spesific user profile page response =>",
          response
        );

        setprofileInfoPosts(response.data.posts);
        setPostWindow("");
        setFavoriteWindow("hide");
        setProfileInfo(response.data);
      })

      .catch((err) => {
        return err;
      });
  };

  console.log("Show profile info posts =>", profileInfoPosts);

  const handleShowSpesificUserProfilePageFavorites = () => {
    axios
      .get(`${API_URL}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFavoriteWindow("");
        setPostWindow("hide");
        setFavorites(response.data.favorites);
        setProfileInfo(response.data);
      })
      .catch((err) => {
        return err;
      });
  };

  console.log("User rendered favorites =>", favorites);

  const checkIfAllFavoritesFromDeactivatedUser = () => {
    return favorites.map((eachFavorite) => {
      return eachFavorite.deactivatedOwner;
    });
  };

  console.log("Favorites inside spesific user profile favorites =>", favorites);

  const hasFalse = checkIfAllFavoritesFromDeactivatedUser().some(
    (item) => item === false
  );

  console.log(hasFalse);

  const getRepostedIds = (array) => {
    return array.reposted.map((eachRepost) => {
      return eachRepost._id;
    });
  };

  useEffect(() => {
    if (postsWindow === "hide") {
      setShow("");
      handleShowSpesificUserProfilePageFavorites();
    } else if (favoriteWindow === "hide") {
      setShow("");
      handleShowSpesificUserProfilePagePosts();
    }
  }, [id]);

  // finish to check
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthsProfile = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getCreatedYearForSpesificUserProfilePage = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${monthsProfile[getMonth]} ${createdAt.getFullYear()}`;
  };

  const getCreatedDateForSpesificUserProfilePage = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

  const handleDeleteLikeFromSpesificUserProfilePage = (postId) => {
    axios
      .post(
        `${API_URL}/favorite/delete-favorite`,
        {
          userId: userInfo._id,
          postId,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )

      .then(() => {
        if (favoriteWindow === "") {
          setTimeout(() => {
            handleShowSpesificUserProfilePageFavorites();
          }, 500);
        } else if (postsWindow === "") {
          setTimeout(() => {
            handleShowSpesificUserProfilePagePosts();
          }, 500);
        }
        setError("");
      })
      .catch((error) => {
        if (error) {
          const { errorMessage } = error.response.data;

          setError(errorMessage);
        }
      });
  };

  const handlePostLikesFromSpesificUserProfilePage = (postId, findedPost) => {
    setpostId(postId);

    axios
      .post(
        `${API_URL}/favorite`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        if (favoriteWindow === "") {
          setTimeout(() => {
            handleShowSpesificUserProfilePageFavorites();
            handleNotification(findedPost, userInfo, "liked");
            setError("");
          }, 500);
        } else if (postsWindow === "") {
          setTimeout(() => {
            handleShowSpesificUserProfilePagePosts();
            handleNotification(findedPost, userInfo, "liked");
            setError("");
          }, 500);
        }
        setError("");
      })
      .catch((error) => {
        if (error) {
          const { errorMessage } = error.response.data;

          setError(errorMessage);
        }
      });
  };

  const postDeletedMessage = () => {
    messageApi.success({
      type: "success",
      content: <div>Your post was deleted</div>,
      duration: 6,
      className: "custom-message-style",
    });
  };

  const handleDeletePostFromSpesificUserProfilePage = () => {
    if (favoriteWindow === "") {
      handleShowSpesificUserProfilePageFavorites();
      postDeletedMessage();
    } else if (postsWindow === "") {
      handleShowSpesificUserProfilePagePosts();
      postDeletedMessage();
    }
    setError("");
  };

  const handleRepost = (postId, findedPost) => {
    axios
      .post(
        `${API_URL}/repost`,
        { postId: postId, userId: userInfo._id },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        if (favoriteWindow === "") {
          console.log("1 WORKS");
          setTimeout(() => {
            handleShowSpesificUserProfilePageFavorites();
            handleNotification(findedPost, userInfo, "repost");
          }, 500);

          // finish to check
        } else if (postsWindow === "") {
          console.log("2 WORKS");
          setTimeout(() => {
            handleShowSpesificUserProfilePagePosts();
            handleNotification(findedPost, userInfo, "repost");
          }, 500);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };
  const handleDeleteRepostSpesificProfilePage = (postId) => {
    axios
      .post(
        `${API_URL}/repost/delete`,
        { userId: userInfo._id, postId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        if (postsWindow === "hide") {
          console.log("1 WORKS");
          setTimeout(() => {
            handleShowSpesificUserProfilePageFavorites();
          }, 500);
        }
        if (favoriteWindow === "hide") {
          console.log("2 WORKS");
          setTimeout(() => {
            handleShowSpesificUserProfilePagePosts();
          }, 500);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const setLoadingTrue = () => {
    setIsLoading(true);
  };

  const setLoadingFalse = () => {
    setIsLoading(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const [visibleTweets, setVisibleTweets] = useState(25);
  const [visibleLikedTweets, setvisibleLikedTweets] = useState(25);
  const handleShowMorePosts = () => {
    setVisibleTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

  const handleShowMoreLikedTweets = () => {
    setvisibleLikedTweets((prevVisibleTweets) => prevVisibleTweets + 25);
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

  const [room, setRoom] = useState("");
  const [messageRoomId, setmessageRoomId] = useState("");

  const selectedUser = (user) => {
    const room = [userInfo.username, user.username].sort().join("_");
    console.log("message room =>", room);
    setRoom(room);
    // Emit an event to join the room with the selected user
    socket.emit("join_user_room", { activeUser: userInfo, selectedUser: user });
    const handleGetMessageRoomId = (roomId) => {
      setmessageRoomId(roomId);
    };
    console.log("Message room id =>", messageRoomId);
    socket.on("getmessageRoomId", handleGetMessageRoomId);
  };

  useEffect(() => {
    console.log("This line is working !!!");
    if (messageRoomId) {
      window.location.href = `http://localhost:5173/messages/${messageRoomId}`;
    }
  }, [messageRoomId]);

  const checkSpesificUserFollowers = () => {
    return profileInfo?.followers?.map((eachFollowerUser) => {
      return eachFollowerUser._id;
    });
  };

  const isFollowing = checkSpesificUserFollowers()?.includes(userInfo._id);

  console.log("profile info =>", checkSpesificUserFollowers());

  const { height, width } = useWindowDimensions();
  const [postModalOpenedFromLeftSide, setPostModalOpenedFromLeftSide] =
    useState(false);

  const handleCallBackForModalOpenedStateFromChild = (childData) => {
    console.log("Child data received from child => ", childData);
    setPostModalOpenedFromLeftSide(childData);
  };
  return (
    <>
      {contextHolder}
      <ToastContainer theme={themeName === "dark-theme" ? "dark" : "light"} />
      {!postModalOpenedFromLeftSide && (
        <ResponsiveNavigationBarBottom
          refreshPosts={() => handleShowSpesificUserProfilePagePosts()}
          setLoadingTrue={() => setLoadingTrue()}
          setLoadingFalse={() => setLoadingFalse()}
        />
      )}

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
          <LeftSideNavBar
            refreshPosts={() => handleShowSpesificUserProfilePagePosts()}
            setLoadingTrue={() => setLoadingTrue()}
            setLoadingFalse={() => setLoadingFalse()}
            parentCallBack={handleCallback}
            parentCallBackSecond={handleCallBackForModalOpenedStateFromChild}
          />

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
            }}
          >
            {/* unfollow modal start to check  */}
            <UnfollowModal
              selectedUser={profileInfo}
              handleUnfollow={handleUnfollow}
              showUnfollowModal={showUnfollowModal}
              handleClose={handleClose}
            />
            {/* unfollow modal finish to check  */}

            <Container>
              <Row>
                <Stack direction="horizontal" gap={0}>
                  <div
                    onClick={handleGoBack}
                    // className="p-2 arrow"
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
                  <div
                    className="p-2"
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      height: "100px",
                    }}
                  >
                    <div>{profileInfo.username}</div>
                    {profileInfo.posts && (
                      <div
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                        }}
                        className="profile-paragraph"
                      >
                        {profileInfo.posts.length} posts
                      </div>
                    )}
                  </div>
                </Stack>
                {/* start to check stack on the way  */}
                <Stack
                  direction="horizontal"
                  gap={3}
                  style={{ marginTop: "45px" }}
                >
                  {profileInfo.imageUrl && (
                    <div className="p-2">
                      {profileInfo.imageUrl.slice(0, 3) !== "../" ? (
                        <div>
                          <img
                            width={133}
                            height={133}
                            src={profileInfo.imageUrl}
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
                            width="133"
                            height="133"
                            fill={
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)"
                            }
                            className="bi bi-person-circle"
                            viewBox="0 0 16 16"
                            style={{ cursor: "pointer", borderRadius: "50%" }}
                            onClick={() =>
                              document.getElementById("formuploadModal").click()
                            }
                          >
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}

                  {profileInfo._id !== userInfo._id ? (
                    <div
                      style={{
                        // backgroundColor: "yellow",
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        gap: "2%",
                      }}
                      className="p-2 ms-auto"
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border:
                            themeName !== "dark-theme"
                              ? "1px solid rgb(185, 202, 211)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                        }}
                        className={`spesific-profile-svg-three-dots spesific-profile-svg-three-dots-${themeName}`}
                      >
                        <svg
                          color={themeName === "dark-theme" ? "white" : ""}
                          fill="currentColor"
                          width={20}
                          height={20}
                          style={{}}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                        >
                          <g>
                            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                          </g>
                        </svg>
                      </div>
                      {/* start to check redirect to the messages  */}
                      <div
                        onClick={() => selectedUser(profileInfo)}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border:
                            themeName !== "dark-theme"
                              ? "1px solid rgb(185, 202, 211)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                        }}
                        className={`spesific-profile-svg-dm spesific-profile-svg-dm-${themeName}`}
                      >
                        <svg
                          style={{}}
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                          color="color: rgb(15, 20, 25)"
                          fill="currentColor"
                        >
                          <g>
                            <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                          </g>
                        </svg>
                      </div>
                      {/* finish to check redirect to the messages  */}
                      <Button
                        // buttonStyles
                        onClick={handleFollow}
                        onMouseEnter={
                          profileInfo.followers
                            ? !getFollowerIds(profileInfo.followers).includes(
                                userInfo._id
                              )
                              ? null
                              : handleMouseEnter
                            : null
                        }
                        onMouseLeave={handleMouseLeave}
                        style={{
                          transitionDuration: "0.2s",
                          fontSize: "15px",
                          lineHeight: "20px",
                          fontWeight: "700",
                          display: "inline",
                          maxWidth: "107px",

                          border:
                            isHovered &&
                            isFollowing &&
                            themeName !== "dark-theme"
                              ? "1px solid rgba(253,201,206,255)"
                              : isHovered &&
                                isFollowing &&
                                themeName === "dark-theme"
                              ? "1px solid #e71f2c"
                              : isFollowing && themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : "1px solid rgb(70, 70, 70)",
                          backgroundColor:
                            !isFollowing && themeName === "dark-theme"
                              ? "white"
                              : isHovered &&
                                isFollowing &&
                                themeName !== "dark-theme"
                              ? "rgba(255,234,235,255)"
                              : isHovered &&
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
                              : isHovered && isFollowing
                              ? "rgba(244,34,45,255)"
                              : isFollowing && themeName !== "dark-theme"
                              ? "black"
                              : "white",
                        }}
                        variant="dark"
                      >
                        {profileInfo.followers
                          ? getFollowerIds(profileInfo.followers).includes(
                              userInfo._id
                            )
                            ? isHovered
                              ? "Unfollow"
                              : "Following"
                            : "Follow"
                          : null}
                      </Button>
                    </div>
                  ) : null}
                </Stack>

                <div style={{ lineHeight: "30px", marginBottom: "20px" }}>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      marginTop: "50px",
                    }}
                  >
                    {profileInfo.username}
                  </div>
                  <div
                    style={{
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  >
                    @{profileInfo.username}
                    {""}
                    {""}
                    {profileInfo._id !== userInfo._id ? (
                      <>
                        {getFollowingIds(profileInfo?.following)?.includes(
                          userInfo._id
                        ) ? (
                          <>
                            <span
                              style={{
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#202327"
                                    : "rgba(239,243,244,1.00)",
                                // getFollowingIds(
                                //   profileInfo.following
                                // )
                                //   ? getFollowingIds(
                                //       profileInfo.following
                                //     ).includes(userInfo._id) &&
                                //     themeName === "dark-theme"
                                //     ? "#202327"
                                //     : themeName === "dark-theme"
                                //     ? "black"
                                //     : themeName === "light-theme"
                                //     ? "white"
                                //     : null
                                //   : null,
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",

                                marginLeft: "4px",
                                fontWeight: "500",
                                lineHeight: "12px",
                                fontSize: "11px",
                                paddingLeft: "4px",
                                paddingRight: "4px",
                                paddingBottom: "2px",
                                paddingTop: "2px",
                                borderRadius: "3px",
                              }}
                            >
                              {getFollowingIds(profileInfo.following)
                                ? getFollowingIds(
                                    profileInfo.following
                                  ).includes(userInfo._id)
                                  ? "Follows you"
                                  : null
                                : null}
                            </span>
                          </>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-calendar4-week"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="black"
                        strokeWidth="0.5"
                        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z"
                      />
                      <path
                        stroke="black"
                        strokeWidth="0.5"
                        d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"
                      />
                    </svg>{" "}
                    Joined{" "}
                    {getCreatedYearForSpesificUserProfilePage(
                      profileInfo.createdAt
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "3%",
                    }}
                  >
                    <Link
                      to={`/profile/${userInfo._id}/following`}
                      style={{
                        textDecoration: "none",
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                      className="following-followers-link"
                    >
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "700",
                        }}
                      >
                        {profileInfo.following && (
                          <span>{profileInfo.following.length}</span>
                        )}
                      </span>{" "}
                      <span
                        style={{
                          cursor: "pointer",
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        Following
                      </span>{" "}
                    </Link>
                    <Link
                      to={`/profile/${userInfo._id}/following`}
                      style={{
                        textDecoration: "none",
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                      className="following-followers-link"
                    >
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "700",
                        }}
                      >
                        {profileInfo.followers && (
                          <span>{profileInfo.followers.length}</span>
                        )}
                      </span>{" "}
                      <span
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        <span>
                          {profileInfo.followers
                            ? profileInfo.followers.length > 1
                              ? "Followers"
                              : profileInfo.followers.length === 0
                              ? "Followers"
                              : "Follower"
                            : null}
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </Row>
            </Container>
            {/* finish to check responsive error container  */}
            {/* start */}
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
              aria-label="Basic example"
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                height: "40px",
              }}
            >
              {/* NOTE */}
              <div
                onClick={() => handleShowSpesificUserProfilePagePosts()}
                style={{
                  cursor: "pointer",
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRight:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : "1px solid rgb(70, 70, 70)",
                }}
              >
                <div
                  style={{
                    border: "none",
                  }}
                >
                  {favoriteWindow === "" ? (
                    <span
                      style={{
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      Posts
                    </span>
                  ) : (
                    <span
                      style={{
                        fontWeight: "700",
                        color:
                          themeName === "dark-theme"
                            ? "white"
                            : "rgb(29, 155, 240)",
                      }}
                    >
                      Posts
                    </span>
                  )}
                </div>
              </div>

              <div
                onClick={() => handleShowSpesificUserProfilePageFavorites()}
                style={{
                  cursor: "pointer",
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    border: "none",
                  }}
                >
                  {postsWindow === "" ? (
                    <span
                      style={{
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      Likes
                    </span>
                  ) : (
                    <span
                      style={{
                        fontWeight: "700",
                        color:
                          themeName === "dark-theme"
                            ? "white"
                            : "rgb(29, 155, 240)",
                      }}
                    >
                      Likes
                    </span>
                  )}
                </div>
              </div>
            </div>
            {postsWindow || favoriteWindow ? (
              <div
                style={{
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
              ></div>
            ) : null}
            <span>
              {isLoading &&
              userInfo._id === profileInfo._id &&
              favoriteWindow === "hide" ? (
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              ) : (
                ""
              )}
            </span>

            {/* finish */}
            {/* start to check */}
            <div
              style={{
                height:
                  width <= 700 && profileInfoPosts.length < 2 ? "30vh" : "",
              }}
              className={`all-posts ${postsWindow}`}
            >
              {profileInfoPosts.length ? (
                <>
                  {profileInfoPosts.slice(0, visibleTweets).map((post) => (
                    <div
                      onClick={() => {
                        console.log("Post box parent class =>", post);
                        setclickedPostBox(post);
                      }}
                      className={
                        themeName === "dark-theme"
                          ? `each-post-${themeName}`
                          : "each-post"
                      }
                      key={post._id}
                    >
                      {post.deactivatedOwner ? null : (
                        <>
                          <div
                            style={{
                              textDecoration: "none",
                            }}
                            onClick={() => {
                              setclickedPostBox(post);
                            }}
                            className="posts-details outside-of-inner-circle-actions"
                          >
                            <div className="post-head">
                              {post.isReposted &&
                              userInfo._id === profileInfo._id ? (
                                <div
                                  className={`${show} you-reposted-head`}
                                  style={{
                                    cursor: "pointer",
                                    position: "relative",
                                    left: "6px",
                                  }}
                                >
                                  <svg
                                    style={{
                                      color: "rgb(83, 100, 113)",
                                      marginLeft: "20px",
                                    }}
                                    width={`16px`}
                                    height={`16px`}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="repost-svg-post-box svg-repost-post box svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                    fill={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)"
                                    }
                                  >
                                    <g>
                                      <path
                                        stroke="rgb(83, 100, 113)"
                                        strokeWidth="0.1"
                                        d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                                      ></path>
                                    </g>
                                  </svg>
                                  <Link
                                    className={`hover-reposted-text hover-reposted-text-${themeName}`}
                                    style={{
                                      fontSize: "13px",
                                      lineHeight: "16px",
                                      fontWeight: "700",
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      marginLeft: "10px",
                                      cursor: "pointer",
                                      textDecoration: "none",
                                    }}
                                    onClick={() => setclickedPostBox(post)}
                                    to={`/profile/${post.reposted[0]._id}`}
                                  >
                                    You reposted
                                  </Link>{" "}
                                </div>
                              ) : null}
                              {/* start to check */}
                              {post.isReposted &&
                              userInfo._id !== profileInfo._id ? (
                                <div
                                  style={{
                                    cursor: "pointer",
                                  }}
                                >
                                  <svg
                                    style={{
                                      marginLeft: "20px",
                                      position: "relative",
                                      top: "5px",
                                      left: "20px",
                                    }}
                                    width={`16px`}
                                    height={`16px`}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="repost-svg-post-box svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                    fill={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)"
                                    }
                                  >
                                    <g>
                                      <path
                                        stroke="rgb(83, 100, 113)"
                                        strokeWidth="0.1"
                                        d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                                      ></path>
                                    </g>
                                  </svg>
                                  <Link
                                    className={`hover-reposted-text hover-reposted-text-${themeName}`}
                                    style={{
                                      fontSize: "13px",
                                      lineHeight: "16px",
                                      fontWeight: "700",
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      marginLeft: "10px",
                                      cursor: "pointer",
                                      textDecoration: "none",
                                      position: "relative",
                                      top: "5px",
                                      left: "15px",
                                    }}
                                    onClick={() => setclickedPostBox(post)}
                                    to={`/profile/${post.reposted[0]._id}`}
                                  >
                                    {profileInfo.fullname} reposted
                                  </Link>{" "}
                                </div>
                              ) : null}
                              {/* finish to check */}
                            </div>
                            <Stack
                              style={{
                                cursor: "pointer",
                              }}
                              to={`/${post.userId.username}/status/${
                                !post.isReposted
                                  ? post._id
                                  : post.repostedFromThisOriginalPost[0]._id
                              }`}
                              onClick={() => setclickedPostBox(post)}
                              className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                              direction="horizontal"
                              gap={1}
                            >
                              {/* profile image start to check */}

                              <div className="p-1">
                                {post.userId.imageUrl.slice(0, 3) !== "../" ? (
                                  <Link
                                    className="post-circle-profile-image-on-point"
                                    style={{ cursor: "pointer" }}
                                    to={`/profile/${
                                      post ? post.userId._id : null
                                    }`}
                                  >
                                    <img
                                      width={40}
                                      height={40}
                                      src={post.userId.imageUrl}
                                      alt=""
                                      style={{
                                        borderRadius: "50%",
                                      }}
                                    />
                                  </Link>
                                ) : (
                                  <Link
                                    className="post-circle-profile-svg-on-point"
                                    to={`/profile/${
                                      post.userId ? post.userId._id : null
                                    }`}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {" "}
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
                                )}
                              </div>

                              {/* profile image finish to check  */}

                              {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                              <div className="p-1">
                                {post.userId ? (
                                  <>
                                    <Link
                                      className="post-circle-postowner-fullname"
                                      to={`/profile/${post.userId._id}`}
                                      style={{
                                        textDecoration: "none",
                                        color: "black",
                                      }}
                                    >
                                      <span
                                        className="hover-fullname"
                                        style={{
                                          fontWeight: "700",
                                          fontSize: "15px",
                                          lineHeight: "20px",
                                          color:
                                            themeName === "dark-theme"
                                              ? "white"
                                              : "",
                                        }}
                                      >
                                        {post.authorFullName}
                                      </span>
                                    </Link>
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
                                          data-testid="icon-verified"
                                          color="rgba(29,155,240,1.00)"
                                          fill="currentColor"
                                        >
                                          <g>
                                            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                          </g>
                                        </svg>
                                      </span>{" "}
                                    </span>
                                    <Link
                                      to={`/profile/${post.userId._id}`}
                                      style={{
                                        textDecoration: "none",
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                        lineHeight: "20px",
                                        fontSize: "15px",
                                        fontWeight: "400",
                                      }}
                                    >
                                      <span className="post-circle-postowner-username">
                                        <span>@{post.authorUserName}</span>
                                      </span>
                                    </Link>
                                    <Link
                                      style={{
                                        textDecoration: "none",
                                      }}
                                      to={`/${post.userId.username}/status/${
                                        !post.isReposted
                                          ? post._id
                                          : post.repostedFromThisOriginalPost[0]
                                              ._id
                                      }`}
                                    >
                                      <span
                                        style={{
                                          color:
                                            themeName === "dark-theme"
                                              ? "#71767A"
                                              : "rgb(83, 100, 113)",
                                          lineHeight: "20px",
                                          fontSize: "15px",
                                          fontWeight: "400",
                                        }}
                                      >
                                        {" "}
                                        ·{" "}
                                        <span className="date-post-detail">
                                          {getCreatedDateForSpesificUserProfilePage(
                                            post.createdAt
                                          )}
                                        </span>
                                      </span>
                                    </Link>
                                    {/* finish to check  */}
                                  </>
                                ) : null}
                              </div>
                              {/* post owner full name + verified account svg + post owner user name + post created date  fi


                        
                        {/* three dots svg start to check */}
                              <div className="p-1 ms-auto">
                                <PostPopover
                                  postDeletionProcess={
                                    handleDeletePostFromSpesificUserProfilePage
                                  }
                                  post={post}
                                />
                              </div>
                              {/* three dots svg finish to check */}
                            </Stack>

                            {/* post content start to check  */}
                            <Stack
                              to={`/${post.userId.username}/status/${
                                !post.isReposted
                                  ? post._id
                                  : post.repostedFromThisOriginalPost[0]._id
                              }`}
                              onClick={() => setclickedPostBox(post)}
                              className="outside-of-inner-circle-action-comment-text"
                              direction="vertical"
                              gap={1}
                            >
                              {post.isComment ? (
                                <div
                                  to={`/${post.userId.username}/status/${
                                    !post.isReposted
                                      ? post._id
                                      : post.repostedFromThisOriginalPost[0]._id
                                  }`}
                                  onClick={() => setclickedPostBox(post)}
                                  className="p-2 parent-comment-text"
                                >
                                  <span
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      fontSize: "15px",
                                      lineHeight: "20px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Replying to {""}
                                  </span>
                                  <Link
                                    to={`/profile/${post.commentedForThisUsersPost._id}`}
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    <span
                                      className="replying-to-text"
                                      style={{
                                        color: "rgb(29, 155, 240)",
                                        cursor: "pointer",
                                        fontSize: "15px",
                                        lineHeight: "20px",
                                        fontWeight: "400",
                                      }}
                                    >
                                      @{post.commentedForThisUsersPost.username}
                                    </span>
                                  </Link>
                                </div>
                              ) : null}
                              <Link
                                style={{
                                  textDecoration: "none",
                                  color: "rgb(15, 20, 25)",
                                }}
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]._id
                                }`}
                              >
                                <div
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    lineHeight: "20px",
                                    overflowWrap: "break-word",
                                    maxWidth: "100%",
                                    cursor: "pointer",
                                    color:
                                      themeName === "dark-theme" ? "white" : "",
                                  }}
                                  className="p-2"
                                >
                                  {post.content}
                                </div>
                              </Link>
                            </Stack>
                            {/* post content finish to check  */}

                            {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}

                            {post.image.url !== "image@url" ? (
                              <>
                                <Link
                                  to={`/${post.userId.username}/status/${
                                    !post.isReposted
                                      ? post._id
                                      : post.repostedFromThisOriginalPost[0]._id
                                  }/photo/${1}`}
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  <div
                                    style={{
                                      overflow: "hidden",
                                      border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
                                      borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
                                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
                                    }}
                                  >
                                    <img
                                      src={post.image.url}
                                      alt="Description"
                                      style={{
                                        width: "100%",
                                        display: "block",
                                      }}
                                    />
                                  </div>
                                </Link>
                              </>
                            ) : null}
                            {/* finish to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}

                            {/* new version favorite repost comment start to check */}
                            <Stack
                              className="mt-0"
                              direction="horizontal"
                              style={{
                                justifyContent: "space-between",
                                margin: "5px 0px 5px 0px",
                              }}
                            >
                              <div
                                onClick={() => setclickedPostBox(post)}
                                className="p-1 next-to-comment"
                              >
                                <CommentModal
                                  post={post}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={
                                    handleShowSpesificUserProfilePagePosts
                                  }
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                  postSharedMessage={postSharedMessage}
                                />
                              </div>

                              {/* start to check */}
                              <div
                                style={{
                                  width: "100px",
                                }}
                                className="p-1"
                              >
                                <RepostAction
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={
                                    handleShowSpesificUserProfilePagePosts
                                  }
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                />
                              </div>

                              {/* finish to check  */}
                              <div
                                style={{
                                  width: "100px",
                                }}
                                className="p-1"
                              >
                                <LikeAction
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={
                                    handleShowSpesificUserProfilePagePosts
                                  }
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                />
                              </div>
                            </Stack>
                            {/* new version favorite repost comment finish to check */}
                          </div>
                          <div
                            onClick={() => {
                              console.log("Post box child class =>", post);
                              setclickedPostBox(post);
                            }}
                            className="border-extra"
                            style={{
                              borderBottom:
                                themeName !== "dark-theme"
                                  ? "1px solid rgba(0, 0, 0, 0.1)"
                                  : // : "0.1px solid rgb(70, 70, 70)",
                                    "1px solid rgb(70, 70, 70)",
                            }}
                          ></div>
                        </>
                      )}
                    </div>
                  ))}
                  {visibleTweets < profileInfoPosts.length && (
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item style={{ border: "none" }} eventKey="1">
                        <Accordion.Header
                          style={{ border: "none" }}
                          className={`accordion-2 accordion-2-${themeName}`}
                        >
                          <div
                            onClick={handleShowMorePosts}
                            style={{
                              border: "none",
                              width: "100%",
                              textAlign: "center",
                              color: "rgb(29, 155, 240)",
                              fontSize: "15px",
                              fontWeight: "400",
                              lineHeight: "24px",
                              cursor: "pointer",
                              backgroundColor: "transparent",
                            }}
                          >
                            Show more
                          </div>
                        </Accordion.Header>
                        <Accordion.Body></Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  )}
                </>
              ) : (
                <>
                  {/* when no post shared yet from other profile posts section in general start to check  */}

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
                      {profileInfo._id !== userInfo._id
                        ? "@" +
                          profileInfo.username +
                          " " +
                          "haven’t posted anything yet"
                        : "You haven't posted anything yet."}
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
                      {profileInfo._id !== userInfo._id
                        ? "When they do, those posts will show up here."
                        : "Start sharing your thoughts!"}
                    </div>
                  </div>
                  {/* when no post shared yet from other profile posts section in general finish to check  */}
                </>
              )}
            </div>
            {/* finish to check */}
            {/* start */}
            <div
              style={{
                height: width <= 700 && favorites.length < 2 ? "30vh" : "",
              }}
              className={`${favoriteWindow} all-favorites`}
            >
              {favorites.length && hasFalse ? (
                <>
                  {favorites.slice(0, visibleLikedTweets).map((favorite) => (
                    <>
                      <div
                        onClick={() => {
                          console.log("Post box parent class =>", favorite);
                          setclickedPostBox(favorite);
                        }}
                        className={
                          themeName === "dark-theme"
                            ? `each-post-${themeName}`
                            : "each-post"
                        }
                        key={favorite._id}
                      >
                        {favorite.deactivatedOwner ? null : (
                          <>
                            <div
                              style={{
                                textDecoration: "none",
                              }}
                              onClick={() => {
                                setclickedPostBox(favorite);
                              }}
                              className="posts-details outside-of-inner-circle-actions"
                            >
                              <div className="favorite-head">
                                <Stack
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  to={`/${favorite.userId.username}/status/${
                                    !favorite.isReposted
                                      ? favorite._id
                                      : favorite.repostedFromThisOriginalPost[0]
                                          ._id
                                  }`}
                                  onClick={() => setclickedPostBox(favorite)}
                                  className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                                  direction="horizontal"
                                  gap={1}
                                >
                                  {/* profile image start to check */}
                                  <div className="p-1">
                                    {favorite.userId.imageUrl.slice(0, 3) !==
                                    "../" ? (
                                      <Link
                                        className="post-circle-profile-image-on-point"
                                        style={{ cursor: "pointer" }}
                                        to={`/profile/${
                                          favorite ? favorite.userId._id : null
                                        }`}
                                      >
                                        <img
                                          width={40}
                                          height={40}
                                          src={favorite.userId.imageUrl}
                                          alt="??"
                                          style={{ borderRadius: "50%" }}
                                        />
                                      </Link>
                                    ) : (
                                      <Link
                                        className="post-circle-profile-svg-on-point"
                                        to={`/profile/${
                                          favorite.userId
                                            ? favorite.userId._id
                                            : null
                                        }`}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {" "}
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={40}
                                          height={40}
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
                                    )}
                                  </div>
                                  {/* profile image finish to check  */}

                                  {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                                  <div className="p-1">
                                    {favorite.userId ? (
                                      <>
                                        <Link
                                          className="post-circle-postowner-fullname"
                                          to={`/profile/${favorite.userId._id}`}
                                          style={{
                                            textDecoration: "none",
                                            color: "black",
                                          }}
                                        >
                                          <span
                                            className="hover-fullname"
                                            style={{
                                              fontWeight: "700",
                                              fontSize: "15px",
                                              lineHeight: "20px",
                                              color:
                                                themeName === "dark-theme"
                                                  ? "white"
                                                  : "",
                                            }}
                                          >
                                            {favorite.authorFullName}
                                          </span>
                                        </Link>
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
                                              data-testid="icon-verified"
                                              color="rgba(29,155,240,1.00)"
                                              fill="currentColor"
                                            >
                                              <g>
                                                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                              </g>
                                            </svg>
                                          </span>{" "}
                                        </span>
                                        <Link
                                          to={`/profile/${favorite.userId._id}`}
                                          style={{
                                            textDecoration: "none",
                                            color:
                                              themeName === "dark-theme"
                                                ? "#71767A"
                                                : "rgb(83, 100, 113)",
                                            lineHeight: "20px",
                                            fontSize: "15px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          <span className="post-circle-postowner-username">
                                            <span>
                                              @{favorite.authorUserName}
                                            </span>
                                          </span>
                                        </Link>
                                        <Link
                                          style={{
                                            textDecoration: "none",
                                          }}
                                          to={`/${
                                            favorite.userId.username
                                          }/status/${
                                            !favorite.isReposted
                                              ? favorite._id
                                              : favorite
                                                  .repostedFromThisOriginalPost[0]
                                                  ._id
                                          }`}
                                        >
                                          <span
                                            className="post-circle-date-post-detail"
                                            style={{
                                              color:
                                                themeName === "dark-theme"
                                                  ? "#71767A"
                                                  : "rgb(83, 100, 113)",
                                              lineHeight: "20px",
                                              fontSize: "15px",
                                              fontWeight: "400",
                                            }}
                                          >
                                            {" "}
                                            ·{" "}
                                            <span className="date-post-detail">
                                              {getCreatedDateForSpesificUserProfilePage(
                                                favorite.createdAt
                                              )}
                                            </span>
                                          </span>
                                        </Link>
                                        {/* finish to check  */}
                                      </>
                                    ) : null}
                                  </div>
                                  {/* post owner full name + verified account svg + post owner user name + post created date  finish to check  */}

                                  {/* three dots svg start to check */}
                                  <div className="p-1 ms-auto">
                                    <PostPopover
                                      postDeletionProcess={
                                        handleDeletePostFromSpesificUserProfilePage
                                      }
                                      post={favorite}
                                    />
                                  </div>
                                  {/* three dots svg finish to check */}
                                </Stack>
                              </div>

                              {/* post content start to check  */}
                              <Stack
                                to={`/${favorite.userId.username}/status/${
                                  !favorite.isReposted
                                    ? favorite._id
                                    : favorite.repostedFromThisOriginalPost[0]
                                        ._id
                                }`}
                                onClick={() => setclickedPostBox(favorite)}
                                className="outside-of-inner-circle-action-comment-text"
                                direction="vertical"
                                gap={1}
                              >
                                <Link
                                  style={{
                                    textDecoration: "none",
                                    color: "rgb(15, 20, 25)",
                                  }}
                                  to={`/${favorite.userId.username}/status/${
                                    !favorite.isReposted
                                      ? favorite._id
                                      : favorite.repostedFromThisOriginalPost[0]
                                          ._id
                                  }`}
                                >
                                  <div
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "400",
                                      lineHeight: "20px",
                                      overflowWrap: "break-word",
                                      maxWidth: "100%",
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "",
                                    }}
                                    className="p-2"
                                  >
                                    {favorite.content}
                                  </div>
                                </Link>
                              </Stack>
                              {/* post content finish to check  */}

                              {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                              {favorite.image.url !== "image@url" ? (
                                <>
                                  <Link
                                    to={`/${favorite.userId.username}/status/${
                                      !favorite.isReposted
                                        ? favorite._id
                                        : favorite
                                            .repostedFromThisOriginalPost[0]
                                    }/photo/${1}`}
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    <div
                                      style={{
                                        overflow: "hidden",
                                        border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
                                        borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
                                        boxShadow:
                                          "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
                                      }}
                                    >
                                      <img
                                        src={favorite.image.url}
                                        alt="Description"
                                        style={{
                                          width: "100%",
                                          display: "block",
                                        }}
                                      />
                                    </div>
                                  </Link>
                                </>
                              ) : null}
                              {/* finish to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}

                              {/* new version favorite repost comment start to check */}
                              <Stack
                                className="mt-0"
                                direction="horizontal"
                                style={{
                                  justifyContent: "space-between",
                                  margin: "5px 0px 5px 0px",
                                }}
                              >
                                <div
                                  onClick={() => setclickedPostBox(favorite)}
                                  className="p-1 next-to-comment"
                                >
                                  <CommentModal
                                    post={favorite}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    refreshPosts={
                                      handleShowSpesificUserProfilePageFavorites
                                    }
                                    setLoadingFalse={setLoadingFalse}
                                    setLoadingTrue={setLoadingTrue}
                                    postSharedMessage={postSharedMessage}
                                  />
                                </div>

                                {/* start to check */}
                                <div
                                  style={{
                                    width: "100px",
                                  }}
                                  onClick={() => setclickedPostBox(favorite)}
                                  className="p-1 next-to-repost"
                                >
                                  <RepostAction
                                    post={favorite ? favorite : null}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    refreshPosts={
                                      handleShowSpesificUserProfilePageFavorites
                                    }
                                    setLoadingFalse={setLoadingFalse}
                                    setLoadingTrue={setLoadingTrue}
                                  />
                                </div>
                                {/* finish to check  */}

                                <div
                                  style={{
                                    width: "100px",
                                  }}
                                  to={`/${favorite.userId.username}/status/${
                                    !favorite.isReposted
                                      ? favorite._id
                                      : favorite.repostedFromThisOriginalPost[0]
                                          ._id
                                  }`}
                                  onClick={() => setclickedPostBox(favorite)}
                                  className="p-1 next-to-like"
                                >
                                  <LikeAction
                                    post={favorite ? favorite : null}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    refreshPosts={
                                      handleShowSpesificUserProfilePageFavorites
                                    }
                                    setLoadingFalse={setLoadingFalse}
                                    setLoadingTrue={setLoadingTrue}
                                  />
                                </div>
                              </Stack>
                              {/* new version favorite repost comment finish to check */}
                            </div>
                            <div
                              onClick={() => {
                                console.log(
                                  "Post box child class =>",
                                  favorite
                                );
                                setclickedPostBox(favorite);
                              }}
                              className="border-extra"
                              style={{
                                borderBottom:
                                  themeName !== "dark-theme"
                                    ? "1px solid rgba(0, 0, 0, 0.1)"
                                    : // : "0.1px solid rgb(70, 70, 70)",
                                      "1px solid rgb(70, 70, 70)",
                              }}
                            ></div>
                          </>
                        )}
                      </div>
                    </>
                  ))}
                  {visibleLikedTweets < favorites.length && (
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item style={{ border: "none" }} eventKey="1">
                        <Accordion.Header
                          style={{ border: "none" }}
                          className={`accordion-2 accordion-2-${themeName}`}
                        >
                          <div
                            onClick={handleShowMoreLikedTweets}
                            style={{
                              border: "none",
                              width: "100%",
                              textAlign: "center",
                              color: "rgb(29, 155, 240)",
                              fontSize: "15px",
                              fontWeight: "400",
                              lineHeight: "24px",
                              cursor: "pointer",
                              backgroundColor: "transparent",
                            }}
                          >
                            Show more
                          </div>
                        </Accordion.Header>
                        <Accordion.Body></Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  )}
                </>
              ) : (
                <>
                  {/* when no post shared yet from other profile posts section in general start to check  */}

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
                      {profileInfo._id !== userInfo._id
                        ? "@" +
                          profileInfo.username +
                          " " +
                          "hasn’t liked any posts"
                        : "You don’t have any likes yet"}
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
                      {profileInfo._id !== userInfo._id
                        ? "When they do, those posts will show up here."
                        : "Tap the heart on any post to show it some love. When you do, it’ll show up here."}
                    </div>
                  </div>

                  {/* when no post shared yet from other profile posts section in general finish to check  */}
                </>
              )}
            </div>
          </Col>

          {/* 3.column burası olucak */}
          <RightSideColumn />
        </Row>
      </Container>
    </>
  );
}

export default SpesificUserProfile;
