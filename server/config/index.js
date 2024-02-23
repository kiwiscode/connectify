const express = require("express");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Post = require("../models/Post.model");
const { default: mongoose } = require("mongoose");

let onlineUsers = [];

module.exports = (app) => {
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

  io.on("connection", async (socket) => {
    console.log("User connected =>", socket.id);

    socket.emit("socket_id_for_user", socket.id);

    console.log("Online users =>", onlineUsers);
    const allUsers = await User.find();
    socket.emit("activeUsers", allUsers);

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
        .catch((error) => {
          console.log("Error =>", error);
        });
    });

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

            const filteredSelectedUser =
              findChatRoomIdInsideMessages.members.filter((eachMember) => {
                return eachMember._id.toString() !== user._id.toString();
              });

            socket.emit("receive_selectedUser", filteredSelectedUser);
            let resultArrayOfMessages = [];

            for (let i = 0; i < findChatRoomIdInsideMessages.chat.length; i++) {
              for (
                let j = 0;
                j < findChatRoomIdInsideMessages.chat[i].messages.length;
                j++
              ) {
                resultArrayOfMessages.push(
                  findChatRoomIdInsideMessages.chat[i].messages[j]
                );
              }
            }

            socket.emit("send_spesific_chat_details", {
              room: findChatRoomIdInsideMessages.room,
              messages: resultArrayOfMessages,
            });

            let chatDetailActiveUser;
            let chatDetailSelectedUser;
            socket.on("join_spesific_message_room", (data) => {
              const { activeUser, selectedUser } = data;
              const room = [activeUser.username, selectedUser.username]
                .sort()
                .join("_");

              chatDetailActiveUser = activeUser;
              chatDetailSelectedUser = selectedUser;

              console.log(
                "Chat detail active user => ",
                chatDetailActiveUser.username
              );
              console.log(
                "Chat detail selected user => ",
                chatDetailSelectedUser.username
              );
              socket.join(room);

              socket.on("send_spesific_room_message", async (data) => {
                console.log("This line is working => 8 _", data);
                socket
                  .to(data.room)
                  .emit("receive_spesific_room_message", data);
                console.log("Data =>", data);
                console.log("Data.room =>", data.room);

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
                    console.log(
                      "Check new created chat =>",
                      newCreatedChatBetween2User
                    );

                    // BUG users room index not receiving correctly start to check

                    // console.log(
                    //   "Not exist user => first user => active user =>",
                    //   chatDetailActiveUser.messages
                    // );
                    // // İki kullanıcının da messages array'ini alalım

                    // const user1Messages = chatDetailActiveUser.messages || [];
                    // const user2Messages = chatDetailSelectedUser.messages || [];
                    // console.log(
                    //   "Check user 1 messages  =>",
                    //   user1Messages,
                    //   "Check user 2 messages  =>",
                    //   user2Messages
                    // );
                    // // İlk kullanıcının messages array'indeki room'u bulalım
                    // const user1RoomIndex = user1Messages.findIndex(
                    //   (message) => message.room === data.room
                    // );

                    // console.log("Check room indexes =>", user1RoomIndex);

                    // // İkinci kullanıcının messages array'indeki room'u bulalım
                    // const user2RoomIndex = user2Messages.findIndex(
                    //   (message) => message.room === data.room
                    // );
                    // console.log("Check room indexes 2=>", user2RoomIndex);
                    // BUG users room index not receiving correctly finish to check

                    console.log("Active user id =>", chatDetailActiveUser._id);
                    console.log(
                      "Selected user id =>",
                      chatDetailSelectedUser._id
                    );
                    User.find({
                      _id: {
                        $in: [
                          new mongoose.Types.ObjectId(chatDetailActiveUser._id),
                          new mongoose.Types.ObjectId(
                            chatDetailSelectedUser._id
                          ),
                        ],
                      },
                    })
                      .then((users) => {
                        // new version sözde BUG fix start to check
                        const user1Room = users[0].messages.find((eachRoom) => {
                          return eachRoom.room === data.room;
                        });
                        const user1RoomIndex =
                          users[0].messages.indexOf(user1Room);
                        const user2Room = users[1].messages.find((eachRoom) => {
                          return eachRoom.room === data.room;
                        });

                        const user2RoomIndex =
                          users[1].messages.indexOf(user2Room);

                        console.log("User 1 username =>", users[0].username);
                        console.log("User 2 username =>", users[1].username);

                        console.log(
                          "User 1 message room index =>",
                          user1RoomIndex
                        );
                        console.log(
                          "User 2 message room index =>",
                          user2RoomIndex
                        );
                        // new version sözde BUG fix finish to check

                        console.log(
                          "User 1 message room length=>",
                          users[0].messages[user1RoomIndex].chat.length
                        );
                        console.log(
                          "User 2 message room length=>",
                          users[1].messages[user2RoomIndex].chat.length
                        );
                        users[0].messages[user1RoomIndex].chat.push(
                          newCreatedChatBetween2User._id
                        );
                        users[1].messages[user2RoomIndex].chat.push(
                          newCreatedChatBetween2User._id
                        );

                        console.log(
                          "First user Room =>",
                          users[0].messages[user1RoomIndex].room
                        );
                        console.log(
                          "Second user Room =>",
                          users[1].messages[user2RoomIndex].room
                        );
                        console.log(users[0].messages[user1RoomIndex].room);

                        const firstMessageRoom =
                          users[0].messages[user1RoomIndex];
                        const secondMessageRoom =
                          users[1].messages[user2RoomIndex];
                        console.log(
                          "User first, first message room before update =>",
                          users[0].messages[user1RoomIndex].room
                        );
                        console.log(
                          "User second, first message room before update =>",
                          users[1].messages[user2RoomIndex].room
                        );
                        users[0].messages.splice(user1RoomIndex, 1);
                        users[1].messages.splice(user2RoomIndex, 1);
                        users[0].messages.unshift(firstMessageRoom);
                        users[1].messages.unshift(secondMessageRoom);

                        users[0].save();
                        users[1].save();
                        console.log(
                          "User first, first message room after update =>",
                          users[0].messages[user1RoomIndex].room
                        );
                        console.log(
                          "User second, first message room after update =>",
                          users[1].messages[user2RoomIndex].room
                        );
                        // version error start to check
                        // users[0].save();
                        // users[1].save();
                        // version error finish to check

                        // bug fix for version error start to check
                        const updateUser1 = User.findOneAndUpdate(
                          { _id: users[0]._id, "messages.room": data.room },
                          {
                            $push: {
                              "messages.$.chat": newCreatedChatBetween2User._id,
                            },
                          },
                          { new: true }
                        );

                        const updateUser2 = User.findOneAndUpdate(
                          { _id: users[1]._id, "messages.room": data.room },
                          {
                            $push: {
                              "messages.$.chat": newCreatedChatBetween2User._id,
                            },
                          },
                          { new: true }
                        );

                        Promise.all([updateUser1, updateUser2])
                          .then((updatedUsers) => {
                            console.log("Users updated successfully");
                          })
                          .catch((error) => {
                            console.log("Error updating users:", error);
                          });
                        // bug fix for version error finish to check
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              });
            });
          })
          .catch((error) => {
            console.log("This line is working 10 ERROR !!! _", socket.id);

            console.log("error occured while fetching the user =>", error);
          });
      });
    });

    socket.on("join_user_room", async (data) => {
      const { activeUser, selectedUser } = data;
      console.log(
        "active user =>",
        activeUser,
        "selected user =>",
        selectedUser
      );
      const room = [activeUser.username, selectedUser.username]
        .sort()
        .join("_");

      socket.join(room);

      User.find({
        _id: {
          $in: [
            new mongoose.Types.ObjectId(activeUser._id),
            new mongoose.Types.ObjectId(selectedUser._id),
          ],
        },
      }).then((initiatingChatRoomBetweenTwoUsers) => {
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
                $push: {
                  messages: {
                    $each: [
                      {
                        room: room,
                        chat: [],
                        members: [activeUser._id, selectedUser._id],
                      },
                    ],
                    $position: 0,
                  },
                },
              },
              { new: true }
            );
          });

          const findMessageRoomId = (user1, user2) => {
            const user1Rooms = user1.messages.map((message) => message.room);
            const user2Rooms = user2.messages.map((message) => message.room);

            const commonRooms = user1Rooms.filter((room) =>
              user2Rooms.includes(room)
            );

            console.log("This is the common room =>", commonRooms);
            if (commonRooms.length > 0) {
              return commonRooms[0];
            }

            return null;
          };

          Promise.all(updatePromises)
            .then((updatedUsers) => {
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

                socket.emit(
                  "getmessageRoomId",
                  newIdOfMessageRoom._id.toString()
                );
              } else {
                console.log("Ortak mesaj odasi bulunamadi.");
              }
            })
            .catch((error) => {
              console.error("Error updating users:", error);
            });
        } else {
          User.find({
            _id: {
              $in: [new mongoose.Types.ObjectId(activeUser._id)],
            },
          })
            .populate({
              path: "messages.chat",
              model: "Chat",
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
              } else {
                console.error("Error fetching messages for the existing room.");
              }
            })
            .catch((error) => {
              console.error("Error fetching users:", error);
            });
        }

        console.log("They are ready to chat their => room created!");
      });
    });

    socket.on("setUsername", (username) => {
      const user = {
        socketId: socket.id,
        username: username,
      };
      user.username = username;

      const existingUser = onlineUsers.find(
        (u) => u.username === user.username
      );
      if (existingUser) {
        console.log(
          `Kullanıcı adı "${user.username}" zaten kullanılıyor. Bağlantı reddedildi.`
        );
        socket.disconnect();

        console.log("Online users 2 => ", onlineUsers);
        return;
      } else {
        onlineUsers.push(user);
        console.log(
          `${socket.id} kullanici adini "${username}" olarak ayarladi.`
        );
        console.log("Online users 3 =>", onlineUsers);
      }
    });
    socket.on(
      "sendNotification",
      ({
        senderName,
        receiverName,
        type,
        contactHasBeenMade,
        text,
        senderInfo,
      }) => {
        console.log("Receiver name =>", receiverName);
        console.log("Online users 4 =>", onlineUsers);
        console.log("General info =>", contactHasBeenMade);

        console.log("Sender info =>", senderInfo);
        const receiver = onlineUsers.find((eachUser) => {
          return eachUser.username === receiverName;
        });

        console.log("Sender name =>", senderName);
        console.log("Receiver  =>", receiver);
        if (receiver && type !== "message") {
          io.to(receiver.socketId).emit("getNotification", {
            senderName,
            receiverName,
            type,
            contactHasBeenMade: contactHasBeenMade ? contactHasBeenMade : null,
            senderInfo,
          });

          io.to(receiver.socketId).emit("getText", {
            senderName,
            receiverName,
            type,
            contactHasBeenMade: contactHasBeenMade ? contactHasBeenMade : null,
            senderInfo,
          });
        } else if (receiver && type === "message") {
          io.to(receiver.socketId).emit("getNotification", {
            senderName,
            receiverName,
            type,
            text,
            contactHasBeenMade: contactHasBeenMade ? contactHasBeenMade : null,
            senderInfo,
          });
          io.to(receiver.socketId).emit("getText", {
            senderName,
            type,
            text,
            contactHasBeenMade: contactHasBeenMade ? contactHasBeenMade : null,
            senderInfo,
          });
        } else if (!receiver) {
          console.log("Receiver is not found !");
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected =>", socket.id);
      const findedUser = onlineUsers.find((eachUser) => {
        return eachUser.socketId === socket.id;
      });

      const findedUserIndex = onlineUsers.indexOf(findedUser);
      if (findedUserIndex !== -1) {
        const disconnectedUser = onlineUsers.splice(findedUserIndex, 1)[0];

        console.log(
          `User ${disconnectedUser.username} socket.id : ${disconnectedUser.socketId} disconnected `
        );
      } else {
        console.log(
          "User not found to disconnect with username and socket id "
        );
      }
    });
  });

  app.set("io", io);
};
