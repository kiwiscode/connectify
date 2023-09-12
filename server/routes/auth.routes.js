const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.handleSignup);
router.get("/verify", authController.handleEmailverify);
router.post("/login", authController.handleLogin);

module.exports = router;
