const User = require("../models/User.model");

const handleDeleteMessage = (req, res) => {
  const { receivedMessageRoom } = req.body;
  const { userId } = req.user;

  console.log(
    "Received message room from client request =>",
    receivedMessageRoom.room
  );

  console.log(`User id ${userId} waiting for response ...`);

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
      const userMessages = [...user.messages];

      const findedMessageRoom = userMessages.find((eachRoom) => {
        return eachRoom.room === receivedMessageRoom.room;
      });

      const findIndexOfFindedMessageRoom =
        userMessages.indexOf(findedMessageRoom);

      //   userMessages.splice(findIndexOfFindedMessageRoom, 1);

      console.log(
        "Old message room chat =>",
        userMessages[findIndexOfFindedMessageRoom].chat
      );
      userMessages[findIndexOfFindedMessageRoom].chat = [];

      console.log(
        "Current message room chat =>",
        userMessages[findIndexOfFindedMessageRoom].chat
      );

      user.messages[findIndexOfFindedMessageRoom].chat = [];

      return user
        .save()
        .then(() => {
          res.status(201).json({
            message: `Message room deleted from ${userId}.messages array`,
            currentMessagesArray: user.messages,
          });
        })
        .catch(() => {
          res.status(500).json({
            errorMessage: "Error occured while trying to save the user !",
          });
        });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found!" });
    });
};

const handleMarkAsReadMessage = (req, res) => {
  const { messageRoom } = req.body;
  const { userId } = req.user;

  console.log("Message room name =>", messageRoom);

  // User.findById(userId)
  //   .then((findedUser) => {
  //     const findedRoom = findedUser.messages.find((eachMessageRoom) => {
  //       return eachMessageRoom.room === messageRoom;
  //     });

  //     const roomIndex = findedUser.messages.indexOf(findedRoom);

  //     const updateQuery = {
  //       $set: {
  //         [`messages.${roomIndex}.readed`]: true,
  //       },
  //     };

  //     User.updateOne({ _id: userId }, updateQuery)
  //       .then(() => {
  //         res.status(200).json({ message: "Messages readed" });
  //       })
  //       .catch((error) => {
  //         console.error("Error occurred:", error);
  //         res.status(500).json({ error: "An error occurred" });
  //       });
  //   })
  //   .catch((error) => {
  //     console.error("Error occurred:", error);
  //     res.status(500).json({ error: "An error occurred" });
  //   });
};

const handleMarkAsUnReadMessage = (req, res) => {
  const { messageRoom } = req.body;
  const { userId } = req.user;

  User.find({ "messages.room": messageRoom })
    .then((users) => {
      if (!users.length) {
        console.log("User not found.");
        return res.status(404).json({ error: "User not found." });
      }

      const findedSender = users.find((eachUser) => {
        return eachUser._id.toString() === userId;
      });
      const findedReceiver = users.find((eachUser) => {
        return eachUser._id.toString() !== userId;
      });

      const senderRoom = findedSender.messages.find(
        (message) => message.room === messageRoom
      );
      const receiverRoom = findedReceiver.messages.find(
        (message) => message.room === messageRoom
      );

      senderRoom.readed = true;
      receiverRoom.readed = false;

      const senderUpdatePromise = User.updateOne(
        { _id: findedSender._id, "messages.room": messageRoom },
        { $set: { "messages.$.readed": true } }
      );

      const receiverUpdatePromise = User.updateOne(
        { _id: findedReceiver._id, "messages.room": messageRoom },
        { $set: { "messages.$.readed": false } }
      );

      return Promise.all([senderUpdatePromise, receiverUpdatePromise]);
    })
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Messages marked as unread." });
    })
    .catch((err) => {
      console.error("Error marking messages as unread:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
  handleDeleteMessage,
  handleMarkAsReadMessage,
  handleMarkAsUnReadMessage,
};
