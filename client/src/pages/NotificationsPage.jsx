import { Col, Stack } from "react-bootstrap";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { CommentModal } from "../components/ui/Modal";
import ResponsiveNavigationBarTop from "../components/Navbar/ResponsiveNavigationTop";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function NotificationsPage() {
  const { getToken } = useContext(UserContext);
  const { width } = useWindowDimensions();

  const [isSubModalOpened, setIsSubModalOpened] = useState(false);
  const [tabIndexValue, settabIndexValue] = useState(null);

  const handleModalToggle = (modalOpen) => {
    setIsSubModalOpened(modalOpen);
  };
  const handleReceiveTabIndexValue = (value) => {
    settabIndexValue(value);
  };

  const [subscriptionCompletedStatus, setsubscriptionCompletedStatus] =
    useState(null);
  const [{ theme, themeName }] = useContext(ThemeContext);

  const [allNotifications, setAllNotifications] = useState([]);

  const getAllNotifications = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/notifications/all-notifications`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const { allNotifications } = await response.data;

      setAllNotifications(allNotifications);
    } catch (error) {
      console.error(
        "Error occured while fetching all notifications from server =>",
        error
      );
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  console.log("All notifications =>", allNotifications);

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

  const { userInfo } = useContext(UserContext);

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
        setTimeout(() => {
          getAllNotifications();
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteRepostNotificationsPage = (postId) => {
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
          getAllNotifications();
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const handlePostLikesFromNotificationsPage = (postId, findedPost) => {
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
        setTimeout(() => {
          getAllNotifications();
        }, 500);
      })
      .catch((error) => {
        console.log("Error message =>", error);
      });
  };

  const handleDeleteLikeFromNotificationsPage = (postId) => {
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
          getAllNotifications();
        }, 500);
      })
      .catch((err) => {
        console.log("Error =>", err);
      });
  };

  const [dataFromCommentModal, setDataFromCommentModal] = useState("");
  function handleDataFromCommentModal(data) {
    console.log("Data =>", data);
    setDataFromCommentModal(data);
  }
  const { isPostModalVisible } = useContext(ModalVisibilityContext);

  const { postSharedMessage, postDeletedMessage, contextHolder } =
    useAntdMessageHandler();

  return (
    <>
      {contextHolder}
      <ResponsiveNavigationBarTop />{" "}
      {!isPostModalVisible && !dataFromCommentModal && (
        <ResponsiveNavigationBarBottom />
      )}
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
          minHeight: width <= 700 ? "100vh" : "",
        }}
      >
        <Stack
          style={{
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
          direction="horizontal"
          gap={3}
          className="mt-2"
        >
          <Link className="responsive-home-arrow" to={"/home"}>
            <svg
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
          <div
            style={{
              lineHeight: "24px",
              fontWeight: "700",
              fontSize: "20px",
            }}
            className="p-2"
          >
            Notifications
          </div>
          {/* settings icon start to check  */}
          <div
            // className="p-2 ms-auto settings-icon"
            className={`p-2 ms-auto settings-icon settings-icon-${themeName}`}
            style={{
              cursor: "pointer",
              borderRadius: "50%",
              position: "relative",
              width: "40px",
              height: "40px",
            }}
          >
            <svg
              style={{
                lineHeight: "20px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
              }}
              color={themeName === "dark-theme" ? "white" : ""}
              fill="currentColor"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="messages-settings-and-privacy r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
            >
              <g>
                <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
              </g>
            </svg>
          </div>
          {/* settings icon finish to check  */}
        </Stack>
        {allNotifications.length > 0 ? (
          <div className="mt-5">
            {allNotifications.map((eachNotification, index) => {
              return (
                <div key={index}>
                  <div>
                    {eachNotification.isComment.value ? (
                      <Link
                        // to={`/${eachNotification?.post?.authorUserName}/status/${eachNotification?.post?._id}`}
                        style={{
                          textDecoration: "none",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        <div
                          className={`notification-is-comment-box notification-is-comment-box-${themeName}`}
                          style={{
                            cursor: "pointer",

                            minHeight: "121px",
                            borderTop:
                              themeName === "dark-theme" &&
                              allNotifications[0] === eachNotification &&
                              eachNotification.isComment.value
                                ? "1px solid rgb(70, 70, 70)"
                                : themeName !== "dark-theme" &&
                                  allNotifications[0] === eachNotification &&
                                  eachNotification.isComment.value
                                ? "1px solid rgba(0, 0, 0, 0.1)"
                                : null,
                            borderBottom:
                              themeName === "dark-theme"
                                ? "1px solid rgb(70, 70, 70)"
                                : "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {/* here down  */}

                          {eachNotification.notificationSender.imageUrl?.slice(
                            0,
                            3
                          ) !== "../" ? (
                            <Link
                              to={`/profile/${eachNotification.notificationSender._id}`}
                              style={{
                                height: "120px",
                                float: "left",
                                padding: "12px",
                              }}
                            >
                              <img
                                width={40}
                                height={40}
                                style={{
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                  float: "left",
                                }}
                                src={
                                  eachNotification.notificationSender.imageUrl
                                }
                                alt=""
                              />
                            </Link>
                          ) : (
                            <Link
                              style={{
                                height: "120px",
                                float: "left",
                                padding: "12px",
                              }}
                            >
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
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                }}
                              >
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                              </svg>
                            </Link>
                          )}

                          <div className="info-notification-comment-parent-div ">
                            <div
                              style={{
                                position: "relative",
                                top: "15px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <Link
                                  to={`/profile/${eachNotification.notificationSender._id}`}
                                  className="hover-fullname"
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "20px",
                                    fontWeight: "700",
                                    textDecoration: "none",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  {eachNotification.notificationSender.fullname}
                                </Link>
                                <Link
                                  to={`/profile/${eachNotification.notificationSender._id}`}
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "20px",
                                    fontWeight: "400",
                                    marginLeft: "5px",
                                    textDecoration: "none",

                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
                                  }}
                                >
                                  @
                                  {eachNotification.notificationSender.username}
                                </Link>
                                <div
                                  style={{
                                    position: "relative",
                                    bottom: "2px",
                                  }}
                                >
                                  <span
                                    style={{
                                      marginLeft: "5px",
                                      color: "rgb(83, 100, 113)",
                                    }}
                                  >
                                    &middot;
                                  </span>
                                  <Link
                                    to={`/${eachNotification?.isComment?.commentPostId?.userId.username}/status/${eachNotification?.isComment?.commentPostId?._id}`}
                                    className="date-post-detail"
                                    style={{
                                      textDecoration: "none",
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                    }}
                                  >
                                    {" "}
                                    {getCreatedDate(eachNotification.createdAt)}
                                  </Link>
                                </div>

                                <div
                                  style={{
                                    position: "relative",
                                    right: "22px",
                                  }}
                                  className="ms-auto"
                                >
                                  <svg
                                    style={{
                                      cursor: "pointer",
                                      position: "relative",
                                    }}
                                    fill={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)"
                                    }
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                  >
                                    <g>
                                      <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "rgb(83, 100, 113)",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                  lineHeight: "20px",
                                }}
                              >
                                <div>{"Replying to"}</div>
                                <Link
                                  to={`/profile/${eachNotification.notificationReceiver._id}`}
                                  className="replying-to-text"
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    lineHeight: "20px",
                                    marginLeft: "5px",
                                    textDecoration: "none",
                                    color: "rgb(29, 155, 240)",
                                  }}
                                >
                                  @
                                  {
                                    eachNotification.notificationReceiver
                                      .username
                                  }
                                </Link>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                  lineHeight: "20px",
                                }}
                              >
                                {" "}
                                <Link
                                  to={`/${eachNotification?.isComment?.commentPostId?.userId.username}/status/${eachNotification?.isComment?.commentPostId?._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  {eachNotification.isComment.comment}
                                </Link>
                              </div>
                            </div>
                            <div
                              className="post-actions-parent-div"
                              // className="mt-5"
                              style={{
                                marginTop: "25px",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div className="comment-parent-div">
                                <CommentModal
                                  post={
                                    eachNotification.isComment
                                      ? eachNotification.isComment.commentPostId
                                      : null
                                  }
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={getAllNotifications}
                                  sendDataToParent={handleDataFromCommentModal}
                                  postSharedMessage={postSharedMessage}
                                />
                              </div>
                              <div
                                style={{
                                  width: "100px",
                                }}
                                onClick={() =>
                                  !eachNotification.isComment.commentPostId.reposted.includes(
                                    userInfo._id
                                  )
                                    ? handleRepost(
                                        eachNotification.isComment.commentPostId
                                          ._id,
                                        eachNotification.isComment.commentPostId
                                      )
                                    : handleDeleteRepostNotificationsPage(
                                        eachNotification.isComment.commentPostId
                                          ._id,
                                        eachNotification.isComment.commentPostId
                                      )
                                }
                              >
                                <svg
                                  fill={
                                    themeName === "dark-theme" &&
                                    !eachNotification.isComment.commentPostId.reposted.includes(
                                      userInfo._id
                                    )
                                      ? "#71767A"
                                      : themeName !== "dark-theme" &&
                                        !eachNotification.isComment.commentPostId.reposted.includes(
                                          userInfo._id
                                        )
                                      ? "rgb(83, 100, 113)"
                                      : "rgb(0, 186, 124)"
                                  }
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                >
                                  <g>
                                    <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                                  </g>
                                </svg>
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color:
                                      themeName === "dark-theme" &&
                                      !eachNotification.isComment.commentPostId.reposted.includes(
                                        userInfo._id
                                      )
                                        ? "#71767A"
                                        : themeName !== "dark-theme" &&
                                          !eachNotification.isComment.commentPostId.reposted.includes(
                                            userInfo._id
                                          )
                                        ? "rgb(83, 100, 113)"
                                        : "rgb(0, 186, 124)",

                                    fontWeight: "400",
                                    fontFamily:
                                      "TwitterChirp, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                                    lineHeight: "20px",
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {eachNotification.isComment.commentPostId
                                    .reposted.length
                                    ? eachNotification.isComment.commentPostId
                                        .reposted.length
                                    : null}
                                </span>
                              </div>
                              <div
                                style={{
                                  width: "100px",
                                }}
                                onClick={() =>
                                  !eachNotification.isComment.commentPostId.likes.includes(
                                    userInfo._id
                                  )
                                    ? handlePostLikesFromNotificationsPage(
                                        eachNotification.isComment.commentPostId
                                          ._id,
                                        eachNotification.isComment.commentPostId
                                      )
                                    : handleDeleteLikeFromNotificationsPage(
                                        eachNotification.isComment.commentPostId
                                          ._id,
                                        eachNotification.isComment.commentPostId
                                      )
                                }
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                  }}
                                  fill={
                                    themeName === "dark-theme" &&
                                    !eachNotification.isComment.commentPostId.likes.includes(
                                      userInfo._id
                                    )
                                      ? "#71767A"
                                      : themeName !== "dark-theme" &&
                                        !eachNotification.isComment.commentPostId.likes.includes(
                                          userInfo._id
                                        )
                                      ? "rgb(83, 100, 113)"
                                      : "rgb(249, 24, 128)"
                                  }
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                >
                                  {!eachNotification.isComment.commentPostId.likes.includes(
                                    userInfo._id
                                  ) ? (
                                    <g>
                                      <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                                    </g>
                                  ) : (
                                    <g>
                                      <path
                                        stroke="black"
                                        strokeWidth="0.2"
                                        d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                                      ></path>
                                    </g>
                                  )}
                                </svg>
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color:
                                      themeName === "dark-theme" &&
                                      !eachNotification.isComment.commentPostId.likes.includes(
                                        userInfo._id
                                      )
                                        ? "#71767A"
                                        : themeName !== "dark-theme" &&
                                          !eachNotification.isComment.commentPostId.likes.includes(
                                            userInfo._id
                                          )
                                        ? "rgb(83, 100, 113)"
                                        : "rgb(249, 24, 128)",

                                    fontWeight: "400",
                                    fontFamily:
                                      "TwitterChirp, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                                    lineHeight: "20px",
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {eachNotification.isComment.commentPostId
                                    .likes.length
                                    ? eachNotification.isComment.commentPostId
                                        .likes.length
                                    : null}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : eachNotification.isFavorite.value ? (
                      <Link
                        to={`/${eachNotification?.post?.authorUserName}/status/${eachNotification?.post?._id}`}
                        style={{
                          textDecoration: "none",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        <div
                          className={`notification-is-favorite-box notification-is-favorite-box-${themeName}`}
                          style={{
                            minHeight: "121px",
                            borderTop:
                              themeName === "dark-theme" &&
                              allNotifications[0] === eachNotification &&
                              eachNotification.isFavorite.value
                                ? "1px solid rgb(70, 70, 70)"
                                : themeName !== "dark-theme" &&
                                  allNotifications[0] === eachNotification &&
                                  eachNotification.isFavorite.value
                                ? "1px solid rgba(0, 0, 0, 0.1)"
                                : null,
                            borderBottom:
                              themeName === "dark-theme"
                                ? "1px solid rgb(70, 70, 70)"
                                : "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div
                            style={{
                              float: "left",
                              height: "120px",
                              minWidth: "40px",
                              padding: "12px",
                            }}
                          >
                            <div>
                              <svg
                                color="rgb(249, 24, 128)"
                                fill="currentColor"
                                height={`${2}em`}
                                width={`${2}em`}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-vkub15 r-yucp9h"
                              >
                                <g>
                                  <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                          {eachNotification.notificationSender.imageUrl ? (
                            <div
                              style={{
                                height: "120px",
                                float: "left",
                                paddingTop: "10px",
                              }}
                            >
                              <Link
                                to={`/profile/${eachNotification.notificationSender._id}`}
                                style={{
                                  textDecoration: "none",
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {eachNotification.notificationSender.imageUrl?.slice(
                                  0,
                                  3
                                ) !== "../" ? (
                                  <div>
                                    <img
                                      className="profile-img logout-profile-img"
                                      src={
                                        eachNotification.notificationSender
                                          .imageUrl
                                      }
                                      width={40}
                                      height={40}
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
                                      width={40}
                                      fill={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)"
                                      }
                                      className="profile-svg-logout-modal bi bi-person-circle"
                                      viewBox="0 0 16 16"
                                      style={{
                                        borderRadius: "50%",
                                      }}
                                    >
                                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>
                                  </div>
                                )}
                                {/* <img
                                      width={40}
                                      height={40}
                                      style={{
                                        cursor: "pointer",
                                        borderRadius: "50%",
                                      }}
                                      src={
                                        eachNotification.notificationSender
                                          .imageUrl
                                      }
                                      alt=""
                                    /> */}
                              </Link>
                              <div
                                style={{
                                  marginTop: "5px",
                                }}
                              >
                                <Link
                                  to={`/profile/${eachNotification.notificationSender._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  <span
                                    className="hover-fullname"
                                    style={{
                                      fontSize: "15px",
                                      lineHeight: "20px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {
                                      eachNotification.notificationSender
                                        .username
                                    }
                                  </span>
                                </Link>
                                <span
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "20px",
                                    fontWeight: "400",
                                    marginLeft: "5px",
                                  }}
                                >
                                  liked your post
                                </span>
                              </div>
                              <div
                                style={{
                                  marginLeft: "-2px",
                                  marginTop: "5px",
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                  fontWeight: "400",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#414345"
                                      : "black",
                                }}
                              >
                                {eachNotification?.post?.content}
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                height: "120px",
                                float: "left",
                                paddingTop: "10px",
                              }}
                            >
                              <Link
                                to={`/profile/${eachNotification.notificationSender._id}`}
                                style={{
                                  textDecoration: "none",
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={40}
                                  height={40}
                                  fill="rgb(83, 100, 113)"
                                  className="bi bi-person-circle"
                                  viewBox="0 0 16 16"
                                  style={{
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                </svg>{" "}
                              </Link>
                              <div
                                style={{
                                  marginTop: "5px",
                                }}
                              >
                                {" "}
                                <Link
                                  to={`/profile/${eachNotification.notificationSender._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  <span
                                    className="hover-fullname"
                                    style={{
                                      fontSize: "15px",
                                      lineHeight: "20px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {
                                      eachNotification.notificationSender
                                        .username
                                    }
                                  </span>
                                </Link>
                                <span
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "20px",
                                    fontWeight: "400",
                                    marginLeft: "5px",
                                  }}
                                >
                                  liked your post
                                </span>
                              </div>
                              <div
                                style={{
                                  marginTop: "5px",
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                  fontWeight: "400",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#414345"
                                      : "black",
                                }}
                              >
                                {eachNotification.post.content}
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    ) : eachNotification.isRepost.value ? (
                      <Link
                        to={`/${eachNotification?.post?.authorUserName}/status/${eachNotification?.post?._id}`}
                        style={{
                          textDecoration: "none",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        <div
                          className={`notification-is-repost-box notification-is-repost-box-${themeName}`}
                          style={{
                            minHeight: "121px",
                            borderTop:
                              themeName === "dark-theme" &&
                              allNotifications[0] === eachNotification &&
                              eachNotification.isRepost.value
                                ? "1px solid rgb(70, 70, 70)"
                                : themeName !== "dark-theme" &&
                                  allNotifications[0] === eachNotification &&
                                  eachNotification.isRepost.value
                                ? "1px solid rgba(0, 0, 0, 0.1)"
                                : null,
                            borderBottom:
                              themeName === "dark-theme"
                                ? "1px solid rgb(70, 70, 70)"
                                : "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div
                            style={{
                              float: "left",

                              height: "120px",
                              minWidth: "40px",
                              padding: "12px",
                            }}
                          >
                            <svg
                              height={`${2}em`}
                              width={`${2}em`}
                              color="rgb(0, 186, 124)"
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
                          {eachNotification.notificationSender.imageUrl ? (
                            <div
                              style={{
                                height: "120px",
                                float: "left",
                                paddingTop: "10px",
                              }}
                            >
                              <Link
                                to={`/profile/${eachNotification.notificationSender._id}`}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                {eachNotification.notificationSender.imageUrl?.slice(
                                  0,
                                  3
                                ) !== "../" ? (
                                  <div>
                                    <img
                                      className="profile-img logout-profile-img"
                                      src={
                                        eachNotification.notificationSender
                                          .imageUrl
                                      }
                                      width={40}
                                      height={40}
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
                                      width={40}
                                      fill={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)"
                                      }
                                      className="profile-svg-logout-modal bi bi-person-circle"
                                      viewBox="0 0 16 16"
                                      style={{
                                        borderRadius: "50%",
                                      }}
                                    >
                                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>
                                  </div>
                                )}
                              </Link>
                              <div
                                style={{
                                  marginTop: "5px",
                                }}
                              >
                                <Link
                                  to={`/profile/${eachNotification.notificationSender._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  <span
                                    className="hover-fullname"
                                    style={{
                                      fontSize: "15px",
                                      lineHeight: "20px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {
                                      eachNotification.notificationSender
                                        .username
                                    }
                                  </span>
                                </Link>
                                <span
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "20px",
                                    fontWeight: "400",
                                    marginLeft: "5px",
                                  }}
                                >
                                  reposted your post
                                </span>
                              </div>
                              <div
                                style={{
                                  marginLeft: "-2px",
                                  marginTop: "5px",
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                  fontWeight: "400",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#414345"
                                      : "black",
                                }}
                              >
                                {eachNotification?.post?.content}
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                height: "120px",
                                float: "left",
                                paddingTop: "10px",
                              }}
                            >
                              <Link
                                to={`/profile/${eachNotification.notificationSender._id}`}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={40}
                                  height={40}
                                  fill="rgb(83, 100, 113)"
                                  className="bi bi-person-circle"
                                  viewBox="0 0 16 16"
                                  style={{
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                </svg>{" "}
                              </Link>
                              <div
                                style={{
                                  marginTop: "5px",
                                }}
                              >
                                <Link
                                  to={`/profile/${eachNotification.notificationSender._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  <span
                                    className="hover-fullname"
                                    style={{
                                      fontSize: "15px",
                                      lineHeight: "20px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {
                                      eachNotification.notificationSender
                                        .username
                                    }
                                  </span>
                                </Link>
                                <span
                                  style={{
                                    fontSize: "15px",
                                    lineHeight: "20px",
                                    fontWeight: "400",
                                    marginLeft: "5px",
                                  }}
                                >
                                  reposted your post
                                </span>
                              </div>
                              <div
                                style={{
                                  marginTop: "5px",
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                  fontWeight: "400",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#414345"
                                      : "black",
                                }}
                              >
                                {eachNotification.post.content}
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {/* You have no notifications at the moment. Start connecting with people and topics to stay updated! */}
            {/* when no notification yet start to check  */}
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
                You don’t have any notifications yet!
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
                Start connecting with people and topics to stay updated!
              </div>
            </div>
            {/* when no notification yet finish to check  */}
          </>
        )}
      </Col>
    </>
  );
}

export default NotificationsPage;
