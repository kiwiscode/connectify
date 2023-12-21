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
  let globalVariableForUpdatedUsers;
  io.on("connection", async (socket) => {
    console.log("A user connected:", socket.id);

    // Tüm kullanıcıları bul ve istemcilere gönder
    const allUsers = await User.find();
    io.emit("activeUsers", allUsers);

    socket.on("join_user_room", async (data) => {
      const { activeUser, selectedUser } = data;
      // Create a unique room name using the usernames
      const room = [activeUser.username, selectedUser.username]
        .sort()
        .join("_");
      console.log(data);
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

        console.log(
          "Two users creating a chat room =>",
          initiatingChatRoomBetweenTwoUsers
        );

        // İki kullanıcıyı bul ve her birinin messages dizisine yeni bir room ekleyin

        // İki kullanıcının daha önce aynı room altında bir chat odası oluşturup oluşturmadığını kontrol et
        const roomExists = initiatingChatRoomBetweenTwoUsers.every((user) => {
          return user.messages.some((message) => message.room === room);
        });
        console.log("Is their room already exist =>", roomExists);

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
              globalVariableForUpdatedUsers = updatedUsers;
              console.log("Users updated:", updatedUsers);
            })
            .catch((error) => {
              // Hata işleme kodu burada
              console.error("Error updating users:", error);
            });
        } else {
          console.error("The room already exists between these two users.");
        }
        // finish to check initiate a chat room between 2 user

        // start to check INFO NOTE chat starting
        console.log("They are ready to chat room created!");
        socket.on("send_message", async (data) => {
          socket.to(data.room).emit("receive_message", data);
          console.log("this line is working !");
          console.log("Check the data for creating new chat =>", data);
          const newChat = {
            sender: data.author,
            text: data.message,
            timeStamp: Date.now(),
          };

          Chat.create({
            room: data.room,
            messages: [newChat],
          })
            .then((newCreatedChatBetween2User) => {
              console.log(
                "NEW CREATED CHAT BETWEEN 2 USER WHICH WILL BE THE PARENT CHAT FOR THE ALL MESAGES BETWEEN THIS 2 USER INSIDE USERS MESSAGES ARRAY =>",
                newCreatedChatBetween2User
              );
              // start to check find the room index inside users messages array
              console.log(
                "Are users updated after updated users work =>",
                initiatingChatRoomBetweenTwoUsers
              );
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

              console.log("First user room index =>", user1RoomIndex);
              console.log("Second user room index =>", user2RoomIndex);

              // Şimdi, her iki kullanıcının messages array'indeki ilgili room'un içine chat'i ekleyebiliriz
              user1Messages[user1RoomIndex].chat.push(
                newCreatedChatBetween2User._id
              );
              user2Messages[user2RoomIndex].chat.push(
                newCreatedChatBetween2User._id
              );
              // Şimdi güncellenmiş kullanıcıları kaydedelim
              // const savePromises = [
              //   initiatingChatRoomBetweenTwoUsers[0].save(),
              //   initiatingChatRoomBetweenTwoUsers[1].save(),
              // ];
              // Promise.all(savePromises)
              //   .then((savedChatsandUsers) => {
              //     console.log("Chats saved:", savedChatsandUsers);
              //   })
              //   .catch((error) => {
              //     console.error("Error updating users or chat:", error);
              //   });
              const savedUsers = [
                initiatingChatRoomBetweenTwoUsers[0],
                initiatingChatRoomBetweenTwoUsers[1],
              ];
              console.log("LINE 182 =>", savedUsers);
              // İlk kullanıcıyı kaydet
              User.findOneAndUpdate(
                {
                  _id: initiatingChatRoomBetweenTwoUsers[0]._id,
                  __v: initiatingChatRoomBetweenTwoUsers[0].__v,
                },
                initiatingChatRoomBetweenTwoUsers[0],
                { new: true }
              )
                .then((savedUser) => {
                  console.log("First user saved:", savedUser);
                })
                .catch((error) => {
                  console.error("Error updating first user:", error);
                });

              // İkinci kullanıcıyı kaydet
              User.findOneAndUpdate(
                {
                  _id: initiatingChatRoomBetweenTwoUsers[1]._id,
                  __v: initiatingChatRoomBetweenTwoUsers[1].__v,
                },
                initiatingChatRoomBetweenTwoUsers[1],
                { new: true }
              )
                .then((savedUser) => {
                  console.log("Second user saved:", savedUser);
                })
                .catch((error) => {
                  console.error("Error updating second user:", error);
                });

              console.log("LINE 205 =>", savedUsers);
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
