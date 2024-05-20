const { Schema, model } = require("mongoose");

const bookmarkSchema = new Schema(
  {
    bookmarkedPost: { type: Schema.Types.ObjectId, ref: "Post" },
    bookmarker: { type: Schema.Types.ObjectId, ref: "User" },
    bookmarkedFromThisUser: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Bookmark = model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
