import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

import io from "socket.io-client";
import { ThemeContext } from "../../context/ThemeContext";
import BootstrapTooltip from "../BootstrapToolTip/BootstrapToolTip";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";
const socket = io.connect(`${API_URL}`);

const BookmarkAction = ({
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
  isCutePopoverOnRightSide,
  bookmarkDeletedMessage,
}) => {
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { getFontSizeAndLineHeight13 } = useFontSizeHandler();
  const font13 = getFontSizeAndLineHeight13();
  const { userInfo, getToken } = useContext(UserContext);

  const getBookmarkIds = (array) => {
    return array?.bookmarks?.map((eachBookmarker) => {
      return eachBookmarker.bookmarker;
    });
  };

  const [bookmarkIconHovered, setBookmarkIconHovered] = useState(false);
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();

  const handleBookmarkAdd = (postId, findedPost) => {
    console.log("Post id =>", postId);
    axios
      .post(
        `${API_URL}/bookmarks/add`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        showCustomMessage("Added to your Bookmarks", 6, true);

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
  const handleDeleteBookMark = (bookmarkId) => {
    axios
      .delete(`${API_URL}/bookmarks/${bookmarkId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => {
        showCustomMessage("Removed from your Bookmarks", 6);
        if (bookmarkDeletedMessage) {
          bookmarkDeletedMessage("Removed from your Bookmarks", 6);
        }
        refreshPosts();
      })
      .catch((err) => {
        console.log("Error =>", err);
      });
  };

  return (
    <>
      {contextHolder}
      {getBookmarkIds(post)?.includes(userInfo._id) ? (
        <div>
          <BootstrapTooltip
            title="Remove from Bookmarks"
            themeName={
              themeName === "dark-theme" ? "dark-theme" : "light-theme"
            }
          >
            <span
              onClick={() => handleDeleteBookMark(post.postId || post._id)}
              style={{
                cursor: "pointer",
                minWidth: "34px",
                minHeight: "34px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                backgroundColor:
                  bookmarkIconHovered && themeName !== "dark-theme"
                    ? "#e4eef7"
                    : bookmarkIconHovered && themeName === "dark-theme"
                    ? "#1e3140"
                    : null,
              }}
              onMouseEnter={() => setBookmarkIconHovered(true)}
              onMouseLeave={() => setBookmarkIconHovered(false)}
            >
              <svg
                width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
                height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="#1C9BEF"
              >
                <g>
                  <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
                </g>
              </svg>
            </span>
            <span
              className={"post-description chirp-regular-font"}
              style={{
                cursor: "pointer",
                position: "relative",
                fontSize: font13.fontSize,
                lineHeight: font13.lineHeight,
              }}
            >
              {post.bookmarks.length ? (
                <>
                  <span
                    style={{
                      color: "#1C9BEF",
                      position: "relative",
                      bottom: isCutePopoverOnRightSide ? "4px" : "5px",
                      fontSize: isCutePopoverOnRightSide ? "12px" : null,
                    }}
                  >
                    {post.bookmarks.length}
                  </span>
                </>
              ) : null}
            </span>
          </BootstrapTooltip>
        </div>
      ) : (
        <div>
          <BootstrapTooltip
            title="Bookmark"
            themeName={
              themeName === "dark-theme" ? "dark-theme" : "light-theme"
            }
          >
            <span
              onClick={() => handleBookmarkAdd(post.postId || post._id, post)}
              style={{
                cursor: "pointer",
                minWidth: "34px",
                minHeight: "34px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                backgroundColor:
                  bookmarkIconHovered && themeName !== "dark-theme"
                    ? "#e4eef7"
                    : bookmarkIconHovered && themeName === "dark-theme"
                    ? "#1e3140"
                    : null,
              }}
              onMouseEnter={() => setBookmarkIconHovered(true)}
              onMouseLeave={() => setBookmarkIconHovered(false)}
            >
              <svg
                width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
                height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                fill={
                  themeName === "dark-theme" && !bookmarkIconHovered
                    ? "#71767A"
                    : themeName !== "dark-theme" && !bookmarkIconHovered
                    ? "rgb(83, 100, 113)"
                    : themeName === "dark-theme" && bookmarkIconHovered
                    ? "#1C9BEF"
                    : themeName !== "dark-theme" && bookmarkIconHovered
                    ? "#1C9BEF"
                    : null
                }
              >
                <g>
                  <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
                </g>
              </svg>
            </span>
            <span
              className={"post-description chirp-regular-font"}
              style={{
                cursor: "pointer",
                position: "relative",
                fontSize: font13.fontSize,
                lineHeight: font13.lineHeight,
              }}
            >
              {post?.bookmarks?.length ? (
                <>
                  <span
                    style={{
                      color:
                        themeName === "dark-theme" && !bookmarkIconHovered
                          ? "#71767A"
                          : themeName !== "dark-theme" && !bookmarkIconHovered
                          ? "rgb(83, 100, 113)"
                          : themeName === "dark-theme" && bookmarkIconHovered
                          ? "rgb(51,161,240)"
                          : themeName !== "dark-theme" && bookmarkIconHovered
                          ? "rgb(51,161,240)"
                          : null,
                      position: "relative",
                      bottom: isCutePopoverOnRightSide ? "4px" : "5px",
                      fontSize: isCutePopoverOnRightSide ? "12px" : null,
                    }}
                  >
                    {post.bookmarks.length}
                  </span>
                </>
              ) : null}
            </span>
          </BootstrapTooltip>
        </div>
      )}
    </>
  );
};

export default BookmarkAction;
