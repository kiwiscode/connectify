import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, Stack, Button, Accordion } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { CommentModal } from "../components/ui/Modal";

import LoadingSpinner from "../components/ui/LoadingSpinner";
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

function UserProfile() {
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);

  console.log("Theme name =>", themeName);
  console.log("Theme  =>", theme);

  const socket = io.connect(`${API_URL}`);

  const navigate = useNavigate();

  // finish to check

  // use effect to grab current mouse click location start to check
  const [clickedPostBox, setclickedPostBox] = useState(null);
  useEffect(() => {
    const getClickLocation = (e) => {
      const clickedElementParentClass = e.target.parentNode.className;
      const clickedElementClass = e.target.classList;

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
        if (clickedPostBox) {
          navigate(
            `/${clickedPostBox.userId.username}/status/${
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

  const [userprofiledata, setUserprofiledata] = useState([]);
  // const { getToken, userInfo, socket } = useContext(UserContext);
  const { getToken, userInfo } = useContext(UserContext);
  const [favoriteWindow, setFavoriteWindow] = useState("hide");
  const [postsWindow, setPostWindow] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [postId, setpostId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setprofileImage] = useState("");
  const [completedProfileImage, setcompletedProfileImage] = useState(false);

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
  // socket io 1 client finish to check

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
      console.log("Data =>", data);
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

  // socket io 5 client start to check
  const handleNotification = (post, userInfo, type) => {
    console.log("Sending notification to => ", post.userId.username);

    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: post.userId.username,
      type: type,
      contactHasBeenMade: post,
      senderInfo: userInfo,
    });
  };
  // socket io 5 client finish to check

  const handleGetFavorites = () => {
    setFavoriteWindow("");
    setPostWindow("hide");
    axios
      .get(`${API_URL}/favorite`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFavorites(response.data.favorites);
      })
      .catch((err) => {
        return err;
      });
  };

  const checkIfAllFavoritesFromDeactivatedUser = () => {
    return favorites.map((eachFavorite) => {
      return eachFavorite.deactivatedOwner;
    });
  };

  const hasFalse = checkIfAllFavoritesFromDeactivatedUser().some(
    (item) => item === false
  );

  const handleGoBack = () => {
    console.log("Go one page back !");
    navigate(-1);
  };
  const [profile, setProfile] = useState([]);
  const handleShowPostsProfilePage = () => {
    setFavoriteWindow("hide");
    setPostWindow("");
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log("Profile info =>", response);

        setProfile(response.data.user);
        setUserprofiledata(response.data.posts);
      })
      .catch((err) => {
        return err;
      });
  };
  const handleDeletePostFromProfilePage = (postId) => {
    axios
      .post(
        `${API_URL}/home/delete-post`,
        { userId: userInfo._id, postId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        if (favoriteWindow === "") {
          setTimeout(() => {
            handleGetFavorites();
          }, 500);
        } else if (postsWindow === "") {
          setTimeout(() => {
            handleShowPostsProfilePage();
          }, 500);
        }

        setError("");
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        setError(errorMessage);
      });
  };

  const handleShowDetailPostFromProfilePage = (postId) => {
    console.log(postId);
  };

  const handlePostLikesFromProfilePage = (postId, findedPost) => {
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
            handleGetFavorites();
            handleNotification(findedPost, userInfo, "liked");
            setError("");
          }, 500);
        } else if (postsWindow === "") {
          setTimeout(() => {
            handleShowPostsProfilePage();
            handleNotification(findedPost, userInfo, "liked");
            setError("");
          }, 500);
        }
      })
      .catch((error) => {
        if (error) {
          const { errorMessage } = error.response.data;

          setError(errorMessage);
        }
      });
  };

  const handleDeleteLikeFromProfilePage = (postId) => {
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
            handleGetFavorites();
          }, 500);
        } else if (postsWindow === "") {
          setTimeout(() => {
            handleShowPostsProfilePage();
          }, 500);
        }
      })
      .catch((error) => {
        if (error) {
          const { errorMessage } = error.response.data;

          setError(errorMessage);
        }
      });
  };

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

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

  const getCreatedDateForProfile = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${monthsProfile[getMonth]} ${createdAt.getDate()}`;
  };

  const handleRepost = (postId, findedPost) => {
    axios
      .post(
        `${API_URL}/repost`,
        { userId: userInfo._id, postId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        if (postsWindow === "hide") {
          setTimeout(() => {
            handleGetFavorites();
            handleNotification(findedPost, userInfo, "repost");
          }, 500);
        } else if (favoriteWindow === "hide") {
          setTimeout(() => {
            handleShowPostsProfilePage();
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

  const handleDeleteRepostProfilePage = (postId) => {
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
          setTimeout(() => {
            handleGetFavorites();
          }, 500);
        }
        if (favoriteWindow === "hide") {
          setTimeout(() => {
            handleShowPostsProfilePage();
          }, 500);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [profileImageChangingLoadingBar, setprofileImageChangingLoadingBar] =
    useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
    setprofileImageChangingLoadingBar(true);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setprofileImageChangingLoadingBar(true);
      setprofileImage(reader.result);
    };
  };

  const changeProfileImage = () => {
    axios
      .post(
        `${API_URL}/profile/add-profile-image`,
        { profileImage },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response =>", response);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        userInfo.imageUrl = response.data.imageInfo.url;

        const updatedUserInfo = userInfo;
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        setcompletedProfileImage(true);

        setprofileImageChangingLoadingBar(false);
        window.location.href = "http://localhost:5173/profile";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("Profile =>", profile);

  const setLoadingTrue = () => {
    setIsLoading(true);
  };

  const setLoadingFalse = () => {
    setIsLoading(false);
  };

  const getRepostedIds = (array) => {
    return array.reposted.map((eachRepost) => {
      return eachRepost._id;
    });
  };

  useEffect(() => {
    if (postsWindow === "hide") {
      changeProfileImage();
      handleGetFavorites();
    } else if (favoriteWindow === "hide") {
      changeProfileImage();
      handleShowPostsProfilePage();
    }
  }, [profileImage, postsWindow, favoriteWindow]);

  const [activeUserFollowing, setactiveUserFollowing] = useState([]);
  const [activeUserFollowers, setactiveUserFollowers] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setactiveUserFollowers(response.data.user.followers);
        setactiveUserFollowing(response.data.user.following);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  }, []);

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

  return (
    <>
      {contextHolder}
      <ToastContainer />

      <ResponsiveNavigationBarBottom
        refreshPosts={() => handleShowPostsProfilePage()}
        setLoadingTrue={() => setLoadingTrue()}
        setLoadingFalse={() => setLoadingFalse()}
      />

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
            refreshPosts={() => handleShowPostsProfilePage()}
            setLoadingTrue={() => setLoadingTrue()}
            setLoadingFalse={() => setLoadingFalse()}
            parentCallBack={handleCallback}
          />

          {/* start to check  main column */}

          {/* start to check */}

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
            <Container>
              <Row>
                <Stack direction="horizontal" gap={0}>
                  {/* start to check  */}
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

                  {/* finish to check  */}

                  <div
                    className="p-2"
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      height: "100px",
                    }}
                  >
                    <div>{userInfo.username}</div>
                    <div className="profile-paragraph">
                      {userInfo.posts.length} posts
                    </div>
                  </div>
                </Stack>
                {/* start to check */}

                <Stack
                  direction="horizontal"
                  gap={0}
                  style={{ marginTop: "45px" }}
                >
                  <div className="p-2">
                    {userInfo.imageUrl?.slice(0, 3) !== "../" ? (
                      <>
                        {profileImageChangingLoadingBar ? (
                          <>
                            <div
                              style={{
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "0px",
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <LoadingSpinner
                                  strokeColor={"rgb(29, 155, 240)"}
                                ></LoadingSpinner>
                              </div>
                              <img
                                style={{
                                  visibility: "hidden",
                                }}
                                src={userInfo.imageUrl}
                                alt=""
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <img
                                style={{
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                }}
                                src={userInfo.imageUrl}
                                alt=""
                                onClick={() =>
                                  document
                                    .getElementById(
                                      "formuploadModal-profile-image"
                                    )
                                    .click()
                                }
                              />
                              <input
                                onChange={handleImage}
                                type="file"
                                id="formuploadModal-profile-image"
                                name="modalImage"
                                className="form-control"
                                style={{ display: "none" }}
                              />
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="133"
                          height="133"
                          fill="rgb(83, 100, 113)"
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
                        <input
                          onChange={handleImage}
                          type="file"
                          id="formuploadModal"
                          name="modalImage"
                          className="form-control"
                          style={{ display: "none" }}
                        />
                      </div>
                    )}
                  </div>
                </Stack>

                {/* finish to check */}
                <div style={{ lineHeight: "30px", marginBottom: "20px" }}>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      marginTop: "50px",
                    }}
                  >
                    {userInfo.username}
                  </div>
                  <div style={{ color: "rgb(83, 100, 113)" }}>
                    @{userInfo.username}
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-calendar4-week"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
                      <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                    </svg>{" "}
                    Joined {getCreatedDateForProfile(userInfo.createdAt)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "3%",
                    }}
                  >
                    {/* following and followers details start to check  */}
                    <Link
                      to={`/profile/${userInfo._id}/following`}
                      style={{
                        textDecoration: "none",
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                      className="following-followers-link"
                    >
                      <span>
                        {activeUserFollowing.length && (
                          <span
                            style={{
                              cursor: "pointer",
                              fontSize: "14px",
                              lineHeight: "16px",
                              fontWeight: "700",
                            }}
                          >
                            {activeUserFollowing.length}
                          </span>
                        )}
                      </span>{" "}
                      <span
                        style={{
                          cursor: "pointer",
                          color: "rgb(83, 100, 113)",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        Following
                      </span>{" "}
                    </Link>
                    <Link
                      to={`/profile/${userInfo._id}/followers`}
                      className="following-followers-link"
                      style={{
                        textDecoration: "none",
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      <span>
                        {activeUserFollowers.length && (
                          <span
                            style={{
                              cursor: "pointer",
                              fontSize: "14px",
                              lineHeight: "16px",
                              fontWeight: "700",
                            }}
                          >
                            {activeUserFollowers.length}
                          </span>
                        )}
                      </span>{" "}
                      <span
                        style={{
                          cursor: "pointer",
                          color: "rgb(83, 100, 113)",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        Followers
                      </span>
                    </Link>
                    {/* following and followers details finish to check  */}
                  </div>
                </div>
              </Row>
            </Container>
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
              <div
                onClick={() => handleShowPostsProfilePage()}
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
                        color: "rgb(83,100,113)",
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
                onClick={() => handleGetFavorites()}
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
                        color: "rgb(83,100,113)",
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
              {isLoading && favoriteWindow === "hide" ? (
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              ) : (
                ""
              )}
            </span>
            {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}

            <div className={`all-posts ${postsWindow}`}>
              {userprofiledata.length ? (
                <>
                  {userprofiledata.slice(0, visibleTweets).map((post) => (
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
                              {getRepostedIds(post).includes(userInfo._id) &&
                              post.isReposted ? (
                                <>
                                  <svg
                                    style={{
                                      marginLeft: "20px",
                                    }}
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                    color="rgb(83, 100, 113)"
                                    fill="currentColor"
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
                                    className="hover-reposted-text"
                                    style={{
                                      fontSize: "13px",
                                      lineHeight: "16px",
                                      fontWeight: "700",
                                      color: "rgb(83, 100, 113)",
                                      marginLeft: "10px",
                                      cursor: "pointer",
                                      textDecoration: "none",
                                    }}
                                    onClick={() => setclickedPostBox(post)}
                                    to={`/profile/${post.reposted[0]._id}`}
                                  >
                                    You reposted
                                  </Link>{" "}
                                </>
                              ) : null}
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
                                        color: "rgb(83, 100, 113)",
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
                                        className="post-circle-date-post-detail"
                                        style={{
                                          color: "rgb(83, 100, 113)",
                                          lineHeight: "20px",
                                          fontSize: "15px",
                                          fontWeight: "400",
                                        }}
                                      >
                                        {" "}
                                        ·{" "}
                                        <span className="date-post-detail">
                                          {getCreatedDate(post.createdAt)}
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
                                <span>
                                  {/* show if post owner userId !equal currentUserId */}
                                  {post.userId &&
                                  post.userId._id !== userInfo._id ? (
                                    <svg
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: "rgb(29, 155, 240)",
                                      }}
                                      onClick={() =>
                                        handleShowDetailPostFromProfilePage(
                                          post._id
                                        )
                                      }
                                      color="rgb(83, 100, 113)"
                                      fill="currentColor"
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                    >
                                      <g>
                                        <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                      </g>
                                    </svg>
                                  ) : (
                                    <svg
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: "crimson",
                                      }}
                                      onClick={() =>
                                        handleDeletePostFromProfilePage(
                                          post._id
                                        )
                                      }
                                      color="rgb(83, 100, 113)"
                                      fill="currentColor"
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                    >
                                      <g>
                                        <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                      </g>
                                    </svg>
                                  )}
                                </span>
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
                                      color: "rgb(83, 100, 113)",
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
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]._id
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "rgb(15, 20, 25)",
                                }}
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
                                      : post.repostedFromThisOriginalPost[0]
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
                                  refreshPosts={handleShowPostsProfilePage}
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                  postSharedMessage={postSharedMessage}
                                />
                              </div>

                              {/* start to check */}
                              <div className="p-1">
                                {getRepostedIds(post).includes(userInfo._id) ? (
                                  <svg
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleDeleteRepostProfilePage(post._id)
                                    }
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                  >
                                    <g>
                                      <path
                                        stroke="rgb(83, 100, 113)"
                                        strokeWidth="0.1"
                                        d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                                      ></path>
                                    </g>
                                  </svg>
                                ) : (
                                  <svg
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleRepost(post._id, post)}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                    color="rgb(83, 100, 113)"
                                    fill="currentColor"
                                  >
                                    <g>
                                      <path
                                        stroke="rgb(83, 100, 113)"
                                        strokeWidth="0.1"
                                        d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                                      ></path>
                                    </g>
                                  </svg>
                                )}

                                {getRepostedIds(post).includes(userInfo._id) ? (
                                  <span
                                    className="post-description"
                                    style={{
                                      color: "rgb(0, 186, 124)",
                                    }}
                                  >
                                    {post.reposted.length}
                                  </span>
                                ) : (
                                  <span
                                    className="post-description"
                                    style={{
                                      color: "rgb(83, 100, 113)",
                                    }}
                                  >
                                    {post.reposted.length ? (
                                      <span>{post.reposted.length}</span>
                                    ) : null}
                                  </span>
                                )}

                                {/* start  */}
                              </div>

                              {/* finish to check  */}
                              <div className="p-1">
                                <div>
                                  {post.likes.includes(userInfo._id) ? (
                                    <div>
                                      <svg
                                        onClick={() =>
                                          handleDeleteLikeFromProfilePage(
                                            post._id
                                          )
                                        }
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        fill="rgb(249, 24, 128)"
                                        className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      >
                                        <g>
                                          <path
                                            stroke="black"
                                            strokeWidth="0.2"
                                            d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                                          ></path>
                                        </g>
                                      </svg>

                                      <span className="post-description">
                                        {post.likes.length ? (
                                          <span
                                            style={{
                                              color: "rgb(249, 24, 128)",
                                            }}
                                          >
                                            {post.likes.length}
                                          </span>
                                        ) : null}
                                      </span>
                                    </div>
                                  ) : (
                                    <div>
                                      {" "}
                                      <svg
                                        onClick={() =>
                                          handlePostLikesFromProfilePage(
                                            post._id,
                                            post
                                          )
                                        }
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        color="rgb(83, 100, 113)"
                                        fill="currentColor"
                                        className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      >
                                        <g>
                                          <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                                        </g>
                                      </svg>
                                      <span className="post-description">
                                        {post.likes.length ? (
                                          <span>{post.likes.length}</span>
                                        ) : null}
                                      </span>
                                    </div>
                                  )}
                                </div>
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
                  {visibleTweets < userprofiledata.length && (
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item style={{ border: "none" }} eventKey="1">
                        <Accordion.Header
                          style={{ border: "none" }}
                          className="accordion-2"
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
                  {/* when no post shared yet from your posts section in general start to check  */}
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
                      {"You haven't posted anything yet."}
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
                      Start sharing your thoughts!
                    </div>
                  </div>
                  {/* when no post shared yet from your posts section in general finish to check  */}
                </>
              )}
            </div>

            <div className={`${favoriteWindow} all-favorites`}>
              {favorites.length && hasFalse ? (
                <>
                  {favorites.slice(0, visibleLikedTweets).map((favorite) => (
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
                                          color: "rgb(83, 100, 113)",
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
                                            color: "rgb(83, 100, 113)",
                                            lineHeight: "20px",
                                            fontSize: "15px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          {" "}
                                          ·{" "}
                                          <span className="date-post-detail">
                                            {getCreatedDate(favorite.createdAt)}
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
                                  <span className="svg-three-dots-post-detail">
                                    {/* show if post owner userId !equal currentUserId */}
                                    {favorite.userId &&
                                    favorite.userId._id !== userInfo._id ? (
                                      <svg
                                        style={{
                                          cursor: "pointer",
                                          backgroundColor: "rgb(29, 155, 240)",
                                        }}
                                        onClick={() =>
                                          handleShowDetailPostFromProfilePage(
                                            favorite._id
                                          )
                                        }
                                        color="rgb(83, 100, 113)"
                                        fill="currentColor"
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      >
                                        <g>
                                          <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                        </g>
                                      </svg>
                                    ) : (
                                      <svg
                                        style={{
                                          cursor: "pointer",
                                          backgroundColor: "crimson",
                                        }}
                                        onClick={() =>
                                          handleDeletePostFromProfilePage(
                                            favorite._id
                                          )
                                        }
                                        color="rgb(83, 100, 113)"
                                        fill="currentColor"
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      >
                                        <g>
                                          <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                        </g>
                                      </svg>
                                    )}
                                  </span>
                                </div>
                                {/* three dots svg finish to check */}
                              </Stack>
                            </div>

                            {/* post content start to check  */}
                            <Stack
                              to={`/${favorite.userId.username}/status/${
                                !favorite.isReposted
                                  ? favorite._id
                                  : favorite.repostedFromThisOriginalPost[0]._id
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
                                    color:
                                      themeName === "dark-theme" ? "white" : "",
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    lineHeight: "20px",
                                    overflowWrap: "break-word",
                                    maxWidth: "100%",
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
                                      : favorite.repostedFromThisOriginalPost[0]
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
                              className="mt-0 parent-footer-stack"
                              onClick={() => setclickedPostBox(favorite)}
                              direction="horizontal"
                              style={{
                                justifyContent: "space-between",
                                margin: "5px 0px 5px 0px",
                                cursor: "pointer",
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
                                  refreshPosts={handleGetFavorites}
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                  postSharedMessage={postSharedMessage}
                                />
                              </div>

                              {/* start to check */}
                              <div
                                onClick={() => setclickedPostBox(favorite)}
                                className="p-1 next-to-repost"
                              >
                                {favorite.reposted.includes(userInfo._id) ? (
                                  <div>
                                    <svg
                                      onClick={() =>
                                        handleDeleteRepostProfilePage(
                                          favorite._id
                                        )
                                      }
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      fill="rgb(0, 186, 124)"
                                    >
                                      <g>
                                        <path
                                          stroke="rgb(83, 100, 113)"
                                          strokeWidth="0.1"
                                          d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                                        ></path>
                                      </g>
                                    </svg>

                                    <span
                                      style={{ color: "rgb(0, 186, 124)" }}
                                      className="post-description"
                                    >
                                      {/* some test */}
                                      {favorite.reposted.length ? (
                                        <span>{favorite.reposted.length}</span>
                                      ) : null}
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    {" "}
                                    <svg
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleRepost(favorite._id, favorite)
                                      }
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      fill={
                                        favorite.reposted.includes(userInfo._id)
                                          ? "rgb(0, 186, 124)"
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
                                    <span
                                      className="post-description"
                                      style={{
                                        color: favorite.reposted.includes(
                                          userInfo._id
                                        )
                                          ? "rgb(0, 186, 124)"
                                          : "rgb(83, 100, 113)",
                                      }}
                                    >
                                      {favorite.reposted.length ? (
                                        <span>{favorite.reposted.length}</span>
                                      ) : null}
                                    </span>
                                  </div>
                                )}

                                {/* start  */}
                              </div>

                              {/* finish to check  */}
                              <div
                                to={`/${favorite.userId.username}/status/${
                                  !favorite.isReposted
                                    ? favorite._id
                                    : favorite.repostedFromThisOriginalPost[0]
                                        ._id
                                }`}
                                onClick={() => setclickedPostBox(favorite)}
                                className="p-1 next-to-like"
                              >
                                <div>
                                  {favorite.likes.includes(userInfo._id) ? (
                                    <div>
                                      <svg
                                        onClick={() =>
                                          handleDeleteLikeFromProfilePage(
                                            favorite._id
                                          )
                                        }
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        fill="rgb(249, 24, 128)"
                                        className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      >
                                        <g>
                                          <path
                                            stroke="black"
                                            strokeWidth="0.2"
                                            d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                                          ></path>
                                        </g>
                                      </svg>

                                      <span className="post-description">
                                        {favorite.likes.length ? (
                                          <span
                                            style={{
                                              color: "rgb(249, 24, 128)",
                                            }}
                                          >
                                            {favorite.likes.length}
                                          </span>
                                        ) : null}
                                      </span>
                                    </div>
                                  ) : (
                                    <div>
                                      {" "}
                                      <svg
                                        onClick={() =>
                                          handlePostLikesFromProfilePage(
                                            favorite._id,
                                            favorite
                                          )
                                        }
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        color="rgb(83, 100, 113)"
                                        fill="currentColor"
                                        className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      >
                                        <g>
                                          <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                                        </g>
                                      </svg>
                                      <span className="post-description">
                                        {favorite.likes.length ? (
                                          <span>{favorite.likes.length}</span>
                                        ) : null}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Stack>
                            {/* new version favorite repost comment finish to check */}
                          </div>
                          <div
                            onClick={() => {
                              console.log("Post box child class =>", favorite);
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
                  ))}
                  {visibleLikedTweets < favorites.length && (
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item style={{ border: "none" }} eventKey="1">
                        <Accordion.Header
                          style={{ border: "none" }}
                          className="accordion-2"
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
                  {/* when no post liked yet from likes section in general start to check  */}

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
                      You don’t have any likes yet
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
                      Tap the heart on any post to show it some love. When you
                      do, it’ll show up here.
                    </div>
                  </div>
                  {/* when no post liked yet from likes section in general finish to check  */}
                </>
              )}
            </div>

            {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}
          </Col>

          {/* 3.column burası olucak  */}
          <RightSideColumn />
        </Row>
      </Container>
    </>
  );
}

export default UserProfile;
