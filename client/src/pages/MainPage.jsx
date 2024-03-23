import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Stack,
  Button,
  Popover,
  OverlayTrigger,
  Accordion,
  Modal,
} from "react-bootstrap";
import { CommentModal } from "../components/ui/Modal";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import ResponsiveNavigationBarTop from "../components/Navbar/ResponsiveNavigationTop";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { Bounce, ToastContainer, toast } from "react-toastify";

import CustomNotification from "../components/Notifications/CustomNotification";

import { message } from "antd";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
import io from "socket.io-client";
import LeftSideNavBar from "../components/Main-Left-Side-Navbar/LeftSideNavbar";
import RightSideColumn from "../components/Main-Right-Side-Column/RightSideColumn";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { TextField } from "@mui/material";

function MainPage() {
  const socket = io.connect(`${API_URL}`);

  // start to check

  const navigate = useNavigate();

  // finish to check

  // use effect to grab current mouse click location start to check
  const [clickedPostBox, setclickedPostBox] = useState(null);
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

  // use effect to grab current mouse click location finish to check

  // create account variant 1 flow start to check
  const { userInfo, getToken, updateUser } = useContext(UserContext);
  const [signedUpWithVariantOne, setsignedUpWithVariantOne] = useState(false);
  const [signedUpWithGoogle, setsignedUpWithGoogle] = useState(false);
  const [
    showModalForProfilePictureOrUsernameOrBoth,
    setshowModalForProfilePictureOrUsernameOrBoth,
  ] = useState(false);
  const [showPickProfilePictureModal, setshowPickProfilePictureModal] =
    useState(false);
  const [showWhatShouldWeCallYouModal, setshowWhatShouldWeCallYouModal] =
    useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabLoading, setTabLoading] = useState(false);

  const [user, setUser] = useState(null);

  // socket io 1 client start to check
  const [notificationTest, setnotificationTest] = useState([]);
  const [notificationText, setnotificationText] = useState([]);
  // socket io 1 client finish to check

  // socket io 4 client start to check
  useEffect(() => {
    setshouldHide(true);
    handleShowPostsHomePage();
    socket.on("socket_id_for_user", (socketId) => {
      localStorage.setItem("socketId", socketId);
    });

    socket.emit("setUsername", userInfo.username);
  }, []);
  // socket io 4 client finish to check

  const getUser = async () => {
    try {
      const url = `${API_URL}/auth/login-success`;

      const { data } = await axios.get(url, { withCredentials: true });
      updateUser(data.user);
      setUser(data.user);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      if (
        data.user.signedUpWithVariantOne?.isSignedUpWithVariantOne &&
        (!data.user.signedUpWithVariantOne
          ?.isProfileImageCustomizationModalShown ||
          !data.user.signedUpWithVariantOne?.isUsernameCustomizationModalShown)
      ) {
        setTabIndex(0);
        setshowPickProfilePictureModal(true);
        setshowModalForProfilePictureOrUsernameOrBoth(true);
      } else if (
        data.user.signedUpWithGoogle?.isSignedUpWithGoogle &&
        !data.user.signedUpWithGoogle?.isUsernameCustomizationModalShown
      ) {
        setTabIndex(1);
        setshowWhatShouldWeCallYouModal(true);
        setshowModalForProfilePictureOrUsernameOrBoth(true);
        console.log(
          "User created account by using google show What should we call you modal for editing username !!"
        );
      } else {
        console.log(
          "User is already signed up with google or variant one and did or did not change profile picture or username !"
        );
      }
    } catch (err) {
      console.log("Error =>", err);
    }
  };

  useEffect(() => {
    if (
      userInfo?.signedUpWithVariantOne?.isSignedUpWithVariantOne &&
      (!userInfo?.signedUpWithVariantOne
        ?.isProfileImageCustomizationModalShown ||
        !userInfo?.signedUpWithVariantOne?.isUsernameCustomizationModalShown)
    ) {
      console.log("We are here right now !");
      setTabIndex(0);
      setshowPickProfilePictureModal(true);
      setshowModalForProfilePictureOrUsernameOrBoth(true);
    }
    getUser();
  }, []);

  const [activeUser, setActiveUser] = useState([]);
  const refreshActiveUser = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setActiveUser(response.data.user);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  useEffect(() => {
    refreshActiveUser();
  }, []);

  // useEffect(() => {
  //   if (
  //     userInfo?.signedUpWithVariantOne?.isSignedUpWithVariantOne &&
  //     (!userInfo?.signedUpWithVariantOne
  //       ?.isProfileImageCustomizationModalShown ||
  //       !userInfo?.signedUpWithVariantOne?.isUsernameCustomizationModalShown)
  //   ) {
  //     console.log("We are here right now !");
  //     setTabIndex(0);
  //     setshowPickProfilePictureModal(true);
  //     setshowModalForProfilePictureOrUsernameOrBoth(true);
  //   } else if (
  //     userInfo?.signedUpWithGoogle?.isSignedUpWithGoogle &&
  //     !userInfo?.signedUpWithGoogle?.isUsernameCustomizationModalShown
  //   ) {
  //     setTabIndex(1);
  //     setshowWhatShouldWeCallYouModal(true);
  //     setshowModalForProfilePictureOrUsernameOrBoth(true);
  //     console.log(
  //       "User created account by using google show What should we call you modal for editing username !!"
  //     );
  //   } else {
  //     console.log(
  //       "User is already signed up with google or variant one and did or did not change profile picture or username !"
  //     );
  //   }
  // }, []);

  // create account variant 1 flow finish to check

  const [posts, setPosts] = useState([]);
  const [postId, setpostId] = useState("");
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const maxCharacters = 140;
  const [isLoading, setIsLoading] = useState(false);
  const [shouldHide, setshouldHide] = useState(true);
  const { height, width } = useWindowDimensions();

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
  const [currentCreatedPost, setcurrentCreatedPost] = useState(null);

  const handleCallback = (childData) => {
    // Update the name in the component's state
    setcurrentCreatedPost(childData);
    postSharedMessage(childData.authorUserName, childData._id);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const postSharedMessage = (postOwner, postId) => {
    messageApi.success({
      type: "success",
      content: (
        <div>
          <span>Your post was sent.</span>
          <>
            <Link
              to={`/${postOwner}/status/${postId}`}
              style={{
                color: "white",
                marginLeft: "5px",
              }}
            >
              View
            </Link>
          </>
        </div>
      ),
      duration: 6,
      className: "custom-message-style",
    });
  };
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
        console.log("Error =>", error);
      });
  };

  useEffect(() => {
    socket.on("getNotification", (data) => {
      console.log("Data =>", data);
      if (data.senderName !== userInfo.username) {
        setnotificationTest((prev) => [...prev, data]);
      } else {
        console.log("You cannot send a notification to yourself.");
      }
    });

    socket.on("getText", (data) => {
      console.log("Data get text =>", data);
      if (data.senderName !== userInfo.username) {
        setnotificationText(data);

        toast(
          <CustomNotification
            senderName={data.senderName}
            type={data.type}
            contactHasBeenMade={data.contactHasBeenMade}
            senderInfo={data.senderInfo}
            text={data.text ? data.text : null}
          />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
            theme: "light",
          }
        );
      } else {
        console.log("You cannot send a notification to yourself.");
      }
    });
  }, [socket]);

  // socket io 5 client start to check
  const handleNotification = (post, userInfo, type) => {
    console.log("Post =>", post);
    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: post.userId.username,
      type: type,
      contactHasBeenMade: post,
      senderInfo: userInfo,
    });
  };
  // socket io 5 client finish to check

  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= maxCharacters) {
      setContent(inputText);
    } else {
      setError("Tweet length to 140 characters");
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

  const handleShowPostsHomePage = () => {
    axios
      .get(`${API_URL}/home`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        getOnlyFollowingPosts();
        setPosts(response.data);
      })
      .catch((err) => {
        return err;
      });
  };
  console.log("All posts in main page =>", posts);
  const setLoadingTrue = () => {
    setIsLoading(true);
    setContent("");
  };

  const setLoadingFalse = () => {
    setIsLoading(false);
  };

  const handleDeleteLikeFromHomePage = (postId) => {
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
          handleShowPostsHomePage();
        }, 500);
      })
      .catch((err) => {
        console.log("Error =>", err);
      });
  };

  const getLikerIds = (array) => {
    return array.likes.map((eachLiker) => {
      return eachLiker._id;
    });
  };

  const handlePostLikesFromHomePage = (postId, findedPost) => {
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
        setTimeout(() => {
          handleNotification(findedPost, userInfo, "liked");
          setLoadingTrue();
          setLoadingFalse();
          setError("");
          handleShowPostsHomePage();
        }, 500);
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

  const handleDeletePostFromHomePage = (postId) => {
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
          handleShowPostsHomePage();
          setError("");
        }, 500);
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        setError(errorMessage);
      });
  };

  const handleShowDetailPostFromHomePage = (postId) => {
    console.log(postId);
  };

  const handlePost = () => {
    if (content || chosenEmoji || image) {
      axios
        .post(
          `${API_URL}/home/post`,
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
          setImage("");
          setLoadingTrue();
          setTimeout(() => {
            axios
              .get(`${API_URL}/home`, {
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
            setLoadingFalse();
          }, 1200);
        })
        .catch((err) => {
          return err;
        });
    } else {
      console.log("No content !");

      console.log("Nothing to share !");
    }
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
        setTimeout(() => {
          handleNotification(findedPost, userInfo, "repost");
          setLoadingTrue();
          setLoadingFalse();
          setError("");
          handleShowPostsHomePage();
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteRepostMainPage = (postId) => {
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
          handleShowPostsHomePage();
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const closeImage = () => {
    setImage("");
  };

  const handleMouseOver = (e) => {
    const shallowCopy = e.target.classList[0];

    if (shallowCopy === "target") {
      e.target.style.background = "#595b5b";
    }
  };

  const handleMouseOut = (e) => {
    const shallowCopy = e.target.classList[0];

    if (shallowCopy === "target") {
      e.target.style.background = "#47494a";
    }
  };

  const getRepostedIds = (array) => {
    return array.reposted.map((eachRepost) => {
      return eachRepost._id;
    });
  };
  const [activeTab, setActiveTab] = useState("forYou");
  const handleHover = (tab) => {
    setHoveredTab(tab);
  };

  const handleLeave = () => {
    setHoveredTab(null);
  };

  const [showForYou, setShowForYou] = useState(true);
  const [showFollowing, setShowFollowing] = useState(false);

  const handleShowForYou = () => {
    handleShowPostsHomePage();
    setActiveTab("forYou");
    setShowForYou(true);
    setShowFollowing(false);
  };

  const handleShowFollowing = () => {
    getOnlyFollowingPosts();
    setActiveTab("following");
    setShowFollowing(true);
    setShowForYou(false);
  };

  const [hoveredTab, setHoveredTab] = useState(null);

  const getTabStyle = (tab) => {
    return {
      // textDecoration: activeTab === tab ? "underline" : "none",
      // background: hoveredTab === tab ? "purple" : "none",
      color: activeTab === tab ? "rgb(29, 155, 240" : "rgb(83,100,113)",
      fontWeight: activeTab === tab ? "700" : "400",
      lineHeight: "20px",
      fontSize: "15px",
      cursor: "pointer",
      flex: 1,
      textAlign: "center",
      transition: "background 0.3s", // Hover efekti için geçiş efekti
    };
  };

  const onEmojiClick = (emojiObject) => {
    const sym = emojiObject.unified.split("_");
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);

    setChosenEmoji(emoji);
    setContent((prevText) => prevText + emoji);
  };

  useEffect(() => {
    const closeEmojiContainer = (e) => {
      if (
        e.target.classList.contains("post-modal-emoji-picker") ||
        e.srcElement.parentElement.className ===
          "svg-border-parent show-emoji" ||
        e.srcElement.parentNode.className === "p-2" ||
        e.target.classList.value === ""
      ) {
        setshowEmojisBar(false);
      } else {
        setshowEmojisBar(true);
      }
    };

    document.body.addEventListener("click", closeEmojiContainer);

    return () => {
      document.body.removeEventListener("click", closeEmojiContainer);
    };
  }, []);

  const popoverBottom = (
    <Popover
      id="popover-positioned-bottom"
      title="Popover bottom"
      className={`${showEmojisBar ? "hideEmojiContainer" : ""}`}
    >
      <Picker
        data={data}
        onEmojiSelect={onEmojiClick}
        maxFrequentRows={0}
        emojiSize={20}
        emojiButtonSize={28}
      />
    </Popover>
  );

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

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // start to check right side search bar progress
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSearchResult, setFilteredSearchResult] = useState([]);

  const handleSetSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const setSearchTermEmpty = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/allUsersFromDataBase`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        const term = searchTerm.split(" ").join("").toLowerCase();

        const filteredUsers = response.data.allUsers.filter((eachUser) => {
          return (
            eachUser.username.includes(term) || eachUser.fullname.includes(term)
          );
        });

        setFilteredSearchResult(filteredUsers);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  }, [searchTerm]);

  // finish to check right side search bar progress

  const [completedProfileImage, setcompletedProfileImage] = useState(false);

  const [profileImage, setprofileImage] = useState("");
  const changeProfileImage = () => {
    axios
      .post(
        `${API_URL}/profile/add-profile-image`,
        { profileImage },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response =>", response);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        userInfo.imageUrl = response.data.imageInfo.url;

        const updatedUserInfo = userInfo;
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        setcompletedProfileImage(true);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeProfileImage = (e) => {
    const file = e.target.files[0];
    handleChangeProfileImageSetFileToBase(file);
  };

  const handleChangeProfileImageSetFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setprofileImage(reader.result);
    };
  };

  useEffect(() => {
    changeProfileImage();
  }, [profileImage, completedProfileImage]);

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
        console.log("Response =>", response);
        if (response.status === 200) {
          setusernameValidated(true);
          setnextButtonActive(true);
          setusernameDuplicateError("");
          console.log("Hello world !");
        } else {
          console.log("Hello world hahahahaha ! ");
        }
      })
      .catch((error) => {
        console.log("Error =>", error);
        if (error.response.data.errorMessage && username.length) {
          console.log("Something went wrong during the process !");
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

  useEffect(() => {
    checkUsernameDuplicate();
  }, [username]);

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
        console.log("Response from server =>", response);
        setTabLoading(true);
        setTimeout(() => {
          setTabLoading(false);
          setshowPickProfilePictureModal(false);
          setshowWhatShouldWeCallYouModal(false);
          setshowModalForProfilePictureOrUsernameOrBoth(false);
          localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
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
          setTabLoading(false);
          setshowPickProfilePictureModal(false);
          setshowWhatShouldWeCallYouModal(false);
          setshowModalForProfilePictureOrUsernameOrBoth(false);
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const changeModalStatusVariantOne = () => {
    axios
      .post(`${API_URL}/auth/change-modal-status`, {
        userId: userInfo._id,
      })
      .then((response) => {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  return (
    <>
      {" "}
      {contextHolder}
      {width <= 700 ? (
        <>
          <Modal
            style={{
              height: "100%",
              overflowY: "scroll",
            }}
            dialogClassName={"modal-fullscreen"}
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
                    className="signin-modal-body-child-non-reactivate create-account-first-tab"
                  >
                    <div
                      className="mt-5"
                      style={{
                        width: "81.5%",
                        lineHeight: "28px",
                        fontWeight: "700",
                        fontSize: "26px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Pick a profile picture
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        lineHeight: "20px",
                        fontWeight: "400",
                        fontSize: "15px",
                        color: "#536471",
                      }}
                      className="mt-2"
                    >
                      Have a favorite selfie? Upload it now.
                    </div>
                    {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                      <>
                        <div
                          style={{
                            marginTop: "10rem",
                          }}
                        >
                          <img
                            style={{
                              cursor: "pointer",
                              borderRadius: "50%",
                            }}
                            src={userInfo.imageUrl}
                            alt=""
                            onClick={() =>
                              document
                                .getElementById("formuploadModal-profile-image")
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
                      </>
                    ) : (
                      <div
                        style={{
                          marginTop: "10rem",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="133"
                          height="133"
                          fill="rgb(83, 100, 113)"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                          style={{ cursor: "pointer", borderRadius: "50%" }}
                          onClick={() =>
                            document
                              .getElementById("formuploadModal-profile-image")
                              .click()
                          }
                        >
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
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
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "150px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          userInfo?.imageUrl?.slice(0, 3) !== "../"
                            ? "#0f141a"
                            : "transparent",
                        color:
                          userInfo?.imageUrl?.slice(0, 3) !== "../"
                            ? "white"
                            : "black",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                      className={
                        userInfo?.imageUrl?.slice(0, 3) !== "../"
                          ? `next-btn`
                          : "next-btn-skip-for-now"
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
                      className="mt-5"
                      style={{
                        width: "81.5%",
                        lineHeight: "28px",
                        fontWeight: "700",
                        fontSize: "26px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      What should we call you?
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        lineHeight: "20px",
                        fontWeight: "400",
                        fontSize: "15px",
                        color: "#536471",
                      }}
                      className="mt-2"
                    >
                      Your @username is unique. You can always change it later.
                    </div>
                    <TextField
                      sx={{
                        "& .Mui-focused input + fieldset": {
                          border: usernameDuplicateError
                            ? "2px solid rgb(244, 33, 46)!important"
                            : "2px solid #1d9bf0 !important",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: usernameDuplicateError
                            ? "rgb(244, 33, 46)!important"
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
                      style={{
                        width: "81.5%",

                        color: "#f4222d",
                        fontSize: "13px",
                        fontWeight: "400",
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
                        backgroundColor: skipButtonActive
                          ? "transparent "
                          : "#0f141a",
                        color: skipButtonActive ? "black" : "white",
                        border: "1px solid rgba(0,0,0,0.1)",
                        opacity:
                          skipButtonActive ||
                          (nextButtonActive && usernameValidated)
                            ? "1"
                            : "0.5",
                      }}
                      className={
                        nextButtonActive
                          ? `next-btn`
                          : nextButtonDisabled
                          ? "next-btn"
                          : "next-btn-skip-for-now"
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
            className={"signin-modal-parent-non-reactivate"}
            show={showModalForProfilePictureOrUsernameOrBoth}
            centered={true}
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
                      className="mt-5"
                      style={{
                        width: "81.5%",
                        lineHeight: "36px",
                        fontWeight: "700",
                        fontSize: "31px",
                      }}
                    >
                      Pick a profile picture
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        lineHeight: "20px",
                        fontWeight: "400",
                        fontSize: "15px",
                        color: "#536471",
                      }}
                      className="mt-2"
                    >
                      Have a favorite selfie? Upload it now.
                    </div>
                    {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                      <>
                        <div
                          style={{
                            marginTop: "10rem",
                          }}
                        >
                          <img
                            style={{
                              cursor: "pointer",
                              borderRadius: "50%",
                            }}
                            src={userInfo.imageUrl}
                            alt=""
                            onClick={() =>
                              document
                                .getElementById("formuploadModal-profile-image")
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
                      </>
                    ) : (
                      <div
                        style={{
                          marginTop: "10rem",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="133"
                          height="133"
                          fill="rgb(83, 100, 113)"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                          style={{ cursor: "pointer", borderRadius: "50%" }}
                          onClick={() =>
                            document
                              .getElementById("formuploadModal-profile-image")
                              .click()
                          }
                        >
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
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
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        backgroundColor:
                          userInfo?.imageUrl?.slice(0, 3) !== "../"
                            ? "#0f141a"
                            : "transparent",
                        color:
                          userInfo?.imageUrl?.slice(0, 3) !== "../"
                            ? "white"
                            : "black",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                      className={
                        userInfo?.imageUrl?.slice(0, 3) !== "../"
                          ? `next-btn`
                          : "next-btn-skip-for-now"
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
                      className="mt-5"
                      style={{
                        width: "81.5%",
                        lineHeight: "36px",
                        fontWeight: "700",
                        fontSize: "31px",
                      }}
                    >
                      What should we call you?
                    </div>
                    <div
                      style={{
                        width: "81.5%",
                        lineHeight: "20px",
                        fontWeight: "400",
                        fontSize: "15px",
                        color: "#536471",
                      }}
                      className="mt-2"
                    >
                      Your @username is unique. You can always change it later.
                    </div>
                    <TextField
                      className="mt-5"
                      sx={{
                        "& .Mui-focused input + fieldset": {
                          border: usernameDuplicateError
                            ? "2px solid rgb(244, 33, 46)!important"
                            : "2px solid #1d9bf0 !important",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: usernameDuplicateError
                            ? "rgb(244, 33, 46)!important"
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
                      style={{
                        width: "81.5%",
                        color: "#f4222d",
                        fontSize: "13px",
                        fontWeight: "400",
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
                        backgroundColor: skipButtonActive
                          ? "transparent "
                          : "#0f141a",
                        color: skipButtonActive ? "black" : "white",
                        border: "1px solid rgba(0,0,0,0.1)",
                        opacity:
                          skipButtonActive ||
                          (nextButtonActive && usernameValidated)
                            ? "1"
                            : "0.5",
                      }}
                      className={
                        nextButtonActive
                          ? `next-btn`
                          : nextButtonDisabled
                          ? "next-btn"
                          : "next-btn-skip-for-now"
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
      <ToastContainer />
      <ResponsiveNavigationBarBottom
        refreshPosts={() => handleShowPostsHomePage()}
        setLoadingTrue={() => setLoadingTrue()}
        setLoadingFalse={() => setLoadingFalse()}
      />
      <ResponsiveNavigationBarTop />
      <Container
        style={{
          overflowX: "hidden",
        }}
        fluid
      >
        <Row
          style={{
            height: "100vh",
            borderTop: "none",
            borderBottom: "none",
          }}
        >
          <LeftSideNavBar
            refreshPosts={() => handleShowPostsHomePage()}
            setLoadingTrue={() => setLoadingTrue()}
            setLoadingFalse={() => setLoadingFalse()}
            parentCallBack={handleCallback}
          />
          {/* xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={11} // 768px - 992px aralığı
            lg={5} // 992px - 1400px aralığı
            xxl={5} // 1400px ve sonrası aralığı */}
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
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderTop: "none",
              borderBottom: "none",
              padding: "0px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "16px 0px 16px 0px",
              }}
            >
              <span
                onMouseEnter={() => handleHover("forYou")}
                onMouseLeave={handleLeave}
                onClick={() => handleShowForYou()}
                style={getTabStyle("forYou")}
              >
                For you
              </span>
              <span
                onMouseEnter={() => handleHover("following")}
                onMouseLeave={handleLeave}
                onClick={() => handleShowFollowing()}
                style={getTabStyle("following")}
              >
                Following
              </span>
            </div>

            <div
              className="responsive-top-border"
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></div>

            <Stack
              direction="horizontal"
              gap={1}
              className="responsive-stack-home-page"
            >
              <div className="p-2 mt-2">
                {" "}
                {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                  <img
                    src={userInfo.imageUrl}
                    width={40}
                    height={40}
                    alt=""
                    style={{
                      position: "relative",
                      bottom: "30px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      fill="rgb(83, 100, 113)"
                      className="bi bi-person-circle"
                      viewBox="0 0 16 16"
                      style={{
                        position: "relative",
                        bottom: "30px",
                        borderRadius: "50%",
                      }}
                      onClick={() =>
                        document.getElementById("formuploadModal").click()
                      }
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                    <input
                      onChange={handleImage}
                      type="file"
                      id="formuploadModal"
                      name="image"
                      className="form-control"
                      style={{ display: "none" }}
                    />
                  </div>
                )}
              </div>

              <div className="p-0 ">
                <textarea
                  onChange={handleChange}
                  rows="4"
                  cols="50"
                  value={content}
                  maxLength={maxCharacters}
                  className="input-post"
                  placeholder="What is happening?!"
                  style={{
                    resize: "none",
                    padding: "8px",
                    color: "rgba(15,20,25,1.00)",
                    lineHeight: "24px",
                    fontWeight: "400",
                    fontSize: `${content ? "15px" : "20px"}`,
                    width: "100%",
                    height: "100px",
                  }}
                />
              </div>
            </Stack>

            {image && (
              <div className="p-2" style={{ position: "relative" }}>
                <div
                  className="target"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#47494a",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => handleMouseOver(e)}
                  onMouseOut={(e) => handleMouseOut(e)}
                  onClick={closeImage}
                >
                  <div
                    style={{
                      cursor: "pointer",
                      color: "white",
                      fontSize: "25px",
                    }}
                  >
                    &times;
                  </div>
                </div>
                <img
                  className="img-fluid"
                  style={{
                    width: "100%",
                    display: "block",
                    overflow: "hidden",
                    border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
                    borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
                  }}
                  src={image ? image : ""}
                  alt=""
                />
              </div>
            )}
            <div
              // className="responsive-stack-home-page-row"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            <Stack
              direction="horizontal"
              gap={0}
              className="responsive-stack-home-page-2"
            >
              {/* INFO */}

              <div
                className="p-2"
                onClick={() => document.getElementById("formupload").click()}
              >
                <div
                  style={{
                    // border: "1px solid black",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                  className="svg-border-parent"
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
              </div>

              {/* emoji mart start to check */}
              <div className="p-2">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={popoverBottom}
                >
                  <div
                    className="svg-border-parent show-emoji"
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
                </OverlayTrigger>
              </div>
              {/* emoji mart finish to check */}
              <div className="p-2 ms-auto">
                {" "}
                {content !== "" || image ? (
                  <Button
                    style={{
                      border: "none",
                    }}
                    variant="primary"
                    onClick={() => handlePost()}
                    className={`post-btn compose-tweet-textArea compose-tweet-2`}
                  >
                    Post
                  </Button>
                ) : (
                  <Button
                    style={{
                      border: "none",
                    }}
                    variant="primary"
                    onClick={() => handlePost()}
                    className={`emptyContent post-btn compose-tweet-textArea `}
                  >
                    Post
                  </Button>
                )}
              </div>
            </Stack>
            <div
              className="responsive-stack-home-page-row"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}
            <span>
              {isLoading ? (
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              ) : (
                ""
              )}
            </span>
            <div className="all-posts">
              {showForYou ? (
                <>
                  {posts.length > 0 ? (
                    <>
                      {posts.slice(0, visibleTweets).map((post, index) => (
                        <>
                          <div key={post._id}>
                            {post.deactivatedOwner ? null : (
                              <div
                                onClick={() => {
                                  console.log("Post box parent class =>", post);
                                  setclickedPostBox(post);
                                }}
                                className="each-post"
                                key={post._id}
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
                                  <div className="post-head">
                                    {/* start to check */}
                                    {post.reposted.length > 0 &&
                                    post.isReposted &&
                                    post.reposted[0]._id === userInfo._id ? (
                                      <div
                                        className="you-reposted-head"
                                        style={{
                                          position: "relative",
                                          left: "6px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <svg
                                          style={{
                                            color: "rgb(83, 100, 113)",
                                            marginLeft: "20px",
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
                                          }}
                                          onClick={() =>
                                            setclickedPostBox(post)
                                          }
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
                                          position: "relative",
                                          left: "6px",
                                        }}
                                      >
                                        <svg
                                          style={{
                                            color: "rgb(83, 100, 113)",
                                            marginLeft: "20px",
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
                                              onClick={() =>
                                                setclickedPostBox(post)
                                              }
                                              to={`/profile/${post.reposted[0]._id}`}
                                            >
                                              {post.reposted[0].fullname}{" "}
                                              reposted
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
                                    to={`/${post.userId.username}/status/${
                                      !post.isReposted
                                        ? post._id
                                        : post.repostedFromThisOriginalPost[0]
                                            ._id
                                    }`}
                                    onClick={() => setclickedPostBox(post)}
                                    className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                                    direction="horizontal"
                                    gap={1}
                                  >
                                    {" "}
                                    {/* profile image start to check */}
                                    <div className="p-1 ">
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
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={40}
                                            height={40}
                                            fill="rgb(83, 100, 113)"
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
                                              className="hover-fullname"
                                              style={{
                                                fontWeight: "700",
                                                fontSize: "15px",
                                                lineHeight: "20px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                width: "120px",
                                              }}
                                            >
                                              {post.authorFullName}
                                            </span>
                                          </Link>{" "}
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
                                                data-testid="icon-verified"
                                                color="rgba(29,155,240,1.00)"
                                                fill="currentColor"
                                              >
                                                <g>
                                                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                                </g>
                                              </svg>
                                            </span>{" "}
                                          </span>{" "}
                                          <Link
                                            to={`/profile/${post.userId._id}`}
                                            style={{
                                              textDecoration: "none",
                                              color: "rgb(83, 100, 113)",
                                              lineHeight: "20px",
                                              fontSize: "15px",
                                              fontWeight: "400",
                                            }}
                                          >
                                            <span className="post-circle-postowner-username">
                                              <span>
                                                @{post.authorUserName}
                                              </span>
                                            </span>
                                          </Link>
                                          <Link
                                            style={{
                                              textDecoration: "none",
                                            }}
                                            to={`/${
                                              post.userId.username
                                            }/status/${
                                              !post.isReposted
                                                ? post._id
                                                : post
                                                    .repostedFromThisOriginalPost[0]
                                                    ._id
                                            }`}
                                          >
                                            <span
                                              className="post-circle-date-post-detail"
                                              style={{
                                                color: "rgb(83, 100, 113)",
                                                lineHeight: "20px",
                                                fontSize: "15px",
                                                fontWeight: "400",
                                              }}
                                            >
                                              {" "}
                                              ·{" "}
                                              <span className="date-post-detail">
                                                {getCreatedDate(post.createdAt)}
                                              </span>
                                            </span>
                                          </Link>
                                          {/* finish to check  */}
                                        </>
                                      ) : null}
                                    </div>
                                    {/* post owner full name + verified account svg + post owner user name + post created date  finish to check  */}
                                    {/* three dots svg start to check */}
                                    <div className="p-1 ms-auto">
                                      <span className="svg-three-dots-post-detail">
                                        {/* show if post owner userId !equal currentUserId */}
                                        {post.userId &&
                                        post.userId._id !== userInfo._id ? (
                                          <svg
                                            style={{
                                              cursor: "pointer",
                                              backgroundColor:
                                                "rgb(29, 155, 240)",
                                            }}
                                            onClick={() =>
                                              handleShowDetailPostFromHomePage(
                                                post._id
                                              )
                                            }
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
                                            onClick={() =>
                                              handleDeletePostFromHomePage(
                                                post._id
                                              )
                                            }
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
                                    {/* three dots svg finish to check */}
                                  </Stack>
                                  {/* post content start to check  */}
                                  <Stack
                                    to={`/${post.userId.username}/status/${
                                      !post.isReposted
                                        ? post._id
                                        : post.repostedFromThisOriginalPost[0]
                                            ._id
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
                                            : post
                                                .repostedFromThisOriginalPost[0]
                                                ._id
                                        }`}
                                        onClick={() => setclickedPostBox(post)}
                                        className="p-2 parent-comment-text"
                                      >
                                        <span
                                          style={{
                                            color: "rgb(83, 100, 113)",
                                            fontSize: "15px",
                                            lineHeight: "20px",
                                            fontWeight: "400",
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
                                            className="replying-to-text"
                                            style={{
                                              color: "rgb(29, 155, 240)",
                                              cursor: "pointer",
                                              fontSize: "15px",
                                              lineHeight: "20px",
                                              fontWeight: "400",
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
                                      to={`/${post.userId.username}/status/${
                                        !post.isReposted
                                          ? post._id
                                          : post.repostedFromThisOriginalPost[0]
                                              ._id
                                      }`}
                                      style={{
                                        textDecoration: "none",
                                        color: "rgb(15, 20, 25)",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: "15px",
                                          fontWeight: "400",
                                          lineHeight: "20px",
                                          overflowWrap: "break-word",
                                          maxWidth: "100%",
                                          cursor: "pointer",
                                        }}
                                        className="p-2"
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
                                            : post
                                                .repostedFromThisOriginalPost[0]
                                                ._id
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
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
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
                                      onClick={() => setclickedPostBox(post)}
                                      className="p-1 next-to-comment"
                                    >
                                      <CommentModal
                                        post={post ? post : null}
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        refreshPosts={handleShowPostsHomePage}
                                        setLoadingFalse={setLoadingFalse}
                                        setLoadingTrue={setLoadingTrue}
                                        postSharedMessage={postSharedMessage}
                                      />
                                    </div>
                                    <div
                                      onClick={() => setclickedPostBox(post)}
                                      className="p-1 next-to-repost"
                                    >
                                      {post.reposted.length > 0 &&
                                      getRepostedIds(post).includes(
                                        userInfo._id
                                      ) ? (
                                        <div>
                                          <svg
                                            onClick={() =>
                                              handleDeleteRepostMainPage(
                                                post._id
                                              )
                                            }
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
                                              <span>
                                                {post.reposted.length}
                                              </span>
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
                                            onClick={() =>
                                              handleRepost(post._id, post)
                                            }
                                            width={`${1.25}em`}
                                            height={`${1.25}em`}
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                            className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                            fill={
                                              !shouldHide &&
                                              post.reposted.includes(
                                                userInfo._id
                                              )
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
                                                post.reposted.includes(
                                                  userInfo._id
                                                )
                                                  ? "rgb(0, 186, 124)"
                                                  : "rgb(83, 100, 113)",
                                            }}
                                          >
                                            {post.reposted.length ? (
                                              <span>
                                                {post.reposted.length}
                                              </span>
                                            ) : null}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div
                                      to={`/${post.userId.username}/status/${
                                        !post.isReposted
                                          ? post._id
                                          : post.repostedFromThisOriginalPost[0]
                                              ._id
                                      }`}
                                      onClick={() => setclickedPostBox(post)}
                                      className="p-1 next-to-like"
                                    >
                                      {getLikerIds(post).includes(
                                        userInfo._id
                                      ) ? (
                                        <div>
                                          <svg
                                            onClick={() =>
                                              handleDeleteLikeFromHomePage(
                                                post._id
                                              )
                                            }
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
                                            onClick={() =>
                                              handlePostLikesFromHomePage(
                                                post._id,
                                                post
                                              )
                                            }
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
                                  </Stack>
                                  {/* new version favorite repost comment finish to check */}
                                </div>
                                <div
                                  onClick={() => {
                                    console.log(
                                      "Post box child class =>",
                                      post
                                    );
                                    setclickedPostBox(post);
                                  }}
                                  className="border-extra"
                                  style={{
                                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </>
                      ))}

                      {visibleTweets < posts.length && (
                        <Accordion defaultActiveKey="0">
                          <Accordion.Item
                            style={{ border: "none" }}
                            eventKey="1"
                          >
                            <Accordion.Header
                              style={{ border: "none" }}
                              className="accordion-2"
                            >
                              <div
                                onClick={handleShowMorePosts}
                                style={{
                                  border: "none",
                                  width: "100%",
                                  textAlign: "center",
                                  color: "rgb(29, 155, 240)",
                                  fontSize: "15px",
                                  fontWeight: "400",
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
                      {/* when no post yet from for you section in general start to check  */}
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
                          Welcome to Connectify!
                        </div>
                        <div
                          style={{
                            color: "rgb(83, 100, 113)",
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "400",
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
                          <>
                            <div
                              onClick={() => {
                                console.log("Post box parent class =>", post);
                                setclickedPostBox(post);
                              }}
                              className="each-post"
                              key={post._id}
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
                                <div className="post-head">
                                  {/* start to check */}
                                  {post.reposted.length > 0 &&
                                  post.isReposted &&
                                  post.reposted[0]._id === userInfo._id ? (
                                    <div
                                      className="you-reposted-head"
                                      style={{
                                        cursor: "pointer",
                                        position: "relative",
                                        left: "6px",
                                      }}
                                    >
                                      <svg
                                        style={{
                                          color: "rgb(83, 100, 113)",
                                          marginLeft: "20px",
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
                                        position: "relative",
                                        left: "6px",
                                      }}
                                    >
                                      <svg
                                        style={{
                                          color: "rgb(83, 100, 113)",
                                          marginLeft: "20px",
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
                                            onClick={() =>
                                              setclickedPostBox(post)
                                            }
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
                                  to={`/${post.userId.username}/status/${
                                    !post.isReposted
                                      ? post._id
                                      : post.repostedFromThisOriginalPost[0]._id
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
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={40}
                                          height={40}
                                          fill="rgb(83, 100, 113)"
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
                                            className="hover-fullname"
                                            style={{
                                              fontWeight: "700",
                                              fontSize: "15px",
                                              lineHeight: "20px",
                                            }}
                                          >
                                            {post.authorFullName}
                                          </span>
                                        </Link>
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
                                              data-testid="icon-verified"
                                              color="rgba(29,155,240,1.00)"
                                              fill="currentColor"
                                            >
                                              <g>
                                                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                              </g>
                                            </svg>
                                          </span>{" "}
                                        </span>
                                        <Link
                                          to={`/profile/${post.userId._id}`}
                                          style={{
                                            textDecoration: "none",
                                            color: "rgb(83, 100, 113)",
                                            lineHeight: "20px",
                                            fontSize: "15px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          <span className="post-circle-postowner-username">
                                            <span>@{post.authorUserName}</span>
                                          </span>
                                        </Link>
                                        <Link
                                          to={`/${
                                            post.userId.username
                                          }/status/${
                                            !post.isReposted
                                              ? post._id
                                              : post
                                                  .repostedFromThisOriginalPost[0]
                                                  ._id
                                          }`}
                                          style={{
                                            textDecoration: "none",
                                          }}
                                        >
                                          <span
                                            className="post-circle-date-post-detail"
                                            style={{
                                              color: "rgb(83, 100, 113)",
                                              lineHeight: "20px",
                                              fontSize: "15px",
                                              fontWeight: "400",
                                            }}
                                          >
                                            {" "}
                                            ·{" "}
                                            <span className="date-post-detail">
                                              {getCreatedDate(post.createdAt)}
                                            </span>
                                          </span>
                                        </Link>
                                        {/* finish to check  */}
                                      </>
                                    ) : null}
                                  </div>
                                  {/* post owner full name + verified account svg + post owner user name + post created date  finish to check  */}

                                  {/* three dots svg start to check */}
                                  <div className="p-1 ms-auto">
                                    <span>
                                      {/* show if post owner userId !equal currentUserId */}
                                      {post.userId &&
                                      post.userId._id !== userInfo._id ? (
                                        <svg
                                          style={{
                                            cursor: "pointer",
                                            backgroundColor:
                                              "rgb(29, 155, 240)",
                                          }}
                                          onClick={() =>
                                            handleShowDetailPostFromHomePage(
                                              post._id
                                            )
                                          }
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
                                          onClick={() =>
                                            handleDeletePostFromHomePage(
                                              post._id
                                            )
                                          }
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
                                  {/* three dots svg finish to check */}
                                </Stack>

                                {/* post content start to check  */}
                                <Stack
                                  to={`/${post.userId.username}/status/${
                                    !post.isReposted
                                      ? post._id
                                      : post.repostedFromThisOriginalPost[0]._id
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
                                              ._id
                                      }`}
                                      onClick={() => setclickedPostBox(post)}
                                      className="p-2 parent-comment-text"
                                    >
                                      <span
                                        style={{
                                          color: "rgb(83, 100, 113)",
                                          fontSize: "15px",
                                          lineHeight: "20px",
                                          fontWeight: "400",
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
                                          className="replying-to-text"
                                          style={{
                                            color: "rgb(29, 155, 240)",
                                            cursor: "pointer",
                                            fontSize: "15px",
                                            lineHeight: "20px",
                                            fontWeight: "400",
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
                                    to={`/${post.userId.username}/status/${
                                      !post.isReposted
                                        ? post._id
                                        : post.repostedFromThisOriginalPost[0]
                                            ._id
                                    }`}
                                    style={{
                                      textDecoration: "none",
                                      color: "rgb(15, 20, 25)",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "15px",
                                        fontWeight: "400",
                                        lineHeight: "20px",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        cursor: "pointer",
                                      }}
                                      className="p-2"
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
                                              ._id
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
                                          boxShadow:
                                            "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
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
                                    onClick={() => setclickedPostBox(post)}
                                    className="p-1 next-to-comment"
                                  >
                                    <CommentModal
                                      post={post ? post : null}
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      refreshPosts={handleShowPostsHomePage}
                                      setLoadingFalse={setLoadingFalse}
                                      setLoadingTrue={setLoadingTrue}
                                      postSharedMessage={postSharedMessage}
                                    />
                                  </div>
                                  <div
                                    onClick={() => setclickedPostBox(post)}
                                    className="p-1 next-to-repost"
                                  >
                                    {post.reposted.length > 0 &&
                                    getRepostedIds(post).includes(
                                      userInfo._id
                                    ) ? (
                                      <div>
                                        <svg
                                          onClick={() =>
                                            handleDeleteRepostMainPage(post._id)
                                          }
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
                                          style={{ color: "rgb(0, 186, 124)" }}
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
                                          onClick={() =>
                                            handleRepost(post._id, post)
                                          }
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
                                              post.reposted.includes(
                                                userInfo._id
                                              )
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
                                        : post.repostedFromThisOriginalPost[0]
                                            ._id
                                    }`}
                                    onClick={() => setclickedPostBox(post)}
                                    className="p-1 next-to-like"
                                  >
                                    {getLikerIds(post).includes(
                                      userInfo._id
                                    ) ? (
                                      <div>
                                        <svg
                                          onClick={() =>
                                            handleDeleteLikeFromHomePage(
                                              post._id
                                            )
                                          }
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
                                          onClick={() =>
                                            handlePostLikesFromHomePage(
                                              post._id,
                                              post
                                            )
                                          }
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
                                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                                }}
                              ></div>
                            </div>
                          </>
                        ))}
                      {visibleFollowingTweets <
                        followingPosts.followingPosts.length && (
                        <Accordion defaultActiveKey="0">
                          <Accordion.Item
                            style={{ border: "none" }}
                            eventKey="1"
                          >
                            <Accordion.Header
                              style={{ border: "none" }}
                              className="accordion-2"
                            >
                              <div
                                onClick={handleShowMoreFollowingTweets}
                                style={{
                                  border: "none",
                                  width: "100%",
                                  textAlign: "center",
                                  color: "rgb(29, 155, 240)",
                                  fontSize: "15px",
                                  fontWeight: "400",
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
                      {/* when no post yet from following section in general start to check  */}
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
                          Welcome to Connectify!
                        </div>
                        <div
                          style={{
                            color: "rgb(83, 100, 113)",
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "400",
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
          {/* finish to check  main column */}
          {/* 3.column burası olucak */}
          <RightSideColumn
            handleSetSearchTerm={handleSetSearchTerm}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTermEmpty}
            filteredSearchResult={filteredSearchResult}
          />
        </Row>
      </Container>
    </>
  );
}

export default MainPage;
