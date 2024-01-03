import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Stack,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LogoutModal, PostModal, CommentModal } from "../components/ui/Modal";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function UserProfile() {
  const navigate = useNavigate();
  const [userprofiledata, setUserprofiledata] = useState([]);
  const { getToken, userInfo } = useContext(UserContext);
  const [favoriteWindow, setFavoriteWindow] = useState("hide");
  const [postsWindow, setPostWindow] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [postId, setpostId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setprofileImage] = useState("");
  const [completedProfileImage, setcompletedProfileImage] = useState(false);

  const [showNotificationColumn, setshowNotificationColumn] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleShowPostsProfilePage = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFavoriteWindow("hide");
        setPostWindow("");

        localStorage.setItem(
          "profilePosts",
          JSON.stringify(response.data.posts)
        );
        console.log("Profile posts =>", response);
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
          handleGetFavorites();
        } else if (postsWindow === "") {
          handleShowPostsProfilePage();
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

  const handlePostLikesFromProfilePage = (postId) => {
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
          handleGetFavorites();
        } else if (postsWindow === "") {
          handleShowPostsProfilePage();
        }

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        userInfo.favorites.push(postId);

        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        setError("");
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        setError(errorMessage);
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
          handleGetFavorites();
        } else if (postsWindow === "") {
          handleShowPostsProfilePage();
        }
      })
      .catch((err) => {
        return err;
      });
  };

  const handleGetFavorites = () => {
    axios
      .get(`${API_URL}/favorite`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFavoriteWindow("");
        setPostWindow("hide");

        localStorage.setItem(
          "profileFavorites",
          JSON.stringify(response.data.favorites)
        );
        console.log("Profile favorites =>", response);
        setFavorites(response.data.favorites);
      })
      .catch((err) => {
        return err;
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

  const handleRepost = (postId) => {
    console.log("ID =>", postId);

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
          const profileFavorites = JSON.parse(
            localStorage.getItem("profileFavorites")
          );

          const findedFavorite = favorites.find((element) => {
            return element._id === postId;
          });

          const index2 = favorites.indexOf(findedFavorite);
          console.log("LINE 1 WORKING");
          profileFavorites[index2].reposted.unshift(userInfo._id);

          console.log("LINE 2 WORKING");

          localStorage.setItem(
            "profileFavorites",
            JSON.stringify(profileFavorites)
          );
          console.log("LINE 3 WORKING");

          setFavorites(profileFavorites);
          // finish to check
          console.log("LINE 4 WORKING");
        } else if (favoriteWindow === "hide") {
          const profilePosts = JSON.parse(localStorage.getItem("profilePosts"));

          const findedPost = profilePosts.find((element) => {
            return element._id === postId;
          });

          console.log("Finded post => ", findedPost.reposted);
          const index = profilePosts.indexOf(findedPost);

          profilePosts[index].reposted.unshift(userInfo._id);

          localStorage.setItem("profilePosts", JSON.stringify(profilePosts));

          setUserprofiledata(profilePosts);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteRepostProfilePage = (postId) => {
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

  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log("FILE FROM PROFILE PICTURE PROCESS =>", file);
    setFileToBase(file);
    console.log(file);
    console.log("PROFILE IMAGE CURRENT INSIDE HANDLEIMAGE=>", profileImage);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    console.log("SET FILE TO BASE FILE =>", file);

    reader.onloadend = () => {
      setprofileImage(reader.result);

      console.log(
        "PROFILE IMAGE CURRENT INSIDE SETFILETOBASE=>",
        reader.result.slice(0, 21)
      );
    };
  };
  console.log("PROFILE IMAGE CURRENT GLOBAL PAGE=>", profileImage.slice(0, 21));

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
        console.log("RESPONSE AFTER POST PROFILE IMAGE =>", response);
        console.log(
          "WE SEND THIS PROFILE IMAGE FROM BODY TO SERVER =>",
          profileImage.slice(0, 21)
        );

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log(userInfo.imageUrl);

        console.log(`"${response.data.url}"`);
        userInfo.imageUrl = response.data.url;

        const updatedUserInfo = userInfo;
        console.log(updatedUserInfo);
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        setcompletedProfileImage(true);

        navigate("/profile");
        window.location.reload();
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
  console.log(getTotalLengthOfNotifications());
  //  NOTE finish to check calculation the length according isReaded value

  useEffect(() => {
    if (postsWindow === "hide") {
      handleGetFavorites();
    } else if (favoriteWindow === "hide") {
      handleShowPostsProfilePage();
    }
    changeProfileImage();
  }, [profileImage, postsWindow, favoriteWindow]);

  console.log("NOTIFICATIONS =>", notifications);
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
        console.log(response.data.notifications);
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
            <nav className="nav-bar-home ">
              <a href="/home">
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
              </a>

              <div className="inner-div">
                <Link to="/home">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-house"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="black"
                          strokeWidth="0.5"
                          d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"
                        />
                      </svg>

                      <span>Home</span>
                    </div>
                  </div>
                </Link>

                <Link>
                  <div>
                    <div onClick={() => showNotifications()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-bell"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="black"
                          strokeWidth="0.5"
                          d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"
                        />
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
                <Link href="">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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
                      <span>Messages</span>
                    </div>
                  </div>
                </Link>

                <Link href="">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-people"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="black"
                          strokeWidth="0.5"
                          d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
                        />
                      </svg>
                      <span>Communities</span>
                    </div>
                  </div>
                </Link>

                <Link href="">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-person"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="black"
                          strokeWidth="0.5"
                          d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"
                        />
                      </svg>

                      <span>Profile</span>
                    </div>
                  </div>
                </Link>
                <PostModal
                  refreshPosts={() => handleShowPostsProfilePage()}
                  setLoadingTrue={() => setLoadingTrue()}
                  setLoadingFalse={() => setLoadingFalse()}
                ></PostModal>
              </div>
              <LogoutModal></LogoutModal>
            </nav>
          </Col>

          {/* start to check  main column */}

          {showNotificationColumn === false ? (
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
                      {userInfo.imageUrl.slice(0, 3) !== "../" ? (
                        <>
                          <div>
                            <img
                              style={{
                                cursor: "pointer",
                              }}
                              src={userInfo.imageUrl}
                              alt=""
                              onClick={() =>
                                document
                                  .getElementById("formuploadModal")
                                  .click()
                              }
                            />
                            <input
                              onChange={handleImage}
                              type="file"
                              id="formuploadModal"
                              name="modalImage"
                              className="form-control"
                              style={{ display: "none" }}
                            />
                          </div>
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
                            style={{ cursor: "pointer" }}
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
                    <div>
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                      >
                        {userInfo.following && (
                          <span>{userInfo.following.length}</span>
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
                        {userInfo.followers && (
                          <span>{userInfo.followers.length}</span>
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
                <Button
                  onClick={() => handleShowPostsProfilePage()}
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
                  onClick={() => handleGetFavorites()}
                  variant="secondary"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "none",
                    borderLeft: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  {favoriteWindow === "" ? (
                    <span
                      style={{
                        color: "rgb(29, 155, 240)",
                      }}
                    >
                      Likes
                    </span>
                  ) : (
                    <span>Likes </span>
                  )}
                </Button>
              </ButtonGroup>
              {!userprofiledata.length && postsWindow === "" ? (
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
              {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}
              <div className={`all-posts ${postsWindow}`}>
                {userprofiledata.map((post) => (
                  <div key={post._id}>
                    <Row
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                      }}
                    ></Row>

                    {post.reposted.includes(userInfo._id) && post.isReposted ? (
                      <svg
                        width={18}
                        height={18}
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
                    ) : (
                      <div>{""}</div>
                    )}
                    {post.reposted.includes(userInfo._id) && post.isReposted ? (
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
                      </span>
                    ) : (
                      <div>{""}</div>
                    )}
                    <div className="posts-details">
                      <div className="post-head">
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
                          <div className="p-0">
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
                                  {getCreatedDate(post.createdAt)}
                                </span>
                              </span>
                            </Link>
                          </div>
                          <div className="ps-2 ms-auto">
                            <span>
                              {/* show if post owner userId !equal currentUserId */}
                              {post.userId &&
                              post.userId._id !== userInfo._id ? (
                                <svg
                                  onClick={() =>
                                    handleShowDetailPostFromProfilePage(
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
                                    handleDeletePostFromProfilePage(post._id)
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
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleDeleteRepostProfilePage(post._id)
                              }
                              width={18}
                              height={18}
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
                              onClick={() =>
                                handleDeleteRepostProfilePage(post._id)
                              }
                              width={18}
                              height={18}
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

                          {/* start  */}
                        </div>

                        {/* finish to check  */}
                        <div className="p-0">
                          <div>
                            {post.likes.includes(userInfo._id) ? (
                              <span>
                                <svg
                                  onClick={() =>
                                    handleDeleteLikeFromProfilePage(post._id)
                                  }
                                  width={18}
                                  height={18}
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
                                  {post.likes.length}
                                </span>
                              </span>
                            ) : (
                              <span>
                                {" "}
                                <svg
                                  onClick={() =>
                                    handlePostLikesFromProfilePage(post._id)
                                  }
                                  width="18"
                                  height="18"
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
                                  {post.likes.length}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </Stack>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`${favoriteWindow} all-favorites`}>
                {favorites.map((favorite) => (
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
                                  {getCreatedDate(favorite.createdAt)}
                                </span>
                              </span>
                            </Link>
                          </div>
                          <div className="ps-2 ms-auto">
                            <span>
                              {/* show if post owner userId !equal currentUserId */}
                              {favorite.userId !== userInfo._id ? (
                                <svg
                                  onClick={() =>
                                    handleShowDetailPostFromProfilePage(
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
                                    handleDeletePostFromProfilePage(
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
                        <div style={{ padding: "3px" }}>{favorite.content}</div>
                      </Link>{" "}
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
                        <div className="p-0">
                          {favorite.reposted.includes(userInfo._id) ? (
                            <svg
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleDeleteRepostProfilePage(favorite._id)
                              }
                              width={18}
                              height={18}
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
                              onClick={() => handleRepost(favorite._id)}
                              width={18}
                              height={18}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="svg-repeat r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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

                          {favorite.reposted.includes(userInfo._id) ? (
                            <span
                              className="post-description"
                              style={{
                                color: "rgb(0, 186, 124)",
                              }}
                            >
                              {favorite.reposted.length}
                            </span>
                          ) : (
                            <span
                              className="post-description"
                              style={{
                                color: "rgb(83, 100, 113)",
                              }}
                            >
                              {favorite.reposted.length}
                            </span>
                          )}

                          {/* start  */}
                        </div>
                        <div>
                          {favorite.likes.includes(userInfo._id) ? (
                            <span>
                              <svg
                                onClick={() =>
                                  handleDeleteLikeFromProfilePage(favorite._id)
                                }
                                width={18}
                                height={18}
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
                                {favorite.likes.length}
                              </span>
                            </span>
                          ) : (
                            <span>
                              {" "}
                              <svg
                                onClick={() =>
                                  handlePostLikesFromProfilePage(favorite._id)
                                }
                                width={18}
                                height={18}
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
                                {favorite.likes.length}
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

              {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}
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

          {/* 3.column burası olucak  */}
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

export default UserProfile;
