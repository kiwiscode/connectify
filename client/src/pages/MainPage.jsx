import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Col, Stack, Button, Accordion, Modal } from "react-bootstrap";
import { CommentModal } from "../components/ui/Modal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import "react-toastify/dist/ReactToastify.css";
import defaultProfileImage from "../assets/default_profile_400x400.png";

const API_URL = import.meta.env.VITE_APP_API_URL;

import useWindowDimensions from "../hooks/getWindowDimensions";
import { ThemeContext } from "../context/ThemeContext";
import PostPopover from "../components/three-dots-popover/Popover";
import RepostAction from "../components/ui/RepostAction";
import LikeAction from "../components/ui/LikeAction";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Popover, TextField } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";
import BookmarkAction from "../components/ui/BookmarkAction";
import MobileTopNavigation from "../components/Navbar/mobile_top_navigation/MobileTopNavigation";
import { SubcsriptionStatusContext } from "../context/SubscriptionStatusContext";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";
function MainPage({ isNewPostShared }) {
  const [{ themeName }] = useContext(ThemeContext);
  const { userInfo, getToken, updateUser } = useContext(UserContext);
  const { subscription, remainingTimeSubscriptionsOwnerIds } = useContext(
    SubcsriptionStatusContext
  );

  const location = useLocation();
  const path = location.pathname;

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

  // start to check

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // finish to check

  const [showSubscriptionCompletedModal, setshowSubscriptionCompletedModal] =
    useState(null);

  const handleCloseSubscriptionCompletedModal = () => {
    setshowSubscriptionCompletedModal(false);
  };

  // use effect to grab current mouse click location start to check
  const [clickedPostBox, setclickedPostBox] = useState(null);

  // use effect to grab current mouse click location finish to check

  // create account variant 1 flow start to check
  const [
    showModalForProfilePictureOrUsernameOrBoth,
    setshowModalForProfilePictureOrUsernameOrBoth,
  ] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [tabLoading, setTabLoading] = useState(false);

  const [postsLoadingSpinner, setPostsLoadingSpinner] = useState(true);
  const [posts, setPosts] = useState([]);

  const handleShowPostsHomePage = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setPosts(response.data);
      setPostsLoadingSpinner(false);
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  // create account variant 1 flow finish to check

  const [content, setContent] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const maxCharacters = 140;
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();

  const [image, setImage] = useState("");
  //handle and convert it in base 64
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const [followingPosts, setFollowingPosts] = useState([]);

  // start to check shared post view message

  // finish to check shared post view message

  const getOnlyFollowingPosts = () => {
    axios
      .get(`${API_URL}/followingPosts`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFollowingPosts(response.data);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= maxCharacters) {
      setContent(inputText);
    }
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

  const setLoadingTrue = () => {
    setIsLoading(true);
    setContent("");
    setImage("");
  };

  const setLoadingFalse = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (isNewPostShared) {
      setTimeout(() => {
        handleShowPostsHomePage();
      }, 200);
    }
  }, [isNewPostShared]);

  const { postSharedMessage, postDeletedMessage, contextHolder } =
    useAntdMessageHandler();

  const handleDeletePostFromHomePage = () => {
    postDeletedMessage();
    handleShowPostsHomePage();
  };

  const [pulse, setPulse] = useState(false);
  const handlePost = () => {
    setPostSharingStartedActivateAnimate(true);
    setTimeout(() => {
      setPulse(true);
    }, 700);
    if (content || chosenEmoji || image) {
      axios
        .post(
          `${API_URL}/posts`,
          {
            content,
            image,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
        .then((response) => {
          if (!image || image) {
            setTimeout(() => {
              setPulse(false);
              setPostSharingStartedActivateAnimate(false);
              setPostSharingPausedAnimate(true);
            }, 700);

            setTimeout(() => {
              setPostSharingStartedActivateAnimate(false);
              setPostSharingPausedAnimate(false);
            }, 700);
          }

          setTimeout(() => {
            setImage("");
            setContent("");
          }, 700);

          setTimeout(() => {
            axios
              .get(`${API_URL}/posts`, {
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                },
              })
              .then((response) => {
                handleShowPostsHomePage();
                setPosts(response.data);
              })
              .catch((err) => {
                return err;
              });
            postSharedMessage(
              response.data.createdPost.authorUserName,
              response.data.createdPost._id
            );
          }, 750);
        })
        .catch((err) => {
          console.error("Error =>", err);
        });
    }
  };

  const closeImage = () => {
    setImage("");
  };
  const [activeTab, setActiveTab] = useState("forYou");

  const [showForYou, setShowForYou] = useState(true);

  const handleShowForYou = () => {
    handleShowPostsHomePage();
    setActiveTab("forYou");
    setShowForYou(true);
  };

  const handleShowFollowing = () => {
    setPostsLoadingSpinner(true);
    getOnlyFollowingPosts();
    setActiveTab("following");
    setShowForYou(false);
    setTimeout(() => {
      setPostsLoadingSpinner(false);
    }, 200);
  };

  const onEmojiClick = (emojiObject) => {
    const sym = emojiObject.unified.split("_");
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);

    setChosenEmoji(emoji);
    setContent((prevText) => prevText + emoji);
  };

  const [visibleTweets, setVisibleTweets] = useState(25);
  const [visibleFollowingTweets, setvisibleFollowingTweets] = useState(25);
  const handleShowMorePosts = () => {
    setVisibleTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

  const handleShowMoreFollowingTweets = () => {
    setvisibleFollowingTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const [completedProfileImage, setcompletedProfileImage] = useState(false);

  const [profileImage, setprofileImage] = useState("");
  const [profileImageChangingLoadingBar, setprofileImageChangingLoadingBar] =
    useState(false);
  const changeProfileImage = () => {
    axios
      .patch(
        `${API_URL}/profile/add-profile-image`,
        { profileImage },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        setcompletedProfileImage(true);
        if (userInfo?.signedUpWithVariantOne?.isSignedUpWithVariantOne) {
          updateUser({
            imageUrl: response.data.imageInfo.url,
            signedUpWithVariantOne: {
              isSignedUpWithVariantOne: true,
              isProfileImageCustomizationModalShown: true,
              isUsernameCustomizationModalShown: false,
              isUsernameCustomized: false,
            },
          });
        } else if (userInfo?.signedUpWithGoogle?.isSignedUpWithGoogle) {
          updateUser({
            imageUrl: response.data.imageInfo.url,
            signedUpWithGoogle: {
              isSignedUpWithGoogle: true,
              isProfileImageCustomizationModalShown: true,
              isUsernameCustomizationModalShown: false,
              isUsernameCustomized: false,
            },
          });
        }

        setTimeout(() => {
          setprofileImage(" ");
          setcompletedProfileImage(false);
        }, 500);
        setprofileImageChangingLoadingBar(false);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  const handleChangeProfileImage = (e) => {
    const file = e.target.files[0];
    handleChangeProfileImageSetFileToBase(file);
    setprofileImageChangingLoadingBar(true);
  };

  const handleChangeProfileImageSetFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setprofileImageChangingLoadingBar(true);
      setprofileImage(reader.result);
    };
  };

  const [username, setUsername] = useState("");
  const [usernameValidated, setusernameValidated] = useState(false);
  const [usernameDuplicateError, setusernameDuplicateError] = useState("");

  const [skipButtonActive, setskipButtonActive] = useState(true);
  const [nextButtonActive, setnextButtonActive] = useState(false);

  const [nextButtonDisabled, setnextButtonDisabled] = useState(false);
  const checkUsernameDuplicate = () => {
    if (username.length >= 4 || username.length <= 15) {
      setnextButtonActive(true);
      setskipButtonActive(false);
    } else {
      setnextButtonActive(true);
      setskipButtonActive(false);
    }

    axios
      .post(
        `${API_URL}/auth/username-check`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setusernameValidated(true);
          setnextButtonActive(true);
          setusernameDuplicateError("");
        }
      })
      .catch((error) => {
        if (error.response.data.errorMessage && username.length) {
          setnextButtonDisabled(true);
          setnextButtonActive(false);
          setusernameValidated(false);
          setusernameDuplicateError(error.response.data.errorMessage);
        } else {
          setskipButtonActive(true);
          setnextButtonDisabled(false);
          setnextButtonActive(false);
          setusernameValidated(false);
          setusernameDuplicateError("");
        }
      });
  };

  const [loading, setLoading] = useState(null);

  const changeUsername = () => {
    axios
      .post(
        `${API_URL}/auth/change-username`,
        { username, userId: userInfo._id },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        setTabLoading(true);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setTabLoading(false);
          setshowModalForProfilePictureOrUsernameOrBoth(false);

          if (userInfo?.signedUpWithVariantOne?.isSignedUpWithVariantOne) {
            updateUser({
              username: username,
              signedUpWithVariantOne: {
                isSignedUpWithVariantOne: true,
                isProfileImageCustomizationModalShown: true,
                isUsernameCustomizationModalShown: true,
                isUsernameCustomized: true,
              },
            });
          } else if (userInfo?.signedUpWithGoogle?.isSignedUpWithGoogle) {
            updateUser({
              username: username,
              signedUpWithGoogle: {
                isSignedUpWithGoogle: true,
                isProfileImageCustomizationModalShown: true,
                isUsernameCustomizationModalShown: true,
                isUsernameCustomized: true,
              },
            });
          }
        }, 350);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  const closeModals = () => {
    axios
      .post(`${API_URL}/auth/change-modal-status-modal-2`, {
        userId: userInfo._id,
      })
      .then((response) => {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        setTabLoading(true);
        setTimeout(() => {
          setshowModalForProfilePictureOrUsernameOrBoth(false);
        }, 500);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  const changeModalStatusVariantOne = () => {
    axios
      .post(`${API_URL}/auth/change-modal-status`, {
        userId: userInfo._id,
      })
      .then(() => {
        if (userInfo?.signedUpWithVariantOne?.isSignedUpWithVariantOne) {
          updateUser({
            signedUpWithVariantOne: {
              isSignedUpWithVariantOne: true,
              isProfileImageCustomizationModalShown: true,
              isUsernameCustomizationModalShown: false,
              isUsernameCustomized: false,
            },
          });
        } else if (userInfo?.signedUpWithGoogle?.isSignedUpWithGoogle) {
          updateUser({
            signedUpWithGoogle: {
              isSignedUpWithGoogle: true,
              isProfileImageCustomizationModalShown: true,
              isUsernameCustomizationModalShown: false,
              isUsernameCustomized: false,
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  useEffect(() => {
    if (getToken()) {
      axios
        .post(
          `${API_URL}/change-subscription-success-modal-status`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setshowSubscriptionCompletedModal(true);
          }
        })
        .catch((error) => {
          updateUser({ hasSubscription: true });
          console.error("Error =>", error);
        });
    }
  }, [getToken()]);

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

  const [windowLoadingAfterGoogleAuth, setWindowLoadingAfterGoogleAuth] =
    useState(false);
  useEffect(() => {
    if (
      (userInfo?.signedUpWithVariantOne?.isSignedUpWithVariantOne &&
        !userInfo?.signedUpWithVariantOne
          ?.isProfileImageCustomizationModalShown) ||
      (userInfo?.signedUpWithGoogle?.isSignedUpWithGoogle &&
        !userInfo.signedUpWithGoogle?.isProfileImageCustomizationModalShown)
    ) {
      setTabIndex(0);
      setshowModalForProfilePictureOrUsernameOrBoth(true);
    }
    // getUser();
  }, [
    location.search,
    navigate,
    token,
    location,
    userInfo,
    windowLoadingAfterGoogleAuth,
    location.pathname,
  ]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (profileImage) {
      changeProfileImage();
    }
  }, [profileImage, completedProfileImage]);

  useEffect(() => {
    if (username) {
      checkUsernameDuplicate();
    }
  }, [username]);

  useEffect(() => {
    if (getToken()) {
      handleShowPostsHomePage();
    }
  }, [getToken()]);

  // useEffects finish to check

  const [dataFromCommentModal, setDataFromCommentModal] = useState("");
  function handleDataFromCommentModal(data) {
    setDataFromCommentModal(data);
  }

  const { isPostModalVisible } = useContext(ModalVisibilityContext);
  const [
    postSharingStartedActivateAnimate,
    setPostSharingStartedActivateAnimate,
  ] = useState(null);
  const [postSharingPausedAnimate, setPostSharingPausedAnimate] =
    useState(null);
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
    setDataFromTopNavigationComponent(data);
  }

  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight26,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font26 = getFontSizeAndLineHeight26();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();

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

  useEffect(() => {
    if (userInfo._id) {
      getFollowingArray();
    }
  }, []);

  // google callback request test
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user = JSON.parse(params.get("user"));

    if (token && user) {
      setWindowLoadingAfterGoogleAuth(true);
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
      setTimeout(() => {
        updateUser(user);
        navigate("/home");
      }, 1000);
      setTimeout(() => {
        setWindowLoadingAfterGoogleAuth(false);
      }, 1250);
    }
  }, [
    location.search,
    navigate,
    token,
    location,
    userInfo,
    windowLoadingAfterGoogleAuth,
    location.pathname,
  ]);

  return (
    <>
      {windowLoadingAfterGoogleAuth ? (
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100dvh",
            backgroundColor: "#fff",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <LoadingSpinner strokeColor={"rgb(29, 155, 240)"}></LoadingSpinner>
          </div>
        </div>
      ) : null}
      {contextHolder}
      {/* start to check subscription completed modal  */}
      {showSubscriptionCompletedModal ? (
        <>
          {width <= 700 ? (
            <>
              <Modal
                style={{
                  height: "100%",
                  margin: "0px",
                  padding: "0px",
                }}
                dialogClassName={"modal-fullscreen"}
                show={showSubscriptionCompletedModal}
                onHide={handleCloseSubscriptionCompletedModal}
                centered={true}
                contentClassName={
                  themeName === "dark-theme" ? "dark-theme-spinner-modal" : ""
                }
              >
                <Modal.Body
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className={`scrollbar-add signin-modal-body-child-non-reactivate create-account-first-tab scrollbar-add-${themeName}`}
                >
                  <h1
                    className="chirp-heavy-font"
                    style={{
                      fontSize: font31.fontSize,
                      lineHeight: font31.lineHeight,
                      color: themeName === "dark-theme" ? "white" : "",
                    }}
                  >
                    Subscription Completed!
                  </h1>{" "}
                  <svg
                    width={`175`}
                    height={`175`}
                    viewBox="0 0 22 22"
                    aria-label="Verified account"
                    role="img"
                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                    data-testid="hmm"
                    fill="none"
                  >
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "rgba(0, 0, 128, 1)" }}
                        />
                        <stop
                          offset="20%"
                          style={{ stopColor: "rgba(30, 30, 128, 1)" }}
                        />
                        <stop
                          offset="40%"
                          style={{ stopColor: "rgba(60, 60, 128, 1)" }}
                        />
                        <stop
                          offset="60%"
                          style={{ stopColor: "rgba(90, 90, 128, 1)" }}
                        />
                        <stop
                          offset="80%"
                          style={{ stopColor: "rgba(120, 120, 128, 1)" }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "rgba(150, 150, 128, 1)" }}
                        />
                      </linearGradient>
                    </defs>
                    <g>
                      <path
                        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                        fill="url(#gradient)"
                      ></path>
                    </g>
                  </svg>
                  <Button
                    onClick={handleCloseSubscriptionCompletedModal}
                    style={{
                      width: "65%",
                      height: "52px",
                    }}
                    className={`login-button mt-5 ${themeName}-white-btn`}
                    variant="dark"
                  >
                    Continue to Connectify
                  </Button>{" "}
                </Modal.Body>
              </Modal>
            </>
          ) : (
            <>
              <Modal
                className={"signin-modal-parent-non-reactivate"}
                show={showSubscriptionCompletedModal}
                onHide={handleCloseSubscriptionCompletedModal}
                centered={true}
                contentClassName={
                  themeName === "dark-theme"
                    ? "dark-theme-subscription-completed-modal"
                    : ""
                }
                backdropClassName={
                  themeName === "dark-theme" ? `back-drop-${themeName}` : ""
                }
              >
                <Modal.Body
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="signin-modal-body-child-non-reactivate"
                >
                  <h1
                    className="chirp-heavy-font"
                    style={{
                      fontSize: font31.fontSize,
                      lineHeight: font31.lineHeight,
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    Subscription Completed!
                  </h1>{" "}
                  <svg
                    width={`175`}
                    height={`175`}
                    viewBox="0 0 22 22"
                    aria-label="Verified account"
                    role="img"
                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                    data-testid="hmm"
                    fill="none"
                  >
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "rgba(0, 0, 128, 1)" }}
                        />
                        <stop
                          offset="20%"
                          style={{ stopColor: "rgba(30, 30, 128, 1)" }}
                        />
                        <stop
                          offset="40%"
                          style={{ stopColor: "rgba(60, 60, 128, 1)" }}
                        />
                        <stop
                          offset="60%"
                          style={{ stopColor: "rgba(90, 90, 128, 1)" }}
                        />
                        <stop
                          offset="80%"
                          style={{ stopColor: "rgba(120, 120, 128, 1)" }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "rgba(150, 150, 128, 1)" }}
                        />
                      </linearGradient>
                    </defs>
                    <g>
                      <path
                        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                        fill="url(#gradient)"
                      ></path>
                    </g>
                  </svg>
                  <Button
                    onClick={handleCloseSubscriptionCompletedModal}
                    style={{
                      width: "65%",
                      height: "52px",
                    }}
                    className={`login-button mt-5 ${themeName}-white-btn`}
                    variant="dark"
                  >
                    Continue to Connectify
                  </Button>{" "}
                </Modal.Body>
              </Modal>
            </>
          )}
        </>
      ) : null}
      {/* finish to check subscription completed modal  */}
      {width <= 700 ? (
        <>
          <Modal
            style={{
              height: "100%",
              margin: "0px",
              padding: "0px",
              overflowY: "scroll",
            }}
            contentClassName={
              themeName === "dark-theme"
                ? `create-account-modal-${themeName}`
                : ""
            }
            dialogClassName={`scrollbar-add modal-fullscreen scrollbar-add-${themeName}`}
            show={showModalForProfilePictureOrUsernameOrBoth}
            centered={true}
          >
            {/* start to check */}
            {tabIndex === 0 ? (
              <>
                {tabLoading ? (
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="signin-modal-body-child-non-reactivate"
                  >
                    <LoadingSpinner
                      strokeColor={"rgb(29, 155, 240)"}
                    ></LoadingSpinner>
                  </Modal.Body>
                ) : (
                  <Modal.Body
                    style={{
                      overflowY: "auto",
                    }}
                    className={`scrollbar-add signin-modal-body-child-non-reactivate create-account-first-tab scrollbar-add-${themeName} `}
                  >
                    <div
                      className="mt-5 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font26.fontSize,
                        lineHeight: font26.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      Pick a profile picture
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        color:
                          themeName === "dark-theme" ? "#71767A" : "#536471",
                      }}
                      className="mt-2 chirp-regular-font"
                    >
                      Have a favorite selfie? Upload it now.
                    </div>
                    {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                      <>
                        {profileImageChangingLoadingBar ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "10rem",
                            }}
                          >
                            <LoadingSpinner
                              strokeColor={"rgb(29, 155, 240)"}
                            ></LoadingSpinner>
                          </div>
                        ) : (
                          <div
                            style={{
                              marginTop: "10rem",
                            }}
                          >
                            <img
                              style={{
                                cursor: "pointer",
                                borderRadius: "50%",
                                width: "133px",
                                height: "133px",
                              }}
                              src={userInfo.imageUrl}
                              alt=""
                              onClick={() =>
                                document
                                  .getElementById(
                                    "formuploadModal-profile-image"
                                  )
                                  .click()
                              }
                            />
                            <input
                              onChange={handleChangeProfileImage}
                              type="file"
                              id="formuploadModal-profile-image"
                              name="profileImage"
                              className="form-control"
                              style={{ display: "none" }}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {profileImageChangingLoadingBar ? (
                          <>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "10rem",
                              }}
                            >
                              <LoadingSpinner
                                strokeColor={"rgb(29, 155, 240)"}
                              ></LoadingSpinner>
                            </div>
                          </>
                        ) : (
                          <div
                            style={{
                              marginTop: "10rem",
                            }}
                          >
                            <img
                              onClick={() =>
                                document
                                  .getElementById(
                                    "formuploadModal-profile-image"
                                  )
                                  .click()
                              }
                              style={{ cursor: "pointer", borderRadius: "50%" }}
                              width="133"
                              height="133"
                              src={defaultProfileImage}
                              alt=""
                            />

                            <input
                              onChange={handleChangeProfileImage}
                              type="file"
                              id="formuploadModal-profile-image"
                              name="profileImage"
                              className="form-control"
                              style={{ display: "none" }}
                            />
                          </div>
                        )}
                      </>
                    )}
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "150px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          userInfo?.imageUrl?.slice(0, 3) !== "../" &&
                          themeName !== "dark-theme"
                            ? "#0f141a"
                            : themeName === "dark-theme" &&
                              userInfo?.imageUrl?.slice(0, 3) !== "../"
                            ? "white"
                            : "transparent",
                        color:
                          userInfo?.imageUrl?.slice(0, 3) !== "../" &&
                          themeName !== "dark-theme"
                            ? "white"
                            : themeName === "dark-theme"
                            ? "black"
                            : "black",
                        border:
                          themeName === "dark-theme"
                            ? "1px solid rgb(70,70,70)"
                            : "1px solid rgba(0,0,0,0.1)",
                      }}
                      className={
                        userInfo?.imageUrl?.slice(0, 3) !== "../"
                          ? `next-btn ${themeName}-white-btn`
                          : `next-btn-skip-for-now ${themeName}-black-btn`
                      }
                      onClick={() => {
                        setTabLoading(true);
                        setTimeout(() => {
                          setTabLoading(false);
                          setTabIndex(tabIndex + 1);
                          changeModalStatusVariantOne();
                        }, 500);
                      }}
                    >
                      {userInfo?.imageUrl?.slice(0, 3) !== "../"
                        ? "Next"
                        : "Skip for now"}
                    </Button>
                  </Modal.Body>
                )}
              </>
            ) : tabIndex === 1 ? (
              <>
                {tabLoading ? (
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="signin-modal-body-child-non-reactivate"
                  >
                    <LoadingSpinner
                      strokeColor={"rgb(29, 155, 240)"}
                    ></LoadingSpinner>
                  </Modal.Body>
                ) : (
                  <Modal.Body
                    style={{
                      overflowX: "hidden",
                    }}
                    className="signin-modal-body-child-non-reactivate"
                  >
                    <div
                      className="mt-5 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font26.fontSize,
                        lineHeight: font26.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      What should we call you?
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        color:
                          themeName === "dark-theme" ? "#71767A" : "#536471",
                      }}
                      className="mt-2 chirp-regular-font"
                    >
                      Your @username is unique. You can always change it later.
                    </div>
                    <TextField
                      InputProps={{
                        style: {
                          color: themeName === "dark-theme" ? "white" : "",
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: themeName === "dark-theme" ? "#71767B" : "",
                        },
                      }}
                      sx={{
                        "& .Mui-focused input + fieldset": {
                          border: usernameDuplicateError
                            ? "2px solid rgb(244, 33, 46)!important"
                            : "2px solid #1d9bf0 !important",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: usernameDuplicateError
                            ? "rgb(244, 33, 46)!important"
                            : themeName === "dark-theme"
                            ? "rgb(70,70,70) !important"
                            : "#cfd9de !important",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: usernameDuplicateError
                            ? "rgb(244, 33, 46)!important"
                            : "#1f9cf0 !important",
                        },
                      }}
                      className="mt-5"
                      type="text"
                      id="outlined-basic"
                      variant={"outlined"}
                      label={`Username`}
                      style={{
                        width: "81.5%",
                        height: "58px",
                      }}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />{" "}
                    <span
                      className="chirp-regular-font"
                      style={{
                        width: "81.5%",
                        color: "#f4222d",
                        fontSize: font13.fontSize,
                        lineHeight: "20px",
                        position: "relative",
                        left: "10px",
                      }}
                    >
                      {usernameDuplicateError}
                    </span>
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "150px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          skipButtonActive && themeName !== "dark-theme"
                            ? "transparent "
                            : skipButtonActive && themeName === "dark-theme"
                            ? "black"
                            : (nextButtonActive || nextButtonDisabled) &&
                              themeName === "dark-theme"
                            ? "white"
                            : "#0f141a",
                        color:
                          skipButtonActive && themeName !== "dark-theme"
                            ? "black"
                            : "white",
                        border:
                          themeName === "dark-theme"
                            ? "1px solid rgb(70,70,70)"
                            : "1px solid rgba(0,0,0,0.1)",
                        opacity:
                          skipButtonActive ||
                          (nextButtonActive && usernameValidated)
                            ? "1"
                            : "0.5",
                      }}
                      className={
                        nextButtonActive
                          ? `next-btn ${themeName}-white-btn`
                          : nextButtonDisabled
                          ? `next-btn ${themeName}-white-btn`
                          : `next-btn-skip-for-now ${themeName}-black-btn`
                      }
                      onClick={
                        usernameValidated
                          ? () => {
                              changeUsername();
                            }
                          : () => closeModals()
                      }
                    >
                      {!skipButtonActive ? "Next" : "Skip for now"}
                    </Button>
                  </Modal.Body>
                )}
              </>
            ) : (
              <></>
            )}
            {/* finish to check  */}
          </Modal>
        </>
      ) : (
        <>
          <Modal
            backdropClassName={
              themeName === "dark-theme" ? `back-drop-${themeName}` : ""
            }
            contentClassName={
              themeName === "dark-theme"
                ? `create-account-modal-${themeName}`
                : ""
            }
            className={"signin-modal-parent-non-reactivate"}
            show={showModalForProfilePictureOrUsernameOrBoth}
            centered={true}
            style={{
              zIndex: 999999,
            }}
          >
            {/* start to check  */}
            {tabIndex === 0 ? (
              <>
                {tabLoading ? (
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="signin-modal-body-child-non-reactivate"
                  >
                    <LoadingSpinner
                      strokeColor={"rgb(29, 155, 240)"}
                    ></LoadingSpinner>
                  </Modal.Body>
                ) : (
                  <Modal.Body className="signin-modal-body-child-non-reactivate create-account-first-tab">
                    <div
                      className="mt-5 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      Pick a profile picture
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        color:
                          themeName === "dark-theme" ? "#71767A" : "#536471",
                      }}
                      className="mt-2 chirp-regular-font"
                    >
                      Have a favorite selfie? Upload it now.
                    </div>

                    <>
                      {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                        <>
                          {profileImageChangingLoadingBar ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "10rem",
                              }}
                            >
                              <LoadingSpinner
                                strokeColor={"rgb(29, 155, 240)"}
                              ></LoadingSpinner>
                            </div>
                          ) : (
                            <div
                              style={{
                                marginTop: "10rem",
                              }}
                            >
                              <img
                                style={{
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                  width: "133px",
                                  height: "133px",
                                }}
                                src={userInfo.imageUrl}
                                alt=""
                                onClick={() =>
                                  document
                                    .getElementById(
                                      "formuploadModal-profile-image"
                                    )
                                    .click()
                                }
                              />
                              <input
                                onChange={handleChangeProfileImage}
                                type="file"
                                id="formuploadModal-profile-image"
                                name="profileImage"
                                className="form-control"
                                style={{ display: "none" }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {profileImageChangingLoadingBar ? (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: "10rem",
                                }}
                              >
                                <LoadingSpinner
                                  strokeColor={"rgb(29, 155, 240)"}
                                ></LoadingSpinner>
                              </div>
                            </>
                          ) : (
                            <div
                              style={{
                                marginTop: "10rem",
                              }}
                            >
                              <img
                                onClick={() =>
                                  document
                                    .getElementById(
                                      "formuploadModal-profile-image"
                                    )
                                    .click()
                                }
                                style={{
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                }}
                                width="133"
                                height="133"
                                src={defaultProfileImage}
                                alt=""
                              />

                              <input
                                onChange={handleChangeProfileImage}
                                type="file"
                                id="formuploadModal-profile-image"
                                name="profileImage"
                                className="form-control"
                                style={{ display: "none" }}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </>

                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          userInfo?.imageUrl?.slice(0, 3) !== "../" &&
                          themeName !== "dark-theme"
                            ? "#0f141a"
                            : themeName === "dark-theme" &&
                              userInfo?.imageUrl?.slice(0, 3) !== "../"
                            ? "white"
                            : "transparent",
                        color:
                          userInfo?.imageUrl?.slice(0, 3) !== "../" &&
                          themeName !== "dark-theme"
                            ? "white"
                            : themeName === "dark-theme"
                            ? "black"
                            : "black",
                        border:
                          themeName === "dark-theme"
                            ? "1px solid rgb(70,70,70)"
                            : "1px solid rgba(0,0,0,0.1)",
                      }}
                      className={
                        userInfo?.imageUrl?.slice(0, 3) !== "../"
                          ? `next-btn ${themeName}-white-btn`
                          : `next-btn-skip-for-now ${themeName}-black-btn`
                      }
                      onClick={() => {
                        setTabLoading(true);
                        setTimeout(() => {
                          setTabLoading(false);
                          setTabIndex(tabIndex + 1);
                          changeModalStatusVariantOne();
                        }, 500);
                      }}
                    >
                      {userInfo?.imageUrl?.slice(0, 3) !== "../"
                        ? "Next"
                        : "Skip for now"}
                    </Button>
                  </Modal.Body>
                )}
              </>
            ) : tabIndex === 1 ? (
              <>
                {" "}
                {tabLoading ? (
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="signin-modal-body-child-non-reactivate"
                  >
                    <LoadingSpinner
                      strokeColor={"rgb(29, 155, 240)"}
                    ></LoadingSpinner>
                  </Modal.Body>
                ) : (
                  <Modal.Body className="signin-modal-body-child-non-reactivate">
                    <div
                      className="mt-5 chirp-bold-font"
                      style={{
                        width: "81.5%",
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      What should we call you?
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        color:
                          themeName === "dark-theme" ? "#71767A" : "#536471",
                      }}
                      className="mt-2 chirp-regular-font"
                    >
                      Your @username is unique. You can always change it later.
                    </div>
                    <TextField
                      className="mt-5"
                      InputProps={{
                        style: {
                          color: themeName === "dark-theme" ? "white" : "",
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: themeName === "dark-theme" ? "#71767B" : "",
                        },
                      }}
                      sx={{
                        "& .Mui-focused input + fieldset": {
                          border: usernameDuplicateError
                            ? "2px solid rgb(244, 33, 46)!important"
                            : "2px solid #1d9bf0 !important",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: usernameDuplicateError
                            ? "rgb(244, 33, 46)!important"
                            : themeName === "dark-theme"
                            ? "rgb(70,70,70) !important"
                            : "#cfd9de !important",
                        },
                        "& .MuiInputLabel-shrink": {
                          color: usernameDuplicateError
                            ? "rgb(244, 33, 46)!important"
                            : "#1f9cf0 !important",
                        },
                      }}
                      autoFocus={true}
                      type="text"
                      id="outlined-basic"
                      variant={"outlined"}
                      label={`Username`}
                      style={{
                        width: "81.5%",
                        height: "58px",
                      }}
                      onChange={(e) => setUsername(e.target.value)}
                    />{" "}
                    <span
                      className="chirp-regular-font"
                      style={{
                        width: "81.5%",
                        color: "#f4222d",
                        fontSize: font13.fontSize,
                        lineHeight: "20px",
                        position: "relative",
                        left: "10px",
                      }}
                    >
                      {usernameDuplicateError}
                    </span>
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          skipButtonActive && themeName !== "dark-theme"
                            ? "transparent "
                            : skipButtonActive && themeName === "dark-theme"
                            ? "black"
                            : (nextButtonActive || nextButtonDisabled) &&
                              themeName === "dark-theme"
                            ? "white"
                            : "#0f141a",
                        color:
                          skipButtonActive && themeName !== "dark-theme"
                            ? "black"
                            : "white",
                        border:
                          themeName === "dark-theme"
                            ? "1px solid rgb(70,70,70)"
                            : "1px solid rgba(0,0,0,0.1)",
                        opacity:
                          skipButtonActive ||
                          (nextButtonActive && usernameValidated)
                            ? "1"
                            : "0.5",
                      }}
                      className={
                        nextButtonActive
                          ? `next-btn ${themeName}-white-btn`
                          : nextButtonDisabled
                          ? `next-btn ${themeName}-white-btn`
                          : `next-btn-skip-for-now ${themeName}-black-btn`
                      }
                      onClick={
                        usernameValidated
                          ? () => {
                              changeUsername();
                            }
                          : () => closeModals()
                      }
                    >
                      {!skipButtonActive ? "Next" : "Skip for now"}
                    </Button>
                  </Modal.Body>
                )}
              </>
            ) : null}
          </Modal>
        </>
      )}
      {!isPostModalVisible &&
        !dataFromCommentModal &&
        path !== "/i/premium_sign_up" &&
        path !== "/i/verified-orgs-signup" &&
        path !== "/i/flow/subscription_eligibility_check" && (
          <ResponsiveNavigationBarBottom
            refreshPosts={() => handleShowPostsHomePage()}
            setLoadingTrue={() => setLoadingTrue()}
            setLoadingFalse={() => setLoadingFalse()}
            isSubModalOpened={false}
            isSubModalTabIndexNull={null}
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
          margin: "0px",
        }}
      >
        <div
          style={{
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
            position: width > 500 && "sticky",
            top: width > 500 && "0px",
            width: width > 500 && "100%",
            // for sharp backdrop filter with transparent backgroundcolor start to check
            // backgroundColor: "transparent",
            // for sharp backdrop filter with transparent backgroundcolor finish to check
            backgroundColor:
              width > 500 && themeName === "dark-theme"
                ? "rgba(0, 0, 0, 0.65)"
                : width > 500 && themeName === "light-theme"
                ? "rgba(255, 255, 255, 0.85)"
                : "null",
            backdropFilter: width > 500 && "blur(12px)",
            zIndex: width > 500 && 1,
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        >
          {width <= 500 && (
            <MobileTopNavigation
              navigationBarOpenedStatus={
                handleDataFromTopNavigationComponentOpenedStatus
              }
            />
          )}
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
              onClick={() => handleShowForYou()}
              style={{
                color:
                  activeTab === "forYou" && themeName !== "dark-theme"
                    ? "#0f141a"
                    : activeTab === "forYou" && themeName === "dark-theme"
                    ? "#e6e9ea"
                    : themeName === "dark-theme"
                    ? "#71767A"
                    : "#526371",
                fontWeight: activeTab === "forYou" ? "700" : "500",
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
                    themeName === "dark-theme" && activeTab === "forYou"
                      ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                      : themeName !== "dark-theme" && activeTab === "forYou"
                      ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                      : themeName === "dark-theme" && activeTab !== "forYou"
                      ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                      : themeName !== "dark-theme" && activeTab !== "forYou"
                      ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      : null
                  }
                >
                  For you
                </span>
                {activeTab === "forYou" && (
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
              onClick={() => handleShowFollowing()}
              style={{
                color:
                  activeTab === "following" && themeName !== "dark-theme"
                    ? "#0f141a"
                    : activeTab === "following" && themeName === "dark-theme"
                    ? "#e6e9ea"
                    : themeName === "dark-theme"
                    ? "#71767A"
                    : "#526371",
                fontWeight: activeTab === "following" ? "700" : "500",
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
                    themeName === "dark-theme" && activeTab === "following"
                      ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                      : themeName !== "dark-theme" && activeTab === "following"
                      ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                      : themeName === "dark-theme" && activeTab !== "following"
                      ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                      : themeName !== "dark-theme" && activeTab !== "following"
                      ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      : null
                  }
                >
                  Following
                </span>{" "}
                {activeTab === "following" && (
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
        </div>

        {width > 500 && (
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              className={
                postSharingStartedActivateAnimate && !postSharingPausedAnimate
                  ? `post_sharing_line_animation ${pulse ? "pulsing" : ""}`
                  : postSharingPausedAnimate && !image
                  ? "paused "
                  : null
              }
              style={{
                display:
                  postSharingStartedActivateAnimate || postSharingPausedAnimate
                    ? ""
                    : "none",
                position: "absolute",
                border: "2px solid #1C9BEF",
                height: "0.2rem",
                top: "0px",
                borderTopLeftRadius: "4px",
                maxWidth: "100%",
                width: "100%",
              }}
            ></div>
            <div
              style={{
                padding: "0px 16px",
                position: "relative",
                maxHeight: "700px",
                overflowY: "auto",
                overflowX: "hidden",
                minHeight: "76px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    transitionDuration: "0.2s",
                    outlineStyle: "none",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {" "}
                  {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                    <div
                      onClick={() => {
                        navigate("/profile");
                      }}
                      className="image-hover-effect"
                      style={{
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={userInfo.imageUrl}
                        width={40}
                        height={40}
                        alt="Pp"
                        style={{
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        navigate("/profile");
                      }}
                      className="image-hover-effect"
                      style={{
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        style={{ borderRadius: "50%" }}
                        width="40"
                        height="40"
                        src={defaultProfileImage}
                        alt=""
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginLeft: "5px",
                  }}
                >
                  <div
                    className="mt-2"
                    style={{
                      height: "53px",
                      width: "100%",
                    }}
                  >
                    <textarea
                      onChange={handleChange}
                      value={content}
                      maxLength={maxCharacters}
                      className="chirp-regular-font"
                      placeholder="What is happening?!"
                      style={{
                        lineHeight: font20.lineHeight,
                        fontSize: font20.fontSize,
                        color:
                          themeName === "dark-theme"
                            ? "white"
                            : "rgba(15,20,25,1.00)",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "transparent",
                        border: "none",
                        outline: "none",
                        width: "100%",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        resize: "none",
                        paddingTop: "12px",
                      }}
                    />
                  </div>
                </div>{" "}
              </div>
              {/* image start to check  */}
              {image && (
                <div className="p-2" style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="close-image-button"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#4B4F52",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                        position: "absolute",
                        right: "30px",
                        top: "15px",
                      }}
                      onClick={closeImage}
                    >
                      <svg
                        style={{
                          border: "none",
                          margin: "5px",
                        }}
                        width={20}
                        height={20}
                        color={"white"}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                      >
                        <g>
                          <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                        </g>
                      </svg>{" "}
                    </div>
                    <img
                      className="img-fluid"
                      style={{
                        maxWidth: "515px",
                        width: "100%",
                        display: "block",
                        overflow: "hidden",
                        borderRadius: "16px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                      src={image ? image : ""}
                      alt=""
                    />
                  </div>
                </div>
              )}
              {/* image finish to check  */}{" "}
            </div>
            <div
              style={{
                position: "sticky",
                bottom: "0px",
                borderTop:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
                backgroundColor: themeName === "dark-theme" ? "black" : "white",
              }}
            >
              <Stack
                direction="horizontal"
                className="responsive-stack-home-page-2"
                style={{
                  padding: "0px 16px",
                  width: "100%",
                  height: "53px",
                }}
              >
                {/* INFO */}
                <BootstrapTooltip
                  title="Media"
                  themeName={
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }
                >
                  <div
                    onClick={() =>
                      document.getElementById("formupload").click()
                    }
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        borderRadius: "50%",
                      }}
                      className={`svg-border-parent svg-border-parent-${themeName}`}
                    >
                      <svg
                        style={{
                          cursor: "pointer",
                        }}
                        width={20}
                        height={20}
                        color="rgb(29,155,240)"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="bi bi-image-fill post-modal-image-fill r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                      >
                        <g>
                          <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                        </g>
                      </svg>
                    </div>

                    <input
                      onChange={handleImage}
                      type="file"
                      id="formupload"
                      name="image"
                      className="form-control"
                      style={{ display: "none" }}
                    />
                  </div>{" "}
                </BootstrapTooltip>

                {/* emoji mart start to check */}
                <div className="p-1">
                  <PopupState variant="popover" popupId="demo-popup-popover">
                    {(popupState) => (
                      <div>
                        <BootstrapTooltip
                          title="Emoji"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <Button
                            {...bindTrigger(popupState)}
                            style={{
                              border: "none",
                              // backgroundColor: "transparent",
                              padding: "0px",
                              margin: "0px",
                              cursor: "pointer",
                              position: "relative",
                            }}
                            variant="text"
                          >
                            <div
                              className={`svg-border-parent svg-border-parent-${themeName}`}
                              style={{
                                cursor: "pointer",
                                borderRadius: "50%",
                              }}
                            >
                              <svg
                                color="rgb(29,155,240)"
                                fill="currentColor"
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="post-modal-emoji-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                <g>
                                  <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                                </g>
                              </svg>
                            </div>
                          </Button>
                        </BootstrapTooltip>

                        <Popover
                          open={popupState.open}
                          onClose={popupState.close}
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: 140,
                          }}
                          className={`${
                            themeName === "dark-theme"
                              ? "popover-material-ui-dark-theme"
                              : themeName !== "dark-theme"
                              ? "popover-material-ui-light-theme"
                              : "hideshowMessageDeletePopover "
                          }`}
                        >
                          <Picker
                            autoFocus
                            theme={
                              themeName === "dark-theme" ? "dark" : "light"
                            }
                            data={data}
                            onEmojiSelect={onEmojiClick}
                            maxFrequentRows={0}
                            emojiSize={20}
                            emojiButtonSize={28}
                          />
                        </Popover>
                      </div>
                    )}
                  </PopupState>
                </div>
                {/* emoji mart finish to check */}

                <div className="ms-auto">
                  {" "}
                  {content !== "" || image ? (
                    <Button
                      style={{
                        border: "none",
                        maxHeight: "36px",
                        maxWidth: "66px",
                      }}
                      variant="primary"
                      onClick={() => handlePost()}
                      className={`post-btn compose-tweet-textArea compose-tweet-2 chirp-bold-font blue-btn`}
                    >
                      Post
                    </Button>
                  ) : (
                    <Button
                      style={{
                        border: "none",
                        cursor: "default",
                        maxHeight: "36px",
                        maxWidth: "66px",
                        pointerEvents: "none",
                      }}
                      variant="primary"
                      className={`emptyContent post-btn compose-tweet-textArea chirp-bold-font blue-btn-disabled `}
                    >
                      Post
                    </Button>
                  )}
                </div>
              </Stack>
              {themeName === "dark-theme" ? (
                <div
                  style={{
                    // borderBottom: "0.1px solid rgb(70, 70, 70)",
                    borderBottom: "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
              ) : (
                <div
                  className="responsive-stack-home-page-row"
                  style={{
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                ></div>
              )}
            </div>
          </div>
        )}
        <span>
          {isLoading ? (
            <LoadingSpinner strokeColor={"rgb(29, 155, 240)"}></LoadingSpinner>
          ) : (
            ""
          )}
        </span>
        <div
          style={{
            // height: width <= 700 ? "100dvh" : "",
            height: width > 700 && "",
          }}
          className="all-posts"
        >
          {showForYou ? (
            <>
              {posts.length > 0 ? (
                <>
                  {posts.slice(0, visibleTweets).map((post, index) => (
                    <div key={post._id}>
                      {post.deactivatedOwner ||
                      (post.userId?.isPrivate &&
                        !checkIfFollowing(post.userId._id) &&
                        post.userId._id !== userInfo._id) ? null : (
                        <div
                          onClick={() => {
                            setclickedPostBox(post);
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
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setclickedPostBox(post);
                            }}
                            className="posts-details outside-of-inner-circle-actions"
                          >
                            {" "}
                            <div
                              style={{
                                position: "relative",
                              }}
                              className="post-head"
                            >
                              {/* start to check */}
                              {post.reposted.length > 0 &&
                              post.isReposted &&
                              post.reposted[0]._id === userInfo._id ? (
                                <div
                                  className="you-reposted-head"
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
                                    className="repost-svg-post-box svg-repost-post box svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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
                                </div>
                              ) : null}

                              {/* start to check */}
                              {post.reposted.length > 0 &&
                              post.isReposted &&
                              post.reposted[0]._id !== userInfo._id ? (
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
                                    {post.reposted[0].fullname ? (
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
                                        {post.reposted[0].fullname} reposted
                                      </Link>
                                    ) : null}
                                  </span>{" "}
                                </div>
                              ) : null}
                            </div>
                            {/* post box new styling test start to check  */}
                            {/* post boxun tamamı start to check  */}
                            {/* owner img,fullname,username,created date,three dots start to check */}
                            <Stack
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() => setclickedPostBox(post)}
                              className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                              direction="horizontal"
                              gap={1}
                            >
                              {" "}
                              {/* profile image start to check */}
                              <div className="p-1 ">
                                {post.userId.imageUrl.slice(0, 3) !== "../" ? (
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
                                    to={`/profile/${
                                      post.userId ? post.userId._id : null
                                    }`}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {" "}
                                    <img
                                      style={{ borderRadius: "50%" }}
                                      width="40"
                                      height="40"
                                      src={defaultProfileImage}
                                      alt=""
                                    />
                                  </Link>
                                )}
                              </div>
                              {/* profile image finish to check  */}
                              {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                              <div className="p-1">
                                {post.userId ? (
                                  <div>
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
                                          color:
                                            themeName === "dark-theme"
                                              ? "white"
                                              : "",
                                          fontSize: font15.fontSize,
                                          lineHeight: font15.lineHeight,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          width: "120px",
                                        }}
                                      >
                                        {post.authorFullName}
                                      </span>
                                    </Link>{" "}
                                    {post?.userId?.isPrivate && (
                                      <span
                                        style={{
                                          marginRight: "5px",
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
                                    ) : null}
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
                                      <span className="post-circle-postowner-username">
                                        <span className="chirp-regular-font">
                                          @{post.authorUserName}
                                        </span>
                                      </span>
                                    </Link>
                                    <Link
                                      style={{
                                        textDecoration: "none",
                                      }}
                                      to={`/${post.userId.username}/status/${
                                        !post.isReposted
                                          ? post._id
                                          : post.repostedFromThisOriginalPost[0]
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
                                            post.createdAt
                                          )}
                                          themeName={
                                            themeName === "dark-theme"
                                              ? "dark-theme"
                                              : "light-theme"
                                          }
                                        >
                                          <span className="date-post-detail chirp-regular-font">
                                            {getCreatedDate(post.createdAt)}
                                          </span>
                                        </BootstrapTooltip>
                                      </span>
                                    </Link>
                                    {/* finish to check  */}
                                  </div>
                                ) : null}
                              </div>
                              {/* post owner full name + verified account svg + post owner user name + post created date  finish to check  */}
                              {/* three dots svg start to check */}
                              <div className="p-1 ms-auto">
                                <PostPopover
                                  postDeletionProcess={
                                    handleDeletePostFromHomePage
                                  }
                                  post={post}
                                  refreshPosts={handleShowPostsHomePage}
                                />
                              </div>
                              {/* three dots svg finish to check */}
                            </Stack>
                            {/* owner img,fullname,username,created date,three dots finish to check */}
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
                              {" "}
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
                                      @{post.commentedForThisUsersPost.username}
                                    </span>
                                  </Link>
                                </div>
                              ) : null}
                              <Link
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]?._id
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
                                    cursor: "pointer",
                                    color:
                                      themeName === "dark-theme" ? "white" : "",
                                  }}
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
                                      : post.repostedFromThisOriginalPost[0]._id
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
                              className="mt-0 parent-footer-stack"
                              onClick={() => setclickedPostBox(post)}
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
                                onClick={() => setclickedPostBox(post)}
                                className="p-1 next-to-comment"
                              >
                                <CommentModal
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={handleShowPostsHomePage}
                                  sendDataToParent={handleDataFromCommentModal}
                                  postSharedMessage={postSharedMessage}
                                />
                              </div>
                              <div
                                style={{
                                  width: "100px",
                                }}
                                onClick={() => setclickedPostBox(post)}
                                className="p-1 next-to-repost"
                              >
                                <RepostAction
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={handleShowPostsHomePage}
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                  postIndex={index}
                                />
                              </div>
                              <div
                                style={{
                                  width: "100px",
                                }}
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]?._id
                                }`}
                                onClick={() => setclickedPostBox(post)}
                                className="p-1 next-to-like"
                              >
                                <LikeAction
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={handleShowPostsHomePage}
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                  allPosts={posts}
                                  postIndex={index}
                                />
                              </div>{" "}
                              <div
                                style={{
                                  width: "100px",
                                }}
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]?._id
                                }`}
                                onClick={() => setclickedPostBox(post)}
                                className="p-1 next-to-like"
                              >
                                {" "}
                                <BookmarkAction
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={handleShowPostsHomePage}
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                  allPosts={posts}
                                  postIndex={index}
                                />
                              </div>
                            </Stack>
                            {/* new version favorite repost comment finish to check */}
                            {/* post boxun tamamı finish to check  */}
                            {/* post box new styling test finish to check  */}
                          </div>

                          <div
                            onClick={() => {
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
                        </div>
                      )}
                    </div>
                  ))}

                  {visibleTweets < posts.length && (
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
              ) : (postsLoadingSpinner && !posts.length) || loading ? (
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              ) : (
                <>
                  {" "}
                  {/* when no post yet from for you section in general start to check  */}
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
                      Welcome to Connectify!
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
                      This is the best place to see what’s happening in your
                      world. Find some people and topics to follow now.
                    </div>
                  </div>
                  {/* when no post yet from for you section in general finish to check  */}
                </>
              )}
            </>
          ) : (
            <>
              {followingPosts.followingPosts &&
              followingPosts.followingPosts.length ? (
                <>
                  {followingPosts.followingPosts
                    .slice(0, visibleFollowingTweets)
                    .map((post, index) => (
                      <div key={post._id}>
                        <div
                          onClick={() => {
                            setclickedPostBox(post);
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
                              setclickedPostBox(post);
                            }}
                            className="posts-details outside-of-inner-circle-actions"
                          >
                            <div
                              style={{
                                position: "relative",
                              }}
                              className="post-head"
                            >
                              {/* start to check */}
                              {post.reposted.length > 0 &&
                              post.isReposted &&
                              post.reposted[0]._id === userInfo._id ? (
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
                                    className="repost-svg-post-box svg-repost-post box svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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
                                </div>
                              ) : null}

                              {/* start to check */}
                              {post.reposted.length > 0 &&
                              post.isReposted &&
                              post.reposted[0]._id !== userInfo._id ? (
                                <div
                                  style={{
                                    cursor: "pointer",
                                  }}
                                >
                                  <svg
                                    style={{
                                      marginLeft: "20px",
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
                                    {post.reposted[0].fullname ? (
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
                                        {post.reposted[0].fullname} reposted
                                      </Link>
                                    ) : null}
                                  </span>{" "}
                                </div>
                              ) : null}
                            </div>
                            <Stack
                              style={{
                                cursor: "pointer",
                              }}
                              to={`/${post?.userId?.username}/status/${
                                !post.isReposted
                                  ? post._id
                                  : post?.repostedFromThisOriginalPost[0]?._id
                              }`}
                              onClick={() => setclickedPostBox(post)}
                              className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                              direction="horizontal"
                              gap={1}
                            >
                              {/* profile image start to check */}
                              <div className="p-1">
                                {post.userId.imageUrl.slice(0, 3) !== "../" ? (
                                  <Link
                                    className="post-circle-profile-image-on-point"
                                    style={{
                                      cursor: "pointer",
                                      borderRadius: "50%",
                                    }}
                                    to={`/profile/${
                                      post ? post.userId._id : null
                                    }`}
                                  >
                                    <img
                                      width={40}
                                      height={40}
                                      src={
                                        post.userId.imageUrl
                                          ? post.userId.imageUrl
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
                                      post.userId ? post.userId._id : null
                                    }`}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {" "}
                                    <img
                                      style={{ borderRadius: "50%" }}
                                      width={40}
                                      height={40}
                                      src={defaultProfileImage}
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
                                          color:
                                            themeName === "dark-theme"
                                              ? "white"
                                              : "",
                                          fontSize: font15.fontSize,
                                          lineHeight: font15.lineHeight,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          width: "120px",
                                        }}
                                      >
                                        {post.authorFullName}
                                      </span>
                                    </Link>{" "}
                                    {post?.userId?.isPrivate && (
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
                                      <span className="post-circle-postowner-username">
                                        <span className="chirp-regular-font">
                                          @{post.authorUserName}
                                        </span>
                                      </span>
                                    </Link>
                                    <Link
                                      to={`/${post.userId.username}/status/${
                                        !post.isReposted
                                          ? post._id
                                          : post.repostedFromThisOriginalPost[0]
                                              ?._id
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
                                            post.createdAt
                                          )}
                                          themeName={
                                            themeName === "dark-theme"
                                              ? "dark-theme"
                                              : "light-theme"
                                          }
                                        >
                                          <span className="date-post-detail chirp-regular-font">
                                            {getCreatedDate(post.createdAt)}
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
                                    handleDeletePostFromHomePage
                                  }
                                  post={post}
                                  refreshPosts={handleShowPostsHomePage}
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
                                      @{post.commentedForThisUsersPost.username}
                                    </span>
                                  </Link>
                                </div>
                              ) : null}
                              <Link
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]?._id
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
                                    cursor: "pointer",
                                    color:
                                      themeName === "dark-theme" ? "white" : "",
                                  }}
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
                              className="mt-0 parent-footer-stack"
                              onClick={() => setclickedPostBox(post)}
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
                                onClick={() => setclickedPostBox(post)}
                                className="p-1 next-to-comment"
                              >
                                <CommentModal
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={handleShowPostsHomePage}
                                  sendDataToParent={handleDataFromCommentModal}
                                  postSharedMessage={postSharedMessage}
                                />
                              </div>
                              <div
                                style={{
                                  width: "100px",
                                }}
                                onClick={() => setclickedPostBox(post)}
                                className="p-1 next-to-repost"
                              >
                                <RepostAction
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={handleShowPostsHomePage}
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                />
                              </div>
                              <div
                                style={{
                                  width: "100px",
                                }}
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]?._id
                                }`}
                                onClick={() => setclickedPostBox(post)}
                                className="p-1 next-to-like"
                              >
                                <LikeAction
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={handleShowPostsHomePage}
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                />
                              </div>{" "}
                              <div
                                style={{
                                  width: "100px",
                                }}
                                to={`/${post.userId.username}/status/${
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]?._id
                                }`}
                                onClick={() => setclickedPostBox(post)}
                                className="p-1 next-to-like"
                              >
                                {" "}
                                <BookmarkAction
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={handleShowPostsHomePage}
                                  setLoadingFalse={setLoadingFalse}
                                  setLoadingTrue={setLoadingTrue}
                                  allPosts={posts}
                                  postIndex={index}
                                />
                              </div>
                            </Stack>
                            {/* new version favorite repost comment finish to check */}
                          </div>
                          <div
                            onClick={() => {
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
                        </div>
                      </div>
                    ))}
                  {visibleFollowingTweets <
                    followingPosts.followingPosts.length && (
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item style={{ border: "none" }} eventKey="1">
                        <Accordion.Header
                          style={{ border: "none" }}
                          className={`accordion-2 accordion-2-${themeName}`}
                        >
                          <div
                            className=" chirp-regular-font"
                            onClick={handleShowMoreFollowingTweets}
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
              ) : (postsLoadingSpinner && !posts.length) || loading ? (
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              ) : (
                <>
                  {/* when no post yet from following section in general start to check  */}
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
                      Welcome to Connectify!
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
                      This is the best place to see what’s happening in your
                      world. Find some people and topics to follow now.
                    </div>
                  </div>
                  {/* when no post yet from following section in general finish to check  */}
                </>
              )}
            </>
          )}
        </div>
      </Col>
    </>
  );
}

export default MainPage;
