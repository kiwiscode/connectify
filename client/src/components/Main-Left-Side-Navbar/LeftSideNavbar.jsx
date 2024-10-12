import { useEffect, useState, useContext, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import LogoutModal from "./LogoutModal";
import axios from "axios";

import { Button, Modal, Stack, Col } from "react-bootstrap";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { ModalVisibilityContext } from "../../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import BootstrapTooltip from "../BootstrapToolTip/BootstrapToolTip";
import { FontSizeContext } from "../../context/FontSizeContext";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const API_URL = import.meta.env.VITE_APP_API_URL;
const FRONTEND_URL = import.meta.env.VITE_APP_API_URL;

function LeftSideNavBar({ refreshPosts, setIsPostShared }) {
  const [{ theme, themeName }] = useContext(ThemeContext);
  const {
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight11,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
  } = useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font11 = getFontSizeAndLineHeight11();
  const { fontSize, setFontSize } = useContext(FontSizeContext);
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { getToken, userInfo } = useContext(UserContext);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");
  const maxCharacters = 140;

  const [modalImage, setModalImage] = useState("");
  //handle and convert it in base 64
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setModalImage(reader.result);
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

  const { postSharedMessage, contextHolder } = useAntdMessageHandler();
  const [
    postSharingStartedActivateAnimate,
    setPostSharingStartedActivateAnimate,
  ] = useState(null);
  const [postSharingPausedAnimate, setPostSharingPausedAnimate] =
    useState(null);
  const handlePost = () => {
    setPostSharingStartedActivateAnimate(true);

    if (content || chosenEmoji || modalImage) {
      axios
        .post(
          `${API_URL}/posts`,
          {
            content,
            modalImage,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )

        .then((response) => {
          setTimeout(() => {
            if (!modalImage) {
              setPostSharingPausedAnimate(true);
            }
          }, 400);
          setTimeout(() => {
            setPostSharingPausedAnimate(false);
            setPostSharingStartedActivateAnimate(false);
            postSharedMessage(
              response.data.createdPost.authorUserName,
              response.data.createdPost._id
            );
            if (refreshPosts) {
              refreshPosts();
            }
            setIsPostShared(false);
            setModalImage("");
            setContent("");
            handleClose();
          }, 500);
        })
        .catch((err) => {
          return err;
        });
    } else {
      handleShow();
    }
  };

  const closeImage = () => {
    setModalImage("");
  };

  const onEmojiClick = (emojiObject) => {
    const sym = emojiObject.unified.split("_");
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);

    setChosenEmoji(emoji);
    setContent((prevText) => prevText + emoji);
  };

  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const getActiveUserInfo = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/notifications/unread-notifications`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const unreadNotifications = await response.data.unReadNotifications;

      setUnReadNotifications(unreadNotifications);
    } catch (error) {
      console.error(
        "An error occurred while fetching active user info:",
        error
      );
    }
  };

  const changeNotificationReadedStatus = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/notifications/mark-as-read`,
        {
          userId: userInfo._id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (response) {
        getActiveUserInfo();
      }
      console.log("Response from db =>", response);
    } catch (error) {
      console.error(
        "An error occurred while changing active user notification readed status:",
        error
      );
    }
  };
  useEffect(() => {
    getActiveUserInfo();
  }, []);
  const { width } = useWindowDimensions();

  const [userMessageDetails, setUserMessageDetails] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/all-messages`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((responseForMessages) => {
        setUserMessageDetails(responseForMessages.data.messages);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  }, []);

  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState(null);

  const getUnreadMessages = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/users/${userInfo._id}/messages/unread`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setNumberOfUnreadMessages(result.data.length);
      console.log("result for unread messages:", result);
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    getUnreadMessages();
  }, [path]);

  console.log("unread messages:", getUnreadMessages());

  const { togglePostModalVisibility } = useContext(ModalVisibilityContext);

  const handleClose = () => {
    setShow(false);
    togglePostModalVisibility();
  };
  const handleShow = () => {
    setShow(true);
    togglePostModalVisibility();
  };
  return (
    <>
      <Modal
        backdropClassName={
          themeName === "dark-theme" ? `back-drop-${themeName}` : ""
        }
        style={{
          margin: "0px",
          padding: "0px",
          zIndex: 99999,
        }}
        dialogClassName={width <= 700 ? "modal-fullscreen" : ""}
        className={
          width <= 700 && themeName !== "dark-theme"
            ? ""
            : width <= 700 && themeName === "dark-theme"
            ? `width-smaller-700-post-modal-left-side-navigation-bar width-smaller-700-post-modal-left-side-navigation-bar-${themeName}`
            : `post-modal-from-left-side-navigation-bar post-modal-from-left-side-navigation-bar-${themeName}`
        }
        show={show}
        onHide={handleClose}
      >
        <div
          className={
            postSharingStartedActivateAnimate && !postSharingPausedAnimate
              ? "post_sharing_line_animation"
              : postSharingPausedAnimate
              ? "paused"
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
          }}
        ></div>
        <>
          <div
            onClick={handleClose}
            style={{
              cursor: "pointer",
              padding: "12px",
            }}
          >
            <div
              className={
                themeName === "dark-theme"
                  ? `close-button-${themeName}`
                  : `close-button`
              }
              style={{
                display: "inline-flex",
                borderRadius: "50%",
              }}
            >
              <svg
                style={{
                  border: "none",
                  margin: "5px",
                }}
                onClick={handleClose}
                width={20}
                height={20}
                color={themeName === "dark-theme" ? "white" : "rgb(15,20,25)"}
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
          </div>

          <Modal.Body
            className={`scrollbar-post-modal scrollbar-post-modal-${themeName}`}
          >
            <Stack direction="horizontal" gap={1}>
              <div className="p-0">
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
                    <img
                      style={{
                        position: "relative",
                        bottom: "30px",
                        borderRadius: "50%",
                      }}
                      width="40"
                      height="40"
                      src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                      alt=""
                    />
                  </div>
                )}
              </div>
              <div className="p-0 ">
                <textarea
                  autoFocus
                  onChange={handleChange}
                  rows="4"
                  cols="50"
                  value={content}
                  maxLength={maxCharacters}
                  className="input-post chirp-regular-font"
                  placeholder="What is happening?!"
                  style={{
                    resize: "none",
                    padding: "8px",
                    color:
                      themeName === "dark-theme"
                        ? "white"
                        : "rgba(15,20,25,1.00)",
                    fontWeight: "400",
                    lineHeight: content ? font15.lineHeight : font20.lineHeight,
                    fontSize: content ? font15.fontSize : font20.fontSize,
                    width: "100%",
                    height: "100px",
                    backgroundColor:
                      themeName === "dark-theme" ? "black" : "transparent",
                  }}
                />
              </div>
            </Stack>
            <div className="d-flex align-items-center">
              <div className="p-2">
                {/* start to check */}

                {/* finish to check */}
              </div>
              <div className="p-2">
                {modalImage && (
                  <div style={{ position: "relative" }}>
                    <div
                      className="close-image-button"
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#4B4F52",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={closeImage}
                    >
                      <div>
                        <div>
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
                      src={modalImage ? modalImage : ""}
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>

          <div
            style={{
              borderTop:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
              padding: "2px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
            className="post-modal-footer"
          >
            <Stack direction="horizontal" gap={0}>
              {/* INFO */}
              <BootstrapTooltip
                title="Media"
                themeName={
                  themeName === "dark-theme" ? "dark-theme" : "light-theme"
                }
              >
                <div
                  style={{
                    position: "relative",
                  }}
                  onClick={() =>
                    document.getElementById("formuploadModal").click()
                  }
                >
                  <div
                    style={{
                      // border: "1px solid black",
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
                    id="formuploadModal"
                    name="modalImage"
                    className="form-control"
                    style={{ display: "none" }}
                  />
                </div>
              </BootstrapTooltip>
              {/* INFO */}

              <div>
                {/* emoji mart start to check */}
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
                        style={{
                          zIndex: 99999, // should bigger than post modal
                        }}
                      >
                        <Picker
                          autoFocus
                          theme={themeName === "dark-theme" ? "dark" : "light"}
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
                {/* emoji mart finish to check */}
              </div>
              <div className="p-2 ms-auto chirp-bold-font">
                {/* <div className="p-2 "> */}{" "}
                {content !== "" || modalImage ? (
                  <Button
                    style={{
                      border: "none",
                    }}
                    variant="primary"
                    onClick={() => {
                      handlePost();
                      refreshPosts();
                    }}
                    className={`post-btn compose-tweet-textArea chirp-bold-font blue-btn`}
                  >
                    Post
                  </Button>
                ) : (
                  <Button
                    style={{
                      border: "none",
                      cursor: "default",
                      pointerEvents: "none",
                    }}
                    variant="primary"
                    className={`emptyContent post-btn compose-tweet-textArea chirp-bold-font blue-btn-disabled`}
                  >
                    Post
                  </Button>
                )}
              </div>
            </Stack>
          </div>
        </>
      </Modal>
      {contextHolder}

      {width <= 1201 ? (
        <>
          {width <= 500 ? null : (
            <Col
              className="main-column-left-side-nav-bar"
              style={{
                padding: "0px",
                margin: "0px",
                display: "flex",
                justifyContent: "center",
                minWidth: "fit-content",
              }}
              xs={1} // 0px - 576px aralığı
              sm={1} // 576px - 768px aralığı
              md={1} // 768px - 992px aralığı
              lg={1} // 992px - 1400px aralığı
            >
              <div
                style={{
                  position: "fixed",
                }}
              >
                <Stack
                  style={{
                    textAlign: "center",
                  }}
                  direction="vertical"
                >
                  <NavLink
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    to={"/home"}
                  >
                    {" "}
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "hover-home-dark-theme"
                            : "hover-home"
                        }
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={50}
                          height={30}
                          viewBox="0 0 100 100"
                        >
                          {/* İçi dolu bir kare */}
                          <rect
                            x="5"
                            y="5"
                            width="90"
                            height="90"
                            fill="#1C9BEF"
                            rx="5"
                            ry="5"
                            style={{
                              filter:
                                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                            }}
                          />

                          <text
                            x="27.5"
                            y="70"
                            fontFamily="Arial"
                            fontSize="60"
                            fill="#FFF"
                            stroke="#FFF"
                            strokeWidth="2"
                          >
                            C
                          </text>
                        </svg>
                      </div>
                    </span>
                  </NavLink>
                  {/* navigation linkler start to check */}
                  <NavLink
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    to={"/home"}
                  >
                    {" "}
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "hover-home-dark-theme"
                            : "hover-home"
                        }
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <BootstrapTooltip
                          title="Home"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <svg
                            color={themeName === "dark-theme" ? "#E7E9EA" : ""}
                            fill="currentColor"
                            style={{}}
                            width={`${1.75}rem`}
                            height={`${1.75}rem`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="home-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                          >
                            <g className="home-svg-group">
                              {window.location.href ===
                              `${FRONTEND_URL}/home` ? (
                                <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
                              ) : (
                                <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
                              )}
                            </g>
                          </svg>{" "}
                        </BootstrapTooltip>
                      </div>
                    </span>
                  </NavLink>
                  <NavLink
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    to={"/explore"}
                  >
                    {" "}
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "hover-home-dark-theme"
                            : "hover-home"
                        }
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <BootstrapTooltip
                          title="Explore"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <svg
                            color={
                              themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"
                            }
                            fill="currentColor"
                            style={{}}
                            width={`${1.25}rem`}
                            height={`${1.25}rem`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="home-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                          >
                            <g className="home-svg-group">
                              {window.location.href ===
                              `${FRONTEND_URL}/explore` ? (
                                <path d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z"></path>
                              ) : (
                                <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                              )}
                            </g>
                          </svg>
                        </BootstrapTooltip>
                      </div>
                    </span>
                  </NavLink>
                  <NavLink
                    onClick={changeNotificationReadedStatus}
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    to={"/notifications"}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "hover-home-dark-theme"
                            : "hover-home"
                        }
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {width <= 1201 && (
                          <>
                            {unReadNotifications?.length !== 0 && (
                              <div
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "rgb(29, 155, 240)",
                                  borderRadius: "50%",
                                  border: "1px solid white",
                                  width: "18px",
                                  height: "18px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "absolute",
                                  left: "50%",
                                  top: "4px",
                                }}
                              >
                                {" "}
                                <span
                                  className="chirp-regular-font"
                                  style={{
                                    color: "white",
                                    fontSize: font11.fontSize,
                                    lineHeight: font11.lineHeight,
                                  }}
                                >
                                  {unReadNotifications?.length}
                                </span>
                              </div>
                            )}
                          </>
                        )}{" "}
                        <BootstrapTooltip
                          title="Notifications"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <svg
                            style={{}}
                            color={
                              themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"
                            }
                            fill="currentColor"
                            width={`${1.75}rem`}
                            height={`${1.75}rem`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="notifications-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                          >
                            <g className="notifications-svg-group">
                              {window.location.href ===
                              `${FRONTEND_URL}/notifications` ? (
                                <path d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z"></path>
                              ) : (
                                <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path>
                              )}
                            </g>
                          </svg>{" "}
                        </BootstrapTooltip>
                      </div>
                    </span>
                  </NavLink>
                  <NavLink
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    to={"/messages"}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "hover-home-dark-theme"
                            : "hover-home"
                        }
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {width <= 1201 && (
                          <>
                            {numberOfUnreadMessages ? (
                              <div
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "rgb(29, 155, 240)",
                                  borderRadius: "50%",
                                  border: "1px solid white",
                                  width: "18px",
                                  height: "18px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "absolute",
                                  left: "50%",
                                  top: "4px",
                                }}
                              >
                                {" "}
                                <span
                                  className="chirp-regular-font"
                                  style={{
                                    color: "white",
                                    fontSize: font11.fontSize,
                                    lineHeight: font11.lineHeight,
                                  }}
                                >
                                  {/* bunu sil ve direkt olarak okunmayan mesaj sayısını backendden al route kurup */}
                                  {numberOfUnreadMessages}
                                </span>
                              </div>
                            ) : null}
                          </>
                        )}{" "}
                        <BootstrapTooltip
                          title="Messages"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <svg
                            color={
                              themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"
                            }
                            fill="currentColor"
                            width={`${1.75}rem`}
                            height={`${1.75}rem`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="messages-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                          >
                            <g className="messages-svg-group">
                              {window.location.href ===
                              `${FRONTEND_URL}/messages` ? (
                                <path d="M1.998 4.499c0-.828.671-1.499 1.5-1.499h17c.828 0 1.5.671 1.5 1.499v2.858l-10 4.545-10-4.547V4.499zm0 5.053V19.5c0 .828.671 1.5 1.5 1.5h17c.828 0 1.5-.672 1.5-1.5V9.554l-10 4.545-10-4.547z"></path>
                              ) : (
                                <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                              )}
                            </g>
                          </svg>{" "}
                        </BootstrapTooltip>
                      </div>
                    </span>
                  </NavLink>
                  <NavLink
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    to={"/i/bookmarks"}
                  >
                    {" "}
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "hover-home-dark-theme"
                            : "hover-home"
                        }
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <BootstrapTooltip
                          title="Bookmarks"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <svg
                            color={
                              themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"
                            }
                            fill="currentColor"
                            width={`${1.75}rem`}
                            height={`${1.75}rem`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"
                          >
                            <g>
                              {window.location.href ===
                              `${FRONTEND_URL}/bookmarks` ? (
                                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
                              ) : (
                                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
                              )}
                            </g>
                          </svg>{" "}
                        </BootstrapTooltip>
                      </div>
                    </span>
                  </NavLink>
                  <NavLink
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    to={`${userInfo.username}/communities/explore`}
                  >
                    {" "}
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "hover-home-dark-theme"
                            : "hover-home"
                        }
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <BootstrapTooltip
                          title="Bookmarks"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <svg
                            color={
                              themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"
                            }
                            fill="currentColor"
                            width={`${1.75}rem`}
                            height={`${1.75}rem`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"
                          >
                            <g>
                              {window.location.href ===
                              `${FRONTEND_URL}/${userInfo.username}/communities/explore` ? (
                                <path d="M7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-1.608 1.732-2.762 4.389-2.869 8.248l-.03 1.083zM9.616 9.27C10.452 8.63 11 7.632 11 6.5 11 4.57 9.433 3 7.5 3S4 4.57 4 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73zm6.884 1.726c-3.264 0-6.816 2.358-7 8.977L9.471 21h14.057l-.029-1.027c-.184-6.618-3.736-8.977-7-8.977zm2.116-1.726C19.452 8.63 20 7.632 20 6.5 20 4.57 18.433 3 16.5 3S13 4.57 13 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73z"></path>
                              ) : (
                                <path d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z"></path>
                              )}
                            </g>
                          </svg>
                        </BootstrapTooltip>
                      </div>
                    </span>
                  </NavLink>
                  <NavLink
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    to={"/i/premium_sign_up"}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "hover-home-dark-theme"
                            : "hover-home"
                        }
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <BootstrapTooltip
                          title="Premium"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={50}
                            height={30}
                            viewBox="0 0 100 100"
                          >
                            {/* İçi dolu bir kare */}
                            <rect
                              x="5"
                              y="5"
                              width="90"
                              height="90"
                              fill="#1C9BEF"
                              rx="5"
                              ry="5"
                              style={{
                                filter:
                                  "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                              }}
                            />

                            <text
                              x="27.5"
                              y="70"
                              fontFamily="Arial"
                              fontSize="60"
                              fill="#FFF"
                              stroke="#FFF"
                              strokeWidth="2"
                            >
                              C
                            </text>
                          </svg>{" "}
                        </BootstrapTooltip>
                      </div>
                    </span>
                  </NavLink>{" "}
                  <NavLink
                    style={{
                      color: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    to={"/profile"}
                  >
                    {" "}
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "hover-home-dark-theme"
                            : "hover-home"
                        }
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <BootstrapTooltip
                          title="Profile"
                          themeName={
                            themeName === "dark-theme"
                              ? "dark-theme"
                              : "light-theme"
                          }
                        >
                          <svg
                            color={themeName === "dark-theme" ? "white" : ""}
                            fill="currentColor"
                            width={`${1.75}rem`}
                            height={`${1.75}rem`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="profile-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                          >
                            <g className="profile-svg-group">
                              {window.location.href ===
                              `${FRONTEND_URL}/profile` ? (
                                <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path>
                              ) : (
                                <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                              )}
                            </g>
                          </svg>{" "}
                        </BootstrapTooltip>
                      </div>
                    </span>
                  </NavLink>
                  <PopupState variant="popover" popupId="demo-popup-popover">
                    {(popupState) => (
                      <div>
                        <NavLink
                          style={{
                            color: "black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <div
                              {...bindTrigger(popupState)}
                              className={
                                themeName === "dark-theme"
                                  ? "hover-home-dark-theme"
                                  : "hover-home"
                              }
                              style={{
                                position: "relative",
                                borderRadius: "50%",
                                width: "50px",
                                height: "50px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {" "}
                              <BootstrapTooltip
                                title="More"
                                themeName={
                                  themeName === "dark-theme"
                                    ? "dark-theme"
                                    : "light-theme"
                                }
                              >
                                <svg
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
                                  width={`${1.75}rem`}
                                  height={`${1.75}rem`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"
                                >
                                  <g>
                                    <path d="M3.75 12c0-4.56 3.69-8.25 8.25-8.25s8.25 3.69 8.25 8.25-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12zM12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-4.75 11.5c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25S6 11.31 6 12s.56 1.25 1.25 1.25zm9.5 0c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zM13.25 12c0 .69-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25z"></path>
                                  </g>
                                </svg>{" "}
                              </BootstrapTooltip>
                            </div>
                          </span>
                        </NavLink>
                        <Popover
                          open={popupState.open}
                          onClose={popupState.close}
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          className={`${
                            themeName === "dark-theme"
                              ? "popover-material-ui-dark-theme-left-side-navigation"
                              : themeName !== "dark-theme"
                              ? "popover-material-ui-light-theme-left-side-navigation"
                              : "hideshowMessageDeletePopover "
                          }`}
                        >
                          {" "}
                          <div
                            onClick={() => {
                              popupState.close();
                              navigate(`/${userInfo.username}/lists`);
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "hover-effect-dark-theme-pointer-plus"
                                : "hover-effect-light-theme-pointer-plus"
                            }
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexBasis: "auto",
                              boxSizing: "border-box",
                              flexShrink: "0",
                              margin: "0px",
                              minHeight: "0px",
                              minWidth: "0px",
                              position: "relative",
                              padding: "16px",
                            }}
                          >
                            <div
                              href=""
                              style={{
                                maxWidth: "100%",
                                outlineStyle: "none",
                                cursor: "pointer",
                                flexGrow: "1",
                                boxSizing: "border-box",
                                display: "flex",
                                flexBasis: "auto",
                                flexDirection: "column",
                                flexShrink: "0",
                                listStyle: "none",
                                margin: "0px",
                                padding: "0px",
                                minWidth: "0px",
                                minHeight: "0px",
                                position: "relative",
                                textDecoration: "none",
                                pointerEvents: "auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  flexGrow: "1",
                                  boxSizing: "border-box",
                                  flexBasis: "auto",
                                  flexShrink: "0",
                                  margin: "0px",
                                  padding: "0px",
                                  minWidth: "0px",
                                  minHeight: "0px",
                                  position: "relative",
                                  textDecoration: "none",
                                  pointerEvents: "auto",
                                  cursor: "pointer",
                                }}
                              >
                                <svg
                                  style={{
                                    marginRight: "24px",
                                    userSelect: "none",
                                    flexShrink: "0",
                                    maxWidth: "100%",
                                    position: "relative",
                                    alignItems: "center",
                                    display: "inline-block",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                  }}
                                  fill={
                                    themeName === "dark-theme"
                                      ? "rgb(231,233,234)"
                                      : "rgb(15, 20, 25)"
                                  }
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                                  data-testid="icon"
                                >
                                  <g>
                                    <path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path>
                                  </g>
                                </svg>
                                <div
                                  className={
                                    themeName === "dark-theme"
                                      ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                      : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                                  }
                                  style={{
                                    textOverflow: "unset",
                                    overflowWrap: "break-word",
                                    maxWidth: "100%",
                                    minWidth: "0px",
                                    whiteSpace: "nowrap",
                                    textAlign: "inherit",
                                    flexGrow: "1",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                    margin: "0px",
                                    padding: "0px",
                                    position: "relative",
                                    listStyle: "none",
                                    textDecoration: "none",
                                    fontSize: font20.fontSize,
                                    lineHeight: font20.lineHeight,
                                  }}
                                >
                                  Lists
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              popupState.close();
                              navigate(`/settings/monetization`);
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "hover-effect-dark-theme-pointer-plus"
                                : "hover-effect-light-theme-pointer-plus"
                            }
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexBasis: "auto",
                              boxSizing: "border-box",
                              flexShrink: "0",
                              margin: "0px",
                              minHeight: "0px",
                              minWidth: "0px",
                              position: "relative",
                              padding: "16px",
                            }}
                          >
                            <div
                              href=""
                              style={{
                                maxWidth: "100%",
                                outlineStyle: "none",
                                cursor: "pointer",
                                flexGrow: "1",
                                boxSizing: "border-box",
                                display: "flex",
                                flexBasis: "auto",
                                flexDirection: "column",
                                flexShrink: "0",
                                listStyle: "none",
                                margin: "0px",
                                padding: "0px",
                                minWidth: "0px",
                                minHeight: "0px",
                                position: "relative",
                                textDecoration: "none",
                                pointerEvents: "auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  flexGrow: "1",
                                  boxSizing: "border-box",
                                  flexBasis: "auto",
                                  flexShrink: "0",
                                  margin: "0px",
                                  padding: "0px",
                                  minWidth: "0px",
                                  minHeight: "0px",
                                  position: "relative",
                                  textDecoration: "none",
                                  pointerEvents: "auto",
                                  cursor: "pointer",
                                }}
                              >
                                <svg
                                  style={{
                                    marginRight: "24px",
                                    userSelect: "none",
                                    flexShrink: "0",
                                    maxWidth: "100%",
                                    position: "relative",
                                    alignItems: "center",
                                    display: "inline-block",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                  }}
                                  fill={
                                    themeName === "dark-theme"
                                      ? "rgb(231,233,234)"
                                      : "rgb(15, 20, 25)"
                                  }
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                                  data-testid="icon"
                                >
                                  <g>
                                    <path d="M23 3v14h-2V5H5V3h18zM10 17c1.1 0 2-1.34 2-3s-.9-3-2-3-2 1.34-2 3 .9 3 2 3zM1 7h18v14H1V7zm16 10c-1.1 0-2 .9-2 2h2v-2zm-2-8c0 1.1.9 2 2 2V9h-2zM3 11c1.1 0 2-.9 2-2H3v2zm0 4c2.21 0 4 1.79 4 4h6c0-2.21 1.79-4 4-4v-2c-2.21 0-4-1.79-4-4H7c0 2.21-1.79 4-4 4v2zm0 4h2c0-1.1-.9-2-2-2v2z"></path>
                                  </g>
                                </svg>
                                <div
                                  className={
                                    themeName === "dark-theme"
                                      ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                      : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                                  }
                                  style={{
                                    textOverflow: "unset",
                                    overflowWrap: "break-word",
                                    maxWidth: "100%",
                                    minWidth: "0px",
                                    whiteSpace: "nowrap",
                                    textAlign: "inherit",
                                    flexGrow: "1",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                    margin: "0px",
                                    padding: "0px",
                                    position: "relative",
                                    listStyle: "none",
                                    textDecoration: "none",
                                    fontSize: font20.fontSize,
                                    lineHeight: font20.lineHeight,
                                  }}
                                >
                                  Monetization
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              popupState.close();
                              navigate(`/help/connectify`);
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "hover-effect-dark-theme-pointer-plus"
                                : "hover-effect-light-theme-pointer-plus"
                            }
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexBasis: "auto",
                              boxSizing: "border-box",
                              flexShrink: "0",
                              margin: "0px",
                              minHeight: "0px",
                              minWidth: "0px",
                              position: "relative",
                              padding: "16px",
                            }}
                          >
                            <div
                              href=""
                              style={{
                                maxWidth: "100%",
                                outlineStyle: "none",
                                cursor: "pointer",
                                flexGrow: "1",
                                boxSizing: "border-box",
                                display: "flex",
                                flexBasis: "auto",
                                flexDirection: "column",
                                flexShrink: "0",
                                listStyle: "none",
                                margin: "0px",
                                padding: "0px",
                                minWidth: "0px",
                                minHeight: "0px",
                                position: "relative",
                                textDecoration: "none",
                                pointerEvents: "auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  flexGrow: "1",
                                  boxSizing: "border-box",
                                  flexBasis: "auto",
                                  flexShrink: "0",
                                  margin: "0px",
                                  padding: "0px",
                                  minWidth: "0px",
                                  minHeight: "0px",
                                  position: "relative",
                                  textDecoration: "none",
                                  pointerEvents: "auto",
                                  cursor: "pointer",
                                }}
                              >
                                <svg
                                  style={{
                                    marginRight: "24px",
                                    userSelect: "none",
                                    flexShrink: "0",
                                    maxWidth: "100%",
                                    position: "relative",
                                    alignItems: "center",
                                    display: "inline-block",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                  }}
                                  fill={
                                    themeName === "dark-theme"
                                      ? "rgb(231,233,234)"
                                      : "rgb(15, 20, 25)"
                                  }
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                                  data-testid="icon"
                                >
                                  <g>
                                    <path d="M1.996 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.38 0 2.5 1.12 2.5 2.5v13c0 1.38-1.12 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.277 0-.5.22-.5.5v13c0 .28.223.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zm8.085 5H8.996V8h7v7h-2v-3.59l-5.293 5.3-1.415-1.42L12.581 10z"></path>
                                  </g>
                                </svg>
                                <div
                                  className={
                                    themeName === "dark-theme"
                                      ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                      : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                                  }
                                  style={{
                                    textOverflow: "unset",
                                    overflowWrap: "break-word",
                                    maxWidth: "100%",
                                    minWidth: "0px",
                                    whiteSpace: "nowrap",
                                    textAlign: "inherit",
                                    flexGrow: "1",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                    margin: "0px",
                                    padding: "0px",
                                    position: "relative",
                                    listStyle: "none",
                                    textDecoration: "none",
                                    fontSize: font20.fontSize,
                                    lineHeight: font20.lineHeight,
                                  }}
                                >
                                  Ads
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              popupState.close();
                              navigate("/jobs");
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "hover-effect-dark-theme-pointer-plus"
                                : "hover-effect-light-theme-pointer-plus"
                            }
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexBasis: "auto",
                              boxSizing: "border-box",
                              flexShrink: "0",
                              margin: "0px",
                              minHeight: "0px",
                              minWidth: "0px",
                              position: "relative",
                              padding: "16px",
                            }}
                          >
                            <div
                              href=""
                              style={{
                                maxWidth: "100%",
                                outlineStyle: "none",
                                cursor: "pointer",
                                flexGrow: "1",
                                boxSizing: "border-box",
                                display: "flex",
                                flexBasis: "auto",
                                flexDirection: "column",
                                flexShrink: "0",
                                listStyle: "none",
                                margin: "0px",
                                padding: "0px",
                                minWidth: "0px",
                                minHeight: "0px",
                                position: "relative",
                                textDecoration: "none",
                                pointerEvents: "auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  flexGrow: "1",
                                  boxSizing: "border-box",
                                  flexBasis: "auto",
                                  flexShrink: "0",
                                  margin: "0px",
                                  padding: "0px",
                                  minWidth: "0px",
                                  minHeight: "0px",
                                  position: "relative",
                                  textDecoration: "none",
                                  pointerEvents: "auto",
                                  cursor: "pointer",
                                }}
                              >
                                <svg
                                  style={{
                                    marginRight: "24px",
                                    userSelect: "none",
                                    flexShrink: "0",
                                    maxWidth: "100%",
                                    position: "relative",
                                    alignItems: "center",
                                    display: "inline-block",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                  }}
                                  fill={
                                    themeName === "dark-theme"
                                      ? "rgb(231,233,234)"
                                      : "rgb(15, 20, 25)"
                                  }
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                                  data-testid="icon"
                                >
                                  <g>
                                    <path d="M19.5 6H17V4.5C17 3.12 15.88 2 14.5 2h-5C8.12 2 7 3.12 7 4.5V6H4.5C3.12 6 2 7.12 2 8.5v10C2 19.88 3.12 21 4.5 21h15c1.38 0 2.5-1.12 2.5-2.5v-10C22 7.12 20.88 6 19.5 6zM9 4.5c0-.28.23-.5.5-.5h5c.28 0 .5.22.5.5V6H9V4.5zm11 14c0 .28-.22.5-.5.5h-15c-.27 0-.5-.22-.5-.5v-3.04c.59.35 1.27.54 2 .54h5v1h2v-1h5c.73 0 1.41-.19 2-.54v3.04zm0-6.49c0 1.1-.9 1.99-2 1.99h-5v-1h-2v1H6c-1.1 0-2-.9-2-2V8.5c0-.28.23-.5.5-.5h15c.28 0 .5.22.5.5v3.51z"></path>
                                  </g>
                                </svg>
                                <div
                                  className={
                                    themeName === "dark-theme"
                                      ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                      : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                                  }
                                  style={{
                                    textOverflow: "unset",
                                    overflowWrap: "break-word",
                                    maxWidth: "100%",
                                    minWidth: "0px",
                                    whiteSpace: "nowrap",
                                    textAlign: "inherit",
                                    flexGrow: "1",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                    margin: "0px",
                                    padding: "0px",
                                    position: "relative",
                                    listStyle: "none",
                                    textDecoration: "none",
                                    fontSize: font20.fontSize,
                                    lineHeight: font20.lineHeight,
                                  }}
                                >
                                  Jobs
                                </div>
                                <div
                                  className="chirp-bold-font"
                                  style={{
                                    height: "20px",
                                    paddingLeft: "4px",
                                    paddingRight: "4px",
                                    backgroundColor:
                                      themeName === "dark-theme"
                                        ? "rgb(73, 22, 0)"
                                        : "rgb(255, 237, 219)",
                                    borderRadius: "4px",
                                    pointerEvents: "none !important",
                                    color:
                                      themeName === "dark-theme"
                                        ? "rgb(255, 224, 194)"
                                        : "rgb(105, 33, 0)",
                                    fontSize:
                                      fontSize === "Default"
                                        ? "15px"
                                        : fontSize === "Small"
                                        ? "14px"
                                        : fontSize === "Extra small"
                                        ? "14px"
                                        : fontSize === "Large"
                                        ? "17px"
                                        : fontSize === "Extra large"
                                        ? "18px"
                                        : null,
                                  }}
                                >
                                  <div>Beta</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              popupState.close();
                              navigate("/i/spaces/start");
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "hover-effect-dark-theme-pointer-plus"
                                : "hover-effect-light-theme-pointer-plus"
                            }
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexBasis: "auto",
                              boxSizing: "border-box",
                              flexShrink: "0",
                              margin: "0px",
                              minHeight: "0px",
                              minWidth: "0px",
                              position: "relative",
                              padding: "16px",
                            }}
                          >
                            <div
                              href=""
                              style={{
                                maxWidth: "100%",
                                outlineStyle: "none",
                                cursor: "pointer",
                                flexGrow: "1",
                                boxSizing: "border-box",
                                display: "flex",
                                flexBasis: "auto",
                                flexDirection: "column",
                                flexShrink: "0",
                                listStyle: "none",
                                margin: "0px",
                                padding: "0px",
                                minWidth: "0px",
                                minHeight: "0px",
                                position: "relative",
                                textDecoration: "none",
                                pointerEvents: "auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  flexGrow: "1",
                                  boxSizing: "border-box",
                                  flexBasis: "auto",
                                  flexShrink: "0",
                                  margin: "0px",
                                  padding: "0px",
                                  minWidth: "0px",
                                  minHeight: "0px",
                                  position: "relative",
                                  textDecoration: "none",
                                  pointerEvents: "auto",
                                  cursor: "pointer",
                                }}
                              >
                                <svg
                                  style={{
                                    marginRight: "24px",
                                    userSelect: "none",
                                    flexShrink: "0",
                                    maxWidth: "100%",
                                    position: "relative",
                                    alignItems: "center",
                                    display: "inline-block",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                  }}
                                  fill={
                                    themeName === "dark-theme"
                                      ? "rgb(231,233,234)"
                                      : "rgb(15, 20, 25)"
                                  }
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                                  data-testid="icon"
                                >
                                  <g>
                                    <path d="M12 22.25c-4.99 0-9.18-3.393-10.39-7.994l1.93-.512c.99 3.746 4.4 6.506 8.46 6.506s7.47-2.76 8.46-6.506l1.93.512c-1.21 4.601-5.4 7.994-10.39 7.994zM5 11.5c0 3.866 3.13 7 7 7s7-3.134 7-7V8.75c0-3.866-3.13-7-7-7s-7 3.134-7 7v2.75zm12-2.75v2.75c0 2.761-2.24 5-5 5s-5-2.239-5-5V8.75c0-2.761 2.24-5 5-5s5 2.239 5 5zM11.25 8v4.25c0 .414.34.75.75.75s.75-.336.75-.75V8c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm-3 1v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm7.5 0c0-.414-.34-.75-.75-.75s-.75.336-.75.75v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9z"></path>
                                  </g>
                                </svg>
                                <div
                                  className={
                                    themeName === "dark-theme"
                                      ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                      : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                                  }
                                  style={{
                                    textOverflow: "unset",
                                    overflowWrap: "break-word",
                                    maxWidth: "100%",
                                    minWidth: "0px",
                                    whiteSpace: "nowrap",
                                    textAlign: "inherit",
                                    flexGrow: "1",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                    margin: "0px",
                                    padding: "0px",
                                    position: "relative",
                                    listStyle: "none",
                                    textDecoration: "none",
                                    fontSize: font20.fontSize,
                                    lineHeight: font20.lineHeight,
                                  }}
                                >
                                  Create your Space
                                </div>
                              </div>
                            </div>
                          </div>{" "}
                          <div
                            onClick={() => {
                              popupState.close();
                              navigate("/settings");
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "hover-effect-dark-theme-pointer-plus"
                                : "hover-effect-light-theme-pointer-plus"
                            }
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexBasis: "auto",
                              boxSizing: "border-box",
                              flexShrink: "0",
                              margin: "0px",
                              minHeight: "0px",
                              minWidth: "0px",
                              position: "relative",
                              padding: "16px",
                            }}
                          >
                            <div
                              href=""
                              style={{
                                maxWidth: "100%",
                                outlineStyle: "none",
                                cursor: "pointer",
                                flexGrow: "1",
                                boxSizing: "border-box",
                                display: "flex",
                                flexBasis: "auto",
                                flexDirection: "column",
                                flexShrink: "0",
                                listStyle: "none",
                                margin: "0px",
                                padding: "0px",
                                minWidth: "0px",
                                minHeight: "0px",
                                position: "relative",
                                textDecoration: "none",
                                pointerEvents: "auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  flexGrow: "1",
                                  boxSizing: "border-box",
                                  flexBasis: "auto",
                                  flexShrink: "0",
                                  margin: "0px",
                                  padding: "0px",
                                  minWidth: "0px",
                                  minHeight: "0px",
                                  position: "relative",
                                  textDecoration: "none",
                                  pointerEvents: "auto",
                                  cursor: "pointer",
                                }}
                              >
                                <svg
                                  style={{
                                    marginRight: "24px",
                                    userSelect: "none",
                                    flexShrink: "0",
                                    maxWidth: "100%",
                                    position: "relative",
                                    alignItems: "center",
                                    display: "inline-block",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                  }}
                                  fill={
                                    themeName === "dark-theme"
                                      ? "rgb(231,233,234)"
                                      : "rgb(15, 20, 25)"
                                  }
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                                  data-testid="icon"
                                >
                                  <g>
                                    <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
                                  </g>
                                </svg>
                                <div
                                  className={
                                    themeName === "dark-theme"
                                      ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                      : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                                  }
                                  style={{
                                    textOverflow: "unset",
                                    overflowWrap: "break-word",
                                    maxWidth: "100%",
                                    minWidth: "0px",
                                    whiteSpace: "nowrap",
                                    textAlign: "inherit",
                                    flexGrow: "1",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                    margin: "0px",
                                    padding: "0px",
                                    position: "relative",
                                    listStyle: "none",
                                    textDecoration: "none",
                                    fontSize: font20.fontSize,
                                    lineHeight: font20.lineHeight,
                                  }}
                                >
                                  Settings and privacy
                                </div>
                              </div>
                            </div>
                          </div>{" "}
                        </Popover>
                      </div>
                    )}
                  </PopupState>
                  {/* navigation linkler finish to check */}
                  <div>
                    <button
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        backgroundColor: "#1C9BEF",
                        border: "none",
                        outlineStyle: "none",
                      }}
                      onClick={handleShow}
                    >
                      {" "}
                      <BootstrapTooltip
                        title="Post"
                        themeName={
                          themeName === "dark-theme"
                            ? "dark-theme"
                            : "light-theme"
                        }
                      >
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className=" compose-tweet-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp"
                          fill="currentColor"
                          style={{ color: "rgb(255, 255, 255)" }}
                        >
                          <g>
                            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
                          </g>
                        </svg>{" "}
                      </BootstrapTooltip>
                    </button>
                  </div>
                  {/* <BootstrapTooltip title="Accounts"> */}
                  <div>
                    <LogoutModal />
                  </div>
                  {/* </BootstrapTooltip> */}
                </Stack>{" "}
              </div>
            </Col>
          )}
        </>
      ) : (
        <Col
          style={{
            width:
              width < 768 && width >= 600
                ? "10%"
                : width < 600 && width >= 500
                ? "11%"
                : "",

            padding: "0px",
            margin: "0px",
            display: "flex",
            justifyContent: "center",
            minWidth: "fit-content",
          }}
          className="left-column"
          xs={1} // 0px - 576px aralığı
          sm={1} // 576px - 768px aralığı
          md={1} // 768px - 992px aralığı
          lg={width <= 1201 && width >= 992 ? 1 : 3} // 992px - 1400px aralığı
          xxl={3} // 1400px ve sonrası aralığı */}
        >
          <div
            style={{
              position: "fixed",
              height: "100%",
              overflowY: "auto",
              left: "60px",
            }}
          >
            <Stack
              style={{
                position: "relative",
                top: "2px",
              }}
              direction="vertical"
              className="nav-bar-left-side"
            >
              {/* First  */}
              <NavLink className="home-nav-link" to={"/home"}>
                {" "}
                <span
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "hover-home-dark-theme"
                        : "hover-home"
                    }
                    style={{
                      position: "relative",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={50}
                      height={30}
                      viewBox="0 0 100 100"
                    >
                      {/* İçi dolu bir kare */}
                      <rect
                        x="5"
                        y="5"
                        width="90"
                        height="90"
                        fill="#1C9BEF"
                        rx="5"
                        ry="5"
                        style={{
                          filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                        }}
                      />

                      <text
                        x="27.5"
                        y="70"
                        fontFamily="Arial"
                        fontSize="60"
                        fill="#FFF"
                        stroke="#FFF"
                        strokeWidth="2"
                      >
                        C
                      </text>
                    </svg>
                  </div>
                </span>
              </NavLink>
              {/* first */}
              <div
                className={`home-nav-link home-nav-link-${themeName}`}
                style={{
                  cursor: "default",
                }}
              >
                <div
                  className={`home-parent-of-span-svg home-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                  }}
                  onClick={() => {
                    navigate("/home");
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"}
                    fill="currentColor"
                    style={{}}
                    width={`${1.25}rem`}
                    height={`${1.25}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="home-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="home-svg-group">
                      {window.location.href === `${FRONTEND_URL}/home` ? (
                        <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
                      ) : (
                        <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
                      )}
                    </g>
                  </svg>
                  <span
                    className={
                      window.location.href === `${FRONTEND_URL}/home`
                        ? `chirp-bold-font`
                        : `chirp-regular-font`
                    }
                    style={{
                      marginLeft: "20px",
                      position: "relative",
                      top: "3px",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                    }}
                  >
                    Home
                  </span>
                </div>
              </div>
              {/* second */}
              <div
                className={`home-nav-link home-nav-link-${themeName}`}
                style={{
                  cursor: "default",
                }}
              >
                <div
                  className={`home-parent-of-span-svg home-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                  }}
                  onClick={() => {
                    navigate("/explore");
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"}
                    fill="currentColor"
                    style={{}}
                    width={`${1.25}rem`}
                    height={`${1.25}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="home-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="home-svg-group">
                      {window.location.href === `${FRONTEND_URL}/explore` ? (
                        <path d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z"></path>
                      ) : (
                        <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                      )}
                    </g>
                  </svg>
                  <span
                    className={
                      window.location.href === `${FRONTEND_URL}/explore`
                        ? `chirp-bold-font`
                        : `chirp-regular-font`
                    }
                    style={{
                      marginLeft: "20px",
                      position: "relative",
                      top: "3px",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                    }}
                  >
                    Explore
                  </span>
                </div>
              </div>
              {/* third */}
              <div
                style={{
                  position: "relative",
                  cursor: "default",
                }}
                className={`notifications-nav-link notifications-nav-link-${themeName}`}
              >
                <div
                  className={`notifications-parent-of-span-svg notifications-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                    position: "relative",
                  }}
                  onClick={() => {
                    changeNotificationReadedStatus();
                    navigate("/notifications");
                  }}
                >
                  {width < 1200 ? null : (
                    <>
                      {unReadNotifications?.length === 0 ? null : (
                        <div
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            backgroundColor: "rgb(29, 155, 240)",
                            boxSizing: "content-box",
                            top: "4px",
                            left: "24px",
                            minWidth: "18px",
                            minHeight: "18px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid white",
                          }}
                        >
                          {" "}
                          <span
                            className="chirp-regular-font"
                            style={{
                              color: "white",
                              fontSize: font11.fontSize,
                              lineHeight: font11.lineHeight,
                            }}
                          >
                            {unReadNotifications?.length}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <svg
                    style={{}}
                    color={themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"}
                    fill="currentColor"
                    width={`${1.25}rem`}
                    height={`${1.25}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="notifications-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="notifications-svg-group">
                      {window.location.href ===
                      `${FRONTEND_URL}/notifications` ? (
                        <path d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z"></path>
                      ) : (
                        <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path>
                      )}
                    </g>
                  </svg>

                  <span
                    className={
                      window.location.href === `${FRONTEND_URL}/notifications`
                        ? `chirp-bold-font`
                        : `chirp-regular-font`
                    }
                    style={{
                      marginLeft: "20px",
                      position: "relative",
                      top: "3px",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                    }}
                  >
                    Notifications{" "}
                  </span>
                </div>
              </div>
              {/* fourth  */}
              <div
                className={`messages-nav-link messages-nav-link-${themeName}`}
                style={{
                  cursor: "default",
                }}
              >
                <div
                  className={`messages-parent-of-span-svg messages-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                    position: "relative",
                  }}
                  onClick={() => {
                    navigate("/messages");
                  }}
                >
                  {width < 1200 ? null : (
                    <>
                      {numberOfUnreadMessages ? (
                        <div
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            backgroundColor: "rgb(29, 155, 240)",
                            boxSizing: "content-box",
                            top: "4px",
                            left: "24px",
                            minWidth: "18px",
                            minHeight: "18px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid white",
                          }}
                        >
                          {" "}
                          <span
                            className="chirp-regular-font"
                            style={{
                              color: "white",
                              fontSize: font11.fontSize,
                              lineHeight: font11.lineHeight,
                            }}
                          >
                            {/* bunu sil ve direkt olarak okunmayan mesaj sayısını backendden al route kurup */}
                            {numberOfUnreadMessages}
                          </span>
                        </div>
                      ) : null}
                    </>
                  )}
                  <svg
                    color={themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"}
                    fill="currentColor"
                    width={`${1.25}rem`}
                    height={`${1.25}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="messages-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="messages-svg-group">
                      {window.location.href === `${FRONTEND_URL}/messages` ? (
                        <path d="M1.998 4.499c0-.828.671-1.499 1.5-1.499h17c.828 0 1.5.671 1.5 1.499v2.858l-10 4.545-10-4.547V4.499zm0 5.053V19.5c0 .828.671 1.5 1.5 1.5h17c.828 0 1.5-.672 1.5-1.5V9.554l-10 4.545-10-4.547z"></path>
                      ) : (
                        <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                      )}
                    </g>
                  </svg>

                  <span
                    className={
                      window.location.href === `${FRONTEND_URL}/messages`
                        ? `chirp-bold-font`
                        : `chirp-regular-font`
                    }
                    style={{
                      marginLeft: "20px",
                      position: "relative",
                      top: "3px",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                    }}
                  >
                    Messages{" "}
                  </span>
                </div>
              </div>{" "}
              {/* fifth */}
              <div
                className={`messages-nav-link messages-nav-link-${themeName}`}
                style={{
                  display: width > 1440 ? "" : "none",
                  cursor: "default",
                }}
              >
                <div
                  className={`messages-parent-of-span-svg messages-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                    position: "relative",
                  }}
                  onClick={() => {
                    navigate(`/${userInfo.username}/lists`);
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"}
                    fill="currentColor"
                    width={`${1.25}rem`}
                    height={`${1.25}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="messages-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="messages-svg-group">
                      {window.location.href ===
                      `${FRONTEND_URL}/${userInfo.username}/lists` ? (
                        <path d="M18.5 2h-13C4.12 2 3 3.12 3 4.5v15C3 20.88 4.12 22 5.5 22h13c1.38 0 2.5-1.12 2.5-2.5v-15C21 3.12 19.88 2 18.5 2zM16 14H8v-2h8v2zm0-4H8V8h8v2z"></path>
                      ) : (
                        <path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path>
                      )}
                    </g>
                  </svg>

                  <span
                    className={
                      window.location.href ===
                      `${FRONTEND_URL}/${userInfo.username}/lists`
                        ? `chirp-bold-font`
                        : `chirp-regular-font`
                    }
                    style={{
                      marginLeft: "20px",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                      position: "relative",
                      top: "3px",
                    }}
                  >
                    Lists{" "}
                  </span>
                </div>
              </div>
              {/* sixth */}
              <div
                className={`profile-nav-link profile-nav-link-${themeName}`}
                style={{
                  cursor: "default",
                }}
              >
                <div
                  className={`profile-parent-of-span-svg home-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                  }}
                  onClick={() => {
                    navigate("/i/bookmarks");
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"}
                    fill="currentColor"
                    width={`${1.75}rem`}
                    height={`${1.75}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g>
                      {window.location.href ===
                      `${FRONTEND_URL}/i/bookmarks` ? (
                        <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
                      ) : (
                        <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
                      )}
                    </g>
                  </svg>

                  <span
                    className={
                      window.location.href === `${FRONTEND_URL}/i/bookmarks`
                        ? `chirp-bold-font`
                        : `chirp-regular-font`
                    }
                    style={{
                      marginLeft: "20px",
                      position: "relative",
                      top: "3px",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                    }}
                  >
                    Bookmarks
                  </span>
                </div>
              </div>{" "}
              {/* seventh */}
              <div
                className={`profile-nav-link profile-nav-link-${themeName}`}
                style={{
                  cursor: "default",
                }}
              >
                <div
                  className={`profile-parent-of-span-svg home-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                  }}
                  onClick={() => {
                    navigate(`${userInfo.username}/communities/explore`);
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "#E7E9EA" : "#0F1419"}
                    fill="currentColor"
                    width={`${1.75}rem`}
                    height={`${1.75}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g>
                      {window.location.href ===
                      `${FRONTEND_URL}/${userInfo.username}/communities/explore` ? (
                        <path d="M7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-1.608 1.732-2.762 4.389-2.869 8.248l-.03 1.083zM9.616 9.27C10.452 8.63 11 7.632 11 6.5 11 4.57 9.433 3 7.5 3S4 4.57 4 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73zm6.884 1.726c-3.264 0-6.816 2.358-7 8.977L9.471 21h14.057l-.029-1.027c-.184-6.618-3.736-8.977-7-8.977zm2.116-1.726C19.452 8.63 20 7.632 20 6.5 20 4.57 18.433 3 16.5 3S13 4.57 13 6.5c0 1.132.548 2.13 1.384 2.77.589.451 1.317.73 2.116.73s1.527-.279 2.116-.73z"></path>
                      ) : (
                        <path d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z"></path>
                      )}
                    </g>
                  </svg>

                  <span
                    className={
                      window.location.href ===
                      `${FRONTEND_URL}/${userInfo.username}/communities/explore`
                        ? `chirp-bold-font`
                        : `chirp-regular-font`
                    }
                    style={{
                      marginLeft: "20px",
                      position: "relative",
                      top: "3px",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                    }}
                  >
                    Communities
                  </span>
                </div>
              </div>{" "}
              {/* eighth */}
              <div
                className={`profile-nav-link profile-nav-link-${themeName}`}
                style={{
                  cursor: "default",
                }}
              >
                <div
                  className={`profile-parent-of-span-svg home-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px 12px 12px 0px",
                  }}
                  onClick={() => navigate("/i/premium_sign_up")}
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={50}
                    height={30}
                    viewBox="0 0 100 100"
                  >
                    <rect
                      x="5"
                      y="5"
                      width="90"
                      height="90"
                      fill="#1C9BEF"
                      rx="5"
                      ry="5"
                      style={{
                        filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                      }}
                    />

                    <text
                      x="27.5"
                      y="70"
                      fontFamily="Arial"
                      fontSize="60"
                      fill="#FFF"
                      stroke="#FFF"
                      strokeWidth="2"
                    >
                      C
                    </text>
                  </svg>
                  <span
                    className={
                      window.location.href === `${FRONTEND_URL}/premium`
                        ? `chirp-bold-font`
                        : `chirp-regular-font`
                    }
                    style={{
                      marginLeft: "8.5px",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                      position: "relative",
                      top: "3px",
                    }}
                  >
                    Premium{" "}
                  </span>
                </div>
              </div>{" "}
              {/* nineth  */}
              <div
                className={`profile-nav-link profile-nav-link-${themeName}`}
                style={{
                  cursor: "default",
                }}
              >
                <div
                  onClick={() => {
                    navigate("/profile");
                  }}
                  className={`profile-parent-of-span-svg home-parent-of-span-svg-${themeName}`}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "white" : ""}
                    fill="currentColor"
                    width={`${1.25}rem`}
                    height={`${1.25}rem`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="profile-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                  >
                    <g className="profile-svg-group">
                      {window.location.href === `${FRONTEND_URL}/profile` ? (
                        <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path>
                      ) : (
                        <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                      )}
                    </g>
                  </svg>

                  <span
                    className={
                      window.location.href === `${FRONTEND_URL}/profile`
                        ? `chirp-bold-font`
                        : `chirp-regular-font`
                    }
                    style={{
                      marginLeft: "20px",
                      position: "relative",
                      top: "3px",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                    }}
                  >
                    Profile{" "}
                  </span>
                </div>
              </div>
              {/* tenth */}
              <PopupState variant="popover" popupId="demo-popup-popover">
                {(popupState) => (
                  <div>
                    <NavLink
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                      }}
                      className={`profile-nav-link profile-nav-link-${themeName}`}
                    >
                      <span
                        style={{
                          cursor: "pointer",
                        }}
                        className="profile-nav-link-parent-div"
                      >
                        <div
                          {...bindTrigger(popupState)}
                          className={`profile-parent-of-span-svg home-parent-of-span-svg-${themeName}`}
                          style={{
                            display: "inline-block",
                            padding: "12px",
                          }}
                        >
                          {" "}
                          <svg
                            color={themeName === "dark-theme" ? "white" : ""}
                            fill="currentColor"
                            width={`${1.75}rem`}
                            height={`${1.75}rem`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"
                          >
                            <g>
                              <path d="M3.75 12c0-4.56 3.69-8.25 8.25-8.25s8.25 3.69 8.25 8.25-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12zM12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-4.75 11.5c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25S6 11.31 6 12s.56 1.25 1.25 1.25zm9.5 0c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zM13.25 12c0 .69-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25z"></path>
                            </g>
                          </svg>
                          <span
                            style={{
                              marginLeft: "20px",
                              position: "relative",
                              top: "3px",
                              fontSize: font20.fontSize,
                              lineHeight: font20.lineHeight,
                            }}
                          >
                            More
                          </span>
                        </div>
                      </span>
                    </NavLink>{" "}
                    <Popover
                      open={popupState.open}
                      onClose={popupState.close}
                      {...bindPopover(popupState)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      className={`${
                        themeName === "dark-theme"
                          ? "popover-material-ui-dark-theme-left-side-navigation"
                          : themeName !== "dark-theme"
                          ? "popover-material-ui-light-theme-left-side-navigation"
                          : "hideshowMessageDeletePopover "
                      }`}
                    >
                      {" "}
                      {width <= 1440 && (
                        <div
                          onClick={() => {
                            popupState.close();
                            navigate(`/${userInfo.username}/lists`);
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "hover-effect-dark-theme-pointer-plus"
                              : "hover-effect-light-theme-pointer-plus"
                          }
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            flexBasis: "auto",
                            boxSizing: "border-box",
                            flexShrink: "0",
                            margin: "0px",
                            minHeight: "0px",
                            minWidth: "0px",
                            position: "relative",
                            padding: "16px",
                          }}
                        >
                          <div
                            href=""
                            style={{
                              maxWidth: "100%",
                              outlineStyle: "none",
                              cursor: "pointer",
                              flexGrow: "1",
                              boxSizing: "border-box",
                              display: "flex",
                              flexBasis: "auto",
                              flexDirection: "column",
                              flexShrink: "0",
                              listStyle: "none",
                              margin: "0px",
                              padding: "0px",
                              minWidth: "0px",
                              minHeight: "0px",
                              position: "relative",
                              textDecoration: "none",
                              pointerEvents: "auto",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                flexGrow: "1",
                                boxSizing: "border-box",
                                flexBasis: "auto",
                                flexShrink: "0",
                                margin: "0px",
                                padding: "0px",
                                minWidth: "0px",
                                minHeight: "0px",
                                position: "relative",
                                textDecoration: "none",
                                pointerEvents: "auto",
                                cursor: "pointer",
                              }}
                            >
                              <svg
                                style={{
                                  marginRight: "24px",
                                  userSelect: "none",
                                  flexShrink: "0",
                                  maxWidth: "100%",
                                  position: "relative",
                                  alignItems: "center",
                                  display: "inline-block",
                                  cursor: "pointer",
                                  pointerEvents: "auto",
                                }}
                                fill={
                                  themeName === "dark-theme"
                                    ? "rgb(231,233,234)"
                                    : "rgb(15, 20, 25)"
                                }
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                                data-testid="icon"
                              >
                                <g>
                                  <path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path>
                                </g>
                              </svg>
                              <div
                                className={
                                  themeName === "dark-theme"
                                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                    : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                                }
                                style={{
                                  textOverflow: "unset",
                                  overflowWrap: "break-word",
                                  maxWidth: "100%",
                                  minWidth: "0px",
                                  whiteSpace: "nowrap",
                                  textAlign: "inherit",
                                  flexGrow: "1",
                                  overflow: "hidden",
                                  boxSizing: "border-box",
                                  margin: "0px",
                                  padding: "0px",
                                  position: "relative",
                                  listStyle: "none",
                                  textDecoration: "none",
                                  fontSize: font20.fontSize,
                                  lineHeight: font20.lineHeight,
                                }}
                              >
                                Lists
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        onClick={() => {
                          popupState.close();
                          navigate(`/settings/monetization`);
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "hover-effect-dark-theme-pointer-plus"
                            : "hover-effect-light-theme-pointer-plus"
                        }
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flexBasis: "auto",
                          boxSizing: "border-box",
                          flexShrink: "0",
                          margin: "0px",
                          minHeight: "0px",
                          minWidth: "0px",
                          position: "relative",
                          padding: "16px",
                        }}
                      >
                        <div
                          href=""
                          style={{
                            maxWidth: "100%",
                            outlineStyle: "none",
                            cursor: "pointer",
                            flexGrow: "1",
                            boxSizing: "border-box",
                            display: "flex",
                            flexBasis: "auto",
                            flexDirection: "column",
                            flexShrink: "0",
                            listStyle: "none",
                            margin: "0px",
                            padding: "0px",
                            minWidth: "0px",
                            minHeight: "0px",
                            position: "relative",
                            textDecoration: "none",
                            pointerEvents: "auto",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexGrow: "1",
                              boxSizing: "border-box",
                              flexBasis: "auto",
                              flexShrink: "0",
                              margin: "0px",
                              padding: "0px",
                              minWidth: "0px",
                              minHeight: "0px",
                              position: "relative",
                              textDecoration: "none",
                              pointerEvents: "auto",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              style={{
                                marginRight: "24px",
                                userSelect: "none",
                                flexShrink: "0",
                                maxWidth: "100%",
                                position: "relative",
                                alignItems: "center",
                                display: "inline-block",
                                cursor: "pointer",
                                pointerEvents: "auto",
                              }}
                              fill={
                                themeName === "dark-theme"
                                  ? "rgb(231,233,234)"
                                  : "rgb(15, 20, 25)"
                              }
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                              data-testid="icon"
                            >
                              <g>
                                <path d="M23 3v14h-2V5H5V3h18zM10 17c1.1 0 2-1.34 2-3s-.9-3-2-3-2 1.34-2 3 .9 3 2 3zM1 7h18v14H1V7zm16 10c-1.1 0-2 .9-2 2h2v-2zm-2-8c0 1.1.9 2 2 2V9h-2zM3 11c1.1 0 2-.9 2-2H3v2zm0 4c2.21 0 4 1.79 4 4h6c0-2.21 1.79-4 4-4v-2c-2.21 0-4-1.79-4-4H7c0 2.21-1.79 4-4 4v2zm0 4h2c0-1.1-.9-2-2-2v2z"></path>
                              </g>
                            </svg>
                            <div
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                  : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                              }
                              style={{
                                textOverflow: "unset",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                                minWidth: "0px",
                                whiteSpace: "nowrap",
                                textAlign: "inherit",
                                flexGrow: "1",
                                overflow: "hidden",
                                boxSizing: "border-box",
                                margin: "0px",
                                padding: "0px",
                                position: "relative",
                                listStyle: "none",
                                textDecoration: "none",
                                fontSize: font20.fontSize,
                                lineHeight: font20.lineHeight,
                              }}
                            >
                              Monetization
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          popupState.close();
                          navigate(`/help/connectify`);
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "hover-effect-dark-theme-pointer-plus"
                            : "hover-effect-light-theme-pointer-plus"
                        }
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flexBasis: "auto",
                          boxSizing: "border-box",
                          flexShrink: "0",
                          margin: "0px",
                          minHeight: "0px",
                          minWidth: "0px",
                          position: "relative",
                          padding: "16px",
                        }}
                      >
                        <div
                          href=""
                          style={{
                            maxWidth: "100%",
                            outlineStyle: "none",
                            cursor: "pointer",
                            flexGrow: "1",
                            boxSizing: "border-box",
                            display: "flex",
                            flexBasis: "auto",
                            flexDirection: "column",
                            flexShrink: "0",
                            listStyle: "none",
                            margin: "0px",
                            padding: "0px",
                            minWidth: "0px",
                            minHeight: "0px",
                            position: "relative",
                            textDecoration: "none",
                            pointerEvents: "auto",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexGrow: "1",
                              boxSizing: "border-box",
                              flexBasis: "auto",
                              flexShrink: "0",
                              margin: "0px",
                              padding: "0px",
                              minWidth: "0px",
                              minHeight: "0px",
                              position: "relative",
                              textDecoration: "none",
                              pointerEvents: "auto",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              style={{
                                marginRight: "24px",
                                userSelect: "none",
                                flexShrink: "0",
                                maxWidth: "100%",
                                position: "relative",
                                alignItems: "center",
                                display: "inline-block",
                                cursor: "pointer",
                                pointerEvents: "auto",
                              }}
                              fill={
                                themeName === "dark-theme"
                                  ? "rgb(231,233,234)"
                                  : "rgb(15, 20, 25)"
                              }
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                              data-testid="icon"
                            >
                              <g>
                                <path d="M1.996 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.38 0 2.5 1.12 2.5 2.5v13c0 1.38-1.12 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.277 0-.5.22-.5.5v13c0 .28.223.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zm8.085 5H8.996V8h7v7h-2v-3.59l-5.293 5.3-1.415-1.42L12.581 10z"></path>
                              </g>
                            </svg>
                            <div
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                  : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                              }
                              style={{
                                textOverflow: "unset",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                                minWidth: "0px",
                                whiteSpace: "nowrap",
                                textAlign: "inherit",
                                flexGrow: "1",
                                overflow: "hidden",
                                boxSizing: "border-box",
                                margin: "0px",
                                padding: "0px",
                                position: "relative",
                                listStyle: "none",
                                textDecoration: "none",
                                fontSize: font20.fontSize,
                                lineHeight: font20.lineHeight,
                              }}
                            >
                              Ads
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          popupState.close();
                          navigate("/jobs");
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "hover-effect-dark-theme-pointer-plus"
                            : "hover-effect-light-theme-pointer-plus"
                        }
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flexBasis: "auto",
                          boxSizing: "border-box",
                          flexShrink: "0",
                          margin: "0px",
                          minHeight: "0px",
                          minWidth: "0px",
                          position: "relative",
                          padding: "16px",
                        }}
                      >
                        <div
                          href=""
                          style={{
                            maxWidth: "100%",
                            outlineStyle: "none",
                            cursor: "pointer",
                            flexGrow: "1",
                            boxSizing: "border-box",
                            display: "flex",
                            flexBasis: "auto",
                            flexDirection: "column",
                            flexShrink: "0",
                            listStyle: "none",
                            margin: "0px",
                            padding: "0px",
                            minWidth: "0px",
                            minHeight: "0px",
                            position: "relative",
                            textDecoration: "none",
                            pointerEvents: "auto",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexGrow: "1",
                              boxSizing: "border-box",
                              flexBasis: "auto",
                              flexShrink: "0",
                              margin: "0px",
                              padding: "0px",
                              minWidth: "0px",
                              minHeight: "0px",
                              position: "relative",
                              textDecoration: "none",
                              pointerEvents: "auto",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              style={{
                                marginRight: "24px",
                                userSelect: "none",
                                flexShrink: "0",
                                maxWidth: "100%",
                                position: "relative",
                                alignItems: "center",
                                display: "inline-block",
                                cursor: "pointer",
                                pointerEvents: "auto",
                              }}
                              fill={
                                themeName === "dark-theme"
                                  ? "rgb(231,233,234)"
                                  : "rgb(15, 20, 25)"
                              }
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                              data-testid="icon"
                            >
                              <g>
                                <path d="M19.5 6H17V4.5C17 3.12 15.88 2 14.5 2h-5C8.12 2 7 3.12 7 4.5V6H4.5C3.12 6 2 7.12 2 8.5v10C2 19.88 3.12 21 4.5 21h15c1.38 0 2.5-1.12 2.5-2.5v-10C22 7.12 20.88 6 19.5 6zM9 4.5c0-.28.23-.5.5-.5h5c.28 0 .5.22.5.5V6H9V4.5zm11 14c0 .28-.22.5-.5.5h-15c-.27 0-.5-.22-.5-.5v-3.04c.59.35 1.27.54 2 .54h5v1h2v-1h5c.73 0 1.41-.19 2-.54v3.04zm0-6.49c0 1.1-.9 1.99-2 1.99h-5v-1h-2v1H6c-1.1 0-2-.9-2-2V8.5c0-.28.23-.5.5-.5h15c.28 0 .5.22.5.5v3.51z"></path>
                              </g>
                            </svg>
                            <div
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                  : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                              }
                              style={{
                                textOverflow: "unset",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                                minWidth: "0px",
                                whiteSpace: "nowrap",
                                textAlign: "inherit",
                                flexGrow: "1",
                                overflow: "hidden",
                                boxSizing: "border-box",
                                margin: "0px",
                                padding: "0px",
                                position: "relative",
                                listStyle: "none",
                                textDecoration: "none",
                                fontSize: font20.fontSize,
                                lineHeight: font20.lineHeight,
                              }}
                            >
                              Jobs
                            </div>
                            <div
                              className="chirp-bold-font"
                              style={{
                                fontSize:
                                  fontSize === "Default"
                                    ? "15px"
                                    : fontSize === "Small"
                                    ? "14px"
                                    : fontSize === "Extra small"
                                    ? "14px"
                                    : fontSize === "Large"
                                    ? "17px"
                                    : fontSize === "Extra large"
                                    ? "18px"
                                    : null,
                                height: "20px",
                                paddingLeft: "4px",
                                paddingRight: "4px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "rgb(73, 22, 0)"
                                    : "rgb(255, 237, 219)",
                                borderRadius: "4px",
                                pointerEvents: "none !important",
                                color:
                                  themeName === "dark-theme"
                                    ? "rgb(255, 224, 194)"
                                    : "rgb(105, 33, 0)",
                              }}
                            >
                              <div>Beta</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          popupState.close();
                          navigate("/i/spaces/start");
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "hover-effect-dark-theme-pointer-plus"
                            : "hover-effect-light-theme-pointer-plus"
                        }
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flexBasis: "auto",
                          boxSizing: "border-box",
                          flexShrink: "0",
                          margin: "0px",
                          minHeight: "0px",
                          minWidth: "0px",
                          position: "relative",
                          padding: "16px",
                        }}
                      >
                        <div
                          href=""
                          style={{
                            maxWidth: "100%",
                            outlineStyle: "none",
                            cursor: "pointer",
                            flexGrow: "1",
                            boxSizing: "border-box",
                            display: "flex",
                            flexBasis: "auto",
                            flexDirection: "column",
                            flexShrink: "0",
                            listStyle: "none",
                            margin: "0px",
                            padding: "0px",
                            minWidth: "0px",
                            minHeight: "0px",
                            position: "relative",
                            textDecoration: "none",
                            pointerEvents: "auto",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexGrow: "1",
                              boxSizing: "border-box",
                              flexBasis: "auto",
                              flexShrink: "0",
                              margin: "0px",
                              padding: "0px",
                              minWidth: "0px",
                              minHeight: "0px",
                              position: "relative",
                              textDecoration: "none",
                              pointerEvents: "auto",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              style={{
                                marginRight: "24px",
                                userSelect: "none",
                                flexShrink: "0",
                                maxWidth: "100%",
                                position: "relative",
                                alignItems: "center",
                                display: "inline-block",
                                cursor: "pointer",
                                pointerEvents: "auto",
                              }}
                              fill={
                                themeName === "dark-theme"
                                  ? "rgb(231,233,234)"
                                  : "rgb(15, 20, 25)"
                              }
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                              data-testid="icon"
                            >
                              <g>
                                <path d="M12 22.25c-4.99 0-9.18-3.393-10.39-7.994l1.93-.512c.99 3.746 4.4 6.506 8.46 6.506s7.47-2.76 8.46-6.506l1.93.512c-1.21 4.601-5.4 7.994-10.39 7.994zM5 11.5c0 3.866 3.13 7 7 7s7-3.134 7-7V8.75c0-3.866-3.13-7-7-7s-7 3.134-7 7v2.75zm12-2.75v2.75c0 2.761-2.24 5-5 5s-5-2.239-5-5V8.75c0-2.761 2.24-5 5-5s5 2.239 5 5zM11.25 8v4.25c0 .414.34.75.75.75s.75-.336.75-.75V8c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm-3 1v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm7.5 0c0-.414-.34-.75-.75-.75s-.75.336-.75.75v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9z"></path>
                              </g>
                            </svg>
                            <div
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                  : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                              }
                              style={{
                                textOverflow: "unset",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                                minWidth: "0px",
                                whiteSpace: "nowrap",
                                textAlign: "inherit",
                                flexGrow: "1",
                                overflow: "hidden",
                                boxSizing: "border-box",
                                margin: "0px",
                                padding: "0px",
                                position: "relative",
                                listStyle: "none",
                                textDecoration: "none",
                                fontSize: font20.fontSize,
                                lineHeight: font20.lineHeight,
                              }}
                            >
                              Create your Space
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div
                        onClick={() => {
                          popupState.close();
                          navigate("/settings");
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "hover-effect-dark-theme-pointer-plus"
                            : "hover-effect-light-theme-pointer-plus"
                        }
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flexBasis: "auto",
                          boxSizing: "border-box",
                          flexShrink: "0",
                          margin: "0px",
                          minHeight: "0px",
                          minWidth: "0px",
                          position: "relative",
                          padding: "16px",
                        }}
                      >
                        <div
                          href=""
                          style={{
                            maxWidth: "100%",
                            outlineStyle: "none",
                            cursor: "pointer",
                            flexGrow: "1",
                            boxSizing: "border-box",
                            display: "flex",
                            flexBasis: "auto",
                            flexDirection: "column",
                            flexShrink: "0",
                            listStyle: "none",
                            margin: "0px",
                            padding: "0px",
                            minWidth: "0px",
                            minHeight: "0px",
                            position: "relative",
                            textDecoration: "none",
                            pointerEvents: "auto",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              flexGrow: "1",
                              boxSizing: "border-box",
                              flexBasis: "auto",
                              flexShrink: "0",
                              margin: "0px",
                              padding: "0px",
                              minWidth: "0px",
                              minHeight: "0px",
                              position: "relative",
                              textDecoration: "none",
                              pointerEvents: "auto",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              style={{
                                marginRight: "24px",
                                userSelect: "none",
                                flexShrink: "0",
                                maxWidth: "100%",
                                position: "relative",
                                alignItems: "center",
                                display: "inline-block",
                                cursor: "pointer",
                                pointerEvents: "auto",
                              }}
                              fill={
                                themeName === "dark-theme"
                                  ? "rgb(231,233,234)"
                                  : "rgb(15, 20, 25)"
                              }
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                              data-testid="icon"
                            >
                              <g>
                                <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
                              </g>
                            </svg>
                            <div
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                  : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                              }
                              style={{
                                textOverflow: "unset",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                                minWidth: "0px",
                                whiteSpace: "nowrap",
                                textAlign: "inherit",
                                flexGrow: "1",
                                overflow: "hidden",
                                boxSizing: "border-box",
                                margin: "0px",
                                padding: "0px",
                                position: "relative",
                                listStyle: "none",
                                textDecoration: "none",
                                fontSize: font20.fontSize,
                                lineHeight: font20.lineHeight,
                              }}
                            >
                              Settings and privacy
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                    </Popover>
                  </div>
                )}
              </PopupState>
              {/* eleventh post modal btn test start to check  */}
              <div
                className="mt-1"
                style={{
                  margin: "0px",
                  padding: "0px ",
                  height: "auto",
                }}
              >
                <Button
                  className="post-btn-left-side-nav-bar chirp-bold-font"
                  variant="primary"
                  onClick={handleShow}
                  size="sm"
                  style={{
                    maxWidth: "233px",
                    border: "none",
                    outlineStyle: "none",
                    height: "52px",
                  }}
                >
                  <span
                    style={{
                      fontSize: font17.fontSize,
                      lineHeight: font17.lineHeight,
                    }}
                  >
                    Post
                  </span>
                </Button>
              </div>
              {/* eleventh post modal btn test finish to check  */}
              {/* twelveth logout modal test start to check  */}
              <div>
                <LogoutModal />
              </div>
              {/* twelveth logout modal test finish to check  */}
            </Stack>
          </div>
        </Col>
      )}
    </>
  );
}

export default LeftSideNavBar;
