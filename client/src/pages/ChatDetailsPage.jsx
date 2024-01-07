import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { UserContext } from "../context/UserContext";
import { Col, Row, Container, Stack } from "react-bootstrap";
import axios from "axios";
import { LogoutModal, PostModal } from "../components/ui/Modal";

import Picker from "emoji-picker-react";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

const socket = io.connect(API_URL);

function ChatDetailsPage() {
  const { chatRoomId } = useParams();
  const { userInfo, getToken } = useContext(UserContext);
  const [showNotificationColumn, setshowNotificationColumn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [spesificRoom, setspesificRoom] = useState([]);
  const [selectedUser, setselectedUser] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [room, setRoom] = useState("");
  const [disabled, setDisabled] = useState(true);

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");

  const [showSecondModal, setShowSecondModal] = useState(false);
  // start to check
  const navigate = useNavigate();
  const redirectToMessages = () => {
    navigate("/messages");
    window.location.reload();
  };
  // finish to check

  const toggleEmojis = () => {
    setshowEmojisBar("");
    if (showEmojisBar === "") {
      setshowEmojisBar("hide");
    } else if (showEmojisBar === "hide") {
      setshowEmojisBar("");
    }
    setShowSecondModal(true);
  };

  const onEmojiClick = (emojiObject) => {
    console.log("This is the emoji that you pick => ", emojiObject);
    setChosenEmoji(emojiObject);
    setCurrentMessage((prevText) => prevText + emojiObject.emoji);
    setDisabled(false);
  };

  useEffect(() => {
    socket.emit("send_spesific_chatRoomId", chatRoomId);

    socket.emit("send_spesific_userId", userInfo._id);

    socket.on("receive_selectedUser", (data) => {
      setselectedUser(data);
    });

    // start to check Mesajlar karşılıklı olarak receive ediliyor başarılı şekilde tek gereken render etmek kaldı !

    socket.on("receive_spesific_room_message", (data) => {
      console.log("Received message =>", data);
      setspesificRoom((list) => [...list, data]);
    });

    // finish to check Mesajlar karşılıklı olarak receive ediliyor başarılı şekilde tek gereken render etmek kaldı !

    // Component unmount olduğunda temizlik yap
    return () => {
      socket.disconnect();
    };
  }, [socket, room]);

  // mesajların render edildiği kısım start to check
  socket.on("send_spesific_chat_details", (data) => {
    const { room, messages } = data;
    console.log(room, messages);
    setRoom(room);
    setspesificRoom(messages);
  });
  // mesajların render edildiği kısım finish to check

  // Emit an event to join the room with the selected user
  socket.emit("join_spesific_message_room", {
    activeUser: userInfo,
    selectedUser: selectedUser[0],
  });

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: userInfo.username,
        text: currentMessage,
        time: new Date().toLocaleString("en-US", {
          weekday: "short",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      await socket.emit("send_spesific_room_message", messageData);
      setspesificRoom((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  console.log("Guest user =>", selectedUser);

  // NOTE start to check get all the notifications from backend api endpoint
  const showNotifications = () => {
    setshowNotificationColumn(true);

    axios
      .get(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setNotifications(response.data.notifications);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // NOTE finish to check get all the notifications from backend api endpoint
  //  NOTE start to check calculation the length according isReaded value
  const checkIfFavoriteNotitificationIsNotReaded = (array) => {
    const filter = array.map((eachNotificationItem) => {
      return eachNotificationItem.isFavorite.value !== false;
    });

    let count = 0;

    for (let i = 0; i < filter.length; i++) {
      if (filter[i] === true) {
        count++;
      }
    }

    return count;
  };

  const checkIfRepostNotitificationIsNotReaded = (array) => {
    const filter = array.map((eachNotificationItem) => {
      return eachNotificationItem.isRepost.value !== false;
    });

    let count = 0;

    for (let i = 0; i < filter.length; i++) {
      if (filter[i] === true) {
        count++;
      }
    }

    return count;
  };
  const checkIfCommentNotitificationIsNotReaded = (array) => {
    const filter = array.map((eachNotificationItem) => {
      return eachNotificationItem.isComment.value !== false;
    });

    let count = 0;

    for (let i = 0; i < filter.length; i++) {
      if (filter[i] === true) {
        count++;
      }
    }
    return count;
  };

  const getTotalLengthOfNotifications = () => {
    const checkFavoritesNotReadedYetInsideNotifications =
      checkIfFavoriteNotitificationIsNotReaded(userInfo.notifications);
    const checkRepostsNotReadedYetInsideNotifications =
      checkIfRepostNotitificationIsNotReaded(userInfo.notifications);
    const checkCommentsNotReadedYetInsideNotifications =
      checkIfCommentNotitificationIsNotReaded(userInfo.notifications);

    if (
      checkIfFavoriteNotitificationIsNotReaded(userInfo.notifications) ||
      checkIfRepostNotitificationIsNotReaded(userInfo.notifications) ||
      checkIfCommentNotitificationIsNotReaded(userInfo.notifications)
    ) {
      return `${
        checkFavoritesNotReadedYetInsideNotifications +
        checkRepostsNotReadedYetInsideNotifications +
        checkCommentsNotReadedYetInsideNotifications
      }`;
    } else {
      return "";
    }
  };
  //  NOTE finish to check calculation the length according isReaded value

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

  const getCreatedYearForSpesificUserProfilePage = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${monthsProfile[getMonth]} ${createdAt.getFullYear()}`;
  };

  return (
    <>
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
            <nav className="nav-bar-home">
              <Link href="/home">
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
                <Link to="/home">
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

                <Link>
                  <div className="notifications">
                    <div onClick={() => showNotifications()}>
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

                      <span>
                        Notifications{" "}
                        {getTotalLengthOfNotifications() !== "" ? (
                          <span className="notification-num">
                            {getTotalLengthOfNotifications()}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </div>
                </Link>
                {/* start to check redirect to the correct component for messages */}

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
                {/* finish to check redirect to the correct component for messages */}

                <Link to="/profile">
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
                  // IMPORTANT => calling the refreshPosts as a prop from PostModal component and refreshing the posts !
                  refreshPosts={() => handleShowPostsMessagePage()}
                  setLoadingTrue={() => setLoadingTrue()}
                  setLoadingFalse={() => setLoadingFalse()}
                ></PostModal>
              </div>
              <LogoutModal></LogoutModal>
            </nav>
          </Col>

          {/* finish to check left bar column */}

          {/* start to check  main column */}
          <Col
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={11} // 768px - 992px aralığı
            lg={6} // 1200px - 1400px aralığı
            xxl={6} // 1400px ve sonrası aralığı
            className={`main-column ${showNotificationColumn}`}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <div className="message-detail-container">
              {selectedUser.length ? (
                <>
                  <Stack direction="horizontal" gap={3}>
                    <div
                      className="p-2 arrow"
                      style={{
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      {" "}
                      <svg
                        style={{
                          display: "inline-block",
                          marginBottom: "2px",
                          border: "none",
                          fontSize: "15px",
                        }}
                        onClick={redirectToMessages}
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className=" responsive-messages-arrow r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                      >
                        <g>
                          <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                        </g>
                      </svg>
                    </div>
                    <div className="p-2">
                      {" "}
                      <span
                        style={{
                          lineHeight: "20px",
                          fontWeight: "700",
                          fontSize: "17px",
                        }}
                      >
                        {selectedUser[0].fullname}
                      </span>
                    </div>
                    <div className="p-2 ms-auto">
                      {" "}
                      <span>
                        <svg
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                        >
                          <g>
                            <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </Stack>

                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/profile/${selectedUser[0]._id}`}
                  >
                    <div className="message-detail-user-card">
                      {selectedUser[0].imageUrl.slice(0, 3) !== "../" ? (
                        <>
                          <img
                            style={{ borderRadius: "50%" }}
                            width={64}
                            height={64}
                            src={
                              selectedUser[0].imageUrl.slice(0, 3) !== "../"
                                ? selectedUser[0].imageUrl
                                : ""
                            }
                            alt=""
                          />
                        </>
                      ) : (
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            fill="rgb(83, 100, 113)"
                            className="bi bi-person-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                          </svg>
                        </div>
                      )}
                      <div
                        style={{
                          lineHeight: "20px",
                          fontWeight: "700",
                          fontSize: "15px",
                        }}
                      >
                        {selectedUser[0].fullname}
                      </div>
                      <div
                        style={{
                          lineHeight: "20px",
                          fontWeight: "400",
                          fontSize: "15px",
                          color: "rgb(83, 100, 113)",
                        }}
                      >
                        @{selectedUser[0].username}
                      </div>
                      <div
                        style={{
                          lineHeight: "16px",
                          margin: "15px 0px",
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "rgb(83, 100, 113)",
                        }}
                      >
                        Joined{" "}
                        {getCreatedYearForSpesificUserProfilePage(
                          selectedUser[0].createdAt
                        )}
                        <span>
                          {selectedUser[0].followers.length ? (
                            <>
                              <span
                                style={{
                                  color: "rgba(0,0,0,0.6)",
                                  lineHeight: "16px",
                                  fontWeight: "400",
                                  fontSize: "14px",
                                }}
                              >
                                {" "}
                                ·{" "}
                              </span>
                              <span
                                style={{
                                  color: "rgba(0,0,0,0.6)",
                                  lineHeight: "16px",
                                  fontWeight: "400",
                                  fontSize: "14px",
                                }}
                              >
                                {selectedUser[0].followers.length} follower
                              </span>
                            </>
                          ) : null}
                        </span>
                      </div>
                      <div
                        style={{
                          color: "rgb(83, 100, 113)",
                          fontSize: "13px",
                          lineHeight: "16px",
                          fontWeight: "400",
                        }}
                      >
                        Not followed by anyone you&apos;re following =&gt; ??
                        Check this part
                      </div>
                    </div>
                  </Link>
                </>
              ) : null}
            </div>

            {/* start to check render messages with spesific user  */}
            <div
              style={{
                overflowY: "auto",
                maxHeight: "500px",
                width: "100%",
                height: "100vh",
              }}
            >
              {spesificRoom.map((eachMessage, index) => (
                <div key={index}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          userInfo.username === eachMessage.sender
                            ? "flex-end"
                            : "flex-start",
                      }}
                      className="spesific-room-message-main-container"
                      key={index}
                    >
                      <div
                        className={
                          userInfo.username === eachMessage.sender
                            ? "spesific-room-message-you"
                            : "spesific-room-message-other"
                        }
                      >
                        <div className="spesific-room-message-container">
                          <div className="spesific-room-message-content">
                            <span className="spesific-room-message-text">
                              {eachMessage.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        userInfo.username === eachMessage.sender
                          ? "spesific-room-message-you-time spesific-room-message-message-meta"
                          : "spesific-room-message-other-time spesific-room-message-meta"
                      }
                    >
                      <p id="time">
                        {eachMessage.timestamp ? (
                          <span>
                            {new Date(eachMessage.timestamp).toLocaleString(
                              "en-US",
                              {
                                weekday: "short",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                          </span>
                        ) : (
                          <span>{eachMessage.time}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Row
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></Row>
            <div className="chat-footer-detail">
              <div
                className={`${showEmojisBar} date-picker-container`}
                style={{
                  position: "fixed",
                  zIndex: 9999,
                  marginBottom: "550px",
                  marginLeft: "-150px",
                }}
              >
                <Picker
                  onEmojiClick={onEmojiClick}
                  emojiStyle="twitter"
                  width={"320px"}
                  height={"400px"}
                />
              </div>
              <div className="p-2">
                <div
                  className="svg-border-parent"
                  style={{
                    // border: "1px solid black",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                >
                  <svg
                    onClick={() => toggleEmojis()}
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
              </div>
              <input
                className="message-input"
                type="text"
                value={currentMessage}
                placeholder="Start a new message"
                onChange={(event) => {
                  setDisabled(event.target.value ? false : true);
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
              />

              <button
                className={`${disabled ? "disabled-button" : "send-button"}`}
                onClick={sendMessage}
              >
                <div>
                  <svg
                    color="rgb(29,155,204)"
                    fill="currentColor"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`${
                      disabled
                        ? "disabled disabled-send-button-svg"
                        : "send-button-svg"
                    } r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03`}
                  >
                    <g>
                      <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path>
                    </g>
                  </svg>
                </div>
              </button>
            </div>

            {/* finish to check render messages with spesific user  */}
          </Col>
          {/* finish to check main column  */}

          {/* 3.column burası olucak */}

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

export default ChatDetailsPage;
