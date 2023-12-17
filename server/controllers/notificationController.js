const User = require("../models/User.model");

const getAllNotifications = (req, res) => {
  const { userId } = req.user;

  console.log(userId);
  User.findById(userId)
    .populate({
      path: "notifications.notificationReceiver",
      model: "User",
    })
    .populate({
      path: "notifications.post",
      model: "Post",
    })
    .then((user) => {
      user.notifications.sort((a, b) => b.createdAt - a.createdAt);

      res.json(user);
    })
    .catch(() => {
      res.json({ errorMessage: "User not found!" });
    });
};

module.exports = {
  getAllNotifications,
};
