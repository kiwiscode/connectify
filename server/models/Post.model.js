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
    authorFullName: {
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
    reposter: [
      {
        fullname: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
    isReposted: {
      type: Boolean,
      default: false,
    },
    repostedFromThisOriginalPost: [
      { type: Schema.Types.ObjectId, ref: "Post" },
    ],
    reposted: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
