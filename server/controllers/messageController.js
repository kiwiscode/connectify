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
      console.log("Finded user =>", user.username);

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

module.exports = {
  handleDeleteMessage,
};
