const app = require("./app");

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// socket.io'yu başlatmak için server örneğini kullanın
const io = app.get("io");
io.attach(server);
