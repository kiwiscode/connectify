const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});
// test
const chatSchema = new Schema({
  room: String,
  messages: [messageSchema],
});

const Chat = model("Chat", chatSchema);

module.exports = Chat;
