const router = require("express").Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_KEY);

router.post(
  "/create-checkout-session",
  authenticateToken,
  async (request, response) => {
    console.log("Request body =>", request.body);
    const subscriptionOption = request.body.subscriptionOption;

    const line_items = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name:
              subscriptionOption.price === "€2,261" ||
              subscriptionOption.price === "€226.10"
                ? "Subscribe to Verified Organizations Starter"
                : subscriptionOption.price === "€11,305" ||
                  subscriptionOption.price === "€1,130.50"
                ? "Subscribe to Verified Organizations"
                : "",
            description: subscriptionOption.description,
          },
          unit_amount:
            subscriptionOption.price === "€2,261"
              ? 226100
              : subscriptionOption.price === "€226.10"
              ? 22610
              : subscriptionOption.price === "€11,305"
              ? 1130500
              : subscriptionOption.price === "€1,130.50"
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
      success_url: "http://localhost:5173/checkout-success",
      cancel_url: "http://localhost:5173/home",

      // when working on deployment version
      // success_url: "https://kiwiscode-canvas.netlify.app/checkout-success",
      // cancel_url: "https://kiwiscode-canvas.netlify.app/carts",
    });

    response.send({ url: session.url });
  }
);

router.get("/checkout-success", authenticateToken, (request, response) => {
  res.send("Checkout successfull !!!");
});

module.exports = router;
