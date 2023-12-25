const express = require("express");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
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
      socket.on("send_spesific_userId", (userId) => {
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
            const findChatRoomIdInsideMessages = user.messages.find(
              (findedMessage) => {
                return findedMessage._id.toString() === chatRoomId;
              }
            );

            console.log(
              "find selected user process =>",
              findChatRoomIdInsideMessages.members
            );

            const filteredSelectedUser =
              findChatRoomIdInsideMessages.members.filter((eachMember) => {
                return eachMember._id.toString() !== user._id.toString();
              });

            socket.emit("receive_selectedUser", filteredSelectedUser);

            console.log(
              "Filtered user from members =>",
              filteredSelectedUser[0]
            );
            socket.emit(
              "send_spesific_chat_details",
              findChatRoomIdInsideMessages
            );
          })
          .then(() => {
            // start to check make 2 users join in a room spesificly
            socket.on("join_spesific_message_room", async (data) => {
              const { activeUser, selectedUser } = data;
              console.log(data);
              // Create a unique room name using the usernames
              const room = [activeUser.username, selectedUser.username]
                .sort()
                .join("_");
              console.log(["xyz", "abc"].sort().join("_"));
              // Join the room
              socket.join(room);
              console.log(
                `Different Joined room message => User ${activeUser.username} with socket ID: ${socket.id} joined real time chat room with:${selectedUser.username} so they are ready to chat in real time by using socket.io package in a room => ${room}`
              );
              console.log("-----------------");
              console.log("room => ", room);
              // finish to check make 2 users join in a room spesificly

              socket.on("send_spesific_room_message", async (data) => {
                socket
                  .to(data.room)
                  .emit("receive_spesific_room_message", data);
                const newChat = {
                  sender: data.sender,
                  text: data.text,
                  timeStamp: Date.now(),
                };
              });
            });
          })
          .catch((error) => {
            console.log("error occured while fetching the user =>", error);
          });
      });
    });

    // finish to check chat details page
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
      // const { activeUser, selectedUser } = data;

      // console.log("check data =>", data);
      // Create a unique room name using the usernames
      // const room = [activeUser.username, selectedUser.username]
      //   .sort()
      //   .join("_");
      // console.log("Keep messaging =>", data);
      // Join the room
      // socket.join(room);
      // console.log(
      //   `User ${activeUser.username} with socket ID: ${socket.id} joined real time chat room with:${selectedUser.username} so they are ready to chat in real time by using socket.io package ${room}asdada`
      // );

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

          Promise.all(updatePromises)
            .then((updatedUsers) => {
              // updatedUsers içinde güncellenmiş kullanıcılar var

              initiatingChatRoomBetweenTwoUsers[0].messages =
                updatedUsers[0].messages;

              initiatingChatRoomBetweenTwoUsers[1].messages =
                updatedUsers[1].messages;
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
        socket.on("send_message", async (data) => {
          socket.to(data.room).emit("receive_message", data);
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

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });

  // Bu socket.io örneğini kullanmak için app nesnesini middleware olarak ekleyin.
  app.set("io", io);
};
