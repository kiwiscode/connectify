import io from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import Chat from "./ChatPage";
import { UserContext } from "../context/UserContext";
import { Col, Row, Container, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LogoutModal, PostModal } from "../components/ui/Modal";
import axios from "axios";
import CreateChat from "../components/ui/CreateChat";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

const socket = io.connect(API_URL);

function MessagesPage() {
  // rendering page after redirectiring for fetching data without problem ! if you need to fetch data after you redirect or navigate to user to the page (it can work pretty good on your navigation bar)this lines of code is pretty useful
  // start to check
  const navigate = useNavigate();
  const redirectToMessages = () => {
    navigate("/messages");
    window.location.reload();
  };
  // finish to check

  const [searchString, setSearchString] = useState("");
  const { userInfo, getToken } = useContext(UserContext);
  const [showNotificationColumn, setshowNotificationColumn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [messageRooms, setmessageRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  useEffect(() => {
    socket.emit("get_spesific_user", userInfo);

    // Component unmount olduğunda temizlik yap
    return () => {
      socket.disconnect();
    };
  }, []);
  console.log("This page is working !");

  socket.on("receive_spesific_user_message_rooms", (data) => {
    console.log("Received active user message rooms => ", data);
    setmessageRooms(data);
  });

  // start to check filtering rooms

  const searchTerm = "jane";

  if (messageRooms.messages) {
    const getAllTheMessages = messageRooms.messages.filter((room) => {
      // get rooms startswith or ends with with the same term you searching for
      return (
        room.room.startsWith(searchTerm) ||
        room.room.split("_")[0].startsWith(searchTerm)
      );
    });

    console.log("Filter mesaj alindi mi ?? => ", getAllTheMessages);
  }

  const handleFilteringRooms = (searchTerm) => {
    const term = searchTerm.target.value.toLowerCase();
    setSearchString(term);
    console.log(term);
  };

  // finish to check filtering rooms

  console.log("Your message rooms =>", messageRooms.messages);

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

  const handleShowPostsMessagePage = () => {
    axios
      .get(`${API_URL}/home`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        // NOTE UPDATING THE LOCALSTORAGE
        // start to check
        localStorage.setItem("posts", JSON.stringify(response.data));
        // finish to check
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
            <Stack direction="horizontal" gap={3}>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "20px",
                }}
                className="p-2"
              >
                Messages
              </div>
              <div className="p-2 ms-auto">
                {/* settings icon start to check  */}
                <svg
                  width={20}
                  height={20}
                  style={{
                    color: "rgb(15, 20, 25)",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
                  </g>
                </svg>
                {/* settings icon finish to check  */}
              </div>
              <div className="p-2">
                {/* create message icon start to check  */}

                <CreateChat />

                {/* create message icon finish to check  */}
              </div>
            </Stack>

            {/* <Row
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></Row> */}

            {/* start to check here we gonna render filtered rooms */}
            <div className="App">
              {/* test */}

              <div className="joinChatContainer">
                <div>
                  <input
                    type="text"
                    placeholder="Search direct messages"
                    value={searchString}
                    onChange={(e) => handleFilteringRooms(e)}
                    style={{
                      fontSize: "14px",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* finish to check here we gonna render filtered rooms */}

            {/* mainpage yani messages rotasına tüm messagelerin gösterileceği column burası !  */}

            {messageRooms.messages ? (
              <div>
                {messageRooms.messages.map((eachMessageRoom) => {
                  return (
                    <>
                      <Link
                        style={{
                          position: "relative",
                          bottom: "20px",
                          margin: "5px",
                          cursor: "pointer",
                          listStyleType: "none",
                          textDecoration: "none",
                        }}
                        to={`/messages/${eachMessageRoom._id}`}
                      >
                        <div
                          style={{
                            backgroundColor: eachMessageRoom.readed
                              ? "white"
                              : "#F7F9F9",
                            border: eachMessageRoom.chat.length
                              ? "1px solid #e1e8ed"
                              : "",
                            borderRadius: "8px",
                          }}
                          key={eachMessageRoom._id}
                        >
                          {eachMessageRoom.chat &&
                            eachMessageRoom.chat.length > 0 && (
                              <div>
                                {getMemberNotEqualActiveUser(
                                  eachMessageRoom
                                ).imageUrl.slice(0, 3) !== "../" ? (
                                  <img
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      position: "relative",
                                      top: "10px",
                                      marginLeft: "10px",
                                    }}
                                    src={
                                      getMemberNotEqualActiveUser(
                                        eachMessageRoom
                                      ).imageUrl
                                    }
                                    alt=""
                                  />
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    fill="rgb(83, 100, 113)"
                                    className="bi bi-person-circle"
                                    viewBox="0 0 16 16"
                                    style={{
                                      marginLeft: "10px",
                                      position: "relative",
                                      top: "10px",
                                    }}
                                  >
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                  </svg>
                                )}

                                <span
                                  style={{
                                    color: "rgb(15, 20, 25)",
                                    marginLeft: "10px",
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    lineHeight: "20px",
                                  }}
                                >
                                  {eachMessageRoom.members[1].fullname !==
                                  userInfo.fullname
                                    ? eachMessageRoom.members[1].fullname
                                    : eachMessageRoom.members[0].fullname}{" "}
                                </span>
                                <span
                                  style={{
                                    color: "rgb(83, 100, 113)",
                                  }}
                                >
                                  @
                                  {eachMessageRoom.members[1].username !==
                                  userInfo.username
                                    ? eachMessageRoom.members[1].username
                                    : eachMessageRoom.members[0].username}{" "}
                                </span>

                                <span style={{ color: "rgba(0,0,0,0.6)" }}>
                                  {" "}
                                  ·{" "}
                                  {eachMessageRoom.chat[0]
                                    ? getCreatedRoomDate(
                                        eachMessageRoom.chat[0].messages[0]
                                          .timestamp
                                      )
                                    : ""}
                                </span>
                                <div>
                                  <span
                                    style={{
                                      color: "rgb(83, 100, 113)",
                                      position: "relative",
                                      left: "50px",
                                      bottom: "13px",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {
                                      eachMessageRoom.chat[
                                        eachMessageRoom.chat.length - 1
                                      ].messages[0].text
                                    }
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      </Link>
                    </>
                  );
                })}
              </div>
            ) : null}
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

export default MessagesPage;
