import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { Button, Col, Modal, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";
import PostPopover from "../components/three-dots-popover/Popover";
import { CommentModal } from "../components/ui/Modal";
import RepostAction from "../components/ui/RepostAction";
import LikeAction from "../components/ui/LikeAction";
import BookmarkAction from "../components/ui/BookmarkAction";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import { SubcsriptionStatusContext } from "../context/SubscriptionStatusContext";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const { getToken, userInfo } = useContext(UserContext);
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const [clearBookMarksPopover, setShowClearBookmarksPopover] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookmarks`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("Bookmarks =>", response.data.bookmarksForThisUserFromDB);
      setBookmarks(response.data.bookmarksForThisUserFromDB);
    } catch (error) {
      console.error("Error =>", error);
    }
  };
  useEffect(() => {
    if (!bookmarks.length) {
      setIsLoading(true);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 250);
    fetchBookmarks();
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

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

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

  const [visibleTweets, setVisibleTweets] = useState(25);
  const handleShowMorePosts = () => {
    setVisibleTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

  const {
    postSharedMessage,
    contextHolder,
    showCustomMessage,
    postDeletedMessage,
  } = useAntdMessageHandler();

  const [showClearAllBookmarksCodal, setshowClearAllBookmarksModal] =
    useState(null);

  const handleCloseClearAllBookmarksModal = () => {
    setshowClearAllBookmarksModal(false);
  };

  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
  const clearBookmarksOutput = [
    <Modal
      backdropClassName={
        themeName === "dark-theme" ? `back-drop-${themeName}` : ""
      }
      centered={true}
      key={0}
      show={showClearAllBookmarksCodal}
      onHide={handleCloseClearAllBookmarksModal}
      className="leave-conversation"
      contentClassName={
        themeName === "dark-theme"
          ? "leave-conversation-modal-dark-theme"
          : "leave-conversation-modal"
      }
    >
      <Modal.Body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingBottom: "16px",
            paddingTop: "16px",
            maxWidth: "256px",
          }}
        >
          <div
            className="chirp-bold-font"
            style={{
              color: themeName === "dark-theme" ? "white" : "",
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
          >
            Clear all Bookmarks?
          </div>
          <div
            className="mt-2 chirp-regular-font"
            style={{
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
            }}
          >
            This can’t be undone and you’ll remove all posts you’ve added to
            your Bookmarks.{" "}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "12px",
          }}
        >
          <Button
            onClick={() => clearAllBookmarks()}
            className={`red-btn ${themeName}-red-btn chirp-bold-font`}
            style={{
              maxWidth: "256px",
              minHeight: "44px",
              color: "white",
              backgroundColor: "rgb(244, 33, 46)",
              border: "none",
            }}
          >
            Clear
          </Button>
          <Button
            variant="light"
            onClick={handleCloseClearAllBookmarksModal}
            style={{
              color: themeName === "dark-theme" ? "white" : "black",
              maxWidth: "256px",
              minHeight: "44px",
            }}
            className={`mt-2 forgot-password-btn ${themeName}-black-btn chirp-bold-font`}
          >
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>,
  ];
  const clearAllBookmarks = async () => {
    try {
      const response = await axios.delete(`${API_URL}/delete-all-bookmarks`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("Response =>", response);
      handleCloseClearAllBookmarksModal();
      fetchBookmarks();
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  const handleDeletePostFromBookmarksPage = () => {
    postDeletedMessage();
    fetchBookmarks();
  };

  const [dataFromCommentModal, setDataFromCommentModal] = useState("");
  function handleDataFromCommentModal(data) {
    console.log("Data =>", data);
    setDataFromCommentModal(data);
  }

  const { isPostModalVisible } = useContext(ModalVisibilityContext);
  const {
    subscription,
    remainingTimeSubscriptions,
    remainingTimeSubscriptionsOwnerIds,
  } = useContext(SubcsriptionStatusContext);

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
  }, [headerPosition, window.pageYOffset]);

  const navigate = useNavigate();
  return (
    <>
      {!isPostModalVisible && !dataFromCommentModal && (
        <ResponsiveNavigationBarBottom />
      )}
      {clearBookmarksOutput[0]}
      {contextHolder}
      <Col
        xs={12} // 0px - 576px aralığı
        sm={12} // 576px - 768px aralığı
        md={11} // 768px - 992px aralığı
        lg={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 5 : ""} // 992px - 1400px aralığı
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
        }}
      >
        <div
          style={{
            // for sharp backdrop filter with transparent backgroundcolor start to check
            // backgroundColor: "transparent",
            // for sharp backdrop filter with transparent backgroundcolor finish to check
            backgroundColor:
              themeName === "dark-theme"
                ? "rgba(0, 0, 0, 0.65)"
                : "rgba(255, 255, 255, 0.85)",
            minHeight: "53px",
            zIndex: 1,
            backdropFilter: "blur(12px)",
            transform: width <= 500 && `translateY(${headerPosition}px)`,
            transition:
              width <= 500 && "transform 0.3s cubic-bezier(0, 0, 0, 1)",
            position: width > 500 && "sticky",
            top: width > 500 && "0px",
            width: width > 500 && "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              justifyItems: "center",
              alignItems: "center",
              padding: "0px 12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {width <= 500 && (
                <div>
                  {" "}
                  <div
                    onClick={() => navigate(-1)}
                    className={`p-2 arrow arrow-${themeName}`}
                    style={{
                      width: "36px",
                      height: " 36px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      color={themeName === "dark-theme" ? "white" : ""}
                      fill="currentColor"
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
                <span>Bookmarks</span>
                <div
                  className="chirp-regular-font"
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                  }}
                >
                  @{userInfo?.username}
                </div>
              </div>
            </div>
            {/* settings icon start to check  */}
            {bookmarks.length > 0 && (
              <div className="more-button-bookmarks">
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <div
                      onClick={() => {
                        setShowClearBookmarksPopover(!clearBookMarksPopover);
                      }}
                    >
                      <Button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        variant="text"
                        {...bindTrigger(popupState)}
                      >
                        <BootstrapTooltip
                          title="More"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <div
                            className={
                              themeName === "dark-theme"
                                ? "icon-hover-dark-theme"
                                : "icon-hover-light-theme"
                            }
                            style={{
                              width: "40px",
                              height: "40px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                              borderRadius: "50%",
                              backgroundColor: "transparent",
                            }}
                          >
                            <svg
                              color={
                                themeName === "dark-theme" ? "white" : "#0F141A"
                              }
                              fill="currentColor"
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <g>
                                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                              </g>
                            </svg>{" "}
                          </div>
                        </BootstrapTooltip>
                      </Button>
                      <Popover
                        style={{
                          zIndex: 99999,
                        }}
                        className={`${
                          themeName === "dark-theme"
                            ? "popover-material-ui-dark-theme"
                            : themeName !== "dark-theme"
                            ? "popover-material-ui-light-theme"
                            : "hideshowMessageDeletePopover "
                        }`}
                        onClose={popupState.close}
                        open={popupState.open}
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: -23,
                          horizontal: 188,
                        }}
                      >
                        <div
                          onClick={() => {
                            //   clearAllBookmarks();
                            setshowClearAllBookmarksModal(true);
                            popupState.close();
                          }}
                          style={{
                            padding: "12px 16px",
                            cursor: "pointer",
                            borderBottomLeftRadius: "6px",
                            borderBottomRightRadius: "6px",
                          }}
                          className={`message-popoover message-popoover-${themeName}`}
                        >
                          <span
                            className="chirp-bold-font"
                            style={{
                              color: "#f2212e",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                          >
                            Clear all Bookmarks
                          </span>
                        </div>
                      </Popover>
                    </div>
                  )}
                </PopupState>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>

        {bookmarks.length > 0 ? (
          <>
            {bookmarks.slice(0, visibleTweets).map((eachBookMark) => (
              <div key={eachBookMark?._id}>
                <div
                  onClick={() => {
                    console.log(
                      "Post box parent class =>",
                      eachBookMark?.bookmarkedPost
                    );
                    setclickedPostBox(eachBookMark?.bookmarkedPost);
                  }}
                  className={
                    themeName === "dark-theme"
                      ? `each-post-${themeName}`
                      : "each-post"
                  }
                >
                  <div
                    style={{
                      textDecoration: "none",
                    }}
                    onClick={() => {
                      setclickedPostBox(eachBookMark?.bookmarkedPost);
                    }}
                    className="posts-details outside-of-inner-circle-actions"
                  >
                    <div
                      style={{
                        position: "relative",
                      }}
                      className="post-head"
                    ></div>
                    <Stack
                      style={{
                        cursor: "pointer",
                      }}
                      to={`/${
                        eachBookMark?.bookmarkedPost?.userId.username
                      }/status/${
                        !eachBookMark?.bookmarkedPost?.isReposted
                          ? eachBookMark?.bookmarkedPost?._id
                          : eachBookMark?.bookmarkedPost
                              ?.repostedFromThisOriginalPost[0]._id
                      }`}
                      onClick={() =>
                        setclickedPostBox(eachBookMark?.bookmarkedPost)
                      }
                      className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                      direction="horizontal"
                      gap={1}
                    >
                      {/* profile image start to check */}
                      <div className="p-1">
                        {eachBookMark?.bookmarkedPost?.userId.imageUrl.slice(
                          0,
                          3
                        ) !== "../" ? (
                          <Link
                            className="post-circle-profile-image-on-point"
                            style={{
                              cursor: "pointer",
                              borderRadius: "50%",
                            }}
                            to={`/profile/${
                              eachBookMark?.bookmarkedPost
                                ? eachBookMark?.bookmarkedPost?.userId._id
                                : null
                            }`}
                          >
                            <img
                              width={40}
                              height={40}
                              src={
                                eachBookMark?.bookmarkedPost?.userId.imageUrl
                                  ? eachBookMark?.bookmarkedPost?.userId
                                      .imageUrl
                                  : null
                              }
                              alt="??"
                              style={{ borderRadius: "50%" }}
                            />
                          </Link>
                        ) : (
                          <Link
                            className="post-circle-profile-svg-on-point"
                            to={`/profile/${
                              eachBookMark?.bookmarkedPost?.userId
                                ? eachBookMark?.bookmarkedPost?.userId._id
                                : null
                            }`}
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
                      {/* profile image finish to check  */}

                      {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                      <div className="p-1">
                        {eachBookMark?.bookmarkedPost?.userId ? (
                          <>
                            <Link
                              className="post-circle-postowner-fullname"
                              to={`/profile/${eachBookMark?.bookmarkedPost?.userId._id}`}
                              style={{
                                textDecoration: "none",
                                color: "black",
                              }}
                            >
                              <span
                                className="hover-fullname chirp-bold-font"
                                style={{
                                  color:
                                    themeName === "dark-theme" ? "white" : "",
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "120px",
                                }}
                              >
                                {eachBookMark?.bookmarkedPost?.userId.fullname}
                              </span>{" "}
                            </Link>
                            {eachBookMark?.bookmarkedPost?.userId
                              .hasSubscription ||
                            (!subscription?.isActive &&
                              subscription?.remainingTimeSubscription &&
                              subscription?.cancelledDate &&
                              subscription?.owner ===
                                eachBookMark?.bookmarkedPost?.userId._id) ||
                            remainingTimeSubscriptionsOwnerIds.includes(
                              eachBookMark?.bookmarkedPost?.userId._id
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
                              to={`/profile/${eachBookMark?.bookmarkedPost?.userId._id}`}
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
                              <span className="post-circle-postowner-username">
                                <span className="chirp-regular-font">
                                  @
                                  {
                                    eachBookMark?.bookmarkedPost?.userId
                                      .username
                                  }
                                </span>
                              </span>
                            </Link>
                            <Link
                              to={`/${
                                eachBookMark?.bookmarkedPost?.userId.username
                              }/status/${
                                !eachBookMark?.bookmarkedPost?.isReposted
                                  ? eachBookMark?.bookmarkedPost?._id
                                  : eachBookMark?.bookmarkedPost
                                      ?.repostedFromThisOriginalPost[0]._id
                              }`}
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              <span
                                className="post-circle-date-post-detail chirp-regular-font"
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
                                    eachBookMark?.bookmarkedPost?.createdAt
                                  )}
                                  themeName={
                                    themeName === "dark-theme"
                                      ? "dark-theme"
                                      : "light-theme"
                                  }
                                >
                                  <span className="date-post-detail">
                                    {getCreatedDate(
                                      eachBookMark?.bookmarkedPost?.createdAt
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
                          postDeletionProcess={
                            handleDeletePostFromBookmarksPage
                          }
                          post={eachBookMark?.bookmarkedPost}
                        />
                      </div>
                      {/* three dots svg finish to check */}
                    </Stack>

                    {/* post content start to check  */}
                    <Stack
                      to={`/${
                        eachBookMark?.bookmarkedPost?.userId.username
                      }/status/${
                        !eachBookMark?.bookmarkedPost?.isReposted
                          ? eachBookMark?.bookmarkedPost?._id
                          : eachBookMark?.bookmarkedPost
                              ?.repostedFromThisOriginalPost[0]._id
                      }`}
                      onClick={() =>
                        setclickedPostBox(eachBookMark?.bookmarkedPost)
                      }
                      className="outside-of-inner-circle-action-comment-text"
                      direction="vertical"
                      gap={1}
                    >
                      <Link
                        to={`/${
                          eachBookMark?.bookmarkedPost?.userId.username
                        }/status/${
                          !eachBookMark?.bookmarkedPost?.isReposted
                            ? eachBookMark?.bookmarkedPost?._id
                            : eachBookMark?.bookmarkedPost
                                ?.repostedFromThisOriginalPost[0]._id
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
                            cursor: "pointer",
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                          className="p-2 chirp-regular-font"
                        >
                          {eachBookMark?.bookmarkedPost?.content}
                        </div>
                      </Link>
                    </Stack>
                    {/* post content finish to check  */}
                    {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                    {eachBookMark?.bookmarkedPost?.image.url !== "image@url" ? (
                      <>
                        <Link
                          to={`/${
                            eachBookMark?.bookmarkedPost?.userId.username
                          }/status/${
                            !eachBookMark?.bookmarkedPost?.isReposted
                              ? eachBookMark?.bookmarkedPost?._id
                              : eachBookMark?.bookmarkedPost
                                  ?.repostedFromThisOriginalPost[0]._id
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
                              src={eachBookMark?.bookmarkedPost?.image.url}
                              alt="Description"
                              style={{
                                width: "100%",
                                maxWidth: "100%",
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
                      onClick={() =>
                        setclickedPostBox(eachBookMark?.bookmarkedPost)
                      }
                      direction="horizontal"
                      style={{
                        justifyContent: "space-between",
                        margin: "5px 0px 5px 0px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "100px",
                        }}
                        onClick={() =>
                          setclickedPostBox(eachBookMark?.bookmarkedPost)
                        }
                        className="p-1 next-to-comment"
                      >
                        <CommentModal
                          post={
                            eachBookMark?.bookmarkedPost
                              ? eachBookMark?.bookmarkedPost
                              : null
                          }
                          width={`${1.25}em`}
                          height={`${1.25}em`}
                          refreshPosts={fetchBookmarks}
                          sendDataToParent={handleDataFromCommentModal}
                          postSharedMessage={postSharedMessage}
                        />
                      </div>
                      <div
                        style={{
                          width: "100px",
                        }}
                        onClick={() =>
                          setclickedPostBox(eachBookMark?.bookmarkedPost)
                        }
                        className="p-1 next-to-repost"
                      >
                        <RepostAction
                          post={
                            eachBookMark?.bookmarkedPost
                              ? eachBookMark?.bookmarkedPost
                              : null
                          }
                          width={`${1.25}em`}
                          height={`${1.25}em`}
                          refreshPosts={fetchBookmarks}
                        />
                      </div>
                      <div
                        style={{
                          width: "100px",
                        }}
                        to={`/${
                          eachBookMark?.bookmarkedPost?.userId.username
                        }/status/${
                          !eachBookMark?.bookmarkedPost?.isReposted
                            ? eachBookMark?.bookmarkedPost?._id
                            : eachBookMark?.bookmarkedPost
                                ?.repostedFromThisOriginalPost[0]._id
                        }`}
                        onClick={() =>
                          setclickedPostBox(eachBookMark?.bookmarkedPost)
                        }
                        className="p-1 next-to-like"
                      >
                        <LikeAction
                          post={
                            eachBookMark?.bookmarkedPost
                              ? eachBookMark?.bookmarkedPost
                              : null
                          }
                          width={`${1.25}em`}
                          height={`${1.25}em`}
                          refreshPosts={fetchBookmarks}
                        />
                      </div>{" "}
                      <div
                        style={{
                          width: "100px",
                        }}
                        to={`/${
                          eachBookMark?.bookmarkedPost?.userId.username
                        }/status/${
                          !eachBookMark?.bookmarkedPost?.isReposted
                            ? eachBookMark?.bookmarkedPost?._id
                            : eachBookMark?.bookmarkedPost
                                ?.repostedFromThisOriginalPost[0]?._id
                        }`}
                        onClick={() =>
                          setclickedPostBox(eachBookMark?.bookmarkedPost)
                        }
                        className="p-1 next-to-like"
                      >
                        {" "}
                        <BookmarkAction
                          post={
                            eachBookMark?.bookmarkedPost
                              ? eachBookMark?.bookmarkedPost
                              : null
                          }
                          width={`${1.25}em`}
                          height={`${1.25}em`}
                          refreshPosts={fetchBookmarks}
                          bookmarkDeletedMessage={showCustomMessage}
                        />
                      </div>
                    </Stack>
                    {/* new version favorite repost comment finish to check */}
                  </div>
                  <div
                    onClick={() => {
                      console.log(
                        "Post box child class =>",
                        eachBookMark?.bookmarkedPost
                      );
                      setclickedPostBox(eachBookMark?.bookmarkedPost);
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
                </div>
              </div>
            ))}
          </>
        ) : isLoading ? (
          <LoadingSpinner strokeColor={"rgb(29, 155, 240)"}></LoadingSpinner>
        ) : (
          <div
            className="mt-3"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "60%",
              }}
            >
              <div
                className="chirp-heavy-font"
                style={{
                  fontSize: font31.fontSize,
                  lineHeight: font31.lineHeight,
                }}
              >
                Save posts for later
              </div>
              <div
                className="mt-2 chirp-regular-font"
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                Bookmark posts to easily find them again in the future.
              </div>
            </div>
          </div>
        )}
      </Col>
    </>
  );
}
export default Bookmarks;
