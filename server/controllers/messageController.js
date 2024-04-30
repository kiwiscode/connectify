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

const handleMarkAsReadMessage = (req, res) => {
  const { messageRoom } = req.body;
  const { userId } = req.user;

  const messageRoomName = messageRoom.room;

  User.findById(userId)
    .then((findedUser) => {
      console.log("Finded user =>", findedUser.username);
      const findedRoom = findedUser.messages.find((eachMessageRoom) => {
        return eachMessageRoom.room === messageRoomName;
      });

      const roomIndex = findedUser.messages.indexOf(findedRoom);
      console.log("Finded room =>", findedRoom);
      console.log("Finded room index =>", roomIndex);

      findedUser.messages[roomIndex].readed = true;
      findedUser
        .save()
        .then(() => {
          res.status(200).json({ message: "Messages readed" });
        })
        .catch((error) => {
          console.error("Error occured:", error);
          res.status(500).json({ error: "An error occured" });
        });
    })
    .catch((error) => {
      console.error("Error occured:", error);
      res.status(500).json({ error: "An error occured" });
    });
};

const handleMarkAsUnReadMessage = (req, res) => {
  const { messageRoom } = req.body;
  const { userId } = req.user;

  User.findOne({ "messages.room": messageRoom })
    .then((user) => {
      if (!user) {
        console.log("User not found.");
        return res.status(404).json({ error: "User not found." });
      }

      console.log("Found user:", user);

      const otherUser = user.messages.find(
        (message) => message.room === messageRoom
      );

      if (!otherUser) {
        console.log("Other user not found.");
        return res.status(404).json({ error: "Other user not found." });
      }

      console.log("Other user:", otherUser);

      const updateQuery = {
        $set: {
          "messages.$[elem].readed": false,
        },
      };

      const options = {
        arrayFilters: [{ "elem.room": messageRoom }],
      };

      return User.updateOne({ _id: user._id }, updateQuery, options);
    })
    .then((result) => {
      console.log("Result =>", result);
      if (result.modifiedCount > 0) {
        console.log("User successfully saved.");
        res.status(200).json({ message: "User successfully saved." });
      } else {
        console.log("No changes made to user.");
        res.status(200).json({ message: "No changes made to user." });
      }
    })
    .catch((error) => {
      console.error("An error occured:", error);
      res.status(500).json({ error: "An error occured." });
    });
};

module.exports = {
  handleDeleteMessage,
  handleMarkAsReadMessage,
  handleMarkAsUnReadMessage,
};
