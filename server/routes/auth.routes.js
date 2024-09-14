const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

router.post("/email-check", authController.handleEmailCheck);

router.post(
  "/send-email-verification-code",
  authController.handleEmailVerificationCode
);

router.post("/signup", authController.handleSignup);
router.post("/login", authController.handleLogin);
router.post("/login-variant-one", authController.handleLoginVariantOne);

let isVariantOneResultRouteSuccess = false;

router.post("/login-variant-one-result", (req, res) => {
  const { authentication } = req.body;
  isVariantOneResultRouteSuccess = true;
  console.log("Authentication login variant one result =>", authentication);
  console.log(
    "Variant one route akıbeti result route içerisi =>",
    isVariantOneResultRouteSuccess
  );

  const userFirstInfoFromStepOne = authentication.multi_factor_authentication;

  const passwordFromReqBody = authentication.password;
  User.findOne({
    $or: [
      { email: userFirstInfoFromStepOne },
      { username: userFirstInfoFromStepOne },
      {
        phoneNumber: {
          $elemMatch: {
            phone_number: userFirstInfoFromStepOne,
          },
        },
      },
      {
        phoneNumber: {
          $elemMatch: {
            withoutPlusSign: userFirstInfoFromStepOne,
          },
        },
      },
      {
        phoneNumber: {
          $elemMatch: {
            withPlusSign: userFirstInfoFromStepOne,
          },
        },
      },
    ],
  })
    // today changed 13 nov
    .populate("posts")
    // today changed 13 nov
    .populate("followers")
    .populate("following")
    .populate("favorites")
    .populate("subscriptions")
    .populate("messages")

    .then((user) => {
      console.log("User =>", user.username);
      console.log("User password =>", passwordFromReqBody);
      bcrypt
        .compare(passwordFromReqBody, user.password)
        .then((result) => {
          console.log("Result =>", result);
          if (!result) {
            res.status(501).json({ errorMessage: "Wrong password!" });
          } else {
            if (user.isDeactivated) {
              console.log("Deactivated user is here !");
              res.status(400).json({
                errorMessage: "Deactivated user!",
                user: user,
              });
            } else {
              user.active = true;
              user.save().then((user) => {
                const {
                  _id,
                  username,
                  email,
                  fullname,
                  verified,
                  active,
                  posts,
                  followers,
                  following,
                  messages,
                  createdAt,
                  updatedAt,
                  favorites,
                  imageUrl,
                  notifications,
                  signedUpWithGoogle,
                  signedUpWithVariantOne,
                  bio,
                } = user;

                const token = jwt.sign(
                  { userId: _id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "7d",
                  }
                );

                console.log("Logged in user username =>", username);
                res.status(201).json({
                  token,
                  user: {
                    _id,
                    username,
                    email,
                    fullname,
                    verified,
                    active,
                    posts,
                    followers,
                    following,
                    messages,
                    createdAt,
                    updatedAt,
                    favorites,
                    imageUrl,
                    notifications,
                    signedUpWithGoogle,
                    signedUpWithVariantOne,
                    bio,
                  },
                  message:
                    "Show 2 modal, first => profile image customization modal, second => username customization modal",
                });
              });
            }
          }
        })
        .catch((error) => {
          console.log("Error =>", error);
        });
    })
    .catch((error) => {
      console.log("Error =>", error);
    });
});

router.post("/logout", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  isVariantOneResultRouteSuccess = false;

  console.log("Req cookies =>", req.session);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.userId;
    User.findByIdAndUpdate(userId, {
      active: false,
      hasPhoneVerifiedForAccountInformationDetail: false,
    })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.status(500).json({ message: "Error updating user" });
      });
  });
});

router.post(
  "/deactivate-user-back",
  authController.handleDeactivatedUserLoginBack
);

router.post("/username-check", authController.handleUsernameCheck);
router.post("/phone-number-check", authController.handlePhoneNumberCheck);
router.post("/password-check", authController.handleUserPasswordCheck);
router.post("/change-username", authController.handleUsernameChange);

router.post(
  "/change-modal-status",
  authController.handleChangeModalStatusVariantOne
);
router.post(
  "/change-modal-status-modal-2",
  authController.handleChangeModalStatusVariantOneModal2
);
// google authentication start to check
router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "http://localhost:5173/home",
    failureRedirect: "/auth/google-login/failed",
  })
);

const handleLoginSuccess = (req, res, next) => {
  if (!isVariantOneResultRouteSuccess) {
    if (req.user) {
      // when working on local version
      // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      res.setHeader("Access-Control-Allow-Origin", "*");

      // when working on deployment version
      // ??
      res.setHeader("Access-Control-Allow-Credentials", "true");
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      req.session.user = req.user;
      res.status(200).json({
        error: false,
        message: "Successfully Loged In",
        user: req.user,
        token: token,
      });
    } else {
      res.status(403).json({ error: true, message: "Not Authorized" });
    }
  } else {
    console.log(
      "You cannot run because user already logged in by using variant one !"
    );
    res.status(403).json({
      error: true,
      message:
        "You cannot run because user already logged in by using variant one !",
    });
  }
};

router.get("/login-success", handleLoginSuccess);

router.get("/login-failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google-logout", (req, res) => {
  req.logout();

  console.log("logged out!");
  res
    .status(201)
    .json({ message: "User logged out from his/her google account !!!" });
});

// google authentication finish to check
module.exports = router;
