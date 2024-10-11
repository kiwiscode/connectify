const { Schema, model } = require("mongoose");

const chatSchema = new Schema(
  {
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        timestamp: { type: String, default: Date.now },
      },
    ],
    membersOfChat: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", chatSchema);

module.exports = Chat;
