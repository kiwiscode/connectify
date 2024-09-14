import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_APP_API_URL;

import io from "socket.io-client";
import { ThemeContext } from "../../context/ThemeContext";
import { Popover } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { Button } from "react-bootstrap";
import BootstrapTooltip from "../BootstrapToolTip/BootstrapToolTip";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";

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
  postIndex,
  isCutePopoverOnRightSide,
}) {
  const { userInfo, getToken } = useContext(UserContext);
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);
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
        handleNotification(findedPost, userInfo, "repost");

        if (setLoadingTrue) {
          setLoadingTrue();
        }
        if (setLoadingFalse) {
          setLoadingFalse();
        }
        refreshPosts();
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
        refreshPosts();
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const getRepostedIds = (array) => {
    return array?.reposted.map((eachRepost) => {
      return eachRepost._id;
    });
  };

  const [hoveredOption, setHoveredOption] = useState(null);

  const [repostIconHovered, setRepostIconHovered] = useState(null);

  const { getFontSizeAndLineHeight15, getFontSizeAndLineHeight13 } =
    useFontSizeHandler();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
  return (
    <>
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            {post?.reposted.length > 0 &&
            getRepostedIds(post).includes(userInfo._id) ? (
              <div>
                {" "}
                <BootstrapTooltip
                  {...bindTrigger(popupState)}
                  title="Undo repost"
                  themeName={
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }
                >
                  <span
                    onMouseEnter={() => setRepostIconHovered(true)}
                    onMouseLeave={() => setRepostIconHovered(false)}
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
                  >
                    <svg
                      width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
                      height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
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
                      bottom: isCutePopoverOnRightSide ? "4px" : "5px",
                      fontSize: isCutePopoverOnRightSide
                        ? "12px"
                        : font13.fontSize,
                      lineHeight: isCutePopoverOnRightSide
                        ? "14px"
                        : font13.lineHeight,
                    }}
                    className="post-description chirp-regular-font"
                  >
                    {post.reposted.length ? (
                      <span>{post.reposted.length}</span>
                    ) : null}
                  </span>
                </BootstrapTooltip>
              </div>
            ) : (
              <div
                style={{
                  cursor: "pointer",
                }}
              >
                <BootstrapTooltip
                  {...bindTrigger(popupState)}
                  title="Repost"
                  themeName={
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }
                >
                  <span
                    className={`hover-test hover-test-${themeName}`}
                    onMouseEnter={() => setRepostIconHovered(true)}
                    onMouseLeave={() => setRepostIconHovered(false)}
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
                  >
                    <svg
                      style={{
                        cursor: "pointer",
                      }}
                      width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
                      height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
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
                    className="post-description chirp-regular-font"
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
                      cursor: "pointer",
                      bottom: isCutePopoverOnRightSide ? "4px" : "5px",
                      fontSize: isCutePopoverOnRightSide
                        ? "12px"
                        : font13.fontSize,
                      lineHeight: isCutePopoverOnRightSide
                        ? "14px"
                        : font13.lineHeight,
                    }}
                  >
                    {post?.reposted.length ? (
                      <span>{post.reposted.length}</span>
                    ) : null}
                  </span>
                </BootstrapTooltip>
              </div>
            )}

            <Popover
              open={popupState.open}
              onClose={popupState.close}
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "top",
                horizontal: 40,
              }}
              transformOrigin={{
                vertical: 5,
                horizontal: "right",
              }}
              className={`${
                themeName === "dark-theme"
                  ? "popover-material-ui-dark-theme"
                  : themeName !== "dark-theme"
                  ? "popover-material-ui-light-theme"
                  : "hideshowMessageDeletePopover "
              }`}
            >
              {" "}
              <div style={{}}>
                {getRepostedIds(post)?.includes(userInfo._id) ? (
                  <div
                    style={{
                      display: " flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      onClick={() => {
                        handleDeleteRepost(
                          detailedPostComment ? post.postId : post._id
                        );
                        popupState.close();
                      }}
                      onMouseEnter={() => {
                        setHoveredOption("Repost");
                      }}
                      onMouseLeave={() => {
                        setHoveredOption(null);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          hoveredOption === "Repost" &&
                          themeName === "dark-theme"
                            ? "#181818"
                            : hoveredOption === "Repost" &&
                              themeName !== "dark-theme"
                            ? "#f7f7f7"
                            : "",

                        padding: "10px 18.77px",
                      }}
                    >
                      <span>
                        <svg
                          fill={themeName === "dark-theme" ? "white" : "black"}
                          width={`${1.25}em`}
                          height={`${1.25}em`}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-1q142lx"
                        >
                          <g>
                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                          </g>
                        </svg>
                      </span>

                      <span
                        className="chirp-bold-font"
                        style={{
                          marginLeft: "5px",
                          position: "relative",
                          top: "2px",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Undo repost
                      </span>
                    </div>

                    <div
                      onMouseEnter={() => {
                        setHoveredOption("Quote");
                      }}
                      onMouseLeave={() => {
                        setHoveredOption(null);
                      }}
                      style={{
                        cursor: "pointer",

                        backgroundColor:
                          hoveredOption === "Quote" &&
                          themeName === "dark-theme"
                            ? "#181818 "
                            : hoveredOption === "Quote" &&
                              themeName !== "dark-theme"
                            ? "#f7f7f7"
                            : "",
                        padding: "10px 18.77px",
                      }}
                    >
                      <span>
                        {" "}
                        <svg
                          fill={themeName === "dark-theme" ? "white" : "black"}
                          width={`${1.25}em`}
                          height={`${1.25}em`}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-1q142lx"
                        >
                          <g>
                            <path d="M14.23 2.854c.98-.977 2.56-.977 3.54 0l3.38 3.378c.97.977.97 2.559 0 3.536L9.91 21H3v-6.914L14.23 2.854zm2.12 1.414c-.19-.195-.51-.195-.7 0L5 14.914V19h4.09L19.73 8.354c.2-.196.2-.512 0-.708l-3.38-3.378zM14.75 19l-2 2H21v-2h-6.25z"></path>
                          </g>
                        </svg>
                      </span>

                      <span
                        className="chirp-bold-font"
                        style={{
                          marginLeft: "5px",
                          position: "relative",
                          top: "2px",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Quote
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      onClick={() => {
                        handleRepost(
                          detailedPostComment ? post.postId : post._id,
                          post
                        );
                        popupState.close();
                      }}
                      onMouseEnter={() => {
                        setHoveredOption("Repost");
                      }}
                      onMouseLeave={() => {
                        setHoveredOption(null);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          hoveredOption === "Repost" &&
                          themeName === "dark-theme"
                            ? "#181818"
                            : hoveredOption === "Repost" &&
                              themeName !== "dark-theme"
                            ? "#f7f7f7"
                            : "",
                        padding: "10px 18.77px",
                      }}
                    >
                      <span>
                        <svg
                          fill={themeName === "dark-theme" ? "white" : "black"}
                          width={`${1.25}em`}
                          height={`${1.25}em`}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-1q142lx"
                        >
                          <g>
                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                          </g>
                        </svg>
                      </span>

                      <span
                        className="chirp-bold-font"
                        style={{
                          marginLeft: "5px",
                          position: "relative",
                          top: "2px",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Repost
                      </span>
                    </div>
                    <div
                      onMouseEnter={() => {
                        setHoveredOption("Quote");
                      }}
                      onMouseLeave={() => {
                        setHoveredOption(null);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          hoveredOption === "Quote" &&
                          themeName === "dark-theme"
                            ? "#181818 "
                            : hoveredOption === "Quote" &&
                              themeName !== "dark-theme"
                            ? "#f7f7f7"
                            : "",
                        padding: "10px 18.77px",
                      }}
                    >
                      <span>
                        {" "}
                        <svg
                          fill={themeName === "dark-theme" ? "white" : "black"}
                          width={`${1.25}em`}
                          height={`${1.25}em`}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-1q142lx"
                        >
                          <g>
                            <path d="M14.23 2.854c.98-.977 2.56-.977 3.54 0l3.38 3.378c.97.977.97 2.559 0 3.536L9.91 21H3v-6.914L14.23 2.854zm2.12 1.414c-.19-.195-.51-.195-.7 0L5 14.914V19h4.09L19.73 8.354c.2-.196.2-.512 0-.708l-3.38-3.378zM14.75 19l-2 2H21v-2h-6.25z"></path>
                          </g>
                        </svg>
                      </span>

                      <span
                        className="chirp-bold-font"
                        style={{
                          marginLeft: "5px",
                          position: "relative",
                          top: "2px",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Quote
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Popover>
          </div>
        )}
      </PopupState>
    </>
  );
}

export default RepostAction;
