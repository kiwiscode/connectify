import { useContext, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { UserContext } from "../context/UserContext";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { userInfo } = useContext(UserContext);
  // socket.on current exist messages in room =>
  // Emit the messages to the client
  // Odadaki mesajları dinle

  socket.on("room_messages", (data) => {
    const { room, messages } = data;
    console.log(`Received messages for room ${room}:`, messages);

    // Şimdi, bu mesajları kullanarak arayüzünüzü güncelleyebilirsiniz
    // Örneğin, bir state'i güncelleyerek veya başka bir yöntemle
    // Gelen mesajları messageList içindeki mevcut mesajlarla birleştirin

    // Gelen mesajları uygun formata dönüştürerek messageList içindeki mevcut mesajlarla birleştirin

    setMessageList((prevMessages) => [...prevMessages, ...messages]);
  });

  console.log("message list => ", messageList);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,
        text: currentMessage,
        time: new Date().toLocaleString("en-US", {
          weekday: "short",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>{username}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.sender ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.text}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">
                      {messageContent.timestamp ? (
                        <span>
                          {new Date(messageContent.timestamp).toLocaleString(
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
                        <span>{messageContent.time}</span>
                      )}
                    </p>
                    <p id="author">{messageContent.sender}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
