const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/jwtMiddleware");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
let isVariantOneResultRouteSuccess = false;

router.post("/email-check", authController.handleEmailCheck);

router.post(
  "/send-email-verification-code",
  authController.handleEmailVerificationCode
);

router.post("/signup", authController.handleSignup);
router.post("/login", authController.handleLogin);
router.post("/login-variant-one", authController.handleLoginVariantOne);
router.post(
  "/login-variant-one-result",
  authController.handleLoginVariantOneResult
);
router.post("/logout", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  isVariantOneResultRouteSuccess = false;

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
        req.logout(() => {
          res.redirect("/");
        });
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

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect(`${process.env.FRONTEND_URL}/`);

    req.logIn(user, (err) => {
      if (err) return next(err);

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.redirect(
        `${process.env.FRONTEND_URL}/home?token=${token}&user=${JSON.stringify(
          user
        )}`
      );
    });
  })(req, res, next);
});

// google authentication finish to check

module.exports = router;
