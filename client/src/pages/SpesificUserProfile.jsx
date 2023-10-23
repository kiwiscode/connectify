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
import { PostModal, LogoutModal } from "../components/ui/Modal";

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
  const handleShowSpesificUserProfilePagePosts = () => {
    axios
      .get(`${API_URL}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setPostWindow("");
        setFavoriteWindow("hide");
        setProfileInfo(response.data);
        setprofileInfoPosts(response.data.posts);
      })
      .catch((err) => {
        return err;
      });
  };

  const handleShowSpesificUserProfilePageFavorites = () => {
    axios
      .get(`${API_URL}/favorite`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFavoriteWindow("");
        setPostWindow("hide");
        setFavorites(response.data.favorites);
      })
      .catch((err) => {
        return err;
      });
  };

  useEffect(() => {
    if (postsWindow === "hide") {
      handleShowSpesificUserProfilePageFavorites();
    } else if (favoriteWindow === "hide") {
      handleShowSpesificUserProfilePagePosts();
    } else {
      return;
    }
  }, []);

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
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={3}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderLeft: "none",
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <nav className="nav-bar-home">
              <Link to={"/home"}>
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
                      <Link to="/home">
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
          {profileInfo && (
            <>
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
                        <Link
                          style={{ color: "rgb(83, 100, 113)" }}
                          to={"/home"}
                        >
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
                    <div className="spesific-profile-st1">
                      <span style={{}}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="25"
                          fill="currentColor"
                          className="bi bi-three-dots"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
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
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                        </svg>
                      </span>
                      <span style={{}}>Follow</span>
                    </div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "20px",
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
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
                        <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
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
                  </Row>
                </Container>
                {/* start */}
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
                    }}
                  >
                    {favoriteWindow === "" ? (
                      <span style={{ color: "rgb(29, 155, 240)" }}>Likes</span>
                    ) : (
                      <span>Likes </span>
                    )}
                  </Button>
                </ButtonGroup>

                {/* finish */}
                <div className={`all-posts ${postsWindow}`}>
                  {profileInfoPosts.map((post) => (
                    <div key={post._id}>
                      <hr style={{ width: "100" }} />
                      <div className="posts-details">
                        <div className="post-head">
                          <Stack direction="horizontal" gap={1}>
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
                                ·{" "}
                                {getCreatedDateForSpesificUserProfilePage(
                                  post.createdAt
                                )}
                              </span>
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
                        <div>{post.content}</div>
                        <Stack direction="horizontal" gap={3}>
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-recycle"
                              viewBox="0 0 16 16"
                            >
                              <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242-2.532-4.431zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24l2.552-4.467zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.498.498 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244l-1.716-3.004z" />
                            </svg>
                            <span className="post-description">
                              Num Of Reposts?
                            </span>
                          </div>

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
                                    handlePostLikesFromSpesificUserProfilePage(
                                      post._id
                                    )
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
                          {/* finish */}
                        </Stack>
                      </div>
                    </div>
                  ))}
                </div>

                {/* start */}
                <div className={`${favoriteWindow} all-favorites`}>
                  {favorites.map((favorite) => (
                    <div key={favorite._id}>
                      <hr style={{ width: "100" }} />
                      <div className="favorite-details">
                        <div className="favorite-head">
                          <Stack direction="horizontal" gap={1}>
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
                                ·{" "}
                                {getCreatedDateForSpesificUserProfilePage(
                                  favorite.createdAt
                                )}
                              </span>
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
                        <div>{favorite.content}</div>
                        <Stack direction="horizontal" gap={3}>
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-recycle"
                              viewBox="0 0 16 16"
                            >
                              <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242-2.532-4.431zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24l2.552-4.467zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.498.498 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244l-1.716-3.004z" />
                            </svg>
                            <span className="post-description">
                              Num Of Reposts?
                            </span>
                          </div>
                          {/* start  */}

                          <div>
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
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                              </svg>
                              <span className="post-description">
                                {favorite.likes.length}
                              </span>
                            </span>
                            {/* {favorite._id.includes(userInfo._id) ? (
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
                                  viewBox="0 0 16 16"
                                >
                                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                </svg>
                                <span className="post-description">
                                  {favorite.likes.length}
                                </span>
                              </span>
                            )} */}
                          </div>

                          {/* finish */}
                        </Stack>
                      </div>
                    </div>
                  ))}
                </div>

                {/* finish */}
              </Col>
            </>
          )}

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

export default SpesificUserProfile;
