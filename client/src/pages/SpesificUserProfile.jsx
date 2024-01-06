import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Stack,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { PostModal, LogoutModal, CommentModal } from "../components/ui/Modal";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function SpesificUserProfile() {
  const { id } = useParams();
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
  const [showNotificationColumn, setshowNotificationColumn] = useState(false);
  const [notifications, setNotifications] = useState([]);
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
        localStorage.setItem(
          "profileInfoPosts",
          JSON.stringify(response.data.posts)
        );

        const profileInfoPosts = JSON.parse(
          localStorage.getItem("profileInfoPosts")
        );

        setprofileInfoPosts(profileInfoPosts);
        setPostWindow("");
        setFavoriteWindow("hide");
        setProfileInfo(response.data);
      })

      .catch((err) => {
        return err;
      });
  };

  const handleShowSpesificUserProfilePageFavorites = () => {
    axios
      .get(`${API_URL}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        localStorage.setItem(
          "profileInfoFavorites",
          JSON.stringify(response.data.favorites)
        );

        const profileInfoFavorites = JSON.parse(
          localStorage.getItem("profileInfoFavorites")
        );
        console.log("Favorites =>", response);
        setFavoriteWindow("");
        setPostWindow("hide");
        setFavorites(profileInfoFavorites);
        setProfileInfo(response.data);
      })
      .catch((err) => {
        return err;
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
  }, []);

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
          handleShowSpesificUserProfilePageFavorites();
        } else if (postsWindow === "") {
          handleShowSpesificUserProfilePagePosts();
        }
        setError("");
      })
      .catch((err) => {
        return err;
      });
  };

  const handlePostLikesFromSpesificUserProfilePage = (postId) => {
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
          handleShowSpesificUserProfilePageFavorites();
        } else if (postsWindow === "") {
          handleShowSpesificUserProfilePagePosts();
        }
        setError("");
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        setError(errorMessage);
      });
  };

  const handleDeletePostFromSpesificUserProfilePage = (postId) => {
    setpostId(postId);
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
          handleShowSpesificUserProfilePageFavorites();
        } else if (postsWindow === "") {
          handleShowSpesificUserProfilePagePosts();
        }
        setError("");
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        setError(errorMessage);
      });
  };

  const handleShowDetailPostFromSpesificUserProfilePage = () => {
    console.log("Button Clicked");
  };

  const handleRepost = (postId) => {
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
        // start to check
        // repost process for spesific user profile posts

        if (postsWindow === "hide") {
          const profileInfoFavorites = JSON.parse(
            localStorage.getItem("profileInfoFavorites")
          );

          const findedFavorite = favorites.find((element) => {
            return element._id === postId;
          });

          const index2 = favorites.indexOf(findedFavorite);
          profileInfoFavorites[index2].reposted.unshift(userInfo._id);

          localStorage.setItem(
            "profileFavorites",
            JSON.stringify(profileInfoFavorites)
          );

          setFavorites(profileInfoFavorites);
          // finish to check
        } else if (favoriteWindow === "hide") {
          const profileInfoPosts = JSON.parse(
            localStorage.getItem("profileInfoPosts")
          );

          const findedPost = profileInfoPosts.find((element) => {
            return element._id === postId;
          });

          const index = profileInfoPosts.indexOf(findedPost);

          profileInfoPosts[index].reposted.unshift(userInfo._id);

          localStorage.setItem(
            "profileInfoPosts",
            JSON.stringify(profileInfoPosts)
          );

          setprofileInfoPosts(profileInfoPosts);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteRepostSpesificProfilePage = (postId) => {
    axios
      .post(
        `${API_URL}/repost/delete`,
        { postId: postId, userId: userInfo._id },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        console.log("You deleted repost!");
      })
      .then(() => {})
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
  console.log("Profile info posts =>", profileInfoPosts);
  //  NOTE start to check calculation the length according isReaded value
  const checkIfFavoriteNotitificationIsNotReaded = (array) => {
    const filter = array.map((eachNotificationItem) => {
      return eachNotificationItem.isFavorite.value !== false;
    });

    let count = 0;

    for (let i = 0; i < filter.length; i++) {
      if (filter[i] === true) {
        count++;
      }
    }

    return count;
  };

  const checkIfRepostNotitificationIsNotReaded = (array) => {
    const filter = array.map((eachNotificationItem) => {
      return eachNotificationItem.isRepost.value !== false;
    });

    let count = 0;

    for (let i = 0; i < filter.length; i++) {
      if (filter[i] === true) {
        count++;
      }
    }

    return count;
  };
  const checkIfCommentNotitificationIsNotReaded = (array) => {
    const filter = array.map((eachNotificationItem) => {
      return eachNotificationItem.isComment.value !== false;
    });

    let count = 0;

    for (let i = 0; i < filter.length; i++) {
      if (filter[i] === true) {
        count++;
      }
    }

    return count;
  };

  const getTotalLengthOfNotifications = () => {
    const checkFavoritesNotReadedYetInsideNotifications =
      checkIfFavoriteNotitificationIsNotReaded(userInfo.notifications);
    const checkRepostsNotReadedYetInsideNotifications =
      checkIfRepostNotitificationIsNotReaded(userInfo.notifications);
    const checkCommentsNotReadedYetInsideNotifications =
      checkIfCommentNotitificationIsNotReaded(userInfo.notifications);

    if (
      checkIfFavoriteNotitificationIsNotReaded(userInfo.notifications) ||
      checkIfRepostNotitificationIsNotReaded(userInfo.notifications) ||
      checkIfCommentNotitificationIsNotReaded(userInfo.notifications)
    ) {
      return `${
        checkFavoritesNotReadedYetInsideNotifications +
        checkRepostsNotReadedYetInsideNotifications +
        checkCommentsNotReadedYetInsideNotifications
      }`;
    } else {
      return "";
    }
  };
  //  NOTE finish to check calculation the length according isReaded value
  // NOTE start to check get all the notifications from backend api endpoint
  const showNotifications = () => {
    setshowNotificationColumn(true);

    axios
      .get(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setNotifications(response.data.notifications);
      })
      .catch(() => {
        console.log(error);
      });
  };
  // NOTE finish to check get all the notifications from backend api endpoint
  return (
    <>
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
          <Col xs={12} sm={12} md={6} lg={3}>
            <nav className="nav-bar-home">
              <Link href="/home">
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
                  <div>
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

                <Link>
                  <div>
                    <div onClick={() => showNotifications()}>
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
                      <span>
                        Notifications{" "}
                        {getTotalLengthOfNotifications() !== "" ? (
                          <span className="notification-num">
                            {getTotalLengthOfNotifications()}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/messages">
                  <div>
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

                <Link to="/profile">
                  <div>
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
                <PostModal
                  refreshPosts={() => handleShowSpesificUserProfilePagePosts()}
                  setLoadingTrue={() => setLoadingTrue()}
                  setLoadingFalse={() => setLoadingFalse()}
                ></PostModal>
              </div>
              <LogoutModal></LogoutModal>
            </nav>
          </Col>
          {profileInfo && showNotificationColumn === false ? (
            <Col
              xs={12}
              sm={12}
              md={4}
              lg={6}
              className={`main-column ${showNotificationColumn}`}
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderTop: "none",
                borderBottom: "none",
              }}
            >
              <Container>
                <Row>
                  <Stack direction="horizontal" gap={0}>
                    <div className="p-2">
                      <Link style={{ color: "rgb(83, 100, 113)" }} to={"/home"}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-arrow-left"
                          viewBox="1 0 16 16"
                          style={{ marginBottom: "28px" }}
                        >
                          <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                      </Link>
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
                        <div className="profile-paragraph">
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
                            <img src={profileInfo.imageUrl} alt="" />
                          </div>
                        ) : (
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="133"
                              height="133"
                              fill="rgb(83, 100, 113)"
                              className="bi bi-person-circle"
                              viewBox="0 0 16 16"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                document
                                  .getElementById("formuploadModal")
                                  .click()
                              }
                            >
                              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="">
                      <span style={{}}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="25"
                          fill="currentColor"
                          className="bi bi-three-dots"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="black"
                            strokeWidth="0.5"
                            d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                          />
                        </svg>
                      </span>
                      <span style={{}}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="25"
                          fill="currentColor"
                          className="bi bi-envelope"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="black"
                            strokeWidth="0.5"
                            d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
                          />
                        </svg>
                      </span>
                      <span style={{}}>Follow</span>
                    </div>
                  </Stack>

                  {/* finish to check stack on the way  */}
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
                    <div style={{ color: "rgb(83, 100, 113)" }}>
                      @{profileInfo.username}
                      {""}{" "}
                      <span
                        style={{
                          color: "rgb(83, 100, 113)",
                          marginLeft: "4px",
                          backgroundColor: "rgb(239, 243, 244)",
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
                        Follows you or not ?!
                      </span>
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
                    <div>
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                      >
                        {profileInfo.following && (
                          <span>{profileInfo.following.length}</span>
                        )}
                      </span>{" "}
                      <span
                        style={{
                          color: "rgb(83, 100, 113)",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        Following
                      </span>{" "}
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                      >
                        {profileInfo.followers && (
                          <span>{profileInfo.followers.length}</span>
                        )}
                      </span>{" "}
                      <span
                        style={{
                          color: "rgb(83, 100, 113)",
                          fontSize: "14px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        Followers
                      </span>
                    </div>
                  </div>
                </Row>
              </Container>
              {/* start */}
              <Row
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              ></Row>
              <ButtonGroup
                aria-label="Basic example"
                style={{
                  display: "flex",
                }}
              >
                {/* NOTE */}
                <Button
                  onClick={() => handleShowSpesificUserProfilePagePosts()}
                  variant="secondary"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "none",
                    borderRight: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  {favoriteWindow === "" ? (
                    <span>Posts</span>
                  ) : (
                    <span style={{ color: "rgb(29, 155, 240)" }}>Posts</span>
                  )}
                </Button>

                <Button
                  onClick={() => handleShowSpesificUserProfilePageFavorites()}
                  variant="secondary"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "none",
                    borderLeft: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  {favoriteWindow === "" ? (
                    <span style={{ color: "rgb(29, 155, 240)" }}>Likes</span>
                  ) : (
                    <span>Likes </span>
                  )}
                </Button>
              </ButtonGroup>
              {!profileInfoPosts.length && postsWindow === "" ? (
                <Row
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                ></Row>
              ) : null}

              {!favorites.length && favoriteWindow === "" ? (
                <Row
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                ></Row>
              ) : null}
              <span>{isLoading ? <LoadingSpinner></LoadingSpinner> : ""}</span>

              {/* finish */}
              {/* start to check */}
              <div className={`all-posts ${postsWindow}`}>
                {profileInfoPosts.map((post) => (
                  <div key={post._id}>
                    <Row
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                      }}
                    ></Row>
                    <div className="posts-details">
                      <div className="post-head">
                        <Stack direction="horizontal" gap={1}></Stack>
                        <div className="p-0">
                          {/* start to check */}

                          {post.isReposted &&
                          userInfo._id === profileInfo._id ? (
                            <div className={`${show}`}>
                              <svg
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  fontSize: "15px",
                                  marginLeft: "4px",
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-repeat"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  stroke="black"
                                  strokeWidth="0.2"
                                  d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
                                />
                              </svg>
                              <span
                                style={{
                                  fontSize: "13px",
                                  lineHeight: "20px",
                                  fontWeight: "700",
                                  color: "rgb(83, 100, 113)",
                                  marginLeft: "10px",
                                }}
                              >
                                You reposted
                              </span>{" "}
                            </div>
                          ) : null}

                          {/* finish to check */}

                          {/* start to check */}
                          {post.isReposted &&
                          userInfo._id !== profileInfo._id ? (
                            <div>
                              <svg
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  fontSize: "15px",
                                  marginLeft: "4px",
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-repeat"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  stroke="black"
                                  strokeWidth="0.2"
                                  d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
                                />
                              </svg>
                              <span
                                style={{
                                  fontSize: "13px",
                                  lineHeight: "20px",
                                  fontWeight: "700",
                                  color: "rgb(83, 100, 113)",
                                  marginLeft: "10px",
                                }}
                              >
                                {profileInfo.fullname} reposted
                              </span>{" "}
                            </div>
                          ) : null}
                          {/* finish to check */}
                        </div>
                        <Stack
                          direction="horizontal"
                          gap={1}
                          style={{ padding: "3px" }}
                        >
                          {/* start to check next to post profile image  */}

                          <Link to={`/profile/${post.userId._id}`}>
                            <div className="p-0">
                              {" "}
                              {post.userId.imageUrl.slice(0, 3) !== "../" ? (
                                <img
                                  src={post.userId.imageUrl}
                                  width={35}
                                  height={35}
                                  alt=""
                                  style={{
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <div>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="35"
                                    height="35"
                                    fill="rgb(83, 100, 113)"
                                    className="bi bi-person-circle"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </Link>
                          {/* finish to check next to post profile image  */}
                          <Link
                            to={`/profile/${post.userId._id}`}
                            className="hover-fullname"
                            style={{
                              textDecoration: "none",
                              color: "black",
                            }}
                          >
                            <div className="p-0">
                              <span style={{ fontWeight: "700" }}>
                                {post.authorFullName}{" "}
                              </span>
                            </div>
                          </Link>

                          <div
                            dir="ltr"
                            className="p-0 verified-icon css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-xoduu5 r-18u37iz r-1q142lx"
                          >
                            {" "}
                            <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                              <svg
                                width={18}
                                height={18}
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
                            </span>
                          </div>
                          <div className="p-0">
                            <Link
                              to={`/profile/${post.userId._id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                @{post.authorUserName}
                              </span>
                            </Link>
                            <Link
                              style={{
                                textDecoration: "none",
                              }}
                              to={`/${post.userId.username}/status/${post._id}`}
                            >
                              <span style={{ color: "rgba(0,0,0,0.6)" }}>
                                {" "}
                                ·{" "}
                                <span className="date-post-detail">
                                  {getCreatedDateForSpesificUserProfilePage(
                                    post.createdAt
                                  )}
                                </span>
                              </span>
                            </Link>
                          </div>

                          <div className="ps-2 ms-auto">
                            <span>
                              {post.userId !== userInfo._id ? (
                                <svg
                                  onClick={() =>
                                    handleShowDetailPostFromSpesificUserProfilePage(
                                      post._id
                                    )
                                  }
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="25"
                                  fill="currentColor"
                                  className="bi bi-three-dots positioning-dots"
                                  viewBox="0 0 20 20"
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "rgb(29, 155, 240)",
                                  }}
                                >
                                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
                                </svg>
                              ) : (
                                <svg
                                  onClick={() =>
                                    handleDeletePostFromSpesificUserProfilePage(
                                      post._id
                                    )
                                  }
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="25"
                                  fill="currentColor"
                                  className="bi bi-three-dots positioning-dots"
                                  viewBox="0 0 20 20"
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "crimson",
                                  }}
                                >
                                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
                                </svg>
                              )}
                            </span>
                          </div>
                        </Stack>
                      </div>
                      <Link
                        to={`/${post.userId.username}/status/${post._id}`}
                        style={{
                          textDecoration: "none",
                          color: "rgb(15, 20, 25)",
                        }}
                      >
                        <div style={{ padding: "3px" }}>{post.content}</div>
                      </Link>
                      {post.image.url !== "image@url" ? (
                        <>
                          <Link
                            to={`/${post.userId.username}/status/${
                              post._id
                            }/photo/${22}`}
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
                      <Stack
                        direction="horizontal"
                        gap={3}
                        style={{
                          padding: "3px",
                          justifyContent: "space-around",
                          marginBottom: "5px",
                        }}
                      >
                        <div className="p-0">
                          <CommentModal />
                        </div>

                        {/* start to check */}
                        <div className="p-0">
                          {post.reposted.includes(userInfo._id) ? (
                            <svg
                              onClick={() =>
                                handleDeleteRepostSpesificProfilePage(post._id)
                              }
                              style={{
                                color: "rgb(0, 186, 124)",
                                fontSize: "15px",
                                marginLeft: "5px",
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi
                            bi-repeat"
                              viewBox="0 0 16 16"
                            >
                              <path
                                stroke="black"
                                strokeWidth="0.2"
                                d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
                              />
                            </svg>
                          ) : (
                            <svg
                              onClick={() => handleRepost(post._id)}
                              style={{
                                color: "rgb(83, 100, 113)",
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-repeat"
                              viewBox="0 0 16 16"
                            >
                              <path
                                stroke="black"
                                strokeWidth="0.2"
                                d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
                              />
                            </svg>
                          )}

                          {post.reposted.includes(userInfo._id) ? (
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
                              {post.reposted.length}
                            </span>
                          )}
                        </div>

                        {/* finish to check */}

                        {/* start */}
                        <div className="p-0">
                          {post.likes.includes(userInfo._id) ? (
                            <span>
                              <svg
                                onClick={() =>
                                  handleDeleteLikeFromSpesificUserProfilePage(
                                    post._id
                                  )
                                }
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="rgb(249, 24, 128)"
                                className={`bi bi-heart-fill`}
                                viewBox="0 0 17 16"
                              >
                                <path
                                  stroke="black"
                                  strokeWidth="0.2"
                                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                                />
                              </svg>
                              <span className="post-description">
                                {post.likes.length}
                              </span>
                            </span>
                          ) : (
                            <span>
                              {" "}
                              <svg
                                onClick={() =>
                                  handlePostLikesFromSpesificUserProfilePage(
                                    post._id
                                  )
                                }
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className={`bi bi-heart`}
                                viewBox="0 0 17 16"
                              >
                                <path
                                  stroke="black"
                                  strokeWidth="0.2"
                                  d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
                                />
                              </svg>
                              <span className="post-description">
                                {post.likes.length}
                              </span>
                            </span>
                          )}
                        </div>
                        {/* finish */}
                      </Stack>
                    </div>
                  </div>
                ))}
              </div>
              {/* finish to check */}
              {/* start */}
              <div className={`${favoriteWindow} all-favorites`}>
                {favorites.map((favorite) => (
                  <>
                    <div key={favorite._id}>
                      <Row
                        style={{
                          border: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      ></Row>
                      <div className="favorite-details">
                        <div className="favorite-head">
                          <Stack
                            direction="horizontal"
                            gap={1}
                            style={{ padding: "3px" }}
                          >
                            {/* start to check next to post profile image  */}
                            <Link
                              to={`/profile/${favorite.userId._id}`}
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              <div>
                                {" "}
                                {favorite.userId.imageUrl.slice(0, 3) !==
                                "../" ? (
                                  <img
                                    src={favorite.userId.imageUrl}
                                    width={35}
                                    height={35}
                                    alt=""
                                    style={{
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : (
                                  <div>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="35"
                                      height="35"
                                      fill="rgb(83, 100, 113)"
                                      className="bi bi-person-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </Link>
                            {/* finish to check next to post profile image  */}
                            <div className="p-0">
                              <Link
                                to={`/profile/${favorite.userId._id}`}
                                className="hover-fullname"
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <div className="p-0">
                                  <span style={{ fontWeight: "700" }}>
                                    {favorite.authorFullName}{" "}
                                  </span>
                                </div>
                              </Link>
                            </div>
                            <div
                              dir="ltr"
                              className="p-0 verified-icon css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-xoduu5 r-18u37iz r-1q142lx"
                            >
                              {" "}
                              <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                                <svg
                                  width={18}
                                  height={18}
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
                              </span>
                            </div>
                            <div className="p-0">
                              {" "}
                              <Link
                                to={`/profile/${favorite.userId._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "rgba(0,0,0,0.6)",
                                }}
                              >
                                <span>@{favorite.authorUserName}</span>
                              </Link>
                              <Link
                                style={{
                                  textDecoration: "none",
                                }}
                                to={`/${favorite.userId.username}/status/${favorite._id}`}
                              >
                                <span style={{ color: "rgba(0,0,0,0.6)" }}>
                                  {" "}
                                  ·{" "}
                                  <span className="date-post-detail">
                                    {getCreatedDateForSpesificUserProfilePage(
                                      favorite.createdAt
                                    )}
                                  </span>
                                </span>
                              </Link>
                            </div>

                            <div className="ps-2 ms-auto">
                              <span>
                                {favorite.userId !== userInfo._id ? (
                                  <svg
                                    onClick={() =>
                                      handleShowDetailPostFromSpesificUserProfilePage(
                                        favorite._id
                                      )
                                    }
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="25"
                                    fill="currentColor"
                                    className="bi bi-three-dots positioning-dots"
                                    viewBox="0 0 20 20"
                                    style={{
                                      cursor: "pointer",
                                      backgroundColor: "rgb(29, 155, 240)",
                                    }}
                                  >
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
                                  </svg>
                                ) : (
                                  <svg
                                    onClick={() =>
                                      handleDeletePostFromSpesificUserProfilePage(
                                        favorite._id
                                      )
                                    }
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="25"
                                    fill="currentColor"
                                    className="bi bi-three-dots positioning-dots"
                                    viewBox="0 0 20 20"
                                    style={{
                                      cursor: "pointer",
                                      backgroundColor: "crimson",
                                    }}
                                  >
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
                                  </svg>
                                )}
                              </span>
                            </div>
                          </Stack>
                        </div>
                        <Link
                          to={`/${favorite.userId.username}/status/${favorite._id}`}
                          style={{
                            textDecoration: "none",
                            color: "rgb(15, 20, 25)",
                          }}
                        >
                          <div style={{ padding: "3px" }}>
                            {favorite.content}
                          </div>
                        </Link>
                        {favorite.image.url !== "image@url" ? (
                          <>
                            <Link
                              to={`/${favorite.userId.username}/status/${
                                favorite._id
                              }/photo/${22}`}
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

                        <Stack
                          direction="horizontal"
                          gap={3}
                          style={{
                            padding: "3px",
                            justifyContent: "space-around",
                            marginBottom: "5px",
                          }}
                        >
                          <div className="p-0">
                            <CommentModal />
                          </div>
                          {/* start to check */}
                          <div className="p-0">
                            {favorite.reposted.includes(userInfo._id) ? (
                              <div>
                                <svg
                                  onClick={() =>
                                    handleDeleteRepostSpesificProfilePage(
                                      favorite._id
                                    )
                                  }
                                  style={{ color: "rgb(0,186,124)" }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-repeat"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    stroke="black"
                                    strokeWidth="0.2"
                                    d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
                                  />
                                </svg>
                                <span
                                  className="post-description"
                                  style={{ color: "rgb(0,186,124)" }}
                                >
                                  {favorite.reposted.length}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <svg
                                  onClick={() => handleRepost(favorite._id)}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-repeat"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    stroke="black"
                                    strokeWidth="0.2"
                                    d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
                                  />
                                </svg>
                                <span className="post-description post-description-rest ">
                                  {favorite.reposted.length}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* finish to check  */}

                          {/* start to check */}
                          <div className="p-0">
                            {favorite.likes.includes(userInfo._id) ? (
                              <span>
                                <svg
                                  onClick={() =>
                                    handleDeleteLikeFromSpesificUserProfilePage(
                                      favorite._id
                                    )
                                  }
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="rgb(249, 24, 128)"
                                  className={`bi bi-heart-fill`}
                                  viewBox="0 0 17 16"
                                >
                                  <path
                                    stroke="black"
                                    strokeWidth="0.2"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                                  />
                                </svg>
                                <span className="post-description">
                                  {favorite.likes.length}
                                </span>
                              </span>
                            ) : (
                              <span>
                                {" "}
                                <svg
                                  onClick={() =>
                                    handlePostLikesFromSpesificUserProfilePage(
                                      favorite._id
                                    )
                                  }
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className={`bi bi-heart`}
                                  viewBox="0 0 17 16"
                                >
                                  <path
                                    stroke="black"
                                    strokeWidth="0.2"
                                    d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
                                  />
                                </svg>
                                <span className="post-description">
                                  {favorite.likes.length}
                                </span>
                              </span>
                            )}
                          </div>
                          {/* finish to check */}
                        </Stack>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </Col>
          ) : (
            <Col
              xs={12}
              sm={12}
              md={4}
              lg={6}
              className={`main-column ${showNotificationColumn}`}
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderTop: "none",
                borderBottom: "none",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "20px",
                  height: "100px",
                  padding: "8px",
                }}
              >
                Notifications
              </div>
              <Row
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              ></Row>

              <div className="all-notifications">
                {/* start to check with notification row for favorites  */}
                <div className="all-posts">
                  {notifications.map((notification, index) => (
                    <div key={notification._id}>
                      <div className="posts-details">
                        <div className="post-head">
                          <Stack
                            direction="horizontal"
                            gap={1}
                            style={{ padding: "3px" }}
                          ></Stack>

                          <Stack
                            direction="horizontal"
                            gap={1}
                            style={{ padding: "3px" }}
                          >
                            {/* NOTE INFO start to check If the notification is favorite */}
                            {notification.isFavorite.value ? (
                              <div>
                                {" "}
                                <div className="flex-container">
                                  <div className="p-0 ">
                                    <svg
                                      width={30}
                                      height={30}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      fill="rgba(249,24,128,1.00)"
                                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-vkub15 r-yucp9h"
                                    >
                                      <g>
                                        <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                                      </g>
                                    </svg>
                                  </div>
                                  <div className="notification-margin">
                                    {notification.isFavorite.profileImageUrl.slice(
                                      0,
                                      3
                                    ) !== "../" ? (
                                      <>
                                        <img
                                          src={
                                            notification.isFavorite.profileImageUrl.slice(
                                              0,
                                              3
                                            ) === "../"
                                              ? null
                                              : notification.isFavorite
                                                  .profileImageUrl
                                          }
                                          width={32}
                                          height={32}
                                          alt="image who liked the post"
                                        />
                                      </>
                                    ) : (
                                      <div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="32"
                                          height="32"
                                          fill="rgb(83, 100, 113)"
                                          className="bi bi-person-circle"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="favorite-notification-body">
                                  <div style={{ padding: "3px" }}>
                                    <span
                                      style={{
                                        fontWeight: "700",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Link
                                        style={{ color: " black" }}
                                        to={`/profile/${notification.isFavorite.senderId}`}
                                      >
                                        <span className="from-notification-to-user">
                                          {notification.isFavorite.userFullName}
                                        </span>
                                      </Link>
                                      <span
                                        style={{
                                          fontWeight: "400",
                                          lineHeight: "20px",
                                          fontSize: "15px",
                                        }}
                                      >
                                        {" "}
                                        liked your post
                                      </span>
                                    </span>
                                  </div>
                                  <div style={{ padding: "3px" }}>
                                    <span
                                      style={{ color: " rgb(83, 100, 113)" }}
                                    >
                                      {
                                        notification.isFavorite
                                          .favoritedPostContent
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            {/* NOTE INFO finish to check If the notification is favorite */}

                            {/* NOTE INFO start to check If the notification is repost */}

                            {notification.isRepost.value ? (
                              <div>
                                {" "}
                                <div className="flex-container">
                                  <div className="p-0 ">
                                    <div className="p-0 ">
                                      <svg
                                        style={{
                                          color: "rgb(0, 186, 124)",
                                        }}
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f r-yucp9h"
                                      >
                                        <g>
                                          <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path>
                                        </g>
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="notification-margin">
                                    {notification.isRepost.profileImageUrl.slice(
                                      0,
                                      3
                                    ) !== "../" ? (
                                      <>
                                        <img
                                          src={
                                            notification.isRepost.profileImageUrl.slice(
                                              0,
                                              3
                                            ) === "../"
                                              ? null
                                              : notification.isRepost
                                                  .profileImageUrl
                                          }
                                          width={32}
                                          height={32}
                                          alt="image who repost the post"
                                        />
                                      </>
                                    ) : (
                                      <div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="32"
                                          height="32"
                                          fill="rgb(83, 100, 113)"
                                          className="bi bi-person-circle"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="favorite-notification-body">
                                  <div style={{ padding: "3px" }}>
                                    <span
                                      style={{
                                        fontWeight: "700",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Link
                                        style={{ color: " black" }}
                                        to={`/profile/${notification.isRepost.senderId}`}
                                      >
                                        <span className="from-notification-to-user">
                                          {notification.isRepost.userUserName}
                                        </span>
                                      </Link>
                                      <span
                                        style={{
                                          fontWeight: "400",
                                          lineHeight: "20px",
                                          fontSize: "15px",
                                        }}
                                      >
                                        {" "}
                                        reposted your post
                                      </span>
                                    </span>
                                  </div>
                                  <div style={{ padding: "3px" }}>
                                    <span
                                      style={{ color: " rgb(83, 100, 113)" }}
                                    >
                                      {
                                        notification.isRepost
                                          .repostedPostContent
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </Stack>
                        </div>

                        <Row
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        ></Row>
                      </div>
                    </div>
                  ))}
                </div>
                {/* finish to check with notification row  */}
              </div>
            </Col>
          )}
          {/* 3.column burası olucak */}
          <Col
            className="side-bar-column"
            xs={12}
            sm={12}
            md={2}
            lg={3}
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

export default SpesificUserProfile;
