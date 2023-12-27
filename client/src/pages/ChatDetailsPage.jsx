import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { UserContext } from "../context/UserContext";
import { Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import { LogoutModal, PostModal } from "../components/ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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
  }, [socket]);

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
        }}
      >
        <Row
          style={{
            height: "100vh",
            borderTop: "none",
            borderBottom: "none",
          }}
        >
          <Col className="left-column" xs={12} sm={12} md={6} lg={3}>
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

              <div className="inner-div">
                <Link to="/home">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-house"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="black"
                          strokeWidth="0.5"
                          d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"
                        />
                      </svg>

                      <span>Home</span>
                    </div>
                  </div>
                </Link>

                <Link>
                  <div>
                    <div onClick={() => showNotifications()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-bell"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="black"
                          strokeWidth="0.5"
                          d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"
                        />
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
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-envelope"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="black"
                          strokeWidth="0.5"
                          d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
                        />
                      </svg>
                      <span>Messages</span>
                    </div>
                  </div>
                </Link>
                {/* finish to check redirect to the correct component for messages */}

                <Link to="/communities">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-people"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="black"
                          strokeWidth="0.5"
                          d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
                        />
                      </svg>
                      <span>Communities</span>
                    </div>
                  </div>
                </Link>

                <Link to="/profile">
                  <div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-person"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="black"
                          strokeWidth="0.5"
                          d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"
                        />
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
            xs={12}
            sm={12}
            md={4}
            lg={6}
            style={{
              className: `main-column ${showNotificationColumn}`,
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <div className="message-detail-container">
              {selectedUser.length ? (
                <>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/profile/${selectedUser[0]._id}`}
                  >
                    <span
                      style={{
                        lineHeight: "20px",
                        fontWeight: "700",
                        fontSize: "17px",
                      }}
                    >
                      {selectedUser[0].fullname}
                    </span>
                    <div className="message-detail-user-card">
                      {selectedUser[0].imageUrl.slice(0, 3) !== "../" ? (
                        <>
                          <img
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-emoji-smile"
                  viewBox="0 0 16 16"
                  style={{
                    cursor: "pointer",
                    color: "rgb(29, 155, 240)",
                  }}
                  onClick={() => toggleEmojis()}
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                </svg>
              </div>
              <input
                className="message-input"
                type="text"
                value={currentMessage}
                placeholder="Start a new message"
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
              />

              <button className="send-button" onClick={sendMessage}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>

            {/* finish to check render messages with spesific user  */}
          </Col>
          {/* finish to check main column  */}

          {/* 3.column burası olucak */}

          <Col
            className="side-bar-column"
            xs={12}
            sm={12}
            md={3}
            lg={3}
            style={{
              height: "100%",
            }}
          ></Col>
        </Row>
      </Container>
    </>
  );
}

export default ChatDetailsPage;
