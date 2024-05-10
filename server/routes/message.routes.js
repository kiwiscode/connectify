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
  "/mark-as-un-read-message",
  authenticateToken,
  messageController.handleMarkAsUnReadMessage
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
        path: "chat",
        model: "Chat",
      },
    })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log("Error =>", error);
    });
});

module.exports = router;
