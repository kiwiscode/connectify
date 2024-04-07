const express = require("express");
const router = express();
const subscriptionController = require("../controllers/subscriptionController");
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
const Subscription = require("../models/Subscription.model");

// twilio settings start to check
const { MessagingResponse } = require("twilio").twiml;
// twilio settings finish to check

router.post(
  "/is-phone-verified",
  subscriptionController.handleThisUserPhoneVerified
);

let premiumInfoGlobal;
let premiumRoleGlobal;
let verifyPhoneCodeGlobal;
let countryShortCutGlobal;
let countryPhoneCodeGlobal;
let selectedCountryGlobal;
let phoneNumberGlobal;
let resultPhoneNumberGlobal;
router.post(
  "/premium-info-verify-phone-number-individual-subscription",
  (req, res) => {
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
  }
);

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

  console.log("User send this code =>", userMessageContent);
  console.log("Result phone number global =>", resultPhoneNumberGlobal);
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
let subscriptionProcessError;
router.post("/verify-phone-for-individual-subscription", async (req, res) => {
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
      subscriptionProcessError = false;
      res.status(200).json({
        success: true,
        message: "The user has verified their phone and is ready to subscribe.",
      });
    } else {
      subscriptionProcessError = true;
      res.status(400).json({
        success: false,
        errorMessage: "Verification code or phone number mismatch error.",
      });
    }
  } catch (error) {
    console.error("Error occured:", error);
    subscriptionProcessError = true;
    res.status(500).json({
      errorMessage:
        "An error occurred. Subscription process could not be completed.",
    });
  }
});

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

router.post(
  "/individual-subscribe-checkout",
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
  "/individual-subscribe-checkout-success",
  authenticateToken,
  async (request, response) => {
    try {
      // eğer userda aktif bir subscription varsa bu active subscription bire bir aşşağıda kayıt edilen subscription ile aynı ise tekrar kayıt etme
      console.log("This route is working !!!");
      const userId = premiumInfoGlobal.user._id;
      const findedUser = await User.findById(userId);

      const activeSubscription = await Subscription.find({
        owner: userId,
        isActive: true,
      });

      if (!subscriptionProcessError) {
        if (!findedUser.hasSubscription) {
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
          premiumInfoGlobal = undefined;
          premiumRoleGlobal = undefined;
          verifyPhoneCodeGlobal = undefined;
          countryShortCutGlobal = undefined;
          countryPhoneCodeGlobal = undefined;
          selectedCountryGlobal = undefined;
          phoneNumberGlobal = undefined;
          resultPhoneNumberGlobal = undefined;
          isVerifyCodeCorrect = undefined;
          isPhoneNumberMatch = undefined;
          response.status(200).json({
            message: {
              success: true,
              message:
                "Subscription process completed successfully. Thank you!",
            },
          });
        } else {
          if (
            resultPhoneNumberGlobal &&
            countryShortCutGlobal &&
            countryPhoneCodeGlobal &&
            selectedCountryGlobal &&
            verifyPhoneCodeGlobal &&
            premiumRoleGlobal &&
            premiumInfoGlobal.premiumType &&
            premiumInfoGlobal.planType &&
            premiumInfoGlobal.planPrice
          ) {
            findedUser.phoneNumber[0] = resultPhoneNumberGlobal;
            findedUser.verifiedPhoneNumberDetail = {
              user: userId,
              countryCode: countryShortCutGlobal,
              countryPhoneCode: `+${countryPhoneCodeGlobal}`,
              phoneNumberIssuedBy: selectedCountryGlobal,
              qrCodeCreatedDate: Date.now(),
              qrCodeTextValueForVerification: verifyPhoneCodeGlobal,
            };
            findedUser.successSubscriptionModalShown = false;
            activeSubscription[0].isActive = false;
            activeSubscription[0].cancelledDate = new Date();
            await activeSubscription[0].save();

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
            findedUser.subscriptions.unshift(
              createdSubscription._id.toString()
            );
            await findedUser.save();
            premiumInfoGlobal = undefined;
            premiumRoleGlobal = undefined;
            verifyPhoneCodeGlobal = undefined;
            countryShortCutGlobal = undefined;
            countryPhoneCodeGlobal = undefined;
            selectedCountryGlobal = undefined;
            phoneNumberGlobal = undefined;
            resultPhoneNumberGlobal = undefined;
            isVerifyCodeCorrect = undefined;
            isPhoneNumberMatch = undefined;
            response.status(200).json({
              message: {
                success: true,
                message:
                  "Your subscription has been successfully renewed. Thank you for continuing to use our service.",
              },
            });
          } else {
            response.status(500).json({
              errorMessage:
                "An error occurred. Subscription process could not be completed.",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error occured:", error);
      response.status(500).json({
        errorMessage:
          "An error occurred. Subscription process could not be completed.",
      });
    }
  }
);

// organizational subscriptions start to check

let userInfoGlobal;
let organizationSubPremiumRoleGlobal;
let organizationSubPremiumTypeGlobal;
let organizationSubPlanTypeBasicGlobal;
let organizationSubPlanPriceBasicGlobal;
let organizationSubPlanTypeFullAccessGlobal;
let organizationSubPlanPriceFullAccessGlobal;
let organizationNameGlobal;
let yourFullNameGlobal;
let organizationEmailAdressGlobal;
let organizationWebSiteGlobal;
let displayedOrganizationTypeGlobal;

router.post(
  "/organization-basic-subscribe-create-checkout-session",
  authenticateToken,
  async (request, response) => {
    const {
      userInfo,
      organizationSubPremiumRole,
      organizationSubPremiumType,
      organizationSubPlanTypeBasic,
      organizationSubPlanPriceBasic,
    } = request.body;

    userInfoGlobal = userInfo;
    organizationSubPremiumRoleGlobal = organizationSubPremiumRole;
    organizationSubPremiumTypeGlobal = organizationSubPremiumType;
    organizationSubPlanTypeBasicGlobal = organizationSubPlanTypeBasic;
    organizationSubPlanPriceBasicGlobal = organizationSubPlanPriceBasic;

    console.log(
      "Global variable values =>",
      userInfoGlobal.username,
      userInfoGlobal._id,
      organizationSubPremiumRoleGlobal,
      organizationSubPremiumTypeGlobal,
      organizationSubPlanTypeBasicGlobal,
      organizationSubPlanPriceBasicGlobal
    );
    const line_items = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Subscribe to Verified Organizations Starter",

            description:
              organizationSubPlanTypeBasic === "Annual Plan"
                ? "per year"
                : "per month",
          },
          unit_amount:
            organizationSubPlanPriceBasic === "€2,261"
              ? 226100
              : organizationSubPlanPriceBasic === "€226.10"
              ? 22610
              : organizationSubPlanPriceBasic === "€11,305"
              ? 1130500
              : organizationSubPlanPriceBasic === "€1,130.50"
              ? 113050
              : "",
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
  "/organization-basic-subscribe-checkout-success",
  authenticateToken,
  async (request, response) => {
    try {
      // eğer userda aktif bir subscription varsa bu active subscription bire bir aşşağıda kayıt edilen subscription ile aynı ise tekrar kayıt etme

      const userId = userInfoGlobal._id;
      const findedUser = await User.findById(userId);

      const activeSubscription = await Subscription.find({
        owner: userId,
        isActive: true,
      });

      if (!findedUser.hasSubscription) {
        findedUser.hasSubscription = true;

        const createdSubscription = await Subscription.create({
          owner: findedUser._id.toString(),
          role: organizationSubPremiumRoleGlobal,
          subscriptionDetails: {
            premiumType: organizationSubPremiumTypeGlobal,
            billingCycle: organizationSubPlanTypeBasicGlobal,
            subscriptionPrice: organizationSubPlanPriceBasicGlobal,
          },
          isActive: true,
        });
        findedUser.subscriptions.unshift(createdSubscription._id.toString());
        await findedUser.save();

        userInfoGlobal = undefined;
        organizationSubPremiumRoleGlobal = undefined;
        organizationSubPremiumTypeGlobal = undefined;
        organizationSubPlanTypeBasicGlobal = undefined;
        organizationSubPlanPriceBasicGlobal = undefined;
        response.status(200).json({
          message: {
            success: true,
            message: "Subscription process completed successfully. Thank you!",
          },
        });
      } else {
        if (
          userInfoGlobal &&
          organizationSubPremiumRoleGlobal &&
          organizationSubPremiumTypeGlobal &&
          organizationSubPlanTypeBasicGlobal &&
          organizationSubPlanPriceBasicGlobal
        ) {
          findedUser.successSubscriptionModalShown = false;
          activeSubscription[0].isActive = false;
          activeSubscription[0].cancelledDate = new Date();
          await activeSubscription[0].save();
          const createdSubscription = await Subscription.create({
            owner: findedUser._id.toString(),
            role: organizationSubPremiumRoleGlobal,
            subscriptionDetails: {
              premiumType: organizationSubPremiumTypeGlobal,
              billingCycle: organizationSubPlanTypeBasicGlobal,
              subscriptionPrice: organizationSubPlanPriceBasicGlobal,
            },
            isActive: true,
          });
          findedUser.subscriptions.unshift(createdSubscription._id.toString());
          await findedUser.save();
          userInfoGlobal = undefined;
          organizationSubPremiumRoleGlobal = undefined;
          organizationSubPremiumTypeGlobal = undefined;
          organizationSubPlanTypeBasicGlobal = undefined;
          organizationSubPlanPriceBasicGlobal = undefined;
          response.status(200).json({
            message: {
              success: true,
              message:
                "Your subscription has been successfully renewed. Thank you for continuing to use our service.",
            },
          });
        } else {
          response.status(500).json({
            errorMessage:
              "An error occurred. Subscription process could not be completed.",
          });
        }
      }
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
  "/organization-full-access-subscribe-create-checkout-session",
  authenticateToken,
  async (request, response) => {
    const {
      userInfo,
      organizationSubPremiumRole,
      organizationSubPremiumType,
      organizationSubPlanTypeFullAccess,
      organizationSubPlanPriceFullAccess,
      organizationName,
      yourFullName,
      organizationEmailAdress,
      organizationWebSite,
      displayedOrganizationType,
    } = request.body;

    userInfoGlobal = userInfo;
    organizationSubPremiumRoleGlobal = organizationSubPremiumRole;
    organizationSubPremiumTypeGlobal = organizationSubPremiumType;
    organizationSubPlanTypeFullAccessGlobal = organizationSubPlanTypeFullAccess;
    organizationSubPlanPriceFullAccessGlobal =
      organizationSubPlanPriceFullAccess;
    organizationNameGlobal = organizationName;
    yourFullNameGlobal = yourFullName;
    organizationEmailAdressGlobal = organizationEmailAdress;
    organizationWebSiteGlobal = organizationWebSite;
    displayedOrganizationTypeGlobal = displayedOrganizationType;

    console.log(
      "Global variable values =>",
      userInfoGlobal.username,
      organizationSubPremiumRoleGlobal,
      organizationSubPremiumTypeGlobal,
      organizationSubPlanTypeFullAccessGlobal,
      organizationSubPlanPriceFullAccessGlobal,
      organizationNameGlobal,
      yourFullNameGlobal,
      organizationEmailAdressGlobal,
      organizationWebSiteGlobal,
      displayedOrganizationTypeGlobal
    );
    // const line_items = [
    //   {
    //     price_data: {
    //       currency: "eur",
    //       product_data: {
    //         name: "Subscribe to Verified Organizations",
    //         description:
    //           organizationSubPlanTypeFullAccess === "Annual Plan"
    //             ? "per year"
    //             : "per month",
    //       },
    //       unit_amount:
    //         organizationSubPlanPriceFullAccess === "€2,261"
    //           ? 226100
    //           : organizationSubPlanPriceFullAccess === "€226.10"
    //           ? 22610
    //           : organizationSubPlanPriceFullAccess === "€11,305"
    //           ? 1130500
    //           : organizationSubPlanPriceFullAccess === "€1,130.50"
    //           ? 113050
    //           : "",
    //     },
    //     quantity: 1,
    //   },
    // ];

    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   mode: "payment",
    //   line_items,

    //   custom_text: {
    //     submit: {
    //       message:
    //         "All payments for Paid Services are final and not refundable or exchangeable, except as required by applicable law. Misuse of Verified Organizations such as fraud, spam, etc., will result in your account’s off-boarding from the program, suspension from Connectify, or other action as Connectify may deem appropriate.",
    //     },
    //     after_submit: {
    //       message:
    //         "By confirming your subscription, you allow Connectify (formerly ?!🧐) to charge you for future payments in accordance with their terms. You can always cancel your subscription.",
    //     },
    //   },

    //   // when working on locally
    //   success_url: "http://localhost:5173/home",
    //   cancel_url: "http://localhost:5173/home",

    //   // when working on deployment version
    //   // success_url: "?",
    //   // cancel_url: "?",
    // });

    // response.send({ url: session.url });
  }
);

// organizational subscriptions finish to check

router.post(
  `/change-subscription-success-modal-status`,
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);

      if (user.successSubscriptionModalShown && user.hasSubscription) {
        console.log("Here 4");

        res.status(500).json({
          success: true,
          message: "Subscription modal has been shown to the user previously.",
        });
      } else if (!user.successSubscriptionModalShown && user.hasSubscription) {
        console.log("Here 3");

        res.status(200).json({
          success: true,
          message: "Subscription modal is now ready to shown to the user.",
        });
        user.successSubscriptionModalShown = true;
        await user.save();
      } else if (!user.successSubscriptionModalShown && !user.hasSubscription) {
        console.log("Here 2");

        return;
      }
    } catch {
      console.log("Here 1");
      res.status(500).json({
        success: true,
        message: "User not found!",
      });
    }
  }
);

module.exports = router;
