import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Stack } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostModal, LogoutModal, CommentModal } from "../components/ui/Modal";
import { UserContext } from "../context/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function PostDetailPage() {
  const { postOwner, postId, socket } = useParams();
  const [detailedPost, setdetailedPost] = useState([]);
  const { userInfo, getToken } = useContext(UserContext);

  // socket io 1 client start to check
  const [notificationTest, setnotificationTest] = useState([]);
  const [notificationText, setnotificationText] = useState([]);
  // socket io 1 client finish to check

  // start to check
  const navigate = useNavigate();

  const redirectHomePage = () => {
    navigate("/home");
    window.location.reload();
  };

  const redirectToMessages = () => {
    navigate("/messages");
    window.location.reload();
  };

  const redirectProfilePage = () => {
    navigate("/profile");
    window.location.reload();
  };

  const redirectSpesificProfilePage = (userId) => {
    navigate(`/profile/${userId}`);
    window.location.reload();
  };

  // finish to check

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDeleteRepostPostDetailPage = (postId) => {
    console.log("I AM WORKING BECAUSE NOW I AM ACTIVE AS A REPOST");
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

  const handleRepost = (postId) => {
    console.log("I AM WORKING NOW BECAUSE I AM NOT ACTIVE AS A REPOST ");

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
        const posts = JSON.parse(localStorage.getItem("posts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });

        const index = posts.indexOf(findedPost);

        posts[index].reposted.unshift(userInfo);

        localStorage.setItem("mainPagePosts", JSON.stringify(posts));

        console.log("AFTER REPOST CURRENT STATE RENDERED POSTS =>", posts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteLikePostDetailPage = (postId) => {
    console.log("clicked...");
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
        console.log("Post like deleted !");
      })
      .catch((err) => {
        return err;
      });
  };

  const handlePostLikesPostDetailPage = (postId) => {
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
        console.log("This post added to your favorite");
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        console.log("Error =>", errorMessage);
      });
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/${postOwner}/status/${postId}`)
      .then((response) => {
        const { detailedPost } = response.data;
        setdetailedPost(detailedPost);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const checkIds = (arr) => {
    if (arr.length) {
      return arr.map((eachItem) => {
        return eachItem._id;
      });
    }
  };

  function formatDateString(inputDateString) {
    const inputDate = new Date(inputDateString);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${inputDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })} · ${
      months[inputDate.getMonth()]
    } ${inputDate.getDate()}, ${inputDate.getFullYear()}`;
  }

  console.log(detailedPost);
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
          <Col className="left-column" xs={12} sm={12} md={1} lg={3} xxl={3}>
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

              <div className="inner-div-fonts inner-div ">
                <Link onClick={redirectHomePage} to="/home">
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

                <Link>
                  <div className="notifications">
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
                        {/* {getTotalLengthOfNotifications() !== "" ? (
                          <span className="notification-num">
                            {getTotalLengthOfNotifications()}
                          </span>
                        ) : null} */}
                      </span>
                    </div>
                  </div>
                </Link>
                {/* start to check redirect to the correct component for messages */}

                <Link to="/messages" onClick={redirectToMessages}>
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
                {/* finish to check redirect to the correct component for messages */}

                <Link onClick={redirectProfilePage} to="/profile">
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

                <PostModal
                  // IMPORTANT => calling the refreshPosts as a prop from PostModal component and refreshing the posts !
                  refreshPosts={() => handleShowPostsHomePage()}
                  setLoadingTrue={() => setLoadingTrue()}
                  setLoadingFalse={() => setLoadingFalse()}
                ></PostModal>
              </div>

              <LogoutModal></LogoutModal>
            </nav>
          </Col>

          <Col
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={11} // 768px - 992px aralığı
            lg={6} // 1200px - 1400px aralığı
            xxl={6} // 1400px ve sonrası aralığı
            className={`main-column `}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <Stack direction="horizontal" gap={3}>
              <div
                className="p-2 arrow"
                style={{
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <Link onClick={handleGoBack}>
                  <svg
                    style={{
                      display: "inline-block",
                      marginBottom: "2px",
                      border: "none",
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
                </Link>
              </div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "20px",
                }}
                className="p-2"
              >
                Post
              </div>
            </Stack>
            <Stack direction="horizontal" gap={3}>
              <div className="p-2">
                {detailedPost.userId ? (
                  <Link
                    onClick={() =>
                      redirectSpesificProfilePage(detailedPost.userId._id)
                    }
                    style={{ cursor: "pointer" }}
                    to={`/profile/${
                      detailedPost ? detailedPost.userId._id : null
                    }`}
                  >
                    <img
                      width={40}
                      height={40}
                      src={detailedPost.userId.imageUrl}
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link
                    onClick={() =>
                      redirectSpesificProfilePage(detailedPost.userId._id)
                    }
                    to={`/profile/${
                      detailedPost.userId ? detailedPost.userId._id : null
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
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                  </Link>
                )}
              </div>
              <div className="p-2">
                <Link
                  onClick={() =>
                    redirectSpesificProfilePage(detailedPost.userId._id)
                  }
                  to={
                    detailedPost.userId
                      ? `/profile/${detailedPost.userId._id}`
                      : ""
                  }
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <div
                    className="post-detail-underline-text-2"
                    style={{
                      color: "black",
                      lineHeight: "20px",
                      fontWeight: "700",
                      fontSize: "15px",
                    }}
                  >
                    {detailedPost.authorFullName}
                  </div>
                </Link>
                <Link
                  onClick={() =>
                    redirectSpesificProfilePage(detailedPost.userId._id)
                  }
                  to={
                    detailedPost.userId
                      ? `/profile/${detailedPost.userId._id}`
                      : ""
                  }
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      color: "rgb(83,100,113)",
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    @{detailedPost.authorUserName}
                  </div>
                </Link>
              </div>
              <div className="p-2 ms-auto">
                <svg
                  style={{
                    color: "rgb(83, 100, 113)",
                    fontSize: "15px",
                    lineHeight: "20px",
                  }}
                  fill="currentColor"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                >
                  <g>
                    <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                  </g>
                </svg>
              </div>
            </Stack>

            <Stack
              direction="vertical"
              gap={0}
              className="mt-3"
              style={{
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: "400",
                  lineHeight: "24px",
                }}
                className="p-2"
              >
                {detailedPost.content}
              </div>
              <Link
                to={
                  detailedPost.userId
                    ? `/${detailedPost.userId.username}/status/${detailedPost._id}`
                    : null
                }
                style={{
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    color: "rgb(83, 100, 113",
                    fontSize: "15px",
                    fontWeight: "400",
                    lineHeight: "20px",
                  }}
                  className="p-2 post-detail-underline-text-1"
                >
                  {formatDateString(detailedPost.createdAt)}
                </div>
              </Link>
            </Stack>

            <Stack
              direction="horizontal"
              style={{
                justifyContent: "space-around",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <div className="p-2">
                <CommentModal post={detailedPost} />
              </div>
              <div className="p-2">
                {detailedPost.reposted && detailedPost.reposted.length ? (
                  checkIds(detailedPost.reposted).includes(userInfo._id) ? (
                    <div>
                      <svg
                        onClick={() =>
                          handleDeleteRepostPostDetailPage(detailedPost._id)
                        }
                        width={18}
                        height={18}
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
                        className="post-description"
                        style={{
                          color: "rgb(0, 186, 124)",
                          //   : "rgb(83, 100, 113)",
                        }}
                      >
                        <span>{detailedPost.reposted.length}</span>
                      </span>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <svg
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => handleRepost(detailedPost._id)}
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                        fill={"rgb(83, 100, 113)"}
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
                        style={{ color: "rgb(83, 100, 113)" }}
                      >
                        <span>{detailedPost.reposted.length}</span>
                      </span>
                    </div>
                  )
                ) : (
                  <div>
                    {" "}
                    <svg
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => handleRepost(detailedPost._id)}
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                      fill={"rgb(83, 100, 113)"}
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
                        color: "rgb(83, 100, 113)",
                      }}
                    >
                      <span>
                        {detailedPost.reposted && detailedPost.reposted.length
                          ? detailedPost.reposted.length
                          : null}
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2">
                {detailedPost.likes && detailedPost.likes.length ? (
                  checkIds(detailedPost.likes).includes(userInfo._id) ? (
                    <div>
                      <svg
                        onClick={() =>
                          handleDeleteLikePostDetailPage(detailedPost._id)
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
                        {detailedPost.likes.length ? (
                          <span
                            style={{
                              color: "rgb(249, 24, 128)",
                            }}
                          >
                            {detailedPost.likes.length}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <svg
                        onClick={() =>
                          handlePostLikesPostDetailPage(detailedPost._id)
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
                        {detailedPost.likes.length ? (
                          <span>{detailedPost.likes.length}</span>
                        ) : null}
                      </span>
                    </div>
                  )
                ) : (
                  <div>
                    {" "}
                    <svg
                      onClick={() =>
                        handlePostLikesPostDetailPage(detailedPost._id)
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
                    <span className="post-description">{null}</span>
                  </div>
                )}
              </div>
            </Stack>
          </Col>
          {/* 3.column burası olucak */}
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

export default PostDetailPage;
