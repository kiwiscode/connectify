const express = require("express");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Post = require("../models/Post.model");
const { default: mongoose } = require("mongoose");
module.exports = (app) => {
  // socket io will be implement here !!!

  const server = http.createServer(app);
  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.set("trust proxy", 1);
  app.use(cors());

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "DELETE"],
    },
  });

  //NOTE INFO socket.io nun connection olayı istemci tarafında sunucuyla bağlantı kurulduğunda tetiklenir.Eğer bu olayı görmek istiyorsanız bir frontend uygulaması oluşturup bu uygulama üzerinden Socket.IO bağlantısı kurmalısınız.Örneğin React gibi bir kütüphane kullanarak veya basit bir HTML dosyası üzerinden JavaScript ile bir Socket.IO istemcisi oluşturarak bağlantı sağlayabilir ve "connection" olayını gözlemleyebilirsiniz.
  io.on("connection", async (socket) => {
    console.log("A user connected:", socket.id);

    // start to check chat details page

    socket.on("send_spesific_chatRoomId", (chatRoomId) => {
      console.log("This line is working check chatRoomId =>", chatRoomId);
      socket.on("send_spesific_userId", (userId) => {
        console.log("This line is working 1 _", socket.id);
        User.findById(userId)
          .populate({
            path: "messages",
            populate: {
              path: "chat",
              model: "Chat",
            },
          })
          .populate({
            path: "messages",
            populate: {
              path: "members",
              model: "User",
            },
          })
          .then((user) => {
            console.log("This line is working 2 _", socket.id);

            const findChatRoomIdInsideMessages = user.messages.find(
              (findedMessage) => {
                return findedMessage._id.toString() === chatRoomId;
              }
            );

            const filteredSelectedUser =
              findChatRoomIdInsideMessages.members.filter((eachMember) => {
                return eachMember._id.toString() !== user._id.toString();
              });

            socket.emit("receive_selectedUser", filteredSelectedUser);
            console.log(findChatRoomIdInsideMessages.chat.length);
            let resultArrayOfMessages = [];

            for (let i = 0; i < findChatRoomIdInsideMessages.chat.length; i++) {
              for (
                let j = 0;
                j < findChatRoomIdInsideMessages.chat[i].messages.length;
                j++
              ) {
                // Her bir mesajı resultArrayOfMessages dizisine pushlayalım.
                resultArrayOfMessages.push(
                  findChatRoomIdInsideMessages.chat[i].messages[j]
                );
              }
            }
            console.log("get room name => ", findChatRoomIdInsideMessages.room);
            console.log(
              "Result array of messages chat details page => ",
              resultArrayOfMessages
            );
            // Emit the messages to the client
            socket.emit("send_spesific_chat_details", {
              room: findChatRoomIdInsideMessages.room,
              messages: resultArrayOfMessages,
            });

            console.log("This line is working 4 _", socket.id);
            let chatDetailActiveUser;
            let chatDetailSelectedUser;
            // start to check make 2 users join in a room spesificly and chat
            socket.on("join_spesific_message_room", (data) => {
              console.log("This line is working 6 _", socket.id);

              const { activeUser, selectedUser } = data;
              // Create a unique room name using the usernames
              const room = [activeUser.username, selectedUser.username]
                .sort()
                .join("_");
              // Join the room

              chatDetailActiveUser = activeUser;
              chatDetailSelectedUser = selectedUser;
              socket.join(room);
              console.log("This line is working 7 _", socket.id);

              console.log(
                `Different Joined room message => User ${activeUser.username} with socket ID: ${socket.id} joined real time chat room with:${selectedUser.username} so they are ready to chat in real time by using socket.io package in a room => ${room}`
              );
            });
            // finish to check make 2 users join in a room spesificly and chat

            // start to check receive send chat details
            socket.on("send_spesific_room_message", async (data) => {
              console.log("This line is working => 8 _", data);
              socket.to(data.room).emit("receive_spesific_room_message", data);

              // finish to check receive send chat details
              const newChat = {
                sender: data.sender,
                text: data.text,
                timeStamp: Date.now(),
              };

              Chat.create({
                room: data.room,
                messages: [newChat],
              })
                .then((newCreatedChatBetween2User) => {
                  // start to check find the room index inside users messages array

                  console.log(
                    "Check new created chat =>",
                    newCreatedChatBetween2User
                  );

                  console.log(
                    "Not exist user => first user => active user =>",
                    chatDetailActiveUser
                  );
                  // İki kullanıcının da messages array'ini alalım
                  const user1Messages = chatDetailActiveUser.messages || [];
                  const user2Messages = chatDetailSelectedUser.messages || [];
                  console.log(
                    "Check user messages 1 =>",
                    user1Messages,
                    "Check user messages 2 =>",
                    user2Messages
                  );
                  // İlk kullanıcının messages array'indeki room'u bulalım
                  const user1RoomIndex = user1Messages.findIndex(
                    (message) => message.room === data.room
                  );

                  console.log("Check room indexes =>", user1RoomIndex);

                  // İkinci kullanıcının messages array'indeki room'u bulalım
                  const user2RoomIndex = user2Messages.findIndex(
                    (message) => message.room === data.room
                  );
                  console.log("Check room indexes 2=>", user2RoomIndex);

                  User.find({
                    _id: {
                      $in: [
                        new mongoose.Types.ObjectId(chatDetailActiveUser._id),
                        new mongoose.Types.ObjectId(chatDetailSelectedUser._id),
                      ],
                    },
                  })
                    .then((users) => {
                      // Şimdi, her iki kullanıcının messages array'indeki ilgili room'un içine chat'i ekleyebiliriz
                      users[0].messages[user1RoomIndex].chat.push(
                        newCreatedChatBetween2User._id
                      );
                      users[1].messages[user2RoomIndex].chat.push(
                        newCreatedChatBetween2User._id
                      );
                      users[0].save();
                      users[1].save();
                    })
                    .catch((error) => {
                      console.log(error);
                    });

                  // finish to check find the room index inside users messages array
                })
                .catch((error) => {
                  console.error(error);
                });
            });
          })
          .catch((error) => {
            console.log("This line is working 10 ERROR !!! _", socket.id);

            console.log("error occured while fetching the user =>", error);
          });
      });
    });

    // finish to check chat details page

    // start to check create chat page
    const allUsers = await User.find();
    io.emit("activeUsers", allUsers);

    socket.on("get_spesific_user", (data) => {
      User.findById(data._id)
        .populate({
          path: "messages",
          populate: {
            path: "members",
            model: "User",
          },
        })
        .populate({
          path: "messages",
          populate: {
            path: "chat",
            model: "Chat",
          },
        })
        .then((user) => {
          socket.emit("receive_spesific_user_message_rooms", user);
        })
        .catch((error) => {});
    });

    // keep_messaging start to check
    socket.on("keep_messaging", async (data) => {
      const { activeUser, selectedUser } = data;

      console.log("check data =>", data);
      // Create a unique room name using the usernames
      const room = [activeUser.username, selectedUser.username]
        .sort()
        .join("_");
      console.log("Keep messaging =>", data);
      // Join the room
      socket.join(room);
      console.log(
        `User ${activeUser.username} with socket ID: ${socket.id} joined real time chat room with:${selectedUser.username} so they are ready to chat in real time by using socket.io package ${room} keep messagin ! ! ! ! ! !`
      );

      // start to check from existing room messages
      User.find({
        _id: {
          $in: [new mongoose.Types.ObjectId(activeUser._id)],
        },
      })
        .populate({
          path: "messages.chat", // Populate işlemi
          model: "Chat", // Chat modeli
        })
        .then((user) => {
          const userMessages = user[0].messages || [];

          const userRoomIndex = userMessages.findIndex(
            (message) => message.room === room
          );

          if (userRoomIndex !== -1) {
            const messages = userMessages[userRoomIndex].chat.map(
              (eachMessage) => {
                return eachMessage.messages;
              }
            );
            const resultArrayOfMessages = [];
            for (let i = 0; i < messages.length; i++) {
              for (s = 0; s < messages[i].length; s++) {
                resultArrayOfMessages.push(messages[i][s]);
              }
            }

            // Emit the messages to the client
            socket.emit("keep_messaging_room_messages", {
              room,
              messages: resultArrayOfMessages,
            });
          } else {
            console.error("Error fetching messages for the existing room.");
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });

      // finish to check from existing room messages
    });
    // keep_messaging finish to check

    socket.on("join_user_room", async (data) => {
      const { activeUser, selectedUser } = data;
      // Create a unique room name using the usernames
      console.log(
        "active user =>",
        activeUser,
        "selected user =>",
        selectedUser
      );
      const room = [activeUser.username, selectedUser.username]
        .sort()
        .join("_");

      // Join the room
      socket.join(room);
      console.log(
        `User ${activeUser.username} with socket ID: ${socket.id} joined real time chat room with:${selectedUser.username} so they are ready to chat in real time by using socket.io package ${room}`
      );

      User.find({
        _id: {
          $in: [
            new mongoose.Types.ObjectId(activeUser._id),
            new mongoose.Types.ObjectId(selectedUser._id),
          ],
        },
      }).then((initiatingChatRoomBetweenTwoUsers) => {
        // start to check initiate a chat room between 2 user

        // İki kullanıcıyı bul ve her birinin messages dizisine yeni bir room ekleyin

        // İki kullanıcının daha önce aynı room altında bir chat odası oluşturup oluşturmadığını kontrol et
        const roomExists = initiatingChatRoomBetweenTwoUsers.every((user) => {
          return user.messages.some((message) => message.room === room);
        });

        if (!roomExists) {
          const updatePromises = [
            { userId: activeUser._id, room },
            { userId: selectedUser._id, room },
          ].map(({ userId }) => {
            return User.findByIdAndUpdate(
              userId,
              {
                $addToSet: {
                  messages: {
                    room: room,
                    chat: [],
                    members: [activeUser._id, selectedUser._id],
                  },
                },
              },
              { new: true }
            );
          });

          const findMessageRoomId = (user1, user2) => {
            // Her iki kullanıcının messages alanındaki odaları alınır
            const user1Rooms = user1.messages.map((message) => message.room);
            const user2Rooms = user2.messages.map((message) => message.room);

            // İki kullanıcının ait olduğu odalar bulunur
            const commonRooms = user1Rooms.filter((room) =>
              user2Rooms.includes(room)
            );

            console.log("This is the common room =>", commonRooms);
            // Eğer ortak odalar bulunduysa, ilk ortak odayı döndür
            if (commonRooms.length > 0) {
              return commonRooms[0];
            }

            // Ortak oda bulunamadıysa null döndür
            return null;
          };

          Promise.all(updatePromises)
            .then((updatedUsers) => {
              // updatedUsers içinde güncellenmiş kullanıcılar var

              console.log(
                "bu iki kullanicinin üye olduğu odayi bul =>",
                updatedUsers
              );

              const roomName = findMessageRoomId(
                updatedUsers[0],
                updatedUsers[1]
              );
              if (roomName) {
                console.log("Mesaj odasi ID'si:", roomName);

                // updatedUsers[0] ve updatedUsers[1] içindeki kullanıcı nesnelerini güncelle
                initiatingChatRoomBetweenTwoUsers[0].messages =
                  updatedUsers[0].messages;
                initiatingChatRoomBetweenTwoUsers[1].messages =
                  updatedUsers[1].messages;

                const newIdOfMessageRoom = updatedUsers[0].messages.find(
                  (messageRoom) => {
                    return messageRoom.room === roomName;
                  }
                );
                console.log("Id of new room =>", newIdOfMessageRoom);
                // roomId'ı kullanarak bir şeyler yapabilirsiniz

                socket.emit(
                  "getmessageRoomId",
                  newIdOfMessageRoom._id.toString()
                );
              } else {
                console.log("Ortak mesaj odasi bulunamadi.");
              }
            })
            .catch((error) => {
              // Hata işleme kodu burada
              console.error("Error updating users:", error);
            });
        } else {
          // NOTE INFO start to check show messages if the room exist between this two user

          User.find({
            _id: {
              $in: [new mongoose.Types.ObjectId(activeUser._id)],
            },
          })
            .populate({
              path: "messages.chat", // Populate işlemi
              model: "Chat", // Chat modeli
            })
            .then((user) => {
              const userMessages = user[0].messages || [];

              const userRoomIndex = userMessages.findIndex(
                (message) => message.room === room
              );

              if (userRoomIndex !== -1) {
                const messages = userMessages[userRoomIndex].chat.map(
                  (eachMessage) => {
                    return eachMessage.messages;
                  }
                );
                const resultArrayOfMessages = [];
                for (let i = 0; i < messages.length; i++) {
                  for (s = 0; s < messages[i].length; s++) {
                    resultArrayOfMessages.push(messages[i][s]);
                  }
                }
                console.log(
                  "room messages: resultArrayOfMessages",
                  room,
                  resultArrayOfMessages
                );

                const findedRoom = user[0].messages.find((eachMessage) => {
                  return eachMessage.room === room;
                });

                console.log(
                  "Varolan oda bulundu ve id si cliente gonderilmeye hazir =>",
                  findedRoom
                );

                socket.emit("getmessageRoomId", findedRoom._id.toString());

                // Emit the messages to the client
                socket.emit("room_messages", {
                  room,
                  messages: resultArrayOfMessages,
                });
              } else {
                console.error("Error fetching messages for the existing room.");
              }
            })
            .catch((error) => {
              console.error("Error fetching users:", error);
            });
          // NOTE INFO finish to check show messages if the room exist between this two user
        }
        // finish to check initiate a chat room between 2 user

        // start to check INFO NOTE chat starting
        console.log("They are ready to chat their => room created!");

        // start to check receive send
        socket.on("send_message", async (data) => {
          console.log("This line is working => 1", data);

          socket.to(data.room).emit("receive_message", data);

          // finish to check receive send
          const newChat = {
            sender: data.sender,
            text: data.text,
            timeStamp: Date.now(),
          };

          Chat.create({
            room: data.room,
            messages: [newChat],
          })
            .then((newCreatedChatBetween2User) => {
              // start to check find the room index inside users messages array

              // İki kullanıcının da messages array'ini alalım
              const user1Messages =
                initiatingChatRoomBetweenTwoUsers[0].messages || [];
              const user2Messages =
                initiatingChatRoomBetweenTwoUsers[1].messages || [];

              // İlk kullanıcının messages array'indeki room'u bulalım
              const user1RoomIndex = user1Messages.findIndex(
                (message) => message.room === data.room
              );

              // İkinci kullanıcının messages array'indeki room'u bulalım
              const user2RoomIndex = user2Messages.findIndex(
                (message) => message.room === data.room
              );

              // Kullanıcıların _id değerleri
              const user1Id =
                initiatingChatRoomBetweenTwoUsers[0]._id.toString();
              const user2Id =
                initiatingChatRoomBetweenTwoUsers[1]._id.toString();
              //
              User.find({
                _id: {
                  $in: [
                    new mongoose.Types.ObjectId(activeUser._id),
                    new mongoose.Types.ObjectId(selectedUser._id),
                  ],
                },
              })
                .then((users) => {
                  // Şimdi, her iki kullanıcının messages array'indeki ilgili room'un içine chat'i ekleyebiliriz
                  users[0].messages[user1RoomIndex].chat.push(
                    newCreatedChatBetween2User._id
                  );
                  users[1].messages[user2RoomIndex].chat.push(
                    newCreatedChatBetween2User._id
                  );
                  users[0].save();
                  users[1].save();
                })
                .catch((error) => {
                  console.log(error);
                });

              // finish to check find the room index inside users messages array
            })
            .catch((error) => {
              console.error(error);
            });
        });
        // finish to check INFO NOTE chat starting
      });
    });

    // start to check real time notification
    let onlineUsers = [];

    const addNewUser = (username, socketId) => {
      !onlineUsers.some((user) => user.username === username) &&
        onlineUsers.push({ username, socketId });
    };

    // IMPORTANT
    const removeUser = (socketId) => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    const getUser = (username) => {
      console.log("Did you get the correct user =>", username);
      console.log("Online users =>", onlineUsers);
      console.log(onlineUsers.find((user) => user.username === username));
      return onlineUsers.find((user) => user.username === username);
    };

    socket.on("newUser", (userInfo) => {
      console.log("Username =>", userInfo.username);
      addNewUser(userInfo.username, socket.id);

      console.log("Online users =>", onlineUsers);
    });

    socket.on("sendNotification", ({ senderName, receiverName, type }) => {
      const receiver = getUser(receiverName);
      console.log("Receiver =>", receiver);
      if (receiver && receiver.socketId) {
        console.log("Receiver =>", receiver);
        io.to(receiver.socketId).emit("getNotification", {
          senderName,
          receiverName,
          type,
        });
      } else {
        console.error("User not found or offline.");
      }
    });

    // finish to check real time notification

    socket.on("disconnect", () => {
      // removeUser(socket.id);
      console.log("User Disconnected", socket.id);
    });
  });

  // Bu socket.io örneğini kullanmak için app nesnesini middleware olarak ekleyin.
  app.set("io", io);
};
