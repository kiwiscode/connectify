import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Stack, Accordion } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostModal, LogoutModal, CommentModal } from "../components/ui/Modal";
import { UserContext } from "../context/UserContext";
import { Bounce, ToastContainer, toast } from "react-toastify";
import CustomNotification from "../components/Notifications/CustomNotification";
import PostEngagements from "../components/ui/PostEngagementsModal";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
import io from "socket.io-client";

function PostDetailPage() {
  const socket = io.connect(`${API_URL}`);
  const { postOwner, postId } = useParams();
  const [detailedPost, setdetailedPost] = useState([]);
  // const { userInfo, getToken, socket } = useContext(UserContext);
  const { userInfo, getToken } = useContext(UserContext);
  const [commentedForThisPost, setcommentedForThisPost] = useState([]);
  const [commentedForThisUsersPost, setcommentedForThisUsersPost] = useState(
    []
  );
  const [postDetailPostId, setpostDetailPostId] = useState("");

  const [shouldHide, setshouldHide] = useState(true);

  // socket io 1 client start to check
  const [notificationTest, setnotificationTest] = useState([]);
  const [notificationText, setnotificationText] = useState([]);
  // socket io 1 client finish to check

  // socket io 4 client start to check
  useEffect(() => {
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

  // start to check
  const navigate = useNavigate();

  const redirectSpesificProfilePage = (userId) => {
    navigate(`/profile/${userId}`);
    // window.location.reload();
  };

  const redirectPostDetailPage = (postOwnerName, postId) => {
    navigate(`/${postOwnerName}/status/${postId}`);
    // window.location.reload();
  };

  const redirectToImagePostDetailPage = (postOwnerName, postId) => {
    navigate(`/${postOwnerName}/status/${postId}/photo/1`);
    // window.location.reload();
  };
  // finish to check

  // socket io 5 client start to check
  const handleNotification = (post, userInfo, type) => {
    console.log("Sending notification to => ", post.userId.username);

    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: post.userId.username,
      type: type,
      contactHasBeenMade: post,
      senderInfo: userInfo,
    });
  };
  // socket io 5 client finish to check

  const handleGoBack = () => {
    navigate(-1);
  };

  const refreshPostDetailPage = () => {
    axios
      .get(`${API_URL}/${postOwner}/status/${postId}`)
      .then((response) => {
        const { detailedPost } = response.data;
        if (detailedPost.isComment) {
          setcommentedForThisPost(detailedPost.commentedForThisPost);
          setcommentedForThisUsersPost(detailedPost.commentedForThisUsersPost);
        }
        setdetailedPost(detailedPost);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePostLikesPostDetailPage = (postId) => {
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
        const posts = JSON.parse(localStorage.getItem("mainPagePosts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });

        const findedPostIndex = posts.indexOf(findedPost);

        const updateDetailedPosts = () => {
          // socket io test start to check
          handleNotification(findedPost, userInfo, "liked");
          // socket io test finish to check
          // posts[findedPostIndex].likes.unshift(userInfo);

          localStorage.setItem("mainPagePosts", JSON.stringify(posts));
          if (findedPost.isComment) {
            const detailedPostComment = detailedPost.comments.find(
              (eachComment) => {
                return eachComment.postId === postId;
              }
            );

            const detailedPostCommentIndex =
              detailedPost.comments.indexOf(detailedPostComment);

            setdetailedPost((prevDetailedPost) => {
              const updatedDetailedPost = { ...prevDetailedPost };

              if (updatedDetailedPost.comments.length > 0) {
                const targetComment =
                  updatedDetailedPost.comments[detailedPostCommentIndex];

                if (targetComment) {
                  targetComment.likes.unshift(userInfo);
                } else {
                  updatedDetailedPost.likes.unshift(userInfo);
                }
              } else {
                updatedDetailedPost.likes.unshift(userInfo);
              }

              return updatedDetailedPost;
            });
          } else {
            setdetailedPost((prevDetailedPost) => {
              const updatedDetailedPost = { ...prevDetailedPost };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedDetailedPost.likes.unshift(userInfo);

              return updatedDetailedPost;
            });
            // setcommentedForThisPost(findedPost);

            // setcommentedForThisUsersPost(
            //   detailedPost.commentedForThisUsersPost
            // );
          }
        };

        setTimeout(updateDetailedPosts, 500);
      })
      .catch((error) => {
        if (error.response) {
          const { errorMessage } = error.response.data;

          console.log("Error =>", errorMessage);
        }
      });
  };

  const handleDeleteLikePostDetailPage = (postId) => {
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
        const posts = JSON.parse(localStorage.getItem("mainPagePosts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });

        const liker = findedPost.likes
          ? findedPost.likes.find((eachLiker) => eachLiker._id === userInfo._id)
          : null;
        const likerIndex = findedPost.likes.indexOf(liker);

        const updateDetailedPosts = () => {
          findedPost.likes.splice(likerIndex, 1);

          localStorage.setItem("mainPagePosts", JSON.stringify(posts));

          if (findedPost.isComment) {
            const detailedPostComment = detailedPost.comments.find(
              (eachComment) => {
                return eachComment.postId === postId;
              }
            );

            const detailedPostCommentIndex =
              detailedPost.comments.indexOf(detailedPostComment);

            // let activeUserInsideLikes;
            // let activeUserIndexInsideLikes;
            // if (detailedPost.comments.length) {
            //   activeUserInsideLikes = detailedPost.comments[
            //     detailedPostCommentIndex
            //   ].likes.find((eachLiker) => {
            //     return eachLiker._id === userInfo._id;
            //   });

            //   activeUserIndexInsideLikes = detailedPost.comments[
            //     detailedPostCommentIndex
            //   ].likes.indexOf(activeUserInsideLikes);
            // } else {
            //   activeUserInsideLikes = detailedPost.likes.find((eachLiker) => {
            //     return eachLiker._id === userInfo._id;
            //   });

            //   activeUserIndexInsideLikes = detailedPost.likes.indexOf(
            //     activeUserInsideLikes
            //   );
            // }

            let activeUserInsideLikes;
            let activeUserIndexInsideLikes;

            if (detailedPost.comments.length > 0) {
              // Eğer comments array'i boş değilse
              const targetComment =
                detailedPost.comments[detailedPostCommentIndex];

              if (targetComment) {
                // Eğer hedeflenen yorum varsa, yorumun likes array'indeki kullanıcıyı bul
                activeUserInsideLikes = targetComment.likes.find(
                  (eachLiker) => eachLiker._id === userInfo._id
                );

                // Bulunan kullanıcının index'ini bul
                activeUserIndexInsideLikes = targetComment.likes.indexOf(
                  activeUserInsideLikes
                );
              }
            } else {
              // Eğer comments array'i boşsa, detailedPost.likes array'indeki kullanıcıyı bul
              activeUserInsideLikes = detailedPost.likes.find(
                (eachLiker) => eachLiker._id === userInfo._id
              );

              // Bulunan kullanıcının index'ini bul
              activeUserIndexInsideLikes = detailedPost.likes.indexOf(
                activeUserInsideLikes
              );
            }

            setdetailedPost((prevDetailedPost) => {
              const updatedDetailedPost = { ...prevDetailedPost };

              if (updatedDetailedPost.comments.length > 0) {
                const targetComment =
                  updatedDetailedPost.comments[detailedPostCommentIndex];

                if (targetComment) {
                  targetComment.likes.splice(activeUserIndexInsideLikes, 1);
                } else {
                  updatedDetailedPost.likes.splice(
                    activeUserIndexInsideLikes,
                    1
                  );
                }
              } else {
                updatedDetailedPost.likes.splice(activeUserIndexInsideLikes, 1);
              }

              return updatedDetailedPost;
            });
          } else {
            const activeUserInsideLikes = detailedPost.likes.find(
              (eachLiker) => {
                return eachLiker._id === userInfo._id;
              }
            );

            const activeUserIndexInsideLikes = detailedPost.likes.indexOf(
              activeUserInsideLikes
            );

            setdetailedPost((prevDetailedPost) => {
              const updatedDetailedPost = { ...prevDetailedPost };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedDetailedPost.likes.splice(activeUserIndexInsideLikes, 1);

              return updatedDetailedPost;
            });

            // setcommentedForThisPost(findedPost);
            // setcommentedForThisUsersPost(
            //   detailedPost.commentedForThisUsersPost
            // );
          }
        };

        setTimeout(updateDetailedPosts, 500);
      })
      .catch((err) => {
        return err;
      });
  };

  const handleRepost = (postId) => {
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
        const posts = JSON.parse(localStorage.getItem("mainPagePosts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });

        const index = posts.indexOf(findedPost);

        const updateDetailedPosts = () => {
          // socket io test start to check
          handleNotification(findedPost, userInfo, "repost");
          // socket io test finish to check

          posts[index].reposted.unshift(userInfo);

          localStorage.setItem("mainPagePosts", JSON.stringify(posts));

          if (findedPost.isComment) {
            const detailedPostComment = detailedPost.comments.find(
              (eachComment) => {
                return eachComment.postId === postId;
              }
            );

            const detailedPostCommentIndex =
              detailedPost.comments.indexOf(detailedPostComment);

            setdetailedPost((prevDetailedPost) => {
              const updatedDetailedPost = { ...prevDetailedPost };

              if (detailedPost.comments.length > 0) {
                const targetComment =
                  updatedDetailedPost.comments[detailedPostCommentIndex];
                if (targetComment) {
                  targetComment.reposted.unshift(userInfo);
                } else {
                  updatedDetailedPost.reposted.unshift(userInfo);
                }
              } else {
                updatedDetailedPost.reposted.unshift(userInfo);
              }

              return updatedDetailedPost;
            });
          } else {
            setdetailedPost((prevDetailedPost) => {
              const updatedDetailedPost = { ...prevDetailedPost };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedDetailedPost.reposted.unshift(userInfo);

              return updatedDetailedPost;
            });

            // setcommentedForThisPost(findedPost);
            // setcommentedForThisUsersPost(
            //   detailedPost.commentedForThisUsersPost
            // );
          }
        };

        setTimeout(updateDetailedPosts, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteRepostPostDetailPage = (postId) => {
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
        const posts = JSON.parse(localStorage.getItem("mainPagePosts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });
        let reposter;

        if (findedPost.reposted.length) {
          reposter = findedPost.reposted
            ? findedPost.reposted.find((eachReposter) => {
                return eachReposter._id === userInfo._id;
              })
            : null;
        }

        const reposterIndex = findedPost.reposted
          ? findedPost.reposted.indexOf(reposter)
          : null;

        const updateDetailedPosts = () => {
          findedPost.reposted.splice(reposterIndex, 1);

          localStorage.setItem("mainPagePosts", JSON.stringify(posts));

          if (findedPost.isComment) {
            const detailedPostComment = detailedPost.comments.find(
              (eachComment) => {
                return eachComment.postId === postId;
              }
            );

            const detailedPostCommentIndex =
              detailedPost.comments.indexOf(detailedPostComment);

            let activeUserInsideReposts;
            let activeUserIndexInsideReposts;
            if (detailedPost.comments.length) {
              // Eğer comments array'i boş değilse
              const targetComment =
                detailedPost.comments[detailedPostCommentIndex];

              if (targetComment) {
                // Eğer hedeflenen yorum varsa, yorumun likes array'indeki kullanıcıyı bul
                activeUserInsideReposts = targetComment.reposted.find(
                  (eachLiker) => eachLiker._id === userInfo._id
                );

                // Bulunan kullanıcının index'ini bul
                activeUserIndexInsideReposts = targetComment.reposted.indexOf(
                  activeUserInsideReposts
                );
              }
            } else {
              // Eğer comments array'i boşsa, detailedPost.likes array'indeki kullanıcıyı bul
              activeUserInsideReposts = detailedPost.reposted.find(
                (eachLiker) => eachLiker._id === userInfo._id
              );

              // Bulunan kullanıcının index'ini bul
              activeUserIndexInsideReposts = detailedPost.reposted.indexOf(
                activeUserInsideReposts
              );
            }

            setdetailedPost((prevDetailedPost) => {
              const updatedDetailedPost = { ...prevDetailedPost };

              if (updatedDetailedPost.comments.length > 0) {
                const targetComment =
                  updatedDetailedPost.comments[detailedPostCommentIndex];

                if (targetComment) {
                  targetComment.reposted.splice(
                    activeUserIndexInsideReposts,
                    1
                  );
                } else {
                  updatedDetailedPost.reposted.splice(
                    activeUserIndexInsideReposts,
                    1
                  );
                }
              } else {
                updatedDetailedPost.reposted.splice(
                  activeUserIndexInsideReposts,
                  1
                );
              }

              return updatedDetailedPost;
            });
          } else {
            const activeUserInsideReposts = detailedPost.reposted.find(
              (eachLiker) => {
                return eachLiker._id === userInfo._id;
              }
            );

            const activeUserIndexInsideReposts = detailedPost.reposted.indexOf(
              activeUserInsideReposts
            );

            setdetailedPost((prevDetailedPost) => {
              const updatedDetailedPost = { ...prevDetailedPost };

              // İlgili comment'e ulaş ve reposted array'ine yeni like'ı ekle
              updatedDetailedPost.reposted.splice(
                activeUserIndexInsideReposts,
                1
              );

              return updatedDetailedPost;
            });
          }
        };

        setTimeout(updateDetailedPosts, 500);
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePostLikesPostDetailPageCFTUP = (postId) => {
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
        const posts = JSON.parse(localStorage.getItem("mainPagePosts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });

        const findedPostIndex = posts.indexOf(findedPost);

        const updateDetailedPosts = () => {
          // socket io test start to check
          handleNotification(findedPost, userInfo, "liked");
          // socket io test finish to check
          // posts[findedPostIndex].likes.unshift(userInfo);

          localStorage.setItem("mainPagePosts", JSON.stringify(posts));
          if (findedPost.isComment) {
            setcommentedForThisPost((prevDetailedPost) => {
              const updatedDetailedPost = { ...prevDetailedPost };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedDetailedPost.likes.unshift(userInfo);

              return updatedDetailedPost;
            });
          } else {
            setcommentedForThisPost((prevCommentedForThisPost) => {
              const updatedCommentedForThisPost = {
                ...prevCommentedForThisPost,
              };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedCommentedForThisPost.likes.unshift(userInfo);

              return updatedCommentedForThisPost;
            });

            // setcommentedForThisPost(findedPost);

            // setcommentedForThisUsersPost(
            //   commentedForThisPost.commentedForThisUsersPost
            // );
          }
        };

        setTimeout(updateDetailedPosts, 500);
      })
      .catch((error) => {
        if (error.response) {
          const { errorMessage } = error.response.data;

          console.log("Error =>", errorMessage);
        }
      });
  };

  const handleRepostCFTUP = (postId) => {
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
        const posts = JSON.parse(localStorage.getItem("mainPagePosts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });

        const index = posts.indexOf(findedPost);

        const updateDetailedPosts = () => {
          // socket io test start to check
          handleNotification(findedPost, userInfo, "repost");
          // socket io test finish to check

          posts[index].reposted.unshift(userInfo);

          localStorage.setItem("mainPagePosts", JSON.stringify(posts));

          if (findedPost.isComment) {
            setcommentedForThisPost((prevCommentedForThisPost) => {
              const updatedCommentedForThisPost = {
                ...prevCommentedForThisPost,
              };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedCommentedForThisPost.reposted.unshift(userInfo);

              return updatedCommentedForThisPost;
            });
          } else {
            setcommentedForThisPost((prevCommentedForThisPost) => {
              const updatedCommentedForThisPost = {
                ...prevCommentedForThisPost,
              };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedCommentedForThisPost.reposted.unshift(userInfo);

              return updatedCommentedForThisPost;
            });

            // setcommentedForThisPost(findedPost);
            // setcommentedForThisUsersPost(
            //   detailedPost.commentedForThisUsersPost
            // );
          }
        };

        setTimeout(updateDetailedPosts, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeImage = () => {
    navigate(-1);
    // window.location.reload();
  };

  const handleDeleteLikePostDetailPageCFTUP = (postId) => {
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
        const posts = JSON.parse(localStorage.getItem("mainPagePosts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });

        const liker = findedPost.likes
          ? findedPost.likes.find((eachLiker) => eachLiker._id === userInfo._id)
          : null;
        const likerIndex = findedPost.likes.indexOf(liker);

        const updateDetailedPosts = () => {
          findedPost.likes.splice(likerIndex, 1);

          localStorage.setItem("mainPagePosts", JSON.stringify(posts));

          const activeUserInsideLikes = commentedForThisPost.likes.find(
            (eachLiker) => {
              return eachLiker._id === userInfo._id;
            }
          );

          const activeUserIndexInsideLikes = commentedForThisPost.likes.indexOf(
            activeUserInsideLikes
          );

          if (findedPost.isComment) {
            setcommentedForThisPost((prevDetailedPost) => {
              const updatedCommentedForThisPost = { ...prevDetailedPost };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedCommentedForThisPost.likes.splice(
                activeUserIndexInsideLikes,
                1
              );

              return updatedCommentedForThisPost;
            });
          } else {
            setcommentedForThisPost((prevDetailedPost) => {
              const updatedCommentedForThisPost = { ...prevDetailedPost };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedCommentedForThisPost.likes.splice(
                activeUserIndexInsideLikes,
                1
              );

              return updatedCommentedForThisPost;
            });

            // setcommentedForThisPost(findedPost);
            // setcommentedForThisUsersPost(
            //   detailedPost.commentedForThisUsersPost
            // );
          }
        };

        setTimeout(updateDetailedPosts, 500);
      })
      .catch((err) => {
        return err;
      });
  };

  const handleDeleteRepostPostDetailPageCFTUP = (postId) => {
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
        const posts = JSON.parse(localStorage.getItem("mainPagePosts"));

        const findedPost = posts.find((element) => {
          return element._id === postId;
        });

        const reposter = findedPost.reposted
          ? findedPost.reposted.find((eachReposter) => {
              return eachReposter._id === userInfo._id;
            })
          : null;

        const reposterIndex = findedPost.reposted
          ? findedPost.reposted.indexOf(reposter)
          : null;

        const updateDetailedPosts = () => {
          findedPost.reposted.splice(reposterIndex, 1);

          localStorage.setItem("mainPagePosts", JSON.stringify(posts));
          const activeUserInsideReposts = commentedForThisPost.reposted.find(
            (eachReposter) => {
              return eachReposter._id === userInfo._id;
            }
          );

          const activeUserIndexInsideReposts =
            commentedForThisPost.reposted.indexOf(activeUserInsideReposts);

          if (findedPost.isComment) {
            setcommentedForThisPost((prevDetailedPost) => {
              const updatedCommentedForThisPost = { ...prevDetailedPost };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedCommentedForThisPost.reposted.splice(
                activeUserIndexInsideReposts,
                1
              );

              return updatedCommentedForThisPost;
            });
          } else {
            setcommentedForThisPost((prevDetailedPost) => {
              const updatedCommentedForThisPost = { ...prevDetailedPost };

              // İlgili comment'e ulaş ve likes array'ine yeni like'ı ekle
              updatedCommentedForThisPost.reposted.splice(
                activeUserIndexInsideReposts,
                1
              );

              return updatedCommentedForThisPost;
            });

            // setcommentedForThisPost(findedPost);
            // setcommentedForThisUsersPost(
            //   detailedPost.commentedForThisUsersPost
            // );
          }
        };

        setTimeout(updateDetailedPosts, 500);
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeletePostPostDetailPage = (postId) => {
    setpostDetailPostId(postId);
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
          refreshPostDetailPage();
        }, 500);
      })
      .catch((error) => {
        const { errorMessage } = error.response.data;

        console.log("Error =>", errorMessage);
      });
  };

  const getRepostedIds = (array) => {
    return array.reposted.map((eachRepost) => {
      return eachRepost._id;
    });
  };

  const getLikerIds = (array) => {
    if (array.likes) {
      return array.likes.map((eachLiker) => {
        return eachLiker._id;
      });
    }
  };
  useEffect(() => {
    axios
      .get(`${API_URL}/${postOwner}/status/${postId}`)
      .then((response) => {
        const { detailedPost } = response.data;
        if (detailedPost.isComment) {
          setcommentedForThisPost(detailedPost.commentedForThisPost);
          setcommentedForThisUsersPost(detailedPost.commentedForThisUsersPost);
        }
        setdetailedPost(detailedPost);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const checkIds = (arr) => {
    if (arr.length) {
      return arr.map((eachItem) => {
        return eachItem._id;
      });
    }
  };

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

  const handleShowDetailPostFromPostDetailPage = (postId) => {
    console.log(postId);
  };

  const handleFollowingNotification = (selectedUser, userInfo, type) => {
    socket.emit("sendNotification", {
      senderName: userInfo.username,
      receiverName: selectedUser.username,
      type: type,
      contactHasBeenMade: selectedUser,
      senderInfo: userInfo,
    });
  };
  return (
    <>
      <ToastContainer />
      <Container style={{}} fluid>
        <Row
          style={{
            height: "100vh",
            borderTop: "none",
            borderBottom: "none",
          }}
        >
          <Col
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={12} // 768px - 992px aralığı
            lg={8} // 1200px - 1400px aralığı
            xxl={9} // 1400px ve sonrası aralığı
            // className={`main-column`}
            style={{
              justify: "left",
              backgroundColor: "black", // 0.5 opaklık
            }}
          >
            <div
              style={{
                padding: "16px",
              }}
            >
              <div>
                <div style={{ position: "relative" }}>
                  <div
                    className="target"
                    style={{
                      position: "absolute",
                      top: "10px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "rgba(15, 15, 15, 0.9) ",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={closeImage}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        color: "white",
                        fontSize: "22px",
                      }}
                    >
                      &times;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position: "relative", top: "5%" }}>
              {/* post content + post created date start to check */}
              <div
                style={{
                  maxWidth: "100%",
                }}
                className="p-1"
              >
                <span>
                  {detailedPost.image ? (
                    detailedPost.image.url.slice(0, 3) !== "ima" ? (
                      <>
                        <Link
                          to={`/${detailedPost.authorUserName}/status/${
                            !detailedPost.isReposted
                              ? detailedPost._id
                              : detailedPost.repostedFromThisOriginalPost[0]._id
                          }/photo/${1}`}
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          <div
                            style={{
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={detailedPost.image.url}
                              alt="Description"
                              style={{
                                width: "100%",
                                maxHeight: "800px",
                                display: "block",
                              }}
                            />
                          </div>
                        </Link>
                      </>
                    ) : null
                  ) : null}
                </span>
              </div>

              {/* post content + post created date finish to check */}
              {/* new version favorite repost comment start to check */}
              <Stack
                direction="horizontal"
                style={{
                  justifyContent: "space-between",
                  borderBottom: detailedPost
                    ? null
                    : detailedPost.comments.length
                    ? "1px solid rgba(0,0,0,0.1)"
                    : null,
                }}
              >
                <div className="p-2">
                  <CommentModal
                    refreshPosts={refreshPostDetailPage}
                    post={detailedPost}
                    width={`${1.5}em`}
                    height={`${1.5}em`}
                    isImagePostDetail={true}
                  />
                </div>
                <div className="p-2">
                  {detailedPost.reposted && detailedPost.reposted.length ? (
                    checkIds(detailedPost.reposted).includes(userInfo._id) ? (
                      <div>
                        <svg
                          onClick={() =>
                            handleDeleteRepostPostDetailPage(detailedPost._id)
                          }
                          width={`${1.5}em`}
                          height={`${1.5}em`}
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
                          className="post-description"
                          style={{
                            color: "rgb(0, 186, 124)",
                            //   : "rgb(83, 100, 113)",
                          }}
                        >
                          <span>{detailedPost.reposted.length}</span>
                        </span>
                      </div>
                    ) : (
                      <div>
                        {" "}
                        <svg
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => handleRepost(detailedPost._id)}
                          width={`${1.5}em`}
                          height={`${1.5}em`}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                          fill={"white"}
                        >
                          <g>
                            <path
                              stroke="white"
                              strokeWidth="0.1"
                              d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                            ></path>
                          </g>
                        </svg>
                        <span
                          className="post-description"
                          style={{ color: "white" }}
                        >
                          <span>{detailedPost.reposted.length}</span>
                        </span>
                      </div>
                    )
                  ) : (
                    <div>
                      {" "}
                      <svg
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => handleRepost(detailedPost._id)}
                        width={`${1.5}em`}
                        height={`${1.5}em`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                        // fill={"rgb(83, 100, 113)"}
                        fill={"white"}
                      >
                        <g>
                          <path
                            stroke="white"
                            strokeWidth="0.1"
                            d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                          ></path>
                        </g>
                      </svg>
                      <span
                        className="post-description"
                        style={{
                          color: "white",
                        }}
                      >
                        <span>
                          {detailedPost.reposted && detailedPost.reposted.length
                            ? detailedPost.reposted.length
                            : null}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  {detailedPost.likes && detailedPost.likes.length ? (
                    checkIds(detailedPost.likes).includes(userInfo._id) ? (
                      <div>
                        <svg
                          onClick={() =>
                            handleDeleteLikePostDetailPage(detailedPost._id)
                          }
                          width={`${1.5}em`}
                          height={`${1.5}em`}
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
                          {detailedPost.likes.length ? (
                            <span
                              style={{
                                color: "rgb(249, 24, 128)",
                              }}
                            >
                              {detailedPost.likes.length}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    ) : (
                      <div>
                        {" "}
                        <svg
                          onClick={() =>
                            handlePostLikesPostDetailPage(detailedPost._id)
                          }
                          width={`${1.5}em`}
                          height={`${1.5}em`}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          color="white"
                          fill="currentColor"
                          className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                        >
                          <g>
                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                          </g>
                        </svg>
                        <span
                          className="post-description"
                          style={{
                            color: "white",
                          }}
                        >
                          {detailedPost.likes.length ? (
                            <span>{detailedPost.likes.length}</span>
                          ) : null}
                        </span>
                      </div>
                    )
                  ) : (
                    <div>
                      {" "}
                      <svg
                        onClick={() =>
                          handlePostLikesPostDetailPage(detailedPost._id)
                        }
                        width={`${1.5}em`}
                        height={`${1.5}em`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        color="white"
                        fill="currentColor"
                        className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                      >
                        <g>
                          <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                        </g>
                      </svg>
                      <span
                        className="post-description"
                        style={{ color: "white" }}
                      >
                        {null}
                      </span>
                    </div>
                  )}
                </div>
              </Stack>
              {/* new version favorite repost comment finish to check */}
            </div>
          </Col>
          {/* 3.column burası olucak */}
          <Col
            className="side-bar-column d-none d-lg-block d-xxl-block"
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={6} // 768px - 992px aralığı
            lg={4} // 1200px - 1400px aralığı
            xxl={3} // 1400px ve sonrası aralığı
            style={{
              height: "100%",
              backgroundColor: "white",
            }}
          >
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
                  className="mt-3  transition-gray-hover"
                >
                  <Row>
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
                            {commentedForThisPost.userId.imageUrl.slice(
                              0,
                              3
                            ) !== "../" ? (
                              <>
                                <Link
                                  onClick={() =>
                                    redirectSpesificProfilePage(
                                      commentedForThisUsersPost._id
                                    )
                                  }
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
                                    className="responsive-comment-line-image-post-detail"
                                    style={{
                                      border: "1px solid rgba(0, 0, 0, 0.2)",
                                      width: "2px",
                                      height: `${
                                        commentedForThisPost.content.length < 38
                                          ? "60px"
                                          : commentedForThisPost.content
                                              .length >= 38 &&
                                            commentedForThisPost.content
                                              .length < 75
                                          ? "80px"
                                          : commentedForThisPost.content
                                              .length >= 75 &&
                                            commentedForThisPost.content
                                              .length <= 140
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
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    fill="rgb(83, 100, 113)"
                                    className="bi bi-person-circle"
                                    viewBox="0 0 16 16"
                                    style={{
                                      position: "relative",
                                    }}
                                    onClick={() =>
                                      document
                                        .getElementById("formuploadModal")
                                        .click()
                                    }
                                  >
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                  </svg>
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
                                      border: "1px solid rgba(0, 0, 0, 0.2)",
                                      margin: "5px 0px 5px 0px",
                                      width: "2px",
                                      height: `${
                                        commentedForThisPost.content.length < 38
                                          ? "60px"
                                          : commentedForThisPost.content
                                              .length >= 38 &&
                                            commentedForThisPost.content
                                              .length < 75
                                          ? "80px"
                                          : commentedForThisPost.content
                                              .length >= 75 &&
                                            commentedForThisPost.content
                                              .length <= 140
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
                              onClick={() =>
                                redirectSpesificProfilePage(
                                  commentedForThisUsersPost._id
                                )
                              }
                              style={{
                                textDecoration: "none",
                              }}
                              to={`/profile/${commentedForThisUsersPost._id}`}
                            >
                              <span
                                className="hover-fullname"
                                style={{
                                  color: "black",
                                  fontWeight: "700",
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                }}
                              >
                                {commentedForThisPost.authorFullName}
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
                                  commentedForThisUsersPost._id
                                )
                              }
                              style={{
                                textDecoration: "none",
                              }}
                              to={`/profile/${commentedForThisUsersPost._id}`}
                            >
                              <span
                                style={{
                                  color: "rgb(83, 100, 113)",
                                  lineHeight: "20px",
                                  fontSize: "15px",
                                  fontWeight: "400",
                                }}
                              >
                                @{commentedForThisPost.authorUserName}
                              </span>
                            </Link>

                            <Link
                              onClick={() =>
                                redirectPostDetailPage(
                                  commentedForThisPost.authorUserName,
                                  commentedForThisPost._id
                                )
                              }
                              style={{
                                textDecoration: "none",
                              }}
                              to={`/${commentedForThisPost.authorUserName}/status/${commentedForThisPost._id}`}
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
                                  {getCreatedDate(
                                    commentedForThisPost.createdAt
                                  )}
                                </span>
                              </span>
                            </Link>
                            {/* three dots svg start to check */}
                            <span
                              style={{
                                float: "right",
                              }}
                            >
                              {/* show if post owner userId !equal currentUserId */}
                              {commentedForThisPost.userId &&
                              commentedForThisPost.userId._id !==
                                userInfo._id ? (
                                <svg
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "rgb(29, 155, 240)",
                                  }}
                                  onClick={() =>
                                    handleShowDetailPostFromPostDetailPage(
                                      commentedForThisPost._id
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
                                    handleDeletePostPostDetailPage(
                                      commentedForThisPost._id
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

                            {/* three dots svg finish to check */}

                            {/* finish to check  */}
                          </>
                        ) : null}
                      </div>

                      <div
                        style={{
                          fontSize: "17px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          overflowWrap: "break-word",
                          maxWidth: "100%",
                        }}
                      >
                        <Link
                          onClick={() =>
                            redirectPostDetailPage(
                              commentedForThisPost.authorUserName,
                              commentedForThisPost._id
                            )
                          }
                          style={{
                            textDecoration: "none",
                            color: "black",
                          }}
                          to={`/${commentedForThisPost.authorUserName}/status/${commentedForThisPost._id}`}
                        >
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: "400",
                              lineHeight: "20px",
                            }}
                          >
                            <span>{commentedForThisPost.content}</span>
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
                        <div className="">
                          <CommentModal
                            refreshPosts={refreshPostDetailPage}
                            post={commentedForThisPost}
                            width={`${1.25}em`}
                            height={`${1.25}em`}
                          />
                        </div>
                        <div className="">
                          {commentedForThisPost.reposted &&
                          commentedForThisPost.reposted.length ? (
                            checkIds(commentedForThisPost.reposted).includes(
                              userInfo._id
                            ) ? (
                              <div>
                                <svg
                                  onClick={() =>
                                    handleDeleteRepostPostDetailPageCFTUP(
                                      commentedForThisPost._id
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
                                  className="post-description"
                                  style={{
                                    color: "rgb(0, 186, 124)",
                                    //   : "rgb(83, 100, 113)",
                                  }}
                                >
                                  <span>
                                    {commentedForThisPost.reposted.length}
                                  </span>
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
                                    handleRepostCFTUP(commentedForThisPost._id)
                                  }
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                  fill={"rgb(83, 100, 113)"}
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
                                  style={{ color: "rgb(83, 100, 113)" }}
                                >
                                  <span>
                                    {commentedForThisPost.reposted.length}
                                  </span>
                                </span>
                              </div>
                            )
                          ) : (
                            <div>
                              {" "}
                              <svg
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleRepostCFTUP(commentedForThisPost._id)
                                }
                                width={`${1.25}em`}
                                height={`${1.25}em`}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                fill={"rgb(83, 100, 113)"}
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
                                  color: "rgb(83, 100, 113)",
                                }}
                              >
                                <span>
                                  {commentedForThisPost.reposted &&
                                  commentedForThisPost.reposted.length
                                    ? commentedForThisPost.reposted.length
                                    : null}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="">
                          {commentedForThisPost.likes &&
                          commentedForThisPost.likes.length ? (
                            checkIds(commentedForThisPost.likes).includes(
                              userInfo._id
                            ) ? (
                              <div>
                                <svg
                                  onClick={() =>
                                    handleDeleteLikePostDetailPageCFTUP(
                                      commentedForThisPost._id
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
                                  {commentedForThisPost.likes.length ? (
                                    <span
                                      style={{
                                        color: "rgb(249, 24, 128)",
                                      }}
                                    >
                                      {commentedForThisPost.likes.length}
                                    </span>
                                  ) : null}
                                </span>
                              </div>
                            ) : (
                              <div>
                                {" "}
                                <svg
                                  onClick={() =>
                                    handlePostLikesPostDetailPageCFTUP(
                                      commentedForThisPost._id
                                    )
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
                                  {commentedForThisPost.likes.length ? (
                                    <span>
                                      {commentedForThisPost.likes.length}
                                    </span>
                                  ) : null}
                                </span>
                              </div>
                            )
                          ) : (
                            <div>
                              {" "}
                              <svg
                                onClick={() =>
                                  handlePostLikesPostDetailPageCFTUP(
                                    commentedForThisPost._id
                                  )
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
                              <span className="post-description">{null}</span>
                            </div>
                          )}
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
                  marginBottom: "5px",
                  backgroundColor: "rgba(247,249,249,1.00)",
                  wordWrap: "break-word",
                  padding: "12px 4px 12px 4px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "rgba(239,243,244,1.00)",
                  borderRadius: "16px",
                  fontSize: "15px",
                }}
              >
                <span
                  style={{
                    marginLeft: "15px",
                    color: "rgba(83,100,113)",
                    fontSize: "15px",
                    lineHeight: "20px",
                    fontWeight: "400",
                  }}
                >
                  This Post was deleted by the Post author.
                </span>{" "}
                <span
                  className="learn-more-post-detail"
                  style={{
                    cursor: "pointer",
                    color: "rgba(29,155,240)",
                    fontSize: "15px",
                    lineHeight: "20px",
                    fontWeight: "400",
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
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    margin: "5px 0px 5px 0px",
                    width: "2px",
                    height: `8px`,
                  }}
                ></div>
              </div>
            ) : null}

            <Container>
              <Row>
                <Col
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  xxl={2}
                  style={{
                    textAlign: "center",
                    padding: "6px 0px 6px 0px",
                  }}
                >
                  {/* profile image start to check */}

                  <div>
                    {detailedPost.userId ? (
                      detailedPost.userId.imageUrl.slice(0, 3) !== "../" ? (
                        <Link
                          onClick={() =>
                            redirectSpesificProfilePage(detailedPost.userId._id)
                          }
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
                          onClick={() =>
                            redirectSpesificProfilePage(detailedPost.userId._id)
                          }
                          to={`/profile/${
                            detailedPost.userId ? detailedPost.userId._id : null
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
                      )
                    ) : null}
                  </div>

                  {/* profile image finish to check  */}
                </Col>
                <Col xs={10} sm={10} md={10} lg={10} xxl={10}>
                  {/* start to check post owner full name + post owner user name  */}
                  <div>
                    <Link
                      onClick={() =>
                        redirectSpesificProfilePage(detailedPost.userId._id)
                      }
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
                        className="post-detail-underline-text-2"
                        style={{
                          color: "black",
                          lineHeight: "20px",
                          fontWeight: "700",
                          fontSize: "15px",
                        }}
                      >
                        {detailedPost.authorFullName}
                      </span>
                    </Link>

                    {/* three dots svg start to check */}
                    <span
                      style={{
                        float: "right",
                      }}
                    >
                      {/* show if post owner userId !equal currentUserId */}
                      {detailedPost.userId &&
                      detailedPost.userId._id !== userInfo._id ? (
                        <svg
                          style={{
                            cursor: "pointer",
                            backgroundColor: "rgb(29, 155, 240)",
                          }}
                          onClick={() =>
                            handleShowDetailPostFromPostDetailPage(
                              detailedPost._id
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
                            handleDeletePostPostDetailPage(detailedPost._id)
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

                    {/* three dots svg finish to check */}
                  </div>
                  <Link
                    onClick={() =>
                      redirectSpesificProfilePage(detailedPost.userId._id)
                    }
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
                      style={{
                        color: "rgb(83,100,113)",
                        lineHeight: "20px",
                        fontSize: "15px",
                        fontWeight: "400",
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
            <Stack
              direction="vertical"
              gap={0}
              style={{
                borderBottom:
                  userInfo.username === detailedPost.authorUserName
                    ? "1px solid rgba(0,0,0,0.1)"
                    : null,
              }}
            >
              <div
                style={{
                  marginLeft: "10px",
                  fontSize: "17px",
                  fontWeight: "400",
                  lineHeight: "24px",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                }}
                className="p-1"
              >
                <Link
                  onClick={() =>
                    redirectPostDetailPage(
                      detailedPost.authorUserName,
                      detailedPost._id
                    )
                  }
                  to={`/${detailedPost.authorUserName}/status/${detailedPost._id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <span>{detailedPost.content}</span>
                </Link>
                <span>
                  {detailedPost.image ? (
                    detailedPost.image.url.slice(0, 3) !== "ima" &&
                    detailedPost.content.length ? (
                      <>
                        <Link
                          to={`/${detailedPost.authorUserName}/status/${
                            !detailedPost.isReposted
                              ? detailedPost._id
                              : detailedPost.repostedFromThisOriginalPost[0]._id
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
                              src={detailedPost.image.url}
                              alt="Description"
                              style={{
                                width: "100%",
                                display: "block",
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
                    color: "rgb(83, 100, 113",
                    fontSize: "15px",
                    fontWeight: "400",
                    lineHeight: "20px",
                  }}
                  className="p-0 mt-3 mb-3 post-detail-underline-text-1"
                >
                  {formatDateString(detailedPost.createdAt)}
                </div>
              </Link>
            </Stack>
            {/* post content + post created date finish to check */}

            {/* view post engagements section start to check */}
            <Stack
              className="view-post-engagements-section transition-gray-hover"
              direction="horizontal"
              style={{
                cursor: "pointer",
                justifyContent: "left",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
              gap={0}
            >
              {detailedPost.userId ? (
                <>
                  {detailedPost.userId._id === userInfo._id ? (
                    <>
                      <PostEngagements
                        postDetailPage={false}
                        detailedPost={detailedPost}
                        handleFollowingNotification={
                          handleFollowingNotification
                        }
                      />
                    </>
                  ) : null}
                </>
              ) : null}
            </Stack>
            {/* view post engagements section finish to check
            {/* new version favorite repost comment start to check */}
            <Stack
              direction="horizontal"
              style={{
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <div className="p-2">
                <CommentModal
                  refreshPosts={refreshPostDetailPage}
                  post={detailedPost}
                  width={`${1.5}em`}
                  height={`${1.5}em`}
                />
              </div>
              <div className="p-2">
                {detailedPost.reposted && detailedPost.reposted.length ? (
                  checkIds(detailedPost.reposted).includes(userInfo._id) ? (
                    <div>
                      <svg
                        onClick={() =>
                          handleDeleteRepostPostDetailPage(detailedPost._id)
                        }
                        width={`${1.5}em`}
                        height={`${1.5}em`}
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
                        className="post-description"
                        style={{
                          color: "rgb(0, 186, 124)",
                          //   : "rgb(83, 100, 113)",
                        }}
                      >
                        <span>{detailedPost.reposted.length}</span>
                      </span>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <svg
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => handleRepost(detailedPost._id)}
                        width={`${1.5}em`}
                        height={`${1.5}em`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                        fill={"rgb(83, 100, 113)"}
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
                        style={{ color: "rgb(83, 100, 113)" }}
                      >
                        <span>{detailedPost.reposted.length}</span>
                      </span>
                    </div>
                  )
                ) : (
                  <div>
                    {" "}
                    <svg
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => handleRepost(detailedPost._id)}
                      width={`${1.5}em`}
                      height={`${1.5}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                      fill={"rgb(83, 100, 113)"}
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
                        color: "rgb(83, 100, 113)",
                      }}
                    >
                      <span>
                        {detailedPost.reposted && detailedPost.reposted.length
                          ? detailedPost.reposted.length
                          : null}
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2">
                {detailedPost.likes && detailedPost.likes.length ? (
                  checkIds(detailedPost.likes).includes(userInfo._id) ? (
                    <div>
                      <svg
                        onClick={() =>
                          handleDeleteLikePostDetailPage(detailedPost._id)
                        }
                        width={`${1.5}em`}
                        height={`${1.5}em`}
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
                        {detailedPost.likes.length ? (
                          <span
                            style={{
                              color: "rgb(249, 24, 128)",
                            }}
                          >
                            {detailedPost.likes.length}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <svg
                        onClick={() =>
                          handlePostLikesPostDetailPage(detailedPost._id)
                        }
                        width={`${1.5}em`}
                        height={`${1.5}em`}
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
                        {detailedPost.likes.length ? (
                          <span>{detailedPost.likes.length}</span>
                        ) : null}
                      </span>
                    </div>
                  )
                ) : (
                  <div>
                    {" "}
                    <svg
                      onClick={() =>
                        handlePostLikesPostDetailPage(detailedPost._id)
                      }
                      width={`${1.5}em`}
                      height={`${1.5}em`}
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
                    <span className="post-description">{null}</span>
                  </div>
                )}
              </div>
            </Stack>

            {/* new version favorite repost comment finish to check */}

            {/* accordion implementation for comments when it is more than 0 start to check  */}
            {!detailedPost.isComment &&
            detailedPost.comments &&
            detailedPost.comments.length ? (
              <Accordion defaultActiveKey="0">
                <Accordion.Item style={{ border: "none" }} eventKey="1">
                  <Accordion.Header
                    style={{ border: "none" }}
                    className="accordion-2"
                  >
                    <div
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
                      Show this thread
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    {detailedPost.comments ? (
                      <div>
                        {detailedPost.comments.map((eachComment, index) => {
                          return (
                            <>
                              <div
                                style={{
                                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                                }}
                                className="all-posts"
                              >
                                <div key={eachComment._id}>
                                  <div className="posts-details">
                                    <Stack direction="horizontal" gap={1}>
                                      {/* profile image start to check */}
                                      <div className="p-1">
                                        {eachComment.userId.imageUrl.slice(
                                          0,
                                          3
                                        ) !== "../" ? (
                                          <Link
                                            onClick={() =>
                                              redirectSpesificProfilePage(
                                                eachComment.userId._id
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                            to={`/profile/${
                                              eachComment
                                                ? eachComment.userId._id
                                                : null
                                            }`}
                                          >
                                            <img
                                              width={40}
                                              height={40}
                                              src={eachComment.userId.imageUrl}
                                              alt=""
                                            />
                                          </Link>
                                        ) : (
                                          <Link
                                            onClick={() =>
                                              redirectSpesificProfilePage(
                                                eachComment.userId._id
                                              )
                                            }
                                            to={`/profile/${
                                              eachComment.userId
                                                ? eachComment.userId._id
                                                : null
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
                                        {eachComment.userId ? (
                                          <>
                                            <Link
                                              onClick={() =>
                                                redirectSpesificProfilePage(
                                                  eachComment.userId._id
                                                )
                                              }
                                              to={`/profile/${eachComment.userId._id}`}
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
                                                {eachComment.authorFullName}
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
                                                  eachComment.userId._id
                                                )
                                              }
                                              to={`/profile/${eachComment.userId._id}`}
                                              style={{
                                                textDecoration: "none",
                                                color: "rgb(83, 100, 113)",
                                                lineHeight: "20px",
                                                fontSize: "15px",
                                                fontWeight: "400",
                                              }}
                                            >
                                              <span>
                                                <span>
                                                  @{eachComment.authorUserName}
                                                </span>
                                              </span>
                                            </Link>
                                            <Link
                                              onClick={() =>
                                                redirectPostDetailPage(
                                                  eachComment.userId.username,
                                                  !eachComment.isReposted
                                                    ? eachComment.postId
                                                    : eachComment
                                                        .repostedFromThisOriginalPost[0]
                                                        ._id
                                                )
                                              }
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
                                                  {getCreatedDate(
                                                    eachComment.createdAt
                                                  )}
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
                                          {eachComment.userId &&
                                          eachComment.userId._id !==
                                            userInfo._id ? (
                                            <svg
                                              style={{
                                                cursor: "pointer",
                                                backgroundColor:
                                                  "rgb(29, 155, 240)",
                                              }}
                                              onClick={() =>
                                                handleShowDetailPostFromPostDetailPage(
                                                  eachComment.postId
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
                                                handleDeletePostPostDetailPage(
                                                  eachComment.postId
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
                                        onClick={() =>
                                          redirectPostDetailPage(
                                            eachComment.userId.username,
                                            !eachComment.isReposted
                                              ? eachComment.postId
                                              : eachComment
                                                  .repostedFromThisOriginalPost[0]
                                                  ._id
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
                                            !eachComment.isReposted
                                              ? eachComment._id
                                              : eachComment
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
                                              src={eachComment.image.url}
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
                                          refreshPosts={refreshPostDetailPage}
                                          post={
                                            eachComment ? eachComment : null
                                          }
                                          width={`${1.25}em`}
                                          height={`${1.25}em`}
                                        />
                                      </div>
                                      <div className="p-1">
                                        {eachComment.reposted.length > 0 &&
                                        getRepostedIds(eachComment).includes(
                                          userInfo._id
                                        ) ? (
                                          <div>
                                            <svg
                                              onClick={() =>
                                                handleDeleteRepostPostDetailPage(
                                                  eachComment.postId
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
                                              {eachComment.reposted.length ? (
                                                <span>
                                                  {eachComment.reposted.length}
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
                                                handleRepost(eachComment.postId)
                                              }
                                              width={`${1.25}em`}
                                              height={`${1.25}em`}
                                              viewBox="0 0 24 24"
                                              aria-hidden="true"
                                              className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                              fill={
                                                !shouldHide &&
                                                eachComment.reposted.includes(
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
                                                  eachComment.reposted.includes(
                                                    userInfo._id
                                                  )
                                                    ? "rgb(0, 186, 124)"
                                                    : "rgb(83, 100, 113)",
                                              }}
                                            >
                                              {eachComment.reposted.length ? (
                                                <span>
                                                  {eachComment.reposted.length}
                                                </span>
                                              ) : null}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="p-1">
                                        {getLikerIds(eachComment).includes(
                                          userInfo._id
                                        ) ? (
                                          <div>
                                            <svg
                                              onClick={() =>
                                                handleDeleteLikePostDetailPage(
                                                  eachComment.postId
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
                                              {eachComment.likes.length ? (
                                                <span
                                                  style={{
                                                    color: "rgb(249, 24, 128)",
                                                  }}
                                                >
                                                  {eachComment.likes.length}
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
                                                handlePostLikesPostDetailPage(
                                                  eachComment.postId
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
                                              {eachComment.likes.length ? (
                                                <span>
                                                  {eachComment.likes.length}
                                                </span>
                                              ) : null}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </Stack>
                                    {/* new version favorite repost comment finish to check */}
                                  </div>
                                </div>
                              </div>
                            </>
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
                <Accordion.Item style={{ border: "none" }} eventKey="1">
                  <Accordion.Header
                    style={{ border: "none" }}
                    className="accordion-2"
                  >
                    <div
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
                      Show this thread
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    {detailedPost.comments ? (
                      <div>
                        {detailedPost.comments.map((eachComment, index) => {
                          return (
                            <>
                              <div
                                style={{
                                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                                }}
                                className="all-posts"
                              >
                                <div key={eachComment._id}>
                                  <div className="posts-details">
                                    <Stack direction="horizontal" gap={1}>
                                      {/* profile image start to check */}
                                      <div className="p-1">
                                        {eachComment.userId ? (
                                          eachComment.userId.imageUrl.slice(
                                            0,
                                            3
                                          ) !== "../" ? (
                                            <Link
                                              onClick={() =>
                                                redirectSpesificProfilePage(
                                                  eachComment.userId._id
                                                )
                                              }
                                              style={{ cursor: "pointer" }}
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
                                              />
                                            </Link>
                                          ) : (
                                            <Link
                                              onClick={() =>
                                                redirectSpesificProfilePage(
                                                  eachComment.userId._id
                                                )
                                              }
                                              to={`/profile/${
                                                eachComment.userId
                                                  ? eachComment.userId._id
                                                  : null
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
                                          )
                                        ) : null}
                                      </div>
                                      {/* profile image finish to check  */}

                                      {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                                      <div className="p-1">
                                        {eachComment.userId ? (
                                          <>
                                            <Link
                                              onClick={() =>
                                                redirectSpesificProfilePage(
                                                  eachComment.userId._id
                                                )
                                              }
                                              to={`/profile/${eachComment.userId._id}`}
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
                                                {eachComment.authorFullName}
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
                                                  eachComment.userId._id
                                                )
                                              }
                                              to={`/profile/${eachComment.userId._id}`}
                                              style={{
                                                textDecoration: "none",
                                                color: "rgb(83, 100, 113)",
                                                lineHeight: "20px",
                                                fontSize: "15px",
                                                fontWeight: "400",
                                              }}
                                            >
                                              <span>
                                                <span>
                                                  @{eachComment.authorUserName}
                                                </span>
                                              </span>
                                            </Link>
                                            <Link
                                              onClick={() =>
                                                redirectPostDetailPage(
                                                  eachComment.userId.username,
                                                  !eachComment.isReposted
                                                    ? eachComment.postId
                                                    : eachComment
                                                        .repostedFromThisOriginalPost[0]
                                                        ._id
                                                )
                                              }
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
                                                  {getCreatedDate(
                                                    eachComment.createdAt
                                                  )}
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
                                          {eachComment.userId &&
                                          eachComment.userId._id !==
                                            userInfo._id ? (
                                            <svg
                                              style={{
                                                cursor: "pointer",
                                                backgroundColor:
                                                  "rgb(29, 155, 240)",
                                              }}
                                              onClick={() =>
                                                handleShowDetailPostFromPostDetailPage(
                                                  eachComment.postId
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
                                                handleDeletePostPostDetailPage(
                                                  eachComment.postId
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
                                        onClick={() =>
                                          redirectPostDetailPage(
                                            eachComment.userId.username,
                                            !eachComment.isReposted
                                              ? eachComment.postId
                                              : eachComment
                                                  .repostedFromThisOriginalPost[0]
                                                  ._id
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
                                          {eachComment.content}
                                        </div>
                                      </Link>
                                    </Stack>
                                    {/* post content finish to check  */}
                                    {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                                    {eachComment.image ? (
                                      eachComment.image.url !== "image@url" ? (
                                        <>
                                          <Link
                                            onClick={() => {
                                              redirectToImagePostDetailPage(
                                                eachComment.userId.username,
                                                eachComment.postId
                                              );
                                            }}
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
                                                border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
                                                borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
                                                boxShadow:
                                                  "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
                                              }}
                                            >
                                              <img
                                                src={eachComment.image.url}
                                                alt="Description"
                                                style={{
                                                  width: "100%",
                                                  display: "block",
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
                                      <div className="p-1">
                                        <CommentModal
                                          refreshPosts={refreshPostDetailPage}
                                          post={
                                            eachComment ? eachComment : null
                                          }
                                          width={`${1.25}em`}
                                          height={`${1.25}em`}
                                        />
                                      </div>
                                      <div className="p-1">
                                        {eachComment.reposted ? (
                                          eachComment.reposted.length > 0 &&
                                          getRepostedIds(eachComment).includes(
                                            userInfo._id
                                          ) ? (
                                            <div>
                                              <svg
                                                onClick={() =>
                                                  handleDeleteRepostPostDetailPage(
                                                    eachComment.postId
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
                                                {eachComment.reposted.length ? (
                                                  <span>
                                                    {
                                                      eachComment.reposted
                                                        .length
                                                    }
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
                                                  handleRepost(
                                                    eachComment.postId
                                                  )
                                                }
                                                width={`${1.25}em`}
                                                height={`${1.25}em`}
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                                fill={
                                                  !shouldHide &&
                                                  eachComment.reposted.includes(
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
                                                    eachComment.reposted.includes(
                                                      userInfo._id
                                                    )
                                                      ? "rgb(0, 186, 124)"
                                                      : "rgb(83, 100, 113)",
                                                }}
                                              >
                                                {eachComment.reposted.length ? (
                                                  <span>
                                                    {
                                                      eachComment.reposted
                                                        .length
                                                    }
                                                  </span>
                                                ) : null}
                                              </span>
                                            </div>
                                          )
                                        ) : null}
                                      </div>
                                      <div className="p-1">
                                        {eachComment.likes ? (
                                          getLikerIds(eachComment).includes(
                                            userInfo._id
                                          ) ? (
                                            <div>
                                              <svg
                                                onClick={() =>
                                                  handleDeleteLikePostDetailPage(
                                                    eachComment.postId
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
                                                {eachComment.likes.length ? (
                                                  <span
                                                    style={{
                                                      color:
                                                        "rgb(249, 24, 128)",
                                                    }}
                                                  >
                                                    {eachComment.likes.length}
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
                                                  handlePostLikesPostDetailPage(
                                                    eachComment.postId
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
                                                {eachComment.likes.length ? (
                                                  <span>
                                                    {eachComment.likes.length}
                                                  </span>
                                                ) : null}
                                              </span>
                                            </div>
                                          )
                                        ) : null}
                                      </div>
                                    </Stack>
                                    {/* new version favorite repost comment finish to check */}
                                  </div>
                                </div>
                              </div>
                            </>
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
        </Row>
      </Container>
    </>
  );
}

export default PostDetailPage;
