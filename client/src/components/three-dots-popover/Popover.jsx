import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Modal, Button } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import BootstrapTooltip from "../BootstrapToolTip/BootstrapToolTip";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function PostPopover({
  post,
  onClose,
  postDetailPageActive,
  postDeletionProcess,
  isCutePopoverOnRightSide,
  notificationPageComment,
  refreshPosts,
}) {
  const [{ themeName }] = useContext(ThemeContext);

  const { userInfo, getToken } = useContext(UserContext);
  const { getFontSizeAndLineHeight20, getFontSizeAndLineHeight15 } =
    useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const [showPostOptionsThreeDots, setshowPostOptionsThreeDots] =
    useState(false);

  const [hoveredOption, setHoveredOption] = useState(null);
  const [showDeletePostModal, setshowDeletePostModal] = useState(null);

  const [
    createdAnimationForClosingDeletePostModal,
    setCreatedAnimationForClosingDeletePostModal,
  ] = useState(null);

  const handleShowPostOptionsWithThreeDots = () => {
    setshowPostOptionsThreeDots(!showPostOptionsThreeDots);
  };
  const handleClose = () => {
    setshowDeletePostModal(false);
    setCreatedAnimationForClosingDeletePostModal(true);

    setTimeout(() => {
      setCreatedAnimationForClosingDeletePostModal(false);
    }, 250);
  };

  const handleShow = () => {
    setshowDeletePostModal(true);
  };
  const [threeDotsColor, setThreeDotsColor] = useState(null);

  const { contextHolder, pinnedMessage, unpinnedMessage } =
    useAntdMessageHandler();

  const handlePostDelete = (postId) => {
    handleClose();
    axios
      .post(
        `${API_URL}/posts/delete-post`,
        { userId: userInfo._id, postId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        refreshPosts();
        postDeletionProcess();
      })
      .catch((error) => {
        // tüm popoover kullanılan yerlerde aynı catch mesajı mevcut start to check INFO
        console.error("Error =>", error);
        // tüm popoover kullanılan yerlerde aynı catch mesajı mevcut finish to check INFO
      });
  };

  const [pinnedPost, setPinnedPost] = useState(null);
  const handleGetPinPostIfExist = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        const { user } = response.data;

        setPinnedPost(user.pinnedPosts[0]);
      })
      .catch((err) => {
        return err;
      });
  };

  useEffect(() => {
    if (getToken() && post) {
      handleGetPinPostIfExist();
    }
  }, []);

  const pinPost = async (postId) => {
    try {
      const result = await axios.patch(
        `${API_URL}/posts/${postId}/pin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const { message } = result.data;

      if (message === "Post pinned successfully") {
        pinnedMessage();
      } else if (message === "Post unpinned successfully") {
        unpinnedMessage();
      }
      setTimeout(() => {
        refreshPosts();
      }, 300);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <>
      {contextHolder}
      {/* delete post modal start to check  */}

      <Modal
        style={{
          padding: "0px",
          margin: "0px",
        }}
        centered
        show={showDeletePostModal}
        onHide={handleClose}
        backdropClassName={
          themeName === "dark-theme" ? `back-drop-${themeName}` : ""
        }
        className="delete-post"
        contentClassName={
          themeName === "dark-theme"
            ? "delete-post-modal-dark-theme"
            : "delete-post-modal"
        }
      >
        <Modal.Body style={{}}>
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
              Delete post ?
            </div>
            <div
              style={{
                color:
                  themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              className="mt-2"
            >
              This can’t be undone and it will be removed from your profile, the
              timeline of any accounts that follow you, and from search results.{" "}
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
              onClick={
                postDetailPageActive
                  ? () => {
                      handlePostDelete(post.postId);
                    }
                  : () => handlePostDelete(post._id)
              }
              className={`red-btn ${themeName}-red-btn`}
              style={{
                maxWidth: "256px",
                minHeight: "44px",
                color: "white",
                backgroundColor: "rgb(244, 33, 46)",
                border: "none",
              }}
            >
              Delete
            </Button>
            <Button
              variant="light"
              onClick={handleClose}
              style={{
                color: themeName === "dark-theme" ? "white" : "black",
                maxWidth: "256px",
                minHeight: "44px",
              }}
              className={`mt-2 forgot-password-btn ${themeName}-black-btn`}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* delete post modal finish to check  */}

      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            <Button
              style={{
                border: "none",
                backgroundColor: "transparent",
                margin: "0px",
                padding: "0px",
              }}
              variant="text"
              {...bindTrigger(popupState)}
            >
              {" "}
              <div onClick={handleShowPostOptionsWithThreeDots}>
                {" "}
                <BootstrapTooltip
                  title="More"
                  themeName={
                    themeName === "dark-theme" ? "dark-theme" : "light-theme"
                  }
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? `${themeName}-popover-post-detail-three-dots`
                        : `popover-post-detail-three-dots`
                    }
                    onMouseEnter={() => setThreeDotsColor(true)}
                    onMouseLeave={() => {
                      setThreeDotsColor(null);
                    }}
                    style={{
                      cursor: "pointer",
                      position: !postDetailPageActive ? "relative" : "",
                      right: isCutePopoverOnRightSide ? null : "16px",
                      top: isCutePopoverOnRightSide ? "5px" : "3px",
                      width: isCutePopoverOnRightSide ? "34px" : "40px",
                      height: isCutePopoverOnRightSide ? "34px" : "40px",

                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <svg
                      color={
                        themeName === "dark-theme" && !threeDotsColor
                          ? "#71767A"
                          : themeName !== "dark-theme" && !threeDotsColor
                          ? "rgb(83, 100, 113)"
                          : "#259ef0"
                      }
                      fill="currentColor"
                      width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
                      height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                    >
                      <g>
                        <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                      </g>
                    </svg>
                  </div>
                </BootstrapTooltip>
              </div>{" "}
            </Button>

            <Popover
              onClose={popupState.close}
              open={popupState.open}
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: -40,
                horizontal: "center",
              }}
              className={`${
                themeName === "dark-theme"
                  ? " popover-material-ui-dark-theme"
                  : themeName !== "dark-theme"
                  ? "popover-material-ui-light-theme"
                  : " hideshowMessageDeletePopover "
              }`}
              // className={`popover-content ${showDeletePostModal ? "open" : ""}`}
              style={{
                display: showDeletePostModal ? "none" : "",
                animation: createdAnimationForClosingDeletePostModal
                  ? "pageOpenAnimation 1s ease-in-out"
                  : null,
              }}
            >
              {post?.userId?._id === userInfo._id ? (
                <div
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "dark-theme-post-popover-detail soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                      : "post-popover-detail very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                  }
                >
                  <div
                    onMouseEnter={() => {
                      setHoveredOption("Delete");
                    }}
                    onMouseLeave={() => {
                      setHoveredOption(null);
                    }}
                    style={{
                      backgroundColor:
                        hoveredOption === "Delete" && themeName === "dark-theme"
                          ? "#181818"
                          : hoveredOption === "Delete" &&
                            themeName !== "dark-theme"
                          ? "#f7f7f7"
                          : "",
                    }}
                    onClick={() => {
                      setshowPostOptionsThreeDots(false);
                      handleShow();
                      // popupState.close();
                    }}
                  >
                    <span>
                      <svg
                        fill={
                          themeName === "dark-theme"
                            ? "rgb(244, 33, 46)"
                            : "rgb(244, 33, 46)"
                        }
                        width={`${1.25}em`}
                        height={`${1.25}em`}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1q142lx r-9l7dzd"
                      >
                        <g>
                          <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z"></path>
                        </g>
                      </svg>
                    </span>

                    <span
                      className="chirp-bold-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "rgb(244, 33, 46)"
                            : "rgb(244, 33, 46)",
                        marginLeft: "10px",
                      }}
                    >
                      Delete
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      pinPost(post._id);
                      popupState.close();
                      onClose();
                    }}
                    onMouseEnter={() => {
                      setHoveredOption("Pin to your profile");
                    }}
                    onMouseLeave={() => {
                      setHoveredOption(null);
                    }}
                    style={{
                      backgroundColor:
                        hoveredOption === "Pin to your profile" &&
                        themeName === "dark-theme"
                          ? "#181818"
                          : hoveredOption === "Pin to your profile" &&
                            themeName !== "dark-theme"
                          ? "#f7f7f7"
                          : "",
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
                          <path d="M17 9.76V4.5C17 3.12 15.88 2 14.5 2h-5C8.12 2 7 3.12 7 4.5v5.26L3.88 16H11v5l1 2 1-2v-5h7.12L17 9.76zM7.12 14L9 10.24V4.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v5.74L16.88 14H7.12z"></path>
                        </g>
                      </svg>
                    </span>

                    <span
                      className="chirp-bold-font"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      {pinnedPost?._id === post?._id
                        ? "Unpin from profile"
                        : "  Pin to your profile"}
                    </span>
                  </div>
                  {/* <div
                    onMouseEnter={() => {
                      setHoveredOption("Highlight on your profile");
                    }}
                    onMouseLeave={() => {
                      setHoveredOption(null);
                    }}
                    style={{
                      backgroundColor:
                        hoveredOption === "Highlight on your profile" &&
                        themeName === "dark-theme"
                          ? "#181818"
                          : hoveredOption === "Highlight on your profile" &&
                            themeName !== "dark-theme"
                          ? "#f7f7f7"
                          : "",
                      opacity: "0.5",
                      cursor: "default",
                      pointerEvents: "none",
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
                          <path d="M2 4c1.66 0 3-1.34 3-3h1c0 1.66 1.34 3 3 3v1C7.34 5 6 6.34 6 8H5c0-1.66-1.34-3-3-3V4zm7.89 4.9C11.26 7.53 12 5.35 12 2h2c0 3.35.74 5.53 2.1 6.9 1.36 1.36 3.55 2.1 6.9 2.1v2c-3.35 0-5.54.74-6.9 2.1-1.36 1.37-2.1 3.55-2.1 6.9h-2c0-3.35-.74-5.53-2.11-6.9C8.53 13.74 6.35 13 3 13v-2c3.35 0 5.53-.74 6.89-2.1zm7.32 3.1c-.97-.42-1.81-.97-2.53-1.69-.71-.71-1.27-1.56-1.68-2.52-.42.96-.98 1.81-1.69 2.52-.72.72-1.56 1.27-2.53 1.69.97.42 1.81.97 2.53 1.69.71.71 1.27 1.56 1.69 2.52.41-.96.97-1.81 1.68-2.52.72-.72 1.56-1.27 2.53-1.69z"></path>
                        </g>
                      </svg>
                    </span>

                    <span
                      className="chirp-bold-font"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      Highlight on your profile
                    </span>
                  </div>
                  <div
                    onMouseEnter={() => {
                      setHoveredOption("Add/remove");
                    }}
                    onMouseLeave={() => {
                      setHoveredOption(null);
                    }}
                    style={{
                      backgroundColor:
                        hoveredOption === "Add/remove" &&
                        themeName === "dark-theme"
                          ? "#181818"
                          : hoveredOption === "Add/remove" &&
                            themeName !== "dark-theme"
                          ? "#f7f7f7"
                          : "",
                      opacity: "0.5",
                      cursor: "default",
                      pointerEvents: "none",
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
                          <path d="M5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5H12v2H5.5C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5V13h-2V4.5c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2zm10 7v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
                        </g>
                      </svg>
                    </span>
                    <span
                      className="chirp-bold-font"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      Add/remove <span>@{post.userId.username}</span> from Lists
                    </span>
                  </div>
                  <div
                    onMouseEnter={() => {
                      setHoveredOption("Change who can reply");
                    }}
                    onMouseLeave={() => {
                      setHoveredOption(null);
                    }}
                    style={{
                      backgroundColor:
                        hoveredOption === "Change who can reply" &&
                        themeName === "dark-theme"
                          ? "#181818"
                          : hoveredOption === "Change who can reply" &&
                            themeName !== "dark-theme"
                          ? "#f7f7f7"
                          : "",
                      opacity: "0.5",
                      cursor: "default",
                      pointerEvents: "none",
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
                          <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                        </g>
                      </svg>
                    </span>
                    <span
                      className="chirp-bold-font"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      Change who can reply
                    </span>
                  </div> */}
                  {/* <div
                    onMouseEnter={() => {
                      setHoveredOption("View post engagements");
                    }}
                    onMouseLeave={() => {
                      setHoveredOption(null);
                    }}
                    style={{
                      backgroundColor:
                        hoveredOption === "View post engagements" &&
                        themeName === "dark-theme"
                          ? "#181818"
                          : hoveredOption === "View post engagements" &&
                            themeName !== "dark-theme"
                          ? "#f7f7f7"
                          : "",
                      opacity: "0.5",
                      cursor: "default",
                      pointerEvents: "none",
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
                          <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
                        </g>
                      </svg>
                    </span>

                    <span
                      className="chirp-bold-font"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      View post engagements
                    </span>
                  </div>
                  <div
                    onMouseEnter={() => {
                      setHoveredOption("Embed post");
                    }}
                    onMouseLeave={() => {
                      setHoveredOption(null);
                    }}
                    style={{
                      backgroundColor:
                        hoveredOption === "Embed post" &&
                        themeName === "dark-theme"
                          ? "#181818"
                          : hoveredOption === "Embed post" &&
                            themeName !== "dark-theme"
                          ? "#f7f7f7"
                          : "",
                      opacity: "0.5",
                      cursor: "default",
                      pointerEvents: "none",
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
                          <path d="M15.24 4.31l-4.55 15.93-1.93-.55 4.55-15.93 1.93.55zm-8.33 3.6L3.33 12l3.58 4.09-1.5 1.32L.67 12l4.74-5.41 1.5 1.32zm11.68-1.32L23.33 12l-4.74 5.41-1.5-1.32L20.67 12l-3.58-4.09 1.5-1.32z"></path>
                        </g>
                      </svg>
                    </span>

                    <span
                      className="chirp-bold-font"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      Embed post
                    </span>
                  </div> */}
                  {/* <div
                    onMouseEnter={() => {
                      setHoveredOption("View post analytics");
                    }}
                    onMouseLeave={() => {
                      setHoveredOption(null);
                    }}
                    style={{
                      backgroundColor:
                        hoveredOption === "View post analytics" &&
                        themeName === "dark-theme"
                          ? "#181818"
                          : hoveredOption === "View post analytics" &&
                            themeName !== "dark-theme"
                          ? "#f7f7f7"
                          : "",
                      opacity: "0.5",
                      cursor: "default",
                      pointerEvents: "none",
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
                          <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
                        </g>
                      </svg>
                    </span>

                    <span
                      className="chirp-bold-font"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      View post analytics
                    </span>
                  </div> */}
                </div>
              ) : // <div
              //   className={
              //     themeName === "dark-theme"
              //       ? "dark-theme-post-popover-detail"
              //       : "post-popover-detail"
              //   }
              //   style={{
              //     maxHeight: isCutePopoverOnRightSide ? "250px" : "",
              //     overflowY: isCutePopoverOnRightSide ? "auto" : "",
              //     colorScheme:
              //       isCutePopoverOnRightSide && themeName === "dark-theme"
              //         ? "dark"
              //         : isCutePopoverOnRightSide && themeName !== "dark-theme"
              //         ? "light"
              //         : null,
              //   }}
              // >
              //   <div
              //     onMouseEnter={() => {
              //       setHoveredOption("Follow");
              //     }}
              //     onMouseLeave={() => {
              //       setHoveredOption(null);
              //     }}
              //     style={{
              //       backgroundColor:
              //         hoveredOption === "Follow" && themeName === "dark-theme"
              //           ? "#181818"
              //           : hoveredOption === "Follow" &&
              //             themeName !== "dark-theme"
              //           ? "#f7f7f7"
              //           : "",
              //       opacity: "0.5",
              //       cursor: "default",
              //       pointerEvents: "none",
              //     }}
              //   >
              //     <span>
              //       <svg
              //         fill={themeName === "dark-theme" ? "white" : "black"}
              //         width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         viewBox="0 0 24 24"
              //         aria-hidden="true"
              //         className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"
              //       >
              //         <g>
              //           <path d="M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm13 4v3h2v-3h3V8h-3V5h-2v3h-3v2h3zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z"></path>
              //         </g>
              //       </svg>
              //     </span>
              //     <span>
              //       <span
              //         className={
              //           themeName === "dark-theme"
              //             ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //             : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //         }
              //         style={{
              //           marginLeft: "10px",
              //           fontSize: isCutePopoverOnRightSide && "13px",
              //           lineHeight: isCutePopoverOnRightSide && "20px",
              //         }}
              //       >
              //         Follow
              //       </span>{" "}
              //       <span
              //         className={
              //           themeName === "dark-theme"
              //             ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //             : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //         }
              //         style={{
              //           fontSize: isCutePopoverOnRightSide && "13px",
              //           lineHeight: isCutePopoverOnRightSide && "20px",
              //         }}
              //       >
              //         @{post?.userId?.username}
              //       </span>
              //     </span>
              //   </div>
              //   <div
              //     onMouseEnter={() => {
              //       setHoveredOption("Subscribe");
              //     }}
              //     onMouseLeave={() => {
              //       setHoveredOption(null);
              //     }}
              //     style={{
              //       backgroundColor:
              //         hoveredOption === "Subscribe" &&
              //         themeName === "dark-theme"
              //           ? "#181818"
              //           : hoveredOption === "Subscribe" &&
              //             themeName !== "dark-theme"
              //           ? "#f7f7f7"
              //           : "",
              //       opacity: "0.5",
              //       cursor: "default",
              //       pointerEvents: "none",
              //     }}
              //   >
              //     <span>
              //       <svg
              //         fill={themeName === "dark-theme" ? "white" : "black"}
              //         width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         viewBox="0 0 24 24"
              //         aria-hidden="true"
              //         className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"
              //       >
              //         <g>
              //           <path d="M12 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM8 6c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm4 7c-1.84 0-3.32.65-4.4 1.81-.93.98-1.61 2.39-1.95 4.19h5.85v2H3.4l.1-1.1c.27-2.66 1.16-4.88 2.64-6.46C7.63 11.85 9.65 11 12 11c.91 0 1.78.13 2.58.38l-.9 1.82c-.52-.13-1.08-.2-1.68-.2zm5-2l1.76 3.57 3.95.58-2.86 2.78.68 3.92L17 20l-3.53 1.85.68-3.92-2.86-2.78 3.95-.58L17 11z"></path>
              //         </g>
              //       </svg>
              //     </span>
              //     <span>
              //       <span
              //         className={
              //           themeName === "dark-theme"
              //             ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //             : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //         }
              //         style={{
              //           marginLeft: "10px",
              //           fontSize: isCutePopoverOnRightSide && "13px",
              //           lineHeight: isCutePopoverOnRightSide && "20px",
              //         }}
              //       >
              //         Subscribe to
              //       </span>{" "}
              //       <span
              //         className={
              //           themeName === "dark-theme"
              //             ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //             : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //         }
              //         style={{
              //           fontSize: isCutePopoverOnRightSide && "13px",
              //           lineHeight: isCutePopoverOnRightSide && "20px",
              //         }}
              //       >
              //         @{post?.userId?.username}
              //       </span>
              //     </span>
              //   </div>
              //   <div
              //     onMouseEnter={() => {
              //       setHoveredOption("Add/remove");
              //     }}
              //     onMouseLeave={() => {
              //       setHoveredOption(null);
              //     }}
              //     style={{
              //       backgroundColor:
              //         hoveredOption === "Add/remove" &&
              //         themeName === "dark-theme"
              //           ? "#181818"
              //           : hoveredOption === "Add/remove" &&
              //             themeName !== "dark-theme"
              //           ? "#f7f7f7"
              //           : "",
              //       opacity: "0.5",
              //       cursor: "default",
              //       pointerEvents: "none",
              //     }}
              //   >
              //     <span>
              //       <svg
              //         fill={themeName === "dark-theme" ? "white" : "black"}
              //         width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         viewBox="0 0 24 24"
              //         aria-hidden="true"
              //         className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"
              //       >
              //         <g>
              //           <path d="M5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5H12v2H5.5C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5V13h-2V4.5c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2zm10 7v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
              //         </g>
              //       </svg>
              //     </span>
              //     <span
              //       className={
              //         themeName === "dark-theme"
              //           ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //           : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //       }
              //       style={{
              //         marginLeft: "10px",
              //         fontSize: isCutePopoverOnRightSide && "13px",
              //         lineHeight: isCutePopoverOnRightSide && "20px",
              //       }}
              //     >
              //       <span className="chirp-bold-font">Add/remove</span>{" "}
              //       <span className="chirp-bold-font">
              //         @{post?.userId?.username}
              //       </span>{" "}
              //       <span className="chirp-bold-font">from Lists</span>
              //     </span>
              //   </div>
              //   <div
              //     onMouseEnter={() => {
              //       setHoveredOption("Mute");
              //     }}
              //     onMouseLeave={() => {
              //       setHoveredOption(null);
              //     }}
              //     style={{
              //       backgroundColor:
              //         hoveredOption === "Mute" && themeName === "dark-theme"
              //           ? "#181818"
              //           : hoveredOption === "Mute" &&
              //             themeName !== "dark-theme"
              //           ? "#f7f7f7"
              //           : "",
              //       opacity: "0.5",
              //       cursor: "default",
              //       pointerEvents: "none",
              //     }}
              //   >
              //     <span>
              //       <svg
              //         fill={themeName === "dark-theme" ? "white" : "black"}
              //         width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         viewBox="0 0 24 24"
              //         aria-hidden="true"
              //         className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"
              //       >
              //         <g>
              //           <path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path>
              //         </g>
              //       </svg>
              //     </span>
              //     <span
              //       style={{
              //         marginLeft: "10px",
              //       }}
              //     >
              //       <span
              //         className={
              //           themeName === "dark-theme"
              //             ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //             : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //         }
              //         style={{
              //           fontSize: isCutePopoverOnRightSide && "13px",
              //           lineHeight: isCutePopoverOnRightSide && "20px",
              //         }}
              //       >
              //         Mute
              //       </span>{" "}
              //       <span
              //         className={
              //           themeName === "dark-theme"
              //             ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //             : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //         }
              //         style={{
              //           fontSize: isCutePopoverOnRightSide && "13px",
              //           lineHeight: isCutePopoverOnRightSide && "20px",
              //         }}
              //       >
              //         @{post?.userId?.username}
              //       </span>
              //     </span>
              //   </div>
              //   <div
              //     onMouseEnter={() => {
              //       setHoveredOption("Block");
              //     }}
              //     onMouseLeave={() => {
              //       setHoveredOption(null);
              //     }}
              //     style={{
              //       backgroundColor:
              //         hoveredOption === "Block" && themeName === "dark-theme"
              //           ? "#181818"
              //           : hoveredOption === "Block" &&
              //             themeName !== "dark-theme"
              //           ? "#f7f7f7"
              //           : "",
              //       opacity: "0.5",
              //       cursor: "default",
              //       pointerEvents: "none",
              //     }}
              //   >
              //     <span>
              //       <svg
              //         fill={themeName === "dark-theme" ? "white" : "black"}
              //         width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         viewBox="0 0 24 24"
              //         aria-hidden="true"
              //         className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"
              //       >
              //         <g>
              //           <path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path>
              //         </g>
              //       </svg>
              //     </span>
              //     <span
              //       style={{
              //         marginLeft: "10px",
              //       }}
              //     >
              //       <span
              //         className={
              //           themeName === "dark-theme"
              //             ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //             : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //         }
              //         style={{
              //           fontSize: isCutePopoverOnRightSide && "13px",
              //           lineHeight: isCutePopoverOnRightSide && "20px",
              //         }}
              //       >
              //         Block
              //       </span>{" "}
              //       <span
              //         className={
              //           themeName === "dark-theme"
              //             ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //             : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //         }
              //         style={{
              //           fontSize: isCutePopoverOnRightSide && "13px",
              //           lineHeight: isCutePopoverOnRightSide && "20px",
              //         }}
              //       >
              //         @{post?.userId?.username}
              //       </span>
              //     </span>
              //   </div>
              //   <div
              //     onMouseEnter={() => {
              //       setHoveredOption("View post engagements");
              //     }}
              //     onMouseLeave={() => {
              //       setHoveredOption(null);
              //     }}
              //     style={{
              //       backgroundColor:
              //         hoveredOption === "View post engagements" &&
              //         themeName === "dark-theme"
              //           ? "#181818"
              //           : hoveredOption === "View post engagements" &&
              //             themeName !== "dark-theme"
              //           ? "#f7f7f7"
              //           : "",
              //       opacity: "0.5",
              //       cursor: "default",
              //       pointerEvents: "none",
              //     }}
              //   >
              //     <span>
              //       <svg
              //         fill={themeName === "dark-theme" ? "white" : "black"}
              //         width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         viewBox="0 0 24 24"
              //         aria-hidden="true"
              //         className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"
              //       >
              //         <g>
              //           <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
              //         </g>
              //       </svg>
              //     </span>
              //     <span
              //       className={
              //         themeName === "dark-theme"
              //           ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //           : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //       }
              //       style={{
              //         marginLeft: "10px",
              //         fontSize: isCutePopoverOnRightSide && "13px",
              //         lineHeight: isCutePopoverOnRightSide && "20px",
              //       }}
              //     >
              //       View post engagements
              //     </span>
              //   </div>
              //   <div
              //     onMouseEnter={() => {
              //       setHoveredOption("Embed post");
              //     }}
              //     onMouseLeave={() => {
              //       setHoveredOption(null);
              //     }}
              //     style={{
              //       backgroundColor:
              //         hoveredOption === "Embed post" &&
              //         themeName === "dark-theme"
              //           ? "#181818"
              //           : hoveredOption === "Embed post" &&
              //             themeName !== "dark-theme"
              //           ? "#f7f7f7"
              //           : "",
              //       opacity: "0.5",
              //       cursor: "default",
              //       pointerEvents: "none",
              //     }}
              //   >
              //     <span>
              //       <svg
              //         fill={themeName === "dark-theme" ? "white" : "black"}
              //         width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         viewBox="0 0 24 24"
              //         aria-hidden="true"
              //         className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"
              //       >
              //         <g>
              //           <path d="M15.24 4.31l-4.55 15.93-1.93-.55 4.55-15.93 1.93.55zm-8.33 3.6L3.33 12l3.58 4.09-1.5 1.32L.67 12l4.74-5.41 1.5 1.32zm11.68-1.32L23.33 12l-4.74 5.41-1.5-1.32L20.67 12l-3.58-4.09 1.5-1.32z"></path>
              //         </g>
              //       </svg>
              //     </span>
              //     <span
              //       className={
              //         themeName === "dark-theme"
              //           ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //           : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //       }
              //       style={{
              //         marginLeft: "10px",
              //         fontSize: isCutePopoverOnRightSide && "13px",
              //         lineHeight: isCutePopoverOnRightSide && "20px",
              //       }}
              //     >
              //       Embed post
              //     </span>
              //   </div>
              //   <div
              //     onMouseEnter={() => {
              //       setHoveredOption("Report post");
              //     }}
              //     onMouseLeave={() => {
              //       setHoveredOption(null);
              //     }}
              //     style={{
              //       backgroundColor:
              //         hoveredOption === "Report post" &&
              //         themeName === "dark-theme"
              //           ? "#181818"
              //           : hoveredOption === "Report post" &&
              //             themeName !== "dark-theme"
              //           ? "#f7f7f7"
              //           : "",
              //       opacity: "0.5",
              //       cursor: "default",
              //       pointerEvents: "none",
              //     }}
              //   >
              //     <span>
              //       <svg
              //         fill={themeName === "dark-theme" ? "white" : "black"}
              //         width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         viewBox="0 0 24 24"
              //         aria-hidden="true"
              //         className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"
              //       >
              //         <g>
              //           <path d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"></path>
              //         </g>
              //       </svg>
              //     </span>
              //     <span
              //       className={
              //         themeName === "dark-theme"
              //           ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //           : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //       }
              //       style={{
              //         marginLeft: "10px",
              //         fontSize: isCutePopoverOnRightSide && "13px",
              //         lineHeight: isCutePopoverOnRightSide && "20px",
              //       }}
              //     >
              //       Report post
              //     </span>
              //   </div>
              //   <div
              //     onMouseEnter={() => {
              //       setHoveredOption("Report EU illegal content");
              //     }}
              //     onMouseLeave={() => {
              //       setHoveredOption(null);
              //     }}
              //     style={{
              //       backgroundColor:
              //         hoveredOption === "Report EU illegal content" &&
              //         themeName === "dark-theme"
              //           ? "#181818"
              //           : hoveredOption === "Report EU illegal content" &&
              //             themeName !== "dark-theme"
              //           ? "#f7f7f7"
              //           : "",
              //       opacity: "0.5",
              //       cursor: "default",
              //       pointerEvents: "none",
              //     }}
              //   >
              //     {" "}
              //     <span>
              //       <svg
              //         fill={themeName === "dark-theme" ? "white" : "black"}
              //         width={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         height={isCutePopoverOnRightSide ? "1em" : `${1.25}em`}
              //         viewBox="0 0 24 24"
              //         aria-hidden="true"
              //         className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"
              //       >
              //         <g>
              //           <path d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"></path>
              //         </g>
              //       </svg>
              //     </span>
              //     <span
              //       className={
              //         themeName === "dark-theme"
              //           ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
              //           : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              //       }
              //       style={{
              //         marginLeft: "10px",
              //         fontSize: isCutePopoverOnRightSide && "13px",
              //         lineHeight: isCutePopoverOnRightSide && "20px",
              //       }}
              //     >
              //       Report EU illegal content
              //     </span>
              //   </div>
              // </div>
              null}
            </Popover>
          </div>
        )}
      </PopupState>
    </>
  );
}

export default PostPopover;
