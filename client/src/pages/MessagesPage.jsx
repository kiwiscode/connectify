import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Col, Stack, Modal, Button } from "react-bootstrap";
import axios from "axios";
import CreateChat from "../components/ui/CreateChat";
import { List } from "antd";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { ThemeContext } from "../context/ThemeContext";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

const API_URL = import.meta.env.VITE_APP_API_URL;

import useWindowDimensions from "../hooks/getWindowDimensions";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";
import MobileTopNavigation from "../components/Navbar/mobile_top_navigation/MobileTopNavigation";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";
import { useNavigate } from "react-router-dom";
function MessagesPage() {
  const { userInfo, getToken } = useContext(UserContext);

  const [isHovered, setIsHovered] = useState(false);
  const [messageRooms, setmessageRooms] = useState([]);
  const [filteredRooms, setfilteredRooms] = useState([]);
  const [showMessageDeletePopover, setshowMessageDeletePopover] =
    useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [showDeleteConversationModal, setShowDeleteConversationModal] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const [receivedMessageRoom, setReceivedMessageRoom] = useState(null);

  const [activeUsers, setActiveUsers] = useState([]);
  const [searchString, setSearchString] = useState("");

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [showThreeDots, setShowThreeDots] = useState(false);
  const [{ theme, themeName }] = useContext(ThemeContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/all-messages`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((responseForMessages) => {
        console.log("response for messages:", responseForMessages);
        setfilteredRooms(responseForMessages.data.messages);
        setmessageRooms(responseForMessages.data.messages);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  }, []);

  const handleShowDeleteConversationModal = () => {
    console.log("Button clicked !");
    setshowMessageDeletePopover(false);
    setShowDeleteConversationModal(true);
  };

  const handleCloseDeleteConversationModal = () => {
    setShowDeleteConversationModal(false);
  };

  const grabTheMessageRoom = (messageRoom) => {
    console.log("Message room clicked => ", messageRoom);

    if (messageRoom) {
      setReceivedMessageRoom(messageRoom);
    }
  };

  const deleteConversation = () => {
    console.log(
      "Ready to delete this message room from current user user.messages array =>",
      receivedMessageRoom
    );

    axios
      .post(
        `${API_URL}/delete-message`,
        { receivedMessageRoom },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        handleCloseDeleteConversationModal();
        setfilteredRooms(response.data.currentMessagesArray);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const [isHoveredPopoverItem, setisHoveredPopoverItem] = useState(null);
  const {
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
  } = useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
  const deleteModalOutput = [
    <Modal
      backdropClassName={
        themeName === "dark-theme" ? `back-drop-${themeName}` : ""
      }
      centered={true}
      key={0}
      show={showDeleteConversationModal}
      onHide={handleClose}
      className="leave-conversation"
      contentClassName={
        themeName === "dark-theme"
          ? "leave-conversation-modal-dark-theme"
          : "leave-conversation-modal"
      }
    >
      <Modal.Body>
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
            Leave conversation?
          </div>
          <div
            className="mt-2 chirp-regular-font"
            style={{
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
            }}
          >
            This conversation will be deleted from your inbox. Other people in
            the conversation will still be able to see it.{" "}
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
            onClick={() => deleteConversation()}
            className={`red-btn ${themeName}-red-btn chirp-bold-font`}
            style={{
              maxWidth: "256px",
              minHeight: "44px",
              color: "white",
              backgroundColor: "rgb(244, 33, 46)",
              border: "none",
            }}
          >
            Leave
          </Button>
          <Button
            variant="light"
            onClick={handleCloseDeleteConversationModal}
            style={{
              color: themeName === "dark-theme" ? "white" : "black",
              maxWidth: "256px",
              minHeight: "44px",
            }}
            className={`mt-2 forgot-password-btn ${themeName}-black-btn chirp-bold-font`}
          >
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>,
  ];

  // start to check shared post view message

  // finish to check shared post view message

  const filterUsers = (users, term) => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().startsWith(term.toLowerCase())
    );

    if (searchString !== "") {
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/all-users`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        const allUsersFromDB = response.data;

        const spliceActiveUser = allUsersFromDB.filter((eachUser) => {
          return eachUser.username !== userInfo.username;
        });
        setActiveUsers(spliceActiveUser);
      })
      .catch((err) => {
        return err;
      });
  }, []);

  useEffect(() => {
    if (searchString !== "") {
      filterUsers(activeUsers, searchString);
    } else {
      filterUsers([], searchString);
    }
  }, [searchString]);

  const navigate = useNavigate();

  const redirectToChatDetailPage = (chatRoomId) => {
    navigate(`/messages/${chatRoomId}`);
  };

  // start to check filtering rooms
  const filterRoom = (array, searchTerm) => {
    if (searchTerm !== "") {
      const filteredArray = array.filter((eachRoom) => {
        return (
          eachRoom.room.startsWith(searchTerm.toLowerCase()) ||
          eachRoom.room.split("_")[1].startsWith(searchTerm.toLowerCase())
        );
      });
      setfilteredRooms(filteredArray);
    } else {
      setfilteredRooms(messageRooms);
    }
  };

  const handleSearchTerm = (term) => {
    const searchTerm = term.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (term !== "" && searchTerm !== "") {
      filterRoom(messageRooms, searchTerm);
    } else {
      setSearchTerm("");
      setfilteredRooms(messageRooms);
    }
  };
  // finish to check filtering rooms

  const checkIfAllFilteredRoomsChatEmpty = (array) => {
    const allChatLengths = array.map((eachMessageRoom) => {
      return eachMessageRoom.chat.length;
    });

    const sum = allChatLengths.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    return sum;
  };

  const handleShowPostsMessagePage = () => {
    axios
      .get(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((err) => {
        return err;
      });
  };

  const getCreatedRoomDate = (chatFirstMessageTimeStamp) => {
    const date = new Date(Number(chatFirstMessageTimeStamp));

    const options = { month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    return formattedDate;
  };

  const getMemberNotEqualActiveUser = (array) => {
    const result = array.members.filter((eachMember) => {
      return eachMember.username !== userInfo.username;
    });

    return result[0];
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

  const [messagesLoadingbar, setmessagesLoadingbar] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setmessagesLoadingbar(false);
    }, 500);
  }, []);

  const { width } = useWindowDimensions();

  const handleReadMessage = async (roomId) => {
    console.log("room =>", roomId);
    try {
      const url = await axios.post(
        `${API_URL}/mark-as-read-message`,
        {
          messageRoomId: roomId,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const response = url.data;

      console.log("Response =>", response);
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  const { isPostModalVisible } = useContext(ModalVisibilityContext);
  const [dataFromTopNavigationComponent, setDataFromTopNavigationComponent] =
    useState(null);

  function handleDataFromTopNavigationComponentOpenedStatus(data) {
    console.log("Data =>", data);
    setDataFromTopNavigationComponent(data);
  }

  function handleDataFromTopNavigationComponentClosedStatus(data) {
    console.log("Data =>", data);
    setDataFromTopNavigationComponent(data);
  }

  const [headerPosition, setHeaderPosition] = useState(0);
  const handleScroll = () => {
    const scrollPosition = window.pageYOffset;

    if (scrollPosition < 53) {
      setHeaderPosition(-scrollPosition);
    } else {
      setHeaderPosition(-53);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerPosition]);

  return (
    <>
      {" "}
      {/* start to check delete conversation modal  */}
      {deleteModalOutput[0]}
      {/* finish to check delete conversation modal  */}
      {!isPostModalVisible && <ResponsiveNavigationBarBottom />}{" "}
      <ResponsiveNavigationBarBottom />
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
          borderLeft:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",

          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          position: "relative",
          minHeight: width <= 700 ? "100dvh" : "",
        }}
      >
        <Stack
          style={{
            paddingLeft: "12px",
            paddingRight: "12px",
            transform:
              dataFromTopNavigationComponent ===
                "mobile top navigation was closed" &&
              `translateY(${headerPosition}px)`,
            backgroundColor:
              dataFromTopNavigationComponent ===
                "mobile top navigation was closed" && themeName === "dark-theme"
                ? "rgba(0, 0, 0, 0.65)"
                : dataFromTopNavigationComponent ===
                    "mobile top navigation was closed" &&
                  themeName === "light-theme"
                ? "rgba(255, 255, 255, 0.85)"
                : null,
            minHeight:
              dataFromTopNavigationComponent ===
                "mobile top navigation was closed" && "53px",
            transition:
              dataFromTopNavigationComponent ===
                "mobile top navigation was closed" &&
              "transform 0.3s cubic-bezier(0, 0, 0, 1)",
            backdropFilter:
              dataFromTopNavigationComponent ===
                "mobile top navigation was closed" && "blur(12px)",
          }}
          direction="horizontal"
          gap={3}
          className={width <= 500 ? "" : "mt-2"}
        >
          {width <= 500 && (
            <div>
              <MobileTopNavigation
                navigationBarOpenedStatus={
                  handleDataFromTopNavigationComponentOpenedStatus
                }
                noIcon={true}
              />
            </div>
          )}

          <div
            style={{
              lineHeight: width <= 500 ? "20px" : "24px",
              fontSize: width <= 500 ? "17px" : "20px",
            }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font p-2"
                : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font p-2"
            }
          >
            Messages
          </div>
          {/* settings icon start to check  */}
          <div
            // className="p-2 ms-auto settings-icon"
            className={`p-2 ms-auto settings-icon settings-icon-${themeName}`}
            style={{
              cursor: "pointer",
              borderRadius: "50%",
              position: "relative",
              width: "40px",
              height: "40px",
            }}
          >
            <svg
              style={{
                cursor: "pointer",
              }}
              width={20}
              height={20}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="messages-settings-and-privacy r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
            >
              <g>
                <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
              </g>
            </svg>
          </div>

          {/* settings icon finish to check  */}

          {/* create message icon start to check  */}
          <CreateChat />

          {/* create message icon finish to check  */}
        </Stack>

        {/* <Row
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></Row> */}

        {/* start to check here we gonna render filtered rooms */}
        {filteredRooms.length &&
        checkIfAllFilteredRoomsChatEmpty(filteredRooms) !== 0 ? (
          <div
            style={{
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
            className="App mt-3"
          >
            {/* test */}
            <div className="joinChatContainer">
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    paddingLeft: "16px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    color={"#6c7175"}
                    style={{
                      display: "inline-block",
                    }}
                    fill="currentColor"
                    width={`16px`}
                    height={`16px`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="search-bar-right-side-column r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-4wgw6l r-f727ji"
                  >
                    <g className="search-bar-right-side-column-group">
                      <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                    </g>
                  </svg>
                </div>
                <input
                  className="chirp-regular-font"
                  type="text"
                  placeholder="Search Direct Messages"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                  style={{
                    color: themeName === "dark-theme" ? "white" : "black",
                    paddingLeft: "36px",
                    fontSize: font14.fontSize,
                    lineHeight: font14.lineHeight,
                    width: "100%",
                    backgroundColor:
                      themeName !== "dark-theme" ? "white" : "black",
                    border:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
        {/* finish to check here we gonna render filtered rooms */}

        {/* mainpage yani messages rotasına tüm messagelerin gösterileceği column burası !  */}
        {!messagesLoadingbar && messageRooms.length ? (
          <>
            {filteredRooms?.length &&
            checkIfAllFilteredRoomsChatEmpty(filteredRooms) !== 0 ? (
              <div className="mt-3">
                {filteredRooms.map((eachMessageRoom, index) => (
                  <div key={eachMessageRoom._id}>
                    {eachMessageRoom.deactivatedMember ? null : (
                      <div>
                        {eachMessageRoom.chat.length > 0 ? (
                          <div
                            onMouseEnter={() => {
                              setShowThreeDots(index);
                            }}
                            onMouseLeave={() => {
                              setShowThreeDots(false);
                            }}
                            style={{
                              position: "relative",
                              cursor: "pointer",
                              listStyleType: "none",
                              textDecoration: "none",
                            }}
                            onClick={() => {
                              if (
                                isHovered !== index &&
                                !showMessageDeletePopover
                              ) {
                                redirectToChatDetailPage(eachMessageRoom.room);
                                handleReadMessage(eachMessageRoom.room);
                              }
                            }}
                          >
                            <div
                              className={`each-message-parent-div each-message-parent-div-${themeName}`}
                              style={{
                                minHeight: "73px",
                                paddingLeft: "12px",
                                paddingRight: "12px",

                                backgroundColor:
                                  eachMessageRoom.readed &&
                                  themeName !== "dark-theme"
                                    ? "white"
                                    : !eachMessageRoom.readed &&
                                      themeName !== "dark-theme"
                                    ? "#EFF3F4"
                                    : eachMessageRoom.readed &&
                                      themeName === "dark-theme"
                                    ? "black"
                                    : !eachMessageRoom.readed &&
                                      themeName === "dark-theme"
                                    ? "#181818"
                                    : "",
                              }}
                            >
                              {eachMessageRoom.chat &&
                                eachMessageRoom.chat.length > 0 && (
                                  <>
                                    <Stack
                                      style={{
                                        margin: "0px 5px",
                                        padding: "5px",
                                      }}
                                      direction="horizontal"
                                    >
                                      <div className="p-0">
                                        {" "}
                                        {getMemberNotEqualActiveUser(
                                          eachMessageRoom
                                        ) ? (
                                          <>
                                            {getMemberNotEqualActiveUser(
                                              eachMessageRoom
                                            ).imageUrl.slice(0, 3) !== "../" ? (
                                              <>
                                                <img
                                                  width={40}
                                                  height={40}
                                                  style={{
                                                    borderRadius: "50%",
                                                  }}
                                                  src={
                                                    getMemberNotEqualActiveUser(
                                                      eachMessageRoom
                                                    ).imageUrl
                                                  }
                                                  alt=""
                                                />
                                              </>
                                            ) : (
                                              <>
                                                <img
                                                  style={{
                                                    borderRadius: "50%",
                                                  }}
                                                  width="40"
                                                  height="40"
                                                  src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                                  alt=""
                                                />
                                              </>
                                            )}
                                          </>
                                        ) : null}
                                      </div>
                                      <div
                                        style={{
                                          marginLeft: "10px",
                                        }}
                                        className="p-0"
                                      >
                                        <span
                                          className="chirp-bold-font"
                                          style={{
                                            color:
                                              themeName === "dark-theme"
                                                ? "white"
                                                : "rgb(15, 20, 25)",

                                            fontSize: font15.fontSize,
                                            lineHeight: font15.lineHeight,
                                          }}
                                        >
                                          {eachMessageRoom.members[1] &&
                                          eachMessageRoom.members[0] ? (
                                            <>
                                              {eachMessageRoom.members[1]
                                                .fullname !== userInfo.fullname
                                                ? eachMessageRoom.members[1]
                                                    .fullname
                                                : eachMessageRoom.members[0]
                                                    .fullname}{" "}
                                            </>
                                          ) : null}
                                        </span>
                                        <span
                                          className="chirp-regular-font"
                                          style={{
                                            color:
                                              themeName === "dark-theme"
                                                ? "#71767A"
                                                : "rgb(83, 100, 113)",
                                            fontSize: font15.fontSize,
                                            lineHeight: font15.lineHeight,
                                          }}
                                        >
                                          @
                                          {eachMessageRoom.members[1] &&
                                          eachMessageRoom.members[0] ? (
                                            <>
                                              {eachMessageRoom.members[1]
                                                .username !== userInfo.username
                                                ? eachMessageRoom.members[1]
                                                    .username
                                                : eachMessageRoom.members[0]
                                                    .username}{" "}
                                            </>
                                          ) : null}
                                        </span>
                                        <span
                                          className="chirp-regular-font"
                                          style={{
                                            color:
                                              themeName === "dark-theme"
                                                ? "#71767A"
                                                : "rgb(83, 100, 113)",
                                            fontSize: font15.fontSize,
                                            lineHeight: font15.lineHeight,
                                          }}
                                        >
                                          {" "}
                                          ·{" "}
                                          {getCreatedRoomDate(
                                            eachMessageRoom?.timestamp
                                          )}
                                        </span>
                                        <div
                                          style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            maxWidth:
                                              eachMessageRoom.chat[
                                                eachMessageRoom.chat.length - 1
                                              ].text.length > 50
                                                ? "450px"
                                                : null,
                                          }}
                                          className="p-0"
                                        >
                                          <span
                                            className="chirp-regular-font"
                                            style={{
                                              color:
                                                themeName === "dark-theme"
                                                  ? "#71767A"
                                                  : "rgb(83, 100, 113)",
                                            }}
                                          >
                                            {
                                              eachMessageRoom.chat[
                                                eachMessageRoom.chat.length - 1
                                              ].text
                                            }
                                          </span>
                                        </div>
                                      </div>
                                      {/* modern popover test start to check  */}
                                      <div
                                        style={{
                                          marginTop: "5px",
                                        }}
                                        className={`p-2 ms-auto message-icon`}
                                      >
                                        <PopupState
                                          variant="popover"
                                          popupId="demo-popup-popover"
                                        >
                                          {(popupState) => (
                                            <div
                                              onClick={() => {
                                                setshowMessageDeletePopover(
                                                  !showMessageDeletePopover
                                                );
                                              }}
                                            >
                                              {!eachMessageRoom.readed && (
                                                <div
                                                  style={{
                                                    position: "absolute",
                                                    top: "30px",
                                                    backgroundColor: "#1d9bf0",
                                                    borderRadius: "50%",
                                                    width: "10px",
                                                    height: "10px",
                                                  }}
                                                ></div>
                                              )}
                                              <Button
                                                onMouseEnter={() => {
                                                  grabTheMessageRoom(
                                                    eachMessageRoom
                                                  );
                                                  setIsHovered(index);
                                                }}
                                                onMouseLeave={() => {
                                                  setIsHovered(false);
                                                  grabTheMessageRoom(null);
                                                }}
                                                style={{
                                                  border: "none",
                                                  backgroundColor:
                                                    "transparent",
                                                }}
                                                variant="text"
                                                {...bindTrigger(popupState)}
                                              >
                                                <BootstrapTooltip
                                                  title="More"
                                                  themeName={
                                                    themeName === "dark-theme"
                                                      ? "dark-theme"
                                                      : "light-theme"
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      isHovered === index &&
                                                      themeName !== "dark-theme"
                                                        ? `message-delete-three-dots-parent message-delete-three-dots-parent-hovered`
                                                        : `message-delete-three-dots-parent-dark-theme message-delete-three-dots-parent-hovered-dark-theme`
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                      borderRadius: "50%",
                                                    }}
                                                  >
                                                    {" "}
                                                    <svg
                                                      style={{
                                                        cursor: "pointer",
                                                        position: "relative",
                                                        top: "5px",
                                                      }}
                                                      color={
                                                        isHovered === index
                                                          ? "#259ef0"
                                                          : themeName ===
                                                            "dark-theme"
                                                          ? "#71767A"
                                                          : "rgb(83, 100, 113)"
                                                      }
                                                      fill="currentColor"
                                                      width={`${1.25}em`}
                                                      height={`${1.25}em`}
                                                      viewBox="0 0 24 24"
                                                      aria-hidden="true"
                                                      className={`${
                                                        showThreeDots === index
                                                          ? ""
                                                          : "hide"
                                                      } message-delete-three-dots bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi`}
                                                    >
                                                      <g>
                                                        <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                                      </g>
                                                    </svg>{" "}
                                                  </div>
                                                </BootstrapTooltip>
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
                                                  vertical: -10,
                                                  horizontal: 230,
                                                }}
                                                className={`${
                                                  showMessageDeletePopover &&
                                                  themeName === "dark-theme"
                                                    ? "popover-material-ui-dark-theme"
                                                    : showMessageDeletePopover &&
                                                      themeName !== "dark-theme"
                                                    ? "popover-material-ui-light-theme"
                                                    : "hideshowMessageDeletePopover "
                                                }`}
                                              >
                                                <div>
                                                  {" "}
                                                  <List size="small">
                                                    <List.Item
                                                      style={{
                                                        padding: "12px 16px",

                                                        opacity: "0.5",
                                                        borderBottom:
                                                          themeName !==
                                                          "dark-theme"
                                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                                            : "1px solid rgb(70, 70, 70)",
                                                      }}
                                                    >
                                                      <Stack
                                                        direction="horizontal"
                                                        gap={2}
                                                      >
                                                        <svg
                                                          color={
                                                            themeName ===
                                                            "dark-theme"
                                                              ? "white"
                                                              : "rgba(15,20,25,1.00)"
                                                          }
                                                          fill="currentcolor"
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
                                                        <span
                                                          className="chirp-bold-font"
                                                          style={{
                                                            fontSize:
                                                              font15.fontSize,
                                                            lineHeight:
                                                              font15.lineHeight,
                                                            color:
                                                              themeName ===
                                                              "dark-theme"
                                                                ? "white"
                                                                : "black ",
                                                          }}
                                                        >
                                                          Pin conversation
                                                        </span>
                                                      </Stack>
                                                    </List.Item>
                                                    <List.Item
                                                      style={{
                                                        padding: "12px 16px",
                                                        opacity: "0.5",
                                                        borderBottom:
                                                          themeName !==
                                                          "dark-theme"
                                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                                            : "1px solid rgb(70, 70, 70)",
                                                      }}
                                                    >
                                                      <Stack
                                                        direction="horizontal"
                                                        gap={2}
                                                      >
                                                        <svg
                                                          color={
                                                            themeName ===
                                                            "dark-theme"
                                                              ? "white"
                                                              : "rgba(15,20,25,1.00)"
                                                          }
                                                          fill="currentcolor"
                                                          width={`${1.25}em`}
                                                          height={`${1.25}em`}
                                                          viewBox="0 0 24 24"
                                                          aria-hidden="true"
                                                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-1q142lx"
                                                        >
                                                          <g>
                                                            <path d="M20.29 2.29l-2.34 2.34C16.47 3.01 14.34 2 12 2 7.93 2 4.51 5.02 4 9.05L2.87 18h1.72l-2.3 2.29 1.42 1.42 18-18-1.42-1.42zM6.59 16H5.13l.85-6.7C6.36 6.27 8.94 4 12 4c1.79 0 3.42.78 4.54 2.05L6.59 16zM12 22c-1.57 0-2.98-.73-3.89-1.86l1.42-1.43c.55.78 1.45 1.29 2.47 1.29 1.31 0 2.42-.83 2.83-2H12v-2h6.86l-.74-5.87 1.76-1.76c.05.22.08.44.11.67L21.14 18H16.9c-.46 2.28-2.48 4-4.9 4z"></path>
                                                          </g>
                                                        </svg>
                                                        <span
                                                          className="chirp-bold-font"
                                                          style={{
                                                            fontSize:
                                                              font15.fontSize,
                                                            lineHeight:
                                                              font15.lineHeight,

                                                            color:
                                                              themeName ===
                                                              "dark-theme"
                                                                ? "white "
                                                                : "rgba(15,20,25,1.00)",
                                                          }}
                                                        >
                                                          Snooze conversation
                                                        </span>
                                                      </Stack>
                                                    </List.Item>
                                                    <List.Item
                                                      style={{
                                                        padding: "12px 16px",
                                                        opacity: "0.5",
                                                        borderBottom:
                                                          themeName !==
                                                          "dark-theme"
                                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                                            : "1px solid rgb(70, 70, 70)",
                                                      }}
                                                    >
                                                      <Stack
                                                        direction="horizontal"
                                                        gap={2}
                                                      >
                                                        <svg
                                                          color={
                                                            themeName ===
                                                            "dark-theme"
                                                              ? "white"
                                                              : "rgba(15,20,25,1.00)"
                                                          }
                                                          fill="currentcolor"
                                                          width={`${1.25}em`}
                                                          height={`${1.25}em`}
                                                          viewBox="0 0 24 24"
                                                          aria-hidden="true"
                                                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-1q142lx"
                                                        >
                                                          <g>
                                                            <path d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"></path>
                                                          </g>
                                                        </svg>
                                                        <span
                                                          className="chirp-bold-font"
                                                          style={{
                                                            fontSize:
                                                              font15.fontSize,
                                                            lineHeight:
                                                              font15.lineHeight,
                                                            color:
                                                              themeName ===
                                                              "dark-theme"
                                                                ? "white"
                                                                : "rgba(15,20,25,1.00)",
                                                          }}
                                                        >
                                                          Report conversation
                                                        </span>
                                                      </Stack>
                                                    </List.Item>
                                                    <List.Item
                                                      onMouseEnter={() =>
                                                        setisHoveredPopoverItem(
                                                          index
                                                        )
                                                      }
                                                      onMouseLeave={() =>
                                                        setisHoveredPopoverItem(
                                                          null
                                                        )
                                                      }
                                                      className={`message-popoover message-popoover-${themeName}`}
                                                      style={{
                                                        padding: "12px 16px",
                                                        cursor: "pointer",
                                                        borderBottomLeftRadius:
                                                          "6px",
                                                        borderBottomRightRadius:
                                                          "6px",
                                                      }}
                                                      onClick={() => {
                                                        handleShowDeleteConversationModal();
                                                        popupState.close();
                                                      }}
                                                    >
                                                      {" "}
                                                      <Stack
                                                        direction="horizontal"
                                                        gap={2}
                                                      >
                                                        <svg
                                                          style={{}}
                                                          color="#f2212e
                "
                                                          fill="currentcolor"
                                                          width={`${1.25}em`}
                                                          height={`${1.25}em`}
                                                          viewBox="0 0 32 32"
                                                          aria-hidden="true"
                                                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1q142lx r-9l7dzd"
                                                        >
                                                          <g>
                                                            <path d="M20 23h-2v-8h2v8zm-6-8h-2v8h2v-8zm14-5h-1.713l-1.111 15.577C25.038 27.496 23.424 29 21.5 29H10.486c-1.915 0-3.522-1.496-3.66-3.405L5.699 10H4V8h7V6c0-1.654 1.346-3 3-3h4c1.654 0 3 1.346 3 3v2h7v2zM13 8h6V6c0-.551-.449-1-1-1h-4c-.551 0-1 .449-1 1v2zm11.281 2H7.705l1.117 15.451c.062.869.793 1.549 1.665 1.549H21.5c.88 0 1.619-.688 1.681-1.565L24.282 10z"></path>
                                                          </g>
                                                        </svg>
                                                        <span
                                                          className="chirp-bold-font"
                                                          style={{
                                                            color: "#f2212e",
                                                            fontSize:
                                                              font15.fontSize,
                                                            lineHeight:
                                                              font15.lineHeight,
                                                          }}
                                                        >
                                                          Delete conversation
                                                        </span>
                                                      </Stack>
                                                    </List.Item>
                                                  </List>
                                                </div>
                                              </Popover>
                                            </div>
                                          )}
                                        </PopupState>
                                      </div>
                                      {/* modern popover test finish to check  */}
                                    </Stack>

                                    {/* message text is here ? start to check  */}

                                    {/* message text is here ? finish to check  */}
                                  </>
                                )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <CreateChat messagesPageWriteAmESSAGEoPTION={true} />
            )}
          </>
        ) : messagesLoadingbar ? (
          <div style={{ textAlign: "center", padding: "64px" }}>
            <LoadingSpinner
              strokeColor={"rgb(29, 155, 240)"}
              fontSize={true}
            ></LoadingSpinner>
          </div>
        ) : !messageRooms.length ? (
          <CreateChat messagesPageWriteAmESSAGEoPTION={true} />
        ) : null}
      </Col>
    </>
  );
}

export default MessagesPage;
