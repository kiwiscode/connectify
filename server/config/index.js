const express = require("express");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const User = require("../models/User.model");
module.exports = (app) => {
  // socket io will be implement here !!!
  // Kullanıcıları saklamak için bir dizi

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

    // Tüm kullanıcıları bul ve istemcilere gönder
    const allUsers = await User.find();
    io.emit("activeUsers", allUsers);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });

  // Bu socket.io örneğini kullanmak için app nesnesini middleware olarak ekleyin.
  app.set("io", io);
};
