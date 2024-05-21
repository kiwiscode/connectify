const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    authorFullName: {
      type: String,
    },
    authorUserName: {
      type: String,
    },
    content: String,
    image: {
      public_id: {
        type: String,
        default: "image@url",
      },
      url: {
        type: String,
        default: "image@url",
      },
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bookmark",
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
    isComment: {
      type: Boolean,
      default: false,
    },
    commentedForThisPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    commentedForThisUsersPost: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
