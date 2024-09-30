const express = require("express");
const router = express();
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, profileController.handleProfile);

router.patch("/:userId/edit", authenticateToken, profileController.editProfile);

router.patch(
  "/:userId/birth-date/edit",
  authenticateToken,
  profileController.removeBirthDate
);

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

router.patch(
  "/add-profile-image",
  authenticateToken,
  profileController.handleProfilePicture
);

router.patch(
  "/add-profile-cover-image",
  authenticateToken,
  profileController.handleProfileCoverImage
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
