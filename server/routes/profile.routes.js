const express = require("express");
const router = express();
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, profileController.handleProfile);

router.get(
  "/:userId/followers",
  authenticateToken,
  profileController.getFollowers
);
router.get(
  "/:userId/following",
  authenticateToken,
  profileController.getFollowing
);

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

router.get(
  "/forCreateChat/:userId",
  authenticateToken,
  profileController.handlecreateChatSpesificUserInformations
);

router.post(
  "/change-password",
  authenticateToken,
  profileController.handleChangePassword
);

router.post(
  "/deactivate-password-confirmation",
  authenticateToken,
  profileController.handleDeactivatePasswordConfirmation
);

router.post(
  "/deactivate-account",
  authenticateToken,
  profileController.handleDeactivateAccount
);

module.exports = router;
