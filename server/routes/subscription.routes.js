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
      phoneNumberGlobal,
      resultPhoneNumberGlobal
    );
    console.log("Şu anda buradayız !!!");
  }
);

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
        success_url: "http://localhost:5173/home",
        cancel_url: "http://localhost:5173/i/premium_sign_up",

        // when working on deployment version
        // success_url: "?",
        // cancel_url: "?",
      });

      response.send({ url: session.url });
    }
  }
);

router.post("/stripe-webhook", express.json(), async (request, response) => {
  try {
    const event = request.body;
    console.log("User info =>", userInfoGlobal, premiumInfoGlobal);
    const userId = premiumInfoGlobal?.user._id || userInfoGlobal?._id;
    const findedUser = await User.findById(userId);
    console.log("Got payload ", JSON.stringify(event, null, 2));

    console.log(
      "Premium role for individual in general =>",
      premiumInfoGlobal?.premiumRole
    );
    console.log(
      "Premium role organization basic =>",
      organizationSubPremiumRoleGlobal,
      organizationSubPremiumTypeGlobal
    );
    console.log(
      "Premium role organization full access =>",
      organizationSubPremiumRoleGlobal,
      organizationSubPremiumTypeGlobal
    );

    const premiumRole = premiumInfoGlobal?.premiumRole;

    const activeSubscription = await Subscription.find({
      owner: userId,
      isActive: true,
    });
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        findedUser.successSubscriptionModalShown = false;
        paymentCreatedSuccessfully = true;

        if (!subscriptionProcessError) {
          if (premiumRole === "Individual") {
            console.log("Individual subscription processing !");
            if (!findedUser.hasSubscription) {
              console.log("Buradaki condition çalışıyor şu anda !");
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
              console.log("Buradaki condition çalışıyor şu anda 2 !");
              console.log(
                resultPhoneNumberGlobal,
                countryShortCutGlobal,
                countryPhoneCodeGlobal,
                selectedCountryGlobal,
                verifyPhoneCodeGlobal,
                premiumRoleGlobal,
                premiumInfoGlobal.premiumType,
                premiumInfoGlobal.planType,
                premiumInfoGlobal.planPrice
              );
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
                console.log("And now we are here after condition !!!");
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
            console.log(
              "Organization basic type subscription ready to process"
            );
            if (!findedUser.hasSubscription) {
              findedUser.hasSubscription = true;
              console.log("We are here right now first if condition !!!");

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
                console.log(
                  "We are here right now if condition from else condition for parent if statement !!!"
                );

                console.log(
                  "Info for creating subscription =>",
                  organizationSubPremiumRoleGlobal,
                  organizationSubPremiumTypeGlobal,
                  organizationSubPlanTypeBasicGlobal,
                  organizationSubPlanPriceBasicGlobal
                );
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

                console.log(
                  "Created subscription collection =>",
                  createdSubscription
                );
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
            console.log(
              "Organization full access type subscription ready to process"
            );
            if (!findedUser.hasSubscription) {
              findedUser.hasSubscription = true;
              console.log(
                "Global variable values inside organization full access subscription first condition =>",
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

              console.log(
                "Created subscription with organization info =>",
                createdSubscription
              );
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
                console.log(
                  "Global variable values inside organization full access subscription second condition =>",
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
                console.log(
                  "Created subscription with organization info =>",
                  createdSubscription
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
        } else {
          console.log("Buradaki condition çalışıyor şu anda 3 !");
        }

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    response.status(200).end();
  } catch (error) {
    console.log("Buradaki durum çalışıyor şu anda stripe-webhook içerisi !");
    response.status(500).json({
      errorMessage:
        "An error occurred. Subscription process could not be completed. -1",
    });
  }
});

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

    console.log("Burası çalışıyor şu an !");

    userInfoGlobal = userInfo;
    organizationSubPremiumRoleGlobal = organizationSubPremiumRole;
    organizationSubPremiumTypeGlobal = organizationSubPremiumType;
    organizationSubPlanTypeBasicGlobal = organizationSubPlanTypeBasic;
    organizationSubPlanPriceBasicGlobal = organizationSubPlanPriceBasic;

    console.log(
      "organization sub plan type basic global =>",
      organizationSubPlanTypeBasicGlobal
    );
    console.log(
      "organization sub plan price basic global =>",
      organizationSubPlanPriceBasicGlobal
    );

    console.log(
      "Global variable values =>",
      userInfoGlobal.username,
      userInfoGlobal._id,
      "organizationSubPremiumRoleGlobal =>",
      organizationSubPremiumRoleGlobal,
      "organizationSubPremiumTypeGlobal =>",
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
      cancel_url: "http://localhost:5173/i/verified-orgs-signup",

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

    console.log("organizationSubPremiumRole =>", organizationSubPremiumRole);
    console.log("organizationSubPremiumType =>", organizationSubPremiumType);

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
      success_url: "http://localhost:5173/home",
      cancel_url: "http://localhost:5173/i/verified-orgs-signup",

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
        console.log("Here 3");
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
        console.log(
          "User does not have a subscription, therefore a modal cannot be shown."
        );
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
      console.log("Here 1");
      res.status(500).json({
        success: true,
        message: "User not found!",
      });
    }
  }
);

module.exports = router;
