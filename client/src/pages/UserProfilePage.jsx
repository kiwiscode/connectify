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
import { Link } from "react-router-dom";
import { LogoutModal, PostModal } from "../components/ui/Modal";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function UserProfile() {
  const [userprofiledata, setUserprofiledata] = useState([]);
  const { getToken, userInfo } = useContext(UserContext);
  const [favoriteWindow, setFavoriteWindow] = useState("hide");
  const [postsWindow, setPostWindow] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [postId, setpostId] = useState("");

  useEffect(() => {
    if (postsWindow === "hide") {
      handleGetFavorites();
    } else if (favoriteWindow === "hide") {
      handleShowPostsProfilePage();
    } else {
      return;
    }
  }, []);

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

  return (
    <>
      <Container
        style={{
          justifyContent: "center",
        }}
      >
        <Row
          style={{
            height: "100vh",
            borderTop: "none",
            borderBottom: "none",
          }}
        >
          <Col xs={12} sm={12} md={6} lg={3} style={{ height: "100%" }}>
            <nav className="nav-bar-home">
              <a href="">
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
                <a href="">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="25"
                        fill="currentColor"
                        className="bi bi-house"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                      </svg>
                      <Link to={"/home"}>
                        <span>Home</span>
                      </Link>
                    </div>
                  </div>
                </a>

                <a href="">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="25"
                        fill="currentColor"
                        className="bi bi-bell"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                      </svg>
                      <span>Notifications</span>
                    </div>
                  </div>
                </a>
                <a href="">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="25"
                        fill="currentColor"
                        className="bi bi-envelope"
                        viewBox="0 0 20 20"
                      >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                      </svg>
                      <span>Messages</span>
                    </div>
                  </div>
                </a>

                <a href="">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="25"
                        fill="currentColor"
                        className="bi bi-people"
                        viewBox="0 0 20 20"
                      >
                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                      </svg>
                      <span>Communities</span>
                    </div>
                  </div>
                </a>

                <a href="">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="25"
                        fill="currentColor"
                        className="bi bi-person"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                      </svg>
                      <Link to="/profile">
                        <span>Profile</span>
                      </Link>
                    </div>
                  </div>
                </a>
                <PostModal></PostModal>
              </div>
              <LogoutModal></LogoutModal>
            </nav>
          </Col>

          <Col
            xs={12}
            sm={12}
            md={4}
            lg={6}
            style={{
              className: "main-column",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderTop: "none",
              borderBottom: "none",
              height: "100%",
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
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
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
              </Row>
            </Container>
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
                }}
              >
                {favoriteWindow === "" ? (
                  <span style={{ color: "rgb(29, 155, 240)" }}>Likes</span>
                ) : (
                  <span>Likes </span>
                )}
              </Button>
            </ButtonGroup>
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
                      style={{
                        color: "rgb(83, 100, 113)",
                        fontSize: "15px",
                        marginLeft: "5px",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-repeat"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
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
                        <div className="p-0">
                          <span style={{ fontWeight: "700" }}>
                            {post.authorFullName}{" "}
                          </span>
                        </div>
                        <div className="p-0 verified-icon">
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-patch-check-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                          </svg>
                        </div>
                        <div className="p-0">
                          {" "}
                          <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                            @{post.authorUserName}
                          </span>
                          <span style={{ color: "rgba(0,0,0,0.6)" }}>
                            {" "}
                            · {getCreatedDate(post.createdAt)}
                          </span>
                          {userInfo._id === post.userId ? (
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
                          ) : (
                            <svg
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
                          )}
                        </div>
                      </Stack>
                    </div>
                    <div style={{ padding: "3px" }}>{post.content}</div>
                    <Stack
                      direction="horizontal"
                      gap={3}
                      style={{ padding: "3px" }}
                    >
                      <div className="p-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-chat"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                        </svg>
                        <span className="post-description">
                          Num Of Comments?
                        </span>
                      </div>
                      {/* <div className="p-0">
                        <svg
                          onClick={() => handleRepost(post._id)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill={
                            // !shouldHide &&
                            post.reposted.includes(userInfo._id)
                              ? "rgb(0, 186, 124)"
                              : "rgb(83, 100, 113)"
                          }
                          className="bi bi-repeat"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                        </svg>
                        <span
                          onClick={() =>
                            handleDeleteRepostProfilePage(post._id)
                          }
                          className="post-description"
                          style={{
                            color:
                              // !shouldHide &&
                              post.reposted.includes(userInfo._id)
                                ? "rgb(0, 186, 124)"
                                : "rgb(83, 100, 113)",
                          }}
                        >
                          {post.reposted.length}
                        </span>
                      </div> */}
                      {/* start to check */}
                      <div className="p-0">
                        {post.reposted.includes(userInfo._id) ? (
                          <svg
                            onClick={() =>
                              handleDeleteRepostProfilePage(post._id)
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
                            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
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
                            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
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
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="rgb(249, 24, 128)"
                                className={`bi bi-heart-fill`}
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
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
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className={`bi bi-heart`}
                                viewBox="0 0 16 16"
                              >
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
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
                  {/* {favorite.reposted.includes(userInfo._id) ? (
                    <svg
                      style={{
                        color: "rgb(83, 100, 113)",
                        fontSize: "15px",
                        marginLeft: "5px",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-repeat"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                    </svg>
                  ) : (
                    <div>{""}</div>
                  )} */}
                  {/* {favorite.reposted.includes(userInfo._id) ? (
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
                  )} */}
                  <div className="favorite-details">
                    <div className="favorite-head">
                      <Stack
                        direction="horizontal"
                        gap={1}
                        style={{ padding: "3px" }}
                      >
                        <div className="p-0">
                          <span style={{ fontWeight: "700" }}>
                            {favorite.authorFullName}{" "}
                          </span>
                        </div>
                        <div className="p-0 verified-icon">
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-patch-check-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                          </svg>
                        </div>
                        <div className="p-0">
                          {" "}
                          <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                            @{favorite.authorUserName}
                          </span>
                          <span style={{ color: "rgba(0,0,0,0.6)" }}>
                            {" "}
                            · {getCreatedDate(favorite.createdAt)}
                          </span>
                          <span>
                            {/* show if post owner userId !equal currentUserId */}
                            {favorite.userId !== userInfo._id ? (
                              <svg
                                // onClick={() =>
                                //   handleShowDetailPostFromProfilePage(post._id)
                                // }
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
                                  handleDeletePostFromProfilePage(favorite._id)
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
                    <div style={{ padding: "3px" }}>{favorite.content}</div>
                    <Stack
                      direction="horizontal"
                      gap={3}
                      style={{ padding: "3px" }}
                    >
                      <div className="p-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-chat"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                        </svg>
                        <span className="post-description">
                          Num Of Comments?
                        </span>
                      </div>
                      <div className="p-0">
                        {favorite.reposted.includes(userInfo._id) ? (
                          <svg
                            onClick={() =>
                              handleDeleteRepostProfilePage(favorite._id)
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
                            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                          </svg>
                        ) : (
                          <svg
                            onClick={() => handleRepost(favorite._id)}
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
                            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
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
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="rgb(249, 24, 128)"
                              className={`bi bi-heart-fill`}
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                            </svg>
                            <span className="post-description">
                              {favorite.likes.length}
                            </span>
                          </span>
                        ) : (
                          <span>
                            {" "}
                            <svg
                              // onClick={() => handlePostLikes(post._id)}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className={`bi bi-heart`}
                              viewBox="0 0 16 16"
                            >
                              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                            </svg>
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

          <Col
            className="side-bar-column"
            xs={12}
            sm={12}
            md={3}
            lg={3}
            style={{
              height: "100%",
            }}
          ></Col>
        </Row>
      </Container>
    </>
  );
}

export default UserProfile;
