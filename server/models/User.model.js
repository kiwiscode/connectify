const { Schema, model } = require("mongoose");
const Message = require("../models/Message.model");

const notificationSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    notificationReceiver: { type: Schema.Types.ObjectId, ref: "User" },
    isFavorite: {
      value: { type: Boolean, default: false },
      profileImageUrl: { type: String, default: "" },
      userFullName: { type: String, default: "" },
      favoritedPostContent: { type: String, default: "" },
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    isRepost: {
      value: { type: Boolean, default: false },
      profileImageUrl: { type: String, default: "" },
      userUserName: { type: String, default: "" },
      repostedPostContent: { type: String, default: "" },
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    isComment: {
      value: { type: Boolean, default: false },
      profileImageUrl: { type: String, default: "" },
      userFullName: { type: String, default: "" },
      userUserName: { type: String, default: "" },
      comment: { type: String, default: "" },
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    isReaded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    bio: String,
    imageUrl: String,
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    reposts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    notifications: [notificationSchema],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
