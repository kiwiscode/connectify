import { useState } from "react";
import io from "socket.io-client";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

const socket = io.connect(API_URL);

function MessagesPage() {
  const [username, setUsername] = useState("");
  return (
    <>
      <h2 style={{ color: "rgb(29, 155, 240)", textAlign: "center" }}>
        Messages
      </h2>
    </>
  );
}

export default MessagesPage;
