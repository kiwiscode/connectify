const User = require("../models/User.model");
module.exports = (io) => {
  let users = [];
  let rooms = [
    {
      activeUser1: "",
      activeUser2: "",
      room: "",
    },
  ];

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const addRoom = (roomName, userName) => {
    let room = rooms.find((r) => r.room === roomName);

    if (!room) {
      // Oda yoksa, yeni bir oda oluştur
      room = {
        room: roomName,
        activeUser1: userName,
        activeUser2: "",
      };
      rooms.push(room);
    } else {
      // Oda varsa, ikinci kullanıcıyı ekle
      if (!room.activeUser1) {
        room.activeUser1 = userName;
      } else if (!room.activeUser2) {
        room.activeUser2 = userName;
      }
    }
  };

  const removeUserFromRoom = (roomName, userName) => {
    let room = rooms.find((r) => r.room === roomName);

    if (room) {
      if (room.activeUser1 === userName) {
        room.activeUser1 = ""; // Birinci kullanıcıyı kaldır
      } else if (room.activeUser2 === userName) {
        room.activeUser2 = ""; // İkinci kullanıcıyı kaldır
      }

      // Eğer her iki kullanıcı da ayrıldıysa, odayı kaldır
      if (!room.activeUser1 && !room.activeUser2) {
        rooms = rooms.filter((r) => r.room !== roomName);
      }
    }
  };

  const updateMessageStatus = async (roomName, senderId) => {
    const userIds = roomName.split("-"); // roomName'den user id'lerini çıkarıyoruz
    const user1Id = userIds[0];
    const user2Id = userIds[1];
    const activeUserId = senderId === user1Id ? user1Id : user2Id;
    const receiverId = senderId !== user1Id ? user1Id : user2Id;
    try {
      // Aktif olan kullanıcılar
      const room = rooms.find((r) => r.room === roomName);

      if (room) {
        const activeUser1 = room.activeUser1;
        const activeUser2 = room.activeUser2;

        // Eğer hem activeUser1 hem de activeUser2 aktifse, her iki kullanıcı için mesajları "readed: true" işaretle
        if (activeUser1 && activeUser2) {
          await User.findByIdAndUpdate(
            user1Id,
            {
              $set: {
                "messages.$[msg].readed": true,
              },
            },
            {
              arrayFilters: [{ "msg.room": roomName }],
              new: true,
            }
          );

          await User.findByIdAndUpdate(
            user2Id,
            {
              $set: {
                "messages.$[msg].readed": true,
              },
            },
            {
              arrayFilters: [{ "msg.room": roomName }],
              new: true,
            }
          );

          console.log("burası çalıştı ve bitti.");
        } else if (activeUser1) {
          // Sadece activeUser1 aktifse onun mesajlarını okundu olarak işaretle, activeUser2'nin mesajlarını okundu değil olarak tut

          await User.findByIdAndUpdate(
            activeUserId,
            {
              $set: {
                "messages.$[msg].readed": true,
              },
            },
            {
              arrayFilters: [{ "msg.room": roomName }],
              new: true,
            }
          );

          await User.findByIdAndUpdate(
            receiverId,
            {
              $set: {
                "messages.$[msg].readed": false,
              },
            },
            {
              arrayFilters: [{ "msg.room": roomName }],
              new: true,
            }
          );

          console.log("burası çalıştı ve bitti 2. condition");
        }
      }
    } catch (err) {
      console.error("Error updating message status:", err);
    }
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

      addRoom(roomName, userName); // Odaya kullanıcıyı ekle

      console.log("rooms after user joined:", rooms);

      console.log("userJoined", `${userName} odaya katıldı`);

      // Odaya katılma bilgisini yayınlama
      io.to(roomName).emit("userJoined", `${userName} odaya katıldı`);
    });

    // Kullanıcı odadan ayrıldığında
    socket.on("userLeft", (roomName, userName) => {
      socket.leave(roomName);
      console.log(`${userName} left room: ${roomName}`);

      removeUserFromRoom(roomName, userName); // Kullanıcıyı odadan çıkar

      console.log("rooms after user left:", rooms);

      // Odayı terk ettiğini diğer kullanıcılara bildir
      io.to(roomName).emit("userLeft", `${userName} left the room`);
    });

    // Mesaj alındığında
    socket.on("chatMessage", (roomName, message) => {
      console.log("message:", message);
      const senderId = message.sender;
      // Mesaj gönderildiğinde anlık olarak mesaj okuma durumu güncellenir
      updateMessageStatus(roomName, senderId);

      // Belirtilen odaya mesajı gönderme
      io.to(roomName).emit("message", message);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("User disconnected :", socket.id);
    });
  });
};
