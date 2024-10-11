const Chat = require("../models/Chat.model");
const User = require("../models/User.model");

const handleDeleteMessage = (req, res) => {
  const { receivedMessageRoom } = req.body;
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
      const userMessages = [...user.messages];

      const findedMessageRoom = userMessages.find((eachRoom) => {
        return eachRoom.room === receivedMessageRoom.room;
      });

      const findIndexOfFindedMessageRoom =
        userMessages.indexOf(findedMessageRoom);

      //   userMessages.splice(findIndexOfFindedMessageRoom, 1);

      userMessages[findIndexOfFindedMessageRoom].chat = [];

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

const handleMarkAsReadMessage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { messageRoomId } = req.body;
    const [userId1, userId2] = messageRoomId.split("-");

    const userIdToSearch = userId === userId1 ? userId1 : userId2;

    const user = await User.findById(userIdToSearch);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const message = user.messages.find((msg) => msg.room === messageRoomId);
    if (!message) {
      return res.status(404).send("Message not found in user's messages");
    }

    message.readed = true;

    await user.save();

    res.status(200).send("Message marked as read");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
};

const handleCreateChatRoom = async (req, res) => {
  const { roomId } = req.body;
  const [userId1, userId2] = roomId.split("-");

  const roomIdArray = [userId1, userId2];

  try {
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      return res.status(404).send("One or both users not found");
    }

    const user1RoomExists = user1.messages.some(
      (message) =>
        message.room === roomIdArray.join("-") ||
        roomIdArray.reverse().join("-")
    );
    const user2RoomExists = user2.messages.some(
      (message) =>
        message.room === roomIdArray.join("-") ||
        roomIdArray.reverse().join("-")
    );

    if (user1RoomExists || user2RoomExists) {
      return res.status(400).send("Chat room already exists");
    }

    // Oda yoksa, her iki kullanıcının messages dizisine ekle
    user1.messages.push({
      room: roomId,
      members: [user1._id, user2._id],
      readed: false,
      deactivatedMember: false,
    });

    user2.messages.push({
      room: roomId,
      members: [user1._id, user2._id],
      readed: false,
      deactivatedMember: false,
    });

    // Değişiklikleri kaydet
    await user1.save();
    await user2.save();

    // Başarılı yanıt döndür
    res.status(201).json(`Chat room created: ${roomId}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
};

const handleAddMessageToRoom = async (req, res) => {
  try {
    const { messageData } = req.body;
    const { chatRoomId } = req.params;
    const [userId1, userId2] = chatRoomId.split("-");
    const roomIdArray = [userId1, userId2];

    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      return res.status(404).send("One or both users not found.");
    }

    const chatRoomIndexForUser1 = user1.messages.findIndex(
      (room) =>
        room.room === roomIdArray.join("-") || roomIdArray.reverse().join("-")
    );
    const chatRoomIndexForUser2 = user2.messages.findIndex(
      (room) =>
        room.room === roomIdArray.join("-") || roomIdArray.reverse().join("-")
    );

    if (chatRoomIndexForUser1 === -1 || chatRoomIndexForUser2 === -1) {
      return res.status(404).send("Chat room not found for one or both users.");
    }

    await Chat.create({
      messages: [
        {
          sender: messageData.sender,
          text: messageData.text,
          timestamp: messageData.time,
        },
      ],
      membersOfChat: [userId1, userId2],
    });

    user1.messages[chatRoomIndexForUser1].chat.push({
      sender: messageData.sender,
      text: messageData.text,
      timestamp: messageData.time,
    });

    user2.messages[chatRoomIndexForUser2].chat.push({
      sender: messageData.sender,
      text: messageData.text,
      timestamp: messageData.time,
    });

    await user1.save();
    await user2.save();

    res.status(200).json({ chats: user1.messages[chatRoomIndexForUser1].chat });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
};

const handleGetChat = async (req, res) => {
  const { chatRoomId } = req.params;
  const [userId1, userId2] = chatRoomId.split("-");

  const roomIdArray = [userId1, userId2];

  try {
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      return res.status(404).send("One or both users not found");
    }

    const user1RoomExists = user1.messages.some(
      (message) =>
        message.room === roomIdArray.join("-") ||
        roomIdArray.reverse().join("-")
    );
    const user2RoomExists = user2.messages.some(
      (message) =>
        message.room === roomIdArray.join("-") ||
        roomIdArray.reverse().join("-")
    );

    if (!user1RoomExists || !user2RoomExists) {
      return res.status(404).send("One or both users does not have this room");
    }

    // Kullanıcının messages'ını filtrele ve odayı bul
    const user1Messages = user1.messages.filter(
      (message) =>
        message.room === roomIdArray.join("-") ||
        message.room === roomIdArray.reverse().join("-")
    )[0];

    // Odaya ait mesajları JSON olarak döndür
    res.status(200).json({ chatRoomId, messages: user1Messages });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  handleDeleteMessage,
  handleMarkAsReadMessage,
  handleCreateChatRoom,
  handleAddMessageToRoom,
  handleGetChat,
};
