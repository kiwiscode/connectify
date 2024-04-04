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

// let isVerifyCodeCorrect;
// let isPhoneNumberMatch;

// test mode nürnberg road start to check
let isVerifyCodeCorrect = true;
let isPhoneNumberMatch = true;
// test mode nürnberg road finish to check

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

const authenticateToken = require("../middleware/jwtMiddleware");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_KEY);

router.post(
  "/basic-subscribe-checkout",
  authenticateToken,
  async (request, response) => {
    const line_items = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Individual Subscription",
            description:
              premiumInfoGlobal.planType === "Annual Plan"
                ? "per year"
                : premiumInfoGlobal.planType === "Monthly Plan"
                ? "per month"
                : null,
          },
          unit_amount:
            premiumInfoGlobal.planPrice === "€199.92"
              ? 19992
              : premiumInfoGlobal.planPrice === "€19.04"
              ? 1904
              : premiumInfoGlobal.planPrice === "€99.96"
              ? 9996
              : premiumInfoGlobal.planPrice === "€9.52"
              ? 952
              : premiumInfoGlobal.planPrice === "€38.08"
              ? 3808
              : premiumInfoGlobal.planPrice === "€3.57"
              ? 357
              : null,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,

      custom_text: {
        submit: {
          message:
            "All payments for Paid Services are final and not refundable or exchangeable, except as required by applicable law. Misuse of Verified Organizations such as fraud, spam, etc., will result in your account’s off-boarding from the program, suspension from Connectify, or other action as Connectify may deem appropriate.",
        },
        after_submit: {
          message:
            "By confirming your subscription, you allow Connectify (formerly ?!🧐) to charge you for future payments in accordance with their terms. You can always cancel your subscription.",
        },
      },
      // when working on locally
      success_url: "http://localhost:5173/home",
      cancel_url: "http://localhost:5173/home",

      // when working on deployment version
      // success_url: "?",
      // cancel_url: "?",
    });

    response.send({ url: session.url });
  }
);
router.get(
  "/basic-subscribe-checkout-success",
  authenticateToken,
  async (request, response) => {
    try {
      // eğer userda aktif bir subscription varsa bu active subscription bire bir aşşağıda kayıt edilen subscription ile aynı ise tekrar kayıt etme
      const userId = premiumInfoGlobal.user._id;
      const findedUser = await User.findById(userId);

      findedUser.isPhoneVerified = true;
      findedUser.phoneNumber.unshift(resultPhoneNumberGlobal);
      findedUser.verifiedPhoneNumberDetail = {
        user: userId,
        countryCode: countryShortCutGlobal,
        countryPhoneCode: `+${countryPhoneCodeGlobal}`,
        phoneNumberIssuedBy: selectedCountryGlobal,
        qrCodeCreatedDate: Date.now(),
        qrCodeTextValueForVerification: verifyPhoneCodeGlobal,
      };
      findedUser.hasSubscription = true;
      const createdSubscription = await Subscription.create({
        owner: findedUser._id.toString(),
        role: premiumRoleGlobal,
        subscriptionDetails: {
          premiumType: premiumInfoGlobal.premiumType,
          billingCycle: premiumInfoGlobal.planType,
          subscriptionPrice: premiumInfoGlobal.planPrice,
        },
        isActive: true,
      });
      findedUser.subscriptions.unshift(createdSubscription._id.toString());
      await findedUser.save();

      response.status(200).json({
        message: {
          success: true,
          message: "Subscription process completed successfully. Thank you!",
        },
      });
    } catch (error) {
      console.error("Error occured:", error);

      response.status(500).json({
        errorMessage:
          "An error occurred. Subscription process could not be completed.",
      });
    }
  }
);

router.post(
  `/change-subscription-modal-status`,
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);

      if (user.successSubscriptionModalShown && user.hasSubscription) {
        res.status(500).json({
          success: true,
          message: "Subscription modal has been shown to the user previously.",
        });
      } else if (!user.successSubscriptionModalShown && user.hasSubscription) {
        user.successSubscriptionModalShown = true;

        await user.save();

        res.status(200).json({
          success: true,
          message: "Subscription modal is now being shown to the user.",
        });
      } else {
        return;
      }
    } catch {
      res.status(500).json({
        success: true,
        message: "User not found!",
      });
    }
  }
);

module.exports = router;
