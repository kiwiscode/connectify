import io from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./ChatPage";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

const socket = io.connect(API_URL);

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  useEffect(() => {
    // Server tarafından emit edilen "activeUsers" olayını dinle
    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
      if (searchString !== []) {
        filterUsers(users, searchString);
      } else {
        filterUsers([], searchString);
      }
    });

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
    if (searchString !== []) {
      filterUsers(activeUsers, term);
    } else {
      setFilteredUsers([]);
    }
  };
  console.log(activeUsers);

  return (
    <div className="App">
      {/* search filter start to check  */}
      <div>
        <h3>Active Users:</h3>
        <input
          type="text"
          placeholder="Search people"
          value={searchString}
          onChange={handleSearchTermChange}
        />
        <div>
          {filteredUsers.map((user) => (
            <div key={user._id}>{user.username}</div>
          ))}
        </div>
      </div>

      {/* search filter finish to check  */}

      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Search people"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
