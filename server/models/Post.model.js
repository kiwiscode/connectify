const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
  media: [String],
  authorFullName: {
    type: String,
  },
  authorUserName: {
    type: String,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Post = model("Post", postSchema);

module.exports = Post;
