const express = require("express");
const router = express();
const User = require("../models/User.model");
const Subscription = require("../models/Subscription.model");

// twilio settings start to check
const { MessagingResponse } = require("twilio").twiml;
// twilio settings finish to check

let premiumInfoGlobal;
let premiumRoleGlobal;
let verifyPhoneCodeGlobal;
let countryShortCutGlobal;
let countryPhoneCodeGlobal;
let selectedCountryGlobal;
let phoneNumberGlobal;
let resultPhoneNumberGlobal;
router.post("/premium-info-verify-phone-number", (req, res) => {
  const {
    premiumInfo,
    premiumRole,
    verifyPhoneCode,
    countryShortCut,
    countryPhoneCode,
    selectedCountry,
    phoneNumber,
  } = req.body;

  premiumInfoGlobal = premiumInfo;
  premiumRoleGlobal = premiumRole;
  verifyPhoneCodeGlobal = verifyPhoneCode;
  countryShortCutGlobal = countryShortCut;
  countryPhoneCodeGlobal = countryPhoneCode;
  selectedCountryGlobal = selectedCountry;
  phoneNumberGlobal = phoneNumber;
  resultPhoneNumberGlobal = {
    withoutPlusSign: `${countryPhoneCodeGlobal}${phoneNumberGlobal}`,
    withPlusSign: `+${countryPhoneCodeGlobal}${phoneNumberGlobal}`,
  };

  console.log(
    "Before qr code ! =>",
    premiumInfoGlobal,
    premiumRoleGlobal,
    verifyPhoneCodeGlobal,
    countryShortCutGlobal,
    countryPhoneCodeGlobal,
    selectedCountryGlobal,
    phoneNumberGlobal
  );
  console.log(
    "Before qr code ! =>",
    resultPhoneNumberGlobal ? resultPhoneNumberGlobal : null
  );
});

let isVerifyCodeCorrect;
let isPhoneNumberMatch;

router.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();
  const userMessageContent = req.body.Body;
  const userPhoneNumber = req.body.From;

  console.log("User verify phone number code input =>", userMessageContent);

  console.log("Received number from user =>", req.body.From);
  console.log(
    "Received number from verify phone number input by user with plus sign and without plus sign =>",
    resultPhoneNumberGlobal ? resultPhoneNumberGlobal : null
  );

  console.log(
    "After sms ! =>",
    premiumInfoGlobal,
    premiumRoleGlobal,
    verifyPhoneCodeGlobal,
    countryShortCutGlobal,
    countryPhoneCodeGlobal,
    selectedCountryGlobal,
    phoneNumberGlobal
  );
  console.log(
    "After sms ! =>",
    resultPhoneNumberGlobal ? resultPhoneNumberGlobal : null
  );

  // console.log(
  //   "Received number from verify phone number input by user with plus sign and without plus sign =>",
  //   resultPhoneNumberGlobal.withPlusSign,
  //   resultPhoneNumberGlobal.withoutPlusSign
  // );

  // console.log("QR Code for phone verification =>", verifyPhoneCodeGlobal);
  // console.log("QR Code received from user message =>", userMessageContent);

  if (
    userMessageContent === verifyPhoneCodeGlobal &&
    (userPhoneNumber === resultPhoneNumberGlobal.withPlusSign ||
      userPhoneNumber === resultPhoneNumberGlobal.withoutPlusSign)
  ) {
    isVerifyCodeCorrect = true;
    isPhoneNumberMatch = true;
    console.log(
      "User send a correct verification code => ",
      isVerifyCodeCorrect
    );
  } else {
    isVerifyCodeCorrect = false;
    isPhoneNumberMatch = false;
    console.log(
      "User send a correct verification code => ",
      isVerifyCodeCorrect
    );
  }

  res.type("text/xml").send(twiml.toString());
});

router.post("/verify-phone-for-subscription", async (req, res) => {
  try {
    console.log(
      "After finishing sms process ! =>",
      premiumInfoGlobal,
      premiumRoleGlobal,
      verifyPhoneCodeGlobal,
      countryShortCutGlobal,
      countryPhoneCodeGlobal,
      selectedCountryGlobal,
      phoneNumberGlobal
    );
    console.log(
      "After finishing sms process ! =>",
      resultPhoneNumberGlobal ? resultPhoneNumberGlobal : null
    );

    if (isVerifyCodeCorrect && isPhoneNumberMatch) {
      res.status(200).json({
        success: true,
        message: "The user has verified their phone and is ready to subscribe.",
      });
    } else {
      res.status(400).json({
        success: false,
        errorMessage: "Verification code or phone number mismatch error.",
      });
    }
  } catch (error) {
    console.error("Error occured:", error);
    res.status(500).json({
      errorMessage:
        "An error occurred. Subscription process could not be completed.",
    });
  }
});

// user after finish with verification phone process ready to subscribe for individual plan basic-premium or premium+

// router.post("/subscribe");
// const userId = premiumInfoGlobal.user._id;
// const findedUser = await User.findById(userId);
// findedUser.isPhoneVerified = true;
// findedUser.phoneNumber.unshift(resultPhoneNumberGlobal);
// findedUser.verifiedPhoneNumberDetail = {
//   user: userId,
//   countryCode: countryShortCutGlobal,
//   countryPhoneCode: `+${countryPhoneCodeGlobal}`,
//   phoneNumberIssuedBy: selectedCountryGlobal,
//   qrCodeCreatedDate: Date.now(),
//   qrCodeTextValueForVerification: verifyPhoneCodeGlobal,
// };
// findedUser.hasSubscription = true;
// const createdSubscription = await Subscription.create({
//   owner: findedUser._id.toString(),
//   role: premiumRoleGlobal,
//   subscriptionDetails: {
//     premiumType: premiumInfoGlobal.premiumType,
//     billingCycle: premiumInfoGlobal.planType,
//     subscriptionPrice: premiumInfoGlobal.planPrice,
//   },
//   isActive: true,
// });
// findedUser.subscriptions.unshift(createdSubscription._id.toString());
// await findedUser.save();

module.exports = router;
