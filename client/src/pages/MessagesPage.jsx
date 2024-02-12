import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Col, Row, Container, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LogoutModal, PostModal } from "../components/ui/Modal";
import axios from "axios";
import CreateChat from "../components/ui/CreateChat";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

// const socket = io.connect(API_URL);

function MessagesPage() {
  // rendering page after redirectiring for fetching data without problem ! if you need to fetch data after you redirect or navigate to user to the page (it can work pretty good on your navigation bar)this lines of code is pretty useful
  // start to check
  const navigate = useNavigate();

  const redirectHomePage = () => {
    navigate("/home");
    window.location.reload();
  };

  const redirectProfilePage = () => {
    navigate("/profile");
    window.location.reload();
  };

  const redirectChatDetailPage = (roomId) => {
    navigate(`/messages/${roomId}`);
    window.location.reload();
  };

  // finish to check

  const [searchTerm, setSearchTerm] = useState("");
  const { userInfo, getToken, socket } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [messageRooms, setmessageRooms] = useState([]);
  const [filteredRooms, setfilteredRooms] = useState([]);

  // socket io 1 client start to check
  const [notificationTest, setnotificationTest] = useState([]);
  const [notificationText, setnotificationText] = useState([]);
  // socket io 1 client finish to check

  // socket io 4 client start to check
  useEffect(() => {
    console.log("Hello worldddddd");
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
      setnotificationTest((prev) => [...prev, data]);
    });

    socket.on("getText", (data) => {
      console.log("Data get text =>", data);
      setnotificationText(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("get_spesific_user", userInfo);
  }, []);

  console.log("Messages page working outside use effect 2!");

  socket.on("receive_spesific_user_message_rooms", (data) => {
    console.log("Received active user message rooms => ", data);
    setfilteredRooms(data.messages);
    setmessageRooms(data.messages);
  });
  // start to check filtering rooms
  const filterRoom = (array, searchTerm) => {
    if (searchTerm !== "") {
      const filteredArray = array.filter((eachRoom) => {
        return (
          eachRoom.room.startsWith(searchTerm.toLowerCase()) ||
          eachRoom.room.split("_")[1].startsWith(searchTerm.toLowerCase())
        );
      });
      console.log("Filtered room =>", filteredArray);
      setfilteredRooms(filteredArray);
    } else {
      console.log("This line is working !");
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
    console.log(searchTerm);
  };
  // finish to check filtering rooms

  console.log("Your message rooms =>", messageRooms);

  console.log("Your message rooms from filtered rooms =>", filteredRooms);

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

  console.log(
    "cHECK lENGTH =>",
    checkIfAllFilteredRoomsChatEmpty(filteredRooms)
  );

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
        localStorage.setItem("mainPagePosts", JSON.stringify(response.data));
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

  const handleShowMessageDeleteModal = (messageRoom) => {
    console.log("Message room clicked =>", messageRoom);
  };

  return (
    <>
      <ResponsiveNavigationBarBottom />
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

              <div className="inner-div inner-div-fonts ">
                <Link to="/home" onClick={redirectHomePage}>
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
                {/* start to check notification component place  */}
                <Link>
                  <div className="notifications">
                    <div>
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

                      <span>Notifications </span>
                    </div>
                  </div>
                </Link>
                {/* finish to check notification component place  */}

                {/* start to check redirect to the correct component for messages */}

                <Link to="/messages">
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

                <Link onClick={redirectProfilePage} to="/profile">
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
            className={`main-column`}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <Stack direction="horizontal" gap={3}>
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
                  fontWeight: "700",
                  fontSize: "20px",
                }}
                className="p-2"
              >
                Messages
              </div>
              <div
                className="p-2 ms-auto  settings-icon"
                style={{
                  borderRadius: "50%",
                }}
              >
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
                  className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
                  </g>
                </svg>
                {/* settings icon finish to check  */}
              </div>
              <div
                className="p-2 chat-create-icon"
                style={{
                  borderRadius: "50%",
                }}
              >
                {/* create message icon start to check  */}

                <CreateChat writeMessageButton={false} />

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
                    value={searchTerm}
                    onChange={handleSearchTerm}
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

            {filteredRooms.length &&
            checkIfAllFilteredRoomsChatEmpty(filteredRooms) !== 0 ? (
              <div>
                {filteredRooms.map((eachMessageRoom) => (
                  <>
                    {eachMessageRoom.chat.length > 0 ? (
                      <Link
                        onClick={() =>
                          redirectChatDetailPage(eachMessageRoom._id)
                        }
                        key={eachMessageRoom._id}
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
                                    ).imageUrl.slice(0, 3) !== "../" ? (
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
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        fill="rgb(83, 100, 113)"
                                        className="bi bi-person-circle"
                                        viewBox="0 0 16 16"
                                        style={{}}
                                      >
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                      </svg>
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      marginLeft: "10px",
                                    }}
                                    className="p-0"
                                  >
                                    <span
                                      style={{
                                        color: "rgb(15, 20, 25)",

                                        fontSize: "15px",
                                        fontWeight: "700",
                                        lineHeight: "20px",
                                      }}
                                    >
                                      {eachMessageRoom.members[1].fullname !==
                                      userInfo.fullname
                                        ? eachMessageRoom.members[1].fullname
                                        : eachMessageRoom.members[0]
                                            .fullname}{" "}
                                    </span>
                                    <span
                                      style={{
                                        color: "rgb(83, 100, 113)",
                                        fontSize: "15px",
                                        lineHeight: "20px",
                                        fontWeight: "400",
                                      }}
                                    >
                                      @
                                      {eachMessageRoom.members[1].username !==
                                      userInfo.username
                                        ? eachMessageRoom.members[1].username
                                        : eachMessageRoom.members[0]
                                            .username}{" "}
                                    </span>
                                    <span
                                      style={{
                                        color: "rgb(83, 100, 113)",
                                        fontSize: "15px",
                                        lineHeight: "20px",
                                        fontWeight: "400",
                                      }}
                                    >
                                      {" "}
                                      ·{" "}
                                      {eachMessageRoom.chat[0]
                                        ? getCreatedRoomDate(
                                            eachMessageRoom.chat[0].messages[0]
                                              .timestamp
                                          )
                                        : ""}
                                    </span>
                                    <div className="p-0">
                                      {" "}
                                      <span
                                        style={{
                                          color: "rgb(83, 100, 113)",
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
                                  {/* <div className="p-0 ms-auto">asd</div> */}
                                  <div className="p-0 ms-auto">
                                    <svg
                                      style={{
                                        cursor: "pointer",
                                        position: "relative",
                                        bottom: "15px",
                                      }}
                                      onClick={() =>
                                        handleShowMessageDeleteModal(
                                          eachMessageRoom
                                        )
                                      }
                                      color="rgb(83, 100, 113)"
                                      fill="currentColor"
                                      width={`${1.25}em`}
                                      height={`${1.25}em`}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                    >
                                      <g>
                                        <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                      </g>
                                    </svg>
                                    <div>Delete message loading</div>
                                  </div>
                                </Stack>

                                {/* message text is here ? start to check  */}

                                {/* message text is here ? finish to check  */}
                              </>
                            )}
                        </div>
                      </Link>
                    ) : null}
                  </>
                ))}
              </div>
            ) : (
              <>
                <CreateChat writeMessageButton={true}></CreateChat>
              </>
            )}
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

export default MessagesPage;
