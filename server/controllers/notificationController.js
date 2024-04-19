const User = require("../models/User.model");

const getUnreadNotifications = (req, res) => {
  const { userId } = req.user;

  console.log("Get all notifications from this user id =>", userId);
  User.findById(userId)
    .then((user) => {
      console.log("Here !!!");
      const filteredUnReadNotifications = user.notifications.filter(
        (eachNotification) => {
          return eachNotification.isReaded === false;
        }
      );

      console.log(
        "Filtered unread notifications =>",
        filteredUnReadNotifications
      );
      const sortedNotifications = filteredUnReadNotifications.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      console.log("We are here now !!!", sortedNotifications);

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

    await User.updateOne(
      { _id: userId },
      { $set: { "notifications.$[].isReaded": true } }
    );

    console.log("Finded user =>", user.username);
  } catch {}
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
      });

    const sortedNotifications = user.notifications.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.json({ allNotifications: sortedNotifications });
  } catch {
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
