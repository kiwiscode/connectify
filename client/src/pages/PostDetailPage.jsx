import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Stack, Accordion } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CommentModal } from "../components/ui/Modal";
import { UserContext } from "../context/UserContext";
import PostEngagements from "../components/ui/PostEngagementsModal";
const API_URL = import.meta.env.VITE_APP_API_URL;
const FRONTEND_URL = import.meta.env.VITE_APP_FRONTEND_URL;

import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { ThemeContext } from "../context/ThemeContext";
import PostPopover from "../components/three-dots-popover/Popover";
import useWindowDimensions from "../hooks/getWindowDimensions";
import RepostAction from "../components/ui/RepostAction";
import LikeAction from "../components/ui/LikeAction";
import BookmarkAction from "../components/ui/BookmarkAction";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";
import { SubcsriptionStatusContext } from "../context/SubscriptionStatusContext";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";

function PostDetailPage() {
  const { subscription, remainingTimeSubscriptionsOwnerIds } = useContext(
    SubcsriptionStatusContext
  );
  const extraDetailedDate = (dateStr) => {
    const date = new Date(dateStr);

    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const optionsDate = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      date
    );
    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
      date
    );

    return `${formattedTime} \u00B7 ${formattedDate}`;
  };

  const [{ themeName }] = useContext(ThemeContext);

  const { postOwner, postId } = useParams();
  const [detailedPost, setdetailedPost] = useState([]);

  const { userInfo } = useContext(UserContext);

  const [commentedForThisPost, setcommentedForThisPost] = useState([]);
  const [commentedForThisUsersPost, setcommentedForThisUsersPost] = useState(
    []
  );

  const navigate = useNavigate();

  const [deactivatedUser, setdeactivatedUser] = useState(false);

  const refreshPostDetailPage = () => {
    axios
      .get(`${API_URL}/${postOwner}/status/${postId}`)
      .then((response) => {
        const { detailedPost } = response.data;
        if (detailedPost.isComment) {
          if (!deactivatedUser) {
            setcommentedForThisPost(detailedPost.commentedForThisPost);
            setcommentedForThisUsersPost(
              detailedPost.commentedForThisUsersPost
            );
          }
        }
        setdetailedPost(detailedPost);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  const { postDeletedMessage, postSharedMessage, contextHolder } =
    useAntdMessageHandler();
  const handleDeletePostPostDetailPage = () => {
    postDeletedMessage();
    refreshPostDetailPage();
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/${postOwner}/status/${postId}`)
      .then((response) => {
        const { detailedPost } = response.data;
        if (detailedPost.isComment) {
          if (detailedPost.commentedForThisPost) {
            if (!detailedPost.commentedForThisPost.deactivatedOwner) {
              setcommentedForThisPost(detailedPost.commentedForThisPost);
              setcommentedForThisUsersPost(
                detailedPost.commentedForThisUsersPost
              );
            } else {
              setdeactivatedUser(true);
            }
          } else {
            setcommentedForThisPost(detailedPost.commentedForThisPost);
            setcommentedForThisUsersPost(
              detailedPost.commentedForThisUsersPost
            );
          }
        }

        if (postId === commentedForThisPost._id) {
          setcommentedForThisPost([]);
          setcommentedForThisUsersPost([]);
          setdetailedPost(commentedForThisPost);
        }
        setdetailedPost(detailedPost);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  }, [postId]);

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

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
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

  const { width } = useWindowDimensions();

  const [dataFromCommentModal, setDataFromCommentModal] = useState("");
  function handleDataFromCommentModal(data) {
    setDataFromCommentModal(data);
  }

  const { isPostModalVisible } = useContext(ModalVisibilityContext);
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

  const { getFontSizeAndLineHeight15, getFontSizeAndLineHeight17 } =
    useFontSizeHandler();
  const font17 = getFontSizeAndLineHeight17();
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
        lg={
          windowWidth <= 1201 && windowWidth >= 992
            ? 7
            : windowWidth > 1201
            ? 5
            : ""
        } // 992px - 1400px aralığı
        xxl={5} // 1400px ve sonrası aralığı
        className={`main-column`}
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
          minHeight: width <= 700 ? "100dvh" : "",
        }}
      >
        <Stack
          direction="horizontal"
          gap={3}
          style={{
            padding: "0px 16px",
            minHeight: "53px",
            transform: width <= 500 && `translateY(${headerPosition}px)`,
            transition:
              width <= 500 && "transform 0.3s cubic-bezier(0, 0, 0, 1)",
            position: width > 500 && "sticky",
            top: width > 500 && "0px",
            width: width > 500 && "100%",
            backgroundColor:
              width > 500 && themeName === "dark-theme"
                ? "rgba(0, 0, 0, 0.65)"
                : width > 500 && themeName === "dark-theme"
                ? "rgba(255, 255, 255, 0.85)"
                : null,
            backdropFilter: width > 500 && "blur(12px)",
            zIndex: width > 500 && 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "53px",
              height: "53px",
              maxHeight: "53px",
              justifyContent: "center",
            }}
          >
            <div
              onClick={() => navigate(-1)}
              className={`arrow arrow-${themeName}`}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <svg
                fill={
                  themeName === "dark-theme"
                    ? "rgb(231,233,234)"
                    : "rgb(15, 20, 25)"
                }
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
          </div>
          <div
            style={{
              lineHeight: width <= 500 ? "20px" : "24px",
              fontSize: width <= 500 ? "17px" : "20px",
              visibility: detailedPost.userId ? "" : "hidden",
            }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 p-2 chirp-bold-font"
                : "very-dark-gray-light-theme-text-variant-1 p-2 chirp-bold-font"
            }
          >
            Post
          </div>
        </Stack>
        {/* eğer post comment ise comment edildiği postu göster tepesinde göster start to check */}

        {commentedForThisPost &&
        commentedForThisPost._id &&
        commentedForThisUsersPost &&
        commentedForThisUsersPost._id ? (
          <>
            <Container
              style={{
                cursor: "pointer",
              }}
              // className="mt-3  transition-gray-hover"
              className={`mt-3  transition-gray-hover transition-gray-hover-${themeName}`}
            >
              <Row
                style={{
                  // backgroundColor: "yellow",
                  padding: "6px 0px 0px 0px",
                }}
              >
                <Col
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  xxl={2}
                  style={{
                    textAlign: "center",
                  }}
                >
                  {/* profile image start to check */}
                  <div>
                    {commentedForThisUsersPost._id ? (
                      <div>
                        {commentedForThisPost.userId.imageUrl.slice(0, 3) !==
                        "../" ? (
                          <>
                            <Link
                              style={{ cursor: "pointer" }}
                              to={`/profile/${commentedForThisUsersPost._id}`}
                            >
                              <img
                                width={40}
                                height={40}
                                src={commentedForThisPost.userId.imageUrl}
                                alt=""
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            </Link>
                            <div
                              className="responsive-comment-line-parent-div"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                className="responsive-comment-line"
                                style={{
                                  border:
                                    themeName !== "dark-theme"
                                      ? "1px solid rgba(0, 0, 0, 0.2)"
                                      : // : "0.1px solid rgb(70, 70, 70)",
                                        "1px solid rgb(70, 70, 70)",

                                  margin: "5px 0px 5px 0px",
                                  width: "2px",
                                  height: `${
                                    commentedForThisPost.content.length < 38
                                      ? "60px"
                                      : commentedForThisPost.content.length >=
                                          38 &&
                                        commentedForThisPost.content.length < 75
                                      ? "80px"
                                      : commentedForThisPost.content.length >=
                                          75 &&
                                        commentedForThisPost.content.length <=
                                          140
                                      ? "100px"
                                      : "0px"
                                  }`,
                                }}
                              ></div>
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
                                width="40"
                                height="40"
                                src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                alt=""
                              />
                            </div>
                            <div
                              className="responsive-comment-line-parent-div"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                className="responsive-comment-line"
                                style={{
                                  border:
                                    themeName !== "dark-theme"
                                      ? "1px solid rgba(0, 0, 0, 0.2)"
                                      : // : "0.1px solid rgb(70, 70, 70)",
                                        "1px solid rgb(70, 70, 70)",

                                  margin: "5px 0px 5px 0px",
                                  width: "2px",
                                  height: `${
                                    commentedForThisPost.content.length < 38
                                      ? "60px"
                                      : commentedForThisPost.content.length >=
                                          38 &&
                                        commentedForThisPost.content.length < 75
                                      ? "80px"
                                      : commentedForThisPost.content.length >=
                                          75 &&
                                        commentedForThisPost.content.length <=
                                          140
                                      ? "100px"
                                      : "0px"
                                  }`,
                                }}
                              ></div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                  {/* profile image finish to check  */}
                </Col>
                <Col xs={10} sm={10} md={10} lg={10} xxl={10}>
                  {/* post owner full name + verified account svg + post owner user name + post created date and content start to check  */}

                  <div>
                    {commentedForThisPost._id ? (
                      <>
                        <Link
                          style={{
                            textDecoration: "none",
                          }}
                          to={`/profile/${commentedForThisUsersPost._id}`}
                        >
                          <span
                            className="hover-fullname chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                          >
                            {commentedForThisPost.authorFullName}
                          </span>{" "}
                        </Link>
                        {commentedForThisPost?.userId.hasSubscription ||
                        (!subscription?.isActive &&
                          subscription?.remainingTimeSubscription &&
                          subscription?.cancelledDate &&
                          subscription?.owner ===
                            commentedForThisPost?.userId._id) ||
                        remainingTimeSubscriptionsOwnerIds.includes(
                          commentedForThisPost?.userId._id
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

                        <Link
                          style={{
                            textDecoration: "none",
                          }}
                          to={`/profile/${commentedForThisUsersPost._id}`}
                        >
                          <span
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                          >
                            @{commentedForThisPost.authorUserName}
                          </span>
                        </Link>

                        <Link
                          style={{
                            textDecoration: "none",
                          }}
                          to={`/${commentedForThisPost.authorUserName}/status/${commentedForThisPost._id}`}
                        >
                          <span
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                          >
                            {" "}
                            ·{" "}
                            <BootstrapTooltip
                              title={extraDetailedDate(
                                commentedForThisPost.createdAt
                              )}
                              themeName={
                                themeName === "dark-theme"
                                  ? "dark-theme"
                                  : "light-theme"
                              }
                            >
                              <span className="date-post-detail chirp-regular-font">
                                {getCreatedDate(commentedForThisPost.createdAt)}
                              </span>
                            </BootstrapTooltip>
                          </span>
                        </Link>

                        <div
                          style={{
                            float: "right",
                          }}
                        >
                          <PostPopover
                            post={commentedForThisPost}
                            postDeletionProcess={handleDeletePostPostDetailPage}
                            refreshPosts={refreshPostDetailPage}
                          />
                        </div>

                        {/* three dots svg finish to check */}

                        {/* finish to check  */}
                      </>
                    ) : null}
                  </div>

                  <div
                    style={{
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                    }}
                  >
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      to={`/${commentedForThisPost.authorUserName}/status/${commentedForThisPost._id}`}
                    >
                      <div
                        className="chirp-regular-font"
                        style={{
                          fontSize: font17.fontSize,
                          lineHeight: font17.lineHeight,
                        }}
                      >
                        <span
                          className="chirp-regular-font"
                          style={{
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          {commentedForThisPost.content}
                        </span>
                        {commentedForThisPost.image ? (
                          <>
                            {commentedForThisPost.image.url.slice(0, 3) !==
                            "ima" ? (
                              <div>{commentedForThisPost.image.url}</div>
                            ) : null}
                          </>
                        ) : null}
                      </div>
                    </Link>
                  </div>

                  {/* new version favorite repost comment start to check */}
                  <Stack
                    direction="horizontal"
                    className="mt-2"
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: "100px",
                      }}
                      className=""
                    >
                      <CommentModal
                        refreshPosts={refreshPostDetailPage}
                        post={commentedForThisPost}
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                        sendDataToParent={handleDataFromCommentModal}
                        postSharedMessage={postSharedMessage}
                      />
                    </div>
                    <div
                      style={{
                        width: "100px",
                      }}
                      className=""
                    >
                      <RepostAction
                        refreshPosts={refreshPostDetailPage}
                        post={commentedForThisPost}
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                      />
                    </div>
                    <div
                      style={{
                        width: "100px",
                      }}
                      className=""
                    >
                      <LikeAction
                        refreshPosts={refreshPostDetailPage}
                        post={commentedForThisPost}
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                      />
                    </div>
                    <div
                      style={{
                        width: "100px",
                      }}
                      className=""
                    >
                      <BookmarkAction
                        refreshPosts={refreshPostDetailPage}
                        post={commentedForThisPost}
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                      />
                    </div>
                  </Stack>

                  {/* new version favorite repost comment finish to check */}

                  {/* post owner full name + verified account svg + post owner user name + post created date and content  finish to check  */}
                </Col>
              </Row>
            </Container>
          </>
        ) : null}
        {/* eğer post comment ise comment edildiği postu göster tepesinde göster finish to check */}

        {!commentedForThisPost && (
          /* eğer comment yazılan ana post silindiyse start to check */
          <div
            style={{
              backgroundColor:
                themeName === "dark-theme" ? "black" : "rgba(247,249,249,1.00)",
              wordWrap: "break-word",
              padding: "12px 4px 12px 4px",
              borderStyle: "solid",
              borderWidth: "1px",
              border:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
              borderRadius: "16px",
              fontSize: font15.fontSize,
              marginLeft: "15px",
              marginRight: "15px",
            }}
          >
            <span
              className="chirp-regular-font"
              style={{
                marginLeft: "15px",
                color:
                  themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
            >
              This Post was deleted by the Post author.
            </span>{" "}
            <span
              className="learn-more-post-detail chirp-regular-font"
              style={{
                cursor: "pointer",
                color: "rgba(29,155,240)",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
            >
              Learn more
            </span>
          </div>
          /* eğer comment yazılan ana post silindiyse finish to check */
        )}

        {!commentedForThisPost ? (
          <div
            className="responsive-comment-line-parent-div-second"
            style={{
              display: "flex",
              width: "17%",
              heigh: "auto",
              justifyContent: "center",
            }}
          >
            <div
              className="responsive-comment-line"
              style={{
                border:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.2)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
                margin: "5px 0px 5px 0px",
                width: "2px",
                height: `8px`,
              }}
            ></div>
          </div>
        ) : null}

        {/* deactivated post owner detected start to check  */}
        {deactivatedUser ? (
          <>
            <div
              style={{
                marginBottom: "5px",
                backgroundColor:
                  themeName === "dark-theme"
                    ? "black"
                    : "rgba(247,249,249,1.00)",
                wordWrap: "break-word",
                padding: "12px 4px 12px 4px",
                borderStyle: "solid",
                borderWidth: "1px",
                border:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : "1px solid rgb(70, 70, 70)",
                borderRadius: "16px",
                fontSize: font15.fontSize,
              }}
            >
              <span
                className="chirp-regular-font"
                style={{
                  marginLeft: "15px",
                  color: "rgba(83,100,113)",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                This Post is from an account that no longer exists.
              </span>{" "}
              <span
                className="learn-more-post-detail chirp-regular-font"
                style={{
                  cursor: "pointer",
                  color: "rgba(29,155,240)",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                Learn more
              </span>
            </div>
            <div
              className="responsive-comment-line-parent-div-second"
              style={{
                display: "flex",
                width: "17%",
                heigh: "auto",
                justifyContent: "center",
              }}
            >
              <div
                className="responsive-comment-line"
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  margin: "5px 0px 5px 0px",
                  width: "2px",
                  height: `8px`,
                }}
              ></div>
            </div>
          </>
        ) : null}
        {/* deactivated post owner detected finish to check  */}

        {/* BUG post comment olmadığında ve comment.lengthi olduğunda burası görünüyor ! start to check  */}

        {commentedForThisPost?._id !== detailedPost?._id ? (
          <>
            <Container>
              <Row
                style={{
                  padding: "6px 0px 0px 0px",
                }}
              >
                <Col
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  xxl={2}
                  style={{
                    textAlign: "center",
                  }}
                >
                  {/* profile image start to check */}

                  <div>
                    {detailedPost.userId ? (
                      detailedPost.userId.imageUrl.slice(0, 3) !== "../" ? (
                        <Link
                          style={{ cursor: "pointer" }}
                          to={`/profile/${
                            detailedPost.userId ? detailedPost.userId._id : null
                          }`}
                        >
                          <img
                            width={40}
                            height={40}
                            src={detailedPost.userId.imageUrl}
                            alt=""
                            style={{
                              borderRadius: "50%",
                            }}
                          />
                        </Link>
                      ) : (
                        <Link
                          to={`/profile/${
                            detailedPost.userId ? detailedPost.userId._id : null
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          {" "}
                          <img
                            style={{
                              cursor: "pointer",
                              borderRadius: "50%",
                            }}
                            width="40"
                            height="40"
                            src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                            alt=""
                          />
                        </Link>
                      )
                    ) : null}
                  </div>

                  {/* profile image finish to check  */}
                </Col>
                <Col xs={10} sm={10} md={10} lg={10} xxl={10}>
                  {/* start to check post owner full name + post owner user name  */}
                  <div>
                    <Link
                      to={
                        detailedPost.userId
                          ? `/profile/${detailedPost.userId._id}`
                          : ""
                      }
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <span
                        className="post-detail-underline-text-2 hover-fullname chirp-bold-font"
                        style={{
                          color: themeName === "dark-theme" ? "white" : "black",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        {detailedPost.authorFullName}
                      </span>
                      {detailedPost?.userId.hasSubscription ||
                      (!subscription?.isActive &&
                        subscription?.remainingTimeSubscription &&
                        subscription?.cancelledDate &&
                        subscription?.owner === detailedPost?.userId._id) ||
                      remainingTimeSubscriptionsOwnerIds.includes(
                        detailedPost?.userId._id
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
                    </Link>

                    {/* three dots svg start to check */}
                    <span
                      style={{
                        float: "right",
                      }}
                    >
                      {" "}
                      <PostPopover
                        post={detailedPost}
                        postDeletionProcess={handleDeletePostPostDetailPage}
                        refreshPosts={refreshPostDetailPage}
                      />
                    </span>

                    {/* three dots svg finish to check */}
                  </div>
                  <Link
                    to={
                      detailedPost.userId
                        ? `/profile/${detailedPost.userId._id}`
                        : ""
                    }
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <span
                      className="chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                    >
                      @{detailedPost.authorUserName}
                    </span>
                  </Link>
                  {/* finish to check post owner full name + post owner user name  */}
                </Col>
              </Row>
            </Container>
            {/* post content + post created date start to check */}
            <Stack direction="vertical" gap={0}>
              <div
                style={{
                  marginLeft: "10px",
                  fontSize: font17.fontSize,
                  lineHeight: font17.lineHeight,
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                }}
                className="p-1 chirp-regular-font"
              >
                <Link
                  to={`/${detailedPost.authorUserName}/status/${detailedPost._id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <span
                    className="chirp-regular-font"
                    style={{
                      marginLeft: "10px",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    {detailedPost.content}
                  </span>
                </Link>
                <span>
                  {detailedPost.image ? (
                    detailedPost.image.url.slice(0, 3) !== "ima" ? (
                      <>
                        <Link
                          to={`/${detailedPost.authorUserName}/status/${
                            detailedPost._id
                          }/photo/${1}`}
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          <div
                            style={{
                              overflow: "hidden",
                              borderRadius: "8px",
                              padding: "12px",
                            }}
                          >
                            <img
                              src={detailedPost.image.url}
                              alt="Description"
                              style={{
                                width: "100%",
                                maxWidth: "100%",
                                display: "block",
                                borderRadius: "16px",
                              }}
                            />
                          </div>
                        </Link>
                      </>
                    ) : null
                  ) : null}
                </span>
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
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                    marginLeft: "10px",
                  }}
                  className="p-0 mt-3 mb-3 post-detail-underline-text-1 chirp-regular-font"
                >
                  <BootstrapTooltip
                    title={extraDetailedDate(detailedPost.createdAt)}
                    themeName={
                      themeName === "dark-theme" ? "dark-theme" : "light-theme"
                    }
                  >
                    {formatDateString(detailedPost.createdAt)}
                  </BootstrapTooltip>
                </div>
              </Link>
              <div
                style={{
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
              ></div>
            </Stack>
            {/* post content + post created date finish to check */}
            {/* new version favorite repost comment start to check */}
            <Stack
              direction="horizontal"
              style={{
                justifyContent: "space-between",
                // borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  width: "100px",
                }}
                className="p-2"
              >
                <CommentModal
                  refreshPosts={refreshPostDetailPage}
                  post={detailedPost}
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  sendDataToParent={handleDataFromCommentModal}
                  postSharedMessage={postSharedMessage}
                />
              </div>

              <div
                style={{
                  width: "100px",
                }}
                className="p-2"
              >
                <RepostAction
                  refreshPosts={refreshPostDetailPage}
                  post={detailedPost}
                  width={`${1.5}em`}
                  height={`${1.5}em`}
                />
              </div>
              <div
                style={{
                  width: "100px",
                }}
                className="p-2"
              >
                <LikeAction
                  refreshPosts={refreshPostDetailPage}
                  post={detailedPost}
                  width={`${1.5}em`}
                  height={`${1.5}em`}
                />
              </div>
              <div
                style={{
                  width: "100px",
                }}
                className="p-2"
              >
                <BookmarkAction
                  refreshPosts={refreshPostDetailPage}
                  post={detailedPost}
                  width={`${1.5}em`}
                  height={`${1.5}em`}
                />
              </div>
            </Stack>
            {/* new version favorite repost comment finish to check */}
          </>
        ) : !detailedPost.isComment ? null : null}

        {/* WHAT IS THAT ? IMPORTANT start to check */}
        {detailedPost.userId ? (
          <>
            {detailedPost.userId._id === userInfo._id ? (
              <div
                style={{
                  borderTop:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
              >
                <PostEngagements
                  postDetailPage={true}
                  detailedPost={detailedPost}
                />
              </div>
            ) : null}
          </>
        ) : (
          <div
            style={{
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              height: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                Hmm...this page doesn’t exist. Try searching for something else.
              </div>
              <a
                href={`${FRONTEND_URL}/explore`}
                className="mt-3 hover-blue-btn chirp-bold-font"
                style={{
                  textDecoration: "none",
                  borderRadius: "9999px",
                  border: "none",
                  outlineStyle: "none",
                  padding: "8px",
                  width: "84px",
                  height: "36px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#1C9BEF",
                  color: "white",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                Search
              </a>
            </div>
          </div>
        )}
        {/* WHAT IS THAT ? IMPORTANT finish to check  */}

        {/* BUG post comment olmadığında ve comment.lengthi olduğunda burası görünüyor ! finish to check  */}

        <div
          style={{
            borderBottom: !detailedPost.userId
              ? null
              : themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        {/* accordion implementation for comments when it is more than 0 start to check  */}
        {!detailedPost.isComment &&
        detailedPost.comments &&
        detailedPost.comments.length &&
        !detailedPost.comments[0].userId.isDeactivated ? (
          <Accordion defaultActiveKey="0">
            <Accordion.Item
              style={{
                border: "none",
                backgroundColor: themeName === "dark-theme" ? "black" : "",
              }}
              eventKey="1"
            >
              <Accordion.Header
                style={{
                  border: "none",
                }}
                className={`accordion-2 accordion-2-${themeName}`}
              >
                <div
                  className="chirp-regular-font"
                  style={{
                    border: "none",
                    width: "100%",
                    textAlign: "center",
                    color: "rgb(29, 155, 240)",
                    fontSize: font15.fontSize,
                    lineHeight: "24px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                >
                  Show this thread
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {detailedPost.comments ? (
                  <div>
                    {detailedPost.comments?.map((eachComment) => {
                      return (
                        <div key={eachComment._id}>
                          <div>
                            {eachComment.userId.isDeactivated ? null : (
                              <>
                                <div
                                  style={{
                                    borderBottom:
                                      themeName !== "dark-theme"
                                        ? "1px solid rgba(0, 0, 0, 0.1)"
                                        : "1px solid rgb(70, 70, 70)",
                                  }}
                                  className="all-posts"
                                >
                                  <div>
                                    <div className="posts-details">
                                      <Stack direction="horizontal" gap={1}>
                                        {/* profile image start to check */}
                                        <div className="p-1">
                                          {eachComment?.userId?.imageUrl.slice(
                                            0,
                                            3
                                          ) !== "../" ? (
                                            <Link
                                              style={{
                                                cursor: "pointer",
                                              }}
                                              to={`/profile/${
                                                eachComment
                                                  ? eachComment.userId._id
                                                  : null
                                              }`}
                                            >
                                              <img
                                                width={40}
                                                height={40}
                                                src={
                                                  eachComment.userId.imageUrl
                                                }
                                                alt=""
                                                style={{
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            </Link>
                                          ) : (
                                            <Link
                                              to={`/profile/${
                                                eachComment.userId
                                                  ? eachComment.userId._id
                                                  : null
                                              }`}
                                              style={{
                                                cursor: "pointer",
                                              }}
                                            >
                                              {" "}
                                              <img
                                                style={{
                                                  cursor: "pointer",
                                                  borderRadius: "50%",
                                                }}
                                                width="40"
                                                height="40"
                                                src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                                alt=""
                                              />
                                            </Link>
                                          )}
                                        </div>
                                        {/* profile image finish to check  */}

                                        {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                                        <div className="p-1">
                                          {eachComment.userId ? (
                                            <>
                                              <Link
                                                to={`/profile/${eachComment.userId._id}`}
                                                style={{
                                                  textDecoration: "none",
                                                  color: "black",
                                                }}
                                              >
                                                <span
                                                  className="hover-fullname chirp-bold-font"
                                                  style={{
                                                    fontSize: font15.fontSize,
                                                    lineHeight:
                                                      font15.lineHeight,
                                                    color:
                                                      themeName === "dark-theme"
                                                        ? "white"
                                                        : "black",
                                                  }}
                                                >
                                                  {eachComment.authorFullName}
                                                </span>{" "}
                                              </Link>

                                              {eachComment?.userId
                                                .hasSubscription ||
                                              (!subscription?.isActive &&
                                                subscription?.remainingTimeSubscription &&
                                                subscription?.cancelledDate &&
                                                subscription?.owner ===
                                                  eachComment?.userId._id) ||
                                              remainingTimeSubscriptionsOwnerIds.includes(
                                                eachComment?.userId._id
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
                                              <Link
                                                className="chirp-regular-font"
                                                to={`/profile/${eachComment.userId._id}`}
                                                style={{
                                                  textDecoration: "none",
                                                  color:
                                                    themeName === "dark-theme"
                                                      ? "#71767A"
                                                      : "rgb(83, 100, 113)",
                                                  fontSize: font15.fontSize,
                                                  lineHeight: font15.lineHeight,
                                                }}
                                              >
                                                <span>
                                                  <span className="chirp-regular-font">
                                                    @
                                                    {eachComment.authorUserName}
                                                  </span>
                                                </span>
                                              </Link>
                                              <Link
                                                to={`/${
                                                  eachComment.userId.username
                                                }/status/${
                                                  !eachComment.isReposted
                                                    ? eachComment.postId
                                                    : eachComment
                                                        .repostedFromThisOriginalPost[0]
                                                        ._id
                                                }`}
                                                style={{
                                                  textDecoration: "none",
                                                }}
                                              >
                                                <span
                                                  className="chirp-regular-font"
                                                  style={{
                                                    color:
                                                      themeName === "dark-theme"
                                                        ? "#71767A"
                                                        : "rgb(83, 100, 113)",
                                                    fontSize: font15.fontSize,
                                                    lineHeight:
                                                      font15.lineHeight,
                                                  }}
                                                >
                                                  {" "}
                                                  ·{" "}
                                                  <BootstrapTooltip
                                                    title={extraDetailedDate(
                                                      eachComment.createdAt
                                                    )}
                                                    themeName={
                                                      themeName === "dark-theme"
                                                        ? "dark-theme"
                                                        : "light-theme"
                                                    }
                                                  >
                                                    <span className="date-post-detail chirp-regular-font">
                                                      {getCreatedDate(
                                                        eachComment.createdAt
                                                      )}
                                                    </span>
                                                  </BootstrapTooltip>
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
                                            postDetailPageActive={true}
                                            post={eachComment}
                                            postDeletionProcess={
                                              handleDeletePostPostDetailPage
                                            }
                                            refreshPosts={refreshPostDetailPage}
                                          />
                                        </div>
                                        {/* three dots svg finish to check */}
                                      </Stack>

                                      {/* post content start to check  */}
                                      <Stack direction="vertical" gap={1}>
                                        <Link
                                          to={`/${
                                            eachComment.userId.username
                                          }/status/${
                                            !eachComment.isReposted
                                              ? eachComment.postId
                                              : eachComment
                                                  .repostedFromThisOriginalPost[0]
                                                  ._id
                                          }`}
                                          style={{
                                            textDecoration: "none",
                                            color: "rgb(15, 20, 25)",
                                          }}
                                        >
                                          <div
                                            className="p-2 chirp-regular-font"
                                            style={{
                                              fontSize: font15.fontSize,
                                              lineHeight: font15.lineHeight,
                                              overflowWrap: "break-word",
                                              maxWidth: "100%",
                                              color:
                                                themeName === "dark-theme"
                                                  ? "white"
                                                  : "black",
                                            }}
                                          >
                                            {eachComment.content}
                                          </div>
                                        </Link>
                                      </Stack>
                                      {/* post content finish to check  */}
                                      {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                                      {eachComment.image.url !== "image@url" ? (
                                        <>
                                          <Link
                                            to={`/${
                                              eachComment.userId.username
                                            }/status/${
                                              eachComment.postId
                                            }/photo/${1}`}
                                            style={{
                                              textDecoration: "none",
                                            }}
                                          >
                                            <div
                                              style={{
                                                overflow: "hidden",
                                                borderRadius: "8px",
                                                padding: "12px",
                                              }}
                                            >
                                              <img
                                                src={eachComment.image.url}
                                                alt="Description"
                                                style={{
                                                  width: "100%",
                                                  maxWidth: "100%",
                                                  display: "block",
                                                  borderRadius: "16px",
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
                                          style={{
                                            width: "100px",
                                          }}
                                          className="p-1"
                                        >
                                          <CommentModal
                                            refreshPosts={refreshPostDetailPage}
                                            post={
                                              eachComment ? eachComment : null
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            sendDataToParent={
                                              handleDataFromCommentModal
                                            }
                                            postSharedMessage={
                                              postSharedMessage
                                            }
                                            isPostDetailPage={true}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            width: "100px",
                                          }}
                                          className="p-1"
                                        >
                                          <RepostAction
                                            refreshPosts={refreshPostDetailPage}
                                            post={
                                              eachComment ? eachComment : null
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            detailedPostComment={true}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            width: "100px",
                                          }}
                                          className="p-1"
                                        >
                                          <LikeAction
                                            refreshPosts={refreshPostDetailPage}
                                            post={
                                              eachComment ? eachComment : null
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            detailedPostComment={true}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            width: "100px",
                                          }}
                                          className="p-1"
                                        >
                                          <BookmarkAction
                                            refreshPosts={refreshPostDetailPage}
                                            post={
                                              eachComment ? eachComment : null
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            detailedPostComment={true}
                                          />
                                        </div>
                                      </Stack>
                                      {/* new version favorite repost comment finish to check */}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ) : null}
        {/* accordion implementation for comments when it is more than 0 finish to check  */}

        {/* accordion implementation for comments when it is more than 0 start to check  */}
        {detailedPost.isComment &&
        detailedPost.comments &&
        detailedPost.comments.length ? (
          <Accordion defaultActiveKey="0">
            <Accordion.Item
              style={{
                border: "none",
                backgroundColor: themeName === "dark-theme" ? "black" : "",
              }}
              eventKey="1"
            >
              <Accordion.Header
                style={{ border: "none" }}
                className={`accordion-2 accordion-2-${themeName}`}
              >
                <div
                  className="chirp-regular-font"
                  style={{
                    border: "none",
                    width: "100%",
                    textAlign: "center",
                    color: "rgb(29, 155, 240)",
                    fontSize: font15.fontSize,
                    lineHeight: "24px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                >
                  Show this thread
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {detailedPost.comments ? (
                  <div>
                    {detailedPost.comments.map((eachComment) => {
                      return (
                        <div key={eachComment._id}>
                          <div>
                            {eachComment.userId.isDeactivated ? null : (
                              <>
                                <div
                                  style={{
                                    borderBottom:
                                      themeName !== "dark-theme"
                                        ? "1px solid rgba(0, 0, 0, 0.1)"
                                        : "1px solid rgb(70, 70, 70)",
                                  }}
                                  className="all-posts"
                                >
                                  <div>
                                    <div className="posts-details">
                                      <Stack direction="horizontal" gap={1}>
                                        {/* profile image start to check */}
                                        <div className="p-1">
                                          {eachComment?.userId ? (
                                            eachComment?.userId?.imageUrl.slice(
                                              0,
                                              3
                                            ) !== "../" ? (
                                              <Link
                                                style={{
                                                  cursor: "pointer",
                                                }}
                                                to={`/profile/${
                                                  eachComment
                                                    ? eachComment.userId._id
                                                    : null
                                                }`}
                                              >
                                                <img
                                                  width={40}
                                                  height={40}
                                                  src={
                                                    eachComment.userId.imageUrl
                                                  }
                                                  alt=""
                                                  style={{
                                                    borderRadius: "50%",
                                                  }}
                                                />
                                              </Link>
                                            ) : (
                                              <Link
                                                to={`/profile/${
                                                  eachComment.userId
                                                    ? eachComment.userId._id
                                                    : null
                                                }`}
                                                style={{
                                                  cursor: "pointer",
                                                }}
                                              >
                                                {" "}
                                                <img
                                                  style={{
                                                    cursor: "pointer",
                                                    borderRadius: "50%",
                                                  }}
                                                  width="40"
                                                  height="40"
                                                  src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                                  alt=""
                                                />
                                              </Link>
                                            )
                                          ) : null}
                                        </div>
                                        {/* profile image finish to check  */}

                                        {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                                        <div className="p-1">
                                          {eachComment.userId ? (
                                            <>
                                              <Link
                                                to={`/profile/${eachComment.userId._id}`}
                                                style={{
                                                  textDecoration: "none",
                                                  color: "black",
                                                }}
                                              >
                                                <span
                                                  className="hover-fullname chirp-bold-font"
                                                  style={{
                                                    fontSize: font15.fontSize,
                                                    lineHeight:
                                                      font15.lineHeight,
                                                    color:
                                                      themeName === "dark-theme"
                                                        ? "white"
                                                        : "black",
                                                  }}
                                                >
                                                  {eachComment.authorFullName}
                                                </span>{" "}
                                              </Link>{" "}
                                              {eachComment?.userId
                                                .hasSubscription ||
                                              (!subscription?.isActive &&
                                                subscription?.remainingTimeSubscription &&
                                                subscription?.cancelledDate &&
                                                subscription?.owner ===
                                                  eachComment?.userId._id) ||
                                              remainingTimeSubscriptionsOwnerIds.includes(
                                                eachComment?.userId._id
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
                                              <Link
                                                className="chirp-regular-font"
                                                to={`/profile/${eachComment.userId._id}`}
                                                style={{
                                                  textDecoration: "none",
                                                  color:
                                                    themeName === "dark-theme"
                                                      ? "#71767A"
                                                      : "rgb(83, 100, 113)",
                                                  fontSize: font15.fontSize,
                                                  lineHeight: font15.lineHeight,
                                                }}
                                              >
                                                <span>
                                                  <span className="chirp-regular-font">
                                                    @
                                                    {eachComment.authorUserName}
                                                  </span>
                                                </span>
                                              </Link>
                                              <Link
                                                to={`/${
                                                  eachComment.userId.username
                                                }/status/${
                                                  !eachComment.isReposted
                                                    ? eachComment.postId
                                                    : eachComment
                                                        .repostedFromThisOriginalPost[0]
                                                        ._id
                                                }`}
                                                style={{
                                                  textDecoration: "none",
                                                }}
                                              >
                                                <span
                                                  className="chirp-regular-font"
                                                  style={{
                                                    color:
                                                      themeName === "dark-theme"
                                                        ? "#71767A"
                                                        : "rgb(83, 100, 113)",
                                                    fontSize: font15.fontSize,
                                                    lineHeight:
                                                      font15.lineHeight,
                                                  }}
                                                >
                                                  {" "}
                                                  ·{" "}
                                                  <BootstrapTooltip
                                                    title={extraDetailedDate(
                                                      eachComment.createdAt
                                                    )}
                                                    themeName={
                                                      themeName === "dark-theme"
                                                        ? "dark-theme"
                                                        : "light-theme"
                                                    }
                                                  >
                                                    <span className="date-post-detail chirp-regular-font">
                                                      {getCreatedDate(
                                                        eachComment.createdAt
                                                      )}
                                                    </span>
                                                  </BootstrapTooltip>
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
                                            postDetailPageActive={true}
                                            post={eachComment}
                                            postDeletionProcess={
                                              handleDeletePostPostDetailPage
                                            }
                                            refreshPosts={refreshPostDetailPage}
                                          />
                                        </div>
                                        {/* three dots svg finish to check */}
                                      </Stack>

                                      {/* post content start to check  */}
                                      <Stack direction="vertical" gap={1}>
                                        <Link
                                          to={`/${
                                            eachComment.userId
                                              ? eachComment.userId.username
                                              : null
                                          }/status/${
                                            !eachComment.isReposted
                                              ? eachComment.postId
                                              : eachComment
                                                  .repostedFromThisOriginalPost[0]
                                                  ._id
                                          }`}
                                          style={{
                                            textDecoration: "none",
                                            color: "rgb(15, 20, 25)",
                                          }}
                                        >
                                          <div
                                            style={{
                                              fontSize: font15.fontSize,
                                              lineHeight: font15.lineHeight,
                                              overflowWrap: "break-word",
                                              maxWidth: "100%",
                                              color:
                                                themeName === "dark-theme"
                                                  ? "white"
                                                  : "black",
                                            }}
                                            className="p-2 chirp-regular-font"
                                          >
                                            {eachComment.content}
                                          </div>
                                        </Link>
                                      </Stack>
                                      {/* post content finish to check  */}
                                      {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                                      {eachComment.image ? (
                                        eachComment.image.url !==
                                        "image@url" ? (
                                          <>
                                            <Link
                                              to={`/${
                                                eachComment.userId.username
                                              }/status/${
                                                eachComment.postId
                                              }/photo/${1}`}
                                              style={{
                                                textDecoration: "none",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  overflow: "hidden",
                                                  borderRadius: "8px",
                                                  padding: "12px",
                                                }}
                                              >
                                                <img
                                                  src={eachComment.image.url}
                                                  alt="Description"
                                                  style={{
                                                    width: "100%",
                                                    maxWidth: "100%",
                                                    display: "block",
                                                    borderRadius: "16px",
                                                  }}
                                                />
                                              </div>
                                            </Link>
                                          </>
                                        ) : null
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
                                          style={{
                                            width: "100px",
                                          }}
                                          className="p-1"
                                        >
                                          <CommentModal
                                            refreshPosts={refreshPostDetailPage}
                                            post={
                                              eachComment ? eachComment : null
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            sendDataToParent={
                                              handleDataFromCommentModal
                                            }
                                            postSharedMessage={
                                              postSharedMessage
                                            }
                                            isPostDetailPage={true}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            width: "100px",
                                          }}
                                          className="p-1"
                                        >
                                          <RepostAction
                                            refreshPosts={refreshPostDetailPage}
                                            post={
                                              eachComment ? eachComment : null
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            detailedPostComment={true}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            width: "100px",
                                          }}
                                          className="p-1"
                                        >
                                          <LikeAction
                                            refreshPosts={refreshPostDetailPage}
                                            post={
                                              eachComment ? eachComment : null
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            detailedPostComment={true}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            width: "100px",
                                          }}
                                          className="p-1"
                                        >
                                          <BookmarkAction
                                            refreshPosts={refreshPostDetailPage}
                                            post={
                                              eachComment ? eachComment : null
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            detailedPostComment={true}
                                          />
                                        </div>
                                      </Stack>
                                      {/* new version favorite repost comment finish to check */}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ) : null}
        {/* accordion implementation for comments when it is more than 0 finish to check  */}
      </Col>
      {/* 3.column burası olucak */}
    </>
  );
}

export default PostDetailPage;
