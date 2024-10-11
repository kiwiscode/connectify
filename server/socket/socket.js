module.exports = (io) => {
  let users = [];

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  io.on("connection", (socket) => {
    console.log("A new user connected :", socket.id);

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      console.log("online users:", users);
      io.emit("getUsers", users);
    });

    socket.on("joinRoom", (roomName, userName) => {
      socket.join(roomName); // Belirtilen odaya katılım işlemi

      console.log("userJoined", `${userName} odaya katıldı`);
      // Odaya katılma bilgisini yayınlama
      io.to(roomName).emit("userJoined", `${userName} odaya katıldı`);
    });

    // Kullanıcı odadan ayrıldığında
    socket.on("userLeft", (roomName, userName) => {
      socket.leave(roomName);
      console.log(`${userName} left room: ${roomName}`);

      // Odayı terk ettiğini diğer kullanıcılara bildir
      io.to(roomName).emit("userLeft", `${userName} odaya katıldı`);
    });

    // Mesaj alındığında
    socket.on("chatMessage", (roomName, message) => {
      console.log("message:", message);
      // Belirtilen odaya mesajı gönderme
      io.to(roomName).emit("message", message);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("User disconnected :", socket.id);
    });
  });
};
