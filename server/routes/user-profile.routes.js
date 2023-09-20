const express = require("express");
const router = express();
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, profileController.handleGetUserProfile);

module.exports = router;
