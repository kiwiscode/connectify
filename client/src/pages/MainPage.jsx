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
} from "react-bootstrap";
import { LogoutModal, PostModal, CommentModal } from "../components/ui/Modal";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import ResponsiveNavigationBarTop from "../components/Navbar/ResponsiveNavigationTop";
import deleteRepost from "../utils/repostFunctions";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { Bounce, ToastContainer, toast } from "react-toastify";

import CustomNotification from "../components/Notifications/CustomNotification";

// socket io 2 client start to check
// import io from "socket.io-client";
// socket io 2 client finish to check

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

// const socket = io.connect(API_URL);

function MainPage() {
  // rendering page after redirectiring for fetching data without problem ! if you need to fetch data after you redirect or navigate to user to the page (it can work pretty good on your navigation bar)this lines of code is pretty useful
  // start to check
  const navigate = useNavigate();
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

  const redirectToPostDetailPage = (postOwnerName, postId) => {
    navigate(`/${postOwnerName}/status/${postId}`);
    window.location.reload();
  };

  const redirectToImagePostDetailPage = (postOwnerName, postId) => {
    navigate(`/${postOwnerName}/status/${postId}/photo/1`);
    window.location.reload();
  };
  // finish to check
  const { userInfo, getToken, socket } = useContext(UserContext);
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
  const [image, setImage] = useState("");

  const [followingPosts, setFollowingPosts] = useState([]);

  // socket io 1 client start to check
  const [notificationTest, setnotificationTest] = useState([]);
  const [notificationText, setnotificationText] = useState([]);
  // socket io 1 client finish to check

  // socket io 4 client start to check
  useEffect(() => {
    setshouldHide(true);
    handleShowPostsHomePage();
    console.log("Hello worldddddd");
    socket.on("socket_id_for_user", (socketId) => {
      console.log("socket id received from backend =>", socketId);

      localStorage.setItem("socketId", socketId);
    });

    socket.emit("setUsername", userInfo.username);
  }, []);
  // socket io 4 client finish to check

  const getOnlyFollowingPosts = () => {
    axios
      .get(`${API_URL}/followingPosts`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log("Response =>", response);

        localStorage.setItem(
          "followedUsersPosts",
          JSON.stringify(response.data)
        );

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
        console.log("Kendine notification mu göndericeksin ? ");
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
        console.log("Kendine notification mu göndericeksin ? ");
      }
    });
  }, [socket]);

  // socket io 5 client start to check
  const handleNotification = (post, userInfo, type) => {
    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: post.userId.username,
      type: type,
      contactHasBeenMade: post,
      senderInfo: userInfo,
    });
  };
  // socket io 5 client finish to check

  //handle and convert it in base 64
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
    console.log(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

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
        console.log("Response from handle show posts home page =>", response);
        // NOTE UPDATING THE LOCALSTORAGE
        // start to check
        localStorage.setItem("mainPagePosts", JSON.stringify(response.data));
        // finish to check
        setPosts(response.data);
      })
      .catch((err) => {
        return err;
      });
  };

  const setLoadingTrue = () => {
    setIsLoading(true);
    setContent("");
  };

  const setLoadingFalse = () => {
    setIsLoading(false);
  };

  const handleDeleteLikeFromHomePage = (postId) => {
    console.log("You deleted favorite");
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
        const mainPagePosts = JSON.parse(localStorage.getItem("mainPagePosts"));
        const findedPost = mainPagePosts.find((eachPost) => {
          return eachPost._id === postId;
        });

        const findedPostIndex = mainPagePosts.indexOf(findedPost);

        console.log("Finded post =>", findedPost);
        console.log("Finded post index =>", findedPostIndex);

        if (findedPost.isReposted) {
          console.log("Finded post isReposted =>", findedPost);
          console.log("Finded post index =>", findedPostIndex);

          const originalPostId =
            mainPagePosts[findedPostIndex].repostedFromThisOriginalPost[0]._id;
          const originalPost = mainPagePosts.find((eachPost) => {
            return eachPost._id === originalPostId;
          });
          const originalPostIndex = mainPagePosts.indexOf(originalPost);

          const liker = mainPagePosts[originalPostIndex].likes.find(
            (eachLiker) => {
              return eachLiker._id === userInfo._id;
            }
          );

          const likerIndex =
            mainPagePosts[originalPostIndex].likes.indexOf(liker);

          console.log("Finded original post  =>", originalPost);

          console.log("Finded original post index =>", originalPostIndex);

          console.log("Liker =>", liker);
          console.log("Liker index =>", likerIndex);
          const updatePosts = () => {
            mainPagePosts[findedPostIndex].likes.splice(likerIndex, 1);
            mainPagePosts[originalPostIndex].likes.splice(likerIndex, 1);

            localStorage.setItem(
              "mainPagePosts",
              JSON.stringify(mainPagePosts)
            );
            setPosts(mainPagePosts);
            getOnlyFollowingPosts();
          };

          setTimeout(updatePosts, 500);
        } else if (!findedPost.isReposted && findedPost.reposted.length > 0) {
          console.log("Now here is working !");
          console.log("Finded post !isReposted =>", findedPost);
          console.log("Finded post index =>", findedPostIndex);
          console.log(
            "Finded post is not reposted and has reference post because of its length more than 0"
          );

          const referencePost = mainPagePosts.find((eachPost) => {
            return eachPost.repostedFromThisOriginalPost[0]
              ? eachPost.repostedFromThisOriginalPost[0]._id === postId
              : null;
          });
          const referencePostIndex = mainPagePosts.indexOf(referencePost);

          console.log("Reference post =>", referencePost);
          console.log("Reference post index =>", referencePostIndex);

          const liker = mainPagePosts[referencePostIndex].likes.find(
            (eachLiker) => {
              return eachLiker._id === userInfo._id;
            }
          );
          const likerIndex =
            mainPagePosts[referencePostIndex].likes.indexOf(liker);

          console.log("Liker =>", liker);
          console.log("Liker index =>", likerIndex);

          const updatePosts = () => {
            mainPagePosts[findedPostIndex].likes.splice(likerIndex);
            mainPagePosts[referencePostIndex].likes.splice(likerIndex);

            localStorage.setItem(
              "mainPagePosts",
              JSON.stringify(mainPagePosts)
            );
            console.log("Main page posts =>", mainPagePosts);
            // setPosts(mainPagePosts);
            setLoadingTrue();
            setLoadingFalse();
            setError("");
            handleShowPostsHomePage();
            getOnlyFollowingPosts();
          };

          setTimeout(updatePosts, 500);
        } else if (!findedPost.isReposted && findedPost.reposted.length === 0) {
          console.log("Finded post !isReposted =>", findedPost);
          console.log("Finded post index =>", findedPostIndex);
          console.log("Finded post is not reposted and has no reference post");

          const liker = mainPagePosts[findedPostIndex].likes.find(
            (eachLiker) => {
              return eachLiker._id === userInfo._id;
            }
          );
          const likerIndex =
            mainPagePosts[findedPostIndex].likes.indexOf(liker);

          console.log("Liker =>", liker);
          console.log("Liker index =>", likerIndex);

          const updatePosts = () => {
            mainPagePosts[findedPostIndex].likes.splice(likerIndex, 1);

            localStorage.setItem(
              "mainPagePosts",
              JSON.stringify(mainPagePosts)
            );
            setPosts(mainPagePosts);
            getOnlyFollowingPosts();
          };

          setTimeout(updatePosts, 500);
        }
      })
      .catch((err) => {
        return err;
      });
  };

  const getLikerIds = (array) => {
    return array.likes.map((eachLiker) => {
      return eachLiker._id;
    });
  };

  const handlePostLikesFromHomePage = (postId) => {
    console.log("You added to favorite");
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
      .then((response) => {
        console.log("Response after adding favorite =>", response);
        const mainPagePosts = JSON.parse(localStorage.getItem("mainPagePosts"));
        const findedPost = mainPagePosts.find((eachPost) => {
          return eachPost._id === postId;
        });
        // socket io test start to check
        handleNotification(findedPost, userInfo, "liked");
        // socket io test finish to check

        const findedPostIndex = mainPagePosts.indexOf(findedPost);

        console.log("Finded post =>", findedPost);
        console.log("Finded post index =>", findedPostIndex);
        if (findedPost.isReposted) {
          console.log("Finded post isReposted =>", findedPost);
          console.log("Finded post index =>", findedPostIndex);

          const originalPostId =
            mainPagePosts[findedPostIndex].repostedFromThisOriginalPost[0]._id;
          const originalPost = mainPagePosts.find((eachPost) => {
            return eachPost._id === originalPostId;
          });
          const originalPostIndex = mainPagePosts.indexOf(originalPost);

          console.log("Finded original post  =>", originalPost);

          console.log("Finded original post index =>", originalPostIndex);
          const updatePosts = () => {
            mainPagePosts[findedPostIndex].likes.unshift(userInfo);
            mainPagePosts[originalPostIndex].likes.unshift(userInfo);

            localStorage.setItem(
              "mainPagePosts",
              JSON.stringify(mainPagePosts)
            );
            setPosts(mainPagePosts);
            getOnlyFollowingPosts();
          };

          setTimeout(updatePosts, 500);
        } else if (!findedPost.isReposted && findedPost.reposted.length > 0) {
          console.log("Here is working !");
          console.log("Finded post !isReposted =>", findedPost);
          console.log("Finded post index =>", findedPostIndex);
          console.log(
            "Finded post is not reposted and has reference post because of its length more than 0"
          );

          const referencePost = mainPagePosts.find((eachPost) => {
            return eachPost.repostedFromThisOriginalPost[0]
              ? eachPost.repostedFromThisOriginalPost[0]._id === postId
              : null;
          });
          const referencePostIndex = mainPagePosts.indexOf(referencePost);

          console.log("Reference post =>", referencePost);
          console.log("Reference post index =>", referencePostIndex);

          const updatePosts = () => {
            mainPagePosts[findedPostIndex].likes.unshift(userInfo);
            mainPagePosts[referencePostIndex].likes.unshift(userInfo);

            localStorage.setItem(
              "mainPagePosts",
              JSON.stringify(mainPagePosts)
            );
            setPosts(mainPagePosts);
            getOnlyFollowingPosts();
          };

          setTimeout(updatePosts, 500);
        } else if (!findedPost.isReposted && findedPost.reposted.length === 0) {
          console.log("Finded post !isReposted =>", findedPost);
          console.log("Finded post index =>", findedPostIndex);
          console.log("Finded post is not reposted and has no reference post");

          const updatePosts = () => {
            mainPagePosts[findedPostIndex].likes.unshift(userInfo);

            localStorage.setItem(
              "mainPagePosts",
              JSON.stringify(mainPagePosts)
            );
            setPosts(mainPagePosts);
            getOnlyFollowingPosts();
          };

          setTimeout(updatePosts, 500);
        }
        // setLoadingTrue();
        // setLoadingFalse();
        // setError("");
        // handleShowPostsHomePage();
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        setError(errorMessage);
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
        console.log("Deleted post !");

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
          console.log("Response after posting a tweet =>", response);
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
                console.log("I am working right now! ");
                // Assuming userInfo is retrieved from localStorage
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));

                // Assuming 'posts' is an array in userInfo
                if (userInfo.posts.length) {
                  userInfo.posts.splice(0, 0, response.data[0]); // Assuming response contains the created post data
                } else {
                  userInfo.posts.push(response.data[0]._id);
                }
                // Saving the updated userInfo back to localStorage
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                setPosts(response.data);
              })
              .catch((err) => {
                return err;
              });

            setLoadingFalse();
          }, 1200);
          window.location.reload();
        })
        .catch((err) => {
          return err;
        });
    } else {
      console.log("No content !");

      console.log("Nothing to share !");
    }
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
      .then((response) => {
        console.log("Am i getting created post =>", response);
        const posts = JSON.parse(localStorage.getItem("mainPagePosts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });
        // socket io test start to check
        handleNotification(findedPost, userInfo, "repost");
        // socket io test finish to check
        const index = posts.indexOf(findedPost);

        const updatePosts = () => {
          setshouldHide(false);
          setPosts(posts);
          handleShowPostsHomePage();
          getOnlyFollowingPosts();

          posts[index].reposted.unshift(userInfo);

          localStorage.setItem("mainPagePosts", JSON.stringify(posts));
        };

        setTimeout(updatePosts, 500);

        console.log("AFTER REPOST CURRENT STATE RENDERED POSTS =>", posts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteRepostMainPage = (postId) => {
    deleteRepost(
      JSON.parse(localStorage.getItem("mainPagePosts")),
      postId,
      userInfo,
      getToken,
      setPosts,
      getOnlyFollowingPosts
    );
  };

  const closeImage = () => {
    setImage("");
  };

  const handleMouseOver = (e) => {
    console.log("MOUSE OVER =>", e);
    console.log(e.target.classList);
    const shallowCopy = e.target.classList[0];
    console.log(shallowCopy);
    if (shallowCopy === "target") {
      e.target.style.background = "#595b5b";
    }
  };

  const handleMouseOut = (e) => {
    console.log("MOUSE OVER =>", e);
    console.log(e.target.classList);
    const shallowCopy = e.target.classList[0];
    console.log(shallowCopy);
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
    console.log("Choosed emoji =>", chosenEmoji);
    console.log("Content =>", content);
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

  return (
    <>
      <ToastContainer />
      <ResponsiveNavigationBarBottom />
      <ResponsiveNavigationBarTop />
      <Container>
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
                <div className="chevron-left-parent">
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

              <div className="inner-div-fonts inner-div">
                <Link to="/home">
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

                {/* start to check notification component place  */}
                <Link>
                  <div className="notifications">
                    <div>
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

                      <span>Notifications </span>
                    </div>
                  </div>
                </Link>
                {/* finish to check notification component place  */}

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

                <Link to="/profile" onClick={redirectProfilePage}>
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

          {/* start to check  main column */}

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
            <div
              style={{
                // border: "1px solid black",
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

            <Row
              className="responsive-top-border"
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></Row>

            <Stack
              direction="horizontal"
              gap={1}
              className="responsive-stack-home-page"
            >
              <div className="p-0 mt-2">
                {" "}
                {userInfo.imageUrl.slice(0, 3) !== "../" ? (
                  <img
                    src={userInfo.imageUrl}
                    width={40}
                    height={40}
                    alt=""
                    style={{ position: "relative", bottom: "30px" }}
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
                      style={{ position: "relative", bottom: "30px" }}
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
                      name="modalImage"
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
              <div style={{ position: "relative" }}>
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
            <Row
              // className="responsive-stack-home-page-row"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></Row>
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
                    variant="primary"
                    onClick={() => handlePost()}
                    className={`post-btn compose-tweet-textArea compose-tweet-2`}
                  >
                    Post
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => handlePost()}
                    className={`emptyContent post-btn compose-tweet-textArea `}
                  >
                    Post
                  </Button>
                )}
              </div>
            </Stack>
            <Row
              className="responsive-stack-home-page-row"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></Row>
            {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}
            <span>{isLoading ? <LoadingSpinner></LoadingSpinner> : ""}</span>
            <div className="all-posts">
              {showForYou ? (
                <>
                  {posts.length > 0 ? (
                    <>
                      {posts.map((post, index) => (
                        <div key={post._id}>
                          <div className="posts-details">
                            <div className="post-head">
                              {/* Typeof ={typeof index} , {index} */}

                              {/* start to check */}
                              {post.reposted.length > 0 &&
                              post.isReposted &&
                              post.reposted[0]._id === userInfo._id ? (
                                <div
                                  style={{
                                    position: "relative",
                                    right: "15px",
                                  }}
                                >
                                  <svg
                                    style={{
                                      color: "rgb(83, 100, 113)",
                                      marginLeft: "20px",
                                    }}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      lineHeight: "16px",
                                      fontWeight: "700",
                                      color: "rgb(83, 100, 113)",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    You reposted
                                  </span>{" "}
                                </div>
                              ) : null}

                              {/* start to check */}
                              {post.reposted.length > 0 &&
                              post.isReposted &&
                              post.reposted[0]._id !== userInfo._id ? (
                                <div
                                  style={{
                                    position: "relative",
                                    right: "16px",
                                  }}
                                >
                                  <svg
                                    style={{
                                      marginLeft: "20px",
                                    }}
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      lineHeight: "20px",
                                      fontWeight: "700",
                                      color: "rgb(83, 100, 113)",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {post.reposted[0].fullname ? (
                                      <span>
                                        {post.reposted[0].fullname} reposted
                                      </span>
                                    ) : null}
                                  </span>{" "}
                                </div>
                              ) : null}
                            </div>
                            <Stack direction="horizontal" gap={1}>
                              {/* profile image start to check */}
                              <div className="p-1">
                                {post.userId.imageUrl.slice(0, 3) !== "../" ? (
                                  <Link
                                    onClick={() =>
                                      redirectSpesificProfilePage(
                                        post.userId._id
                                      )
                                    }
                                    style={{ cursor: "pointer" }}
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
                                    />
                                  </Link>
                                ) : (
                                  <Link
                                    onClick={() =>
                                      redirectSpesificProfilePage(
                                        post.userId._id
                                      )
                                    }
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
                                      onClick={() =>
                                        redirectSpesificProfilePage(
                                          post.userId._id
                                        )
                                      }
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
                                      onClick={() =>
                                        redirectSpesificProfilePage(
                                          post.userId._id
                                        )
                                      }
                                      to={`/profile/${post.userId._id}`}
                                      style={{
                                        textDecoration: "none",
                                        color: "rgb(83, 100, 113)",
                                        lineHeight: "20px",
                                        fontSize: "15px",
                                        fontWeight: "400",
                                      }}
                                    >
                                      <span>
                                        <span>@{post.authorUserName}</span>
                                      </span>
                                    </Link>
                                    <Link
                                      onClick={() =>
                                        redirectToPostDetailPage(
                                          post.userId.username,
                                          !post.isReposted
                                            ? post._id
                                            : post
                                                .repostedFromThisOriginalPost[0]
                                                ._id
                                        )
                                      }
                                      to={`/${post.userId.username}/status/${
                                        !post.isReposted
                                          ? post._id
                                          : post.repostedFromThisOriginalPost[0]
                                              ._id
                                      }`}
                                      style={{
                                        textDecoration: "none",
                                      }}
                                    >
                                      <span
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
                                        backgroundColor: "rgb(29, 155, 240)",
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
                                        handleDeletePostFromHomePage(post._id)
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
                            <Stack direction="vertical" gap={1}>
                              {post.isComment ? (
                                <div className="p-2">
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
                                      onClick={() =>
                                        redirectSpesificProfilePage(
                                          post.commentedForThisUsersPost._id
                                        )
                                      }
                                      style={{
                                        color: "rgb(29, 155, 240)",
                                        cursor: "pointer",
                                        fontSize: "15px",
                                        lineHeight: "20px",
                                        fontWeight: "400",
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
                                    : post.repostedFromThisOriginalPost[0]._id
                                }`}
                                onClick={() =>
                                  redirectToPostDetailPage(
                                    post.userId.username,
                                    !post.isReposted
                                      ? post._id
                                      : post.repostedFromThisOriginalPost[0]._id
                                  )
                                }
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
                                  onClick={() =>
                                    redirectToImagePostDetailPage(
                                      post.userId.username,
                                      !post.isReposted
                                        ? post._id
                                        : post.repostedFromThisOriginalPost[0]
                                            ._id
                                    )
                                  }
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
                                      border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
                                      borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
                                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
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
                              className="mt-0"
                              direction="horizontal"
                              style={{
                                justifyContent: "space-between",
                                margin: "5px 0px 5px 0px",
                              }}
                            >
                              <div className="p-1">
                                <CommentModal
                                  post={post ? post : null}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  refreshPosts={handleShowPostsHomePage}
                                />
                              </div>
                              <div className="p-1">
                                {post.reposted.length > 0 &&
                                getRepostedIds(post).includes(userInfo._id) ? (
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
                                      onClick={() => handleRepost(post._id)}
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
                              <div className="p-1">
                                {getLikerIds(post).includes(userInfo._id) ? (
                                  <div>
                                    <svg
                                      onClick={() =>
                                        handleDeleteLikeFromHomePage(post._id)
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
                                        handlePostLikesFromHomePage(post._id)
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
                          <Row
                            style={{
                              borderBottom: "1px solid rgba(0,0,0,0.1)",
                            }}
                          ></Row>
                        </div>
                      ))}
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
                    followingPosts.followingPosts.map((post, index) => (
                      <div key={post._id}>
                        <div className="posts-details">
                          <div className="post-head">
                            {/* start to check */}
                            {post.reposted.length > 0 &&
                            post.isReposted &&
                            post.reposted[0]._id === userInfo._id ? (
                              <div
                                style={{
                                  position: "relative",
                                  right: "15px",
                                }}
                              >
                                <svg
                                  style={{
                                    color: "rgb(83, 100, 113)",
                                    marginLeft: "20px",
                                  }}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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
                                <span
                                  style={{
                                    fontSize: "13px",
                                    lineHeight: "16px",
                                    fontWeight: "700",
                                    color: "rgb(83, 100, 113)",
                                    marginLeft: "10px",
                                  }}
                                >
                                  You reposted
                                </span>{" "}
                              </div>
                            ) : null}

                            {/* start to check */}
                            {post.reposted.length > 0 &&
                            post.isReposted &&
                            post.reposted[0]._id !== userInfo._id ? (
                              <div
                                style={{
                                  position: "relative",
                                  right: "16px",
                                }}
                              >
                                <svg
                                  style={{
                                    marginLeft: "20px",
                                  }}
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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
                                <span
                                  style={{
                                    fontSize: "13px",
                                    lineHeight: "20px",
                                    fontWeight: "700",
                                    color: "rgb(83, 100, 113)",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {post.reposted[0].fullname ? (
                                    <span>
                                      {post.reposted[0].fullname} reposted
                                    </span>
                                  ) : null}
                                </span>{" "}
                              </div>
                            ) : null}
                          </div>
                          <Stack direction="horizontal" gap={1}>
                            {/* profile image start to check */}
                            <div className="p-1">
                              {post.userId.imageUrl.slice(0, 3) !== "../" ? (
                                <Link
                                  onClick={() =>
                                    redirectSpesificProfilePage(post.userId._id)
                                  }
                                  style={{ cursor: "pointer" }}
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
                                  />
                                </Link>
                              ) : (
                                <Link
                                  onClick={() =>
                                    redirectSpesificProfilePage(post.userId._id)
                                  }
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
                                    onClick={() =>
                                      redirectSpesificProfilePage(
                                        post.userId._id
                                      )
                                    }
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
                                    onClick={() =>
                                      redirectSpesificProfilePage(
                                        post.userId._id
                                      )
                                    }
                                    to={`/profile/${post.userId._id}`}
                                    style={{
                                      textDecoration: "none",
                                      color: "rgb(83, 100, 113)",
                                      lineHeight: "20px",
                                      fontSize: "15px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    <span>
                                      <span>@{post.authorUserName}</span>
                                    </span>
                                  </Link>
                                  <Link
                                    onClick={() =>
                                      redirectToPostDetailPage(
                                        post.userId.username,
                                        !post.isReposted
                                          ? post._id
                                          : post.repostedFromThisOriginalPost[0]
                                              ._id
                                      )
                                    }
                                    to={`/${post.userId.username}/status/${
                                      !post.isReposted
                                        ? post._id
                                        : post.repostedFromThisOriginalPost[0]
                                            ._id
                                    }`}
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    <span
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
                                      backgroundColor: "rgb(29, 155, 240)",
                                    }}
                                    onClick={() =>
                                      handleShowDetailPostFromHomePage(post._id)
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
                                      handleDeletePostFromHomePage(post._id)
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
                          <Stack direction="vertical" gap={1}>
                            {post.isComment ? (
                              <div className="p-2">
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
                                    onClick={() =>
                                      redirectSpesificProfilePage(
                                        post.commentedForThisUsersPost._id
                                      )
                                    }
                                    style={{
                                      color: "rgb(29, 155, 240)",
                                      cursor: "pointer",
                                      fontSize: "15px",
                                      lineHeight: "20px",
                                      fontWeight: "400",
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
                                  : post.repostedFromThisOriginalPost[0]._id
                              }`}
                              onClick={() =>
                                redirectToPostDetailPage(
                                  post.userId.username,
                                  !post.isReposted
                                    ? post._id
                                    : post.repostedFromThisOriginalPost[0]._id
                                )
                              }
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
                                onClick={() =>
                                  redirectToImagePostDetailPage(
                                    post.userId.username,
                                    !post.isReposted
                                      ? post._id
                                      : post.repostedFromThisOriginalPost[0]._id
                                  )
                                }
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
                                    border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
                                    borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
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
                            className="mt-0"
                            direction="horizontal"
                            style={{
                              justifyContent: "space-between",
                              margin: "5px 0px 5px 0px",
                            }}
                          >
                            <div className="p-1">
                              <CommentModal
                                post={post ? post : null}
                                width={`${1.25}em`}
                                height={`${1.25}em`}
                                refreshPosts={handleShowPostsHomePage}
                              />
                            </div>
                            <div className="p-1">
                              {post.reposted.length > 0 &&
                              getRepostedIds(post).includes(userInfo._id) ? (
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
                                    onClick={() => handleRepost(post._id)}
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
                            <div className="p-1">
                              {getLikerIds(post).includes(userInfo._id) ? (
                                <div>
                                  <svg
                                    onClick={() =>
                                      handleDeleteLikeFromHomePage(post._id)
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
                                      handlePostLikesFromHomePage(post._id)
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
                        <Row
                          style={{
                            borderBottom: "1px solid rgba(0,0,0,0.1)",
                          }}
                        ></Row>
                      </div>
                    ))
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
          <Col
            className="side-bar-column d-none d-lg-block d-xxl-block"
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={6} // 768px - 992px aralığı
            lg={3} // 1200px - 1400px aralığı
            xxl={3} // 1400px ve sonrası aralığı
            style={
              {
                // height: "100%",
                // backgroundColor: "indianred",
              }
            }
          >
            Side bar column
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MainPage;
