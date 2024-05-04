import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

import io from "socket.io-client";
import { ThemeContext } from "../../context/ThemeContext";
const socket = io.connect(`${API_URL}`);

function RepostAction({
  post,
  width,
  height,
  refreshPosts,
  isImagePostDetail,
  setLoadingFalse = false,
  setLoadingTrue = false,
  detailedPostComment,
}) {
  const { userInfo, getToken } = useContext(UserContext);
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);
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

          if (setLoadingTrue) {
            setLoadingTrue();
          }
          if (setLoadingFalse) {
            setLoadingFalse();
          }
          refreshPosts();
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteRepost = (postId) => {
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
          refreshPosts();
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const getRepostedIds = (array) => {
    return array.reposted.map((eachRepost) => {
      return eachRepost._id;
    });
  };

  const [repostIconHovered, setRepostIconHovered] = useState(null);

  return (
    <>
      {post.reposted.length > 0 &&
      getRepostedIds(post).includes(userInfo._id) ? (
        <div>
          <span
            onClick={() =>
              handleDeleteRepost(detailedPostComment ? post.postId : post._id)
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
                repostIconHovered && themeName !== "dark-theme"
                  ? "#e3f1eb"
                  : repostIconHovered && themeName === "dark-theme"
                  ? "#0c4b34"
                  : null,
            }}
            onMouseEnter={() => setRepostIconHovered(true)}
            onMouseLeave={() => setRepostIconHovered(false)}
          >
            <svg
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
          </span>

          <span
            style={{
              cursor: "pointer",
              color: "rgb(0, 186, 124)",
              position: "relative",
              bottom: "5px",
            }}
            className="post-description"
          >
            {/* some test */}
            {post.reposted.length ? <span>{post.reposted.length}</span> : null}
          </span>
        </div>
      ) : (
        <div>
          {" "}
          <span
            onClick={() =>
              handleRepost(detailedPostComment ? post.postId : post._id, post)
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
                repostIconHovered && themeName !== "dark-theme"
                  ? "#e3f1eb"
                  : repostIconHovered && themeName === "dark-theme"
                  ? "#0c4b34"
                  : null,
            }}
            onMouseEnter={() => setRepostIconHovered(true)}
            onMouseLeave={() => setRepostIconHovered(false)}
          >
            <svg
              style={{
                cursor: "pointer",
              }}
              width={`${1.25}em`}
              height={`${1.25}em`}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
              fill={
                themeName === "dark-theme" && !repostIconHovered
                  ? "#71767A"
                  : themeName !== "dark-theme" && !repostIconHovered
                  ? "rgb(83, 100, 113)"
                  : themeName === "dark-theme" && repostIconHovered
                  ? "rgb(0, 186, 124)"
                  : themeName !== "dark-theme" && repostIconHovered
                  ? "rgb(0, 186, 124)"
                  : null
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
          </span>
          <span
            className="post-description"
            style={{
              color:
                themeName === "dark-theme" && !repostIconHovered
                  ? "#71767A"
                  : themeName !== "dark-theme" && !repostIconHovered
                  ? "rgb(83, 100, 113)"
                  : themeName === "dark-theme" && repostIconHovered
                  ? "rgb(0, 186, 124)"
                  : themeName !== "dark-theme" && repostIconHovered
                  ? "rgb(0, 186, 124)"
                  : null,
              position: "relative",
              bottom: "5px",
              cursor: "pointer",
            }}
          >
            {post.reposted.length ? <span>{post.reposted.length}</span> : null}
          </span>
        </div>
      )}
    </>
  );
}

export default RepostAction;
