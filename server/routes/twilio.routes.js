const express = require("express");
const router = express();

// twilio settings start to check
const { MessagingResponse } = require("twilio").twiml;
// twilio settings finish to check

let premiumInfoGlobal;
let verifyPhoneCodeGlobal;
let countryShortCutGlobal;
let countryPhoneCodeGlobal;
let selectedCountryGlobal;
let phoneNumberGlobal;

router.post("/premium-info-verify-phone-number", (req, res) => {
  const {
    premiumInfo,
    verifyPhoneCode,
    countryShortCut,
    countryPhoneCode,
    selectedCountry,
    phoneNumber,
  } = req.body;

  premiumInfoGlobal = premiumInfo;
  verifyPhoneCodeGlobal = verifyPhoneCode;
  countryShortCutGlobal = countryShortCut;
  countryPhoneCodeGlobal = countryPhoneCode;
  selectedCountryGlobal = selectedCountry;
  phoneNumberGlobal = phoneNumber;

  console.log(
    "User who send sms general info with all details =>",
    premiumInfoGlobal,
    verifyPhoneCodeGlobal,
    countryShortCutGlobal,
    countryPhoneCodeGlobal,
    selectedCountryGlobal,
    phoneNumberGlobal
  );
});

let isVerifyCodeCorrect;

router.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();
  const userMessageContent = req.body.Body;

  console.log("User verify phone number code input =>", userMessageContent);

  if (userMessageContent === verifyPhoneCodeGlobal) {
    isVerifyCodeCorrect = true;
    console.log(
      "User send a correct verification code => ",
      isVerifyCodeCorrect
    );
  } else {
    isVerifyCodeCorrect = false;
    console.log(
      "User send a correct verification code => ",
      isVerifyCodeCorrect
    );
  }

  res.type("text/xml").send(twiml.toString());
});

router.post("/verify-phone-for-subscription", (req, res) => {
  if (isVerifyCodeCorrect) {
  } else {
  }
});

module.exports = router;
