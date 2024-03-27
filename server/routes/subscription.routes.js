const express = require("express");
const router = express();
const subscriptionController = require("../controllers/subscriptionController");
const authenticateToken = require("../middleware/jwtMiddleware");
router.post(
  "/is-phone-verified",
  subscriptionController.handleThisUserPhoneVerified
);

module.exports = router;
