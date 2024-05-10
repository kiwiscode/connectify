import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

import io from "socket.io-client";
import { ThemeContext } from "../../context/ThemeContext";
const socket = io.connect(`${API_URL}`);

function LikeAction({
  post,
  width,
  height,
  refreshPosts,
  isImagePostDetail,
  setLoadingFalse = false,
  setLoadingTrue = false,
  detailedPostComment,
  allPosts,
  postIndex,
  buttonId,
}) {
  const [{ theme, themeName }] = useContext(ThemeContext);
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "transparent",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: themeName === "dark-theme" ? "#495a68" : "",
    },
  }));

  const { userInfo, getToken } = useContext(UserContext);

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

  const getLikerIds = (array) => {
    return array.likes.map((eachLiker) => {
      return eachLiker._id;
    });
  };

  const [likeIconHovered, setLikeIconHovered] = useState(false);

  const [heartBeatAnimation, setHeartBeatAnimation] = useState(false);
  const handlePostLike = (postId, findedPost) => {
    console.log("Post id =>", postId);

    setHeartBeatAnimation(true);

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
        handleNotification(findedPost, userInfo, "liked");
        if (setLoadingTrue) {
          setLoadingTrue();
        }
        if (setLoadingFalse) {
          setLoadingFalse();
        }

        refreshPosts();
      })
      .catch((error) => {
        console.log("Error message =>", error);
      });
  };

  const handleDeleteLike = (postId) => {
    setHeartBeatAnimation(false);
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
        refreshPosts();
      })
      .catch((err) => {
        console.log("Error =>", err);
      });
  };

  return (
    <>
      {getLikerIds(post).includes(userInfo._id) ? (
        <div>
          <Tooltip title="Unlike">
            <span
              onClick={() =>
                handleDeleteLike(detailedPostComment ? post.postId : post._id)
              }
              style={{
                cursor: "pointer",
                minWidth: "34px",
                minHeight: "34px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                backgroundColor:
                  likeIconHovered && themeName !== "dark-theme"
                    ? "#f9e3eb"
                    : likeIconHovered && themeName === "dark-theme"
                    ? "#4f102b"
                    : null,
              }}
              onMouseEnter={() => setLikeIconHovered(true)}
              onMouseLeave={() => setLikeIconHovered(false)}
            >
              <svg
                width={`${1.25}em`}
                height={`${1.25}em`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="rgb(249, 24, 128)"
                className={`svg-heart ${
                  heartBeatAnimation ? "animated-heart" : null
                }  r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi`}
              >
                <g>
                  <path
                    stroke="black"
                    strokeWidth="0.2"
                    d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                  ></path>
                </g>
              </svg>
            </span>
            <span
              className={
                heartBeatAnimation
                  ? `post-description animate-length-slideDown`
                  : "post-description"
              }
              style={{
                cursor: "pointer",
                position: "relative",
              }}
            >
              {post.likes.length ? (
                <>
                  <span
                    style={{
                      color: "rgb(249, 24, 128)",
                      position: "relative",
                      bottom: "5px",
                    }}
                  >
                    {post.likes.length}
                  </span>
                </>
              ) : null}
            </span>
          </Tooltip>
        </div>
      ) : (
        <div>
          <Tooltip title="Like">
            <span
              onClick={() =>
                handlePostLike(
                  detailedPostComment ? post.postId : post._id,
                  post
                )
              }
              style={{
                cursor: "pointer",
                minWidth: "34px",
                minHeight: "34px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                backgroundColor:
                  likeIconHovered && themeName !== "dark-theme"
                    ? "#f9e3eb"
                    : likeIconHovered && themeName === "dark-theme"
                    ? "#4f102b"
                    : null,
              }}
              onMouseEnter={() => setLikeIconHovered(true)}
              onMouseLeave={() => setLikeIconHovered(false)}
            >
              <svg
                width={`${1.25}em`}
                height={`${1.25}em`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                fill={
                  themeName === "dark-theme" && !likeIconHovered
                    ? "#71767A"
                    : themeName !== "dark-theme" && !likeIconHovered
                    ? "rgb(83, 100, 113)"
                    : themeName === "dark-theme" && likeIconHovered
                    ? "rgb(249, 24, 128)"
                    : themeName !== "dark-theme" && likeIconHovered
                    ? "rgb(249, 24, 128)"
                    : null
                }
              >
                <g>
                  <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                </g>
              </svg>
            </span>
            <span
              className={
                heartBeatAnimation
                  ? `post-description animate-length-slideUp`
                  : "post-description "
              }
              style={{
                cursor: "pointer",
                position: "relative",
              }}
            >
              {post.likes.length ? (
                <>
                  <span
                    style={{
                      color:
                        themeName === "dark-theme" && !likeIconHovered
                          ? "#71767A"
                          : themeName !== "dark-theme" && !likeIconHovered
                          ? "rgb(83, 100, 113)"
                          : themeName === "dark-theme" && likeIconHovered
                          ? "rgb(249, 24, 128)"
                          : themeName !== "dark-theme" && likeIconHovered
                          ? "rgb(249, 24, 128)"
                          : null,
                      position: "relative",
                      bottom: "5px",
                    }}
                  >
                    {post.likes.length}
                  </span>
                </>
              ) : null}
            </span>
          </Tooltip>
        </div>
      )}
    </>
  );
}

export default LikeAction;
