const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.handleSignup);
router.get("/verify", authController.handleEmailverify);
router.post("/login", authController.handleLogin);
router.post(
  "/deactivate-user-back",
  authController.handleDeactivatedUserLoginBack
);

module.exports = router;
