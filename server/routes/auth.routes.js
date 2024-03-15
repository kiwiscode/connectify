const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
router.post("/email-check", authController.handleEmailCheck);

router.post(
  "/send-email-verification-code",
  authController.handleEmailVerificationCode
);
router.post("/signup", authController.handleSignup);
router.post("/login", authController.handleLogin);
router.post("/login-variant-one", authController.handleLoginVariantOne);

router.post(
  "/deactivate-user-back",
  authController.handleDeactivatedUserLoginBack
);

router.post("/username-check", authController.handleUsernameCheck);
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

router.get("/login-success", (req, res) => {
  console.log("req =>", req.user);
  if (req.user) {
    // when working on local version
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    // when working on deployment version
    // ??
    res.setHeader("Access-Control-Allow-Credentials", "true");
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
      token: token,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login-failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});
// google authentication finish to check

module.exports = router;
