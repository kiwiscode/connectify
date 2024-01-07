import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import io from "socket.io-client";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

const socket = io.connect(API_URL);

function CreateChat() {
  const [show, setShow] = useState(false);
  const [room, setRoom] = useState("");
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [searchString, setSearchString] = useState("");
  const { userInfo } = useContext(UserContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [messageRoomId, setmessageRoomId] = useState("");
  useEffect(() => {
    const handleGetMessageRoomId = (roomId) => {
      setmessageRoomId(roomId);
    };

    socket.on("getmessageRoomId", handleGetMessageRoomId);

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

      console.log("Active users =>", users);
    });
    socket.emit("get_spesific_user", userInfo);

    // Component unmount olduğunda temizlik yap
    return () => {
      socket.off("getmessageRoomId", handleGetMessageRoomId);
      socket.disconnect();
    };
  }, []);

  const selectedUser = (user) => {
    console.log("selected user =>", user);

    const room = [userInfo.username, user.username].sort().join("_");

    setRoom(room);
    // Emit an event to join the room with the selected user
    socket.emit("join_user_room", { activeUser: userInfo, selectedUser: user });
  };

  // messageRoomId state'i değiştiğinde yönlendirme yap
  useEffect(() => {
    if (messageRoomId) {
      navigate(`/messages/${messageRoomId}`);
    }
  }, [messageRoomId]);

  const filterUsers = (users, term) => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().startsWith(term.toLowerCase())
    );

    if (searchString !== []) {
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
  return (
    <>
      {/* <div
                className="p-2 ms-auto  settings-icon"
                style={{
                  borderRadius: "50%",
                }}
              > */}
      {/* settings icon start to check  */}
      {/* <svg
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
                </svg> */}
      {/* settings icon finish to check  */}
      {/* </div> */}

      <svg
        onClick={handleShow}
        width={20}
        height={20}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
        style={{
          color: "rgb(15, 20, 25)",
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton={false} // closeButton'u devre dışı bırak
          style={{
            border: "none",
          }}
        >
          <button
            type="button"
            className="close-button"
            aria-label="Close"
            style={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "50%",
              lineHeight: "20px",
              fontSize: "20px",
              paddingBottom: "3px",
            }}
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
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
          {filteredUsers.map((user) => (
            <>
              <div>
                <Link
                  style={{
                    position: "relative",
                    bottom: "20px",
                    cursor: "pointer",
                    listStyleType: "none",
                    textDecoration: "none",
                  }}
                  to={`/messages/${messageRoomId}`}
                >
                  <div
                    className="selected-user-for-dm"
                    onClick={() => selectedUser(user)}
                    style={{
                      position: "relative",
                      top: "50px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      textAlign: "left",
                      height: "100%",
                      width: "100%",
                    }}
                    key={user._id}
                  >
                    <div>
                      {user.imageUrl.slice(0, 3) !== "../" ? (
                        <img
                          style={{
                            position: "relative",
                            top: "20px",
                            left: "20px",
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
                              position: "relative",
                              top: "20px",
                              left: "20px",
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

                      <div
                        style={{
                          position: "relative",
                          left: "65%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "15px",
                            lineHeight: "20px",
                            fontWeight: "700",
                          }}
                        >
                          {user.fullname}
                          <span
                            dir="ltr"
                            className="verified-icon css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-xoduu5 r-18u37iz r-1q142lx"
                            // style="color: rgb(15, 20, 25); text-overflow: unset;"
                          >
                            <span
                              className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5"
                              // style="text-overflow: unset;"
                            >
                              <svg
                                width={18}
                                height={18}
                                viewBox="0 0 22 22"
                                aria-label="Verified account"
                                role="img"
                                className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                                data-testid="icon-verified"
                                color="rgba(29,155,240,1.00)"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                </g>
                              </svg>
                            </span>
                          </span>
                        </div>
                        <div
                          style={{
                            color: "rgb(83, 100, 113)",
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </>
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
