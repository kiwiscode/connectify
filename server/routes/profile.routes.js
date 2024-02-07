const express = require("express");
const router = express();
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, profileController.handleProfile);

router.get("/followers", authenticateToken, profileController.getFollowers);
router.get("/following", authenticateToken, profileController.getFollowing);

router.get(
  "/:id",
  authenticateToken,
  profileController.handleShowSpesificProfile
);
router.post(
  "/add-profile-image",
  authenticateToken,
  profileController.handleProfilePicture
);

module.exports = router;
