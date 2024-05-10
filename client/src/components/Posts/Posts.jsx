import { Col, Container, Row } from "react-bootstrap";
import LeftSideNavBar from "../Main-Left-Side-Navbar/LeftSideNavbar";
import RightSideColumn from "../Main-Right-Side-Column/RightSideColumn";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { CommentModal } from "../ui/Modal";
import axios from "axios";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function Posts() {
  // { posts, handleShowPosts }
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);

  const { height, width } = useWindowDimensions();
  const { userInfo, getToken } = useContext(UserContext);
  const [shouldHide, setshouldHide] = useState(true);
  const [postId, setpostId] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [postsLoadingSpinner, setPostsLoadingSpinner] = useState(null);
  const [clickedPostBox, setclickedPostBox] = useState(null);

  const post = {
    _id: "661fc10756f28d9237fa0d46",
    authorFullName: "John doe",
    authorUserName: "johndoe",
    comments: [],
    content: "Hello World",
    createdAt: "2024-04-17T12:31:03.932Z",
    deactivatedOwner: false,
    image: {
      public_id: "connectify/nhvzn3qml3wmk02yycka",
      url: "https://res.cloudinary.com/ddqbb9yqj/image/upload/v1713357062/connectify/nhvzn3qml3wmk02yycka.png",
    },
    isComment: false,
    isReposted: true,
    likes: [],
    reposted: [
      { _id: "blabla", fullname: "Jane Doe" },
      { _id: "66133c4047cafff2b03c75e3" },
    ],
    repostedFromThisOriginalPost: [],
    updatedAt: "2024-04-17T12:53:02.084Z",
    userId: {
      active: false,
      birthDate: {
        month: "January",
        day: "16",
        year: "1996",
      },
      createdAt: "2024-04-08T00:37:20.448Z",
      deactivatedDate: null,
      email: "ayktkav@gmail.com",
      fullname: "John doe",
      imageUrl:
        "http://res.cloudinary.com/ddqbb9yqj/image/upload/v1712554903/connectify/h2pxpqklnj1mwn9ykr1u.jpg",
      username: "johndoe",
      _id: "66133c4047cafff2b03c75e3",
    },
  };

  const getRepostedIds = (array) => {
    return array.reposted.map((eachRepost) => {
      return eachRepost._id;
    });
  };
  const getLikerIds = (array) => {
    return array.likes.map((eachLiker) => {
      return eachLiker._id;
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

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

  const handleDeleteRepost = (postId) => {
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
        setTimeout(() => {
          //   handleShowPosts();
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
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
        setTimeout(() => {}, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePostLikes = (postId, findedPost) => {
    setpostId(postId);

    console.log("Post id =>", postId);

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
        console.log("We are here !!!");
        setTimeout(() => {}, 500);
      })
      .catch((error) => {
        console.log("Error message =>", error);

        if (error.response.data) {
          const { errorMessage } = error.response.data;
          setError(errorMessage);
        } else {
          setError(error);
        }
      });
  };
  const handleDeleteLike = (postId) => {
    setpostId(postId);
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
        setTimeout(() => {
          //   handleShowPostsHomePage();
        }, 500);
      })
      .catch((err) => {
        console.log("Error =>", err);
      });
  };
  const handleDeletePost = (postId) => {
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
        setTimeout(() => {
          //   handleShowPostsHomePage();
          //   setError("");
        }, 500);
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        // setError(errorMessage);
      });
  };
  const handleShowPostDetail = (postId) => {
    console.log(postId);
  };

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

  useEffect(() => {
    setPostsLoadingSpinner(true);

    setTimeout(() => {
      setPostsLoadingSpinner(false);
      //   handleShowPostsHomePage();
    }, 600);
  }, []);
  const [visibleTweets, setVisibleTweets] = useState(25);
  const [visibleFollowingTweets, setvisibleFollowingTweets] = useState(25);
  const handleShowMorePosts = () => {
    setVisibleTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

  const handleShowMoreFollowingTweets = () => {
    setvisibleFollowingTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

  return (
    <>
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
          <LeftSideNavBar />
          <Col
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={11} // 768px - 992px aralığı
            lg={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 5 : ""} // 992px - 1400px aralığı
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
            <>
              {/* start to check post box component  */}
              <div
                className="outside-of-inner-circle-post-info-user-info-svg-three-dots mt-5"
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  position: "relative",
                  cursor: "pointer",
                }}
                //   onClick={() => setclickedPostBox(post)}
              >
                <div
                  style={
                    {
                      //   backgroundColor: "blue",
                    }
                  }
                >
                  {/* start to check who reposted ??? */}
                  {post.reposted.length > 0 &&
                  post.isReposted &&
                  post.reposted[0]._id === userInfo._id ? (
                    <div
                      className="you-reposted-head"
                      style={{
                        cursor: "pointer",
                        marginLeft: "35px",
                      }}
                    >
                      <svg
                        style={{
                          color: "rgb(83, 100, 113)",
                        }}
                        width={`16px`}
                        height={`16px`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="repost-svg-post-box svg-repost-post box svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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
                          position: "relative",
                        }}
                        onClick={() => setclickedPostBox(post)}
                        to={`/profile/${post.reposted[0]._id}`}
                      >
                        You reposted
                      </Link>{" "}
                    </div>
                  ) : null}

                  {post.reposted.length > 0 &&
                  post.isReposted &&
                  post.reposted[0]._id !== userInfo._id ? (
                    <div
                      style={{
                        marginLeft: "35px",
                      }}
                    >
                      <svg
                        style={{
                          color: "rgb(83, 100, 113)",
                        }}
                        width={`16px`}
                        height={`16px`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="repost-svg-post-box svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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
                      <span>
                        {post.reposted[0].fullname ? (
                          <Link
                            style={{
                              fontSize: "13px",
                              lineHeight: "16px",
                              fontWeight: "700",
                              color: "rgb(83, 100, 113)",
                              marginLeft: "10px",
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                            className="hover-reposted-text"
                            onClick={() => setclickedPostBox(post)}
                            to={`/profile/${post.reposted[0]._id}`}
                          >
                            {post.reposted[0].fullname} reposted
                          </Link>
                        ) : null}
                      </span>{" "}
                    </div>
                  ) : null}
                  {/* finish to check who reposted ??? */}
                </div>

                {/* start to check profile image or profile svg ???  */}
                <div
                  style={{
                    //   float: "left",
                    position: "absolute",
                    left: "0px",
                    height: "84%",
                    //   backgroundColor: "yellow",
                    paddingLeft: "12px",
                  }}
                >
                  <div>
                    {post.userId.imageUrl.slice(0, 3) !== "../" ? (
                      <Link
                        className="post-circle-profile-image-on-point"
                        style={{ cursor: "pointer" }}
                        to={`/profile/${post ? post.userId._id : null}`}
                      >
                        <img
                          width={40}
                          height={40}
                          src={
                            post?.userId?.imageUrl
                              ? post?.userId?.imageUrl
                              : null
                          }
                          alt="??"
                          style={{ borderRadius: "50%" }}
                        />
                      </Link>
                    ) : (
                      <Link
                        className="post-circle-profile-svg-on-point"
                        to={`/profile/${post.userId ? post.userId._id : null}`}
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
                </div>
                {/* finish to check profile image or profile svg ???  */}

                {/* start to check fullname,verified icon,username,mid dot,created date,threedot,post content,post image,comment,repost,favorite icon */}
                <div
                  style={{
                    //   backgroundColor: "green",
                    position: "relative",
                    left: "59px",
                    width: "90%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div
                      className="hover-fullname"
                      style={{
                        color: themeName === "dark-theme" ? "white" : "",
                        fontWeight: "700",
                        fontSize: "15px",
                        lineHeight: "20px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.userId.fullname}
                    </div>
                    <div>
                      <span
                        style={{
                          margin: "5px",
                          position: "relative",
                          bottom: "5px",
                        }}
                        className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5"
                      >
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
                    </div>
                    <div
                      style={{
                        textDecoration: "none",
                        color: "rgb(83, 100, 113)",
                        lineHeight: "20px",
                        fontSize: "15px",
                        fontWeight: "400",
                      }}
                    >
                      {post.userId.username}
                    </div>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      {" "}
                      <span
                        className="post-circle-date-post-detail"
                        style={{
                          color: "rgb(83, 100, 113)",
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
                          marginLeft: "5px",
                        }}
                      >
                        {" "}
                        ·{" "}
                        <span className="date-post-detail">
                          {getCreatedDate(post.createdAt)}
                        </span>
                      </span>
                    </div>

                    <div className="ms-auto">
                      {" "}
                      <span className="svg-three-dots-post-detail">
                        {/* show if post owner userId !equal currentUserId */}
                        {post.userId && post.userId._id !== userInfo._id ? (
                          <svg
                            style={{
                              cursor: "pointer",
                              backgroundColor: "rgb(29, 155, 240)",
                            }}
                            onClick={() => handleShowPostDetail(post._id)}
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
                            onClick={() => handleDeletePost(post._id)}
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
                  </div>

                  <div>
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
                      Replying to
                    </span>
                    <span
                      className="replying-to-text"
                      style={{
                        color: "rgb(29, 155, 240)",
                        cursor: "pointer",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
                        marginLeft: "5px",
                      }}
                    >
                      @{post.userId.username}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "400",
                      lineHeight: "20px",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      cursor: "pointer",
                      color: themeName === "dark-theme" ? "white" : "",
                    }}
                  >
                    {post.content}
                  </div>

                  {post.image.url !== "image@url" ? (
                    <div
                      style={{
                        overflow: "hidden",
                        border: "1px solid #ddd",
                        borderRadius: "16px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        marginRight: "10px",
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
                  ) : null}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      onClick={() => setclickedPostBox(post)}
                      className="p-1 next-to-comment"
                    >
                      <CommentModal
                        post={post ? post : null}
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                        // refreshPosts={handleShowPostsHomePage}
                        // setLoadingFalse={setLoadingFalse}
                        // setLoadingTrue={setLoadingTrue}
                        // postSharedMessage={postSharedMessage}
                      />
                    </div>
                    <div
                      onClick={() => setclickedPostBox(post)}
                      className="p-1 next-to-repost"
                    >
                      {post.reposted.length > 0 &&
                      getRepostedIds(post).includes(userInfo._id) ? (
                        <div>
                          <svg
                            onClick={() => handleDeleteRepost(post._id)}
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
                            style={{
                              color: "rgb(0, 186, 124)",
                            }}
                            className="post-description"
                          >
                            {/* some test */}
                            {post.reposted.length ? (
                              <span>{post.reposted.length}</span>
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
                            onClick={() => handleRepost(post._id, post)}
                            width={`${1.25}em`}
                            height={`${1.25}em`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                            fill={
                              !shouldHide &&
                              post.reposted.includes(userInfo._id)
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
                              color:
                                !shouldHide &&
                                post.reposted.includes(userInfo._id)
                                  ? "rgb(0, 186, 124)"
                                  : "rgb(83, 100, 113)",
                            }}
                          >
                            {post.reposted.length ? (
                              <span>{post.reposted.length}</span>
                            ) : null}
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      to={`/${post.userId.username}/status/${
                        !post.isReposted
                          ? post._id
                          : post.repostedFromThisOriginalPost[0]?._id
                      }`}
                      onClick={() => setclickedPostBox(post)}
                      className="p-1 next-to-like"
                    >
                      {getLikerIds(post).includes(userInfo._id) ? (
                        <div>
                          <svg
                            onClick={() => handleDeleteLike(post._id)}
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
                            // real time notification start to check test
                            onClick={() => handlePostLikes(post._id, post)}
                            // real time notification finish to check test

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
                </div>
                {/* finish to check fullname,verified icon,username,mid dot,created date,threedot,post content,post image,comment,repost,favorite icon */}
              </div>
              {/* finish to check post box component  */}
            </>

            {/* <div
              style={{
                textAlign: "center",
                fontSize: "36px",
                fontWeight: "800",
                lineHeight: "32px",
              }}
            >
              Post Box Component Test
            </div>
            <div
              className="mt-5"
              style={{
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            ></div> */}
            {}
          </Col>
          <RightSideColumn />
        </Row>
      </Container>
    </>
  );
}

export default Posts;
