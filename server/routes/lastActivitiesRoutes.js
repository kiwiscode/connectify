const express = require("express");
const router = express();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
const Activity = require("../models/Activity.model");

router.get("/activities", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);

    const thePeopleFollowedByTheUser = user?.following.map((eachUser) => {
      return eachUser._id.toString();
    });

    Activity.find({
      thePersonWhoCarriedOutTheActivity: { $in: thePeopleFollowedByTheUser },
    })
      .populate("activityHasBeenInitiatedWith")
      .populate("thePersonWhoCarriedOutTheActivity")
      .populate("relatedPost")
      .populate({
        path: "relatedPost",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .populate({
        path: "relatedPost",
        populate: {
          path: "reposted",
          model: "User",
        },
      })
      .populate({
        path: "relatedPost",
        populate: {
          path: "likes",
          model: "User",
        },
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .then((activitiesCreatedByThePeopleFollowedByTheUser) => {
        res
          .status(200)
          .json({ activities: activitiesCreatedByThePeopleFollowedByTheUser });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json("Server error");
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json("Server error");
  }
});

module.exports = router;
