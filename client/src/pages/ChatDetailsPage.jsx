import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {
  Col,
  Stack,
  Button,
  // Popover,
  // OverlayTrigger,
} from "react-bootstrap";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { ThemeContext } from "../context/ThemeContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

import io from "socket.io-client";
import useWindowDimensions from "../hooks/getWindowDimensions";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { Popover } from "@mui/material";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";
const socket = io.connect(API_URL);

function ChatDetailsPage() {
  const scrollRef = useRef();
  const { chatRoomId } = useParams();
  const { userInfo, getToken } = useContext(UserContext);

  const [spesificRoom, setspesificRoom] = useState([]);
  const [selectedUser, setselectedUser] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [room, setRoom] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");

  const navigate = useNavigate();

  // finish to check shared post view message

  useEffect(() => {
    // start to check refactoring from messages page
    socket.emit("send_spesific_chatRoomId", chatRoomId);
    socket.emit("send_spesific_userId", userInfo._id);

    socket.on("receive_selectedUser", (data) => {
      setselectedUser(data);
    });

    // Emit an event to join the room with the selected user
    socket.emit("join_spesific_message_room", {
      activeUser: userInfo,
      selectedUser: selectedUser[0],
    });
    // finish to check refactoring from messages page

    // start to check Mesajlar karşılıklı olarak receive ediliyor başarılı şekilde tek gereken render etmek kaldı !
    socket.on("receive_spesific_room_message", (data) => {
      setspesificRoom((list) => [...list, data]);
    });
    // finish to check Mesajlar karşılıklı olarak receive ediliyor başarılı şekilde tek gereken render etmek kaldı !

    return () => {
      // Clean up event listeners
      socket.off("receive_selectedUser");
      socket.off("receive_spesific_room_message");
    };
  }, [socket, room, chatRoomId, userInfo._id]);

  // mesajların render edildiği kısım start to check
  socket.on("send_spesific_chat_details", (data) => {
    const { room, messages } = data;
    setRoom(room);
    setspesificRoom(messages);
  });

  const [typeIndicatorResult, setShowTypingIndicator] = useState(null);

  // mesajların render edildiği kısım finish to check

  const sendMessage = async () => {
    if (currentMessage !== "" && chosenEmoji !== "") {
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

      // socket io 5 client start to check
      const handleNotification = (
        messageReceiver,
        messageSender,
        notificationType,
        messageContent
      ) => {
        socket.emit("sendNotification", {
          receiverName: messageReceiver.username,
          senderName: messageSender.username,
          type: notificationType,
          contactHasBeenMade: messageSender,
          text: messageContent,
          senderInfo: userInfo,
        });
      };
      // socket io 5 client finish to check

      await socket.emit("send_spesific_room_message", messageData);
      setspesificRoom((list) => [...list, messageData]);
      setCurrentMessage("");
      handleNotification(selectedUser[0], userInfo, "message", currentMessage);
    } else {
      setDisabled(true);
    }
  };

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

  const onEmojiClick = (emojiObject) => {
    const sym = emojiObject.unified.split("_");
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);

    setChosenEmoji(emoji);
    setCurrentMessage((prevText) => prevText + emoji);
  };

  useEffect(() => {
    setDisabled(currentMessage.length || chosenEmoji ? false : true);
  }, [currentMessage, chosenEmoji]);

  useEffect(() => {
    const closeEmojiContainer = (e) => {
      if (
        e.target.classList.contains("chat-detail-emoji-picker") ||
        e.srcElement.parentElement.className ===
          "chat-detail-emoji-svg-border-parent" ||
        e.srcElement.parentNode.className === "p-2 chat-detail-emoji" ||
        e.target.classList.value === ""
      ) {
        setshowEmojisBar(false);
      } else {
        setshowEmojisBar(true);
      }
    };

    document.body.addEventListener("click", closeEmojiContainer);

    return () => {
      document.body.removeEventListener("click", closeEmojiContainer);
    };
  }, []);

  const navigateMinusOne = () => {
    navigate(-1);
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

  const [{ theme, themeName }] = useContext(ThemeContext);

  const { width } = useWindowDimensions();

  // socket test real time typing indicator room in start to check
  const [sameTimeSameRoom, setSameTimeSameRoom] = useState(null);

  useEffect(() => {
    socket.on("same_time_same_room", (data) => {
      setSameTimeSameRoom(true);
    });
  }, [socket, chatRoomId, userInfo._id]);

  const [activeUsersInRoom, setActiveUsersInRoom] = useState(null);

  const [youCanShowTypingIndicator, setYouCanShowTypingIndicator] =
    useState(null);

  useEffect(() => {
    socket.on("interactedChatRooms", (data) => {
      setActiveUsersInRoom(data);

      const findTheCorrectRoom = data?.interactedChatRooms.find((eachRoom) => {
        return eachRoom.room.roomName === data?.room;
      });

      const userActiveStatusFirstUser =
        findTheCorrectRoom.room.activeUsers[0].user1.isActiveInRoom;
      const userActiveStatusSecondUser =
        findTheCorrectRoom.room.activeUsers[0].user2.isActiveInRoom;

      console.log(
        "Active user status inside finded room =>",
        userActiveStatusFirstUser,
        userActiveStatusSecondUser
      );
      if (userActiveStatusFirstUser && userActiveStatusSecondUser) {
        setYouCanShowTypingIndicator(true);
      }
    });
  }, []);

  const handleChangeCurrentMessage = (event) => {
    setCurrentMessage(event.target.value);
    setDisabled(event.target.value || chosenEmoji ? false : true);

    if (youCanShowTypingIndicator && currentMessage.length >= 4) {
      socket.emit("typing_indicator", {
        typingStatus: true,
        whoIsTypingImage: userInfo.imageUrl,
        whoIsTypingUserName: userInfo.username,
        whoIsTypingFullName: userInfo.fullname,
      });
    } else if (youCanShowTypingIndicator && currentMessage.length <= 4) {
      socket.emit("typing_indicator", {
        typingStatus: false,
        whoIsTypingImage: userInfo.imageUrl,
        whoIsTypingUserName: userInfo.username,
        whoIsTypingFullName: userInfo.fullname,
      });
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });

      setShowTypingIndicator(null);
    }
  };

  useEffect(() => {
    socket.on("typing_result", (data) => {
      if (data) {
        if (
          data.data.whoIsTypingUserName !== userInfo.username &&
          currentMessage.length >= 4 &&
          data.data.typingStatus
        ) {
          console.log(data.data, " ", "typing...");

          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          setShowTypingIndicator(data.data);
        } else if (
          data.data.whoIsTypingUserName !== userInfo.username &&
          currentMessage.length <= 4 &&
          !data.data.typingStatus
        ) {
          console.log(
            "Length smaller than or equal 4 do not show any typing indicator..."
          );
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
          setShowTypingIndicator(null);
        }
      }
    });
  }, [socket, currentMessage]);

  // socket test real time typing indicator room in finish to check
  useEffect(() => {
    setShowTypingIndicator(null);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [spesificRoom]);

  return (
    <>
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
        <div
          // className="message-detail-container"
          className={`message-detail-container message-detail-container-${themeName}`}
        >
          {selectedUser.length ? (
            <>
              <Stack direction="horizontal" gap={3}>
                <Link
                  onClick={navigateMinusOne}
                  to={"/messages"}
                  // className="p-2 arrow"
                  className={
                    themeName === "dark-theme"
                      ? `p-2 arrow-${themeName}`
                      : `p-2 arrow`
                  }
                  style={{
                    position: "relative",
                    width: "30px",
                    height: " 30px",

                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "white" : "black"}
                    fill="currentColor"
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      border: "none",
                      left: "5px",
                      fontSize: "15px",
                    }}
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
                <div className="p-2">
                  {" "}
                  <span
                    style={{
                      lineHeight: "20px",
                      fontWeight: "700",
                      fontSize: "17px",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    {selectedUser[0].fullname}
                  </span>
                </div>
                <div
                  // className="p-2 message-info ms-auto"
                  className={
                    themeName === "dark-theme"
                      ? `p-2 message-info-${themeName} ms-auto`
                      : `p-2 message-info ms-auto`
                  }
                  style={{
                    position: "relative",
                    left: "10px",
                    width: "40px",
                    height: " 40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  <span>
                    <svg
                      color={themeName === "dark-theme" ? "white" : "black"}
                      fill="currentColor"
                      style={{
                        position: "absolute",
                        border: "none",
                        fontSize: "15px",
                        bottom: "10px",
                        left: "10px",
                      }}
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
                <div
                  // className="message-detail-user-card"
                  className={
                    themeName === "dark-theme"
                      ? `message-detail-user-card-${themeName}`
                      : "message-detail-user-card"
                  }
                >
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
                        fill={
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)"
                        }
                        className="bi bi-person-circle"
                        viewBox="0 0 16 16"
                        style={{
                          borderRadius: "50%",
                        }}
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
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    {selectedUser[0].fullname}
                  </div>
                  <div
                    style={{
                      lineHeight: "20px",
                      fontWeight: "400",
                      fontSize: "15px",

                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
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
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
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
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
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
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
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
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                      fontSize: "13px",
                      lineHeight: "16px",
                      fontWeight: "400",
                    }}
                  >
                    Not followed by anyone you&apos;re following =&gt; ?? Check
                    this part
                  </div>
                </div>
              </Link>
            </>
          ) : null}
        </div>

        {/* start to check render messages with spesific user  */}
        <div
          className={`scrollbar-add scrollbar-add-${themeName} mt-2`}
          style={{
            overflowY: "auto",
            maxHeight: "500px",
            width: "100%",
            height: "100vh",
            height: "100dvh",
            // padding: "5px",
          }}
        >
          {spesificRoom.map((eachMessage, index) => (
            <div
              ref={scrollRef}
              style={{ padding: "0px 12px 0px 12px" }}
              key={eachMessage._id}
            >
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
                >
                  <div
                    style={{}}
                    className={
                      userInfo.username === eachMessage.sender
                        ? `spesific-room-message-you`
                        : `spesific-room-message-other spesific-room-message-other-${themeName}`
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
                      <>
                        <span
                          className="time-stamp-message-detail"
                          style={{
                            // backgroundColor: "yellow",
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                          }}
                        >
                          {new Date(eachMessage.timestamp).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "numeric",
                              minute: "numeric",
                              // second: "numeric",
                              hour12: true,
                            }
                          )}
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
                        }}
                      >
                        <span className="time-stamp-message-detail">
                          {eachMessage.time}
                        </span>
                        ·
                        <span className="time-stamp-message-sent-status">
                          Sent
                        </span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}{" "}
          {typeIndicatorResult && (
            <div
              className="mb-2"
              style={{
                padding: "0px 12px 0px 12px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {typeIndicatorResult.whoIsTypingImage?.slice(0, 3) !== "../" ? (
                  <img
                    style={{
                      borderRadius: "50%",
                    }}
                    src={typeIndicatorResult.whoIsTypingImage}
                    alt=""
                    width={40}
                    height={40}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    color={
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)"
                    }
                    fill="currentColor"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                  </svg>
                )}
                <div
                  className={
                    themeName === "dark-theme"
                      ? "typing_indicator-dark-theme"
                      : "typing_indicator-light-theme"
                  }
                  style={{
                    position: "relative",
                    padding: "12px 16px",
                    left: "8px",
                    width: "90px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className={
                        themeName === "dark-theme"
                          ? "first-div-dark-theme"
                          : "first-div-light-theme"
                      }
                      style={{
                        backgroundColor: "#71767a",
                        borderRadius: "50%",
                        height: "14px",
                        width: "14px",
                      }}
                    ></div>
                    <div
                      className={
                        themeName === "dark-theme"
                          ? "second-div-dark-theme"
                          : "second-div-light-theme"
                      }
                      style={{
                        marginLeft: "5px",
                        backgroundColor: "#71767a",
                        borderRadius: "50%",
                        height: "14px",
                        width: "14px",
                      }}
                    ></div>
                    <div
                      className={
                        themeName === "dark-theme"
                          ? "third-div-dark-theme"
                          : "third-div-light-theme"
                      }
                      style={{
                        marginLeft: "5px",
                        backgroundColor: "#71767a",
                        borderRadius: "50%",
                        height: "14px",
                        width: "14px",
                      }}
                    ></div>
                  </div>
                </div>
                {/* test */}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>

        <div
          style={{
            position: "relative",
            transform: width <= 700 ? "" : "translateY(-20%)",
            display: "flex",
            alignItems: "center",
          }}
          // className="chat-footer-detail"
          className={
            width <= 700
              ? `chat-footer-detail chat-footer-detail-${themeName}`
              : `chat-footer-detail chat-footer-detail-${themeName} mt-3`
          }
        >
          <div className="chat-detail-emoji">
            {/* emoji mart start to check */}

            <PopupState variant="popover" popupId="demo-popup-popover">
              {(popupState) => (
                <div>
                  <BootstrapTooltip
                    title="Emoji"
                    themeName={
                      themeName === "dark-theme" ? "dark-theme" : "light-theme"
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
                    // anchorReference="anchorPosition"
                    // anchorPosition={{ top: 0, left: 0 }}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: 140,
                    }}
                    // transformOrigin creates problem start to check
                    // transformOrigin={{
                    //   vertical: "top",
                    //   horizontal: "center",
                    // }}
                    // transformOrigin creates problem finish to check
                    className={`${
                      themeName === "dark-theme"
                        ? "popover-material-ui-dark-theme"
                        : themeName !== "dark-theme"
                        ? "popover-material-ui-light-theme"
                        : "hideshowMessageDeletePopover "
                    }`}
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
          <input
            autoFocus
            // className="message-input"
            style={{
              color: themeName === "dark-theme" ? "white" : "black",
            }}
            className={`message-input message-input-${themeName}`}
            type="text"
            value={currentMessage}
            placeholder="Start a new message"
            onChange={(event) => {
              handleChangeCurrentMessage(event);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            className={`${
              disabled
                ? `disabled-button disabled-button-${themeName}`
                : `send-button send-button-${themeName}`
            }`}
            onClick={() => {
              sendMessage();
            }}
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
    </>
  );
}

export default ChatDetailsPage;
