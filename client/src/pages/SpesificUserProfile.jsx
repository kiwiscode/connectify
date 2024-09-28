import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Stack,
  Button,
  Accordion,
  Modal,
} from "react-bootstrap";
import { CommentModal } from "../components/ui/Modal";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const API_URL = import.meta.env.VITE_APP_API_URL;

import io from "socket.io-client";
const socket = io.connect(`${API_URL}`);

import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { ThemeContext } from "../context/ThemeContext";
import UnfollowModal from "../components/unfollow-modal/UnfollowModal";
import PostPopover from "../components/three-dots-popover/Popover";
import useWindowDimensions from "../hooks/getWindowDimensions";
import RepostAction from "../components/ui/RepostAction";
import LikeAction from "../components/ui/LikeAction";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";
import BookmarkAction from "../components/ui/BookmarkAction";
import { SubcsriptionStatusContext } from "../context/SubscriptionStatusContext";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";

function SpesificUserProfile({ isNewPostShared }) {
  const [{ theme, themeName }] = useContext(ThemeContext);
  console.log(
    "Is new post shared spesific user profile page =>",
    isNewPostShared
  );
  const {
    subscription,
    remainingTimeSubscriptions,
    remainingTimeSubscriptionsOwnerIds,
  } = useContext(SubcsriptionStatusContext);
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

  const { id } = useParams();

  const navigate = useNavigate();

  // use effect to grab current mouse click location start to check

  const [clickedPostBox, setclickedPostBox] = useState(null);
  console.log("Clicked post outside of use effect =>", clickedPostBox);
  useEffect(() => {
    const getClickLocation = (e) => {
      const clickedElementParentClass = e.target.parentNode.className;
      const clickedElementClass = e.target.classList;
      console.log("target details =>", clickedElementParentClass);
      console.log("Target class list =>", e.target.classList);
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
        console.log("Clicked post box inside of use effect =>", clickedPostBox);
        console.log(
          "You clicked outside of any actions inside clicked post box"
        );
        if (clickedPostBox) {
          navigate(
            `/½${clickedPostBox.userId.username}/status/${
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

  // use effect to grab current mouse click location finish to check
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

  // follow unfollow logic start to check
  const [isHovered, setIsHovered] = useState(false);
  const [showUnfollowModal, setshowUnfollowModal] = useState(false);

  const getFollowerIds = (array) => {
    return array.map((eachFollower) => {
      return eachFollower._id;
    });
  };

  const getFollowingIds = (array) => {
    if (array) {
      return array.map((eachFollowing) => {
        return eachFollowing._id;
      });
    }
  };

  const handleClose = () => setshowUnfollowModal(false);
  const handleShow = () => setshowUnfollowModal(true);
  // follow unfollow logic finish to check

  const handleUnfollow = () => {
    if (getFollowerIds(profileInfo.followers).includes(userInfo._id)) {
      axios
        .post(
          `${API_URL}/unfollow
          `,
          {
            activeUserId: userInfo._id,
            theUnfollowedUserID: profileInfo._id,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
        .then(() => {
          getFollowingArray();
          // start to check animation basic
          if (postsWindow === "hide") {
            setShow("");
            handleShowSpesificUserProfilePageFavorites();
          } else if (favoriteWindow === "hide") {
            setShow("");
            handleShowSpesificUserProfilePagePosts();
          }
          // finish to check animation basic

          setProfileInfo((prevProfileInfo) => {
            if (Array.isArray(prevProfileInfo.followers)) {
              const updatedFollowers = prevProfileInfo.followers.filter(
                (id) => id !== userInfo._id
              );

              return {
                ...prevProfileInfo,
                followers: updatedFollowers,
              };
            }

            return prevProfileInfo;
          });
          handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFollowingNotification = (selectedUser, userInfo, type) => {
    console.log("Sending notification to => ", selectedUser.username);

    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: selectedUser.username,
      type: type,
      contactHasBeenMade: userInfo,
      senderInfo: userInfo,
    });
  };

  const handleFollow = (selectedUser) => {
    console.log("Button clicked !");
    if (getFollowerIds(profileInfo.followers).includes(userInfo._id)) {
      handleShow();
    } else {
      axios
        .post(
          `${API_URL}/follow`,
          {
            activeUserId: userInfo._id,
            theFollowedUserID: profileInfo._id,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
        .then(() => {
          getFollowingArray();
          handleFollowingNotification(selectedUser, userInfo, "followed"); // start to check animation basic
          if (postsWindow === "hide") {
            setShow("");
            handleShowSpesificUserProfilePageFavorites();
          } else if (favoriteWindow === "hide") {
            setShow("");
            handleShowSpesificUserProfilePagePosts();
          }
          // finish to check animation basic

          setProfileInfo((prevProfileInfo) => {
            if (Array.isArray(prevProfileInfo.followers)) {
              const updatedFollowers = [
                ...prevProfileInfo.followers,
                userInfo._id,
              ];

              return {
                ...prevProfileInfo,
                followers: updatedFollowers,
              };
            }

            return prevProfileInfo;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // follow scenario for private accounts
  const [recipient, setRecipient] = useState([]);

  const getSentFollowRequests = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/users/${userInfo._id}/sent-follow-requests`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const foundedRequestIndex = result.data.findIndex(
        (request) => request.recipient === id
      );

      console.log("founded request:", foundedRequestIndex);

      setRecipient(result.data[foundedRequestIndex]);

      console.log("get sent follow requests:", result);
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (userInfo._id) {
      getSentFollowRequests();
    }

    console.log("recipient:", recipient);
  }, []);

  const sendFollowRequest = async (selectedUser) => {
    showCustomMessage(
      `A follow request has been sent to @${selectedUser.username} and is pending their approval.`,
      6
    );

    try {
      const result = await axios.post(
        `${API_URL}/users/${userInfo._id}/send-follow-request`,
        {
          recipientId: selectedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("follow request sent:", result);

      getSentFollowRequests();
    } catch (error) {
      console.error("error:", error);
    }
  };

  // start to check
  // NOTE must sorted

  console.log("Show profile info posts =>", profileInfoPosts);

  console.log("User rendered favorites =>", favorites);

  const checkIfAllFavoritesFromDeactivatedUser = () => {
    return favorites.map((eachFavorite) => {
      return eachFavorite.deactivatedOwner;
    });
  };

  console.log("Favorites inside spesific user profile favorites =>", favorites);

  const hasFalse = checkIfAllFavoritesFromDeactivatedUser().some(
    (item) => item === false
  );

  console.log(hasFalse);

  useEffect(() => {
    if (postsWindow === "hide") {
      setShow("");
      handleShowSpesificUserProfilePageFavorites();
    } else if (favoriteWindow === "hide") {
      setShow("");
      handleShowSpesificUserProfilePagePosts();
    }
  }, [id]);

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

  const {
    postDeletedMessage,
    postSharedMessage,
    contextHolder,
    showCustomMessage,
  } = useAntdMessageHandler();

  const handleDeletePostFromSpesificUserProfilePage = () => {
    if (favoriteWindow === "") {
      handleShowSpesificUserProfilePageFavorites();
      postDeletedMessage();
    } else if (postsWindow === "") {
      handleShowSpesificUserProfilePagePosts();
      postDeletedMessage();
    }
    setError("");
  };

  const setLoadingTrue = () => {
    setIsLoading(true);
  };

  const setLoadingFalse = () => {
    setIsLoading(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const [visibleTweets, setVisibleTweets] = useState(25);
  const [visibleLikedTweets, setvisibleLikedTweets] = useState(25);
  const handleShowMorePosts = () => {
    setVisibleTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

  const handleShowMoreLikedTweets = () => {
    setvisibleLikedTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

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

  const [room, setRoom] = useState("");
  const [messageRoomId, setmessageRoomId] = useState("");

  const selectedUser = (user) => {
    const room = [userInfo.username, user.username].sort().join("_");
    console.log("message room =>", room);
    setRoom(room);
    // Emit an event to join the room with the selected user
    socket.emit("join_user_room", { activeUser: userInfo, selectedUser: user });
    const handleGetMessageRoomId = (roomId) => {
      setmessageRoomId(roomId);
    };
    console.log("Message room id =>", messageRoomId);
    socket.on("getmessageRoomId", handleGetMessageRoomId);
  };

  useEffect(() => {
    console.log("This line is working !!!");
    if (messageRoomId) {
      window.location.href = `http://localhost:5173/messages/${messageRoomId}`;
    }
  }, [messageRoomId]);

  const checkSpesificUserFollowers = () => {
    return profileInfo?.followers?.map((eachFollowerUser) => {
      return eachFollowerUser._id;
    });
  };

  const isFollowing = checkSpesificUserFollowers()?.includes(userInfo._id);

  console.log("profile info =>", checkSpesificUserFollowers());

  const { width } = useWindowDimensions();

  const [dataFromCommentModal, setDataFromCommentModal] = useState("");
  function handleDataFromCommentModal(data) {
    console.log("Data =>", data);
    setDataFromCommentModal(data);
  }

  const { isPostModalVisible } = useContext(ModalVisibilityContext);

  useEffect(() => {
    if (isNewPostShared && favoriteWindow === "hide") {
      // setLoadingTrue();
      setTimeout(() => {
        // setLoadingFalse();
        handleShowSpesificUserProfilePagePosts();
      }, 200);
    }
  }, [isNewPostShared]);
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

  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeTab, setActiveTab] = useState("forYou");
  const handleHover = (tab) => {
    setHoveredTab(tab);
  };

  const handleLeave = () => {
    setHoveredTab(null);
  };
  const handleShowSpesificUserProfilePageFavorites = () => {
    setActiveTab("likes");
    axios
      .get(`${API_URL}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log("Spesific user profile page response likes =>", response);
        setFavoriteWindow("");
        setPostWindow("hide");
        setFavorites(response.data.favorites);
        setProfileInfo(response.data);
      })
      .catch((err) => {
        return err;
      });
  };
  const handleShowSpesificUserProfilePagePosts = () => {
    setActiveTab("posts");
    axios
      .get(`${API_URL}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log(
          "After opening spesific user profile page response =>",
          response
        );

        setprofileInfoPosts(response.data.posts);
        setPostWindow("");
        setFavoriteWindow("hide");
        setProfileInfo(response.data);
      })

      .catch((err) => {
        return err;
      });
  };
  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
    getFontSizeAndLineHeight11,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
  const font13 = getFontSizeAndLineHeight13();
  const font11 = getFontSizeAndLineHeight11();

  // get following users
  const [followedIds, setFollowedIds] = useState([]);

  const getFollowingArray = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/users/${userInfo._id}/following`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const followedUserIds = result.data.following.map((user) => user._id);
      setFollowedIds(followedUserIds);
    } catch (error) {
      console.error("error:", error);
    }
  };

  const checkIfFollowing = (userId) => {
    return followedIds.includes(userId);
  };

  const [showCancelFollowRequestModal, setShowCancelFollowRequestModal] =
    useState(false);

  const handleCloseCancelFollowRequestModal = () => {
    setShowCancelFollowRequestModal(false);
  };

  useEffect(() => {
    if (userInfo._id) {
      getFollowingArray();
    }
  }, []);

  console.log("recipient request id :", recipient);
  // discard follow request
  const discardFollowRequest = async () => {
    try {
      await axios.post(
        `${API_URL}/users/${userInfo._id}/cancel-follow-request/${recipient._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      getSentFollowRequests();
    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <>
      {/* cancel follow request modal start to check */}
      <Modal
        backdropClassName={
          themeName === "dark-theme" ? `back-drop-${themeName}` : ""
        }
        centered={true}
        key={0}
        show={showCancelFollowRequestModal}
        onHide={handleCloseCancelFollowRequestModal}
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
              Discard follow request?
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
              {`This will cancel your pending request, and @${profileInfo.username} will no longer see it.`}
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
              className={`discard-changes-${themeName}`}
              onClick={() => {
                handleCloseCancelFollowRequestModal();
                discardFollowRequest();
              }}
              style={{
                maxWidth: "256px",
                minHeight: "44px",
                color: themeName === "dark-theme" ? "black" : "white",
                backgroundColor: themeName === "dark-theme" ? "white" : "black",
                border: "none",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
            >
              Discard
            </Button>
            <Button
              variant="light"
              onClick={handleCloseCancelFollowRequestModal}
              style={{
                color: themeName === "dark-theme" ? "white" : "black",
                maxWidth: "256px",
                minHeight: "44px",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              className={`mt-2 forgot-password-btn ${themeName}-black-btn chirp-bold-font`}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* cancel follow request modal finish to check */}
      {contextHolder}
      {!isPostModalVisible && !dataFromCommentModal && (
        <ResponsiveNavigationBarBottom
          refreshPosts={() => handleShowSpesificUserProfilePagePosts()}
          setLoadingTrue={() => setLoadingTrue()}
          setLoadingFalse={() => setLoadingFalse()}
        />
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
        {/* unfollow modal start to check  */}
        <UnfollowModal
          selectedUser={profileInfo}
          handleUnfollow={handleUnfollow}
          showUnfollowModal={showUnfollowModal}
          handleClose={handleClose}
        />
        {/* unfollow modal finish to check  */}

        <Stack
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
                : width > 500 && themeName === "light-theme"
                ? "rgba(255, 255, 255, 0.85)"
                : null,
            backdropFilter: width > 500 && "blur(12px)",
            zIndex: width > 500 && 1,
          }}
          direction="horizontal"
          gap={0}
        >
          <div
            onClick={handleGoBack}
            // className="p-2 arrow"
            className={`arrow arrow-${themeName}`}
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
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 p-2 chirp-bold-font"
                : "very-dark-gray-light-theme-text-variant-1 p-2 chirp-bold-font"
            }
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: ".2rem",
                alignItems: "center",
              }}
            >
              <div
                className="chirp-bold-font"
                style={{
                  lineHeight: width <= 500 ? "20px" : "24px",
                  fontSize: width <= 500 ? "17px" : "20px",
                }}
              >
                {profileInfo.fullname}
              </div>
              {profileInfo?.isPrivate && (
                <div
                  style={{
                    marginLeft: "5px",
                    display: "flex",
                  }}
                >
                  <svg
                    fill={themeName === "dark-theme" ? "#E6E9EA" : "#0F141A"}
                    width={`${1}em`}
                    height={`${1}em`}
                    viewBox="0 0 24 24"
                    aria-label="Protected account"
                    role="img"
                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-18jsvk2 r-f9ja8p r-og9te1"
                    data-testid="icon-lock"
                  >
                    <g>
                      <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
                    </g>
                  </svg>
                </div>
              )}

              <div>
                {" "}
                {profileInfo?.hasSubscription ||
                (!subscription?.isActive &&
                  subscription?.remainingTimeSubscription &&
                  subscription?.cancelledDate &&
                  subscription?.owner === profileInfo?._id) ||
                remainingTimeSubscriptionsOwnerIds.includes(
                  profileInfo?._id
                ) ? (
                  <span>
                    {/* start to check  */}{" "}
                    <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                      <svg
                        width={`${20}px`}
                        height={`${20}px`}
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
                ) : (
                  <span> </span>
                )}
              </div>
            </div>

            {profileInfo.posts && (
              <div
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                }}
                className="profile-paragraph chirp-regular-font"
              >
                {profileInfo.posts.length} posts
              </div>
            )}
          </div>
        </Stack>
        {/* start to check stack on the way  */}
        <div
          style={{
            backgroundColor:
              themeName === "light-theme" ? "rgb(207, 217, 222)" : "",
            height: "200px",
            position: "relative",
            backgroundImage: `url("https://marketplace.canva.com/EAE91Kz0wsI/1/0/1600w/canva-blue-yellow-retro-quotes-twitter-header-xTB_BZnqeew.jpg")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              position: "absolute",
              bottom: -80,
            }}
          >
            {profileInfo.imageUrl && (
              <div>
                {profileInfo.imageUrl.slice(0, 3) !== "../" ? (
                  <div>
                    <img
                      width={133}
                      height={133}
                      src={profileInfo.imageUrl}
                      alt=""
                      style={{
                        borderRadius: "50%",
                        border:
                          themeName === "dark-theme"
                            ? "4px solid black"
                            : "4px solid white",
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <img
                      style={{
                        cursor: "pointer",
                        borderRadius: "50%",
                        border:
                          themeName === "dark-theme"
                            ? "4px solid black"
                            : "4px solid white",
                        cursor: "pointer",
                      }}
                      width="133"
                      height="133"
                      src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                      alt=""
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: "0px 12px",
            marginTop: "60px",
          }}
        >
          {profileInfo._id !== userInfo._id ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                gap: "10px",
              }}
              className="ms-auto"
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border:
                    themeName !== "dark-theme"
                      ? "1px solid rgb(185, 202, 211)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
                className={`spesific-profile-svg-three-dots spesific-profile-svg-three-dots-${themeName}`}
              >
                {" "}
                <BootstrapTooltip
                  title="More"
                  themeName={
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }
                >
                  <svg
                    style={{
                      display: "flex",
                    }}
                    color={themeName === "dark-theme" ? "white" : ""}
                    fill="currentColor"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                  >
                    <g>
                      <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                    </g>
                  </svg>{" "}
                </BootstrapTooltip>
              </div>
              {/* start to check redirect to the messages  */}
              <div
                onClick={() => selectedUser(profileInfo)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border:
                    themeName !== "dark-theme"
                      ? "1px solid rgb(185, 202, 211)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
                className={`spesific-profile-svg-dm spesific-profile-svg-dm-${themeName}`}
              >
                <BootstrapTooltip
                  title="Message"
                  themeName={
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }
                >
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                    color="color: rgb(15, 20, 25)"
                    fill="currentColor"
                  >
                    <g>
                      <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                    </g>
                  </svg>
                </BootstrapTooltip>
              </div>
              {/* finish to check redirect to the messages  */}
              {profileInfo.isPrivate && !checkIfFollowing(profileInfo._id) ? (
                <Button
                  className="chirp-bold-font"
                  onClick={() => {
                    if (recipient && isHovered) {
                      setShowCancelFollowRequestModal(true);
                    } else {
                      sendFollowRequest(profileInfo);
                    }
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  variant="dark"
                  style={{
                    transitionDuration: "0.2s",
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                    display: "inline",
                    maxWidth: "107px",
                    border:
                      themeName !== "dark-theme"
                        ? recipient && !isHovered
                          ? "1px solid rgba(231,231,231)"
                          : recipient && isHovered
                          ? "1px solid rgba(231,231,231)"
                          : "white"
                        : "1px solid rgb(70, 70, 70)",
                    backgroundColor:
                      themeName !== "dark-theme"
                        ? recipient && !isHovered
                          ? "white"
                          : recipient && isHovered
                          ? "#e7e7e8"
                          : "black"
                        : recipient && !isHovered
                        ? "transparent"
                        : recipient && isHovered
                        ? "#181818"
                        : "white",
                    color:
                      themeName !== "dark-theme"
                        ? recipient && !isHovered
                          ? "black"
                          : recipient && isHovered
                          ? "black"
                          : "white"
                        : recipient && !isHovered
                        ? "white"
                        : recipient && isHovered
                        ? "white"
                        : "black",
                  }}
                >
                  {recipient && !isHovered
                    ? "Pending"
                    : recipient && isHovered
                    ? "Cancel"
                    : "Follow"}
                </Button>
              ) : (
                <Button
                  className="chirp-bold-font"
                  onClick={() => handleFollow(profileInfo)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transitionDuration: "0.2s",
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                    display: "inline",
                    maxWidth: "107px",

                    border:
                      isHovered && isFollowing && themeName !== "dark-theme"
                        ? "1px solid rgba(253,201,206,255)"
                        : isHovered && isFollowing && themeName === "dark-theme"
                        ? "1px solid #e71f2c"
                        : isFollowing && themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : "1px solid rgb(70, 70, 70)",
                    backgroundColor:
                      !isFollowing && themeName === "dark-theme" && !isHovered
                        ? "white"
                        : !isFollowing &&
                          themeName === "dark-theme" &&
                          isHovered
                        ? "#d7dbdc"
                        : isHovered && isFollowing && themeName !== "dark-theme"
                        ? "rgba(255,234,235,255)"
                        : isHovered && isFollowing && themeName === "dark-theme"
                        ? "#230608"
                        : isFollowing && themeName === "dark-theme"
                        ? "black"
                        : isFollowing && themeName !== "dark-theme"
                        ? "white"
                        : !isFollowing &&
                          themeName !== "dark-theme" &&
                          isHovered
                        ? "#272c30"
                        : "black",
                    color:
                      !isFollowing && themeName === "dark-theme"
                        ? "black"
                        : isHovered && isFollowing
                        ? "rgba(244,34,45,255)"
                        : isFollowing && themeName !== "dark-theme"
                        ? "black"
                        : "white",
                  }}
                  variant="dark"
                >
                  {profileInfo.followers
                    ? getFollowerIds(profileInfo.followers).includes(
                        userInfo._id
                      )
                      ? isHovered
                        ? "Unfollow"
                        : "Following"
                      : "Follow"
                    : null}
                </Button>
              )}
            </div>
          ) : null}
        </div>

        <div
          style={{
            lineHeight: "30px",
            marginBottom: "20px",
            padding: "0px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: ".2rem",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                fontSize: font20.fontSize,
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                  : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              }
            >
              {profileInfo.fullname}
            </div>
            {profileInfo?.isPrivate && (
              <div
                style={{
                  marginLeft: "5px",
                  display: "flex",
                }}
              >
                <svg
                  fill={themeName === "dark-theme" ? "#E6E9EA" : "#0F141A"}
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-label="Protected account"
                  role="img"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-18jsvk2 r-f9ja8p r-og9te1"
                  data-testid="icon-lock"
                >
                  <g>
                    <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
                  </g>
                </svg>
              </div>
            )}

            <div>
              {" "}
              {profileInfo?.hasSubscription ||
              (!subscription?.isActive &&
                subscription?.remainingTimeSubscription &&
                subscription?.cancelledDate &&
                subscription?.owner === profileInfo?._id) ||
              remainingTimeSubscriptionsOwnerIds.includes(profileInfo?._id) ? (
                <span>
                  {/* start to check  */}{" "}
                  <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                    <svg
                      width={`${20}px`}
                      height={`${20}px`}
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
              ) : (
                <span> </span>
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
            }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
            }
          >
            @{profileInfo.username}
            {""}
            {""}
            {profileInfo._id !== userInfo._id ? (
              <>
                {getFollowingIds(profileInfo?.following)?.includes(
                  userInfo._id
                ) ? (
                  <>
                    <span
                      className="chirp-medium-font"
                      style={{
                        backgroundColor:
                          themeName === "dark-theme"
                            ? "#202327"
                            : "rgba(239,243,244,1.00)",

                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",

                        marginLeft: "4px",
                        fontSize: font11.fontSize,
                        lineHeight: font11.lineHeight,
                        paddingLeft: "4px",
                        paddingRight: "4px",
                        paddingBottom: "2px",
                        paddingTop: "2px",
                        borderRadius: "3px",
                      }}
                    >
                      {getFollowingIds(profileInfo.following)
                        ? getFollowingIds(profileInfo.following).includes(
                            userInfo._id
                          )
                          ? "Follows you"
                          : null
                        : null}
                    </span>
                  </>
                ) : null}
              </>
            ) : null}
          </div>
          <div>
            <div
              className="mt-2"
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                gap: "0.5%",
              }}
            >
              <svg
                color={
                  themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)"
                }
                fill="currentColor"
                width={`${1.25}em`}
                height={`${1.25}em`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1d4mawv"
              >
                <g>
                  <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
                </g>
              </svg>
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
                Joined{" "}
                {getCreatedYearForSpesificUserProfilePage(
                  profileInfo.createdAt
                )}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "3%",
            }}
          >
            <Link
              to={`/profile/${profileInfo._id}/following`}
              style={{
                textDecoration: "none",
                color: themeName === "dark-theme" ? "white" : "black",
                cursor:
                  profileInfo.isPrivate &&
                  !checkIfFollowing(profileInfo._id) &&
                  profileInfo._id !== userInfo._id
                    ? "default"
                    : "pointer",
                pointerEvents:
                  profileInfo.isPrivate &&
                  !checkIfFollowing(profileInfo._id) &&
                  profileInfo._id !== userInfo._id
                    ? "none"
                    : "auto",
              }}
              className={`${
                profileInfo.isPrivate &&
                !checkIfFollowing(profileInfo._id) &&
                profileInfo._id !== userInfo._id
                  ? ""
                  : "following-followers-link"
              } chirp-bold-font`}
            >
              <span
                style={{
                  fontSize: font14.fontSize,
                  lineHeight: font14.lineHeight,
                }}
              >
                {profileInfo.following && (
                  <span>{profileInfo.following.length}</span>
                )}
              </span>{" "}
              <span
                className="chirp-regular-font"
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font14.fontSize,
                  lineHeight: font14.lineHeight,
                }}
              >
                Following
              </span>{" "}
            </Link>
            <Link
              to={`/profile/${profileInfo._id}/followers`}
              style={{
                textDecoration: "none",
                color: themeName === "dark-theme" ? "white" : "black",
                cursor:
                  profileInfo.isPrivate &&
                  !checkIfFollowing(profileInfo._id) &&
                  profileInfo._id !== userInfo._id
                    ? "default"
                    : "pointer",
                pointerEvents:
                  profileInfo.isPrivate &&
                  !checkIfFollowing(profileInfo._id) &&
                  profileInfo._id !== userInfo._id
                    ? "none"
                    : "auto",
              }}
              className={`${
                profileInfo.isPrivate &&
                !checkIfFollowing(profileInfo._id) &&
                profileInfo._id !== userInfo._id
                  ? ""
                  : "following-followers-link"
              } chirp-bold-font`}
            >
              <span
                className="chirp-bold-font"
                style={{
                  cursor: "pointer",
                  fontSize: font14.fontSize,
                  lineHeight: font14.lineHeight,
                }}
              >
                {profileInfo.followers && (
                  <span>{profileInfo.followers.length}</span>
                )}
              </span>{" "}
              <span
                className="chirp-regular-font"
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font14.fontSize,
                  lineHeight: font14.lineHeight,
                }}
              >
                <span>
                  {profileInfo.followers
                    ? profileInfo.followers.length > 1
                      ? "Followers"
                      : profileInfo.followers.length === 0
                      ? "Followers"
                      : "Follower"
                    : null}
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* finish to check responsive error container  */}

        {profileInfo.deactivatedOwner ||
        (profileInfo.isPrivate &&
          !checkIfFollowing(profileInfo._id) &&
          profileInfo._id !== userInfo._id) ? (
          <div
            style={{
              maxWidth: "400px",
              padding: "40px 20px",
              margin: "32px auto",
            }}
          >
            <div
              className="chirp-heavy-font"
              style={{
                fontSize: font31.fontSize,
                lineHeight: font31.lineHeight,
                fontWeight: "800",
                color: themeName === "dark-theme" ? "white" : "black",
              }}
            >
              These posts are protected
            </div>
            <div
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
              }
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
                marginTop: "5px",
              }}
            >
              Only approved followers can see @{profileInfo.username}'s posts.
              To request access, click Follow.{" "}
              <span className="customize-experience-tab">Learn more</span>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
              }}
            >
              <span
                className={
                  themeName === "dark-theme"
                    ? "hover-effect-dark-theme-pointer-plus chirp-bold-font"
                    : themeName !== "dark-theme"
                    ? "hover-effect-light-theme-pointer-plus"
                    : null
                }
                onMouseEnter={() => handleHover("posts")}
                onMouseLeave={handleLeave}
                onClick={() => handleShowSpesificUserProfilePagePosts()}
                style={{
                  color:
                    activeTab === "posts" && themeName !== "dark-theme"
                      ? "#0f141a"
                      : activeTab === "posts" && themeName === "dark-theme"
                      ? "#e6e9ea"
                      : themeName === "dark-theme"
                      ? "#71767A"
                      : "#526371",
                  fontWeight: activeTab === "posts" ? "700" : "500",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  cursor: "pointer",
                  flex: 1,
                  textAlign: "center",
                  transition: "background 0.3s",
                  maxHeight: "inherit",
                }}
              >
                {/* { color: #e6e9ea !important; }  { color: #0f141a !important; } */}
                <div
                  style={{
                    display: "inline-flex",
                    padding: "16px 0px 16px 0px",
                    flexDirection: "column",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    className={
                      themeName === "dark-theme" && activeTab === "posts"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : themeName !== "dark-theme" && activeTab === "posts"
                        ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        : themeName === "dark-theme" && activeTab !== "posts"
                        ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                        : themeName !== "dark-theme" && activeTab !== "posts"
                        ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                        : null
                    }
                  >
                    Posts
                  </span>
                  {activeTab === "posts" && (
                    <div
                      style={{
                        backgroundColor: "rgb(29, 155, 240)",
                        height: "4px",
                        width: "100%",
                        minWidth: "56px",
                        position: "absolute",
                        bottom: "0px",
                        borderRadius: "9999px",
                      }}
                    ></div>
                  )}
                </div>
              </span>

              <span
                className={
                  themeName === "dark-theme"
                    ? "hover-effect-dark-theme-pointer-plus "
                    : themeName !== "dark-theme"
                    ? "hover-effect-light-theme-pointer-plus "
                    : null
                }
                onMouseEnter={() => handleHover("likes")}
                onMouseLeave={handleLeave}
                onClick={() => handleShowSpesificUserProfilePageFavorites()}
                style={{
                  color:
                    activeTab === "likes" && themeName !== "dark-theme"
                      ? "#0f141a"
                      : activeTab === "likes" && themeName === "dark-theme"
                      ? "#e6e9ea"
                      : themeName === "dark-theme"
                      ? "#71767A"
                      : "#526371",
                  fontWeight: activeTab === "likes" ? "700" : "500",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  cursor: "pointer",
                  flex: 1,
                  textAlign: "center",
                  transition: "background 0.3s",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    padding: "16px 0px 16px 0px",
                    flexDirection: "column",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    className={
                      themeName === "dark-theme" && activeTab === "likes"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : themeName !== "dark-theme" && activeTab === "likes"
                        ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        : themeName === "dark-theme" && activeTab !== "likes"
                        ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                        : themeName !== "dark-theme" && activeTab !== "likes"
                        ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                        : null
                    }
                  >
                    Likes
                  </span>{" "}
                  {activeTab === "likes" && (
                    <div
                      style={{
                        backgroundColor: "rgb(29, 155, 240)",
                        height: "4px",
                        width: "100%",
                        minWidth: "56px",
                        position: "absolute",
                        bottom: "0px",
                        borderRadius: "9999px",
                      }}
                    ></div>
                  )}
                </div>
              </span>
            </div>
            {postsWindow || favoriteWindow ? (
              <div
                style={{
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
              ></div>
            ) : null}
            <span>
              {isLoading &&
              userInfo._id === profileInfo._id &&
              favoriteWindow === "hide" ? (
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              ) : (
                ""
              )}
            </span>

            {/* finish */}
            {/* start to check */}
            <div
              style={{
                height:
                  width <= 700 && profileInfoPosts.length < 2 ? "30vh" : "",
              }}
              className={`all-posts ${postsWindow}`}
            >
              {profileInfoPosts.length ? (
                <>
                  {profileInfoPosts
                    .slice(0, visibleTweets)
                    .map((post, index) => (
                      <div
                        onClick={() => {
                          console.log("Post box parent class =>", post);
                          setclickedPostBox(post);
                        }}
                        className={
                          themeName === "dark-theme"
                            ? `each-post-${themeName}`
                            : "each-post"
                        }
                        key={post._id}
                      >
                        {post.deactivatedOwner ? null : (
                          <>
                            <div
                              style={{
                                textDecoration: "none",
                              }}
                              onClick={() => {
                                setclickedPostBox(post);
                              }}
                              className="posts-details outside-of-inner-circle-actions"
                            >
                              <div className="post-head">
                                {post.isReposted &&
                                userInfo._id === profileInfo._id ? (
                                  <>
                                    <svg
                                      style={{
                                        marginLeft: "10px",
                                        position: "relative",
                                        top: "5px",
                                        left: "20px",
                                      }}
                                      width={16}
                                      height={16}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      fill={
                                        themeName === "dark-theme"
                                          ? "#71767A"
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
                                    <Link
                                      className={`hover-reposted-text hover-reposted-text-${themeName} chirp-bold-font`}
                                      style={{
                                        fontSize: font13.fontSize,
                                        lineHeight: font13.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                        marginLeft: "10px",
                                        cursor: "pointer",
                                        textDecoration: "none",
                                        position: "relative",
                                        top: "5px",
                                        left: "15px",
                                      }}
                                      onClick={() => setclickedPostBox(post)}
                                      to={`/profile/${post.reposted[0]._id}`}
                                    >
                                      You reposted
                                    </Link>{" "}
                                  </>
                                ) : null}
                                {/* start to check */}
                                {post.isReposted &&
                                userInfo._id !== profileInfo._id ? (
                                  <div
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    <svg
                                      style={{
                                        marginLeft: "10px",
                                        position: "relative",
                                        top: "5px",
                                        left: "20px",
                                      }}
                                      width={`16px`}
                                      height={`16px`}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="repost-svg-post-box svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                      fill={
                                        themeName === "dark-theme"
                                          ? "#71767A"
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
                                    <span>
                                      <Link
                                        style={{
                                          fontSize: font13.fontSize,
                                          lineHeight: font13.lineHeight,
                                          color:
                                            themeName === "dark-theme"
                                              ? "#71767A"
                                              : "rgb(83, 100, 113)",
                                          marginLeft: "10px",
                                          cursor: "pointer",
                                          textDecoration: "none",
                                          position: "relative",
                                          top: "5px",
                                          left: "15px",
                                        }}
                                        className={`hover-reposted-text hover-reposted-text-${themeName} chirp-bold-font`}
                                        onClick={() => setclickedPostBox(post)}
                                        to={`/profile/${post.reposted[0]._id}`}
                                      >
                                        {profileInfo.fullname} reposted
                                      </Link>{" "}
                                    </span>
                                  </div>
                                ) : null}
                                {/* finish to check */}
                              </div>
                              <Stack
                                style={{
                                  cursor: "pointer",
                                }}
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]?._id
                                }`}
                                onClick={() => setclickedPostBox(post)}
                                className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                                direction="horizontal"
                                gap={1}
                              >
                                {/* profile image start to check */}

                                <div className="p-1">
                                  {post.userId.imageUrl.slice(0, 3) !==
                                  "../" ? (
                                    <Link
                                      className="post-circle-profile-image-on-point"
                                      style={{ cursor: "pointer" }}
                                      to={`/profile/${
                                        post ? post.userId._id : null
                                      }`}
                                    >
                                      <img
                                        width={40}
                                        height={40}
                                        src={post.userId.imageUrl}
                                        alt=""
                                        style={{
                                          borderRadius: "50%",
                                        }}
                                      />
                                    </Link>
                                  ) : (
                                    <Link
                                      className="post-circle-profile-svg-on-point"
                                      to={`/profile/${
                                        post.userId ? post.userId._id : null
                                      }`}
                                      style={{ cursor: "pointer" }}
                                    >
                                      {" "}
                                      <img
                                        style={{
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
                                  {post.userId ? (
                                    <>
                                      <Link
                                        className="post-circle-postowner-fullname"
                                        to={`/profile/${post.userId._id}`}
                                        style={{
                                          textDecoration: "none",
                                          color: "black",
                                        }}
                                      >
                                        <span
                                          className="hover-fullname chirp-bold-font"
                                          style={{
                                            fontSize: font15.fontSize,
                                            lineHeight: font15.lineHeight,
                                            color:
                                              themeName === "dark-theme"
                                                ? "white"
                                                : "",
                                          }}
                                        >
                                          {post.authorFullName}
                                        </span>
                                      </Link>
                                      {post?.userId?.isPrivate && (
                                        <span
                                          style={{
                                            marginLeft: "5px",
                                          }}
                                        >
                                          <svg
                                            fill={
                                              themeName === "dark-theme"
                                                ? "#E6E9EA"
                                                : "#0F141A"
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            viewBox="0 0 24 24"
                                            aria-label="Protected account"
                                            role="img"
                                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-18jsvk2 r-f9ja8p r-og9te1"
                                            data-testid="icon-lock"
                                          >
                                            <g>
                                              <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
                                            </g>
                                          </svg>
                                        </span>
                                      )}
                                      {post?.userId.hasSubscription ||
                                      (!subscription?.isActive &&
                                        subscription?.remainingTimeSubscription &&
                                        subscription?.cancelledDate &&
                                        subscription?.owner ===
                                          post?.userId._id) ||
                                      remainingTimeSubscriptionsOwnerIds.includes(
                                        post?.userId._id
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
                                      ) : (
                                        <span> </span>
                                      )}
                                      <Link
                                        className="chirp-regular-font"
                                        to={`/profile/${post.userId._id}`}
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
                                        <span className="chirp-regular-font">
                                          <span>@{post.authorUserName}</span>
                                        </span>
                                      </Link>
                                      <Link
                                        style={{
                                          textDecoration: "none",
                                        }}
                                        to={`/${post.userId.username}/status/${
                                          !post.isReposted
                                            ? post._id
                                            : post
                                                .repostedFromThisOriginalPost[0]
                                                ?._id
                                        }`}
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
                                              post.createdAt
                                            )}
                                            themeName={
                                              themeName === "dark-theme"
                                                ? "dark-theme"
                                                : "light-theme"
                                            }
                                          >
                                            <span className="date-post-detail chirp-regular-font">
                                              {getCreatedDateForSpesificUserProfilePage(
                                                post.createdAt
                                              )}
                                            </span>{" "}
                                          </BootstrapTooltip>
                                        </span>
                                      </Link>
                                      {/* finish to check  */}
                                    </>
                                  ) : null}
                                </div>
                                {/* post owner full name + verified account svg + post owner user name + post created date  fi


                        
                        {/* three dots svg start to check */}
                                <div className="p-1 ms-auto">
                                  <PostPopover
                                    postDeletionProcess={
                                      handleDeletePostFromSpesificUserProfilePage
                                    }
                                    post={post}
                                    refreshPosts={
                                      handleShowSpesificUserProfilePagePosts
                                    }
                                  />
                                </div>
                                {/* three dots svg finish to check */}
                              </Stack>

                              {/* post content start to check  */}
                              <Stack
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]?._id
                                }`}
                                onClick={() => setclickedPostBox(post)}
                                className="outside-of-inner-circle-action-comment-text"
                                direction="vertical"
                                gap={1}
                              >
                                {post.isComment ? (
                                  <div
                                    to={`/${post.userId.username}/status/${
                                      !post.isReposted
                                        ? post._id
                                        : post.repostedFromThisOriginalPost[0]
                                            ?._id
                                    }`}
                                    onClick={() => setclickedPostBox(post)}
                                    className="p-2 parent-comment-text"
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
                                      Replying to {""}
                                    </span>
                                    <Link
                                      to={`/profile/${post.commentedForThisUsersPost._id}`}
                                      style={{
                                        textDecoration: "none",
                                      }}
                                    >
                                      <span
                                        className="replying-to-text chirp-regular-font"
                                        style={{
                                          color: "rgb(29, 155, 240)",
                                          cursor: "pointer",
                                          fontSize: font15.fontSize,
                                          lineHeight: font15.lineHeight,
                                        }}
                                      >
                                        @
                                        {
                                          post.commentedForThisUsersPost
                                            .username
                                        }
                                      </span>
                                    </Link>
                                  </div>
                                ) : null}
                                <Link
                                  style={{
                                    textDecoration: "none",
                                    color: "rgb(15, 20, 25)",
                                  }}
                                  to={`/${post.userId.username}/status/${
                                    !post.isReposted
                                      ? post._id
                                      : post.repostedFromThisOriginalPost[0]
                                          ?._id
                                  }`}
                                >
                                  <div
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      overflowWrap: "break-word",
                                      maxWidth: "100%",
                                      cursor: "pointer",
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "",
                                    }}
                                    className="p-2 chirp-regular-font"
                                  >
                                    {post.content}
                                  </div>
                                </Link>
                              </Stack>
                              {/* post content finish to check  */}

                              {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}

                              {post.image.url !== "image@url" ? (
                                <>
                                  <Link
                                    to={`/${post.userId.username}/status/${
                                      !post.isReposted
                                        ? post._id
                                        : post.repostedFromThisOriginalPost[0]
                                            ?._id
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
                                        src={post.image.url}
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
                                  onClick={() => setclickedPostBox(post)}
                                  className="p-1 next-to-comment"
                                >
                                  <CommentModal
                                    post={post}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    refreshPosts={
                                      handleShowSpesificUserProfilePagePosts
                                    }
                                    sendDataToParent={
                                      handleDataFromCommentModal
                                    }
                                    postSharedMessage={postSharedMessage}
                                  />
                                </div>

                                {/* start to check */}
                                <div
                                  style={{
                                    width: "100px",
                                  }}
                                  className="p-1"
                                >
                                  <RepostAction
                                    post={post ? post : null}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    refreshPosts={
                                      handleShowSpesificUserProfilePagePosts
                                    }
                                    setLoadingFalse={setLoadingFalse}
                                    setLoadingTrue={setLoadingTrue}
                                  />
                                </div>

                                {/* finish to check  */}
                                <div
                                  style={{
                                    width: "100px",
                                  }}
                                  className="p-1"
                                >
                                  <LikeAction
                                    post={post ? post : null}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    refreshPosts={
                                      handleShowSpesificUserProfilePagePosts
                                    }
                                    setLoadingFalse={setLoadingFalse}
                                    setLoadingTrue={setLoadingTrue}
                                  />
                                </div>
                                <div
                                  style={{
                                    width: "100px",
                                  }}
                                  className="p-1"
                                >
                                  <BookmarkAction
                                    post={post ? post : null}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    refreshPosts={
                                      handleShowSpesificUserProfilePagePosts
                                    }
                                    setLoadingFalse={setLoadingFalse}
                                    setLoadingTrue={setLoadingTrue}
                                  />
                                </div>
                              </Stack>
                              {/* new version favorite repost comment finish to check */}
                            </div>
                            <div
                              onClick={() => {
                                console.log("Post box child class =>", post);
                                setclickedPostBox(post);
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
                          </>
                        )}
                      </div>
                    ))}
                  {visibleTweets < profileInfoPosts.length && (
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item style={{ border: "none" }} eventKey="1">
                        <Accordion.Header
                          style={{ border: "none" }}
                          className={`accordion-2 accordion-2-${themeName}`}
                        >
                          <div
                            className=" chirp-regular-font"
                            onClick={handleShowMorePosts}
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
                            Show more
                          </div>
                        </Accordion.Header>
                        <Accordion.Body></Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  )}
                </>
              ) : (
                <>
                  {/* when no post shared yet from other profile posts section in general start to check  */}

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
                      {profileInfo._id !== userInfo._id
                        ? "@" +
                          profileInfo.username +
                          " " +
                          "haven’t posted anything yet"
                        : "You haven't posted anything yet."}
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
                      {profileInfo._id !== userInfo._id
                        ? "When they do, those posts will show up here."
                        : "Start sharing your thoughts!"}
                    </div>
                  </div>
                  {/* when no post shared yet from other profile posts section in general finish to check  */}
                </>
              )}
            </div>
            {/* finish to check */}
            {/* start */}
            <div
              style={{
                height: width <= 700 && favorites.length < 2 ? "30vh" : "",
              }}
              className={`${favoriteWindow} all-favorites`}
            >
              {favorites.length && hasFalse ? (
                <>
                  {favorites
                    .slice(0, visibleLikedTweets)
                    .map((favorite, index) => (
                      <>
                        <div
                          onClick={() => {
                            console.log("Post box parent class =>", favorite);
                            setclickedPostBox(favorite);
                          }}
                          className={
                            themeName === "dark-theme"
                              ? `each-post-${themeName}`
                              : "each-post"
                          }
                          key={favorite?._id}
                        >
                          {favorite.deactivatedOwner ? null : (
                            <>
                              <div
                                style={{
                                  textDecoration: "none",
                                }}
                                onClick={() => {
                                  setclickedPostBox(favorite);
                                }}
                                className="posts-details outside-of-inner-circle-actions"
                              >
                                <div className="favorite-head">
                                  <Stack
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    to={`/${favorite.userId.username}/status/${
                                      !favorite.isReposted
                                        ? favorite._id
                                        : favorite
                                            .repostedFromThisOriginalPost[0]
                                            ?._id
                                    }`}
                                    onClick={() => setclickedPostBox(favorite)}
                                    className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                                    direction="horizontal"
                                    gap={1}
                                  >
                                    {/* profile image start to check */}
                                    <div className="p-1">
                                      {favorite.userId.imageUrl.slice(0, 3) !==
                                      "../" ? (
                                        <Link
                                          className="post-circle-profile-image-on-point"
                                          style={{ cursor: "pointer" }}
                                          to={`/profile/${
                                            favorite
                                              ? favorite.userId._id
                                              : null
                                          }`}
                                        >
                                          <img
                                            width={40}
                                            height={40}
                                            src={favorite.userId.imageUrl}
                                            alt="??"
                                            style={{ borderRadius: "50%" }}
                                          />
                                        </Link>
                                      ) : (
                                        <Link
                                          className="post-circle-profile-svg-on-point"
                                          to={`/profile/${
                                            favorite.userId
                                              ? favorite.userId._id
                                              : null
                                          }`}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {" "}
                                          <img
                                            style={{
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
                                      {favorite.userId ? (
                                        <>
                                          <Link
                                            className="post-circle-postowner-fullname"
                                            to={`/profile/${favorite.userId._id}`}
                                            style={{
                                              textDecoration: "none",
                                              color: "black",
                                            }}
                                          >
                                            <span
                                              className="hover-fullname chirp-bold-font"
                                              style={{
                                                fontSize: font15.fontSize,
                                                lineHeight: font15.lineHeight,
                                                color:
                                                  themeName === "dark-theme"
                                                    ? "white"
                                                    : "",
                                              }}
                                            >
                                              {favorite.authorFullName}
                                            </span>
                                          </Link>{" "}
                                          {favorite?.userId.isPrivate && (
                                            <span>
                                              <svg
                                                fill={
                                                  themeName === "dark-theme"
                                                    ? "#E6E9EA"
                                                    : "#0F141A"
                                                }
                                                width={`${1.25}em`}
                                                height={`${1.25}em`}
                                                viewBox="0 0 24 24"
                                                aria-label="Protected account"
                                                role="img"
                                                className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-18jsvk2 r-f9ja8p r-og9te1"
                                                data-testid="icon-lock"
                                              >
                                                <g>
                                                  <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
                                                </g>
                                              </svg>
                                            </span>
                                          )}
                                          {favorite?.userId.hasSubscription ||
                                          (!subscription?.isActive &&
                                            subscription?.remainingTimeSubscription &&
                                            subscription?.cancelledDate &&
                                            subscription?.owner ===
                                              favorite?.userId._id) ||
                                          remainingTimeSubscriptionsOwnerIds.includes(
                                            favorite?.userId._id
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
                                          ) : (
                                            <span> </span>
                                          )}
                                          <Link
                                            className="chirp-regular-font"
                                            to={`/profile/${favorite.userId._id}`}
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
                                            <span className="chirp-regular-font">
                                              <span>
                                                @{favorite.authorUserName}
                                              </span>
                                            </span>
                                          </Link>
                                          <Link
                                            style={{
                                              textDecoration: "none",
                                            }}
                                            to={`/${
                                              favorite.userId.username
                                            }/status/${
                                              !favorite.isReposted
                                                ? favorite._id
                                                : favorite
                                                    .repostedFromThisOriginalPost[0]
                                                    ?._id
                                            }`}
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
                                                  favorite.createdAt
                                                )}
                                                themeName={
                                                  themeName === "dark-theme"
                                                    ? "dark-theme"
                                                    : "light-theme"
                                                }
                                              >
                                                <span className="date-post-detail chirp-regular-font">
                                                  {getCreatedDateForSpesificUserProfilePage(
                                                    favorite.createdAt
                                                  )}
                                                </span>{" "}
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
                                          handleDeletePostFromSpesificUserProfilePage
                                        }
                                        post={favorite}
                                        refreshPosts={
                                          handleShowSpesificUserProfilePagePosts
                                        }
                                      />
                                    </div>
                                    {/* three dots svg finish to check */}
                                  </Stack>
                                </div>

                                {/* post content start to check  */}
                                <Stack
                                  to={`/${favorite.userId.username}/status/${
                                    !favorite.isReposted
                                      ? favorite._id
                                      : favorite.repostedFromThisOriginalPost[0]
                                          ?._id
                                  }`}
                                  onClick={() => setclickedPostBox(favorite)}
                                  className="outside-of-inner-circle-action-comment-text"
                                  direction="vertical"
                                  gap={1}
                                >
                                  <Link
                                    style={{
                                      textDecoration: "none",
                                      color: "rgb(15, 20, 25)",
                                    }}
                                    to={`/${favorite.userId.username}/status/${
                                      !favorite.isReposted
                                        ? favorite._id
                                        : favorite
                                            .repostedFromThisOriginalPost[0]
                                            ?._id
                                    }`}
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
                                            : "",
                                      }}
                                      className="p-2 chirp-regular-font"
                                    >
                                      {favorite.content}
                                    </div>
                                  </Link>
                                </Stack>
                                {/* post content finish to check  */}

                                {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                                {favorite.image.url !== "image@url" ? (
                                  <>
                                    <Link
                                      to={`/${
                                        favorite.userId.username
                                      }/status/${
                                        !favorite.isReposted
                                          ? favorite._id
                                          : favorite
                                              .repostedFromThisOriginalPost[0]
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
                                          src={favorite.image.url}
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
                                    onClick={() => setclickedPostBox(favorite)}
                                    className="p-1 next-to-comment"
                                  >
                                    <CommentModal
                                      post={favorite}
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      refreshPosts={
                                        handleShowSpesificUserProfilePageFavorites
                                      }
                                      sendDataToParent={
                                        handleDataFromCommentModal
                                      }
                                      postSharedMessage={postSharedMessage}
                                    />
                                  </div>

                                  {/* start to check */}
                                  <div
                                    style={{
                                      width: "100px",
                                    }}
                                    onClick={() => setclickedPostBox(favorite)}
                                    className="p-1 next-to-repost"
                                  >
                                    <RepostAction
                                      post={favorite ? favorite : null}
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      refreshPosts={
                                        handleShowSpesificUserProfilePageFavorites
                                      }
                                      setLoadingFalse={setLoadingFalse}
                                      setLoadingTrue={setLoadingTrue}
                                    />
                                  </div>
                                  {/* finish to check  */}

                                  <div
                                    style={{
                                      width: "100px",
                                    }}
                                    to={`/${favorite.userId.username}/status/${
                                      !favorite.isReposted
                                        ? favorite._id
                                        : favorite
                                            .repostedFromThisOriginalPost[0]
                                            ?._id
                                    }`}
                                    onClick={() => setclickedPostBox(favorite)}
                                    className="p-1 next-to-like"
                                  >
                                    <LikeAction
                                      post={favorite ? favorite : null}
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      refreshPosts={
                                        handleShowSpesificUserProfilePageFavorites
                                      }
                                      setLoadingFalse={setLoadingFalse}
                                      setLoadingTrue={setLoadingTrue}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      width: "100px",
                                    }}
                                    to={`/${favorite.userId.username}/status/${
                                      !favorite.isReposted
                                        ? favorite._id
                                        : favorite
                                            .repostedFromThisOriginalPost[0]
                                            ?._id
                                    }`}
                                    onClick={() => setclickedPostBox(favorite)}
                                    className="p-1 next-to-like"
                                  >
                                    <BookmarkAction
                                      post={favorite ? favorite : null}
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      refreshPosts={
                                        handleShowSpesificUserProfilePageFavorites
                                      }
                                      setLoadingFalse={setLoadingFalse}
                                      setLoadingTrue={setLoadingTrue}
                                    />
                                  </div>
                                </Stack>
                                {/* new version favorite repost comment finish to check */}
                              </div>
                              <div
                                onClick={() => {
                                  console.log(
                                    "Post box child class =>",
                                    favorite
                                  );
                                  setclickedPostBox(favorite);
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
                            </>
                          )}
                        </div>
                      </>
                    ))}
                  {visibleLikedTweets < favorites.length && (
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item style={{ border: "none" }} eventKey="1">
                        <Accordion.Header
                          style={{ border: "none" }}
                          className={`accordion-2 accordion-2-${themeName}`}
                        >
                          <div
                            className=" chirp-regular-font"
                            onClick={handleShowMoreLikedTweets}
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
                            Show more
                          </div>
                        </Accordion.Header>
                        <Accordion.Body></Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  )}
                </>
              ) : (
                <>
                  {/* when no post shared yet from other profile posts section in general start to check  */}

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
                      {profileInfo._id !== userInfo._id
                        ? "@" +
                          profileInfo.username +
                          " " +
                          "hasn’t liked any posts"
                        : "You don’t have any likes yet"}
                    </div>
                    <div
                      className="chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                        lineHeight: "20px",
                        fontSize: font15.fontSize,
                        margin: "10px",
                      }}
                    >
                      {profileInfo._id !== userInfo._id
                        ? "When they do, those posts will show up here."
                        : "Tap the heart on any post to show it some love. When you do, it’ll show up here."}
                    </div>
                  </div>

                  {/* when no post shared yet from other profile posts section in general finish to check  */}
                </>
              )}
            </div>
          </>
        )}
      </Col>
    </>
  );
}

export default SpesificUserProfile;
