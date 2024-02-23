const router = require("express").Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const messageController = require("../controllers/messageController");

router.post(
  "/delete-message",
  authenticateToken,
  messageController.handleDeleteMessage
);

module.exports = router;
