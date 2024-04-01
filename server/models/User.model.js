const { Schema, model } = require("mongoose");
const Chat = require("../models/Chat.model");

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
    signedUpWithVariantOne: {
      isSignedUpWithVariantOne: { type: Boolean, default: false },
      isUsernameCustomized: { type: Boolean, default: false },
      isUsernameCustomizationModalShown: { type: Boolean, default: false },
      isProfileImageCustomizationModalShown: { type: Boolean, default: false },
    },
    signedUpWithGoogle: {
      isSignedUpWithGoogle: { type: Boolean, default: false },
      isUsernameCustomized: { type: Boolean, default: false },
      isUsernameCustomizationModalShown: { type: Boolean, default: false },
      signedUpWithGoogleUserId: {
        type: String,
        default: "",
      },
    },
    fullname: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    bio: String,
    birthDate: {
      month: { type: String },
      day: { type: String },
      year: { type: String },
    },
    imageUrl: String,
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    reposts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        room: String,
        chat: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
        readed: {
          type: Boolean,
          default: false,
        },
        deactivatedMember: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isDeactivated: {
      type: Boolean,
      default: false,
    },
    deactivatedDate: {
      type: Date,
      default: null,
    },
    notifications: [notificationSchema],
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: [
      {
        type: Object,
        default: {},
      },
    ],
    verifiedPhoneNumberDetail: {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      countryCode: { type: String },
      countryPhoneCode: { type: String },
      phoneNumberIssuedBy: { type: String },
      qrCodeCreatedDate: { type: Date },
      qrCodeTextValueForVerification: { type: String },
    },
    hasSubscription: {
      type: Boolean,
      default: false,
    },
    subscriptions: [{ type: Schema.Types.ObjectId, ref: "Subscription" }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
