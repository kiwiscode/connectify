const express = require("express");
const router = express();
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, profileController.handleProfile);
router.get(
  "/:id",
  authenticateToken,
  profileController.handleShowSpesificProfile
);

router.post(
  "/delete-favorite",
  authenticateToken,
  profileController.handleDeleteFavorite
);

module.exports = router;
