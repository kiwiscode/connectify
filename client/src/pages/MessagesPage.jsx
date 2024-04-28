import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  Col,
  Row,
  Container,
  Stack,
  Modal,
  OverlayTrigger,
  Popover,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateChat from "../components/ui/CreateChat";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import CustomNotification from "../components/Notifications/CustomNotification";
import { List, message } from "antd";
import LeftSideNavBar from "../components/Main-Left-Side-Navbar/LeftSideNavbar";
import RightSideColumn from "../components/Main-Right-Side-Column/RightSideColumn";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { ThemeContext } from "../context/ThemeContext";
import io from "socket.io-client";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function MessagesPage() {
  const { userInfo, getToken } = useContext(UserContext);
  const socket = io.connect(`${API_URL}`);

  const [isHovered, setIsHovered] = useState(false);
  const [messageRooms, setmessageRooms] = useState([]);
  const [filteredRooms, setfilteredRooms] = useState([]);
  const [showMessageDeletePopover, setshowMessageDeletePopover] =
    useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showDeleteConversationModal, setShowDeleteConversationModal] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const [currentCreatedPost, setcurrentCreatedPost] = useState(null);
  const [receivedMessageRoom, setReceivedMessageRoom] = useState(null);

  const [notificationTest, setnotificationTest] = useState([]);
  const [notificationText, setnotificationText] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [searchString, setSearchString] = useState("");

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [room, setRoom] = useState("");
  const [showThreeDots, setShowThreeDots] = useState(false);
  const navigate = useNavigate();
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);
  useEffect(() => {
    socket.on("receive_specific_user_message_rooms", (data) => {
      setfilteredRooms(data.messages);
      setmessageRooms(data.messages);
    });
  }, []);
  useEffect(() => {
    const closePopover = (e) => {
      if (
        e.target.classList.contains("message-delete-three-dots") ||
        e.srcElement.parentNode.className === "btn-toolbar" ||
        e.srcElement.parentNode.className === "p-2 ms-auto message-icon"
      ) {
        // setIsHovered(!isHovered);
        setshowMessageDeletePopover(!showMessageDeletePopover);
      }
    };

    document.body.addEventListener("click", closePopover);

    return () => {
      document.body.removeEventListener("click", closePopover);
    };
  }, []);

  useEffect(() => {
    socket.emit("get_specific_user", userInfo);
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
    setReceivedMessageRoom(messageRoom);
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
            style={{
              color: themeName === "dark-theme" ? "white" : "",
              fontWeight: "700",
              fontSize: "20px",
              lineHeight: "24px",
            }}
          >
            Leave conversation ?
          </div>
          <div
            style={{
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              fontWeight: "400",
              fontSize: "15px",
              lineHeight: "20px",
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
            onClick={() => deleteConversation()}
            className={`red-btn ${themeName}-red-btn`}
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
            className={`mt-2 forgot-password-btn ${themeName}-black-btn`}
          >
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>,
  ];

  const popoverLeft = (
    <Popover
      style={{
        filter:
          themeName === "dark-theme"
            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
            : "",
        boxShadow:
          themeName === "dark-theme"
            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
        backgroundColor: themeName === "dark-theme" ? "black" : "",
      }}
      id="popover-positioned-left"
      title="Popover left"
      className={`${
        showMessageDeletePopover ? "" : "hideshowMessageDeletePopover"
      }`}
    >
      <div>
        <List size="small">
          <List.Item
            style={{
              padding: "12px 16px",

              opacity: "0.5",
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : "1px solid rgb(70, 70, 70)",
            }}
          >
            <Stack direction="horizontal" gap={2}>
              <svg
                color={
                  themeName === "dark-theme" ? "white" : "rgba(15,20,25,1.00)"
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
                style={{
                  lineHeight: "20px",
                  fontWeight: "700",
                  fontSize: "15px",
                  color: themeName === "dark-theme" ? "white" : "black ",
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
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : "1px solid rgb(70, 70, 70)",
            }}
          >
            <Stack direction="horizontal" gap={2}>
              <svg
                color={
                  themeName === "dark-theme" ? "white" : "rgba(15,20,25,1.00)"
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
                style={{
                  lineHeight: "20px",
                  fontWeight: "700",
                  fontSize: "15px",

                  color:
                    themeName === "dark-theme"
                      ? "white"
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
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : "1px solid rgb(70, 70, 70)",
            }}
          >
            <Stack direction="horizontal" gap={2}>
              <svg
                color={
                  themeName === "dark-theme" ? "white" : "rgba(15,20,25,1.00)"
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
                style={{
                  lineHeight: "20px",
                  fontWeight: "700",
                  fontSize: "15px",
                  color:
                    themeName === "dark-theme"
                      ? "white"
                      : "rgba(15,20,25,1.00)",
                }}
              >
                Report conversation
              </span>
            </Stack>
          </List.Item>
          <List.Item
            // className="message-popoover"
            className={`message-popoover message-popoover-${themeName}`}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px",
            }}
            onClick={() => handleShowDeleteConversationModal()}
          >
            {" "}
            <Stack direction="horizontal" gap={2}>
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
                style={{
                  color: "#f2212e",
                  lineHeight: "20px",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                Delete conversation
              </span>
            </Stack>
          </List.Item>
        </List>
      </div>
      <div></div>
    </Popover>
  );

  // start to check shared post view message

  const handleCallback = (childData) => {
    // Update the name in the component's state
    setcurrentCreatedPost(childData);
    postSharedMessage(childData.authorUserName, childData._id);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const postSharedMessage = (postOwner, postId) => {
    messageApi.success({
      type: "success",
      content: (
        <div>
          <span>Your post was sent.</span>
          <>
            <Link
              to={`/${postOwner}/status/${postId}`}
              style={{
                color: "white",
                marginLeft: "5px",
              }}
            >
              View
            </Link>
          </>
        </div>
      ),
      duration: 6,
      className: "custom-message-style",
    });
  };
  // finish to check shared post view message

  // socket io 1 client start to check

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
        console.log("Kendine notification mu göndericeksin ? ");
      }
    });

    socket.on("getText", (data) => {
      console.log("Data get text =>", data);
      if (data.senderName !== userInfo.username) {
        setnotificationText(data);
        if (data.type !== "message") {
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
            }
          );
        }
      } else {
        console.log("You cannot send a notification to yourself.");
      }
    });
  }, [socket]);

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

  const handleSearchTermChange = (e) => {
    const term = e.target.value;
    setSearchString(term);
    if (searchString !== "" && term !== "") {
      filterUsers(activeUsers, term);
    } else {
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    // Server tarafından emit edilen "activeUsers" olayını dinle
    socket.on("activeUsers", (users) => {
      const spliceActiveUser = users.filter((eachUser) => {
        return eachUser.username !== userInfo.username;
      });
      setActiveUsers(spliceActiveUser);
      if (searchString !== "") {
        filterUsers(users, searchString);
      } else {
        filterUsers([], searchString);
      }
    });
  }, []);

  const selectedUser = (user) => {
    const room = [userInfo.username, user.username].sort().join("_");

    setRoom(room);
    // Emit an event to join the room with the selected user
    socket.emit("join_user_room", { activeUser: userInfo, selectedUser: user });
  };

  // socket.on("receive_spesific_user_message_rooms", (data) => {
  //   setfilteredRooms(data.messages);
  //   setmessageRooms(data.messages);
  // });

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
      .get(`${API_URL}/home`, {
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

  const setLoadingTrue = () => {
    setIsLoading(true);
    setContent("");
  };

  const setLoadingFalse = () => {
    setIsLoading(false);
  };

  const getCreatedRoomDate = (chatFirstMessageTimeStamp) => {
    const timestamp = new Date(chatFirstMessageTimeStamp);

    // Tarih bilgisini belirli bir formatta gösterme
    const options = { month: "short", day: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      timestamp
    );

    return formattedDate;
  };

  const getMemberNotEqualActiveUser = (array) => {
    const result = array.members.filter((eachMember) => {
      return eachMember.username !== userInfo.username;
    });

    return result[0];
  };

  const redirectToChatDetailPage = (roomId) => {
    window.location.href = `http://localhost:5173/messages/${roomId}`;
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

  const [showEmptyInboxMessage, setshowEmptyInboxMessage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setmessagesLoadingbar(false);
    }, 500);
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton={false} // closeButton'u devre dışı bırak
          style={{
            border: "none",
          }}
        >
          <div
            className="close-button"
            style={{ borderRadius: "50%", cursor: "pointer" }}
          >
            <div>
              <svg
                style={{
                  border: "none",
                  fontSize: "15px",
                  margin: "5px",
                }}
                onClick={handleClose}
                width={20}
                height={20}
                color="rgb(15,20,25)"
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
          <span
            style={{
              position: "relative",
              marginLeft: "25px",
            }}
          >
            New message
          </span>
        </Modal.Header>
        <div className="joinChatContainer">
          <div>
            <input
              type="text"
              placeholder="Search people"
              value={searchString}
              onChange={handleSearchTermChange}
              style={{
                fontSize: "14px",
                width: "100%",
                outline: "none",
                border: "none",
                borderRadius: "0px",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            />
          </div>
          {!showEmptyInboxMessage &&
          filteredRooms.length &&
          !messagesLoadingbar ? (
            <>
              {filteredUsers.map((user) => (
                <>
                  <div className="selected-user-for-dm">
                    <Link
                      onClick={() => selectedUser(user)}
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                      }}
                      // to={`/messages/${messageRoomId}`}
                    >
                      <Stack
                        style={{
                          margin: "5px",
                          padding: "5px",
                        }}
                        direction="horizontal"
                      >
                        <div className="p-0">
                          {" "}
                          {user.imageUrl.slice(0, 3) !== "../" ? (
                            <img
                              style={{
                                borderRadius: "50%",
                              }}
                              width={40}
                              height={40}
                              src={user.imageUrl}
                              alt=""
                            />
                          ) : (
                            <div>
                              <svg
                                style={{
                                  borderRadius: "50%",
                                }}
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
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            marginLeft: "10px",
                          }}
                          className="p-0"
                        >
                          {" "}
                          <div
                            style={{
                              color: "rgb(15, 20, 25)",
                              fontSize: "15px",
                              lineHeight: "20px",
                              fontWeight: "700",
                            }}
                          >
                            {user.fullname}
                          </div>
                          <div
                            style={{
                              marginRight:
                                user.imageUrl.slice(0, 3) !== "../"
                                  ? ""
                                  : "32px",
                              color: "rgb(83, 100, 113)",
                              lineHeight: "20px",
                              fontSize: "15px",
                              fontWeight: "400",
                            }}
                          >
                            @{user.username}
                          </div>
                        </div>
                      </Stack>
                    </Link>
                  </div>
                </>
              ))}
            </>
          ) : null}
        </div>
        <Modal.Body>
          {/* start to check  search create message search bar*/}

          {/* finish to check  */}
        </Modal.Body>
      </Modal>

      {/* start to check delete conversation modal  */}
      {deleteModalOutput[0]}
      {/* finish to check delete conversation modal  */}

      {contextHolder}
      <ToastContainer theme={themeName === "dark-theme" ? "dark" : "light"} />

      <ResponsiveNavigationBarBottom />
      <Container
        style={{
          overflowX: "hidden",
          overflowY: "hidden",
        }}
        fluid
      >
        <Row
          style={{
            borderTop: "none",
            borderBottom: "none",
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          <LeftSideNavBar
            refreshPosts={() => handleShowPostsMessagePage()}
            setLoadingTrue={() => setLoadingTrue()}
            setLoadingFalse={() => setLoadingFalse()}
            parentCallBack={handleCallback}
          />

          {/* finish to check left bar column */}

          {/* start to check  main column */}
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
            }}
          >
            <Stack
              style={{
                paddingLeft: "12px",
                paddingRight: "12px",
              }}
              direction="horizontal"
              gap={3}
              className="mt-2"
            >
              <Link className="responsive-home-arrow" to={"/home"}>
                <svg
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
              </Link>
              <div
                style={{
                  lineHeight: "24px",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
                className="p-2"
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
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                  color={themeName === "dark-theme" ? "white" : ""}
                  fill="currentColor"
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

              <CreateChat writeMessageButton={false} />

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
                      type="text"
                      placeholder="Search Direct Messages"
                      value={searchTerm}
                      onChange={handleSearchTerm}
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        paddingLeft: "36px",
                        fontSize: "14px",
                        lineHeight: "16px",
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
                    {filteredRooms.map((eachMessageRoom) => (
                      <>
                        <div key={eachMessageRoom._id}>
                          {eachMessageRoom.deactivatedMember ? null : (
                            <div>
                              {eachMessageRoom.chat.length > 0 ? (
                                <div
                                  onMouseEnter={() => {
                                    setShowThreeDots(eachMessageRoom._id);
                                  }}
                                  onMouseLeave={() => {
                                    setShowThreeDots(false);
                                    setshowMessageDeletePopover(false);
                                  }}
                                  key={eachMessageRoom._id}
                                  style={{
                                    position: "relative",
                                    cursor: "pointer",
                                    listStyleType: "none",
                                    textDecoration: "none",
                                  }}
                                  to={
                                    isHovered !== eachMessageRoom._id &&
                                    !showMessageDeletePopover
                                      ? `/messages/${eachMessageRoom._id}`
                                      : null
                                  }
                                  onClick={() =>
                                    isHovered !== eachMessageRoom._id &&
                                    !showMessageDeletePopover
                                      ? redirectToChatDetailPage(
                                          eachMessageRoom._id
                                        )
                                      : null
                                  }
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
                                          ? "#f7f9f9"
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
                                              margin: "5px",
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
                                                  ).imageUrl.slice(0, 3) !==
                                                  "../" ? (
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
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="40"
                                                        height="40"
                                                        fill="rgb(83, 100, 113)"
                                                        className="bi bi-person-circle"
                                                        viewBox="0 0 16 16"
                                                        style={{
                                                          borderRadius: "50%",
                                                        }}
                                                      >
                                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                                      </svg>
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
                                                style={{
                                                  color:
                                                    themeName === "dark-theme"
                                                      ? "white"
                                                      : "rgb(15, 20, 25)",

                                                  fontSize: "15px",
                                                  fontWeight: "700",
                                                  lineHeight: "20px",
                                                }}
                                              >
                                                {eachMessageRoom.members[1] &&
                                                eachMessageRoom.members[0] ? (
                                                  <>
                                                    {eachMessageRoom.members[1]
                                                      .fullname !==
                                                    userInfo.fullname
                                                      ? eachMessageRoom
                                                          .members[1].fullname
                                                      : eachMessageRoom
                                                          .members[0]
                                                          .fullname}{" "}
                                                  </>
                                                ) : null}
                                              </span>
                                              <span
                                                style={{
                                                  color:
                                                    themeName === "dark-theme"
                                                      ? "#71767A"
                                                      : "rgb(83, 100, 113)",
                                                  fontSize: "15px",
                                                  lineHeight: "20px",
                                                  fontWeight: "400",
                                                }}
                                              >
                                                @
                                                {eachMessageRoom.members[1] &&
                                                eachMessageRoom.members[0] ? (
                                                  <>
                                                    {eachMessageRoom.members[1]
                                                      .username !==
                                                    userInfo.username
                                                      ? eachMessageRoom
                                                          .members[1].username
                                                      : eachMessageRoom
                                                          .members[0]
                                                          .username}{" "}
                                                  </>
                                                ) : null}
                                              </span>
                                              <span
                                                style={{
                                                  color:
                                                    themeName === "dark-theme"
                                                      ? "#71767A"
                                                      : "rgb(83, 100, 113)",
                                                  fontSize: "15px",
                                                  lineHeight: "20px",
                                                  fontWeight: "400",
                                                }}
                                              >
                                                {" "}
                                                ·{" "}
                                                {eachMessageRoom.chat[0]
                                                  ? getCreatedRoomDate(
                                                      eachMessageRoom.chat[0]
                                                        .messages[0].timestamp
                                                    )
                                                  : ""}
                                              </span>
                                              <div className="p-0">
                                                {" "}
                                                <span
                                                  style={{
                                                    color:
                                                      themeName === "dark-theme"
                                                        ? "#71767A"
                                                        : "rgb(83, 100, 113)",
                                                  }}
                                                >
                                                  {
                                                    eachMessageRoom.chat[
                                                      eachMessageRoom.chat
                                                        .length - 1
                                                    ].messages[0].text
                                                  }
                                                </span>
                                              </div>
                                            </div>
                                            {/* <div className="p-0 ms-auto">asd</div> */}

                                            <div
                                              style={{
                                                marginTop: "5px",
                                              }}
                                              onClick={() =>
                                                grabTheMessageRoom(
                                                  eachMessageRoom
                                                )
                                              }
                                              onMouseEnter={() => {
                                                console.log(
                                                  "Message room id =>",
                                                  eachMessageRoom._id
                                                );
                                                setIsHovered(
                                                  eachMessageRoom._id
                                                );
                                                // setshowMessageDeletePopover(true);
                                              }}
                                              onMouseLeave={() => {
                                                setIsHovered(false);
                                                setshowMessageDeletePopover(
                                                  false
                                                );
                                              }}
                                              className={`p-2 ms-auto message-icon`}
                                            >
                                              <OverlayTrigger
                                                trigger="click"
                                                placement="left"
                                                overlay={popoverLeft}
                                              >
                                                <div
                                                  onClick={() => {
                                                    setshowMessageDeletePopover(
                                                      !showMessageDeletePopover
                                                    );
                                                  }}
                                                  className={
                                                    isHovered ===
                                                      eachMessageRoom._id &&
                                                    themeName !== "dark-theme"
                                                      ? `message-delete-three-dots-parent message-delete-three-dots-parent-hovered`
                                                      : `message-delete-three-dots-parent-dark-theme message-delete-three-dots-parent-hovered-dark-theme`
                                                  }
                                                  style={{
                                                    cursor: "pointer",
                                                    borderRadius: "50%",
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      position: "absolute",
                                                      right: "50px",
                                                      top: "14px",
                                                      backgroundColor:
                                                        "#1d9bf0",
                                                      borderRadius: "50%",
                                                      width: "10px",
                                                      height: "10px",
                                                    }}
                                                  ></div>
                                                  <svg
                                                    style={{
                                                      cursor: "pointer",
                                                      position: "relative",
                                                      left: "10px",
                                                      top: "5px",
                                                    }}
                                                    color={
                                                      isHovered ===
                                                      eachMessageRoom._id
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
                                                      showThreeDots ===
                                                      eachMessageRoom._id
                                                        ? ""
                                                        : "hide"
                                                    } message-delete-three-dots bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi`}
                                                  >
                                                    <g>
                                                      <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                                    </g>
                                                  </svg>
                                                </div>
                                              </OverlayTrigger>
                                            </div>
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
                      </>
                    ))}
                  </div>
                ) : (
                  <>
                    <div style={{ textAlign: "left", padding: "16px" }}>
                      <div
                        style={{
                          lineHeight: "36px",
                          fontSize: "31px",
                          fontWeight: "800",
                          margin: "10px",
                        }}
                      >
                        Welcome to your inbox!
                      </div>
                      <div
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                          lineHeight: "20px",
                          fontSize: "15px",
                          fontWeight: "400",
                          margin: "10px",
                        }}
                      >
                        Drop a line, share posts and more with private
                        conversations between you and others on Connectify.
                      </div>
                      <button
                        className="write-a-message-message-page-btn"
                        style={{
                          color: "white",
                          backgroundColor: "rgb(29,155,240)",
                          margin: "10px",
                          borderStyle: "none",
                          borderRadius: "9999px",
                          minWidth: "52px",
                          outlineStyle: "none",
                          cursor: "pointer",
                          minHeight: "52px",
                          paddingLeft: "32px",
                          paddingRight: "32px",
                          fontWeight: "700",
                          fontSize: "15px",
                        }}
                        onClick={handleShow}
                      >
                        Write a message
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : messagesLoadingbar ? (
              <div style={{ textAlign: "center", padding: "64px" }}>
                <div
                  style={{
                    fontSize: "15px",
                  }}
                >
                  <LoadingSpinner
                    strokeColor={"rgb(29, 155, 240)"}
                  ></LoadingSpinner>
                </div>
              </div>
            ) : !messageRooms.length ? (
              <div style={{ textAlign: "left", padding: "16px" }}>
                <div
                  style={{
                    lineHeight: "36px",
                    fontSize: "31px",
                    fontWeight: "800",
                    margin: "10px",
                  }}
                >
                  Welcome to your inbox!
                </div>
                <div
                  style={{
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",

                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "400",
                    margin: "10px",
                  }}
                >
                  Drop a line, share posts and more with private conversations
                  between you and others on Connectify.
                </div>
                <button
                  className="write-a-message-message-page-btn"
                  style={{
                    color: "white",
                    backgroundColor: "rgb(29,155,240)",
                    margin: "10px",
                    borderStyle: "none",
                    borderRadius: "9999px",
                    minWidth: "52px",
                    outlineStyle: "none",
                    cursor: "pointer",
                    minHeight: "52px",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                    fontWeight: "700",
                    fontSize: "15px",
                  }}
                  onClick={handleShow}
                >
                  Write a message
                </button>
              </div>
            ) : null}
          </Col>
          {/* finish to check main column  */}

          {/* 3.column burası olucak */}
          <RightSideColumn />
        </Row>
      </Container>
    </>
  );
}

export default MessagesPage;
