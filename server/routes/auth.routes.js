const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
router.post("/email-check", authController.handleEmailCheck);

router.post(
  "/send-email-verification-code",
  authController.handleEmailVerificationCode
);
router.post("/signup", authController.handleSignup);
router.post("/login", authController.handleLogin);
router.post(
  "/deactivate-user-back",
  authController.handleDeactivatedUserLoginBack
);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173",
    failureRedirect: "/auth/login/failed",
  })
);

module.exports = router;
