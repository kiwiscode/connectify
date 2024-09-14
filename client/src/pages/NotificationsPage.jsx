import { Col, Stack } from "react-bootstrap";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { CommentModal } from "../components/ui/Modal";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import RepostAction from "../components/ui/RepostAction";
import LikeAction from "../components/ui/LikeAction";
import PostPopover from "../components/three-dots-popover/Popover";
import MobileTopNavigation from "../components/Navbar/mobile_top_navigation/MobileTopNavigation";
import { SubcsriptionStatusContext } from "../context/SubscriptionStatusContext";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

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
  const {
    subscription,
    remainingTimeSubscriptions,
    remainingTimeSubscriptionsOwnerIds,
  } = useContext(SubcsriptionStatusContext);

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
  const [headerPosition, setHeaderPosition] = useState(0);

  const handleScroll = () => {
    const scrollPosition = window.pageYOffset;

    if (scrollPosition < 53) {
      setHeaderPosition(-scrollPosition);
    } else {
      setHeaderPosition(-53);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerPosition]);

  const [dataFromTopNavigationComponent, setDataFromTopNavigationComponent] =
    useState(null);

  function handleDataFromTopNavigationComponentOpenedStatus(data) {
    console.log("Data =>", data);
    setDataFromTopNavigationComponent(data);
  }

  const { getFontSizeAndLineHeight31, getFontSizeAndLineHeight15 } =
    useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font15 = getFontSizeAndLineHeight15();
  return (
    <>
      {contextHolder}

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
          minHeight: width <= 700 ? "100dvh" : "",
        }}
      >
        <Stack
          style={{
            paddingLeft: "12px",
            paddingRight: "12px",
            transform:
              dataFromTopNavigationComponent ===
                "mobile top navigation was closed" &&
              `translateY(${headerPosition}px)`,

            minHeight:
              dataFromTopNavigationComponent ===
                "mobile top navigation was closed" && "53px",
            transition:
              dataFromTopNavigationComponent ===
                "mobile top navigation was closed" &&
              "transform 0.3s cubic-bezier(0, 0, 0, 1)",
            height: "53px",
            minHeight: "53px",
            position: width > 500 && "sticky",
            top: width > 500 && "0px",
            width: width > 500 && "100%",
            backgroundColor:
              width > 500 && themeName === "dark-theme"
                ? "rgba(0, 0, 0, 0.65)"
                : width > 500 && themeName === "light-theme"
                ? "rgba(255, 255, 255, 0.85)"
                : null,
            backdropFilter: width > 500 && "blur(12px)",
            zIndex: width > 500 && 1,
          }}
          direction="horizontal"
          gap={3}
          className={width <= 500 ? "" : ""}
        >
          {width <= 500 && (
            <div>
              <MobileTopNavigation
                navigationBarOpenedStatus={
                  handleDataFromTopNavigationComponentOpenedStatus
                }
                noIcon={true}
              />
            </div>
          )}

          <div
            style={{
              lineHeight: width <= 500 ? "20px" : "24px",
              fontSize: width <= 500 ? "17px" : "20px",
            }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font p-2"
                : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font p-2"
            }
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              style={{
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
          <div>
            {allNotifications.map((eachNotification, index) => {
              return (
                <div key={eachNotification._id}>
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
                                  className="hover-fullname chirp-bold-font"
                                  style={{
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                    textDecoration: "none",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  <span>
                                    {
                                      eachNotification.notificationSender
                                        .fullname
                                    }
                                  </span>{" "}
                                  <span>
                                    {eachNotification.notificationSender
                                      .hasSubscription ||
                                    (!subscription?.isActive &&
                                      subscription?.remainingTimeSubscription &&
                                      subscription?.cancelledDate &&
                                      subscription?.owner ===
                                        eachNotification.notificationSender
                                          ._id) ||
                                    remainingTimeSubscriptionsOwnerIds.includes(
                                      eachNotification.notificationSender._id
                                    ) ? (
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
                                            data-testid="verified-icon"
                                            color="rgba(29,155,240,1.00)"
                                            fill="currentColor"
                                          >
                                            <g>
                                              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                            </g>
                                          </svg>
                                        </span>{" "}
                                      </span>
                                    ) : null}
                                  </span>
                                </Link>
                                <Link
                                  className="chirp-regular-font"
                                  to={`/profile/${eachNotification.notificationSender._id}`}
                                  style={{
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
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
                                    className="date-post-detail chirp-regular-font"
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
                                <span
                                  style={{
                                    position: "relative",
                                    right: "22px",
                                  }}
                                  className="ms-auto"
                                >
                                  <PostPopover
                                    isCutePopoverOnRightSide={false}
                                    post={
                                      eachNotification.isComment.commentPostId
                                    }
                                  />
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  bottom: "15px",
                                }}
                              >
                                <div
                                  className="chirp-regular-font"
                                  style={{
                                    display: "flex",
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                  }}
                                >
                                  <div className="chirp-regular-font">
                                    {"Replying to"}
                                  </div>
                                  <Link
                                    to={`/profile/${eachNotification.notificationReceiver._id}`}
                                    className="replying-to-text chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                                  className="chirp-regular-font"
                                  style={{
                                    display: "flex",
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
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
                            </div>
                            <div
                              className="post-actions-parent-div"
                              // className="mt-5"
                              style={{
                                marginTop: "25px",
                                display: "flex",
                                justifyContent: "space-between",
                                position: "relative",
                                bottom: "5px",
                              }}
                            >
                              <div
                                style={{
                                  width: "100px",
                                }}
                                className="comment-parent-div"
                              >
                                <CommentModal
                                  post={
                                    eachNotification?.isComment
                                      ? eachNotification?.isComment
                                          ?.commentPostId
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
                                className="next-to-repost"
                              >
                                <RepostAction
                                  post={
                                    eachNotification.isComment
                                      ? eachNotification.isComment.commentPostId
                                      : null
                                  }
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={getAllNotifications}
                                />
                              </div>

                              <div
                                style={{
                                  width: "100px",
                                }}
                                className="next-to-like"
                              >
                                <LikeAction
                                  post={
                                    eachNotification.isComment
                                      ? eachNotification.isComment.commentPostId
                                      : null
                                  }
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={getAllNotifications}
                                />
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
                                    className="hover-fullname chirp-bold-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    {
                                      eachNotification.notificationSender
                                        .username
                                    }
                                  </span>
                                  <span>
                                    <span>
                                      {eachNotification.notificationSender
                                        .hasSubscription ||
                                      (!subscription?.isActive &&
                                        subscription?.remainingTimeSubscription &&
                                        subscription?.cancelledDate &&
                                        subscription?.owner ===
                                          eachNotification.notificationSender
                                            ._id) ||
                                      remainingTimeSubscriptionsOwnerIds.includes(
                                        eachNotification.notificationSender._id
                                      ) ? (
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
                                              data-testid="verified-icon"
                                              color="rgba(29,155,240,1.00)"
                                              fill="currentColor"
                                            >
                                              <g>
                                                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                              </g>
                                            </svg>
                                          </span>
                                        </span>
                                      ) : null}
                                    </span>
                                  </span>
                                </Link>
                                <span
                                  className="chirp-regular-font"
                                  style={{
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                    marginLeft: "5px",
                                  }}
                                >
                                  liked your post
                                </span>
                              </div>
                              <div
                                className="chirp-regular-font"
                                style={{
                                  marginLeft: "-2px",
                                  marginTop: "5px",
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
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
                                    className="hover-fullname chirp-bold-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    {
                                      eachNotification.notificationSender
                                        .username
                                    }
                                  </span>
                                </Link>
                                <span
                                  className="chirp-regular-font"
                                  style={{
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                    marginLeft: "5px",
                                  }}
                                >
                                  liked your post
                                </span>
                              </div>
                              <div
                                className="chirp-regular-font"
                                style={{
                                  marginTop: "5px",
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
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
                                    className="hover-fullname chirp-bold-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    {
                                      eachNotification.notificationSender
                                        .username
                                    }
                                  </span>
                                  <span>
                                    <span>
                                      {eachNotification.notificationSender
                                        .hasSubscription ||
                                      (!subscription?.isActive &&
                                        subscription?.remainingTimeSubscription &&
                                        subscription?.cancelledDate &&
                                        subscription?.owner ===
                                          eachNotification.notificationSender
                                            ._id) ||
                                      remainingTimeSubscriptionsOwnerIds.includes(
                                        eachNotification.notificationSender._id
                                      ) ? (
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
                                              data-testid="verified-icon"
                                              color="rgba(29,155,240,1.00)"
                                              fill="currentColor"
                                            >
                                              <g>
                                                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                              </g>
                                            </svg>
                                          </span>
                                        </span>
                                      ) : null}
                                    </span>
                                  </span>
                                </Link>
                                <span
                                  className="chirp-regular-font"
                                  style={{
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                    marginLeft: "5px",
                                  }}
                                >
                                  reposted your post
                                </span>
                              </div>
                              <div
                                className="chirp-regular-font"
                                style={{
                                  marginLeft: "-2px",
                                  marginTop: "5px",
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
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
                                    className="hover-fullname chirp-bold-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    {
                                      eachNotification.notificationSender
                                        .username
                                    }
                                  </span>
                                </Link>
                                <span
                                  className="chirp-regular-font"
                                  style={{
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                    marginLeft: "5px",
                                  }}
                                >
                                  reposted your post
                                </span>
                              </div>
                              <div
                                className="chirp-regular-font"
                                style={{
                                  marginTop: "5px",
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
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
                className="chirp-heavy-font"
                style={{
                  fontSize: font31.fontSize,
                  lineHeight: font31.lineHeight,
                  margin: "10px",
                }}
              >
                You don’t have any notifications yet!
              </div>
              <div
                className="chirp-regular-font"
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
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
