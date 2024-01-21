import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Stack,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LogoutModal, PostModal, CommentModal } from "../components/ui/Modal";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function UserProfile() {
  // rendering page after redirectiring for fetching data without problem ! if you need to fetch data after you redirect or navigate to user to the page (it can work pretty good on your navigation bar)this lines of code is pretty useful
  // start to check
  const navigate = useNavigate();
  const redirectToMessages = () => {
    navigate("/messages");
    window.location.reload();
  };

  const redirectHomePage = () => {
    navigate("/home");
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
  // finish to check

  const [userprofiledata, setUserprofiledata] = useState([]);
  const { getToken, userInfo, socket } = useContext(UserContext);
  const [favoriteWindow, setFavoriteWindow] = useState("hide");
  const [postsWindow, setPostWindow] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [postId, setpostId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setprofileImage] = useState("");
  const [completedProfileImage, setcompletedProfileImage] = useState(false);
  // socket io 1 client start to check
  const [notificationTest, setnotificationTest] = useState([]);
  const [notificationText, setnotificationText] = useState([]);
  // socket io 1 client finish to check

  // socket io 4 client start to check
  useEffect(() => {
    console.log("Hello worldddddd");
    socket.on("socket_id_for_user", (socketId) => {
      console.log("socket id received from backend =>", socketId);

      localStorage.setItem("socketId", socketId);
    });

    socket.emit("setUsername", userInfo.username);
  }, []);
  // socket io 4 client finish to check

  useEffect(() => {
    socket.on("getNotification", (data) => {
      console.log("Data =>", data);
      setnotificationTest((prev) => [...prev, data]);
    });

    socket.on("getText", (data) => {
      console.log("Data get text =>", data);
      setnotificationText(data);
    });
  }, [socket]);

  // socket io 5 client start to check
  const handleNotification = (post, userInfo, type) => {
    console.log("Sending notification to => ", post.userId.username);

    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: post.userId.username,
      type: type,
    });
  };
  // socket io 5 client finish to check

  const handleGetFavorites = () => {
    axios
      .get(`${API_URL}/favorite`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFavoriteWindow("");
        setPostWindow("hide");

        localStorage.setItem(
          "profileFavorites",
          JSON.stringify(response.data.favorites)
        );
        console.log("Profile favorites =>", response);
        setFavorites(response.data.favorites);
      })
      .catch((err) => {
        return err;
      });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShowPostsProfilePage = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFavoriteWindow("hide");
        setPostWindow("");

        localStorage.setItem(
          "profilePagePosts",
          JSON.stringify(response.data.posts)
        );
        console.log("Profile posts =>", response);
        setUserprofiledata(response.data.posts);
      })
      .catch((err) => {
        return err;
      });
  };

  const handleDeletePostFromProfilePage = (postId) => {
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
        if (favoriteWindow === "") {
          handleGetFavorites();
        } else if (postsWindow === "") {
          handleShowPostsProfilePage();
        }

        setError("");
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        setError(errorMessage);
      });
  };

  const handleShowDetailPostFromProfilePage = (postId) => {
    console.log(postId);
  };

  const handlePostLikesFromProfilePage = (postId) => {
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
        if (favoriteWindow === "") {
          setTimeout(() => {
            handleGetFavorites();
          }, 500);
        } else if (postsWindow === "") {
          setTimeout(() => {
            handleShowPostsProfilePage();
          }, 500);
        }

        const profilePagePosts = JSON.parse(
          localStorage.getItem("profilePagePosts")
        );
        const findedPost = profilePagePosts.find((eachPost) => {
          return eachPost._id === postId;
        });
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        userInfo.favorites.unshift(postId);
        // socket io test start to check
        handleNotification(findedPost, userInfo, "liked");
        // socket io test finish to check

        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        setError("");
      })
      .catch((error) => {
        console.log("Error =>", error);

        if (error) {
          const { errorMessage } = error.response.data;

          setError(errorMessage);
        }
      });
  };

  const handleDeleteLikeFromProfilePage = (postId) => {
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
        if (favoriteWindow === "") {
          setTimeout(() => {
            handleGetFavorites();
          }, 500);
        } else if (postsWindow === "") {
          setTimeout(() => {
            handleShowPostsProfilePage();
          }, 500);
        }
      })
      .catch((err) => {
        return err;
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

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

  const getCreatedDateForProfile = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${monthsProfile[getMonth]} ${createdAt.getDate()}`;
  };

  const handleRepost = (postId) => {
    console.log("ID =>", postId);

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
        // start to check
        // repost process for  user profile posts
        if (postsWindow === "hide") {
          console.log(
            "Am i seeing the new created reference post =>",
            response
          );

          const profileFavorites = JSON.parse(
            localStorage.getItem("profileFavorites")
          );

          const findedFavorite = favorites.find((element) => {
            return element._id === postId;
          });
          // socket io test start to check
          handleNotification(findedFavorite, userInfo, "repost");
          // socket io test finish to check
          const index2 = favorites.indexOf(findedFavorite);
          console.log("LINE 1 WORKING");
          profileFavorites[index2].reposted.unshift(userInfo._id);

          console.log("LINE 2 WORKING");

          localStorage.setItem(
            "profileFavorites",
            JSON.stringify(profileFavorites)
          );
          console.log("LINE 3 WORKING");

          setTimeout(() => {
            setFavorites(profileFavorites);
          }, 500);

          // finish to check
          console.log("LINE 4 WORKING");
        } else if (favoriteWindow === "hide") {
          const profilePosts = JSON.parse(
            localStorage.getItem("profilePagePosts")
          );

          const findedPost = profilePosts.find((element) => {
            return element._id === postId;
          });

          console.log("Finded post => ", findedPost);
          const index = profilePosts.indexOf(findedPost);
          const updateUserProfilePosts = () => {
            if (!findedPost.isReposted && !findedPost.reposted.length) {
              console.log(
                "Am i seeing the new created reference post =>",
                response
              );
              profilePosts[index].reposted.unshift(userInfo);
              profilePosts.unshift(response.data.newPost);
              // profilePosts[0].reposted.unshift(userInfo);
              const findedNewPost = profilePosts.find((eachPost) => {
                return eachPost._id === response.data.newPost._id;
              });
              const findIndexNewPost = profilePosts.indexOf(findedNewPost);
              profilePosts[findIndexNewPost].reposted.unshift(userInfo);
              localStorage.setItem(
                "profilePagePosts",
                JSON.stringify(profilePosts)
              );

              setUserprofiledata(profilePosts);
            } else if (!findedPost.isReposted && findedPost.reposted.length) {
              console.log(
                "Am i seeing the new created reference post 2 =>",
                response
              );
              profilePosts[index].reposted.unshift(userInfo);
              profilePosts.unshift(response.data.newPost);

              localStorage.setItem(
                "profilePagePosts",
                JSON.stringify(profilePosts)
              );

              setUserprofiledata(profilePosts);
            } else if (findedPost.isReposted && findedPost.reposted.length) {
              console.log("Here is working right now !");
            }
          };

          setTimeout(updateUserProfilePosts, 500);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteRepostProfilePage = (postId) => {
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
        if (postsWindow !== "hide") {
          console.log(
            "This line is working because now you are dealing with delete repost function inside posts"
          );
          console.log("You deleted repost !");

          const profilePagePosts = JSON.parse(
            localStorage.getItem("profilePagePosts")
          );

          const findedPost = profilePagePosts.find((eachPost) => {
            return eachPost._id === postId;
          });

          const findedPostIndex = profilePagePosts.indexOf(findedPost);

          console.log("Finded post index =>", findedPostIndex);
          const findedPostReposterIndex = findedPost
            ? findedPost.reposted.indexOf(userInfo._id)
            : null;
          if (findedPost ? findedPost.userId._id !== userInfo._id : null) {
            console.log("You reposted this post from another user !");

            profilePagePosts[findedPostIndex].reposted.splice(
              findedPostReposterIndex,
              1
            );
            const updateProfilePosts = () => {
              profilePagePosts[findedPostIndex].reposted.splice(
                findedPostReposterIndex,
                1
              );

              profilePagePosts.splice(findedPostIndex, 1);
              localStorage.setItem(
                "profilePagePosts",
                JSON.stringify(profilePagePosts)
              );

              setUserprofiledata(profilePagePosts);
            };

            setTimeout(updateProfilePosts, 500);
          } else {
            console.log("This is your post that you reposted !");
            if (findedPost.isReposted) {
              // delete reposter from original post
              console.log(findedPost);

              const originalPostId =
                findedPost.repostedFromThisOriginalPost[0]._id;

              const originalPost = profilePagePosts.find((eachPost) => {
                return eachPost._id === originalPostId;
              });

              const originalPostIndex = profilePagePosts.indexOf(originalPost);

              const reposter = profilePagePosts[
                originalPostIndex
              ].reposted.find((eachReposter) => {
                return eachReposter._id === userInfo._id;
              });

              const reposterIndex =
                profilePagePosts[originalPostIndex].reposted.indexOf(reposter);
              console.log(
                "Before =>",
                profilePagePosts[originalPostIndex].reposted
              );
              profilePagePosts[originalPostIndex].reposted.splice(
                reposterIndex,
                1
              );
              console.log(
                "After =>",
                profilePagePosts[originalPostIndex].reposted
              );

              const referencePostIndex = profilePagePosts.indexOf(findedPost);
              console.log("Reference post =>", referencePostIndex);

              const referenceReposter = profilePagePosts[
                referencePostIndex
              ].reposted.find((eachReposter) => {
                return eachReposter._id === userInfo._id;
              });

              const referenceReposterIndex =
                profilePagePosts[referencePostIndex].reposted.indexOf(
                  referenceReposter
                );

              console.log(referenceReposter);
              console.log(referenceReposterIndex);

              const updateProfilePosts = () => {
                profilePagePosts[referencePostIndex].reposted.splice(
                  referenceReposterIndex,
                  1
                );

                profilePagePosts.splice(referencePostIndex, 1);

                localStorage.setItem(
                  "profilePagePosts",
                  JSON.stringify(profilePagePosts)
                );

                setUserprofiledata(profilePagePosts);
              };

              setTimeout(updateProfilePosts, 500);
              console.log(originalPostId);
              console.log(originalPostIndex);
              console.log(reposter);
              console.log(reposterIndex);
            } else if (!findedPost.isReposted) {
              console.log("This post is original one");
              // find reference post
              const referencePost = profilePagePosts.find((eachPost) => {
                return (
                  eachPost.repostedFromThisOriginalPost[0]._id ===
                  findedPost._id
                );
              });
              const referencePostIndex =
                profilePagePosts.indexOf(referencePost);

              const findReposter = referencePost.reposted.find(
                (eachReposter) => {
                  return eachReposter._id === userInfo._id;
                }
              );

              const reposterIndex =
                profilePagePosts[referencePostIndex].reposted.indexOf(
                  findReposter
                );

              console.log("Reference post =>", referencePost);
              console.log("Reference post index =>", referencePostIndex);
              console.log("Reposter =>", findReposter);
              console.log("Reposter index =>", reposterIndex);

              const findedPostIndex = profilePagePosts.indexOf(findedPost);

              const reposter2 = profilePagePosts[findedPostIndex].reposted.find(
                (eachReposter) => {
                  return eachReposter._id === userInfo._id;
                }
              );

              const reposterIndex2 =
                profilePagePosts[findedPostIndex].reposted.indexOf(reposter2);

              profilePagePosts[findedPostIndex].reposted.splice(
                reposterIndex2,
                1
              );

              localStorage.setItem(
                "profilePagePosts",
                JSON.stringify(profilePagePosts)
              );
              // start to check basit settimeout animation
              const updateProfilePosts = () => {
                profilePagePosts[referencePostIndex].reposted.splice(
                  reposterIndex,
                  1
                );

                profilePagePosts.splice(referencePostIndex, 1);

                localStorage.setItem(
                  "profilePagePosts",
                  JSON.stringify(profilePagePosts)
                );

                setUserprofiledata(profilePagePosts);
              };

              setTimeout(updateProfilePosts, 500);
              // finish to check basit settimeout animation
            }
          }
        }

        if (favoriteWindow !== "hide") {
          console.log(
            "This line is working because now you are dealing with delete repost function inside favorites"
          );
          const profilePageFavorites = JSON.parse(
            localStorage.getItem("profileFavorites")
          );

          const findedFavorite = profilePageFavorites.find((eachPost) => {
            return eachPost._id === postId;
          });

          const findedFavoriteIndex =
            profilePageFavorites.indexOf(findedFavorite);

          console.log("Finded favorite index =>", findedFavoriteIndex);
          const findedFavoriteReposterIndex = findedFavorite
            ? findedFavorite.reposted.indexOf(userInfo._id)
            : null;
          if (findedFavorite ? findedFavorite.isReposted : null) {
            console.log("This post is reposted");

            const updateUserProfilePosts = () => {
              profilePageFavorites[findedFavoriteIndex].reposted.splice(
                findedFavoriteReposterIndex,
                1
              );

              localStorage.setItem(
                "profileFavorites",
                JSON.stringify(profilePageFavorites)
              );

              setFavorites(profilePageFavorites);
            };

            setTimeout(updateUserProfilePosts, 500);
          } else {
            console.log("This post is not reposted");
            const updateUserProfilePosts = () => {
              profilePageFavorites[findedFavoriteIndex].reposted.splice(
                findedFavoriteReposterIndex,
                1
              );

              localStorage.setItem(
                "profileFavorites",
                JSON.stringify(profilePageFavorites)
              );

              setFavorites(profilePageFavorites);
            };

            setTimeout(updateUserProfilePosts, 500);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log("FILE FROM PROFILE PICTURE PROCESS =>", file);
    setFileToBase(file);
    console.log(file);
    console.log("PROFILE IMAGE CURRENT INSIDE HANDLEIMAGE=>", profileImage);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    console.log("SET FILE TO BASE FILE =>", file);

    reader.onloadend = () => {
      setprofileImage(reader.result);

      console.log(
        "PROFILE IMAGE CURRENT INSIDE SETFILETOBASE=>",
        reader.result.slice(0, 21)
      );
    };
  };
  console.log("PROFILE IMAGE CURRENT GLOBAL PAGE=>", profileImage.slice(0, 21));

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
        console.log("RESPONSE AFTER POST PROFILE IMAGE =>", response);
        console.log(
          "WE SEND THIS PROFILE IMAGE FROM BODY TO SERVER =>",
          profileImage.slice(0, 21)
        );

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log(userInfo.imageUrl);

        console.log(`"${response.data.url}"`);
        userInfo.imageUrl = response.data.url;

        const updatedUserInfo = userInfo;
        console.log(updatedUserInfo);
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        setcompletedProfileImage(true);

        navigate("/profile");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setLoadingTrue = () => {
    setIsLoading(true);
  };

  const setLoadingFalse = () => {
    setIsLoading(false);
  };

  const getRepostedIds = (array) => {
    return array.reposted.map((eachRepost) => {
      return eachRepost._id;
    });
  };

  useEffect(() => {
    if (postsWindow === "hide") {
      handleGetFavorites();
    } else if (favoriteWindow === "hide") {
      handleShowPostsProfilePage();
    }
    changeProfileImage();
  }, [profileImage, postsWindow, favoriteWindow]);

  return (
    <>
      <ResponsiveNavigationBarBottom />

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
            <nav className="nav-bar-home ">
              <Link to="/home">
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

              <div className="inner-div inner-div-fonts">
                <Link to="/home" onClick={redirectHomePage}>
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

                <Link href="">
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
                  refreshPosts={() => handleShowPostsProfilePage()}
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
            className={`main-column`}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <Container>
              <Row>
                <Stack direction="horizontal" gap={0}>
                  {/* start to check  */}
                  <div
                    onClick={handleGoBack}
                    className="p-2 arrow"
                    style={{
                      position: "relative",
                      bottom: "15px",
                      width: "30px",
                      height: " 30px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        border: "none",
                        left: "5px",
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
                  </div>

                  {/* finish to check  */}

                  <div
                    className="p-2"
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      height: "100px",
                    }}
                  >
                    <div>{userInfo.username}</div>
                    <div className="profile-paragraph">
                      {userInfo.posts.length} posts
                    </div>
                  </div>
                </Stack>
                {/* start to check */}

                <Stack
                  direction="horizontal"
                  gap={0}
                  style={{ marginTop: "45px" }}
                >
                  <div className="p-2">
                    {userInfo.imageUrl.slice(0, 3) !== "../" ? (
                      <>
                        <div>
                          <img
                            style={{
                              cursor: "pointer",
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
                            onChange={handleImage}
                            type="file"
                            id="formuploadModal-profile-image"
                            name="modalImage"
                            className="form-control"
                            style={{ display: "none" }}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="133"
                          height="133"
                          fill="rgb(83, 100, 113)"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                          style={{ cursor: "pointer" }}
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
                </Stack>

                {/* finish to check */}
                <div style={{ lineHeight: "30px", marginBottom: "20px" }}>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      marginTop: "50px",
                    }}
                  >
                    {userInfo.username}
                  </div>
                  <div style={{ color: "rgb(83, 100, 113)" }}>
                    @{userInfo.username}
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-calendar4-week"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
                      <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                    </svg>{" "}
                    Joined {getCreatedDateForProfile(userInfo.createdAt)}
                  </div>
                  <div>
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "15px",
                        lineHeight: "20px",
                      }}
                    >
                      {userInfo.following && (
                        <span>{userInfo.following.length}</span>
                      )}
                    </span>{" "}
                    <span
                      style={{
                        color: "rgb(83, 100, 113)",
                        fontSize: "14px",
                        lineHeight: "16px",
                        fontWeight: "400",
                      }}
                    >
                      Following
                    </span>{" "}
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "15px",
                        lineHeight: "20px",
                      }}
                    >
                      {userInfo.followers && (
                        <span>{userInfo.followers.length}</span>
                      )}
                    </span>{" "}
                    <span
                      style={{
                        color: "rgb(83, 100, 113)",
                        fontSize: "14px",
                        lineHeight: "16px",
                        fontWeight: "400",
                      }}
                    >
                      Followers
                    </span>
                  </div>
                </div>
              </Row>
            </Container>
            <Row
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></Row>
            <ButtonGroup
              aria-label="Basic example"
              style={{
                display: "flex",
              }}
            >
              <Button
                onClick={() => handleShowPostsProfilePage()}
                variant="secondary"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "none",
                  borderRight: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                {favoriteWindow === "" ? (
                  <span>Posts</span>
                ) : (
                  <span style={{ color: "rgb(29, 155, 240)" }}>Posts</span>
                )}
              </Button>
              <Button
                onClick={() => handleGetFavorites()}
                variant="secondary"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "none",
                  borderLeft: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                {favoriteWindow === "" ? (
                  <span
                    style={{
                      color: "rgb(29, 155, 240)",
                    }}
                  >
                    Likes
                  </span>
                ) : (
                  <span>Likes </span>
                )}
              </Button>
            </ButtonGroup>
            {!userprofiledata.length && postsWindow === "" ? (
              <Row
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              ></Row>
            ) : null}

            {!favorites.length && favoriteWindow === "" ? (
              <Row
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              ></Row>
            ) : null}

            <span>{isLoading ? <LoadingSpinner></LoadingSpinner> : ""}</span>
            {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}
            <div className={`all-posts ${postsWindow}`}>
              {userprofiledata.map((post) => (
                <div key={post._id}>
                  <Row
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                    }}
                  ></Row>

                  {getRepostedIds(post).includes(userInfo._id) &&
                  post.isReposted ? (
                    <svg
                      style={{
                        marginLeft: "20px",
                      }}
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
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
                  ) : null}
                  {getRepostedIds(post).includes(userInfo._id) &&
                  post.isReposted ? (
                    <span
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        fontWeight: "700",
                        color: "rgb(83, 100, 113)",
                        marginLeft: "10px",
                      }}
                    >
                      You reposted
                    </span>
                  ) : null}
                  <div className="posts-details">
                    <div className="post-head">
                      <Stack direction="horizontal" gap={1}>
                        {/* profile image start to check */}
                        <div className="p-1">
                          {post.userId ? (
                            <Link
                              onClick={() =>
                                redirectSpesificProfilePage(post.userId._id)
                              }
                              style={{ cursor: "pointer" }}
                              to={`/profile/${post ? post.userId._id : null}`}
                            >
                              <img
                                width={40}
                                height={40}
                                src={post.userId.imageUrl}
                                alt=""
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
                        {/* profile image finish to check  */}

                        {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                        <div className="p-1">
                          {post.userId ? (
                            <>
                              <Link
                                onClick={() =>
                                  redirectSpesificProfilePage(post.userId._id)
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
                                  redirectSpesificProfilePage(post.userId._id)
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
                                      : post.repostedFromThisOriginalPost[0]._id
                                  )
                                }
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
                            {post.userId && post.userId._id !== userInfo._id ? (
                              <svg
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "rgb(29, 155, 240)",
                                }}
                                onClick={() =>
                                  handleShowDetailPostFromProfilePage(post._id)
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
                                  handleDeletePostFromProfilePage(post._id)
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
                    </div>

                    {/* post content start to check  */}
                    <Stack direction="vertical" gap={1}>
                      <Link
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
                            fontSize: "17px",
                            fontWeight: "400",
                            lineHeight: "24px",
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
                          to={`/${post.userId.username}/status/${
                            !post.isReposted
                              ? post._id
                              : post.repostedFromThisOriginalPost[0]
                          }/photo/${22}`}
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
                        <CommentModal post={post} />
                      </div>

                      {/* start to check */}
                      <div className="p-1">
                        {getRepostedIds(post).includes(userInfo._id) ? (
                          <svg
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleDeleteRepostProfilePage(post._id)
                            }
                            width={`${1.25}em`}
                            height={`${1.25}em`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                            color="rgb(0, 186, 124)"
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
                        ) : (
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
                        )}

                        {getRepostedIds(post).includes(userInfo._id) ? (
                          <span
                            className="post-description"
                            style={{
                              color: "rgb(0, 186, 124)",
                            }}
                          >
                            {post.reposted.length}
                          </span>
                        ) : (
                          <span
                            className="post-description"
                            style={{
                              color: "rgb(83, 100, 113)",
                            }}
                          >
                            {post.reposted.length ? (
                              <span>{post.reposted.length}</span>
                            ) : null}
                          </span>
                        )}

                        {/* start  */}
                      </div>

                      {/* finish to check  */}
                      <div className="p-1">
                        <div>
                          {post.likes.includes(userInfo._id) ? (
                            <div>
                              <svg
                                onClick={() =>
                                  handleDeleteLikeFromProfilePage(post._id)
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
                                onClick={() =>
                                  handlePostLikesFromProfilePage(post._id)
                                }
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
                    </Stack>
                    {/* new version favorite repost comment finish to check */}
                  </div>
                </div>
              ))}
            </div>

            <div className={`${favoriteWindow} all-favorites`}>
              {favorites.map((favorite) => (
                <div key={favorite._id}>
                  <Row
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                    }}
                  ></Row>

                  <div className="favorite-details">
                    <div className="favorite-head">
                      <Stack direction="horizontal" gap={1}>
                        {/* profile image start to check */}
                        <div className="p-1">
                          {favorite.userId ? (
                            <Link
                              onClick={() =>
                                redirectSpesificProfilePage(favorite.userId._id)
                              }
                              style={{ cursor: "pointer" }}
                              to={`/profile/${
                                favorite ? favorite.userId._id : null
                              }`}
                            >
                              <img
                                width={40}
                                height={40}
                                src={favorite.userId.imageUrl}
                                alt=""
                              />
                            </Link>
                          ) : (
                            <Link
                              onClick={() =>
                                redirectSpesificProfilePage(favorite.userId._id)
                              }
                              to={`/profile/${
                                favorite.userId ? favorite.userId._id : null
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
                        {/* profile image finish to check  */}

                        {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                        <div className="p-1">
                          {favorite.userId ? (
                            <>
                              <Link
                                onClick={() =>
                                  redirectSpesificProfilePage(
                                    favorite.userId._id
                                  )
                                }
                                to={`/profile/${favorite.userId._id}`}
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
                                  {favorite.authorFullName}
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
                                    favorite.userId._id
                                  )
                                }
                                to={`/profile/${favorite.userId._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "rgb(83, 100, 113)",
                                  lineHeight: "20px",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                }}
                              >
                                <span>
                                  <span>@{favorite.authorUserName}</span>
                                </span>
                              </Link>
                              <Link
                                onClick={() =>
                                  redirectToPostDetailPage(
                                    favorite.userId.username,
                                    !favorite.isReposted
                                      ? favorite._id
                                      : favorite.repostedFromThisOriginalPost[0]
                                          ._id
                                  )
                                }
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
                                    {getCreatedDate(favorite.createdAt)}
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
                            {favorite.userId &&
                            favorite.userId._id !== userInfo._id ? (
                              <svg
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "rgb(29, 155, 240)",
                                }}
                                onClick={() =>
                                  handleShowDetailPostFromProfilePage(
                                    favorite._id
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
                                  handleDeletePostFromProfilePage(favorite._id)
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
                    </div>
                    {/* post content start to check  */}
                    <Stack direction="vertical" gap={1}>
                      <Link
                        onClick={() =>
                          redirectToPostDetailPage(
                            favorite.userId.username,
                            !favorite.isReposted
                              ? favorite._id
                              : favorite.repostedFromThisOriginalPost[0]._id
                          )
                        }
                        style={{
                          textDecoration: "none",
                          color: "rgb(15, 20, 25)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "17px",
                            fontWeight: "400",
                            lineHeight: "24px",
                            overflowWrap: "break-word",
                            maxWidth: "100%",
                          }}
                          className="p-2"
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
                          to={`/${favorite.userId.username}/status/${
                            !favorite.isReposted
                              ? favorite._id
                              : favorite.repostedFromThisOriginalPost[0]
                          }/photo/${22}`}
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
                              src={favorite.image.url}
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
                        <CommentModal post={favorite} />
                      </div>

                      {/* start to check */}
                      <div className="p-1">
                        {favorite.reposted.includes(userInfo._id) ? (
                          <svg
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleDeleteRepostProfilePage(favorite._id)
                            }
                            width={`${1.25}em`}
                            height={`${1.25}em`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                            color="rgb(0, 186, 124)"
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
                        ) : (
                          <svg
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => handleRepost(favorite._id)}
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
                        )}

                        {favorite.reposted.includes(userInfo._id) ? (
                          <span
                            className="post-description"
                            style={{
                              color: "rgb(0, 186, 124)",
                            }}
                          >
                            {favorite.reposted.length}
                          </span>
                        ) : (
                          <span
                            className="post-description"
                            style={{
                              color: "rgb(83, 100, 113)",
                            }}
                          >
                            {favorite.reposted.length ? (
                              <span>{favorite.reposted.length}</span>
                            ) : null}
                          </span>
                        )}

                        {/* start  */}
                      </div>

                      {/* finish to check  */}
                      <div className="p-1">
                        <div>
                          {favorite.likes.includes(userInfo._id) ? (
                            <div>
                              <svg
                                onClick={() =>
                                  handleDeleteLikeFromProfilePage(favorite._id)
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
                                {favorite.likes.length ? (
                                  <span
                                    style={{
                                      color: "rgb(249, 24, 128)",
                                    }}
                                  >
                                    {favorite.likes.length}
                                  </span>
                                ) : null}
                              </span>
                            </div>
                          ) : (
                            <div>
                              {" "}
                              <svg
                                onClick={() =>
                                  handlePostLikesFromProfilePage(favorite._id)
                                }
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
                                {favorite.likes.length ? (
                                  <span>{favorite.likes.length}</span>
                                ) : null}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Stack>
                    {/* new version favorite repost comment finish to check */}
                  </div>
                </div>
              ))}
            </div>

            {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}
          </Col>

          {/* 3.column burası olucak  */}
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

export default UserProfile;
