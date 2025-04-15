const express = require("express");
const router = express();
const subscriptionController = require("../controllers/subscriptionController");
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
const Subscription = require("../models/Subscription.model");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

// global variables start to check
let isVerifyCodeCorrect;
let isPhoneNumberMatch;
let subscriptionProcessError;

let premiumInfoGlobal;
let premiumRoleGlobal;
let verifyPhoneCodeGlobal;
let countryShortCutGlobal;
let countryPhoneCodeGlobal;
let selectedCountryGlobal;
let phoneNumberGlobal;
let resultPhoneNumberGlobal;

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

let individualSubscriptionCanStart;
let organizationBasicSubscriptionCanStart;
let organizationFullAccessSubscriptionCanStart;

let paymentCreatedSuccessfully;

// global variables finish to check

// twilio settings start to check
const { MessagingResponse } = require("twilio").twiml;
// twilio settings finish to check

router.post(
  "/is-phone-verified",
  subscriptionController.handleThisUserPhoneVerified
);

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
      phone_number: phoneNumberGlobal,
      withoutPlusSign: `${countryPhoneCodeGlobal}${phoneNumberGlobal}`.replace(
        /\s+/g,
        ""
      ),
      withPlusSign: `+${countryPhoneCodeGlobal}${phoneNumberGlobal}`.replace(
        /\s+/g,
        ""
      ),
    };
  }
);

// twilio webhook sms verification sırasında qr code ile smsin gönderildiğini anlamak adına
router.post("/sms", async (req, res) => {
  try {
    const twiml = new MessagingResponse();
    const userMessageContent = req.body.Body;
    const userPhoneNumber = req.body.From;

    if (
      userMessageContent === verifyPhoneCodeGlobal &&
      (userPhoneNumber === resultPhoneNumberGlobal.withPlusSign ||
        userPhoneNumber === resultPhoneNumberGlobal.withoutPlusSign)
    ) {
      isVerifyCodeCorrect = true;
      isPhoneNumberMatch = true;
    } else {
      isVerifyCodeCorrect = false;
      isPhoneNumberMatch = false;
    }

    return res.type("text/xml").send(twiml.toString());
  } catch (error) {
    console.error("Error processing Twilio webhook:", error);
    return res.sendStatus(500);
  }
});

router.post("/verify-phone-for-individual-subscription", async (req, res) => {
  try {
    if (isVerifyCodeCorrect && isPhoneNumberMatch) {
      subscriptionProcessError = false;
      individualSubscriptionCanStart = true;
      organizationBasicSubscriptionCanStart = false;
      organizationFullAccessSubscriptionCanStart = false;
      res.status(200).json({
        success: true,
        message: "The user has verified their phone and is ready to subscribe.",
      });
    } else {
      subscriptionProcessError = true;
      individualSubscriptionCanStart = false;
      organizationBasicSubscriptionCanStart = false;
      organizationFullAccessSubscriptionCanStart = false;
      res.status(400).json({
        success: false,
        errorMessage: "Verification code or phone number mismatch error.",
      });
    }
  } catch (error) {
    console.error("Error occured:", error);
    subscriptionProcessError = true;
    individualSubscriptionCanStart = false;
    organizationBasicSubscriptionCanStart = false;
    organizationFullAccessSubscriptionCanStart = false;
    res.status(500).json({
      errorMessage:
        "An error occurred. Subscription process could not be completed.",
    });
  }
});

router.post(
  "/individual-subscribe-checkout",
  authenticateToken,
  async (request, response) => {
    if (individualSubscriptionCanStart) {
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
        success_url: `${process.env.FRONTEND_URL}/home`,
        cancel_url: `${process.env.FRONTEND_URL}/i/premium_sign_up`,

        // when working on deployment version
        // success_url: "?",
        // cancel_url: "?",
      });

      response.send({ url: session.url });
    }
  }
);

// stripe webhook ödemelerin başarıyla gerçekleştiğini anlamak adına
router.post(
  "/subscription/stripe-webhook",
  express.json(),
  async (request, response) => {
    try {
      const event = request.body;
      const userId = premiumInfoGlobal?.user._id || userInfoGlobal?._id;
      const findedUser = await User.findById(userId);

      const premiumRole = premiumInfoGlobal?.premiumRole;

      const activeSubscription = await Subscription.find({
        owner: userId,
        isActive: true,
      });

      const pastSubscription = await Subscription.find({
        owner: userId,
        isActive: false,
        remainingTimeSubscription: { $ne: null },
      });

      if (pastSubscription.length) {
        pastSubscription[0].remainingTimeSubscription = null;
        await pastSubscription[0].save();
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded":
          findedUser.successSubscriptionModalShown = false;
          paymentCreatedSuccessfully = true;

          if (!subscriptionProcessError) {
            if (premiumRole === "Individual") {
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
                findedUser.subscriptions.unshift(
                  createdSubscription._id.toString()
                );
                await findedUser.save();
                isVerifyCodeCorrect = undefined;
                isPhoneNumberMatch = undefined;

                // clean all global variables for every checkout success process start to check
                resultPhoneNumberGlobal = undefined;
                countryShortCutGlobal = undefined;
                countryPhoneCodeGlobal = undefined;
                selectedCountryGlobal = undefined;
                verifyPhoneCodeGlobal = undefined;
                premiumRoleGlobal = undefined;
                premiumInfoGlobal = undefined;
                paymentCreatedSuccessfully = undefined;
                // clean all global variables for every checkout success process finish to check

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
                  if (activeSubscription[0]) {
                    activeSubscription[0].isActive = false;
                    activeSubscription[0].cancelledDate = new Date();
                    await activeSubscription[0].save();
                  } else {
                    return;
                  }

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
                  isVerifyCodeCorrect = undefined;
                  isPhoneNumberMatch = undefined;
                  // clean all global variables for every checkout success process start to check
                  resultPhoneNumberGlobal = undefined;
                  countryShortCutGlobal = undefined;
                  countryPhoneCodeGlobal = undefined;
                  selectedCountryGlobal = undefined;
                  verifyPhoneCodeGlobal = undefined;
                  premiumRoleGlobal = undefined;
                  premiumInfoGlobal = undefined;
                  paymentCreatedSuccessfully = undefined;
                  // clean all global variables for every checkout success process finish to check
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
                      "An error occurred. Subscription process could not be completed. 1",
                  });
                }
              }
            } else if (
              organizationSubPremiumRoleGlobal === "Organization" &&
              organizationSubPremiumTypeGlobal === "Basic"
            ) {
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
                findedUser.subscriptions.unshift(
                  createdSubscription._id.toString()
                );
                await findedUser.save();

                // clean all global variables for every checkout success process start to check
                userInfoGlobal = undefined;
                organizationSubPremiumRoleGlobal = undefined;
                organizationSubPremiumTypeGlobal = undefined;
                organizationSubPlanTypeBasicGlobal = undefined;
                organizationSubPlanPriceBasicGlobal = undefined;
                paymentCreatedSuccessfully = undefined;
                // clean all global variables for every checkout success process finish to check
                response.status(200).json({
                  message: {
                    success: true,
                    message:
                      "Subscription process completed successfully. Thank you!",
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

                  if (activeSubscription[0]) {
                    activeSubscription[0].isActive = false;
                    activeSubscription[0].cancelledDate = new Date();
                    await activeSubscription[0].save();
                  } else {
                    return;
                  }
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

                  findedUser.subscriptions.unshift(
                    createdSubscription._id.toString()
                  );
                  await findedUser.save();

                  // clean all global variables for every checkout success process start to check
                  userInfoGlobal = undefined;
                  organizationSubPremiumRoleGlobal = undefined;
                  organizationSubPremiumTypeGlobal = undefined;
                  organizationSubPlanTypeBasicGlobal = undefined;
                  organizationSubPlanPriceBasicGlobal = undefined;
                  paymentCreatedSuccessfully = undefined;
                  // clean all global variables for every checkout success process finish to check
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
            } else if (
              organizationSubPremiumRoleGlobal === "Organization" &&
              organizationSubPremiumTypeGlobal === "Full Access"
            ) {
              if (!findedUser.hasSubscription) {
                findedUser.hasSubscription = true;

                const createdSubscription = await Subscription.create({
                  owner: findedUser._id.toString(),
                  role: organizationSubPremiumRoleGlobal,
                  subscriptionDetails: {
                    premiumType: organizationSubPremiumTypeGlobal,
                    billingCycle: organizationSubPlanTypeFullAccessGlobal,
                    subscriptionPrice: organizationSubPlanPriceFullAccessGlobal,
                  },
                  isActive: true,
                  organizationDetails: {
                    organizationName: organizationNameGlobal,
                    organizationHandle: findedUser.username,
                    organizationFullName: yourFullNameGlobal,
                    organizationEmailAddress: organizationEmailAdressGlobal,
                    organizationWebSite: organizationWebSiteGlobal,
                    organizationType: displayedOrganizationTypeGlobal,
                  },
                });

                findedUser.subscriptions.unshift(
                  createdSubscription._id.toString()
                );
                await findedUser.save();

                // clean all global variables for every checkout success process start to check
                userInfoGlobal = undefined;
                organizationSubPremiumRoleGlobal = undefined;
                organizationSubPremiumTypeGlobal = undefined;
                organizationSubPlanTypeBasicGlobal = undefined;
                organizationSubPlanPriceBasicGlobal = undefined;
                organizationNameGlobal = undefined;
                yourFullNameGlobal = undefined;
                organizationEmailAdressGlobal = undefined;
                organizationWebSiteGlobal = undefined;
                displayedOrganizationTypeGlobal = undefined;
                paymentCreatedSuccessfully = undefined;
                // clean all global variables for every checkout success process finish to check

                response.status(200).json({
                  message: {
                    success: true,
                    message:
                      "Subscription process completed successfully. Thank you!",
                  },
                });
              } else {
                if (
                  userInfoGlobal &&
                  organizationSubPremiumRoleGlobal &&
                  organizationSubPremiumTypeGlobal &&
                  organizationSubPlanTypeFullAccessGlobal &&
                  organizationSubPlanPriceFullAccessGlobal &&
                  organizationNameGlobal &&
                  yourFullNameGlobal &&
                  organizationEmailAdressGlobal &&
                  organizationWebSiteGlobal &&
                  displayedOrganizationTypeGlobal
                ) {
                  findedUser.successSubscriptionModalShown = false;
                  if (activeSubscription[0]) {
                    activeSubscription[0].isActive = false;
                    activeSubscription[0].cancelledDate = new Date();
                    await activeSubscription[0].save();
                  } else {
                    return;
                  }
                  const createdSubscription = await Subscription.create({
                    owner: findedUser._id.toString(),
                    role: organizationSubPremiumRoleGlobal,
                    subscriptionDetails: {
                      premiumType: organizationSubPremiumTypeGlobal,
                      billingCycle: organizationSubPlanTypeFullAccessGlobal,
                      subscriptionPrice:
                        organizationSubPlanPriceFullAccessGlobal,
                    },
                    isActive: true,
                    organizationDetails: {
                      organizationName: organizationNameGlobal,
                      organizationHandle: findedUser.username,
                      organizationFullName: yourFullNameGlobal,
                      organizationEmailAddress: organizationEmailAdressGlobal,
                      organizationWebSite: organizationWebSiteGlobal,
                      organizationType: displayedOrganizationTypeGlobal,
                    },
                  });
                  findedUser.subscriptions.unshift(
                    createdSubscription._id.toString()
                  );

                  await findedUser.save();
                  // clean all global variables for every checkout success process start to check
                  userInfoGlobal = undefined;
                  organizationSubPremiumRoleGlobal = undefined;
                  organizationSubPremiumTypeGlobal = undefined;
                  organizationSubPlanTypeBasicGlobal = undefined;
                  organizationSubPlanPriceBasicGlobal = undefined;
                  organizationNameGlobal = undefined;
                  yourFullNameGlobal = undefined;
                  organizationEmailAdressGlobal = undefined;
                  organizationWebSiteGlobal = undefined;
                  displayedOrganizationTypeGlobal = undefined;
                  paymentCreatedSuccessfully = undefined;
                  // clean all global variables for every checkout success process finish to check

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
          }

          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      response.status(200).end();
    } catch (error) {
      response.status(500).json({
        errorMessage:
          "An error occurred. Subscription process could not be completed. -1",
      });
    }
  }
);

// organizational subscriptions start to check

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
      success_url: `${process.env.FRONTEND_URL}/home`,
      cancel_url: `${process.env.FRONTEND_URL}/i/verified-orgs-signup`,

      // when working on deployment version
      // success_url: "?",
      // cancel_url: "?",
    });

    response.send({ url: session.url });
  }
);

router.post(
  "/organization-full-access-subscribe-create-checkout-session",
  authenticateToken,
  async (request, response) => {
    organizationFullAccessSubscriptionCanStart = true;
    individualSubscriptionCanStart = false;
    organizationBasicSubscriptionCanStart = false;

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

    const line_items = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Subscribe to Verified Organizations",
            description:
              organizationSubPlanTypeFullAccess === "Annual Plan"
                ? "per year"
                : "per month",
          },
          unit_amount:
            organizationSubPlanPriceFullAccess === "€11,305"
              ? 1130500
              : organizationSubPlanPriceFullAccess === "€1,130.50"
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
      success_url: `${process.env.FRONTEND_URL}/home`,
      cancel_url: `${process.env.FRONTEND_URL}/i/verified-orgs-signup`,

      // when working on deployment version
      // success_url: "?",
      // cancel_url: "?",
    });

    response.send({ url: session.url });
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
        // clean all global variables for every checkout success process start to check
        premiumInfoGlobal = undefined;
        premiumRoleGlobal = undefined;
        verifyPhoneCodeGlobal = undefined;
        countryShortCutGlobal = undefined;
        countryPhoneCodeGlobal = undefined;
        selectedCountryGlobal = undefined;
        phoneNumberGlobal = undefined;
        resultPhoneNumberGlobal = undefined;
        userInfoGlobal = undefined;
        organizationSubPremiumRoleGlobal = undefined;
        organizationSubPremiumTypeGlobal = undefined;
        organizationSubPlanTypeBasicGlobal = undefined;
        organizationSubPlanPriceBasicGlobal = undefined;
        organizationSubPlanTypeFullAccessGlobal = undefined;
        organizationSubPlanPriceFullAccessGlobal = undefined;
        organizationNameGlobal = undefined;
        yourFullNameGlobal = undefined;
        organizationEmailAdressGlobal = undefined;
        organizationWebSiteGlobal = undefined;
        displayedOrganizationTypeGlobal = undefined;
        individualSubscriptionCanStart = undefined;
        organizationBasicSubscriptionCanStart = undefined;
        organizationFullAccessSubscriptionCanStart = undefined;
        // paymentCreatedSuccessfully = undefined;
        // clean all global variables for every checkout success process finish to check
        res.status(500).json({
          success: true,
          message: "Subscription modal has been shown to the user previously.",
        });
      } else if (!user.successSubscriptionModalShown && user.hasSubscription) {
        // clean all global variables for every checkout success process start to check
        premiumInfoGlobal = undefined;
        premiumRoleGlobal = undefined;
        verifyPhoneCodeGlobal = undefined;
        countryShortCutGlobal = undefined;
        countryPhoneCodeGlobal = undefined;
        selectedCountryGlobal = undefined;
        phoneNumberGlobal = undefined;
        resultPhoneNumberGlobal = undefined;
        userInfoGlobal = undefined;
        organizationSubPremiumRoleGlobal = undefined;
        organizationSubPremiumTypeGlobal = undefined;
        organizationSubPlanTypeBasicGlobal = undefined;
        organizationSubPlanPriceBasicGlobal = undefined;
        organizationSubPlanTypeFullAccessGlobal = undefined;
        organizationSubPlanPriceFullAccessGlobal = undefined;
        organizationNameGlobal = undefined;
        yourFullNameGlobal = undefined;
        organizationEmailAdressGlobal = undefined;
        organizationWebSiteGlobal = undefined;
        displayedOrganizationTypeGlobal = undefined;
        individualSubscriptionCanStart = undefined;
        organizationBasicSubscriptionCanStart = undefined;
        organizationFullAccessSubscriptionCanStart = undefined;
        // paymentCreatedSuccessfully = undefined;
        // clean all global variables for every checkout success process finish to check
        res.status(200).json({
          success: true,
          message: "Subscription modal is now ready to shown to the user.",
        });
        user.successSubscriptionModalShown = true;
        await user.save();
      } else if (!user.successSubscriptionModalShown && !user.hasSubscription) {
        // clean all global variables for every checkout success process start to check
        premiumInfoGlobal = undefined;
        premiumRoleGlobal = undefined;
        verifyPhoneCodeGlobal = undefined;
        countryShortCutGlobal = undefined;
        countryPhoneCodeGlobal = undefined;
        selectedCountryGlobal = undefined;
        phoneNumberGlobal = undefined;
        resultPhoneNumberGlobal = undefined;
        userInfoGlobal = undefined;
        organizationSubPremiumRoleGlobal = undefined;
        organizationSubPremiumTypeGlobal = undefined;
        organizationSubPlanTypeBasicGlobal = undefined;
        organizationSubPlanPriceBasicGlobal = undefined;
        organizationSubPlanTypeFullAccessGlobal = undefined;
        organizationSubPlanPriceFullAccessGlobal = undefined;
        organizationNameGlobal = undefined;
        yourFullNameGlobal = undefined;
        organizationEmailAdressGlobal = undefined;
        organizationWebSiteGlobal = undefined;
        displayedOrganizationTypeGlobal = undefined;
        individualSubscriptionCanStart = undefined;
        organizationBasicSubscriptionCanStart = undefined;
        organizationFullAccessSubscriptionCanStart = undefined;
        // paymentCreatedSuccessfully = undefined;
        // clean all global variables for every checkout success process finish to check

        res.status(404).json({
          success: false,
          message:
            "User does not have a subscription, therefore a modal cannot be shown.",
        });
      } else {
        res.status(501).json({
          success: true,
          message: "Error occured!",
        });
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
