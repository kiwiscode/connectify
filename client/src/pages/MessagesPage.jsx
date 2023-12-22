import io from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import Chat from "./ChatPage";
import { UserContext } from "../context/UserContext";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

const socket = io.connect(API_URL);

function App() {
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    // Server tarafından emit edilen "activeUsers" olayını dinle
    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
      if (searchString !== "") {
        filterUsers(users, searchString);
      } else {
        filterUsers([], searchString);
      }
    });

    console.log("Gardasim burdasin :)");
    // Component unmount olduğunda temizlik yap
    return () => {
      socket.disconnect();
    };
  }, []);

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
  console.log(activeUsers);

  const selectedUser = (user) => {
    console.log("selected user =>", user);

    const room = [userInfo.username, user.username].sort().join("_");

    setRoom(room);
    setShowChat(true);
    // Emit an event to join the room with the selected user
    socket.emit("join_user_room", { activeUser: userInfo, selectedUser: user });
  };
  console.log(userInfo.username);
  return (
    <div className="App">
      {/* search filter start to check  */}

      {/* search filter finish to check  */}

      {!showChat ? (
        <div className="joinChatContainer">
          <input
            type="text"
            placeholder="Search people"
            value={searchString}
            onChange={handleSearchTermChange}
          />
          <div>
            {filteredUsers.map((user) => (
              <div
                onClick={() => selectedUser(user)}
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                  marginLeft: "7px",
                }}
                key={user._id}
              >
                {user.username}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Chat socket={socket} username={userInfo.username} room={room} />
      )}
    </div>
  );
}

export default App;
