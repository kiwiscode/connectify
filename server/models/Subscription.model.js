const { Schema, model } = require("mongoose");

const subscriptionSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    role: String, // "individual", "organization"
    subscriptionDetails: {
      premiumType: String, // "basic", "premium", "premium+"
      billingCycle: String, // "monthly", "annual"
      subscriptionPrice: String, // subscription price
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    organizationDetails: {
      organizationName: String,
      organizationHandle: String,
      organizationFullName: String,
      organizationEmailAddress: String,
      organizationWebSite: String,
      organizationType: String,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = model("Subscription", subscriptionSchema);

module.exports = Subscription;
