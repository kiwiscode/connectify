const { Schema, model } = require("mongoose");

const activitySchema = new Schema(
  {
    activityHasBeenInitiatedWith: { type: Schema.Types.ObjectId, ref: "User" },
    thePersonWhoCarriedOutTheActivity: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    activityType: { type: String, enum: ["comment", "repost", "favorite"] },
    relatedPost: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  {
    timestamps: true,
  }
);

const Activity = model("Activities", activitySchema);

module.exports = Activity;
