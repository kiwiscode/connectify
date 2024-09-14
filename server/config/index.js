const express = require("express");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");

const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const { default: mongoose } = require("mongoose");
let onlineUsers = [];
let interactedChatRooms = [];
let currentUrlForSocketId = null;
let socketUserUsername = null;
let isBothUserOpenedMessageRoom = null;

module.exports = (app) => {
  app.use(cors());
  const server = http.createServer(app);

  require("dotenv").config();

  app.use(logger("dev"));
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" }));
  app.use(bodyParser.json({ type: "application/vnd.api+json" }));
  app.set("trust proxy", 1);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    socket.emit("socket_id_for_user", socket.id);
    socket.on("socket_userInfo", (data) => {
      socketUserUsername = data?.username;
    });

    socket.on(
      "current_url_for_checking_if_user_inside_chat_details_page",
      (data) => {
        currentUrlForSocketId = data;
      }
    );

    setTimeout(() => {
      const activeUser = interactedChatRooms.find((room) =>
        // Oda içindeki activeUsers listesini kontrol et
        room.room.activeUsers.some(
          (activeUser) =>
            activeUser.user1.username === socketUserUsername ||
            activeUser.user2.username === socketUserUsername
        )
      );

      const activeUserIndex = interactedChatRooms?.indexOf(activeUser);

      // Eğer current url "/messages/" ile başlıyorsa
      if (currentUrlForSocketId?.startsWith("/messages/")) {
        console.log("Chat detail page route active.----------------- ");
      } else {
        isBothUserOpenedMessageRoom = false;

        const ifUserNameIsInsideOfArray = interactedChatRooms[
          activeUserIndex
        ]?.room.activeUsers.some(
          (activeUser) =>
            activeUser.user1.username === socketUserUsername ||
            activeUser.user2.username === socketUserUsername
        );

        const user1Username =
          interactedChatRooms[activeUserIndex]?.room.activeUsers[0]?.user1
            ?.username;
        const user2Username =
          interactedChatRooms[activeUserIndex]?.room.activeUsers[0]?.user2
            ?.username;

        if (ifUserNameIsInsideOfArray && user1Username === socketUserUsername) {
          if (interactedChatRooms[activeUserIndex]) {
            // interactedChatRooms[activeUserIndex].room.roomName = "";
            interactedChatRooms[
              activeUserIndex
            ].room.activeUsers[0].user1.username = null;
            interactedChatRooms[
              activeUserIndex
            ].room.activeUsers[0].user1.socketId = null;
            interactedChatRooms[
              activeUserIndex
            ].room.activeUsers[0].user1.isActiveInRoom = false;
          }
        } else if (
          ifUserNameIsInsideOfArray &&
          user2Username === socketUserUsername
        ) {
          if (interactedChatRooms[activeUserIndex]) {
            // interactedChatRooms[activeUserIndex].room.roomName = "";
            interactedChatRooms[
              activeUserIndex
            ].room.activeUsers[0].user2.username = null;
            interactedChatRooms[
              activeUserIndex
            ].room.activeUsers[0].user2.socketId = null;
            interactedChatRooms[
              activeUserIndex
            ].room.activeUsers[0].user2.isActiveInRoom = false;
          }
        }
      }
    }, 1000);

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

              const room = [activeUser?.username, selectedUser?.username]
                .sort()
                .join("_");

              const activeRoomWithUsers = interactedChatRooms.find(
                (eachRoom) => {
                  return eachRoom.room.roomName === room;
                }
              );

              const indexOfThisRoom =
                interactedChatRooms.indexOf(activeRoomWithUsers);
              setTimeout(() => {
                if (!activeRoomWithUsers) {
                  interactedChatRooms.push({
                    room: {
                      roomName: room,
                      activeUsers: [
                        {
                          user1: {
                            username: activeUser.username,
                            socketId: socket.id,
                            isActiveInRoom: true,
                          },
                          user2: {
                            username: null,
                            socketId: null,
                            isActiveInRoom: false,
                          },
                        },
                      ],
                    },
                  });
                } else {
                  if (
                    interactedChatRooms[indexOfThisRoom].room.activeUsers[0]
                      .user1.username === null
                  ) {
                    interactedChatRooms[indexOfThisRoom].room.roomName = room;
                    interactedChatRooms[
                      indexOfThisRoom
                    ].room.activeUsers[0].user1 = {
                      username: activeUser.username,
                      socketId: socket.id,
                      isActiveInRoom: true,
                    };
                  } else if (
                    interactedChatRooms[indexOfThisRoom].room.activeUsers[0]
                      .user2.username === null
                  ) {
                    interactedChatRooms[indexOfThisRoom].room.roomName = room;
                    interactedChatRooms[
                      indexOfThisRoom
                    ].room.activeUsers[0].user2 = {
                      username: activeUser.username,
                      socketId: socket.id,
                      isActiveInRoom: true,
                    };
                  }
                }
              }, 500);

              setTimeout(() => {
                if (
                  interactedChatRooms[indexOfThisRoom]?.room.activeUsers[0]
                    .user2.isActiveInRoom &&
                  interactedChatRooms[indexOfThisRoom]?.room.activeUsers[0]
                    .user1.isActiveInRoom
                ) {
                  isBothUserOpenedMessageRoom = true;
                } else {
                  console.log(
                    "Burası çalışıyor ve onaylanamadı ! yani iki userda aynı anda aynı odada değiller şu an ..."
                  );
                }
              }, 1250);

              chatDetailActiveUser = activeUser;
              chatDetailSelectedUser = selectedUser;

              socket.join(room);

              setTimeout(() => {
                io.to(room).emit("interactedChatRooms", {
                  interactedChatRooms,
                  room,
                });
              }, 2500);

              socket.on("typing_indicator", (data) => {
                io.to(room).emit("typing_result", {
                  data,
                });
              });

              socket.on("send_spesific_room_message", async (data) => {
                socket
                  .to(data.room)
                  .emit("receive_spesific_room_message", data);

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
                        // new version sözde BUG fix finish to check
                        const userOneChatCollectionIds = users[0].messages[
                          user1RoomIndex
                        ].chat.map((eachChatIndividualMessage) => {
                          return eachChatIndividualMessage._id.toString();
                        });
                        const userSecondChatCollectionIds = users[1].messages[
                          user2RoomIndex
                        ].chat.map((eachChatIndividualMessage) => {
                          return eachChatIndividualMessage._id.toString();
                        });

                        if (
                          !userOneChatCollectionIds.includes(
                            newCreatedChatBetween2User._id.toString()
                          ) &&
                          !userSecondChatCollectionIds.includes(
                            newCreatedChatBetween2User._id.toString()
                          )
                        ) {
                          User.findOneAndUpdate(
                            { _id: users[0]._id },
                            {
                              $push: {
                                [`messages.${user1RoomIndex}.chat`]:
                                  newCreatedChatBetween2User._id,
                              },
                            },
                            { new: true }
                          )
                            .then((resultFromFirstUpdate) => {
                              User.findOneAndUpdate(
                                { _id: users[1]._id },
                                {
                                  $push: {
                                    [`messages.${user2RoomIndex}.chat`]:
                                      newCreatedChatBetween2User._id,
                                  },
                                },
                                { new: true }
                              )
                                .then((resultFromSecondUpdate) => {})
                                .catch((error) => {
                                  console.log(
                                    "Error occured while updating second user !",
                                    error
                                  );
                                });
                            })
                            .catch((error) => {
                              console.log(
                                "Error occured while updating first user !",
                                error
                              );
                            });

                          // creating bug again .save start to check
                          // users[0].messages[user1RoomIndex].chat.push(
                          //   newCreatedChatBetween2User._id
                          // );

                          // users[1].messages[user2RoomIndex].chat.push(
                          //   newCreatedChatBetween2User._id
                          // );
                          // users[0].save();
                          // users[1].save();
                          // creating bug again .save finish to check
                        } else {
                          console.log(
                            "This particular chat id exist already in users messages chat array !!!"
                          );
                        }

                        const firstMessageRoom =
                          users[0].messages[user1RoomIndex];
                        const secondMessageRoom =
                          users[1].messages[user2RoomIndex];

                        setTimeout(() => {
                          if (isBothUserOpenedMessageRoom) {
                            console.log("Burada çalışıyoruz şu anda !");

                            users[0].messages.splice(user1RoomIndex, 1);
                            users[1].messages.splice(user2RoomIndex, 1);
                            users[0].messages.unshift(firstMessageRoom);
                            users[1].messages.unshift(secondMessageRoom);

                            setTimeout(() => {
                              User.updateOne(
                                { _id: users[0]._id },
                                {
                                  $set: {
                                    [`messages.0.readed`]: true,
                                  },
                                }
                              )
                                .then((response) => {
                                  return User.updateOne(
                                    { _id: users[1]._id },
                                    {
                                      $set: {
                                        [`messages.0.readed`]: true,
                                      },
                                    }
                                  );
                                })
                                .then((response) => {})
                                .catch((error) => {
                                  console.log("ERROR =>", error);
                                });
                            }, 1000);
                          } else {
                            if (users[0].username === data.sender) {
                              users[0].messages.splice(user1RoomIndex, 1);
                              users[1].messages.splice(user2RoomIndex, 1);
                              users[0].messages.unshift(firstMessageRoom);
                              users[1].messages.unshift(secondMessageRoom);
                              setTimeout(() => {
                                User.updateOne(
                                  { _id: users[0]._id },
                                  {
                                    $set: {
                                      [`messages.0.readed`]: true,
                                    },
                                  }
                                )
                                  .then((response) => {
                                    return User.updateOne(
                                      { _id: users[1]._id },
                                      {
                                        $set: {
                                          [`messages.0.readed`]: false,
                                        },
                                      }
                                    );
                                  })
                                  .then((response) => {})
                                  .catch((error) => {
                                    console.log("ERROR =>", error);
                                  });
                              }, 1000);
                            } else if (users[1].username === data.sender) {
                              users[0].messages.splice(user1RoomIndex, 1);
                              users[1].messages.splice(user2RoomIndex, 1);
                              users[0].messages.unshift(firstMessageRoom);
                              users[1].messages.unshift(secondMessageRoom);
                              setTimeout(() => {
                                User.updateOne(
                                  { _id: users[0]._id },
                                  {
                                    $set: {
                                      [`messages.0.readed`]: false,
                                    },
                                  }
                                )
                                  .then((response) => {
                                    console.log(
                                      "Response after first update !",
                                      response
                                    );
                                    return User.updateOne(
                                      { _id: users[1]._id },
                                      {
                                        $set: {
                                          [`messages.0.readed`]: true,
                                        },
                                      }
                                    );
                                  })
                                  .then((response) => {
                                    console.log(
                                      "Response after second update !",
                                      response
                                    );
                                  })
                                  .catch((error) => {
                                    console.log("ERROR =>", error);
                                  });
                              }, 1000);
                            }
                          }
                        }, 2500);
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

            if (commonRooms.length > 0) {
              return commonRooms[0];
            }

            return null;
          };

          Promise.all(updatePromises)
            .then((updatedUsers) => {
              const roomName = findMessageRoomId(
                updatedUsers[0],
                updatedUsers[1]
              );
              if (roomName) {
                initiatingChatRoomBetweenTwoUsers[0].messages =
                  updatedUsers[0].messages;
                initiatingChatRoomBetweenTwoUsers[1].messages =
                  updatedUsers[1].messages;

                const newIdOfMessageRoom = updatedUsers[0].messages.find(
                  (messageRoom) => {
                    return messageRoom.room === roomName;
                  }
                );

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

                const findedRoom = user[0].messages.find((eachMessage) => {
                  return eachMessage.room === room;
                });

                socket.emit("getmessageRoomId", findedRoom._id.toString());

                const activeRoomWithUsers = interactedChatRooms.find(
                  (eachRoom) => {
                    return eachRoom.room.roomName === room;
                  }
                );

                const indexOfThisRoom =
                  interactedChatRooms.indexOf(activeRoomWithUsers);
                setTimeout(() => {
                  if (!activeRoomWithUsers) {
                    interactedChatRooms.push({
                      room: {
                        roomName: room,
                        activeUsers: [
                          {
                            user1: {
                              username: activeUser.username,
                              socketId: socket.id,
                              isActiveInRoom: true,
                            },
                            user2: {
                              username: null,
                              socketId: null,
                              isActiveInRoom: false,
                            },
                          },
                        ],
                      },
                    });
                  } else {
                    if (
                      interactedChatRooms[indexOfThisRoom].room.activeUsers[0]
                        .user1.username === null
                    ) {
                      interactedChatRooms[indexOfThisRoom].room.roomName = room;
                      interactedChatRooms[
                        indexOfThisRoom
                      ].room.activeUsers[0].user1 = {
                        username: activeUser.username,
                        socketId: socket.id,
                        isActiveInRoom: true,
                      };
                    } else if (
                      interactedChatRooms[indexOfThisRoom].room.activeUsers[0]
                        .user2.username === null
                    ) {
                      interactedChatRooms[indexOfThisRoom].room.roomName = room;
                      interactedChatRooms[
                        indexOfThisRoom
                      ].room.activeUsers[0].user2 = {
                        username: activeUser.username,
                        socketId: socket.id,
                        isActiveInRoom: true,
                      };
                    }
                  }
                }, 500);

                setTimeout(() => {
                  if (
                    interactedChatRooms[indexOfThisRoom]?.room.activeUsers[0]
                      .user2.username &&
                    interactedChatRooms[indexOfThisRoom]?.room.activeUsers[0]
                      .user1.username
                  ) {
                    isBothUserOpenedMessageRoom = true;
                    console.log(
                      "Burası çalışıyor ve onaylandı ! yani iki userda aynı anda aynı odadalar şu an ..."
                    );
                  } else {
                    console.log(
                      "Burası çalışıyor ve onaylanamadı ! yani iki userda aynı anda aynı odada değiller şu an ..."
                    );
                  }
                }, 1250);

                setTimeout(() => {
                  io.to(room).emit("interactedChatRooms", {
                    interactedChatRooms,
                    room,
                  });
                }, 2500);

                socket.on("typing_indicator", (data) => {
                  io.to(room).emit("typing_result", {
                    data,
                    chatDetailActiveUser,
                    chatDetailSelectedUser,
                  });
                });
              } else {
                console.error("Error fetching messages for the existing room.");
              }
            })
            .catch((error) => {
              console.error("Error fetching users:", error);
            });
        }
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
        console.log("Online users 2 => ", onlineUsers);
        // socket.disconnect();
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
        const receiver = onlineUsers.find((eachUser) => {
          return eachUser.username === receiverName;
        });

        console.log("Sender name =>", senderName);
        console.log("Receiver  =>", receiver);
        console.log("Receiver socket id =>", receiver?.socketId);

        if (
          receiver &&
          type !== "message" &&
          !currentUrlForSocketId?.startsWith("/notifications")
        ) {
          console.log("Notification is ready to send(!message)");
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
        } else if (
          receiver &&
          type === "message" &&
          !currentUrlForSocketId?.startsWith("/messages")
        ) {
          console.log("Notification is ready to send(message)");
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

    socket.on("logout", (data) => {
      console.log("Data for disconnection=>", data);
      const findedUser = onlineUsers.find((eachUser) => {
        return eachUser.socketId === data;
      });

      console.log("Current socket id =>", socket.id);
      console.log("All online users =>", onlineUsers);
      console.log("Finded user =>", findedUser);

      const findedUserIndex = onlineUsers.indexOf(findedUser);

      if (findedUserIndex !== -1) {
        const logoutedUser = onlineUsers.splice(findedUserIndex, 1)[0];

        console.log(
          `User ${logoutedUser.username} socket.id : ${logoutedUser.socketId} logout `
        );
      } else {
        console.log("User not found to logout with username and socket id ");
      }
    });

    socket.on("disconnect", () => {
      const findedUser = onlineUsers.find((eachUser) => {
        return eachUser.socketId === socket.id;
      });

      console.log("Current socket id =>", socket.id);
      console.log("All online users =>", onlineUsers);
      console.log("Finded user =>", findedUser);

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

  // app.set("io", io);
};
