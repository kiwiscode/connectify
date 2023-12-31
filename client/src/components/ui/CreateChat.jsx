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
      setActiveUsers(users);
      if (searchString !== "") {
        filterUsers(users, searchString);
      } else {
        filterUsers([], searchString);
      }
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
                    margin: "5px",
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
                            left: "0px",
                          }}
                          width={40}
                          height={40}
                          src={user.imageUrl}
                          alt=""
                        />
                      ) : (
                        <div>
                          <svg
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
                          left: "70%",
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
