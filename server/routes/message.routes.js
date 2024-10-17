const router = require("express").Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const messageController = require("../controllers/messageController");
const User = require("../models/User.model");

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
  "/chatrooms/create",
  authenticateToken,
  messageController.handleCreateChatRoom
);

router.post(
  "/messages/:chatRoomId",
  authenticateToken,
  messageController.handleAddMessageToRoom
);

router.get(
  "/messages/:chatRoomId",
  authenticateToken,
  messageController.handleGetChat
);

router.get(
  "/users/:userId/messages/unread",
  authenticateToken,
  messageController.getUnreadMessages
);

router.get("/all-users", authenticateToken, (req, res) => {
  User.find()
    .then((allUsersFromDB) => {
      res.status(200).json(allUsersFromDB);
    })
    .catch((error) => {
      res.status(500).json({ errorMessage: error });
    });
});

router.get("/all-messages", authenticateToken, (req, res) => {
  const { userId } = req.user;

  User.findById(userId)
    .populate("messages")
    .populate({
      path: "messages",
      populate: {
        path: "members",
        model: "User",
      },
    })
    .populate({
      path: "messages",
      populate: {
        path: "chat.sender",
        model: "User",
      },
    })
    .then((user) => {
      res.status(200).json({ messages: user.messages });
    })
    .catch((error) => {
      console.error("Error =>", error);
      return res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
