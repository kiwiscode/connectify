const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorFullName: {
      type: String,
    },
    authorUserName: {
      type: String,
    },
    content: String,
    media: [String],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reposted: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
