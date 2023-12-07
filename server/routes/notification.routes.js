const express = require("express");
const router = express();
const notificationController = require("../controllers/notificationController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, notificationController.getAllNotifications);

module.exports = router;
