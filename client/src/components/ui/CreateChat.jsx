import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { Stack } from "react-bootstrap";
import { ThemeContext } from "../../context/ThemeContext";
import useWindowDimensions from "../../hooks/getWindowDimensions";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
import io from "socket.io-client";
import axios from "axios";
const socket = io.connect(API_URL);

function CreateChat({ messagesPageWriteAmESSAGEoPTION }) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [room, setRoom] = useState("");

  const [searchString, setSearchString] = useState("");
  const [searchString2, setSearchString2] = useState("");
  const { userInfo, getToken } = useContext(UserContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [messageRoomId, setmessageRoomId] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/all-users`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log("Response =>", response);
        const spliceActiveUser = response.data.filter((eachUser) => {
          return eachUser.username !== userInfo.username;
        });
        setActiveUsers(spliceActiveUser);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  }, []);

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setFilteredUsers([]);
    setSearchString("");
    setShow(false);
  };

  const handleShow2 = () => setShow2(true);

  const handleClose2 = () => {
    setFilteredUsers([]);
    setSearchString2("");
    setShow2(false);
  };
  console.log("Search string =>", searchString);
  console.log("Search string 2 =>", searchString2);
  useEffect(() => {
    const handleGetMessageRoomId = (roomId) => {
      setmessageRoomId(roomId);
    };

    socket.on("getmessageRoomId", handleGetMessageRoomId);

    socket.emit("get_specific_user", userInfo);
  }, []);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  const selectedUser = (user) => {
    console.log("Profile info =>", user);
    const room = [userInfo.username, user.username].sort().join("_");

    setRoom(room);
    // Emit an event to join the room with the selected user
    socket.emit("join_user_room", { activeUser: userInfo, selectedUser: user });
  };

  // problem buradan kaynaklanıyor olabilir start to check
  // messageRoomId state'i değiştiğinde yönlendirme yap
  useEffect(() => {
    console.log("Message room id =>", messageRoomId);
    if (messageRoomId) {
      window.location.href = `http://localhost:5173/messages/${messageRoomId}`;
    }
  }, [messageRoomId]);
  // problem buradan kaynaklanıyor olabilir finish to check

  const [{ theme, themeName }] = useContext(ThemeContext);

  const filterUsers = (users, term) => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().startsWith(term.toLowerCase())
    );

    console.log("Filtered users =>", filteredUsers);

    if (searchString !== "" || searchString2 !== "") {
      console.log("Filtered users condition first =>", filteredUsers);
      setFilteredUsers(filtered);
    } else {
      console.log("Filtered users condition second =>", filteredUsers);
      setFilteredUsers([]);
    }
  };
  const handleSearchTermChange = (e) => {
    const term = e.target.value;
    setSearchString(term);
    if (searchString !== "" && term !== "") {
      console.log("Active users =>", activeUsers);
      console.log("Burası çalışıyor !");
      filterUsers(activeUsers, term);
    } else {
      setFilteredUsers([]);
    }
  };
  const handleSearchTermChange2 = (e) => {
    const term = e.target.value;
    setSearchString2(term);
    if (searchString2 !== "" && term !== "") {
      filterUsers(activeUsers, term);
    } else {
      console.log("Burası çalışıyor 2 !");

      setFilteredUsers([]);
    }
  };

  console.log("Active users =>", activeUsers);
  console.log("Filtered users =>", filteredUsers);

  const { width } = useWindowDimensions();
  return (
    <>
      {messagesPageWriteAmESSAGEoPTION ? (
        <div style={{ textAlign: "left", padding: "16px" }}>
          <div
            className="chirp-heavy-font"
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
            className="chirp-regular-font"
            style={{
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              lineHeight: "20px",
              fontSize: "15px",
              fontWeight: "400",
              margin: "10px",
            }}
          >
            Drop a line, share posts and more with private conversations between
            you and others on Connectify.
          </div>
          <button
            className="write-a-message-message-page-btn chirp-bold-font"
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
            onClick={handleShow2}
          >
            Write a message
          </button>
        </div>
      ) : (
        <div
          onClick={handleShow}
          className={`p-2 chat-create-icon chat-create-icon-${themeName}`}
          style={{
            cursor: "pointer",
            borderRadius: "50%",
            position: "relative",
            width: "40px",
            height: "40px",
            right: "10px",
          }}
        >
          <svg
            color={themeName === "dark-theme" ? "white" : ""}
            fill="currentColor"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`messages-create-chat r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03`}
            style={{
              lineHeight: "20px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            <g>
              <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5V12h-2v-1.537l-8 3.635-8-3.635V18.5c0 .276.224.5.5.5H13v2H4.498c-1.381 0-2.5-1.119-2.5-2.5v-13zm2 2.766l8 3.635 8-3.635V5.5c0-.276-.224-.5-.5-.5h-15c-.276 0-.5.224-.5.5v2.766zM19 18v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
            </g>
          </svg>
        </div>
      )}

      {messagesPageWriteAmESSAGEoPTION && (
        <Modal
          style={{
            margin: "0px",
            padding: "0px",
          }}
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          dialogClassName={width <= 700 ? `modal-fullscreen ` : ``}
          contentClassName={
            themeName === "dark-theme"
              ? "dark-theme-new-message-modal"
              : "new-message-modal"
          }
          className={`widthsmallerthan700-new-message-modal widthsmallerthan700-new-message-modal-${themeName}`}
          centered
          show={show2}
          onHide={handleClose2}
        >
          <Modal.Header
            closeButton={false}
            style={{
              border: "none",
            }}
          >
            <div
              className={`close-button close-button-${themeName}`}
              style={{
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <svg
                  style={{
                    border: "none",
                    fontSize: "15px",
                    margin: "5px",
                  }}
                  onClick={handleClose2}
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
            <div
              style={{
                color: themeName === "dark-theme" ? "white" : "black",
                fontWeight: "700",
                fontSize: "20px",
                lineHeight: "24px",
                position: "absolute",
                left: "80px",
              }}
            >
              New message
            </div>
          </Modal.Header>
          <div className="joinChatContainer">
            <div
              style={{
                position: "relative",
              }}
            >
              <input
                autoFocus
                type="text"
                placeholder="Search people"
                value={searchString2}
                onChange={handleSearchTermChange2}
                style={{
                  paddingLeft: "62px",
                  fontSize: "14px",
                  width: "100%",
                  outline: "none",
                  border: "none",
                  borderRadius: "0px",
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",

                  color:
                    themeName === "dark-theme"
                      ? "white"
                      : "rgba(15,20,25,1.00)",
                  backgroundColor:
                    themeName === "dark-theme" ? "black" : "transparent",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "15px",
                  left: "22px",
                }}
              >
                <div>
                  <svg
                    color={themeName === "dark-theme" ? "#565A5E" : "#536471"}
                    fill="currentColor"
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-4wgw6l r-f727ji"
                  >
                    <g>
                      <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            {filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className={`selected-user-for-dm selected-user-for-dm-${themeName}`}
              >
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
                            width={40}
                            height={40}
                            fill={
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)"
                            }
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
                          color:
                            themeName === "dark-theme"
                              ? "white"
                              : "rgb(15, 20, 25)",
                          fontSize: "15px",
                          lineHeight: "20px",
                          fontWeight: "700",
                          textAlign: "left",
                        }}
                      >
                        {user.fullname}
                      </div>
                      <div
                        style={{
                          marginRight:
                            user.imageUrl.slice(0, 3) !== "../" ? "" : "32px",
                          color:
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)",
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
            ))}
          </div>
          <Modal.Body>
            {/* start to check  search create message search bar*/}

            {/* finish to check  */}
          </Modal.Body>
        </Modal>
      )}

      <Modal
        style={{
          margin: "0px",
          padding: "0px",
        }}
        backdropClassName={
          themeName === "dark-theme" ? `back-drop-${themeName}` : ""
        }
        dialogClassName={width <= 700 ? `modal-fullscreen ` : ``}
        contentClassName={
          themeName === "dark-theme"
            ? "dark-theme-new-message-modal"
            : "new-message-modal"
        }
        className={`widthsmallerthan700-new-message-modal widthsmallerthan700-new-message-modal-${themeName}`}
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header
          closeButton={false}
          style={{
            border: "none",
          }}
        >
          <div
            className={`close-button close-button-${themeName}`}
            style={{
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
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
          <div
            style={{
              color: themeName === "dark-theme" ? "white" : "black",
              fontWeight: "700",
              fontSize: "20px",
              lineHeight: "24px",
              position: "absolute",
              left: "80px",
            }}
          >
            New message
          </div>
        </Modal.Header>
        <div className="joinChatContainer">
          <div
            style={{
              position: "relative",
            }}
          >
            <input
              autoFocus
              type="text"
              placeholder="Search people"
              value={searchString}
              onChange={handleSearchTermChange}
              style={{
                paddingLeft: "62px",
                fontSize: "14px",
                width: "100%",
                outline: "none",
                border: "none",
                borderRadius: "0px",
                borderBottom:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",

                color:
                  themeName === "dark-theme" ? "white" : "rgba(15,20,25,1.00)",
                backgroundColor:
                  themeName === "dark-theme" ? "black" : "transparent",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "15px",
                left: "22px",
              }}
            >
              <div>
                <svg
                  color={themeName === "dark-theme" ? "#565A5E" : "#536471"}
                  fill="currentColor"
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-4wgw6l r-f727ji"
                >
                  <g>
                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          {filteredUsers.map((user, index) => (
            <div
              key={user._id}
              className={`selected-user-for-dm selected-user-for-dm-${themeName}`}
            >
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
                      <div className="p-0">
                        <svg
                          style={{
                            borderRadius: "50%",
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          width={40}
                          height={40}
                          fill={
                            themeName === "dark-theme"
                              ? "#71767A"
                              : "rgb(83, 100, 113)"
                          }
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
                        color:
                          themeName === "dark-theme"
                            ? "white"
                            : "rgb(15, 20, 25)",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "700",
                        textAlign: "left",
                      }}
                    >
                      {user.fullname}
                    </div>
                    <div
                      style={{
                        marginRight:
                          user.imageUrl.slice(0, 3) !== "../" ? "" : "32px",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",

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
          ))}
        </div>
        <Modal.Body>
          {/* start to check  search create message search bar*/}

          {/* finish to check  */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateChat;
