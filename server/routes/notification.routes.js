const express = require("express");
const router = express();
const notificationController = require("../controllers/notificationController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get(
  "/unread-notifications",
  authenticateToken,
  notificationController.getUnreadNotifications
);

router.post(
  "/mark-as-read",
  authenticateToken,
  notificationController.readAllNotifications
);

router.get(
  "/all-notifications",
  authenticateToken,
  notificationController.getAllNotifications
);

module.exports = router;
