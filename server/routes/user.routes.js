const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");

// test route for deployment test
router.get("/hi", async (req, res) => {
  try {
    res.send("Hi user !");
  } catch (error) {
    console.error("Internal server error.", error);
  }
});

router.get("/:userId/following", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("following");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ following: user.following });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 1. Gönderilen takip isteklerini al
router.get(
  "/:userId/sent-follow-requests",
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select(
        "sentFollowRequests"
      );
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user.sentFollowRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// 2. Alınan takip isteklerini al
router.get(
  "/:userId/received-follow-requests",
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId)
        .populate("following")
        .populate("followers")
        .populate({
          path: "receivedFollowRequests",
          populate: {
            path: "requester",
            model: "User",
          },
        });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// 3. Takip isteği gönder
router.post("/:userId/send-follow-request", async (req, res) => {
  const { recipientId } = req.body;
  try {
    const sender = await User.findById(req.params.userId);
    const recipient = await User.findById(recipientId);

    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    if (
      recipient.followers.some(
        (follower) => follower._id.toString() === req.params.userId
      )
    ) {
      return res
        .status(400)
        .json({ error: "Sender is already a follower of the recipient" });
    }

    // Gönderen kullanıcının sentFollowRequests alanına yeni isteği ekle
    sender.sentFollowRequests.push({
      recipient: recipientId,
      status: "pending",
    });

    // Alıcının receivedFollowRequests alanına yeni isteği ekle
    recipient.receivedFollowRequests.push({
      requester: req.params.userId,
      status: "pending",
    });

    // Her iki kullanıcıyı da kaydet
    await sender.save();
    await recipient.save();

    res.status(201).json({ message: "Follow request sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 4. Takip isteğini güncelleme (örneğin, kabul etme veya reddetme)

// cancel
router.post(
  "/:userId/cancel-follow-request/:requestId",
  authenticateToken,
  async (req, res) => {
    const { userId, requestId } = req.params;
    try {
      // 1. Adım: Requester'i bul
      const requester = await User.findById(userId);
      if (!requester) {
        return res.status(404).json({ error: "Requester not found" });
      }

      // Requester'in sentFollowRequests arrayinde requestId ile eşleşen isteği bul
      const followRequestIndex = requester.sentFollowRequests.findIndex(
        (request) => request._id.toString() === requestId
      );

      if (followRequestIndex === -1) {
        return res.status(404).json({ error: "Follow request not found" });
      }

      const recipientId =
        requester.sentFollowRequests[
          followRequestIndex
        ].recipient._id.toString();

      // Follow isteğini sentFollowRequests arrayinden çıkar
      requester.sentFollowRequests.splice(followRequestIndex, 1);

      // 2. Adım: Alıcı (recipient) kullanıcısını bul
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ error: "Sender not found" });
      }

      // Recipient'in receivedFollowRequests arrayinde requesterId (userId) ile eşleşen isteği bul
      const recivedRequestIndex = recipient.receivedFollowRequests.findIndex(
        (request) => request.requester.toString() === userId
      );

      if (recivedRequestIndex === -1) {
        return res.status(404).json({ error: "Sent follow request not found" });
      }

      // Follow isteğini sentFollowRequests arrayinden çıkar
      recipient.receivedFollowRequests.splice(recivedRequestIndex, 1);

      // Hem recipient hem de sender'ı kaydet
      await requester.save();
      await recipient.save();

      res
        .status(200)
        .json({ message: "Follow request accepted and followers updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
// accept
router.post(
  "/:userId/accept-follow-request/:requestId",
  authenticateToken,
  async (req, res) => {
    const { userId, requestId } = req.params;
    try {
      // 1. Adım: Recipient'i bul
      const recipient = await User.findById(userId);
      if (!recipient) {
        return res.status(404).json({ error: "Recipient not found" });
      }

      // Recipient'in receivedFollowRequests arrayinde requesterId ile eşleşen isteği bul
      const followRequestIndex = recipient.receivedFollowRequests.findIndex(
        (request) => request._id.toString() === requestId
      );

      if (followRequestIndex === -1) {
        return res.status(404).json({ error: "Follow request not found" });
      }

      const requesterId =
        recipient.receivedFollowRequests[
          followRequestIndex
        ].requester._id.toString();

      // Follow isteğini receivedFollowRequests arrayinden çıkar
      recipient.receivedFollowRequests.splice(followRequestIndex, 1);

      // Requester'ı followers arrayine ekle
      recipient.followers.unshift(requesterId);

      // 2. Adım: Gönderici (requester) kullanıcısını bul
      const sender = await User.findById(requesterId);
      if (!sender) {
        return res.status(404).json({ error: "Sender not found" });
      }

      // Sender'ın sentFollowRequests arrayinde recipientId (userId) ile eşleşen isteği bul
      const sentRequestIndex = sender.sentFollowRequests.findIndex(
        (request) => request.recipient.toString() === userId
      );

      if (sentRequestIndex === -1) {
        return res.status(404).json({ error: "Sent follow request not found" });
      }

      // Follow isteğini sentFollowRequests arrayinden çıkar
      sender.sentFollowRequests.splice(sentRequestIndex, 1);

      // Recipient'i following arrayine ekle
      sender.following.unshift(userId);

      // Hem recipient hem de sender'ı kaydet
      await recipient.save();
      await sender.save();

      res
        .status(200)
        .json({ message: "Follow request accepted and followers updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
// reject
router.post(
  "/:userId/reject-follow-request/:requestId",
  authenticateToken,
  async (req, res) => {
    const { userId, requestId } = req.params;
    try {
      // 1. Adım: Recipient'i bul
      const recipient = await User.findById(userId);
      if (!recipient) {
        return res.status(404).json({ error: "Recipient not found" });
      }

      // Recipient'in receivedFollowRequests arrayinde requesterId ile eşleşen isteği bul
      const followRequestIndex = recipient.receivedFollowRequests.findIndex(
        (request) => request._id.toString() === requestId
      );

      if (followRequestIndex === -1) {
        return res.status(404).json({ error: "Follow request not found" });
      }

      const requesterId =
        recipient.receivedFollowRequests[
          followRequestIndex
        ].requester._id.toString();

      // Follow isteğini receivedFollowRequests arrayinden çıkar
      recipient.receivedFollowRequests.splice(followRequestIndex, 1);

      // 2. Adım: Gönderici (requester) kullanıcısını bul
      const sender = await User.findById(requesterId);
      if (!sender) {
        return res.status(404).json({ error: "Sender not found" });
      }

      // Sender'ın sentFollowRequests arrayinde recipientId (userId) ile eşleşen isteği bul
      const sentRequestIndex = sender.sentFollowRequests.findIndex(
        (request) => request.recipient.toString() === userId
      );

      if (sentRequestIndex === -1) {
        return res.status(404).json({ error: "Sent follow request not found" });
      }

      // Follow isteğini sentFollowRequests arrayinden çıkar
      sender.sentFollowRequests.splice(sentRequestIndex, 1);

      // Hem recipient hem de sender'ı kaydet
      await recipient.save();
      await sender.save();

      res
        .status(200)
        .json({ message: "Follow request accepted and followers updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
