const User = require("../models/User.model");

const getUnreadNotifications = (req, res) => {
  const { userId } = req.user;

  User.findById(userId)
    .then((user) => {
      const filteredUnReadNotifications = user.notifications.filter(
        (eachNotification) => {
          return eachNotification.isReaded === false;
        }
      );

      const sortedNotifications = filteredUnReadNotifications.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      res.json({ unReadNotifications: filteredUnReadNotifications });
    })
    .catch(() => {
      res.json({ errorMessage: "User not found!" });
    });
};

const readAllNotifications = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.updateOne(
      { _id: userId },
      { $set: { "notifications.$[].isReaded": true } }
    );

    return res
      .status(200)
      .json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId)
      .populate({
        path: "notifications", // Kullanıcının notifications alanını doldur
        populate: {
          path: "post", // Notification içindeki post alanını doldur
        },
      })
      .populate({
        path: "notifications", // Kullanıcının notifications alanını doldur
        populate: [
          {
            path: "notificationReceiver", // Notification içindeki notificationReceiver alanını doldur
          },
          {
            path: "notificationSender", // Notification içindeki notificationSender alanını doldur
          },
        ],
      })
      .populate({
        path: "notifications",
        populate: {
          path: "post",
          populate: {
            path: "userId",
          },
        },
      })
      .populate({
        path: "notifications",
        populate: [
          {
            path: "isComment.commentPostId",
            populate: [
              { path: "userId" },
              { path: "reposted" },
              { path: "likes" },
            ],
          },
        ],
      });

    const sortedNotifications = user.notifications.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.json({ allNotifications: sortedNotifications });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({
      success: false,
      message: "Error occured while fetching all notifications!",
    });
  }
};
module.exports = {
  getUnreadNotifications,
  readAllNotifications,
  getAllNotifications,
};
