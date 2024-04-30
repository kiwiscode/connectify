const router = require("express").Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const messageController = require("../controllers/messageController");

router.post(
  "/delete-message",
  authenticateToken,
  messageController.handleDeleteMessage
);

router.post(
  "/mark-as-read-message",
  authenticateToken,
  messageController.handleMarkAsReadMessage
);

router.post(
  "/mark-as-un-read-message",
  authenticateToken,
  messageController.handleMarkAsUnReadMessage
);

module.exports = router;
